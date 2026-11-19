/**
 * Small UI-only validation helpers shared by the Sign In and Sign Up forms.
 * There is no auth wiring yet — these functions only drive the form feedback.
 */

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function isValidEmail(value: string) {
  return EMAIL_PATTERN.test(value.trim());
}

export type PasswordRule = {
  id: string;
  label: string;
  test: (value: string) => boolean;
};

/** Rules shown under the password field on the Sign Up form. */
export const PASSWORD_RULES: readonly PasswordRule[] = [
  {
    id: "length",
    label: "At least 6 characters",
    test: (value) => value.length >= 6,
  },
  {
    id: "uppercase",
    label: "One uppercase letter",
    test: (value) => /[A-Z]/.test(value),
  },
  {
    id: "lowercase",
    label: "One lowercase letter",
    test: (value) => /[a-z]/.test(value),
  },
];

export function meetsAllPasswordRules(value: string) {
  return PASSWORD_RULES.every((rule) => rule.test(value));
}

export type FormErrors<Field extends string> = Partial<Record<Field, string>>;

export function hasErrors<Field extends string>(errors: FormErrors<Field>) {
  return Object.keys(errors).length > 0;
}
