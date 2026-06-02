const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000";

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

export async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    ...init,
  });

  if (!response.ok) {
    const body = await response.text();
    const detail = parseErrorDetail(body);

    if (response.status === 401 && typeof window !== "undefined") {
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
