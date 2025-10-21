"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { loginAdmin } from "@/data/auth";
import { setToken } from "@/config/storage";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;
    setError(null);
    setLoading(true);
    loginAdmin(email, password)
      .then(({ token }) => {
        setToken(token);
        router.replace("/dashboard");
      })
      .catch((err: unknown) => {
        const message = err instanceof Error ? err.message : "Login failed";
        setError(message);
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      <div className="hidden lg:flex items-center justify-center bg-card p-12">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Image src="/logo.png" alt="Casarancha" width={40} height={40} className="rounded" />
          </div>
          <h1 className="text-2xl font-semibold text-foreground">Welcome to Casarancha Admin</h1>
          <p className="text-muted-foreground">
            Manage users, posts, reports, and settings from a single place.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center p-6 sm:p-8">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <Image src="/logo.png" alt="Casarancha" width={32} height={32} className="rounded" />
            <span className="text-base font-semibold text-primary leading-none">Casarancha</span>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm">
            <div className="space-y-2 mb-6">
              <h2 className="text-xl font-semibold">Sign in</h2>
              <p className="text-sm text-muted-foreground">Enter your credentials to access the dashboard.</p>
            </div>

            <form className="space-y-5" onSubmit={onSubmit}>
              {error && (
                <div className="rounded-xl border border-destructive/30 bg-destructive/10 text-destructive px-4 py-3 text-sm">
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">Email</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">Password</label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                  required
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="inline-flex items-center gap-2 text-sm text-muted-foreground select-none">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="h-4 w-4 rounded border-input text-primary focus:ring-ring"
                  />
                  Remember me
                </label>
                <Link href="#" className="text-sm text-primary hover:underline">Forgot password?</Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-primary text-primary-foreground py-3 text-sm font-medium shadow hover:opacity-95 transition-opacity disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading && (
                  <span className="inline-block h-4 w-4 rounded-full border-2 border-primary-foreground/50 border-t-transparent animate-spin" />
                )}
                {loading ? "Signing in..." : "Continue"}
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-muted-foreground">
              Don't have an account? <span className="text-foreground">Contact your administrator.</span>
            </div>
          </div>

          <p className="mt-6 text-xs text-center text-muted-foreground">&copy; {new Date().getFullYear()} Casarancha</p>
        </div>
      </div>
    </div>
  );
}
