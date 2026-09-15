"use client";

import { LiquidMetal } from "@paper-design/shaders-react";
import { ReactNode } from "react";
import { TerminalgraphShader } from "@/components/atoms/TerminalgraphShader";
import { cn } from "@/lib/utils";

interface MeshGradientPanelProps {
  children?: ReactNode;
  className?: string;
  /** Show the animated shader texture inside the metallic border. Set false for a plain grey fill. */
  shaded?: boolean;
  /** Corner radius in px for the outer ring. Defaults to 32, the large-panel treatment. Use 9999 for a pill. */
  radius?: number;
  /** Thickness of the visible metal ring in px. Defaults to 5. */
  borderWidth?: number;
}

export default function MeshGradientPanel({
  children,
  className,
  shaded = true,
  radius = 32,
  borderWidth = 5,
}: MeshGradientPanelProps) {
  return (
    <div className={cn("relative isolate overflow-hidden", className)} style={{ borderRadius: radius }}>
      <LiquidMetal
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-20 h-full w-full"
        shape="none"
        fit="cover"
        colorBack="#DCDCDE"
        colorTint="#ffffff"
        repetition={4}
        softness={0.8}
        shiftRed={0.12}
        shiftBlue={0.12}
        distortion={0.1}
        contour={0.15}
        angle={45}
        speed={0.5}
        scale={1}
        worldWidth={800}
        worldHeight={800}
      />

      <div
        aria-hidden="true"
        className="absolute -z-10 overflow-hidden"
        style={{
          inset: borderWidth,
          borderRadius: Math.max(radius - borderWidth, 0),
          boxShadow: "0 0 0 1px rgba(0,0,0,0.14), inset 0 1px 2px rgba(0,0,0,0.06)",
        }}
      >
        {shaded ? (
          <TerminalgraphShader
            theme="light"
            background={{ dark: "#052e12", light: "#ffffff" }}
            className="h-full w-full"
          />
        ) : (
          <div className="h-full w-full bg-white" />
        )}
      </div>

      {children}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          borderRadius: radius,
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.85), inset 0 0 0 1px rgba(0,0,0,0.1)",
        }}
      />
    </div>
  );
}
