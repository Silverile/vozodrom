"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

// A sentence whose ending types itself letter by letter, holds, deletes itself and types the next
// one. Screen readers get the plain sentence with the first ending; with reduced motion the first
// ending simply stands. The block keeps its height (minHeight) so the text below never jumps.

const TYPE_MS = 45;
const DELETE_MS = 22;
const HOLD_MS = 2200;
const PAUSE_MS = 350;

const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const subscribe = (cb: () => void) => {
  const query = window.matchMedia("(prefers-reduced-motion: reduce)");
  query.addEventListener("change", cb);
  return () => query.removeEventListener("change", cb);
};

export function Typewriter({ prefix, endings, suffix = "", className = "", minHeight }: {
  prefix: string;
  endings: string[];
  suffix?: string;
  className?: string;
  /** keeps room for the longest ending, e.g. "3.75em" */
  minHeight?: string;
}) {
  const still = useSyncExternalStore(subscribe, reducedMotion, () => true);
  const [index, setIndex] = useState(0);
  const [shown, setShown] = useState(endings[0].length);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (still) return;
    const full = endings[index];
    let delay: number;
    let step: () => void;
    if (!deleting && shown < full.length) {
      delay = TYPE_MS;
      step = () => setShown((n) => n + 1);
    } else if (!deleting) {
      delay = HOLD_MS;
      step = () => setDeleting(true);
    } else if (shown > 0) {
      delay = DELETE_MS;
      step = () => setShown((n) => n - 1);
    } else {
      delay = PAUSE_MS;
      step = () => {
        setDeleting(false);
        setIndex((i) => (i + 1) % endings.length);
      };
    }
    const timer = window.setTimeout(step, delay);
    return () => window.clearTimeout(timer);
  }, [still, index, shown, deleting, endings]);

  const ending = still ? endings[0] : endings[index].slice(0, shown);
  return (
    <p className={className} style={minHeight ? { minHeight } : undefined}>
      <span className="sr-only">{`${prefix}${endings[0]}${suffix}`}</span>
      <span aria-hidden="true">
        {prefix}
        {ending}
        {!still && <span className="typewriter-caret" />}
        {suffix}
      </span>
    </p>
  );
}
