"use client"

import * as React from "react"
import { Tabs as TabsPrimitive } from "@base-ui/react/tabs"
import { cn } from "@/lib/utils"

function withClassName<State>(base: string, className: string | ((state: State) => string | undefined) | undefined) {
  return typeof className === "function" ? (state: State) => cn(base, className(state)) : cn(base, className)
}

function Tabs({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return <TabsPrimitive.Root data-slot="tabs" className={withClassName("flex flex-col", className)} {...props} />
}

function TabsList({ className, variant = "default", ...props }: React.ComponentProps<typeof TabsPrimitive.List> & { variant?: "default" | "line" }) {
  return <TabsPrimitive.List data-slot="tabs-list" data-variant={variant} className={withClassName(variant === "line" ? "flex gap-1 overflow-x-auto border-b border-neutral-200" : "inline-flex w-fit items-center gap-1 rounded-xl bg-neutral-100 p-1", className)} {...props} />
}

function TabsTrigger({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Tab>) {
  return <TabsPrimitive.Tab data-slot="tabs-trigger" className={withClassName("inline-flex h-8 shrink-0 items-center justify-center rounded-lg border border-transparent px-3 text-sm font-medium text-neutral-500 outline-none transition-[color,background-color,border-color,box-shadow] hover:text-neutral-700 focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 data-[active]:border-neutral-200 data-[active]:bg-white data-[active]:text-neutral-950 data-[active]:shadow-sm data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className)} {...props} />
}

function TabsContent({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Panel>) {
  return <TabsPrimitive.Panel data-slot="tabs-content" className={withClassName("outline-none", className)} {...props} />
}

export { Tabs, TabsContent, TabsList, TabsTrigger }
