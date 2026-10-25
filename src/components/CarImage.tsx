import type { Body } from "@/lib/types";

// Placeholder artwork instead of photos: the prototype has no real vehicle images.

const PAINT: Record<string, string> = {
  bílá: "#e9ecef",
  černá: "#2b2f36",
  stříbrná: "#b8bec7",
  šedá: "#7d848f",
  modrá: "#2f5fa7",
  červená: "#b8312f",
  "zelená metalíza": "#2f6f5a",
};

const SILHOUETTE: Record<Body, string> = {
  hatchback: "M30 92 L44 64 Q50 54 64 52 L118 50 Q132 50 142 60 L160 76 L182 80 Q194 82 194 94 L194 104 L30 104 Z",
  kombi: "M26 92 L40 64 Q46 54 60 52 L160 50 Q170 50 174 58 L180 78 L188 80 Q196 82 196 94 L196 104 L26 104 Z",
  sedan: "M24 94 L40 74 L66 56 Q74 52 86 52 L122 52 Q134 52 144 60 L162 76 L186 80 Q198 82 198 94 L198 104 L24 104 Z",
  suv: "M26 90 L36 60 Q40 48 56 46 L150 44 Q164 44 170 54 L180 74 L188 76 Q198 78 198 92 L198 106 L26 106 Z",
  mpv: "M28 92 L38 56 Q42 46 58 44 L164 44 Q176 44 180 56 L186 78 Q196 80 196 94 L196 104 L28 104 Z",
};

export function CarImage({ body, color, className = "" }: { body: Body; color: string; className?: string }) {
  const paint = PAINT[color] ?? "#8a919c";
  return (
    <svg viewBox="0 0 220 130" className={className} role="img" aria-label={`Ilustrace vozu (${color})`}>
      <rect width="220" height="130" fill="var(--color-brand-soft)" />
      <rect y="108" width="220" height="22" fill="var(--color-line)" />
      <path d={SILHOUETTE[body]} fill={paint} stroke="#00000033" strokeWidth="1.5" />
      <path d="M70 58 L114 56 Q126 56 134 64 L144 76 L64 76 Z" fill="#cfe3ff" opacity="0.7" />
      <circle cx="64" cy="104" r="13" fill="#1d2026" />
      <circle cx="64" cy="104" r="5" fill="#9aa1ab" />
      <circle cx="160" cy="104" r="13" fill="#1d2026" />
      <circle cx="160" cy="104" r="5" fill="#9aa1ab" />
    </svg>
  );
}
