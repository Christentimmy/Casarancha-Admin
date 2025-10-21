import { API_BASE_URL } from "@/config";
import { getToken } from "@/config/storage";

export type AuthorSummary = {
  id: string;
  displayName: string;
  username: string;
  avatarUrl: string | null;
  isBanned: boolean;
};

export type MediaItem = {
  url?: string;
  type?: string;
  [key: string]: unknown;
};

export type PollOption = {
  id: string;
  text: string;
  voteCount: number;
};

export type Poll = {
  question: string;
  options: PollOption[];
  allowMultipleChoices: boolean;
  totalVotes: number;
  isActive: boolean;
  hasVoted: boolean;
  selectedOptionId: string;
};

export type Repost = {
  id: string;
  content: string | null;
  authorId: AuthorSummary;
  media: MediaItem[] | null;
  poll?: Poll | null;
  createdAt: string;
  updatedAt: string;
};

export type PostItem = {
  id: string;
  content: string | null;
  authorId: AuthorSummary;
  media: MediaItem[] | null;
  poll?: Poll | null;
  createdAt: string;
  updatedAt: string;
  originalPostId?: Repost | null;
};

export type PostsPagination = {
  page: number;
  limit: number;
  total: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

export type GetAllPostsResponse = {
  message: string;
  data: PostItem[];
  pagination: PostsPagination;
};

export async function getAllPosts(params: { page?: number; limit?: number } = {}) {
  const token = getToken();
  if (!token) throw new Error("Not authenticated");

  const { page = 1, limit = 40 } = params;
  const qs = new URLSearchParams();
  qs.set("page", String(page));
  qs.set("limit", String(limit));

  const res = await fetch(`${API_BASE_URL}/admin/get-all-posts?${qs.toString()}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    let msg = "Failed to fetch posts";
    try {
      const body = await res.json();
      msg = body?.message || msg;
    } catch {}
    throw new Error(msg);
  }

  const json = (await res.json()) as GetAllPostsResponse;
  return json;
}

export async function deletePost(postId: string) {
  const token = getToken();
  if (!token) throw new Error("Not authenticated");

  const res = await fetch(`${API_BASE_URL}/admin/delete-post/${postId}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    let msg = "Failed to delete post";
    try {
      const body = await res.json();
      msg = body?.message || msg;
    } catch {}
    throw new Error(msg);
  }

  return await res.json();
}
