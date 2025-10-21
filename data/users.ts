import { API_BASE_URL } from "@/config";
import { getToken } from "@/config/storage";

export type UserSummary = {
  id: string;
  email: string;
  createdAt: string; // ISO string
  isBanned: boolean;
  avatarUrl: string | null;
  displayName: string;
  username: string;
};

export type Pagination = {
  page: number;
  limit: number;
  total: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

export type GetAllUsersResponse = {
  message: string;
  data: UserSummary[];
  pagination: Pagination;
};

export type GetAllUsersParams = {
  page?: number;
  limit?: number;
  search?: string; // optional, if backend supports
};

export async function getAllUsers(params: GetAllUsersParams = {}) {
  const token = getToken();
  if (!token) throw new Error("Not authenticated");

  const { page = 1, limit = 40, search } = params;
  const query = new URLSearchParams();
  query.set("page", String(page));
  query.set("limit", String(limit));
  if (search) query.set("search", search);

  const res = await fetch(
    `${API_BASE_URL}/admin/get-all-users?${query.toString()}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    }
  );

  if (!res.ok) {
    let msg = "Failed to fetch users";
    try {
      const body = await res.json();
      msg = body?.message || msg;
    } catch {}
    throw new Error(msg);
  }

  const json = (await res.json()) as GetAllUsersResponse;
  return json;
}

export type SearchUsersParams = {
  query: string;
  page?: number;
  limit?: number;
};
export type SearchUsersResponse = {
  message: string;
  data: UserSummary[];
  pagination?: Pagination;
};

export async function searchUsers(
  queryOrParams: string | SearchUsersParams
): Promise<SearchUsersResponse> {
  const token = getToken();
  if (!token) throw new Error("Not authenticated");

  const qs = new URLSearchParams();
  if (typeof queryOrParams === "string") {
    qs.set("query", queryOrParams);
  } else {
    qs.set("query", queryOrParams.query);
    if (queryOrParams.page) qs.set("page", String(queryOrParams.page));
    if (queryOrParams.limit) qs.set("limit", String(queryOrParams.limit));
  }

  const res = await fetch(
    `${API_BASE_URL}/admin/search-users?${qs.toString()}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    }
  );

  if (!res.ok) {
    let msg = "Failed to search users";
    try {
      const body = await res.json();
      msg = body?.message || msg;
    } catch {}
    throw new Error(msg);
  }

  const json = (await res.json()) as SearchUsersResponse;
  return json;
}

export async function toggleBan(userId: string): Promise<void> {
  const token = getToken();
  if (!token) throw new Error("Not authenticated");

  const res = await fetch(`${API_BASE_URL}/admin/toggle-ban/${userId}`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    let msg = "Failed to toggle ban";
    try {
      const body = await res.json();
      msg = body?.message || msg;
    } catch {}
    throw new Error(msg);
  }
}
