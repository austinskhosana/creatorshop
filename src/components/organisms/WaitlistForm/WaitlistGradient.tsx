"use client";

import { MeshGradient } from "@paper-design/shaders-react";

export default function WaitlistGradient() {
  return (
    <MeshGradient
      aria-hidden="true"
      speed={1}
      scale={1}
      distortion={0.78}
      swirl={0.36}
      frame={656640.4000042876}
      colors={["#FFFFFF", "#FFFFFF", "#A3FF38", "#FFFFFF"]}
      className="absolute inset-0 h-full w-full"
      style={{ height: "100%", width: "100%" }}
    />
  );
}
