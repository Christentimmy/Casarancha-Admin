import { API_BASE_URL } from "@/config";
import { getToken } from "@/config/storage";

export interface UserSummary {
  id: string;
  displayName: string;
  username: string;
  avatarUrl: string | null;
  isBanned: boolean;
}

export interface MediaItem {
  type: "image" | "video" | "audio";
  url: string;
  thumbnailUrl?: string;
  duration?: number;
  size?: number;
  dimensions?: {
    width: number;
    height: number;
  };
  metadata?: {
    format?: string | null;
    quality?: string | null;
    isProcessed?: boolean;
  };
}

export interface PollOption {
  id: string;
  text: string;
  voteCount: number;
}

export interface Poll {
  question: string;
  options: PollOption[];
  allowMultipleChoices: boolean;
  totalVotes: number;
  isActive: boolean;
  hasVoted: boolean;
  selectedOptionId: string;
}

export interface PostReference {
  id: string;
  content: any; // Can be string or rich text object
  authorId: UserSummary;
  media: MediaItem[];
  poll?: Poll;
  createdAt: string;
  updatedAt: string;
}

export interface ReportItem {
  id: string;
  reporter: UserSummary;
  reportedUser: UserSummary;
  description: string;
  type: 'post' | 'user' | 'comment' | 'other';
  reference?: PostReference | UserSummary | any; // Dynamic based on type
  status: 'pending' | 'reviewed' | 'dismissed' | 'action_taken';
  createdAt: string;
}

export interface ReportsResponse {
  message: string;
  data: ReportItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export async function getAllReports(params: { 
  page?: number; 
  limit?: number;
  status?: 'pending' | 'reviewed' | 'dismissed' | 'action_taken';
} = {}): Promise<ReportsResponse> {
  const token = getToken();
  if (!token) throw new Error("Not authenticated");

  const { page = 1, limit = 40, status } = params;
  const qs = new URLSearchParams();
  qs.set("page", String(page));
  qs.set("limit", String(limit));
  if (status) qs.set("status", status);

  const res = await fetch(`${API_BASE_URL}/admin/get-all-reports?${qs.toString()}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    let msg = "Failed to fetch reports";
    try {
      const body = await res.json();
      msg = body?.message || msg;
    } catch {}
    throw new Error(msg);
  }

  return await res.json();
}

export async function updateReportStatus(
  reportId: string, 
  status: 'pending' | 'reviewed' | 'dismissed' | 'action_taken'
): Promise<{ message: string }> {
  const token = getToken();
  if (!token) throw new Error("Not authenticated");

  const res = await fetch(`${API_BASE_URL}/admin/update-report`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ id: reportId, status }),
  });

  if (!res.ok) {
    let msg = "Failed to update report";
    try {
      const body = await res.json();
      msg = body?.message || msg;
    } catch {}
    throw new Error(msg);
  }

  return await res.json();
}
