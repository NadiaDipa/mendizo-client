import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import ProfileCard from "@/components/profile/ProfileCard";
import ProfileInfoSection from "@/components/profile/ProfileInfoSection";

export const metadata: Metadata = {
  title: "My Profile — Mendizo",
  description: "View and update your Mendizo profile information.",
};

export default async function DashboardProfilePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  const user = session.user;

  return (
    <div className="space-y-8">
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary dark:text-sky">
          Account
        </p>

        <h1 className="mt-1.5 font-display text-2xl sm:text-3xl font-bold tracking-tight text-navy dark:text-on-dark">
          My Profile
        </h1>

        <p className="mt-1 text-xs sm:text-sm text-foreground/55">
          Manage your personal information, contact number, area, and bio.
        </p>
      </div>

      <div className="grid items-start gap-6 md:grid-cols-[280px_1fr] lg:grid-cols-[300px_1fr] xl:grid-cols-[320px_1fr]">
        <ProfileCard user={user} />
        <ProfileInfoSection user={user} />
      </div>
    </div>
  );
}
