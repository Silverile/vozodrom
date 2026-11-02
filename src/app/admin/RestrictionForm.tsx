"use client";

import { useState } from "react";
import { RULES, type RuleKey } from "@/lib/statement";

// The moderator's half of a statement of reasons (DSA art. 17): the rule broken, picked from the
// terms, and the facts in their own words. The author gets both, with how to object.
export function RestrictionForm({
  label,
  submit,
  busy,
  onSubmit,
  onCancel,
}: {
  label: string;
  submit: string;
  busy: boolean;
  onSubmit: (rule: RuleKey, reason: string) => void;
  onCancel?: () => void;
}) {
  const [rule, setRule] = useState<RuleKey | "">("");
  const [reason, setReason] = useState("");
  return (
    <form
      className="w-full space-y-2 text-sm"
      onSubmit={(e) => {
        e.preventDefault();
        if (rule && reason.trim().length >= 5) onSubmit(rule, reason.trim());
      }}
    >
      <label className="block">
        Porušené pravidlo
        <select className="input mt-1" required value={rule} onChange={(e) => setRule(e.target.value as RuleKey)}>
          <option value="" disabled>Vyberte</option>
          {Object.entries(RULES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </label>
      <label className="block">
        {label}
        <textarea className="input mt-1 min-h-20" required minLength={5} maxLength={1000} value={reason} onChange={(e) => setReason(e.target.value)} />
        <span className="text-xs text-[var(--color-muted)]">Konkrétně: co přesně je v obsahu v nepořádku. U nezákonného obsahu uveďte i předpis.</span>
      </label>
      <div className="flex flex-wrap items-center gap-2">
        <button type="submit" className="pill text-[var(--color-warn)]" disabled={busy || !rule || reason.trim().length < 5}>{submit}</button>
        {onCancel && <button type="button" className="text-[var(--color-muted)]" onClick={onCancel}>Zrušit</button>}
      </div>
    </form>
  );
}
