import type { CSSProperties, ReactNode } from "react";
import { TerminalgraphShader } from "@/components/atoms/TerminalgraphShader";

interface TicketCardProps {
  /** Icon beside the eyebrow, sized by the card. */
  icon: ReactNode;
  eyebrow: string;
  title: string;
  description: string;
  /** Extra face content below the copy, e.g. a form. */
  children?: ReactNode;
  /** Small-caps line at the top of the stub, e.g. "Admit one". */
  admit: string;
  /** The stub's single field, e.g. { label: "Price", value: "1 post" }. Omit for an admit line only. */
  field?: { label: string; value: ReactNode };
  /** Printed under the barcode, e.g. "NO. 000001". */
  serial: string;
  /** Small artwork printed on the stub above the barcode, up to about 120×84. */
  art?: ReactNode;
  /** Sets the eyebrow (in sentence case) and the serial in Satoshi; the stub field and admit line stay mono. */
  sansLabels?: boolean;
  /** "large" gives the face and stub more room, for a ticket that heads a page. */
  size?: "default" | "large";
}

// Decorative barcode bar widths (px) — fixed so server and client render the same stripes.
const BARCODE = [2, 1, 1, 3, 1, 2, 1, 1, 2, 3, 1, 1, 2, 1, 3, 1, 2, 1, 1, 2, 1, 3, 1, 1, 2, 1, 2, 1];

// Notch radius (px) at each end of the tear line.
const NOTCH = 12;

// The stub sits below the face when stacked and beside it from sm up. --notch-a/b are the centres of
// the two cutouts on the tear line, so the mask follows the layout without measuring anything.
const NOTCHES =
  "[--notch-a:0_calc(100%_-_var(--stub))] [--notch-b:100%_calc(100%_-_var(--stub))] " +
  "sm:[--notch-a:calc(100%_-_var(--stub))_0] sm:[--notch-b:calc(100%_-_var(--stub))_100%]";
// Stacked, the stub is a fixed-height strip — taller when it carries art above the barcode. Beside
// the face it's a fixed width — wider on a large ticket.
const STUB_HEIGHT = "[--stub:7rem]";
const STUB_HEIGHT_WITH_ART = "[--stub:12.5rem]";
const STUB_WIDTH = "sm:[--stub:12rem]";
const STUB_WIDTH_LARGE = "sm:[--stub:14rem]";

// Punches both notches out of a layer. A real cutout (rather than a white circle painted on top)
// works on any page background and lets the outline follow the curve.
function notchMask(radius: number): CSSProperties {
  const hole = (at: string) => `radial-gradient(circle at ${at}, transparent ${radius}px, #000 ${radius + 0.5}px)`;
  const mask = `${hole("var(--notch-a)")}, ${hole("var(--notch-b)")}`;
  return { maskImage: mask, WebkitMaskImage: mask, maskComposite: "intersect" };
}

export default function TicketCard({ icon, eyebrow, title, description, children, admit, field, serial, art, sansLabels = false, size = "default" }: TicketCardProps) {
  const large = size === "large";
  const labelFont = sansLabels ? "font-sans" : "font-mono";
  // Sentence case doesn't need the letter-spacing that small caps do.
  const eyebrowCase = sansLabels ? "text-[12px]" : "text-[11px] uppercase tracking-[0.14em]";
  return (
    <div className={`relative isolate ${NOTCHES} ${art ? STUB_HEIGHT_WITH_ART : STUB_HEIGHT} ${large ? STUB_WIDTH_LARGE : STUB_WIDTH}`}>
      {/* Outline — the full silhouette in border grey. The face above is inset 1px and its notches are
          1px wider, so a hairline shows around the edge and the cutouts. Kept on its own layer so the
          shadow filter never re-runs for the animating shader. */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 drop-shadow-xs">
        <div className="size-full rounded-2xl bg-neutral-200" style={notchMask(NOTCH)} />
      </div>

      <div className="flex flex-col bg-white [clip-path:inset(1px_round_15px)] sm:flex-row" style={notchMask(NOTCH + 1)}>
        {/* Face — tickets with art get extra vertical room to balance the taller stub; large ones more. */}
        <div className={`relative isolate flex min-w-0 flex-1 flex-col justify-center p-6 sm:p-8 sm:pl-12 ${large ? "sm:py-16" : art ? "sm:py-12" : ""}`}>
          <TerminalgraphShader
            theme="light"
            background={{ dark: "#052e12", light: "#ffffff" }}
            className="pointer-events-none absolute inset-0 -z-10"
          />
          <p className={`flex items-start gap-1.5 ${labelFont} ${eyebrowCase} leading-4 text-neutral-500`}>
            <span aria-hidden="true" className="mt-px flex size-3.5 shrink-0 text-neutral-900 [&>svg]:size-full">
              {icon}
            </span>
            {eyebrow}
          </p>
          <h2 className="text-balance mt-3 text-2xl font-semibold text-neutral-900 sm:text-3xl">{title}</h2>
          <p className="text-pretty mt-4 max-w-lg text-[14px] leading-snug text-neutral-600">{description}</p>
          {children}
        </div>

        {/* Stub */}
        {/* With art, from sm up the stub is three rows — labels, art, barcode — with the spare height all in
            the middle row, so the art sits centred between the text and the barcode. */}
        <div
          className={`relative flex h-(--stub) shrink-0 flex-row items-end justify-between gap-6 px-6 py-5 sm:h-auto sm:w-(--stub) sm:py-6 ${
            art ? "sm:grid sm:grid-rows-[auto_1fr_auto] sm:items-start sm:justify-normal sm:gap-4" : "sm:flex-col sm:items-start sm:gap-4"
          }`}
        >
          {/* Perforation — stops short of the notches so the cut reads cleanly at both ends. */}
          <span
            aria-hidden="true"
            className="absolute inset-x-[18px] top-0 h-px -translate-y-1/2 bg-[repeating-linear-gradient(to_right,var(--color-neutral-300)_0_4px,transparent_4px_8px)] sm:inset-x-auto sm:inset-y-[18px] sm:left-0 sm:h-auto sm:w-px sm:-translate-x-1/2 sm:translate-y-0 sm:bg-[repeating-linear-gradient(to_bottom,var(--color-neutral-300)_0_4px,transparent_4px_8px)]"
          />
          <div className="flex flex-col gap-3 sm:gap-4">
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-neutral-500">{admit}</span>
            {field && (
              <div className="font-mono">
                <span className="block text-[11px] uppercase tracking-[0.18em] text-neutral-500">{field.label}</span>
                <span className="mt-1 block text-[22px] font-bold leading-none tabular-nums text-neutral-900">{field.value}</span>
              </div>
            )}
          </div>
          {/* Stacked, this column runs the strip's full height and the art centres in the room above the
              barcode. From sm up it dissolves so the art and barcode become the stub's middle and last
              rows: the art centred, the barcode full width at the bottom. */}
          <div className={`flex flex-col gap-3 ${art ? "self-stretch sm:contents" : ""}`}>
            {art && <div className="flex flex-1 items-center justify-center sm:self-center">{art}</div>}
            <div aria-hidden="true" className={`flex flex-col gap-1.5 ${art ? "sm:self-end" : ""}`}>
              {/* With art, the barcode stretches to match it when stacked and to the stub's width beside the face. */}
              <div className={`flex h-9 items-stretch gap-[2px] ${art ? "w-30 sm:w-full" : ""}`}>
                {BARCODE.map((width, i) => (
                  <span key={i} className="bg-neutral-900" style={art ? { flex: width } : { width }} />
                ))}
              </div>
              <span className={`${labelFont} text-[10px] tracking-[0.2em] text-neutral-500`}>{serial}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
