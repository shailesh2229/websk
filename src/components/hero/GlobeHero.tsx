"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Sphere } from "@react-three/drei";
import { motion } from "framer-motion";
import { profile } from "@/data/profile";

export function GlobeHero() {
  return (
    <section className="relative w-full h-screen bg-[#000000] overflow-hidden flex items-center justify-center">
      {/* Background Grid for minimal effect */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>

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
      <div className="relative z-20 flex flex-col items-center justify-center pointer-events-none w-full px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-center"
        >
          <h1 className="text-6xl md:text-9xl font-bold tracking-tighter text-white font-sans">
            WEBSK
          </h1>
          <p className="mt-4 text-lg md:text-xl text-gray-400 font-mono tracking-widest uppercase">
            {profile.name}
          </p>
        </motion.div>

        {/* Hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-12 text-xs text-gray-500 font-mono tracking-widest uppercase flex items-center gap-2"
        >
          <span>[ Drag to rotate &bull; Scroll to zoom ]</span>
        </motion.div>
      </div>
    </section>
  );
}
