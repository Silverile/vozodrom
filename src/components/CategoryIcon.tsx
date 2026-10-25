// Line pictograms for the non-car categories, drawn in the same outlined style as
// CarImage. Wheels are filled with the photo colour so they cut the body outline.
// Stroke follows the text colour, so the icons work in both themes.

const W = ({ cx, cy = 34, r = 6 }: { cx: number; cy?: number; r?: number }) => (
  <g>
    <circle cx={cx} cy={cy} r={r} style={{ fill: "var(--color-photo)" }} />
    <circle cx={cx} cy={cy} r={r * 0.42} />
  </g>
);

const BODY = { fill: "var(--color-brand-soft)" } as const;

const ICONS: Record<string, React.ReactNode> = {
  // utility vehicles and machinery
  dodavky: (
    <>
      <path d="M4 34 V14 Q4 9 9 9 H41 L51 19 H55 Q60 20 60 25 V34 Z" style={BODY} />
      <path d="M42 12 L48 19 H42 Z M30 11 V32" />
      <W cx={15} /><W cx={49} />
    </>
  ),
  nakladni: (
    <>
      <path d="M3 8 H38 V32 H3 Z" style={BODY} />
      <path d="M38 16 H50 L57 24 V34 H38 Z" style={BODY} />
      <path d="M41 19 H49 L53 24 H41 Z" />
      <W cx={12} /><W cx={48} />
    </>
  ),
  tahace: (
    <>
      <path d="M30 34 V10 Q30 6 34 6 H46 Q50 6 51 10 L54 20 V34 Z" style={BODY} />
      <path d="M34 10 H46 L49 18 H34 Z M4 30 H30 M6 26 H22" />
      <W cx={12} /><W cx={24} /><W cx={45} />
    </>
  ),
  autobusy: (
    <>
      <path d="M3 32 V10 Q3 6 7 6 H56 Q61 6 61 11 V32 Z" style={BODY} />
      <path d="M7 10 H15 V18 H7 Z M19 10 H27 V18 H19 Z M31 10 H39 V18 H31 Z M43 10 H49 V30 H43 Z M53 10 H58 V20 H53 Z" />
      <W cx={14} /><W cx={52} />
    </>
  ),
  zemedelska: (
    <>
      <path d="M14 26 V12 L16 5 H31 V22 H54 Q58 22 58 26 V31 H14 Z" style={BODY} />
      <path d="M18 9 H28 V18 H18 Z M42 22 V13" />
      <W cx={20} cy={31} r={10} /><W cx={51} cy={35} r={5} />
    </>
  ),
  stavebni: (
    <>
      <path d="M7 36 Q4 36 4 33 Q4 30 7 30 H38 Q41 30 41 33 Q41 36 38 36 Z" style={BODY} />
      <path d="M10 30 V17 H28 V30 Z" style={BODY} />
      <path d="M19 20 H25 V26 H19 Z M28 20 L43 8 L55 21 M50 21 L60 23 L56 31 L49 28 Z" />
    </>
  ),
  privesy: (
    <>
      <path d="M8 10 H50 V30 H8 Z" style={BODY} />
      <path d="M50 26 L62 28 M8 30 V33" />
      <W cx={29} />
    </>
  ),
  // motorcycles
  motocykly: (
    <>
      <path d="M24 18 H38 L41 23 H22 Z" style={BODY} />
      <path d="M12 32 L23 22 M41 23 L50 32 M29 23 L33 32 H40 M43 12 L46 22 M41 12 H47" />
      <W cx={12} cy={32} r={8} /><W cx={50} cy={32} r={8} />
    </>
  ),
  skutry: (
    <>
      <path d="M10 30 Q10 22 18 22 H33 Q37 22 38 28 L40 30 Z" style={BODY} />
      <path d="M40 30 L45 10 H51 M15 20 H29" />
      <W cx={15} cy={33} r={6} /><W cx={47} cy={33} r={6} />
    </>
  ),
  ctyrkolky: (
    <>
      <path d="M7 24 H57 L52 17 H40 L36 22 H26 V17 H14 Z" style={BODY} />
      <path d="M44 17 L46 10 H53" />
      <W cx={15} cy={31} r={8} /><W cx={49} cy={31} r={8} />
    </>
  ),
  vybava: (
    <>
      <path d="M8 34 Q8 8 32 8 Q56 8 56 27 V34 Z" style={BODY} />
      <path d="M30 16 H54 V26 H34 Q30 26 30 22 Z" />
    </>
  ),
  // parts
  motor: (
    <>
      <path d="M10 14 H48 V33 H10 Z" style={BODY} />
      <path d="M18 14 V8 H40 V14 M48 19 H56 V28 H48 M4 20 H10 V28 H4 M16 21 H42 M16 26 H42" />
    </>
  ),
  podvozek: (
    <>
      <circle cx="30" cy="22" r="16" style={BODY} />
      <circle cx="30" cy="22" r="6" />
      <path d="M40 7 Q52 12 52 24 L45 24 Q45 15 37 12 Z" style={{ fill: "var(--color-accent)" }} />
    </>
  ),
  karoserie: (
    <>
      <path d="M14 5 H44 Q50 5 52 11 L55 36 H14 Z" style={BODY} />
      <path d="M18 9 H42 L46 20 H18 Z M22 26 H31" />
    </>
  ),
  elektro: (
    <>
      <path d="M32 5 Q19 5 19 18 Q19 24 25 28 V32 H39 V28 Q45 24 45 18 Q45 5 32 5 Z" style={BODY} />
      <path d="M27 36 H37 M28 20 L32 16 L36 20" />
    </>
  ),
  interier: (
    <path d="M18 35 L23 6 Q24 4 27 4 H32 Q35 4 34 7 L30 26 H46 Q50 26 50 30 V35 Z" style={BODY} />
  ),
  kola: (
    <>
      <circle cx="32" cy="21" r="16" style={BODY} />
      <circle cx="32" cy="21" r="4" />
      {[0, 72, 144, 216, 288].map((d) => {
        const a = ((d - 90) * Math.PI) / 180;
        return <path key={d} d={`M${32 + Math.cos(a) * 5} ${21 + Math.sin(a) * 5} L${32 + Math.cos(a) * 15} ${21 + Math.sin(a) * 15}`} />;
      })}
    </>
  ),
};

function Tyre({ season }: { season: "letni" | "zimni" | "celorocni" }) {
  const sun = (
    <g style={{ stroke: "var(--color-warn)" }}>
      <circle cx="51" cy="10" r="4" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((d) => {
        const a = (d * Math.PI) / 180;
        return <path key={d} d={`M${51 + Math.cos(a) * 6} ${10 + Math.sin(a) * 6} L${51 + Math.cos(a) * 8} ${10 + Math.sin(a) * 8}`} />;
      })}
    </g>
  );
  const flake = (x: number) => (
    <path d={`M${x} 3 V17 M${x - 6} 6.5 L${x + 6} 13.5 M${x - 6} 13.5 L${x + 6} 6.5`} style={{ stroke: "var(--color-info)" }} />
  );
  return (
    <>
      <circle cx="28" cy="22" r="17" style={{ fill: "#14171b", strokeWidth: 2.4 }} />
      <circle cx="28" cy="22" r="9" style={{ fill: "#c9ced6" }} />
      <circle cx="28" cy="22" r="3" />
      {season === "letni" && sun}
      {season === "zimni" && flake(52)}
      {season === "celorocni" && (
        <>
          {sun}
          <g transform="translate(-14 22) scale(0.8)">{flake(64)}</g>
        </>
      )}
    </>
  );
}

export function CategoryIcon({ slug, className = "" }: { slug: string; className?: string }) {
  const content = slug === "letni" || slug === "zimni" || slug === "celorocni" ? <Tyre season={slug} /> : ICONS[slug];
  return (
    <svg
      viewBox="0 0 64 42"
      className={className}
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
      strokeLinecap="round"
    >
      {content}
    </svg>
  );
}
