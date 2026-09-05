import { ReactNode } from "react";

interface LabeledFieldProps {
  label: string;
  hint?: string;
  children: ReactNode;
}

export default function LabeledField({ label, hint, children }: LabeledFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline gap-2">
        <label className="text-[13px] font-medium text-gray-600">{label}</label>
        {hint && <span className="text-[12px] text-gray-400">{hint}</span>}
      </div>
      {children}
    </div>
  );
}
