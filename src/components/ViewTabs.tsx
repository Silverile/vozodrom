"use client";

import { useState } from "react";

/** Two or more server-rendered views of the same content with tabs to switch between them. */
export function ViewTabs({ labels, children }: { labels: string[]; children: React.ReactNode[] }) {
  const [active, setActive] = useState(0);
  return (
    <div>
      <div role="tablist" className="inline-flex rounded-full bg-[var(--color-field)] p-1 text-sm">
        {labels.map((label, i) => (
          <button
            key={label}
            role="tab"
            aria-selected={i === active}
            onClick={() => setActive(i)}
            className={`rounded-full px-3 py-1 font-medium transition ${i === active ? "bg-[var(--color-surface)] shadow text-[var(--color-ink)]" : "text-[var(--color-muted)] hover:text-[var(--color-ink)]"}`}
          >
            {label}
          </button>
        ))}
      </div>
      {children.map((child, i) => (
        <div key={i} role="tabpanel" hidden={i !== active} className="mt-4">
          {child}
        </div>
      ))}
    </div>
  );
}
