export type AuthUser = {
  id: number;
  email: string;
  name: string | null;
  picture_url: string | null;
  email_verified: boolean;
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

export type GoogleCredentialResponse = {
  credential?: string;
  select_by?: string;
};
