
"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { FormEvent, RefObject } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { PasswordField, SubmitButton, TextField } from "./FormControls";

import {
  AlertIcon,
  CheckIcon,
  HomeIcon,
  LockIcon,
  MailIcon,
  UserIcon,
  WrenchIcon,
} from "./AuthIcons";

import {
  PASSWORD_RULES,
  hasErrors,
  isValidEmail,
  meetsAllPasswordRules,
} from "@/lib/validation";

import type { FormErrors } from "@/lib/validation";
import { authClient } from "@/lib/auth-client";

type Field = "name" | "email" | "password" | "role";
type Role = "customer" | "technician";

const ROLE_OPTIONS: {
  value: Role;
  label: string;
  description: string;
  Icon: typeof HomeIcon;
}[] = [
  {
    value: "customer",
    label: "Customer",
    description: "For your home & devices.",
    Icon: HomeIcon,
  },
  {
    value: "technician",
    label: "Technician",
    description: "For repair professionals.",
    Icon: WrenchIcon,
  },
];

const FIELD_SCALE =
  "[&_label]:text-[15px] [&_label]:font-semibold [&_label]:text-foreground [&_input]:h-[54px] [&_input]:text-[16px] [&_input]:font-medium [&_input]:text-foreground [&_input]:placeholder:text-foreground/55 [&_p]:text-[14px]";

const USE_WIDER_CARD = true;
const CARD_MAX_WIDTH = "34rem";

const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

function useWiderCard(ref: RefObject<HTMLElement | null>) {
  useIsoLayoutEffect(() => {
    if (!USE_WIDER_CARD) return;

    let node = ref.current?.parentElement ?? null;

    for (let depth = 0; node && depth < 8; depth += 1) {
      const maxWidth = window.getComputedStyle(node).maxWidth;
      const px = maxWidth.endsWith("px") ? parseFloat(maxWidth) : NaN;

      if (!Number.isNaN(px) && px >= 300 && px <= 560) {
        const target = node;
        const previous = target.style.maxWidth;
        target.style.maxWidth = CARD_MAX_WIDTH;

        return () => {
          target.style.maxWidth = previous;
        };
      }

      node = node.parentElement;
    }
  }, [ref]);
}

const LINK =
  "font-semibold text-primary underline-offset-4 transition-colors hover:text-[color-mix(in_oklab,var(--color-primary),black_14%)] hover:underline dark:text-sky dark:hover:text-on-dark";

export default function SignUpForm() {
  const router = useRouter();
  const rootRef = useRef<HTMLDivElement>(null);
  useWiderCard(rootRef);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role | null>(null);

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

  async function handleGoogleSignIn() {
    setIsGoogleLoading(true);

    try {
      const { error } = await authClient.signIn.social({
        provider: "google",
        callbackURL: "/auth/callback",
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

    const name = String(formDataObj.name || "").trim();
    const email = String(formDataObj.email || "").trim();
    const password = String(formDataObj.password || "");
    const role = formDataObj.role;

    const nextErrors: FormErrors<Field> = {};

    if (!name) {
      nextErrors.name = "Enter your full name.";
    } else if (name.length < 2) {
      nextErrors.name = "Your name should be at least 2 characters.";
    }

    if (!email) {
      nextErrors.email = "Enter your email address.";
    } else if (!isValidEmail(email)) {
      nextErrors.email = "Enter a valid email address, like name@example.com.";
    }

    if (!password) {
      nextErrors.password = "Create a password.";
    } else if (!meetsAllPasswordRules(password)) {
      nextErrors.password =
        "Your password doesn't meet all the requirements yet.";
    }

    if (role !== "customer" && role !== "technician") {
      nextErrors.role = "Choose how you'll use Mendizo.";
    }

    setErrors(nextErrors);

    if (hasErrors(nextErrors)) {
      const firstInvalid = Object.keys(nextErrors)[0];
      const focusId = firstInvalid === "role" ? "role-customer" : firstInvalid;

      if (focusId) {
        document.getElementById(focusId)?.focus();
      }

      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await authClient.signUp.email({
        name,
        email,
        password,
        role,
      } as any);

      if (error) {
        toast.error(
          error.message || "Account creation failed. Please try again."
        );
        return;
      }

      toast.success(
        "Account created successfully! Please sign in with your email and password."
      );

      router.push("/sign-in");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div ref={rootRef}>
      <header>
        <p className="text-[12.5px] font-bold uppercase tracking-[0.2em] text-primary dark:text-sky">
          Get started
        </p>

        <h1 className="mt-3 font-display text-[clamp(2rem,5.4vw,2.9rem)] leading-[1.08] tracking-tight text-foreground">
          Create Your Account
        </h1>

        <p className="mt-2.5 max-w-[28rem] text-[15.5px] leading-6 text-foreground/65">
          Book verified technicians, follow every repair in real time and pay
          once the job is done.
        </p>
      </header>

      <form noValidate onSubmit={handleSubmit} className="mt-5 space-y-4">
        <div className={FIELD_SCALE}>
          <TextField
            id="name"
            name="name"
            label="Full name"
            type="text"
            autoComplete="name"
            placeholder="Your full name"
            icon={<UserIcon className="h-[18px] w-[18px]" />}
            value={name}
            error={errors.name}
            onChange={(event) => {
              setName(event.target.value);
              clearError("name");
            }}
          />
        </div>

        <div className={FIELD_SCALE}>
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
        </div>

        <div className={FIELD_SCALE}>
          <PasswordField
            id="password"
            name="password"
            label="Password"
            autoComplete="new-password"
            placeholder="Create a password"
            icon={<LockIcon className="h-[18px] w-[18px]" />}
            value={password}
            error={errors.password}
            onChange={(event) => {
              setPassword(event.target.value);
              clearError("password");
            }}
          />

          <ul
            aria-live="polite"
            className="mt-2 grid gap-x-3 gap-y-1 sm:grid-cols-2"
          >
            {PASSWORD_RULES.map((rule) => {
              const met = rule.test(password);

              return (
                <li
                  key={rule.id}
                  className={`flex items-center gap-2 text-[13.5px] font-medium transition-colors duration-200 ${
                    met ? "text-primary dark:text-sky" : "text-foreground/55"
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`grid h-4 w-4 shrink-0 place-items-center rounded-full border transition-colors duration-200 ${
                      met
                        ? "border-primary bg-primary text-primary-foreground dark:border-sky dark:bg-sky dark:text-navy"
                        : "border-foreground/30 text-transparent"
                    }`}
                  >
                    <CheckIcon className="h-2.5 w-2.5" />
                  </span>
                  {rule.label}
                </li>
              );
            })}
          </ul>
        </div>

        <fieldset>
          <legend className="text-[15px] font-semibold tracking-[0.01em] text-foreground">
            I&apos;m joining as
          </legend>

          <div className="mt-2 grid gap-3 sm:grid-cols-2">
            {ROLE_OPTIONS.map((option) => {
              const selected = role === option.value;
              const Icon = option.Icon;

              return (
                <label
                  key={option.value}
                  className={`relative flex cursor-pointer items-center gap-3 rounded-2xl border p-3.5 pr-10 transition-all duration-200 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-sky ${
                    selected
                      ? "border-primary bg-primary/[0.07] ring-1 ring-primary/30 dark:border-sky dark:bg-sky/10 dark:ring-sky/30"
                      : "border-foreground/15 bg-white hover:border-primary/40 hover:bg-primary/[0.03] dark:border-white/15 dark:bg-white/[0.04] dark:hover:border-sky/40"
                  }`}
                >
                  <input
                    type="radio"
                    id={`role-${option.value}`}
                    name="role"
                    value={option.value}
                    checked={selected}
                    aria-describedby={errors.role ? "role-error" : undefined}
                    onChange={() => {
                      setRole(option.value);
                      clearError("role");
                    }}
                    className="sr-only"
                  />

                  <span
                    aria-hidden="true"
                    className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl transition-colors duration-200 ${
                      selected
                        ? "bg-primary text-primary-foreground dark:bg-sky dark:text-navy"
                        : "bg-foreground/5 text-foreground/60"
                    }`}
                  >
                    <Icon className="h-[18px] w-[18px]" />
                  </span>

                  <span className="min-w-0">
                    <span className="block text-[15px] font-semibold leading-tight text-foreground">
                      {option.label}
                    </span>

                    <span className="mt-0.5 block text-[13px] leading-5 text-foreground/60">
                      {option.description}
                    </span>
                  </span>

                  <span
                    aria-hidden="true"
                    className={`absolute right-3 top-1/2 grid h-5 w-5 -translate-y-1/2 place-items-center rounded-full border transition-colors duration-200 ${
                      selected
                        ? "border-primary bg-primary text-primary-foreground dark:border-sky dark:bg-sky dark:text-navy"
                        : "border-foreground/25 text-transparent"
                    }`}
                  >
                    <CheckIcon className="h-3 w-3" />
                  </span>
                </label>
              );
            })}
          </div>

          {errors.role ? (
            <p
              id="role-error"
              role="alert"
              className="mt-2 flex items-start gap-1.5 text-[13.5px] font-medium leading-5 text-red-600 dark:text-red-400"
            >
              <AlertIcon className="mt-px h-4 w-4 shrink-0" />
              <span>{errors.role}</span>
            </p>
          ) : null}
        </fieldset>

        <div className="pt-1">
          <SubmitButton loading={isSubmitting} loadingLabel="Creating account…">
            Create Account
          </SubmitButton>
        </div>
      </form>

      <div className="relative my-5 flex items-center">
        <div className="flex-grow border-t border-foreground/10" />
        <span className="mx-3 text-xs text-foreground/45">
          OR CONTINUE WITH
        </span>
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

      <p className="mt-4 border-t border-foreground/10 pt-4 text-center text-[15px] text-foreground/65">
        Already have an account?{" "}
        <Link href="/sign-in" className={LINK}>
          Sign in
        </Link>
      </p>
    </div>
  );
}
