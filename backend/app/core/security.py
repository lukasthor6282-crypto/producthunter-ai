from __future__ import annotations

from collections import defaultdict, deque
from collections.abc import Awaitable, Callable
from time import monotonic
from threading import Lock

from fastapi import HTTPException, Request, Response, status
from starlette.responses import JSONResponse

from app.core.config import get_settings


SECURITY_HEADERS = {
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "Referrer-Policy": "no-referrer",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=(), payment=()",
    "Cross-Origin-Opener-Policy": "same-origin",
}


def add_security_headers(response: Response) -> None:
    settings = get_settings()
    for header, value in SECURITY_HEADERS.items():
        response.headers.setdefault(header, value)

    if settings.session_cookie_secure:
        response.headers.setdefault("Strict-Transport-Security", "max-age=31536000; includeSubDomains")


async def security_headers_middleware(
    request: Request,
    call_next: Callable[[Request], Awaitable[Response]],
) -> Response:
    response = await call_next(request)
    add_security_headers(response)
    return response


async def request_size_limit_middleware(
    request: Request,
    call_next: Callable[[Request], Awaitable[Response]],
) -> Response:
    max_request_body_bytes = get_settings().max_request_body_bytes
    content_length = request.headers.get("content-length")

    if content_length:
        try:
            request_size = int(content_length)
        except ValueError:
            request_size = 0

        if request_size > max_request_body_bytes:
            response = JSONResponse(
                status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                content={"detail": "Requisicao muito grande."},
            )
            add_security_headers(response)
            return response

    return await call_next(request)


def client_ip(request: Request) -> str:
    for header in ("cf-connecting-ip", "x-real-ip", "x-forwarded-for"):
        value = request.headers.get(header)
        if value:
            return value.split(",", 1)[0].strip()

    if request.client and request.client.host:
        return request.client.host

    return "unknown"


class InMemoryRateLimiter:
    def __init__(self, scope: str, limit: int, window_seconds: int) -> None:
        self.scope = scope
        self.limit = max(1, limit)
        self.window_seconds = max(1, window_seconds)
        self._hits: dict[str, deque[float]] = defaultdict(deque)
        self._lock = Lock()
        self._last_cleanup = monotonic()

    def _cleanup(self, window_start: float, now: float) -> None:
        if now - self._last_cleanup < self.window_seconds:
            return

        stale_keys: list[str] = []
        for key, hits in self._hits.items():
            while hits and hits[0] <= window_start:
                hits.popleft()
            if not hits:
                stale_keys.append(key)

        for key in stale_keys:
            self._hits.pop(key, None)

        self._last_cleanup = now

    def __call__(self, request: Request) -> None:
        now = monotonic()
        window_start = now - self.window_seconds
        key = f"{self.scope}:{client_ip(request)}"

        with self._lock:
            self._cleanup(window_start, now)
            hits = self._hits[key]
            while hits and hits[0] <= window_start:
                hits.popleft()

            if len(hits) >= self.limit:
                retry_after = max(1, int(self.window_seconds - (now - hits[0])))
                raise HTTPException(
                    status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                    detail="Muitas tentativas em pouco tempo. Tente novamente em instantes.",
                    headers={"Retry-After": str(retry_after)},
                )

            hits.append(now)
