"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { MagneticButton } from "../ui/MagneticButton";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Home" },
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

const socials = [
  { href: "#", label: "LinkedIn" },
  { href: "#", label: "GitHub" },
  { href: "#", label: "Instagram" },
];

const curvePath = {
  initial: "M100 0 V1000 Q-100 500 100 0 Z",
  enter: "M100 0 V1000 Q100 500 100 0 Z",
  exit: "M100 0 V1000 Q-100 500 100 0 Z"
};

export function MenuOverlay() {
  const [open, setOpen] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const pathname = usePathname();
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const handleScroll = () => {
      setShowButton(window.scrollY > window.innerHeight - 100);
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll(); // init
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      const handleEsc = (e: KeyboardEvent) => {
        if (e.key === "Escape") setOpen(false);
      };
      window.addEventListener("keydown", handleEsc);
      return () => {
        document.body.style.overflow = "";
        window.removeEventListener("keydown", handleEsc);
      };
    } else {
      document.body.style.overflow = "";
    }
  }, [open]);

  return (
    <>
      <AnimatePresence>
        {showButton && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="fixed top-6 right-6 z-[2147483002]"
          >
            <MagneticButton>
              <button
                onClick={() => setOpen(!open)}
                className={`w-[76px] h-[76px] rounded-full flex flex-col items-center justify-center gap-1.5 transition-colors duration-300 ${
                  open ? "bg-[#3A4BE0]" : "bg-[#1c1d20]"
                }`}
              >
                <div 
                  className={`w-6 h-[2px] bg-white transition-transform duration-300 ${open ? "rotate-45 translate-y-[4px]" : ""}`} 
                />
                <div 
                  className={`w-6 h-[2px] bg-white transition-transform duration-300 ${open ? "-rotate-45 -translate-y-[4px]" : ""}`} 
                />
              </button>
            </MagneticButton>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <>
            {/* Dim Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="fixed inset-0 z-[2147483000]"
              style={{
                background: "linear-gradient(to right, rgba(0,0,0,0.08), rgba(0,0,0,0.35))"
              }}
              onClick={() => setOpen(false)}
            />
            
            {/* Panel */}
            <motion.div
              initial={prefersReducedMotion ? { opacity: 0 } : { x: "100%" }}
              animate={prefersReducedMotion ? { opacity: 1 } : { x: "0%" }}
              exit={prefersReducedMotion ? { opacity: 0 } : { x: "100%" }}
              transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
              className="fixed top-0 right-0 bottom-0 w-full md:w-[38vw] md:min-w-[360px] bg-[#1c1d20] z-[2147483001] text-white flex flex-col pt-24 px-[4vw]"
            >
              {/* SVG Curve */}
              {!prefersReducedMotion && (
                <svg 
                  className="absolute right-full top-0 w-[100px] h-full hidden md:block" 
                  viewBox="0 0 100 1000" 
                  preserveAspectRatio="none"
                >
                  <motion.path 
                    d={curvePath.initial}
                    initial="initial"
                    animate="enter"
                    exit="exit"
                    variants={{
                      initial: { d: curvePath.initial },
                      enter: { d: curvePath.enter, transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } },
                      exit: { d: curvePath.exit, transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } }
                    }}
                    fill="#1c1d20" 
                  />
                </svg>
              )}

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1], delay: prefersReducedMotion ? 0 : 0.1 }}
                className="text-[12px] tracking-widest text-[#999] mb-8 pb-4 border-b border-[#333]"
              >
                NAVIGATION
              </motion.div>
              
              <nav className="flex flex-col gap-4">
                {links.map((link, i) => {
                  const isActive = pathname === link.href;
                  return (
                    <motion.div
                      initial={{ x: 50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: 50, opacity: 0 }}
                      transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1], delay: prefersReducedMotion ? 0 : 0.1 + i * 0.06 }}
                      key={link.href}
                    >
                      <Link 
                        href={link.href}
                        className="text-[clamp(42px,5vw,64px)] font-light flex items-center group"
                      >
                        <span className={`inline-block w-[10px] h-[10px] rounded-full bg-white mr-4 transition-transform duration-300 ${isActive ? "scale-100" : "scale-0 group-hover:scale-100"}`} />
                        <span className="transition-transform duration-300 group-hover:translate-x-4">
                          {link.label}
                        </span>
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>

              <div className="mt-auto pb-12">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1], delay: prefersReducedMotion ? 0 : 0.4 }}
                  className="text-[12px] tracking-widest text-[#999] mb-4"
                >
                  SOCIALS
                </motion.div>
                <div className="flex gap-6">
                  {socials.map((s, i) => (
                    <motion.a
                      key={s.label}
                      href={s.href}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: 20, opacity: 0 }}
                      transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1], delay: prefersReducedMotion ? 0 : 0.4 + i * 0.06 }}
                      className="text-[14px] font-normal hover:underline"
                    >
                      {s.label}
                    </motion.a>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
