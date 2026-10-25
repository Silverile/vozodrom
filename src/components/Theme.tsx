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

const OPTIONS: [ThemeChoice, string][] = [
  ["dark", "Tmavý"],
  ["light", "Světlý"],
  ["system", "Podle systému"],
];

export function ThemeSwitch() {
  const choice = themeChoice.useValue();
  return (
    <div role="radiogroup" aria-label="Motiv" className="flex flex-wrap gap-1">
      {OPTIONS.map(([value, label]) => (
        <button
          key={value}
          role="radio"
          aria-checked={choice === value}
          data-on={choice === value}
          className="pill"
          onClick={() => themeChoice.write(value)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
