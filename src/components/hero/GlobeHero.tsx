"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Sphere } from "@react-three/drei";
import { motion } from "framer-motion";
import { profile } from "@/data/profile";

export function GlobeHero() {
  return (
    <section className="relative w-full h-screen bg-transparent overflow-hidden flex items-center justify-center">
      {/* 3D Canvas */}
      <div className="absolute inset-0 z-10">
        <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 10]} intensity={1} />
          
          <Sphere args={[2, 32, 32]}>
            <meshStandardMaterial 
              color="#a99bff" 
              wireframe={true} 
              transparent={true} 
              opacity={0.25} 
            />
          </Sphere>

          <OrbitControls 
            enableZoom={true} 
            enablePan={false} 
            enableRotate={true}
            autoRotate={true}
            autoRotateSpeed={0.5}
          />
        </Canvas>
      </div>

      {/* Content overlay */}
      <div className="relative z-20 flex flex-col items-center justify-center pointer-events-none w-full px-4 h-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-center"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="w-[clamp(240px,36vw,420px)] h-auto block mx-auto drop-shadow-[0_0_18px_rgba(109,59,255,0.35)]"
            alt="Websk"
            src="/websk-signature.png"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
          <div className="mt-8 text-[#9ea2c0] font-serif text-[clamp(16px,2vw,20px)] leading-relaxed tracking-wide">
            <span className="block">Web experiences</span>
            <span className="block">shaped by code, not templates.</span>
          </div>
          <p className="mt-8 text-[10px] text-[#6a6e90] font-mono tracking-[0.28em] uppercase">
            {profile.name}
          </p>
        </motion.div>

        {/* Hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[10px] text-[#6a6e90] font-mono tracking-[0.28em] uppercase flex items-center gap-2 w-max"
        >
          <span>[ Drag to rotate &bull; Scroll to zoom ]</span>
        </motion.div>
      </div>
    </section>
  );
}
