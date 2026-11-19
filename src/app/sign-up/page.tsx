import type { Metadata } from "next";
import AuthShell from "@/components/auth/AuthShell";
import SignUpForm from "@/components/auth/SignUpForm";

export const metadata: Metadata = {
  title: "Create Your Account — Mendizo",
  description:
    "Create a Mendizo account as a customer or technician to book verified repair services and track every job.",
};

export default function SignUpPage() {
  return (
    <AuthShell variant="sign-up">
      <SignUpForm />
    </AuthShell>
  );
}
