"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Environment, Float, Lightformer, useTexture } from "@react-three/drei";
import { Suspense, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three-stdlib";
import { cn } from "@/lib/utils";

const CARD_IMAGE = encodeURI("/Bank Card.webp");
const CARD_WIDTH = 3.37;
const CARD_HEIGHT = 2.125;
const CARD_DEPTH = 0.22;
const CARD_RADIUS = 0.1;
const EDGE_COLOR = "#16181b";

function Card() {
  const texture = useTexture(CARD_IMAGE);
  const displayTexture = useMemo(() => {
    const clone = texture.clone();
    clone.colorSpace = THREE.SRGBColorSpace;
    clone.needsUpdate = true;
    return clone;
  }, [texture]);
  const tiltRef = useRef<THREE.Group>(null);
  const { pointer } = useThree();

  useEffect(() => () => displayTexture.dispose(), [displayTexture]);

  const geometry = useMemo(
    () => new RoundedBoxGeometry(CARD_WIDTH, CARD_HEIGHT, CARD_DEPTH, 6, CARD_RADIUS),
    [],
  );

  useFrame(() => {
    if (!tiltRef.current) return;
    const targetY = pointer.x * 0.5;
    const targetX = -pointer.y * 0.25;
    tiltRef.current.rotation.y += (targetY - tiltRef.current.rotation.y) * 0.08;
    tiltRef.current.rotation.x += (targetX - tiltRef.current.rotation.x) * 0.08;
  });

  return (
    <Float speed={1.6} rotationIntensity={0.35} floatIntensity={0.6} floatingRange={[-0.08, 0.08]}>
      <group ref={tiltRef}>
        <mesh geometry={geometry}>
          <meshStandardMaterial attach="material-0" color={EDGE_COLOR} roughness={0.35} metalness={0.6} envMapIntensity={1.2} />
          <meshStandardMaterial attach="material-1" color={EDGE_COLOR} roughness={0.35} metalness={0.6} envMapIntensity={1.2} />
          <meshStandardMaterial attach="material-2" color={EDGE_COLOR} roughness={0.35} metalness={0.6} envMapIntensity={1.2} />
          <meshStandardMaterial attach="material-3" color={EDGE_COLOR} roughness={0.35} metalness={0.6} envMapIntensity={1.2} />
          <meshPhysicalMaterial
            attach="material-4"
            map={displayTexture}
            roughness={0.3}
            metalness={0.1}
            clearcoat={0.8}
            clearcoatRoughness={0.15}
            envMapIntensity={1.4}
            sheen={0.4}
            sheenColor="#a2ff38"
            sheenRoughness={0.6}
          />
          <meshStandardMaterial attach="material-5" color="#0a0b0c" roughness={0.5} metalness={0.4} envMapIntensity={1} />
        </mesh>
      </group>
    </Float>
  );
}

interface BrandCard3DProps {
  className?: string;
}

export default function BrandCard3D({ className }: BrandCard3DProps) {
  return (
    <div className={cn("aspect-[1440/909] w-full max-w-md", className)}>
      <Canvas camera={{ position: [0, 0.15, 5.5], fov: 28 }} dpr={[1, 2]} gl={{ alpha: true, antialias: true }}>
        <ambientLight intensity={0.9} />
        <directionalLight position={[3, 4, 5]} intensity={2} />
        <directionalLight position={[-4, 2, 3]} intensity={1.1} color="#ffffff" />
        <pointLight position={[0, -2, 4]} intensity={1.2} color="#A3FF38" />
        <Suspense fallback={null}>
          <Card />
          <ContactShadows position={[0, -1.35, 0]} opacity={0.45} scale={7} blur={2.6} far={2.2} />
          <Environment resolution={512}>
            <Lightformer form="rect" intensity={4} color="#ffffff" position={[0, 2.5, 3]} scale={[6, 4, 1]} />
            <Lightformer form="rect" intensity={2.5} color="#A3FF38" position={[-3.5, -1, 2.5]} scale={[4, 4, 1]} />
            <Lightformer
              form="rect"
              intensity={2}
              color="#ffffff"
              position={[3.5, -1.5, -1]}
              scale={[4, 5, 1]}
              rotation={[0, Math.PI / 4, 0]}
            />
            <Lightformer form="ring" intensity={2.5} color="#ffffff" position={[0, 0, -4]} scale={8} />
          </Environment>
        </Suspense>
      </Canvas>
    </div>
  );
}

useTexture.preload(CARD_IMAGE);
