import { API_BASE_URL } from "@/config";
import { getToken } from "@/config/storage";

export type DashboardDay = {
  date: string;
  weekday: string; // e.g. Mon, Tue
  count: number;
};

export type DashboardStats = {
  totalUser: number;
  totalPost: number;
  totalReport: number;
  totalGroup: number;
  days: DashboardDay[];
};

export type DashboardStatsResponse = {
  message: string;
  data: DashboardStats;
};

export async function getDashboardStats(): Promise<DashboardStats> {
  const token = getToken();
  if (!token) {
    throw new Error("Not authenticated");
  }

  const res = await fetch(`${API_BASE_URL}/admin/dashboard-stats`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    let msg = "Failed to fetch dashboard stats";
    try {
      const body = await res.json();
      msg = body?.message || msg;
    } catch {}
    throw new Error(msg);
  }

  const json = (await res.json()) as DashboardStatsResponse;
  return json.data;
}
