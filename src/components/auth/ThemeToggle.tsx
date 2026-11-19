"use client";

import { MoonIcon, SunIcon } from "./AuthIcons";

const FOCUS =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky";

/**
 * Theme toggle for the auth pages. It mirrors the Navbar behaviour (same
 * localStorage key + `.dark` class) without touching the Navbar itself.
 */
export default function ThemeToggle() {
  function toggleTheme() {
    const root = document.documentElement;
    const nextIsDark = !root.classList.contains("dark");

    root.classList.toggle("dark", nextIsDark);
    root.style.colorScheme = nextIsDark ? "dark" : "light";
    root.dataset.theme = nextIsDark ? "dark" : "light";

    try {
      localStorage.setItem("mendizo-theme", nextIsDark ? "dark" : "light");
    } catch {
      /* storage unavailable */
    }
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle color theme"
      title="Toggle color theme"
      className={`grid h-10 w-10 place-items-center rounded-full border border-foreground/15 bg-transparent text-foreground/70 transition-colors duration-300 hover:bg-foreground/5 hover:text-foreground ${FOCUS}`}
    >
      <span className="dark:hidden">
        <SunIcon className="h-[18px] w-[18px]" />
      </span>

      <span className="hidden dark:block">
        <MoonIcon className="h-[18px] w-[18px]" />
      </span>
    </button>
  );
}
