"use client";

import { useId, useState } from "react";
import type { InputHTMLAttributes, ReactNode } from "react";
import { AlertIcon, EyeIcon, EyeOffIcon, InfoIcon, SpinnerIcon } from "./AuthIcons";

const FOCUS =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky";

const INPUT_BASE =
  "h-12 w-full rounded-xl border bg-white text-[15px] text-foreground shadow-[inset_0_1px_2px_rgba(18,35,46,0.04)] transition duration-200 placeholder:text-foreground/35 focus:outline-none dark:bg-white/[0.06] dark:placeholder:text-white/35";

const INPUT_IDLE =
  "border-foreground/15 focus:border-primary focus:ring-4 focus:ring-primary/15 dark:border-white/15 dark:focus:border-sky dark:focus:ring-sky/20";

const INPUT_ERROR =
  "border-red-500/70 focus:border-red-500 focus:ring-4 focus:ring-red-500/15 dark:border-red-400/60 dark:focus:border-red-400";

type FieldShellProps = {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  children: ReactNode;
  labelAddon?: ReactNode;
};

/** Label + control wrapper with an optional inline error message. */
export function FieldShell({
  id,
  label,
  error,
  hint,
  children,
  labelAddon,
}: FieldShellProps) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <label
          htmlFor={id}
          className="text-[12.5px] font-semibold tracking-[0.01em] text-foreground/80"
        >
          {label}
        </label>
        {labelAddon}
      </div>

      <div className="mt-2">{children}</div>

      {hint && !error ? (
        <p className="mt-1.5 text-[12px] text-foreground/50">{hint}</p>
      ) : null}

      {error ? (
        <p
          id={`${id}-error`}
          role="alert"
          className="mt-1.5 flex items-start gap-1.5 text-[12.5px] font-medium leading-5 text-red-600 dark:text-red-400"
        >
          <AlertIcon className="mt-px h-4 w-4 shrink-0" />
          <span>{error}</span>
        </p>
      ) : null}
    </div>
  );
}

type TextFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, "id"> & {
  id: string;
  label: string;
  icon?: ReactNode;
  error?: string;
  hint?: string;
};

export function TextField({
  id,
  label,
  icon,
  error,
  hint,
  className = "",
  ...inputProps
}: TextFieldProps) {
  return (
    <FieldShell id={id} label={label} error={error} hint={hint}>
      <div className="relative">
        {icon ? (
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground/40">
            {icon}
          </span>
        ) : null}

        <input
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`${INPUT_BASE} ${error ? INPUT_ERROR : INPUT_IDLE} ${
            icon ? "pl-11" : "pl-4"
          } pr-4 ${className}`}
          {...inputProps}
        />
      </div>
    </FieldShell>
  );
}

type PasswordFieldProps = Omit<TextFieldProps, "type">;

export function PasswordField({
  id,
  label,
  icon,
  error,
  hint,
  className = "",
  ...inputProps
}: PasswordFieldProps) {
  const [isVisible, setIsVisible] = useState(false);
  const helpId = useId();

  return (
    <FieldShell id={id} label={label} error={error} hint={hint}>
      <div className="relative">
        {icon ? (
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground/40">
            {icon}
          </span>
        ) : null}

        <input
          id={id}
          type={isVisible ? "text" : "password"}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`${INPUT_BASE} ${error ? INPUT_ERROR : INPUT_IDLE} ${
            icon ? "pl-11" : "pl-4"
          } pr-12 ${className}`}
          {...inputProps}
        />

        <button
          type="button"
          onClick={() => setIsVisible((visible) => !visible)}
          aria-label={isVisible ? "Hide password" : "Show password"}
          aria-pressed={isVisible}
          aria-controls={id}
          aria-describedby={helpId}
          className={`absolute right-1.5 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-lg text-foreground/45 transition-colors hover:bg-foreground/5 hover:text-foreground ${FOCUS}`}
        >
          {isVisible ? (
            <EyeOffIcon className="h-[18px] w-[18px]" />
          ) : (
            <EyeIcon className="h-[18px] w-[18px]" />
          )}
        </button>

        <span id={helpId} className="sr-only">
          Toggles whether the password is visible on screen.
        </span>
      </div>
    </FieldShell>
  );
}

type SubmitButtonProps = {
  loading: boolean;
  children: ReactNode;
  loadingLabel: string;
};

export function SubmitButton({ loading, children, loadingLabel }: SubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={loading}
      aria-busy={loading}
      className={`flex w-full items-center justify-center gap-2.5 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-[0_18px_40px_-18px_rgba(0,124,199,0.95)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[color-mix(in_oklab,var(--color-primary),black_12%)] disabled:pointer-events-none disabled:opacity-70 ${FOCUS}`}
    >
      {loading ? (
        <>
          <SpinnerIcon />
          {loadingLabel}
        </>
      ) : (
        children
      )}
    </button>
  );
}

export function FormNotice({ children }: { children: ReactNode }) {
  return (
    <div
      role="status"
      className="mt-5 flex items-start gap-2.5 rounded-xl border border-primary/25 bg-primary/10 px-3.5 py-3 text-[12.5px] leading-5 text-foreground/80"
    >
      <InfoIcon className="mt-px h-4 w-4 shrink-0 text-primary dark:text-sky" />
      <span>{children}</span>
    </div>
  );
}

export { FOCUS as AUTH_FOCUS };
