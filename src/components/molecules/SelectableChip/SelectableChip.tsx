interface SelectableChipProps {
  label: string;
  selected: boolean;
  onClick: () => void;
  /** dark = neutral selected state (audience size, deliverables); lime = accent selected state (niches, platforms) */
  tone?: "dark" | "lime";
}

export default function SelectableChip({ label, selected, onClick, tone = "dark" }: SelectableChipProps) {
  const selectedClass =
    tone === "lime" ? "bg-[#EDFFD0] border-[#EDFFD0] text-[#3A7A00]" : "bg-neutral-900 border-neutral-900 text-white";

  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "rounded-xl border px-4 py-2.5 text-[13px] font-medium transition-[background-color,border-color,color,transform] duration-[120ms] active:scale-[0.96]",
        selected ? selectedClass : "border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700",
      ].join(" ")}
    >
      {label}
    </button>
  );
}
