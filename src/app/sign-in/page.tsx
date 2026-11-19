import type { Metadata } from "next";
import AuthShell from "@/components/auth/AuthShell";
import SignInForm from "@/components/auth/SignInForm";

export const metadata: Metadata = {
  title: "Sign In — Mendizo",
  description:
    "Sign in to your Mendizo account to track repair bookings, follow every step and pay after the job is done.",
};

export default function SignInPage() {
  return (
    <AuthShell variant="sign-in">
      <SignInForm />
    </AuthShell>
  );
}
