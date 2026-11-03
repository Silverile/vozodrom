import Svg, { Circle, Path } from "react-native-svg";

// Line icons in the web's traced style: 24-unit grid, round joins, stroke only.
const paths: Record<string, string[]> = {
  home: ["M3 11l9-7 9 7v9h-6v-6H9v6H3z"],
  search: ["M20 20l-4.5-4.5"],
  chat: ["M4 5h16v11H9l-5 4z"],
  user: ["M4 21c1-4 4-6 8-6s7 2 8 6"],
  car: ["M4 15l2.2-6h11.6L20 15v4H4z", "M4 15h16"],
  machine: ["M3 17h10V9h4l3 4.5V17h-2", "M3 17V7h8"],
  part: [],
  book: ["M6 4h9l3 3v13H6z", "M9 11h6M9 15h6"],
  garage: ["M3 11l9-6 9 6v9H3z"],
  heart: ["M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"],
  back: ["M15 5l-7 7 7 7"],
  close: ["M6 6l12 12M18 6L6 18"],
  chevron: ["M9 5l7 7-7 7"],
  filter: ["M4 6h16M7 12h10M10 18h4"],
  sort: ["M8 4v16M4 8l4-4 4 4M16 20V4M12 16l4 4 4-4"],
  bell: ["M6 16V11a6 6 0 0 1 12 0v5l2 2H4z", "M10 20a2 2 0 0 0 4 0"],
  phone: ["M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"],
  settings: ["M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1"],
  check: ["M5 12l5 5 9-10"],
  warn: ["M12 4l9 16H3z", "M12 10v4M12 17v.5"],
  share: ["M12 4v12M7 9l5-5 5 5M5 14v6h14v-6"],
  plus: ["M12 5v14M5 12h14"],
  send: ["M12 19V5M5 12l7-7 7 7"],
};

const circles: Record<string, [number, number, number][]> = {
  search: [[11, 11, 6]],
  user: [[12, 8, 4]],
  car: [[8, 15.5, 1.3], [16, 15.5, 1.3]],
  machine: [[7, 18, 2], [17, 18, 2]],
  part: [[12, 12, 8], [12, 12, 3]],
  settings: [[12, 12, 4]],
};

export type IconName = keyof typeof paths;

export function Icon({ name, size = 24, color, strokeWidth = 1.9 }: { name: IconName; size?: number; color: string; strokeWidth?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      {(circles[name] ?? []).map(([cx, cy, r], i) => <Circle key={`c${i}`} cx={cx} cy={cy} r={r} />)}
      {paths[name].map((d, i) => <Path key={i} d={d} />)}
    </Svg>
  );
}
