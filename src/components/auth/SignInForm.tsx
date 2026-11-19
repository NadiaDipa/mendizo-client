
"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

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

export default function SignInForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [errors, setErrors] = useState<FormErrors<Field>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  function clearError(field: Field) {
    setErrors((previous) => {
      if (!previous[field]) return previous;

      const next = { ...previous };
      delete next[field];
      return next;
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // Collect form data and convert it into an object
    const formData = new FormData(event.currentTarget);
    const formDataObj = Object.fromEntries(formData.entries());

    const email = String(formDataObj.email || "").trim();
    const password = String(formDataObj.password || "");
    const rememberMe = formDataObj.remember === "on";

    // Validate form data
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

    // Sign in using Better Auth
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

      router.push("/");
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

      <p className="mt-5 border-t border-foreground/10 pt-4 text-center text-[13.5px] text-foreground/60">
        New to Mendizo?{" "}
        <Link href="/sign-up" className={LINK}>
          Create an account
        </Link>
      </p>
    </div>
  );
}
