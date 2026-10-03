"use client"

import * as React from "react"
import { Popover as PopoverPrimitive } from "@base-ui/react/popover"
import { cn } from "@/lib/utils"

/**
 * shadcn-style Popover on Base UI, styled like the project's DropdownMenu. The popup is portalled
 * and flips to stay on screen; Escape, outside clicks and focus return come built in.
 */

function Popover(props: React.ComponentProps<typeof PopoverPrimitive.Root>) {
  return <PopoverPrimitive.Root data-slot="popover" {...props} />
}

function PopoverTrigger(props: React.ComponentProps<typeof PopoverPrimitive.Trigger>) {
  return <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />
}

function PopoverTitle(props: React.ComponentProps<typeof PopoverPrimitive.Title>) {
  return <PopoverPrimitive.Title data-slot="popover-title" {...props} />
}

function PopoverContent({
  className,
  side = "bottom",
  align = "end",
  sideOffset = 8,
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Popup> & Pick<React.ComponentProps<typeof PopoverPrimitive.Positioner>, "side" | "align" | "sideOffset">) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Positioner side={side} align={align} sideOffset={sideOffset} collisionPadding={16} className="z-50 outline-none">
        <PopoverPrimitive.Popup
          data-slot="popover-content"
          className={cn(
            "origin-[var(--transform-origin)] rounded-2xl border border-neutral-200 bg-white p-4 shadow-[0_12px_32px_rgba(0,0,0,0.08)] outline-none transition-[opacity,transform] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] data-[ending-style]:scale-[0.97] data-[ending-style]:opacity-0 data-[starting-style]:scale-[0.97] data-[starting-style]:opacity-0 motion-reduce:data-[ending-style]:scale-100 motion-reduce:data-[starting-style]:scale-100",
            className as string,
          )}
          {...props}
        />
      </PopoverPrimitive.Positioner>
    </PopoverPrimitive.Portal>
  )
}

export { Popover, PopoverContent, PopoverTitle, PopoverTrigger }
