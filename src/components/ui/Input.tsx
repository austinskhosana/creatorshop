import { InputHTMLAttributes, ReactNode, useId } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
}

export default function Input({
  label,
  hint,
  error,
  iconLeft,
  iconRight,
  className,
  id: externalId,
  ...props
}: InputProps) {
  const generatedId = useId();
  const id = externalId ?? generatedId;
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-neutral-800">
          {label}
          {props.required && <span aria-hidden="true" className="text-red-500 ml-0.5">*</span>}
        </label>
      )}

      <div className="relative">
        {iconLeft && (
          <span aria-hidden="true" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            {iconLeft}
          </span>
        )}
        <input
          id={id}
          aria-describedby={[hint && hintId, error && errorId].filter(Boolean).join(" ") || undefined}
          aria-invalid={error ? true : undefined}
          className={cn(
            "w-full rounded-xl border bg-white text-sm text-neutral-900 placeholder:text-gray-400",
            "px-3.5 py-2.5 transition-[border-color,box-shadow] duration-150",
            "focus:outline-none focus:ring-2 focus:ring-offset-0",
            iconLeft ? "pl-9" : undefined,
            iconRight ? "pr-9" : undefined,
            error
              ? "border-red-300 focus:border-red-400 focus:ring-red-200"
              : "border-gray-200 focus:border-neutral-400 focus:ring-neutral-200",
            className,
          )}
          {...props}
        />
        {iconRight && (
          <span aria-hidden="true" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            {iconRight}
          </span>
        )}
      </div>

      {hint && !error && (
        <p id={hintId} className="text-xs text-gray-400 leading-relaxed">{hint}</p>
      )}
      {error && (
        <p id={errorId} role="alert" className="text-xs text-red-500 leading-relaxed">{error}</p>
      )}
    </div>
  );
}
