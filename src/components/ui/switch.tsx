"use client"

import * as React from "react"
import { Switch as SwitchPrimitive, type SwitchRootState } from "@base-ui/react/switch"
import { cn } from "@/lib/utils"

/**
 * A shared, accessible switch primitive styled for Creatorshop's neutral UI.
 * Built with the same Base UI foundation as the project's shadcn-style tabs.
 */
function Switch({ className, ...props }: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  const baseClassName = "inline-flex h-6 w-10 shrink-0 cursor-pointer items-center rounded-full bg-neutral-200 p-0.5 outline-none transition-[background-color,box-shadow] duration-150 hover:bg-neutral-300 focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 data-[checked]:bg-neutral-950 data-[checked]:hover:bg-neutral-800 data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50"
  const resolvedClassName = typeof className === "function"
    ? (state: SwitchRootState) => cn(baseClassName, className(state))
    : cn(baseClassName, className)

  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={resolvedClassName}
      {...props}
    >
      <SwitchPrimitive.Thumb className="size-5 rounded-full bg-white shadow-[0_1px_2px_rgba(0,0,0,0.16)] transition-transform duration-150 data-[checked]:translate-x-4" />
    </SwitchPrimitive.Root>
  )
}

export { Switch }
