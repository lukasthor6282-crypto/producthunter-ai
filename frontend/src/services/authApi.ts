import { ApiError, apiRequest } from "./api";
import type {
  AuthConfig,
  AuthSession,
  RevokeSecuritySessionResponse,
  SecurityAuditEventsResponse,
  SecuritySessionsResponse,
} from "../types/auth";

const AUTH_CONFIG_TIMEOUT_MS = 25_000;
const AUTH_CONFIG_RETRY_DELAYS_MS = [1_200, 2_500, 4_000, 6_000];

function sleep(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function isBackendStartupError(error: unknown) {
  return error instanceof ApiError && error.status === 408;
}

export async function getAuthConfig() {
  let lastError: unknown;

  for (let attempt = 0; attempt <= AUTH_CONFIG_RETRY_DELAYS_MS.length; attempt += 1) {
    try {
      return await apiRequest<AuthConfig>("/auth/config", { timeoutMs: AUTH_CONFIG_TIMEOUT_MS });
    } catch (error) {
      lastError = error;
      if (!isBackendStartupError(error) || attempt >= AUTH_CONFIG_RETRY_DELAYS_MS.length) {
        break;
      }
      await sleep(AUTH_CONFIG_RETRY_DELAYS_MS[attempt]);
    }
  }

  if (lastError instanceof ApiError && lastError.status === 408) {
    throw new Error("O backend de login ainda esta iniciando. Tente novamente em alguns segundos.");
  }

  throw lastError;
}

export async function getCurrentSession() {
  try {
    return await apiRequest<AuthSession>("/auth/me", { timeoutMs: 30_000 });
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      return null;
    }
    throw error;
  }
}

export function loginWithGoogleCredential(credential: string) {
  return apiRequest<AuthSession>("/auth/google", {
    method: "POST",
    body: JSON.stringify({ credential }),
  });
}

export function logoutSession() {
  return apiRequest<void>("/auth/logout", { method: "POST" });
}

export function getSecurityAuditEvents(limit = 20) {
  return apiRequest<SecurityAuditEventsResponse>(`/auth/security-events?limit=${limit}`);
}

export function getSecuritySessions() {
  return apiRequest<SecuritySessionsResponse>("/auth/sessions");
}

export function revokeSecuritySession(sessionId: number) {
  return apiRequest<RevokeSecuritySessionResponse>(`/auth/sessions/${sessionId}`, { method: "DELETE" });
}

export function revokeOtherSecuritySessions() {
  return apiRequest<RevokeSecuritySessionResponse>("/auth/sessions", { method: "DELETE" });
}
