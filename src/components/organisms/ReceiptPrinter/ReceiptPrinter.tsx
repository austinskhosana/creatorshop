"use client";

import { CheckIcon } from "@heroicons/react/24/solid";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  type ComponentPropsWithoutRef,
  createContext,
  type ReactNode,
  useContext,
} from "react";
import { MeshGradientPanel } from "@/components/atoms/MeshGradientPanel";
import { cn } from "@/lib/utils";

export type ReceiptPrinterStage = "processing" | "printing" | "complete";
export type ReceiptFeedMotion = "smooth" | "stepped";
export type ReceiptPrinterTone = "dark" | "light";

export type ReceiptPrinterRootProps = Omit<
  ComponentPropsWithoutRef<"section">,
  "children"
> & {
  /** Disables all stage transitions when false. */
  animate?: boolean;
  children: ReactNode;
  /** Controls whether the paper feeds continuously or one line at a time. */
  feedMotion?: ReceiptFeedMotion;
  /** Current state of the printer. */
  stage: ReceiptPrinterStage;
  /** Colour palette of the machine. Defaults to the dark plastic body. */
  tone?: ReceiptPrinterTone;
  /** Wraps the machine in the animated metal-shader ring. */
  metalBorder?: boolean;
};

export type ReceiptPrinterMachineProps = ComponentPropsWithoutRef<"div">;
export type ReceiptPrinterHeaderProps = ComponentPropsWithoutRef<"div">;
export type ReceiptPrinterScreenProps = ComponentPropsWithoutRef<"div">;
export type ReceiptPrinterOutputProps = ComponentPropsWithoutRef<"div">;
export type ReceiptPrinterPaperProps = ComponentPropsWithoutRef<"article">;

export type ReceiptPrinterStatusProps = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> & {
  /** Custom status content. Defaults to a label derived from the current stage. */
  children?: ReactNode;
};

type ReceiptPrinterContextValue = {
  animate: boolean;
  feedMotion: ReceiptFeedMotion;
  shouldMove: boolean;
  stage: ReceiptPrinterStage;
  tone: ReceiptPrinterTone;
  metalBorder: boolean;
};

const ReceiptPrinterContext = createContext<ReceiptPrinterContextValue | null>(
  null,
);

const easeOut = [0.23, 1, 0.32, 1] as const;
const easeInOut = [0.77, 0, 0.175, 1] as const;

const receiptToothCount = 40;
const receiptToothDepth = 4;
const receiptToothPoints = Array.from(
  { length: receiptToothCount * 2 },
  (_, index) => {
    const x = 100 - ((index + 1) * 100) / (receiptToothCount * 2);
    const y = index % 2 === 0 ? "100%" : `calc(100% - ${receiptToothDepth}px)`;

    return `${x}% ${y}`;
  },
).join(", ");
const receiptClipPath = `polygon(0 0, 100% 0, 100% calc(100% - ${receiptToothDepth}px), ${receiptToothPoints})`;

// The paper feeds out one "line" at a time: it holds still, then jumps. Each
// pair of keyframes is a hold, and the times below give each hold its beat.
const printingTransformKeyframes = [
  "translateY(calc(-100% + 2px))",
  "translateY(-91%)",
  "translateY(-91%)",
  "translateY(-81%)",
  "translateY(-81%)",
  "translateY(-70%)",
  "translateY(-70%)",
  "translateY(-58%)",
  "translateY(-58%)",
  "translateY(-45%)",
  "translateY(-45%)",
  "translateY(-32%)",
  "translateY(-32%)",
  "translateY(-20%)",
  "translateY(-20%)",
  "translateY(-10%)",
  "translateY(-10%)",
  "translateY(-3%)",
  "translateY(-3%)",
  "translateY(0%)",
];

const printingKeyframeTimes = [
  0, 0.075, 0.105, 0.18, 0.21, 0.285, 0.315, 0.39, 0.42, 0.495, 0.525, 0.6,
  0.63, 0.705, 0.735, 0.81, 0.84, 0.915, 0.945, 1,
];

const statusLabels: Record<ReceiptPrinterStage, ReactNode> = {
  processing: "Processing your order",
  printing: "Printing your receipt",
  complete: "Order complete",
};

const machineBaseClassName =
  "relative isolate w-full overflow-hidden rounded-[var(--printer-radius)] border p-[var(--printer-inset)] pb-8 [--printer-inner-radius:calc(var(--printer-radius)_-_var(--printer-inset))] [--printer-inset:0.75rem] [--printer-radius:1.5rem]";

const toneClassNames: Record<
  ReceiptPrinterTone,
  {
    machine: string;
    border: string;
    slot: string;
    lip: string;
    screen: string;
    status: string;
    working: string;
    paperEdge: string;
  }
> = {
  dark: {
    border: "border-neutral-950",
    machine:
      "bg-neutral-800 shadow-[0_20px_36px_-20px_rgba(10,10,10,0.55),0_6px_14px_-8px_rgba(10,10,10,0.24),inset_0_1px_0_rgba(255,255,255,0.14),inset_0_-1px_0_rgba(10,10,10,0.55)]",
    slot: "border-neutral-950 bg-neutral-950 shadow-neutral-950",
    lip: "bg-white/10",
    screen:
      "border-neutral-950 bg-neutral-950 text-neutral-50 shadow-neutral-950/80 after:shadow-[inset_0_0_24px_4px_rgba(10,10,10,0.52)]",
    status: "text-neutral-300",
    working: "text-neutral-400",
    paperEdge: "bg-neutral-950/75",
  },
  light: {
    border: "border-neutral-300",
    machine:
      "bg-white bg-[linear-gradient(180deg,#ffffff_0%,#f7f7f7_100%)] shadow-[0_20px_36px_-20px_rgba(10,10,10,0.22),0_6px_14px_-8px_rgba(10,10,10,0.1),inset_0_1px_0_rgba(255,255,255,1),inset_0_0_0_2px_rgba(255,255,255,0.7),inset_0_-2px_0_rgba(10,10,10,0.06)]",
    slot: "border-neutral-600 bg-neutral-700 shadow-black/60",
    lip: "bg-white shadow-[0_1px_0_rgba(10,10,10,0.05)]",
    screen:
      "border-neutral-200 bg-white text-neutral-950 shadow-neutral-950/7 after:shadow-[inset_0_2px_6px_rgba(10,10,10,0.07),inset_0_0_16px_1px_rgba(10,10,10,0.035)]",
    status: "text-neutral-600",
    working: "text-neutral-500",
    paperEdge: "bg-neutral-950/30",
  },
};

function useReceiptPrinter(component: string) {
  const context = useContext(ReceiptPrinterContext);

  if (!context) {
    throw new Error(`${component} must be used inside ReceiptPrinter.Root.`);
  }

  return context;
}

function ReceiptPrinterRoot({
  "aria-label": ariaLabel = "Receipt printer",
  animate = true,
  children,
  className,
  feedMotion = "stepped",
  metalBorder = false,
  stage,
  tone = "dark",
  ...props
}: ReceiptPrinterRootProps) {
  const shouldReduceMotion = useReducedMotion();
  const context = {
    animate,
    feedMotion,
    shouldMove: animate && !shouldReduceMotion,
    stage,
    tone,
    metalBorder,
  };

  return (
    <ReceiptPrinterContext.Provider value={context}>
      <section
        aria-label={ariaLabel}
        className={cn(
          "relative isolate flex w-full max-w-sm flex-col items-center",
          className,
        )}
        data-stage={stage}
        data-tone={tone}
        {...props}
      >
        {children}
      </section>
    </ReceiptPrinterContext.Provider>
  );
}

const metalRingRadius = 29;
const metalRingWidth = 5;

function ReceiptPrinterMachine({
  children,
  className,
  ...props
}: ReceiptPrinterMachineProps) {
  const { metalBorder, tone } = useReceiptPrinter("ReceiptPrinter.Machine");
  const tones = toneClassNames[tone];

  const body = (
    <div
      className={cn(
        machineBaseClassName,
        tones.machine,
        metalBorder ? "border-transparent" : tones.border,
        className,
      )}
      {...props}
    >
      {children}
      <div
        aria-hidden="true"
        className={cn(
          "absolute inset-x-6 bottom-[var(--printer-inset)] z-40 h-2 rounded-[0.25rem] border shadow-inner",
          tones.slot,
        )}
      />
      <div
        aria-hidden="true"
        className={cn(
          "absolute inset-x-6 bottom-[calc(var(--printer-inset)-2px)] z-30 h-0.5 rounded-b-full",
          tones.lip,
        )}
      />
    </div>
  );

  if (!metalBorder) return body;

  return (
    <MeshGradientPanel
      borderWidth={metalRingWidth}
      className="w-full p-[5px] shadow-[0_20px_36px_-20px_rgba(10,10,10,0.3),0_6px_14px_-8px_rgba(10,10,10,0.14)]"
      radius={metalRingRadius}
      shaded={false}
    >
      {body}
    </MeshGradientPanel>
  );
}

function ReceiptPrinterHeader({
  children,
  className,
  ...props
}: ReceiptPrinterHeaderProps) {
  return (
    <div
      className={cn(
        "relative z-10 flex h-11 items-start justify-between",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

function ReceiptPrinterScreen({
  children,
  className,
  ...props
}: ReceiptPrinterScreenProps) {
  const { tone } = useReceiptPrinter("ReceiptPrinter.Screen");

  return (
    <div
      className={cn(
        "relative z-10 isolate overflow-hidden rounded-[var(--printer-inner-radius)] border p-4 shadow-inner after:pointer-events-none after:absolute after:inset-0 after:z-20 after:rounded-[inherit] after:content-['']",
        toneClassNames[tone].screen,
        className,
      )}
      {...props}
    >
      <div className="relative z-10">{children}</div>
    </div>
  );
}

function Spinner() {
  return (
    <svg
      className="size-[18px] animate-spin motion-reduce:animate-none"
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeWidth="3"
      />
      <path
        d="M21 12a9 9 0 0 0-9-9"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="3"
      />
    </svg>
  );
}

function StatusIndicator({
  animate,
  move,
  stage,
  tone,
}: {
  animate: boolean;
  move: boolean;
  stage: ReceiptPrinterStage;
  tone: ReceiptPrinterTone;
}) {
  const isComplete = stage === "complete";

  return (
    <span
      aria-hidden="true"
      className="relative grid size-5 shrink-0 place-items-center"
    >
      <AnimatePresence initial={false} mode="sync">
        {isComplete ? (
          <motion.span
            animate={{ opacity: 1, transform: "scale(1)" }}
            className="col-start-1 row-start-1 grid size-[18px] place-items-center rounded-full bg-[#A3FF38] text-neutral-950"
            exit={{
              opacity: animate ? 0 : 1,
              transform: move ? "scale(0.96)" : "scale(1)",
            }}
            initial={{
              opacity: animate ? 0 : 1,
              transform: move ? "scale(0.94)" : "scale(1)",
            }}
            key="complete"
            transition={{ duration: animate ? 0.16 : 0, ease: easeOut }}
          >
            <CheckIcon className="size-3" />
          </motion.span>
        ) : (
          <motion.span
            animate={{ opacity: 1, transform: "scale(1)" }}
            className={cn(
              "col-start-1 row-start-1 grid place-items-center",
              toneClassNames[tone].working,
            )}
            exit={{
              opacity: animate ? 0 : 1,
              transform: move ? "scale(0.96)" : "scale(1)",
            }}
            initial={{
              opacity: animate ? 0 : 1,
              transform: move ? "scale(0.94)" : "scale(1)",
            }}
            key="working"
            transition={{ duration: animate ? 0.16 : 0, ease: easeOut }}
          >
            <Spinner />
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}

function ReceiptPrinterStatus({
  children,
  className,
  ...props
}: ReceiptPrinterStatusProps) {
  const { animate, shouldMove, stage, tone } = useReceiptPrinter(
    "ReceiptPrinter.Status",
  );

  return (
    <div
      className={cn("flex min-w-0 items-center gap-2", className)}
      {...props}
    >
      <StatusIndicator
        animate={animate}
        move={shouldMove}
        stage={stage}
        tone={tone}
      />
      <div
        aria-live="polite"
        className="grid min-w-0 flex-1 items-center"
        role="status"
      >
        <AnimatePresence initial={false} mode="sync">
          <motion.div
            animate={{ opacity: 1, transform: "translateY(0px)" }}
            className={cn(
              "col-start-1 row-start-1 truncate text-xs leading-4 font-medium",
              toneClassNames[tone].status,
            )}
            exit={{
              opacity: animate ? 0 : 1,
              transform: shouldMove ? "translateY(-4px)" : "translateY(0px)",
            }}
            initial={{
              opacity: animate ? 0 : 1,
              transform: shouldMove ? "translateY(4px)" : "translateY(0px)",
            }}
            key={stage}
            transition={{ duration: animate ? 0.18 : 0, ease: easeOut }}
          >
            {children ?? statusLabels[stage]}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function ReceiptPrinterPaper({
  children,
  className,
  style,
  ...props
}: ReceiptPrinterPaperProps) {
  return (
    <article
      className={cn(
        "relative z-10 min-h-80 bg-white px-6 pt-7 pb-8 font-mono text-neutral-950",
        className,
      )}
      style={{ clipPath: receiptClipPath, ...style }}
      {...props}
    >
      {children}
    </article>
  );
}

function ReceiptPrinterOutput({
  children,
  className,
  ...props
}: ReceiptPrinterOutputProps) {
  const { animate, feedMotion, metalBorder, shouldMove, stage, tone } =
    useReceiptPrinter("ReceiptPrinter.Output");
  const isReceiptVisible = stage !== "processing";
  const shouldUseSteppedFeed =
    feedMotion === "stepped" && stage === "printing" && shouldMove;

  return (
    <div
      className={cn(
        "relative z-50 w-[calc(80%+3rem)] max-w-full overflow-hidden px-6 pb-10",
        metalBorder ? "-mt-[21px]" : "-mt-4",
        className,
      )}
      {...props}
    >
      {isReceiptVisible ? (
        <div
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute inset-x-6 -top-1 z-20 h-2 blur-[6px]",
            toneClassNames[tone].paperEdge,
          )}
        />
      ) : null}

      <motion.div
        animate={{
          opacity: isReceiptVisible ? 1 : 0,
          transform:
            stage === "printing" && shouldMove
              ? shouldUseSteppedFeed
                ? printingTransformKeyframes
                : "translateY(0%)"
              : isReceiptVisible || !shouldMove
                ? "translateY(0%)"
                : "translateY(calc(-100% + 2px))",
        }}
        aria-hidden={stage !== "complete"}
        className="relative isolate before:pointer-events-none before:absolute before:inset-x-3 before:top-3 before:bottom-4 before:z-0 before:rounded-sm before:shadow-[0_8px_24px_rgba(10,10,10,0.24)] before:content-[''] after:pointer-events-none after:absolute after:right-[8%] after:bottom-0 after:left-[8%] after:z-0 after:h-3 after:translate-y-1.5 after:rounded-full after:bg-neutral-950/10 after:blur-lg after:content-['']"
        initial={false}
        transition={{
          opacity: { duration: animate ? 0.16 : 0, ease: easeOut },
          transform: {
            duration: shouldMove ? 1.75 : 0,
            ease: shouldUseSteppedFeed ? "linear" : easeInOut,
            times: shouldUseSteppedFeed ? printingKeyframeTimes : undefined,
          },
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}

export const ReceiptPrinter = {
  Header: ReceiptPrinterHeader,
  Machine: ReceiptPrinterMachine,
  Output: ReceiptPrinterOutput,
  Paper: ReceiptPrinterPaper,
  Root: ReceiptPrinterRoot,
  Screen: ReceiptPrinterScreen,
  Status: ReceiptPrinterStatus,
};
