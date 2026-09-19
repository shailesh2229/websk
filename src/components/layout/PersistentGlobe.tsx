"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Sphere, Stars } from "@react-three/drei";
import { useZoom } from "./ZoomContext";

const clamp = (v:number,a:number,b:number)=>Math.min(b,Math.max(a,v));
const ease = (t:number)=> t<.5 ? 4*t*t*t : 1-Math.pow(-2*t+2,3)/2;
const CAM_Z = [3.2, 0.85, 0.57, 0.25];

export function cameraZ(p:number){
  const i = Math.min(Math.floor(p), 2);
  const t = ease(clamp(p - i, 0, 1));
  return CAM_Z[i] + (CAM_Z[i+1] - CAM_Z[i]) * t;
}

function DollyCamera() {
  const { progress } = useZoom();

  useFrame(({ camera }) => {
    camera.position.z = cameraZ(progress.get());
  });

  return null;
}

export function PersistentGlobe() {
  const reduce = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  return (
    <div className="absolute inset-0 z-10 pointer-events-auto touch-none">
      <Canvas camera={{ position: [0, 0, 3.2], fov: 45 }}>
        <color attach="background" args={["#000"]} />
        <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 10]} intensity={1} />
        
        {/* Shell 1: Outer */}
        <Sphere args={[1, 32, 32]}>
          <meshStandardMaterial color="#ffffff" wireframe={true} transparent={true} opacity={0.3} />
        </Sphere>
        
        {/* Shell 2: Middle */}
        <Sphere args={[0.7, 32, 32]}>
          <meshStandardMaterial color="#ffffff" wireframe={true} transparent={true} opacity={0.15} />
        </Sphere>
        
        {/* Shell 3: Inner */}
        <Sphere args={[0.45, 24, 24]}>
          <meshStandardMaterial color="#ffffff" wireframe={true} transparent={true} opacity={0.08} />
        </Sphere>

        {!reduce && <DollyCamera />}
        
        {/* Only enable rotation via OrbitControls on Home */}
        <OrbitControls 
          enableZoom={false} 
          enablePan={false} 
          enableRotate={true} 
          autoRotate={true} 
          autoRotateSpeed={0.5} 
        />
      </Canvas>
    </div>
  );
}
