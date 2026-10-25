import type { Body } from "@/lib/types";

// Placeholder artwork instead of photos: the prototype has no real vehicle images.
// Side view facing right; shading uses translucent overlays so no SVG ids are needed.

const PAINT: Record<string, string> = {
  bílá: "#e9ecef",
  černá: "#3a3f47",
  stříbrná: "#b8bec7",
  šedá: "#7d848f",
  modrá: "#3d6fbf",
  červená: "#c8403c",
  "zelená metalíza": "#3a8a70",
};

interface Shape {
  body: string;
  glass: string;
  /** B-pillar x position and the top of the glass it starts from */
  pillar: number;
  pillarTop: number;
  /** shoulder line from rear to front */
  shoulder: string;
  door: number;
  lights: { front: [number, number]; rear: [number, number] };
}

const SHAPES: Record<Body, Shape> = {
  hatchback: {
    body: "M30 92 L44 64 Q50 54 64 52 L118 50 Q132 50 142 60 L160 76 L182 80 Q194 82 194 94 L194 104 L30 104 Z",
    glass: "M54 72 L62 58 Q66 56 74 56 L116 55 Q126 55 134 63 L146 74 Z",
    pillar: 104, pillarTop: 56, shoulder: "M34 82 L150 78 L190 86", door: 106, lights: { front: [186, 85], rear: [31, 82] },
  },
  kombi: {
    body: "M26 92 L40 64 Q46 54 60 52 L160 50 Q170 50 174 58 L180 78 L188 80 Q196 82 196 94 L196 104 L26 104 Z",
    glass: "M50 72 L58 58 Q62 56 70 56 L156 55 Q164 55 166 62 L170 74 Z",
    pillar: 112, pillarTop: 56, shoulder: "M30 82 L176 78 L192 86", door: 112, lights: { front: [188, 85], rear: [27, 82] },
  },
  sedan: {
    body: "M24 94 L40 74 L66 56 Q74 52 86 52 L122 52 Q134 52 144 60 L162 76 L186 80 Q198 82 198 94 L198 104 L24 104 Z",
    glass: "M66 74 L80 60 Q86 57 94 57 L120 57 Q130 57 138 64 L150 75 Z",
    pillar: 112, pillarTop: 58, shoulder: "M28 84 L156 79 L194 87", door: 112, lights: { front: [190, 86], rear: [25, 86] },
  },
  suv: {
    body: "M26 90 L36 60 Q40 48 56 46 L150 44 Q164 44 170 54 L180 74 L188 76 Q198 78 198 92 L198 106 L26 106 Z",
    glass: "M46 70 L52 54 Q56 50 64 50 L146 49 Q156 49 162 58 L170 70 Z",
    pillar: 108, pillarTop: 50, shoulder: "M30 78 L172 74 L194 82", door: 108, lights: { front: [190, 81], rear: [27, 78] },
  },
  mpv: {
    body: "M28 92 L38 56 Q42 46 58 44 L164 44 Q176 44 180 56 L186 78 Q196 80 196 94 L196 104 L28 104 Z",
    glass: "M46 72 L52 52 Q56 49 64 49 L160 48 Q170 48 174 58 L178 72 Z",
    pillar: 114, pillarTop: 49, shoulder: "M32 80 L182 76 L192 84", door: 114, lights: { front: [189, 84], rear: [29, 80] },
  },
};

function Wheel({ cx }: { cx: number }) {
  const spokes = [0, 72, 144, 216, 288];
  return (
    <g>
      <circle cx={cx} cy="104" r="14" fill="#101215" />
      <circle cx={cx} cy="104" r="8.5" fill="#c9ced6" />
      <circle cx={cx} cy="104" r="8.5" fill="#000" opacity="0.15" />
      {spokes.map((deg) => {
        const a = (deg * Math.PI) / 180;
        return <line key={deg} x1={cx} y1="104" x2={cx + Math.cos(a) * 7.5} y2={104 + Math.sin(a) * 7.5} stroke="#7d848f" strokeWidth="2.2" strokeLinecap="round" />;
      })}
      <circle cx={cx} cy="104" r="2.6" fill="#3a3f47" />
    </g>
  );
}

export function CarImage({ body, color, className = "" }: { body: Body; color: string; className?: string }) {
  const paint = PAINT[color] ?? "#8a919c";
  const s = SHAPES[body];
  return (
    <svg viewBox="0 0 220 130" className={className} role="img" aria-label={`Ilustrace vozu (${color})`}>
      <rect width="220" height="130" style={{ fill: "var(--color-photo)" }} />
      <rect y="104" width="220" height="26" fill="#000" opacity="0.1" />
      <ellipse cx="112" cy="116" rx="98" ry="7" fill="#000" opacity="0.35" />
      <path d={s.body} fill={paint} />
      {/* lower half in shade, roof in light */}
      <path d={s.body} fill="#000" opacity="0.16" style={{ clipPath: "inset(62% 0 0 0) fill-box" }} />
      <path d={s.body} fill="#fff" opacity="0.1" style={{ clipPath: "inset(0 0 72% 0) fill-box" }} />
      <path d={s.glass} fill="#1d2733" />
      <path d={s.glass} fill="#cfe3ff" opacity="0.28" style={{ clipPath: "inset(0 40% 50% 0) fill-box" }} />
      <line x1={s.pillar} y1={s.pillarTop} x2={s.pillar} y2="76" stroke={paint} strokeWidth="3" />
      <path d={s.shoulder} stroke="#fff" strokeOpacity="0.35" strokeWidth="1.2" fill="none" />
      <line x1={s.door} y1="78" x2={s.door + 2} y2="100" stroke="#000" strokeOpacity="0.25" strokeWidth="1" />
      <rect x={s.door - 14} y="84" width="7" height="1.8" rx="0.9" fill="#000" opacity="0.3" />
      <rect x={s.lights.front[0]} y={s.lights.front[1]} width="8" height="4" rx="2" fill="#fff5cf" />
      <rect x={s.lights.rear[0]} y={s.lights.rear[1]} width="5" height="5" rx="1.5" fill="#d8322b" />
      <Wheel cx={64} />
      <Wheel cx={160} />
    </svg>
  );
}
