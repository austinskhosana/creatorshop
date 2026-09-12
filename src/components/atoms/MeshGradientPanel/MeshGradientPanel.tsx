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
}

export default function MeshGradientPanel({ children, className, shaded = true }: MeshGradientPanelProps) {
  return (
    <div className={cn("relative isolate overflow-hidden rounded-[32px]", className)}>
      <LiquidMetal
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-20 h-full w-full"
        shape="none"
        fit="cover"
        colorBack="#D8D8DA"
        colorTint="#ffffff"
        repetition={5}
        softness={0.55}
        shiftRed={0.3}
        shiftBlue={0.3}
        distortion={0.1}
        contour={0.15}
        angle={45}
        speed={1}
        scale={1}
        worldWidth={800}
        worldHeight={800}
      />

      <div aria-hidden="true" className="absolute inset-[5px] -z-10 overflow-hidden rounded-[27px]">
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
    </div>
  );
}
