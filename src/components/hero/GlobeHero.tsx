"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Sphere } from "@react-three/drei";
import { motion } from "framer-motion";

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
              color="#ffffff" 
              wireframe={true} 
              transparent={true} 
              opacity={0.3} 
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
          className="text-center w-full max-w-[375px] md:max-w-none"
        >
          <h1 className="text-6xl md:text-9xl font-bold tracking-tighter text-white font-sans">
            WEBSK
          </h1>

          <div className="mt-8">
            <h2 
              className="font-[family-name:var(--font-ibm-plex)] font-bold text-[#f1f1f8] tracking-[-0.02em] leading-[1.08] text-[clamp(22px,3.6vw,52px)] text-balance mx-auto"
            >
              Your tech partner.<br />Shailesh Chaudhary.
            </h2>
            <p 
              className="font-[family-name:var(--font-ibm-plex)] font-medium text-[#c9cade] text-[clamp(14px,1.15vw,18px)] leading-[1.7] max-w-[640px] mx-auto mt-[20px] text-balance"
            >
              A five-phase method that transforms how your business runs on technology. An AI-first agency — and your end-to-end tech partner.
            </p>
          </div>
        </motion.div>

        {/* Hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-[#6a6e90] font-mono tracking-[0.28em] uppercase flex items-center gap-2 w-max"
        >
          <span>[ Drag to rotate &bull; Scroll to zoom ]</span>
        </motion.div>
      </div>
    </section>
  );
}
