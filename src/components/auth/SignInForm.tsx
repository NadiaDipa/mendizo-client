"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

import {
  AUTH_FOCUS,
  PasswordField,
  SubmitButton,
  TextField,
} from "./FormControls";

import { CheckIcon, LockIcon, MailIcon } from "./AuthIcons";
import { hasErrors, isValidEmail } from "@/lib/validation";
import type { FormErrors } from "@/lib/validation";
import { authClient } from "@/lib/auth-client";

type Field = "email" | "password";

const LINK =
  "font-semibold text-primary underline-offset-4 transition-colors hover:text-[color-mix(in_oklab,var(--color-primary),black_14%)] hover:underline dark:text-sky dark:hover:text-on-dark";

function getDashboardPath(role?: string) {
  if (role === "technician") return "/dashboard/technician";
  if (role === "admin") return "/dashboard/admin";
  return "/dashboard/customer";
}

export default function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [errors, setErrors] = useState<FormErrors<Field>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  function clearError(field: Field) {
    setErrors((previous) => {
      if (!previous[field]) return previous;

      const next = { ...previous };
      delete next[field];
      return next;
    });
  }

  function getReturnTo() {
    const returnTo =
      searchParams.get("returnTo") ||
      searchParams.get("redirect") ||
      searchParams.get("callbackUrl");

    return returnTo?.startsWith("/") && !returnTo.startsWith("//")
      ? returnTo
      : null;
  }

  async function handleGoogleSignIn() {
    setIsGoogleLoading(true);

    try {
      const returnTo = getReturnTo();

      // Client ও server আলাদা domain-এ, তাই client-এর পুরো origin দিতে হবে
      const origin = window.location.origin;

      const callbackURL = returnTo
        ? `${origin}/auth/callback?returnTo=${encodeURIComponent(returnTo)}`
        : `${origin}/auth/callback`;

      const { error } = await authClient.signIn.social({
        provider: "google",
        callbackURL,
      });

      if (error) {
        toast.error(error.message || "Google sign-in failed.");
        setIsGoogleLoading(false);
      }
    } catch {
      toast.error("Unable to sign in with Google. Please try again.");
      setIsGoogleLoading(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const formDataObj = Object.fromEntries(formData.entries());

    const email = String(formDataObj.email || "").trim();
    const password = String(formDataObj.password || "");
    const rememberMe = formDataObj.remember === "on";

    const nextErrors: FormErrors<Field> = {};

    if (!email) {
      nextErrors.email = "Enter your email address.";
    } else if (!isValidEmail(email)) {
      nextErrors.email = "Enter a valid email address, like name@example.com.";
    }

    if (!password) {
      nextErrors.password = "Enter your password.";
    }

    setErrors(nextErrors);

    if (hasErrors(nextErrors)) {
      const firstInvalid = Object.keys(nextErrors)[0];

      if (firstInvalid) {
        document.getElementById(firstInvalid)?.focus();
      }

      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await authClient.signIn.email({
        email,
        password,
        rememberMe,
      });

      if (error) {
        toast.error(
          error.message || "Sign in failed. Please check your credentials."
        );
        return;
      }

      toast.success("Welcome back to Mendizo!");

      const returnTo = getReturnTo();

      if (returnTo) {
        router.push(returnTo);
        router.refresh();
        return;
      }

      const sessionRes = await authClient.getSession();
      const userRole = (sessionRes?.data?.user as { role?: string })?.role;

      router.push(getDashboardPath(userRole));
      router.refresh();
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div>
      <header>
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary dark:text-sky">
          Mendizo account
        </p>

        <h1 className="mt-3 font-display text-[clamp(2rem,5.4vw,2.6rem)] leading-[1.08] tracking-tight text-foreground">
          Welcome Back
        </h1>

        <p className="mt-2 max-w-[26rem] text-[14.5px] leading-6 text-foreground/60">
          Sign in to manage your bookings, follow every repair and keep your
          service history in one place.
        </p>
      </header>

      <form noValidate onSubmit={handleSubmit} className="mt-6 space-y-4">
        <TextField
          id="email"
          name="email"
          label="Email address"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="you@example.com"
          icon={<MailIcon className="h-[18px] w-[18px]" />}
          value={email}
          error={errors.email}
          onChange={(event) => {
            setEmail(event.target.value);
            clearError("email");
          }}
        />

        <PasswordField
          id="password"
          name="password"
          label="Password"
          autoComplete="current-password"
          placeholder="Enter your password"
          icon={<LockIcon className="h-[18px] w-[18px]" />}
          value={password}
          error={errors.password}
          onChange={(event) => {
            setPassword(event.target.value);
            clearError("password");
          }}
        />

        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <label className="flex cursor-pointer items-center gap-2.5 text-[13px] font-medium text-foreground/70 select-none">
            <input
              type="checkbox"
              name="remember"
              checked={rememberMe}
              onChange={(event) => setRememberMe(event.target.checked)}
              className="peer sr-only"
            />

            <span
              aria-hidden="true"
              className="grid h-[18px] w-[18px] place-items-center rounded-[6px] border border-foreground/25 bg-white text-primary-foreground transition-colors duration-200 peer-checked:border-primary peer-checked:bg-primary peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-sky dark:border-white/25 dark:bg-white/5"
            >
              {rememberMe ? <CheckIcon className="h-3 w-3" /> : null}
            </span>

            Remember me
          </label>

          <button
            type="button"
            onClick={() => {
              toast("Password reset isn't available yet.", {
                icon: "ℹ️",
              });
            }}
            className={`text-[13px] ${LINK} ${AUTH_FOCUS}`}
          >
            Forgot password?
          </button>
        </div>

        <div className="pt-1">
          <SubmitButton loading={isSubmitting} loadingLabel="Signing in…">
            Sign In
          </SubmitButton>
        </div>
      </form>

      <div className="relative my-5 flex items-center">
        <div className="flex-grow border-t border-foreground/10" />
        <span className="mx-3 text-xs text-foreground/45">OR CONTINUE WITH</span>
        <div className="flex-grow border-t border-foreground/10" />
      </div>

      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={isGoogleLoading || isSubmitting}
        className="flex w-full items-center justify-center gap-3 rounded-xl border border-foreground/15 bg-background px-4 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-foreground/5 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isGoogleLoading ? (
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : (
          <svg viewBox="0 0 48 48" className="h-5 w-5" aria-hidden="true">
            <path
              fill="#EA4335"
              d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 3.12 13.22l7.98 6.19C13 13.72 18.1 9.5 24 9.5Z"
              transform="translate(0 5)"
            />
            <path
              fill="#4285F4"
              d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.77 7.18l7.73 6C44.41 38.08 46.98 31.84 46.98 24.55Z"
            />
            <path
              fill="#FBBC05"
              d="M10.64 28.59A14.4 14.4 0 0 1 9.88 24c0-1.59.27-3.13.76-4.59l-7.98-6.19A23.9 23.9 0 0 0 0 24c0 3.87.93 7.53 2.66 10.78l7.98-6.19Z"
              transform="translate(0 5)"
            />
            <path
              fill="#34A853"
              d="M24 48c6.48 0 11.93-2.13 15.9-5.8l-7.73-6c-2.14 1.44-4.87 2.3-8.17 2.3-5.9 0-11-3.98-12.8-9.34l-7.98 6.19C6.51 43.62 14.62 48 24 48Z"
              transform="translate(0 -5)"
            />
          </svg>
        )}

        {isGoogleLoading ? "Connecting to Google…" : "Continue with Google"}
      </button>

      <p className="mt-5 border-t border-foreground/10 pt-4 text-center text-[13.5px] text-foreground/60">
        New to Mendizo?{" "}
        <Link href="/sign-up" className={LINK}>
          Create an account
        </Link>
      </p>
    </div>
  );
}