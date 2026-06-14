import { clearStoredAuthSession, getStoredAuthToken } from "./authToken";

const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000";
const DEFAULT_REQUEST_TIMEOUT_MS = 12_000;

type ApiRequestInit = RequestInit & {
  timeoutMs?: number;
};

export class ApiError extends Error {
  status: number;
  body: string;
  detail: unknown;

  constructor(status: number, body: string, detail?: unknown) {
    super(formatApiErrorMessage(status, body, detail));
    this.name = "ApiError";
    this.status = status;
    this.body = body;
    this.detail = detail;
  }
}

export const AUTH_REQUIRED_EVENT = "producthunter:auth-required";

function parseErrorDetail(body: string): unknown {
  if (!body) return null;

  try {
    const parsed = JSON.parse(body) as { detail?: unknown };
    return parsed.detail ?? parsed;
  } catch {
    return body;
  }
}

function formatApiErrorMessage(status: number, body: string, detail?: unknown): string {
  if (typeof detail === "string" && detail.trim()) {
    return detail;
  }

  if (detail && typeof detail === "object" && "message" in detail) {
    const message = (detail as { message?: unknown }).message;
    if (typeof message === "string" && message.trim()) {
      return message;
    }
  }

  return body || `API error ${status}`;
}

export function isUnauthorizedError(error: unknown): error is ApiError {
  return error instanceof ApiError && error.status === 401;
}

export function getApiErrorDetail(error: unknown): Record<string, unknown> | null {
  if (!(error instanceof ApiError) || !error.detail || typeof error.detail !== "object") {
    return null;
  }
  return error.detail as Record<string, unknown>;
}

export function getApiErrorCode(error: unknown) {
  const detail = getApiErrorDetail(error);
  const code = detail?.code;
  return typeof code === "string" ? code : null;
}

export function isPlanLimitError(error: unknown): error is ApiError {
  if (!(error instanceof ApiError)) {
    return false;
  }

  const code = getApiErrorCode(error);
  return (
    error.status === 402 ||
    code === "PLAN_MONTHLY_LIMIT_REACHED" ||
    code === "PLAN_RESULT_LIMIT_EXCEEDED"
  );
}

export async function apiRequest<T>(path: string, init?: ApiRequestInit): Promise<T> {
  const { timeoutMs = DEFAULT_REQUEST_TIMEOUT_MS, signal, ...requestInit } = init ?? {};
  const headers = new Headers(init?.headers);
  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const storedAuthToken = getStoredAuthToken();
  if (storedAuthToken && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${storedAuthToken}`);
  }

  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), timeoutMs);
  if (signal) {
    if (signal.aborted) {
      controller.abort();
    } else {
      signal.addEventListener("abort", () => controller.abort(), { once: true });
    }
  }

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...requestInit,
      credentials: "include",
      headers,
      signal: controller.signal,
    });
  } catch (error) {
    if (controller.signal.aborted) {
      throw new ApiError(408, "O backend demorou para responder. Tente novamente em alguns segundos.");
    }
    throw error;
  } finally {
    window.clearTimeout(timeoutId);
  }

  if (!response.ok) {
    const body = await response.text();
    const detail = parseErrorDetail(body);

    if (response.status === 401 && typeof window !== "undefined") {
      clearStoredAuthSession();
      window.dispatchEvent(new CustomEvent(AUTH_REQUIRED_EVENT, { detail: { path } }));
    }

    throw new ApiError(response.status, body, detail);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export { API_BASE_URL };
