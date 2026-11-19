"use client";

import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import {
  FormNotice,
  PasswordField,
  SubmitButton,
  TextField,
} from "./FormControls";
import { AlertIcon, CheckIcon, HomeIcon, LockIcon, MailIcon, UserIcon, WrenchIcon } from "./AuthIcons";
import {
  PASSWORD_RULES,
  hasErrors,
  isValidEmail,
  meetsAllPasswordRules,
} from "@/lib/validation";
import type { FormErrors } from "@/lib/validation";

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

const LINK =
  "font-semibold text-primary underline-offset-4 transition-colors hover:text-[color-mix(in_oklab,var(--color-primary),black_14%)] hover:underline dark:text-sky dark:hover:text-on-dark";

export default function SignUpForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role | null>(null);
  const [errors, setErrors] = useState<FormErrors<Field>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    };
  }, []);

  function clearError(field: Field) {
    setErrors((previous) => {
      if (!previous[field]) return previous;

      const next = { ...previous };
      delete next[field];
      return next;
    });
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNotice(null);

    const nextErrors: FormErrors<Field> = {};

    if (!name.trim()) {
      nextErrors.name = "Enter your full name.";
    } else if (name.trim().length < 2) {
      nextErrors.name = "Your name should be at least 2 characters.";
    }

    if (!email.trim()) {
      nextErrors.email = "Enter your email address.";
    } else if (!isValidEmail(email)) {
      nextErrors.email = "Enter a valid email address, like name@example.com.";
    }

    if (!password) {
      nextErrors.password = "Create a password.";
    } else if (!meetsAllPasswordRules(password)) {
      nextErrors.password = "Your password doesn't meet all the requirements yet.";
    }

    if (!role) {
      nextErrors.role = "Choose how you'll use Mendizo.";
    }

    setErrors(nextErrors);

    if (hasErrors(nextErrors)) {
      const firstInvalid = Object.keys(nextErrors)[0];
      if (firstInvalid) {
        const focusId = firstInvalid === "role" ? "role-customer" : firstInvalid;
        document.getElementById(focusId)?.focus();
      }
      return;
    }

    // UI only: no auth provider is wired up yet, so nothing is submitted anywhere.
    setIsSubmitting(true);
    timerRef.current = window.setTimeout(() => {
      setIsSubmitting(false);
      setNotice(
        "Account creation isn't connected yet. This form is UI only, so nothing was saved or sent."
      );
    }, 900);
  }

  return (
    <div>
      <header>
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary dark:text-sky">
          Get started
        </p>

        <h1 className="mt-3 font-display text-[clamp(2rem,5.4vw,2.6rem)] leading-[1.08] tracking-tight text-foreground">
          Create Your Account
        </h1>

        <p className="mt-2 max-w-[26rem] text-[14.5px] leading-6 text-foreground/60">
          Book verified technicians, follow every repair in real time and pay
          once the job is done.
        </p>
      </header>

      <form noValidate onSubmit={handleSubmit} className="mt-6 space-y-4">
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
            setNotice(null);
            clearError("name");
          }}
        />

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
            setNotice(null);
            clearError("email");
          }}
        />

        <div>
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
              setNotice(null);
              clearError("password");
            }}
          />

          <ul aria-live="polite" className="mt-2 grid gap-1.5 sm:grid-cols-2">
            {PASSWORD_RULES.map((rule) => {
              const met = rule.test(password);

              return (
                <li
                  key={rule.id}
                  className={`flex items-center gap-2 text-[12px] font-medium transition-colors duration-200 ${
                    met
                      ? "text-primary dark:text-sky"
                      : "text-foreground/45"
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`grid h-4 w-4 place-items-center rounded-full border transition-colors duration-200 ${
                      met
                        ? "border-primary bg-primary text-primary-foreground dark:border-sky dark:bg-sky dark:text-navy"
                        : "border-foreground/25 text-transparent"
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
          <legend className="text-[12.5px] font-semibold tracking-[0.01em] text-foreground/80">
            I&apos;m joining as
          </legend>

          <div className="mt-2 grid gap-3 sm:grid-cols-2">
            {ROLE_OPTIONS.map((option) => {
              const selected = role === option.value;
              const Icon = option.Icon;

              return (
                <label
                  key={option.value}
                  className={`relative flex cursor-pointer items-start gap-3 rounded-2xl border p-3.5 pr-9 transition-all duration-200 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-sky ${
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
                      setNotice(null);
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

                  <span className="min-w-0 flex-1">
                    <span className="block text-[13.5px] font-semibold text-foreground">
                      {option.label}
                    </span>

                    <span className="mt-1 block text-[12px] leading-5 text-foreground/55">
                      {option.description}
                    </span>
                  </span>

                  <span
                    aria-hidden="true"
                    className={`absolute right-3 top-3 grid h-5 w-5 place-items-center rounded-full border transition-colors duration-200 ${
                      selected
                        ? "border-primary bg-primary text-primary-foreground dark:border-sky dark:bg-sky dark:text-navy"
                        : "border-foreground/20 text-transparent"
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
              className="mt-2 flex items-start gap-1.5 text-[12.5px] font-medium leading-5 text-red-600 dark:text-red-400"
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

        {notice ? <FormNotice>{notice}</FormNotice> : null}
      </form>

      <p className="mt-5 border-t border-foreground/10 pt-4 text-center text-[13.5px] text-foreground/60">
        Already have an account?{" "}
        <Link href="/sign-in" className={LINK}>
          Sign in
        </Link>
      </p>
    </div>
  );
}
