"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [showTransition, setShowTransition] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (pathname === "/" && !sessionStorage.getItem("introPlayed")) {
      return;
    }
    
    // Instead of doing both entrance and exit in template, we do an "entrance sweep".
    // When the template mounts, the overlay starts covering the screen, then sweeps up.
    setShowTransition(true);
    const timer = setTimeout(() => {
      setShowTransition(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, [pathname]);

  const pageName = pathname === "/" ? "Home" : pathname.replace("/", "").charAt(0).toUpperCase() + pathname.slice(2);

  return (
    <>
      <AnimatePresence>
        {showTransition && (
          <motion.div
            className="fixed inset-0 z-[2147483005] bg-[#1c1d20] flex items-center justify-center text-white"
            initial={{ y: 0 }} // Start covering the screen
            animate={{ y: 0 }}
            exit={{ y: "-100vh" }} // Sweep up
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          >
            <motion.div 
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="text-[32px] font-light flex items-center gap-4"
            >
              <span className="w-2 h-2 rounded-full bg-white block" />
              {pageName}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {children}
    </>
  );
}
