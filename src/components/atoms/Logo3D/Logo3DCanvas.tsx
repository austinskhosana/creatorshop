"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer, useGLTF } from "@react-three/drei";
import { Suspense, useEffect, useRef } from "react";
import * as THREE from "three";

function ChromeSymbol({
  modelUrl,
  spinWithScroll,
  spinSpeed,
  onReady,
}: {
  modelUrl: string;
  spinWithScroll: boolean;
  spinSpeed: number;
  onReady?: () => void;
}) {
  const { scene } = useGLTF(modelUrl);
  const groupRef = useRef<THREE.Group>(null);

  // Suspense only resolves this far once the model has actually decoded —
  // tell the (non-suspended) parent so it can swap its loading placeholder
  // for the real canvas instead of leaving blank space behind.
  useEffect(() => {
    onReady?.();
  }, [onReady]);

  const model = useRef(scene.clone(true));
  const normalized = useRef(false);

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

  // Normalize every model to the same on-screen size regardless of how it
  // was authored/exported, so different .glb files read as consistently
  // sized when swapped into this same component.
  if (!normalized.current) {
    const box = new THREE.Box3().setFromObject(model.current);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const maxDimension = Math.max(size.x, size.y, size.z) || 1;
    const targetSize = 1.8;
    model.current.scale.multiplyScalar(targetSize / maxDimension);
    model.current.position.sub(center.multiplyScalar(targetSize / maxDimension));
    normalized.current = true;
  }

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

interface Logo3DCanvasProps {
  modelUrl: string;
  spinWithScroll: boolean;
  spinSpeed: number;
  accentColor: string;
  onReady?: () => void;
}

// Split out from Logo3D.tsx so the three.js / @react-three/fiber / @react-three/drei
// bundle (large) is only fetched once this is dynamically imported, instead of
// being part of the main page chunk regardless of whether a Logo3D ever scrolls
// into view.
export default function Logo3DCanvas({ modelUrl, spinWithScroll, spinSpeed, accentColor, onReady }: Logo3DCanvasProps) {
  return (
    <Canvas camera={{ position: [0, 0, 4], fov: 35 }} gl={{ alpha: true, preserveDrawingBuffer: true }}>
      <ambientLight intensity={1.6} />
      <directionalLight position={[3, 4, 5]} intensity={2.2} />
      <directionalLight position={[-4, 2, 3]} intensity={1.4} color="#ffffff" />
      <directionalLight position={[0, -3, 5]} intensity={1.2} color="#ffffff" />
      <pointLight position={[0, -3, 4]} intensity={1.2} color={accentColor} />
      <Suspense fallback={null}>
        <ChromeSymbol modelUrl={modelUrl} spinWithScroll={spinWithScroll} spinSpeed={spinSpeed} onReady={onReady} />
        <Environment resolution={256}>
          <Lightformer form="rect" intensity={4} color="#ffffff" position={[0, 2, 3]} scale={[5, 5, 1]} />
          <Lightformer form="rect" intensity={3} color={accentColor} position={[-3, -1, 2]} scale={[4, 4, 1]} />
          <Lightformer form="rect" intensity={2.5} color="#ffffff" position={[3, -2, -2]} scale={[4, 4, 1]} />
          <Lightformer form="ring" intensity={2.5} color="#ffffff" position={[0, 0, -4]} scale={7} />
          <Lightformer form="rect" intensity={2} color="#ffffff" position={[0, -4, 2]} scale={[6, 3, 1]} />
        </Environment>
      </Suspense>
    </Canvas>
  );
}
