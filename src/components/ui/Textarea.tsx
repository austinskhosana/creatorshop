import { TextareaHTMLAttributes, useId } from "react";
import { cn } from "@/lib/utils";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  hint?: string;
  error?: string;
  maxChars?: number;
  currentLength?: number;
}

export default function Textarea({
  label,
  hint,
  error,
  maxChars,
  currentLength,
  className,
  id: externalId,
  ...props
}: TextareaProps) {
  const generatedId = useId();
  const id = externalId ?? generatedId;
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  const counterId = `${id}-counter`;

  const nearLimit = maxChars && currentLength !== undefined && currentLength >= maxChars * 0.9;

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <div className="flex items-center justify-between">
          <label htmlFor={id} className="text-sm font-medium text-neutral-800">
            {label}
            {props.required && <span aria-hidden="true" className="text-red-500 ml-0.5">*</span>}
          </label>
          {maxChars !== undefined && currentLength !== undefined && (
            <span
              id={counterId}
              aria-live="polite"
              className={cn(
                "text-xs tabular-nums",
                nearLimit ? "text-red-500" : "text-gray-400",
              )}
            >
              {currentLength}/{maxChars}
            </span>
          )}
        </div>
      )}

      <textarea
        id={id}
        aria-describedby={[hint && hintId, error && errorId, maxChars != null && counterId].filter(Boolean).join(" ") || undefined}
        aria-invalid={error ? true : undefined}
        className={cn(
          "w-full rounded-xl border bg-white text-sm text-neutral-900 placeholder:text-gray-400",
          "px-3.5 py-2.5 transition-[border-color,box-shadow] duration-150 resize-none",
          "focus:outline-none focus:ring-2 focus:ring-offset-0",
          error
            ? "border-red-300 focus:border-red-400 focus:ring-red-200"
            : "border-gray-200 focus:border-neutral-400 focus:ring-neutral-200",
          className,
        )}
        {...props}
      />

      {hint && !error && (
        <p id={hintId} className="text-xs text-gray-400 leading-relaxed">{hint}</p>
      )}
      {error && (
        <p id={errorId} role="alert" className="text-xs text-red-500 leading-relaxed">{error}</p>
      )}
    </div>
  );
}
