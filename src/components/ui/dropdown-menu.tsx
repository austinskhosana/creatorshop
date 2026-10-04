"use client"

import * as React from "react"
import { Menu as MenuPrimitive } from "@base-ui/react/menu"
import { cn } from "@/lib/utils"

/**
 * shadcn-style DropdownMenu on Base UI. Positioning flips to stay on screen, the popup is portalled
 * so card overflow can't clip it, and typeahead, arrow keys, Escape and focus return come built in.
 */

function DropdownMenu(props: React.ComponentProps<typeof MenuPrimitive.Root>) {
  return <MenuPrimitive.Root data-slot="dropdown-menu" {...props} />
}

function DropdownMenuTrigger(props: React.ComponentProps<typeof MenuPrimitive.Trigger>) {
  return <MenuPrimitive.Trigger data-slot="dropdown-menu-trigger" {...props} />
}

/** The popup's surface, shared with the context menu so both read as one family. */
export const MENU_POPUP_CLASS =
  "min-w-48 origin-[var(--transform-origin)] rounded-xl border border-neutral-200 bg-white p-1 shadow-[0_8px_24px_rgba(0,0,0,0.08)] outline-none transition-[opacity,transform] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] data-[ending-style]:scale-[0.97] data-[ending-style]:opacity-0 data-[starting-style]:scale-[0.97] data-[starting-style]:opacity-0 motion-reduce:data-[ending-style]:scale-100 motion-reduce:data-[starting-style]:scale-100"

function DropdownMenuContent({
  className,
  side = "bottom",
  align = "end",
  sideOffset = 6,
  ...props
}: React.ComponentProps<typeof MenuPrimitive.Popup> & Pick<React.ComponentProps<typeof MenuPrimitive.Positioner>, "side" | "align" | "sideOffset">) {
  return (
    <MenuPrimitive.Portal>
      <MenuPrimitive.Positioner side={side} align={align} sideOffset={sideOffset} className="z-50 outline-none">
        <MenuPrimitive.Popup
          data-slot="dropdown-menu-content"
          className={cn(MENU_POPUP_CLASS, className as string)}
          {...props}
        />
      </MenuPrimitive.Positioner>
    </MenuPrimitive.Portal>
  )
}

function DropdownMenuItem({ className, variant = "default", ...props }: React.ComponentProps<typeof MenuPrimitive.Item> & { variant?: "default" | "destructive" }) {
  return (
    <MenuPrimitive.Item
      data-slot="dropdown-menu-item"
      data-variant={variant}
      className={cn(
        "flex min-h-9 cursor-default items-center gap-2.5 rounded-lg px-2.5 text-[13px] font-medium outline-none select-none transition-colors duration-100 data-[disabled]:cursor-not-allowed data-[disabled]:opacity-40 [&_svg]:size-4 [&_svg]:shrink-0",
        variant === "destructive" ? "text-red-600 data-[highlighted]:bg-red-50" : "text-neutral-700 data-[highlighted]:bg-neutral-100 data-[highlighted]:text-neutral-950",
        className as string,
      )}
      {...props}
    />
  )
}

function DropdownMenuSeparator({ className, ...props }: React.ComponentProps<typeof MenuPrimitive.Separator>) {
  return <MenuPrimitive.Separator data-slot="dropdown-menu-separator" className={cn("-mx-1 my-1 h-px bg-neutral-100", className as string)} {...props} />
}

export { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger }
