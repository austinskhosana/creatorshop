"use client"

import * as React from "react"
import { AlertDialog as AlertDialogPrimitive } from "@base-ui/react/alert-dialog"
import { cn } from "@/lib/utils"

/**
 * shadcn-style AlertDialog on Base UI — a confirmation that can't be dismissed by clicking outside,
 * for actions with real consequences (closing a product page, cancelling a subscription).
 */

function AlertDialog(props: React.ComponentProps<typeof AlertDialogPrimitive.Root>) {
  return <AlertDialogPrimitive.Root data-slot="alert-dialog" {...props} />
}

function AlertDialogContent({ className, children, ...props }: React.ComponentProps<typeof AlertDialogPrimitive.Popup>) {
  return (
    <AlertDialogPrimitive.Portal>
      <AlertDialogPrimitive.Backdrop className="fixed inset-0 z-50 bg-neutral-950/45 backdrop-blur-[2px] transition-opacity duration-150 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0" />
      <AlertDialogPrimitive.Viewport className="fixed inset-0 z-50 grid grid-cols-[minmax(0,1fr)] place-items-center p-4">
        <AlertDialogPrimitive.Popup
          data-slot="alert-dialog-content"
          className={cn(
            "w-full min-w-0 max-w-md rounded-[20px] border border-neutral-200 bg-white p-6 shadow-[0_30px_80px_rgba(0,0,0,0.22)] outline-none transition-[opacity,transform] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] data-[ending-style]:scale-[0.97] data-[ending-style]:opacity-0 data-[starting-style]:scale-[0.96] data-[starting-style]:opacity-0 motion-reduce:transition-opacity motion-reduce:data-[ending-style]:scale-100 motion-reduce:data-[starting-style]:scale-100",
            className as string,
          )}
          {...props}
        >
          {children}
        </AlertDialogPrimitive.Popup>
      </AlertDialogPrimitive.Viewport>
    </AlertDialogPrimitive.Portal>
  )
}

function AlertDialogTitle({ className, ...props }: React.ComponentProps<typeof AlertDialogPrimitive.Title>) {
  return <AlertDialogPrimitive.Title className={cn("text-lg font-bold tracking-tight text-neutral-950", className as string)} {...props} />
}

function AlertDialogDescription({ className, ...props }: React.ComponentProps<typeof AlertDialogPrimitive.Description>) {
  return <AlertDialogPrimitive.Description className={cn("mt-2 text-sm leading-6 text-neutral-500", className as string)} {...props} />
}

function AlertDialogFooter({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className)} {...props} />
}

const ACTION_BASE =
  "inline-flex min-h-10 items-center justify-center rounded-xl px-4 text-sm font-medium transition-[background-color,border-color,filter,transform] duration-150 active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"

function AlertDialogCancel({ className, ...props }: React.ComponentProps<typeof AlertDialogPrimitive.Close>) {
  return (
    <AlertDialogPrimitive.Close
      className={cn(ACTION_BASE, "border border-neutral-200 bg-white text-neutral-800 hover:border-neutral-300 hover:bg-neutral-50 focus-visible:ring-neutral-900", className as string)}
      {...props}
    />
  )
}

/** The confirming action. `destructive` is red for actions that take something away. */
function AlertDialogAction({ className, destructive = false, ...props }: React.ComponentProps<"button"> & { destructive?: boolean }) {
  return (
    <button
      type="button"
      className={cn(
        ACTION_BASE,
        destructive ? "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-600" : "bg-neutral-900 text-white hover:bg-neutral-800 focus-visible:ring-neutral-900",
        className,
      )}
      {...props}
    />
  )
}

export { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogTitle }
