"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Preloader({ children }: { children: React.ReactNode }) {
  const [showPreloader, setShowPreloader] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [phase, setPhase] = useState<"trail" | "flash" | "exit" | "done">("trail");

  useEffect(() => {
    // Check session storage
    if (sessionStorage.getItem("preloader_shown")) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShowPreloader(false);
       
      setPhase("done");
      return;
    }

    // Check reduced motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
       
      setShowPreloader(false);
       
      setPhase("done");
      sessionStorage.setItem("preloader_shown", "true");
      return;
    }

    // Check mobile
    setIsMobile(window.innerWidth < 768);

    // Lock scroll
    document.body.style.overflow = "hidden";

    // Sequence timings
    const flashTimer = setTimeout(() => {
      setPhase("flash");
    }, 2200);

    const exitTimer = setTimeout(() => {
      setPhase("exit");
    }, 2500);

    const doneTimer = setTimeout(() => {
      setPhase("done");
      setShowPreloader(false);
      document.body.style.overflow = "";
      sessionStorage.setItem("preloader_shown", "true");
    }, 3200);

    return () => {
      clearTimeout(flashTimer);
      clearTimeout(exitTimer);
      clearTimeout(doneTimer);
      document.body.style.overflow = "";
    };
  }, []);

  if (phase === "done") {
    return <>{children}</>;
  }
  const trailCopies = isMobile ? 3 : 6;


  return (
    <>
      <div className="relative w-full h-full min-h-screen">
        {/* Actual page content renders underneath so SEO is intact */}
        {children}
      </div>

      <AnimatePresence>
        {showPreloader && (
          <motion.div
            initial={{ y: 0 }}
            animate={phase === "exit" ? { y: "-100%", opacity: 0 } : { y: 0, opacity: 1 }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden"
            style={{ backgroundColor: phase === "flash" ? "#f0f0f0" : "#05061E" }}
          >
            
            {phase === "trail" && (
              <div className="relative flex flex-col items-center justify-center w-full">
                {/* Main Logo Container */}
                <div className="relative">
                  {/* Trail Copies */}
                  {Array.from({ length: trailCopies }).map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        backgroundColor: "#6D3BFF",
                        WebkitMaskImage: "url(/websk.png)",
                        WebkitMaskSize: "contain",
                        WebkitMaskRepeat: "no-repeat",
                        WebkitMaskPosition: "center",
                        maskImage: "url(/websk.png)",
                        maskSize: "contain",
                        maskRepeat: "no-repeat",
                        maskPosition: "center",
                        filter: "blur(0.5px)",
                      }}
                      initial={{ x: 0, y: 0, opacity: 0 }}
                      animate={{
                        x: [0, (i + 1) * 5, 0],
                        y: [0, (i + 1) * 3, 0],
                        opacity: [0, 0.5 - i * 0.08, 0],
                      }}
                      transition={{
                        duration: 1.4,
                        times: [0, 0.5, 1],
                        ease: "easeInOut",
                      }}
                    />
                  ))}
                  
                  {/* Main Logo */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <motion.img
                    src="/websk.png"
                    alt="WEBSK"
                    className="relative z-10 w-48 md:w-64 object-contain"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </div>

                {/* Progress Bar Container */}
                <div className="absolute top-full mt-8 w-48 md:w-64 h-[1px] bg-white/10 overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-transparent via-[#6D3BFF] to-[#6D3BFF]"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 2.2, ease: "easeInOut" }}
                  />
                </div>
              </div>
            )}

            {phase === "flash" && (
               
              <motion.img
                src="/favicon.png"
                alt="W"
                className="w-16 h-16 md:w-24 md:h-24 object-contain"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              />
            )}
            
            {phase === "exit" && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src="/favicon.png"
                alt="W"
                className="w-16 h-16 md:w-24 md:h-24 object-contain"
              />
            )}
            
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
