import { ApiError, apiRequest } from "./api";
import type {
  AuthConfig,
  AuthSession,
  RevokeSecuritySessionResponse,
  SecurityAuditEventsResponse,
  SecuritySessionsResponse,
} from "../types/auth";

export function getAuthConfig() {
  return apiRequest<AuthConfig>("/auth/config");
}

export async function getCurrentSession() {
  try {
    return await apiRequest<AuthSession>("/auth/me");
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
