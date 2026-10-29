import type { Body } from "@/lib/types";

// Placeholder artwork instead of photos: the prototype has no real vehicle images.
// Outlined side views facing right, in the style of body-type pictograms: real cabin
// height, big wheels, doors, handles and lamps. Each body type has its own length and
// greenhouse. Shading uses translucent overlays, so no SVG ids are needed.

const PAINT: Record<string, string> = {
  bílá: "#e9ecef",
  černá: "#3a3f47",
  stříbrná: "#b8bec7",
  šedá: "#7d848f",
  modrá: "#3d6fbf",
  červená: "#c8403c",
  "zelená metalíza": "#3a8a70",
};

const OUTLINE = "#0b0d10";

interface Shape {
  body: string;
  windows: string[];
  /** door seams as path data */
  doors: string;
  handles: [number, number][];
  wheels: [number, number];
  wheelR: number;
  head: string;
  tail: string;
  cladding?: boolean;
}

// Ground at y=120. Wheel arches cut 3 units wider than the tyres; drawn right to left.
const arches = (rear: number, front: number, r: number, sill: number) =>
  `L${front + r + 3} ${sill} A${r + 3} ${r + 3} 0 0 0 ${front - r - 3} ${sill} L${rear + r + 3} ${sill} A${r + 3} ${r + 3} 0 0 0 ${rear - r - 3} ${sill}`;

const SHAPES: Record<Body, Shape> = {
  hatchback: {
    body: `M40 112 L38 92 Q37 80 41 72 L48 58 Q52 53 60 52 L128 51 Q136 51 142 56 L162 74 L192 79 Q203 81 205 90 L206 104 Q206 112 200 112 ${arches(70, 172, 17, 112)} L40 112 Z`,
    windows: ["M52 74 L58 62 Q61 57 67 57 L99 57 L99 74 Z", "M105 57 L127 56 Q134 56 139 60 L154 74 L105 74 Z"],
    doors: "M102 56 L103 110 M60 76 Q57 92 60 108 M157 76 Q152 92 152 104",
    handles: [[88, 80], [140, 80]],
    wheels: [70, 172], wheelR: 17,
    head: "M194 82 L204 85 L204 89 L192 87 Z", tail: "M38 76 L43 76 L42 86 L38 86 Z",
  },
  kombi: {
    body: `M27 112 L25 90 Q24 76 28 68 L34 58 Q38 52 46 52 L136 51 Q144 51 150 56 L170 74 L204 79 Q215 81 217 90 L218 104 Q218 112 212 112 ${arches(62, 180, 17, 112)} L27 112 Z`,
    windows: ["M36 74 L41 62 Q44 57 50 57 L69 57 L69 74 Z", "M75 57 L107 57 L107 74 L75 74 Z", "M113 57 L135 56 Q142 56 147 60 L162 74 L113 74 Z"],
    doors: "M72 56 L74 110 M110 56 L111 110 M165 76 Q160 92 160 104",
    handles: [[96, 80], [150, 80]],
    wheels: [62, 180], wheelR: 17,
    head: "M206 82 L216 85 L216 89 L204 87 Z", tail: "M25 74 L30 74 L29 86 L25 86 Z",
  },
  sedan: {
    body: `M27 112 L25 92 Q25 84 31 82 L52 78 L72 58 Q78 53 88 53 L132 52 Q141 52 147 57 L168 75 L204 80 Q215 82 217 91 L218 104 Q218 112 212 112 ${arches(62, 180, 17, 112)} L27 112 Z`,
    windows: ["M64 77 L77 63 Q81 58 89 58 L107 58 L107 77 Z", "M113 58 L132 57 Q140 57 145 62 L160 77 L113 77 Z"],
    doors: "M110 57 L111 110 M66 80 Q63 94 66 108 M164 79 Q159 93 159 104",
    handles: [[95, 83], [148, 83]],
    wheels: [62, 180], wheelR: 17,
    head: "M206 83 L216 86 L216 90 L204 88 Z", tail: "M25 85 L31 85 L30 92 L25 92 Z",
  },
  suv: {
    body: `M29 108 L27 80 Q27 64 32 56 L38 44 Q42 38 50 38 L140 37 Q148 37 153 42 L172 62 L204 66 Q214 68 216 78 L216 100 Q216 108 210 108 ${arches(64, 178, 19, 108)} L29 108 Z`,
    windows: ["M38 62 L43 48 Q46 43 52 43 L73 43 L73 62 Z", "M79 43 L109 43 L109 62 L79 62 Z", "M115 43 L139 42 Q146 42 151 47 L164 62 L115 62 Z"],
    doors: "M76 42 L78 104 M112 42 L113 104 M167 64 Q162 84 162 100",
    handles: [[100, 68], [154, 68]],
    wheels: [64, 178], wheelR: 19,
    head: "M204 69 L215 72 L215 77 L202 75 Z", tail: "M27 64 L32 64 L31 78 L27 78 Z",
    cladding: true,
  },
  mpv: {
    body: `M29 112 L27 84 Q27 70 31 62 L36 48 Q40 41 48 41 L144 40 Q152 40 157 45 L180 72 L204 77 Q214 79 216 88 L216 104 Q216 112 210 112 ${arches(62, 180, 17, 112)} L29 112 Z`,
    windows: ["M37 70 L42 52 Q45 46 51 46 L75 46 L75 70 Z", "M81 46 L113 46 L113 70 L81 70 Z", "M119 46 L144 45 Q151 45 155 50 L171 70 L119 70 Z"],
    doors: "M78 45 L80 110 M116 45 L117 110 M174 73 Q168 90 168 104",
    handles: [[102, 76], [160, 76]],
    wheels: [62, 180], wheelR: 17,
    head: "M205 80 L215 83 L215 87 L203 85 Z", tail: "M27 70 L32 70 L31 84 L27 84 Z",
  },
};

function Wheel({ cx, r }: { cx: number; r: number }) {
  const cy = 120 - r;
  const rim = r * 0.6;
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill="#14171b" stroke={OUTLINE} strokeWidth="2" />
      <circle cx={cx} cy={cy} r={rim} fill="#c9ced6" stroke={OUTLINE} strokeWidth="1.6" />
      {[0, 72, 144, 216, 288].map((deg) => {
        const a = ((deg - 90) * Math.PI) / 180;
        return <line key={deg} x1={cx} y1={cy} x2={cx + Math.cos(a) * rim * 0.85} y2={cy + Math.sin(a) * rim * 0.85} stroke="#7d848f" strokeWidth="2.2" strokeLinecap="round" />;
      })}
      <circle cx={cx} cy={cy} r={r * 0.16} fill="#3a3f47" stroke={OUTLINE} strokeWidth="1" />
    </g>
  );
}

export function CarImage({ body, color, className = "" }: { body: Body; color: string; className?: string }) {
  const paint = PAINT[color] ?? "#8a919c";
  const s = SHAPES[body] ?? SHAPES.hatchback; // catalogue body types without a pictogram of their own
  const [rear, front] = s.wheels;
  return (
    <svg viewBox="0 0 240 150" className={className} role="img" aria-label={`Ilustrace vozu (${color})`}>
      <rect width="240" height="150" style={{ fill: "var(--color-photo)" }} />
      <rect y="128" width="240" height="22" fill="#000" opacity="0.1" />
      <g transform="translate(0 8)">
        <ellipse cx={(rear + front) / 2} cy="120" rx={(front - rear) / 2 + 52} ry="4.5" fill="#000" opacity="0.4" />
        <path d={s.body} fill={paint} />
        {/* lower body in shade, a soft highlight on the shoulder */}
        <path d={s.body} fill="#000" opacity="0.16" style={{ clipPath: "inset(70% 0 0 0) fill-box" }} />
        <path d={s.body} fill="#fff" opacity="0.14" style={{ clipPath: "inset(0 0 72% 0) fill-box" }} />
        {s.cladding && <path d={s.body} fill="#16191d" style={{ clipPath: "inset(90% 0 0 0) fill-box" }} />}
        {s.windows.map((w) => (
          <g key={w}>
            <path d={w} fill="#1b2430" stroke={OUTLINE} strokeWidth="1.8" strokeLinejoin="round" />
            <path d={w} fill="#cfe3ff" opacity="0.2" style={{ clipPath: "inset(0 50% 50% 0) fill-box" }} />
          </g>
        ))}
        <path d={s.doors} fill="none" stroke={OUTLINE} strokeOpacity="0.55" strokeWidth="1.4" strokeLinecap="round" />
        {s.handles.map(([x, y]) => <rect key={x} x={x} y={y} width="9" height="2.2" rx="1.1" fill={OUTLINE} opacity="0.6" />)}
        <path d={s.head} fill="#fff5cf" stroke={OUTLINE} strokeWidth="1.2" strokeLinejoin="round" />
        <path d={s.tail} fill="#d8322b" stroke={OUTLINE} strokeWidth="1.2" strokeLinejoin="round" />
        <path d={s.body} fill="none" stroke={OUTLINE} strokeWidth="2.4" strokeLinejoin="round" />
        <Wheel cx={rear} r={s.wheelR} />
        <Wheel cx={front} r={s.wheelR} />
      </g>
    </svg>
  );
}
