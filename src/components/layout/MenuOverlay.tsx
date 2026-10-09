"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { RoundedButton } from "../ui/RoundedButton";
import { usePathname, useRouter } from "next/navigation";

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
  exit: "M100 0 V1000 Q-100 500 100 0 Z",
};

const transitionCurvePath = {
  initial: "M0 300 Q50 0 100 300 V300 H0 Z",
  enter: "M0 0 Q50 0 100 0 V300 H0 Z",
};

export function MenuOverlay() {
  const [open, setOpen] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [navTargetName, setNavTargetName] = useState("");
  const pathname = usePathname();
  const router = useRouter();
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
    if (open || isNavigating) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [open, isNavigating]);

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
    label: string,
  ) => {
    e.preventDefault();
    if (pathname === href) {
      setOpen(false);
      return;
    }
    setNavTargetName(label);
    setIsNavigating(true);
    setOpen(false);

    // Wait for overlay to animate up (about 800ms) then route
    setTimeout(() => {
      router.push(href);
      setTimeout(() => {
        setIsNavigating(false);
      }, 500); // let the new page render, then hide overlay
    }, 800);
  };

  return (
    <>
      <AnimatePresence>
        {showButton && !isNavigating && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.76, 0, 0.24, 1] }}
            className="fixed top-[2vw] right-[2.5vw] z-[2147483002]"
          >
            <RoundedButton
              onClick={() => setOpen(!open)}
              className={`w-[5.5vw] h-[5.5vw] flex flex-col items-center justify-center gap-1.5 transition-colors duration-300 ${
                open ? "bg-[#3A4BE0]" : "bg-[#1c1d20]"
              }`}
              fillColor="#3A4BE0"
            >
              <div
                className={`w-[1.2vw] h-[1px] bg-[#ffffff] transition-transform duration-300 absolute ${open ? "rotate-45" : "-translate-y-[2px]"}`}
              />
              <div
                className={`w-[1.2vw] h-[1px] bg-[#ffffff] transition-transform duration-300 absolute ${open ? "-rotate-45" : "translate-y-[2px]"}`}
              />
            </RoundedButton>
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
                background:
                  "linear-gradient(to right, rgba(0,0,0,0.08), rgba(0,0,0,0.35))",
              }}
              onClick={() => setOpen(false)}
            />

            {/* Panel */}
            <motion.div
              initial={prefersReducedMotion ? { opacity: 0 } : { x: "100%" }}
              animate={prefersReducedMotion ? { opacity: 1 } : { x: "0%" }}
              exit={prefersReducedMotion ? { opacity: 0 } : { x: "100%" }}
              transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
              className="fixed top-0 right-0 bottom-0 w-[36vw] bg-[#1c1d20] z-[2147483001] text-[#ffffff] flex flex-col justify-between"
              style={{ padding: "6vw 4vw 2vw 4vw" }}
            >
              {/* SVG Curve */}
              {!prefersReducedMotion && (
                <svg
                  className="absolute right-full top-0 w-[100px] h-full"
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
                      enter: {
                        d: curvePath.enter,
                        transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] },
                      },
                      exit: {
                        d: curvePath.exit,
                        transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] },
                      },
                    }}
                    fill="#1c1d20"
                  />
                </svg>
              )}

              <div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{
                    duration: 0.8,
                    ease: [0.76, 0, 0.24, 1],
                    delay: 0.1,
                  }}
                  className="text-[0.65vw] tracking-[0.03em] text-[rgba(255,255,255,0.4)] uppercase mb-[4vw] pb-[2vw] border-b border-[rgba(255,255,255,0.15)]"
                >
                  NAVIGATION
                </motion.div>

                <nav className="flex flex-col" style={{ gap: "2vw" }}>
                  {links.map((link, i) => {
                    const isActive = pathname === link.href;
                    return (
                      <motion.div
                        initial={{ y: 40, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 40, opacity: 0 }}
                        transition={{
                          duration: 0.8,
                          ease: [0.76, 0, 0.24, 1],
                          delay: 0.1 + i * 0.06,
                        }}
                        key={link.href}
                        style={{
                          height: "5.6vw",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <a
                          href={link.href}
                          onClick={(e) =>
                            handleNavClick(e, link.href, link.label)
                          }
                          className="text-[3.6vw] font-normal flex items-center relative group text-[#ffffff] hover:opacity-70 transition-opacity"
                        >
                          <span
                            className={`absolute left-[-1.5vw] top-1/2 -translate-y-1/2 w-[0.5vw] h-[0.5vw] rounded-full bg-[#ffffff] transition-transform duration-300 ${isActive ? "scale-100" : "scale-0 group-hover:scale-100"}`}
                          />
                          {link.label}
                        </a>
                      </motion.div>
                    );
                  })}
                </nav>
              </div>

              <div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{
                    duration: 0.8,
                    ease: [0.76, 0, 0.24, 1],
                    delay: 0.4,
                  }}
                  className="text-[0.65vw] tracking-[0.03em] text-[rgba(255,255,255,0.4)] uppercase mb-[1vw]"
                >
                  SOCIALS
                </motion.div>
                <div className="flex gap-[1.5vw]">
                  {socials.map((s, i) => (
                    <motion.a
                      key={s.label}
                      href={s.href}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: 20, opacity: 0 }}
                      transition={{
                        duration: 0.8,
                        ease: [0.76, 0, 0.24, 1],
                        delay: 0.4 + i * 0.06,
                      }}
                      className="text-[0.9vw] font-normal text-[#ffffff] hover:opacity-70 transition-opacity"
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

      {/* Page Transition Overlay */}
      <AnimatePresence>
        {isNavigating && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: "0%" }}
            exit={{ y: "-100%" }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-[2147483003] bg-[#1c1d20] flex items-center justify-center text-[#ffffff]"
          >
            {/* Transition curve (optional nice-to-have) */}
            <svg
              className="absolute bottom-full left-0 w-full h-[300px]"
              viewBox="0 0 100 300"
              preserveAspectRatio="none"
            >
              <motion.path
                d={transitionCurvePath.initial}
                animate={{ d: transitionCurvePath.enter }}
                transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
                fill="#1c1d20"
              />
            </svg>
            <div className="text-[2.2vw] font-normal flex items-center gap-[1vw]">
              <div className="w-[0.5vw] h-[0.5vw] rounded-full bg-[#ffffff]" />
              {navTargetName}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
