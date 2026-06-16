import { apiRequest } from "./api";

export type AdminOverview = {
  total_users: number;
  active_users: number;
  admin_users: number;
  total_recommendation_runs: number;
};

export type AdminUser = {
  id: number;
  email: string;
  name: string | null;
  email_verified: boolean;
  is_active: boolean;
  is_admin: boolean;
  created_at: string;
  last_login_at: string | null;
};

export type AdminUsersResponse = {
  items: AdminUser[];
};

export type AdminUserUpdate = {
  is_active?: boolean;
  is_admin?: boolean;
};

export function getAdminOverview() {
  return apiRequest<AdminOverview>("/admin/overview");
}

export function getAdminUsers() {
  return apiRequest<AdminUsersResponse>("/admin/users");
}

export function updateAdminUser(userId: number, payload: AdminUserUpdate) {
  return apiRequest<AdminUser>(`/admin/users/${userId}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}
