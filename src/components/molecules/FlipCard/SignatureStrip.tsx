interface SignatureStripProps {
  text: string;
  left: string;
  top: string;
  width: string;
  height: string;
}

// Faint diagonal hairlines standing in for a signature strip's woven
// anti-fraud pattern — a repeating gradient instead of hand-placed lines,
// same visual texture for far less markup.
const HATCH_PATTERN =
  "repeating-linear-gradient(70deg, transparent 0 18px, rgba(0,0,0,0.07) 18px 19px)";

/** The off-white, lined "signature strip" band used on both card backs. */
export default function SignatureStrip({ text, left, top, width, height }: SignatureStripProps) {
  return (
    <div
      className="absolute flex items-center overflow-hidden"
      style={{ left, top, width, height, borderRadius: 2, background: "#F0F0EC" }}
    >
      <div aria-hidden="true" className="absolute inset-0" style={{ backgroundImage: HATCH_PATTERN }} />
      <span className="font-caveat relative pl-[4%] font-bold text-[#0F0F0F]" style={{ fontSize: "4.9cqw" }}>
        {text}
      </span>
    </div>
  );
}
