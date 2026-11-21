import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export const metadata = {
  title: "Dashboard — Mendizo",
  description: "Redirecting to your Mendizo dashboard...",
};

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in?returnTo=/dashboard");
  }

  const role = (session.user as { role?: string })?.role || "customer";

  if (role === "admin") {
    redirect("/dashboard/admin");
  } else if (role === "technician") {
    redirect("/dashboard/technician");
  } else {
    redirect("/dashboard/customer");
  }
}
