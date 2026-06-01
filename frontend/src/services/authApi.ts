import { ApiError, apiRequest } from "./api";
import type { AuthConfig, AuthSession } from "../types/auth";

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
