export type AuthUser = {
  id: number;
  email: string;
  name: string | null;
  picture_url: string | null;
  email_verified: boolean;
  is_admin: boolean;
  created_at: string;
  last_login_at: string | null;
};

export type AuthConfig = {
  google_client_id: string | null;
  google_auth_enabled: boolean;
  session_cookie_secure: boolean;
  database_engine: string;
};

export type AuthSession = {
  user: AuthUser;
  expires_at: string;
  access_token?: string | null;
};

export type SecurityAuditEvent = {
  id: number;
  event_type: string;
  status: string;
  email: string | null;
  ip_address: string | null;
  user_agent: string | null;
  details: Record<string, unknown>;
  created_at: string;
};

export type SecurityAuditEventsResponse = {
  items: SecurityAuditEvent[];
};

export type SecuritySession = {
  id: number;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
  last_seen_at: string | null;
  expires_at: string;
  is_current: boolean;
};

export type SecuritySessionsResponse = {
  items: SecuritySession[];
};

export type RevokeSecuritySessionResponse = {
  revoked_count: number;
};

export type GoogleCredentialResponse = {
  credential?: string;
  select_by?: string;
};
