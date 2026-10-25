import type { Body } from "@/lib/types";

// Placeholder artwork instead of photos: the prototype has no real vehicle images.
// Side views facing right. Each body has its own length, wheelbase and greenhouse
// (a hatchback is shorter than an estate, an SUV sits higher), so the shapes read as
// real car types. Shading uses translucent overlays, so no SVG ids are needed.

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
  /** x of the B-pillar (and the door seam below it); other pillars are solid body */
  pillar: number;
  /** y of the window line and of the sill */
  belt: number;
  sill: number;
  wheels: [number, number];
  wheelR: number;
  /** front and rear lamp anchors */
  head: [number, number];
  tail: [number, number, number];
  /** SUV-style dark cladding along the sill */
  cladding?: boolean;
}

// Ground at y=100. Wheel arches are cut 3 units wider than the tyres.
const arch = (x: number, r: number, sill: number) => `L${x - r - 3} ${sill} A${r + 3} ${r + 3} 0 0 1 ${x + r + 3} ${sill}`;

const SHAPES: Record<Body, Shape> = {
  // compact hatch, ~4.2 m: short tail, thick C-pillar
  hatchback: {
    body: `M34 95 ${arch(64, 15, 95)} ${arch(176, 15, 95)} L203 95 Q210 94 210 87 L209 72 Q206 62 196 60 L160 55 L140 41 Q134 37 124 37 L58 38 Q50 38 44 44 L34 56 Q30 62 30 72 L32 92 Q32 95 34 95 Z`,
    glass: "M52 55 L58 46 Q62 42 70 42 L122 41 Q130 41 135 45 L148 55 Z",
    pillar: 100, belt: 55, sill: 95, wheels: [64, 176], wheelR: 15, head: [197, 62], tail: [31, 58, 10],
  },
  // estate, ~4.7 m: long roof, D-pillar at the very back
  kombi: {
    body: `M16 95 ${arch(62, 15, 95)} ${arch(186, 15, 95)} L222 95 Q229 94 229 86 L228 72 Q225 63 210 61 L172 56 L152 42 Q146 38 136 38 L36 40 Q26 40 22 46 L16 56 Q12 62 12 72 L14 92 Q15 95 16 95 Z`,
    glass: "M31 56 L35 48 Q38 44 45 44 L134 42 Q143 42 148 46 L160 56 Z",
    pillar: 106, belt: 56, sill: 95, wheels: [62, 186], wheelR: 15, head: [216, 63], tail: [13, 60, 9],
  },
  // saloon, ~4.7 m: separate boot deck
  sedan: {
    body: `M17 95 ${arch(62, 15, 95)} ${arch(184, 15, 95)} L220 95 Q227 94 227 86 L226 74 Q223 65 208 62 L170 57 L148 42 Q142 38 132 38 L86 38 Q76 38 68 43 L46 58 L22 62 Q13 64 13 74 L15 92 Q16 95 17 95 Z`,
    glass: "M56 57 L70 46 Q77 42 86 42 L130 42 Q139 42 144 46 L158 57 Z",
    pillar: 104, belt: 57, sill: 95, wheels: [62, 184], wheelR: 15, head: [214, 64], tail: [14, 66, 6],
  },
  // SUV, ~4.7 m: tall body, high ground clearance, bigger wheels, cladding
  suv: {
    body: `M19 90 ${arch(62, 17, 90)} ${arch(182, 17, 90)} L218 90 Q225 89 225 80 L224 64 Q221 55 207 53 L174 49 L154 32 Q148 27 138 27 L38 28 Q29 28 25 34 L19 46 Q15 53 15 64 L17 87 Q18 90 19 90 Z`,
    glass: "M33 48 L37 37 Q40 32 47 32 L136 31 Q145 31 150 35 L164 48 Z",
    pillar: 106, belt: 48, sill: 90, wheels: [62, 182], wheelR: 17, head: [212, 55], tail: [16, 52, 10], cladding: true,
  },
  // MPV, ~4.5 m: tall roof, long steep windscreen, short bonnet
  mpv: {
    body: `M26 95 ${arch(60, 15, 95)} ${arch(178, 15, 95)} L211 95 Q218 94 218 86 L217 70 Q214 62 202 60 L180 56 L156 32 Q150 28 140 28 L42 29 Q33 29 29 35 L24 46 Q21 54 21 66 L23 92 Q24 95 26 95 Z`,
    glass: "M35 52 L39 38 Q42 33 49 33 L138 32 Q147 32 152 36 L170 54 Z",
    pillar: 104, belt: 53, sill: 95, wheels: [60, 178], wheelR: 15, head: [205, 61], tail: [22, 54, 10],
  },
};

function Wheel({ cx, r }: { cx: number; r: number }) {
  const cy = 100 - r;
  const rim = r * 0.62;
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill="#101215" />
      <circle cx={cx} cy={cy} r={rim} fill="#c9ced6" />
      <circle cx={cx} cy={cy} r={rim} fill="#000" opacity="0.12" />
      {[0, 72, 144, 216, 288].map((deg) => {
        const a = ((deg - 90) * Math.PI) / 180;
        return <line key={deg} x1={cx} y1={cy} x2={cx + Math.cos(a) * rim * 0.9} y2={cy + Math.sin(a) * rim * 0.9} stroke="#8e96a1" strokeWidth="2.4" strokeLinecap="round" />;
      })}
      <circle cx={cx} cy={cy} r={r * 0.17} fill="#3a3f47" />
    </g>
  );
}

export function CarImage({ body, color, className = "" }: { body: Body; color: string; className?: string }) {
  const paint = PAINT[color] ?? "#8a919c";
  const s = SHAPES[body];
  const [hx, hy] = s.head;
  const [tx, ty, th] = s.tail;
  const [rear, front] = s.wheels;
  return (
    <svg viewBox="0 0 240 150" className={className} role="img" aria-label={`Ilustrace vozu (${color})`}>
      <rect width="240" height="150" style={{ fill: "var(--color-photo)" }} />
      <rect y="118" width="240" height="32" fill="#000" opacity="0.1" />
      <g transform="translate(0 18)">
        <ellipse cx={(rear + front) / 2} cy="100" rx={(front - rear) / 2 + 50} ry="5" fill="#000" opacity="0.4" />
        <path d={s.body} fill={paint} />
        {/* lower body in shade, a soft highlight on the shoulder */}
        <path d={s.body} fill="#000" opacity="0.18" style={{ clipPath: "inset(68% 0 0 0) fill-box" }} />
        <path d={s.body} fill="#fff" opacity="0.12" style={{ clipPath: "inset(0 0 66% 0) fill-box" }} />
        {s.cladding && <path d={s.body} fill="#16191d" opacity="0.85" style={{ clipPath: "inset(88% 0 0 0) fill-box" }} />}
        <path d={s.glass} fill="#1b2430" />
        <path d={s.glass} fill="#cfe3ff" opacity="0.22" style={{ clipPath: "inset(0 45% 55% 0) fill-box" }} />
        <line x1={s.pillar} y1={s.belt - 18} x2={s.pillar} y2={s.belt} stroke={paint} strokeWidth="4" />
        <line x1={s.pillar} y1={s.belt + 1} x2={s.pillar + 1.5} y2={s.sill - 5} stroke="#000" strokeOpacity="0.22" strokeWidth="1" />
        <line x1={tx + 4} y1={s.belt + 4} x2={hx - 4} y2={s.belt + 6} stroke="#fff" strokeOpacity="0.3" strokeWidth="1" />
        <rect x={s.pillar - 18} y={s.belt + 8} width="9" height="2" rx="1" fill="#000" opacity="0.3" />
        <rect x={s.pillar + 30} y={s.belt + 8} width="9" height="2" rx="1" fill="#000" opacity="0.3" />
        <path d={`M${hx} ${hy} L${hx + 11} ${hy + 3} L${hx + 10} ${hy + 7} L${hx - 2} ${hy + 5} Z`} fill="#fff5cf" />
        <rect x={tx} y={ty} width="4.5" height={th} rx="1.5" fill="#d8322b" />
        <Wheel cx={rear} r={s.wheelR} />
        <Wheel cx={front} r={s.wheelR} />
      </g>
    </svg>
  );
}
