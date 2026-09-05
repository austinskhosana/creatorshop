"use client"

import React, { useCallback, useMemo, useRef } from "react"
import { v4 as uuidv4 } from "uuid"

import { cn } from "@/lib/utils"
import { useDimensions } from "@/hooks/use-dimensions"

interface PixelTrailProps {
  pixelSize: number // px
  fadeDuration?: number // ms
  delay?: number // ms
  className?: string
  pixelClassName?: string
}

const PixelTrail: React.FC<PixelTrailProps> = ({
  pixelSize = 20,
  fadeDuration = 500,
  delay = 0,
  className,
  pixelClassName,
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const dimensions = useDimensions(containerRef)
  const trailId = useRef(uuidv4())
  const lastCell = useRef<{ x: number; y: number } | null>(null)

  const triggerPixel = useCallback((x: number, y: number) => {
    const pixelElement = document.getElementById(
      `${trailId.current}-pixel-${x}-${y}`
    )
    const animatePixel = (pixelElement as any)?.__animatePixel
    if (animatePixel) animatePixel()
  }, [])

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!containerRef.current) return

      const rect = containerRef.current.getBoundingClientRect()
      const x = Math.floor((e.clientX - rect.left) / pixelSize)
      const y = Math.floor((e.clientY - rect.top) / pixelSize)

      const last = lastCell.current
      if (last && (last.x !== x || last.y !== y)) {
        // Walk every cell between the last and current position so a fast
        // cursor lights up a continuous line instead of scattered dots —
        // consecutive mousemove events can be many cells apart.
        const dx = x - last.x
        const dy = y - last.y
        const steps = Math.max(Math.abs(dx), Math.abs(dy))
        for (let i = 1; i <= steps; i++) {
          triggerPixel(
            Math.round(last.x + (dx * i) / steps),
            Math.round(last.y + (dy * i) / steps)
          )
        }
      } else {
        triggerPixel(x, y)
      }

      lastCell.current = { x, y }
    },
    [pixelSize, triggerPixel]
  )

  const columns = useMemo(
    () => Math.ceil(dimensions.width / pixelSize),
    [dimensions.width, pixelSize]
  )
  const rows = useMemo(
    () => Math.ceil(dimensions.height / pixelSize),
    [dimensions.height, pixelSize]
  )

  return (
    <div
      ref={containerRef}
      className={cn(
        "absolute inset-0 w-full h-full pointer-events-auto",
        className
      )}
      onMouseMove={handleMouseMove}
    >
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <PixelDot
              key={`${colIndex}-${rowIndex}`}
              id={`${trailId.current}-pixel-${colIndex}-${rowIndex}`}
              size={pixelSize}
              fadeDuration={fadeDuration}
              delay={delay}
              className={pixelClassName}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

export default PixelTrail

interface PixelDotProps {
  id: string
  size: number
  fadeDuration: number
  delay: number
  className?: string
}

const PixelDot: React.FC<PixelDotProps> = React.memo(
  ({ id, size, fadeDuration, delay, className }) => {
    const nodeRef = useRef<HTMLDivElement | null>(null)

    // Native Web Animations API instead of an imperative motion controls
    // object — controls can silently detach from the rendered element
    // depending on mount/registration timing, which showed up as some
    // pixels never firing. Animating the ref'd DOM node directly has no
    // such connection state to go stale.
    const animatePixel = useCallback(() => {
      const node = nodeRef.current
      if (!node) return
      node.getAnimations().forEach((anim) => anim.cancel())
      node.style.opacity = "1"
      node.animate([{ opacity: 1 }, { opacity: 0 }], {
        duration: Math.max(fadeDuration, 1),
        delay,
        fill: "forwards",
      })
    }, [fadeDuration, delay])

    // Attach the animatePixel function to the DOM element
    const ref = useCallback(
      (node: HTMLDivElement | null) => {
        nodeRef.current = node
        if (node) {
          ;(node as any).__animatePixel = animatePixel
        }
      },
      [animatePixel]
    )

    return (
      <div
        id={id}
        ref={ref}
        className={cn("cursor-pointer-none", className)}
        style={{
          width: `${size}px`,
          height: `${size}px`,
          opacity: 0,
        }}
      />
    )
  }
)

PixelDot.displayName = "PixelDot"
