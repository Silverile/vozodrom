"use client";

import { useEffect } from "react";
import { type ThemeChoice, themeChoice } from "@/lib/storage";

// Dark is the default look. The choice is applied by an inline script before the
// first paint (no flash), and kept in sync here when it changes or, for "system",
// when the operating system switches between light and dark.

const KEY = "vozodrom.theme";

/** Runs in <head> before the page renders. Keep it dependency-free. */
export const THEME_BOOTSTRAP = `(function(){try{var c=JSON.parse(localStorage.getItem("${KEY}")||'"dark"');var l=c==="light"||(c==="system"&&matchMedia("(prefers-color-scheme: light)").matches);document.documentElement.dataset.theme=l?"light":"dark"}catch(e){document.documentElement.dataset.theme="dark"}})()`;

function apply(choice: ThemeChoice) {
  const light = choice === "light" || (choice === "system" && matchMedia("(prefers-color-scheme: light)").matches);
  document.documentElement.dataset.theme = light ? "light" : "dark";
}

export function ThemeSync() {
  const choice = themeChoice.useValue();
  useEffect(() => {
    apply(choice);
    if (choice !== "system") return;
    const media = matchMedia("(prefers-color-scheme: light)");
    const onChange = () => apply("system");
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, [choice]);
  return null;
}

function isLight(choice: ThemeChoice) {
  return choice === "light" || (choice === "system" && typeof matchMedia !== "undefined" && matchMedia("(prefers-color-scheme: light)").matches);
}

/** Lets colours fade instead of jumping while the theme changes. */
function switchTheme(next: ThemeChoice) {
  const root = document.documentElement;
  root.classList.add("theme-anim");
  themeChoice.write(next);
  setTimeout(() => root.classList.remove("theme-anim"), 350);
}

/**
 * Dark/light switch with a sliding sun-and-moon knob, and "Podle systému" to follow the
 * operating system. Changing the switch by hand leaves the system mode.
 */
export function ThemeSwitch() {
  const choice = themeChoice.useValue();
  const light = isLight(choice);
  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        role="switch"
        aria-checked={light}
        aria-label="Světlý motiv"
        onClick={() => switchTheme(light ? "dark" : "light")}
        className="theme-switch"
        data-light={light}
      >
        <span className="theme-switch__track" aria-hidden="true">
          <span className="theme-switch__icon theme-switch__moon">☾</span>
          <span className="theme-switch__icon theme-switch__sun">☀</span>
          <span className="theme-switch__knob">{light ? "☀" : "☾"}</span>
        </span>
        <span className="text-sm">{light ? "Světlý" : "Tmavý"}</span>
      </button>
      <label className="flex items-center gap-2 text-xs text-[var(--color-muted)] cursor-pointer">
        <input type="checkbox" checked={choice === "system"} onChange={(e) => switchTheme(e.target.checked ? "system" : light ? "light" : "dark")} />
        Podle systému
      </label>
    </div>
  );
}
