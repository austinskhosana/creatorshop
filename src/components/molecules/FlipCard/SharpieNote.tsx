interface SharpieNoteProps {
  lines: [string, string];
  left: string;
  top: string;
  /** Tilt in degrees. Negative leans the right edge down, positive leans it up. */
  rotate?: number;
}

/** The handwritten two-line marker note used on both card backs. */
export default function SharpieNote({ lines, left, top, rotate = -6 }: SharpieNoteProps) {
  return (
    <div
      className="font-caveat absolute leading-[1.05] font-bold text-[#0F0F0F]"
      style={{ left, top, fontSize: "6.7cqw", transform: `rotate(${rotate}deg)` }}
    >
      <div>{lines[0]}</div>
      <div>{lines[1]}</div>
    </div>
  );
}
