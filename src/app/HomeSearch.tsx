"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function HomeSearch({ total }: { total: number }) {
  const router = useRouter();
  const [q, setQ] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    router.push(q.trim() ? `/inzeraty/?q=${encodeURIComponent(q.trim())}` : "/inzeraty/");
  }

  return (
    <form onSubmit={submit} className="mt-7 flex flex-col sm:flex-row gap-2 max-w-3xl">
      <input
        className="input !py-4 !px-5 !text-base flex-1"
        placeholder="Např. Octavia kombi automat Praha"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        aria-label="Co hledáte"
      />
      <button className="btn-cta !px-6 !py-4 text-base whitespace-nowrap">Hledat z {new Intl.NumberFormat("cs-CZ").format(total)} aut</button>
    </form>
  );
}
