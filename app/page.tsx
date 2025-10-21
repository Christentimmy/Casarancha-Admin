"use client";

import Image from "next/image";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getToken } from "@/config/storage";
import { validateToken } from "@/data/auth";

export default function Splash() {
  const router = useRouter();

  useEffect(() => {
    let mounted = true;
    const run = async () => {
      const token = getToken();
      if (!token) {
        if (mounted) router.replace("/login");
        return;
      }
      const ok = await validateToken(token);
      if (mounted) router.replace(ok ? "/dashboard" : "/login");
    };
    // small delay for splash effect
    const t = setTimeout(run, 400);
    return () => {
      mounted = false;
      clearTimeout(t);
    };
  }, [router]);

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center bg-gradient-to-br from-primary/10 via-accent/10 to-muted/20">
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-primary/20 blur-3xl rounded-full animate-pulse" />
      <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-accent/20 blur-3xl rounded-full animate-pulse" />

      <div className="relative z-10 flex flex-col items-center gap-6">
        <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center shadow-sm ring-1 ring-border">
          <Image src="/logo.png" alt="Casarancha" width={56} height={56} className="rounded" />
        </div>
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <span className="inline-block h-4 w-4 rounded-full border-2 border-foreground/40 border-t-transparent animate-spin" />
          <span>Preparing your dashboard...</span>
        </div>
      </div>
    </div>
  );
}
