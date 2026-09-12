"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer, useGLTF } from "@react-three/drei";
import { Suspense, useRef } from "react";
import * as THREE from "three";
import { cn } from "@/lib/utils";

const MODEL_URL = "/models/symbol-3d.glb";

function ChromeSymbol({
  modelUrl,
  spinWithScroll,
  spinSpeed,
}: {
  modelUrl: string;
  spinWithScroll: boolean;
  spinSpeed: number;
}) {
  const { scene } = useGLTF(modelUrl);
  const groupRef = useRef<THREE.Group>(null);

  const model = useRef(scene.clone(true));

  model.current.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      child.material = new THREE.MeshPhysicalMaterial({
        color: "#e8e8ea",
        metalness: 1,
        roughness: 0.18,
        clearcoat: 1,
        clearcoatRoughness: 0.08,
      });
    }
  });

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    if (spinWithScroll) {
      const scrollTarget = window.scrollY * 0.003;
      groupRef.current.rotation.y += (scrollTarget - groupRef.current.rotation.y) * 0.1;
    } else {
      groupRef.current.rotation.y += delta * spinSpeed;
    }
  });

  return (
    <group ref={groupRef}>
      <primitive object={model.current} />
    </group>
  );
}

interface Logo3DProps {
  className?: string;
  /** Which .glb to render — defaults to the Creatorshop symbol. */
  modelUrl?: string;
  /** Ties rotation to page scroll position instead of idle auto-spin. */
  spinWithScroll?: boolean;
  /** Idle auto-spin speed in radians/second. Ignored when spinWithScroll is true. */
  spinSpeed?: number;
}

export default function Logo3D({
  className,
  modelUrl = MODEL_URL,
  spinWithScroll = false,
  spinSpeed = 0.15,
}: Logo3DProps) {
  return (
    <div className={cn("h-28 w-28", className)}>
      <Canvas camera={{ position: [0, 0, 4], fov: 35 }} gl={{ alpha: true, preserveDrawingBuffer: true }}>
        <ambientLight intensity={1.6} />
        <directionalLight position={[3, 4, 5]} intensity={2.2} />
        <directionalLight position={[-4, 2, 3]} intensity={1.4} color="#ffffff" />
        <directionalLight position={[0, -3, 5]} intensity={1.2} color="#ffffff" />
        <pointLight position={[0, -3, 4]} intensity={1.2} color="#A3FF38" />
        <Suspense fallback={null}>
          <ChromeSymbol modelUrl={modelUrl} spinWithScroll={spinWithScroll} spinSpeed={spinSpeed} />
          <Environment resolution={256}>
            <Lightformer form="rect" intensity={4} color="#ffffff" position={[0, 2, 3]} scale={[5, 5, 1]} />
            <Lightformer form="rect" intensity={3} color="#A3FF38" position={[-3, -1, 2]} scale={[4, 4, 1]} />
            <Lightformer form="rect" intensity={2.5} color="#ffffff" position={[3, -2, -2]} scale={[4, 4, 1]} />
            <Lightformer form="ring" intensity={2.5} color="#ffffff" position={[0, 0, -4]} scale={7} />
            <Lightformer form="rect" intensity={2} color="#ffffff" position={[0, -4, 2]} scale={[6, 3, 1]} />
          </Environment>
        </Suspense>
      </Canvas>
    </div>
  );
}

useGLTF.preload(MODEL_URL);
