import type { AuthSession } from "../types/auth";

const storageKey = "producthunter.auth.session";

type StoredAuthSession = {
  accessToken: string;
  expiresAt: string;
};

function isBrowser() {
  return typeof window !== "undefined" && Boolean(window.localStorage);
}

function readStoredSession(): StoredAuthSession | null {
  if (!isBrowser()) return null;

  try {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as Partial<StoredAuthSession>;
    if (!parsed.accessToken || !parsed.expiresAt) return null;

    return {
      accessToken: parsed.accessToken,
      expiresAt: parsed.expiresAt,
    };
  } catch {
    return null;
  }
}

export function getStoredAuthToken() {
  const stored = readStoredSession();
  if (!stored) return null;

  if (new Date(stored.expiresAt).getTime() <= Date.now()) {
    clearStoredAuthSession();
    return null;
  }

  return stored.accessToken;
}

export function storeAuthSession(session: AuthSession | null) {
  if (!isBrowser()) return;

  if (!session?.access_token) {
    return;
  }

  window.localStorage.setItem(
    storageKey,
    JSON.stringify({
      accessToken: session.access_token,
      expiresAt: session.expires_at,
    } satisfies StoredAuthSession),
  );
}

export function clearStoredAuthSession() {
  if (!isBrowser()) return;
  window.localStorage.removeItem(storageKey);
}
