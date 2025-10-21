import { API_BASE_URL } from "@/config";

export type LoginResponse = {
  message: string;
  token: string;
};

export async function loginAdmin(email: string, password: string): Promise<LoginResponse> {
  const res = await fetch(`${API_BASE_URL}/admin/login-admin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    let errorMessage = "Login failed";
    try {
      const err = await res.json();
      errorMessage = err?.message || errorMessage;
    } catch {}
    throw new Error(errorMessage);
  }

  const data = (await res.json()) as LoginResponse;
  return data;
}

export async function validateToken(token: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE_URL}/admin/validate-token`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });
    return res.status === 200;
  } catch {
    return false;
  }
}
