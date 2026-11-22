
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

function getDashboardPath(role?: string) {
  if (role === "admin") return "/dashboard/admin";
  if (role === "technician") return "/dashboard/technician";
  return "/dashboard/customer";
}

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;

    async function redirectUser() {
      try {
        const session = await authClient.getSession();

        if (cancelled) return;

        const user = session.data?.user;

        if (!user) {
          router.replace("/sign-in");
          return;
        }

        const role = (user as typeof user & { role?: string }).role;

        const params = new URLSearchParams(window.location.search);
        const returnTo = params.get("returnTo");

        const safeReturnTo =
          returnTo && returnTo.startsWith("/") && !returnTo.startsWith("//")
            ? returnTo
            : null;

        router.replace(safeReturnTo ?? getDashboardPath(role));
      } catch {
        if (!cancelled) {
          router.replace("/sign-in");
        }
      }
    }

    redirectUser();

    return () => {
      cancelled = true;
    };
  }, [router]);

  return (
    <main className="flex min-h-screen items-center justify-center">
      <p>Completing sign in...</p>
    </main>
  );
}
