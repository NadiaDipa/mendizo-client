
import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProfileCard from "@/components/profile/ProfileCard";
import ProfileInfoSection from "@/components/profile/ProfileInfoSection";

export const metadata: Metadata = {
  title: "My Profile — Mendizo",
  description:
    "View and manage your Mendizo profile. Update your personal information, photo, and account preferences.",
};

export default async function ProfilePage() {
  // Get the currently logged-in user's session
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Redirect to sign-in if the user is not logged in
  if (!session) {
    redirect("/sign-in");
  }

  const user = session.user;

  return (
    <main className="relative flex min-h-screen flex-col bg-background">
      <Navbar />

      <div className="flex-1 pt-24 pb-16 sm:pt-28">
        <div className="mx-auto max-w-5xl px-5 sm:px-8">
          <div className="mb-8">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary dark:text-sky">
              Account
            </p>

            <h1 className="mt-1.5 font-display text-[clamp(1.6rem,4vw,2.4rem)] leading-tight tracking-tight text-navy dark:text-on-dark">
              My Profile
            </h1>

            <p className="mt-1.5 text-[14px] text-foreground/55">
              Manage your personal information and account settings.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-[280px_1fr] lg:grid-cols-[300px_1fr] xl:grid-cols-[320px_1fr]">
            <ProfileCard user={user} />

            <ProfileInfoSection user={user} />
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
