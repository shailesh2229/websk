"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Sphere } from "@react-three/drei";
import { useRef } from "react";
import { useZoom } from "./ZoomContext";

function DollyCamera() {
  const { progress, targetPage } = useZoom();
  const controlsRef = useRef<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any

  useFrame(() => {
    if (controlsRef.current) {
      const p = progress.get();
      // progress: 0 to 4. Distance: 5 to 1.5
      const dist = 5 - p * 0.875;
      controlsRef.current.minDistance = dist;
      controlsRef.current.maxDistance = dist;
      controlsRef.current.update();
    }
  });

  // Only allow rotating the globe when on Home page
  return (
    <OrbitControls 
      ref={controlsRef} 
      enableZoom={false} 
      enablePan={false} 
      enableRotate={targetPage === 0} 
      autoRotate={true} 
      autoRotateSpeed={0.5} 
    />
  );
}

export function PersistentGlobe() {
  const reduce = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  return (
    <div className="absolute inset-0 z-10 pointer-events-auto">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 10]} intensity={1} />
        
        <Sphere args={[2, 32, 32]}>
          <meshStandardMaterial 
            color="#ffffff" 
            wireframe={true} 
            transparent={true} 
            opacity={0.3} 
          />
        </Sphere>

        {!reduce && <DollyCamera />}
      </Canvas>
    </div>
  );
}
