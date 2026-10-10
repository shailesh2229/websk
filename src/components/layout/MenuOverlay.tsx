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
    const handleOpenMenu = () => setOpen(true);
    window.addEventListener("open-menu", handleOpenMenu);
    return () => window.removeEventListener("open-menu", handleOpenMenu);
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
            className="fixed top-[4vw] right-[4vw] md:top-[2vw] md:right-[2.5vw] z-[2147483002]"
          >
            <RoundedButton
              onClick={() => setOpen(!open)}
              className={`w-[14.5vw] h-[14.5vw] md:w-[5.5vw] md:h-[5.5vw] flex flex-col items-center justify-center gap-[1.5vw] md:gap-[0.35vw] transition-colors duration-300 ${
                open ? "bg-[#3A4BE0]" : "bg-[#1c1d20]"
              }`}
              fillColor="#3A4BE0"
            >
              <div
                className={`w-[4vw] md:w-[1.2vw] h-[1.5px] md:h-[1px] bg-[#ffffff] transition-transform duration-300 absolute ${open ? "rotate-45" : "-translate-y-[2.5vw] md:-translate-y-[2px]"}`}
              />
              <div
                className={`w-[4vw] md:w-[1.2vw] h-[1.5px] md:h-[1px] bg-[#ffffff] transition-transform duration-300 absolute ${open ? "-rotate-45" : "translate-y-[2.5vw] md:translate-y-[2px]"}`}
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
              initial={prefersReducedMotion ? { opacity: 0 } : { y: "100%", x: "0%" }}
              animate={prefersReducedMotion ? { opacity: 1 } : { y: "0%", x: "0%" }}
              exit={prefersReducedMotion ? { opacity: 0 } : { y: "100%", x: "0%" }}
              transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
              className="fixed inset-0 md:inset-auto md:top-0 md:right-0 md:bottom-0 w-full md:w-[36vw] bg-[#1c1d20] z-[2147483001] text-[#ffffff] flex flex-col justify-between pt-[24vw] pb-[5vw] px-[5vw] md:p-[6vw_4vw_2vw_4vw]"
            >
              {/* SVG Curve (Desktop only) */}
              {!prefersReducedMotion && (
                <svg
                  className="hidden md:block absolute right-full top-0 w-[100px] h-full"
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

              <div className="w-full">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{
                    duration: 0.8,
                    ease: [0.76, 0, 0.24, 1],
                    delay: 0.1,
                  }}
                  className="text-[2.5vw] md:text-[0.65vw] tracking-[0.03em] text-[rgba(255,255,255,0.4)] uppercase mb-[6vw] md:mb-[4vw] pb-[4vw] md:pb-[2vw] border-b border-[rgba(255,255,255,0.15)] w-[110%] -ml-[5%]"
                >
                  <span className="ml-[5%]">NAVIGATION</span>
                </motion.div>

                <nav className="flex flex-col gap-[6vw] md:gap-[2vw]">
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
                        className="h-[15vw] md:h-[5.6vw] flex items-center"
                      >
                        <a
                          href={link.href}
                          onClick={(e) =>
                            handleNavClick(e, link.href, link.label)
                          }
                          className="w-full text-[11vw] md:text-[3.6vw] font-light md:font-normal flex justify-between items-center relative group text-[#ffffff] hover:opacity-70 transition-opacity"
                        >
                          <span
                            className="hidden md:block absolute left-[-1.5vw] top-1/2 -translate-y-1/2 w-[0.5vw] h-[0.5vw] rounded-full bg-[#ffffff] transition-transform duration-300"
                            style={{ transform: isActive ? "scale(1)" : "scale(0)" }}
                          />
                          {link.label}
                          {isActive && (
                            <span className="md:hidden w-[2.7vw] h-[2.7vw] rounded-full bg-[#ffffff] mr-[10vw]" />
                          )}
                        </a>
                      </motion.div>
                    );
                  })}
                </nav>
              </div>

              <div className="w-full">
                <div className="w-[110%] -ml-[5%] h-[1px] bg-[rgba(255,255,255,0.15)] mb-[4vw] md:hidden" />
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{
                    duration: 0.8,
                    ease: [0.76, 0, 0.24, 1],
                    delay: 0.4,
                  }}
                  className="text-[2.5vw] md:text-[0.65vw] tracking-[0.03em] text-[rgba(255,255,255,0.4)] uppercase mb-[4vw] md:mb-[1vw]"
                >
                  SOCIALS
                </motion.div>
                <div className="flex gap-[5vw] md:gap-[1.5vw]">
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
                      className="text-[4vw] md:text-[0.9vw] font-normal text-[#ffffff] hover:opacity-70 transition-opacity"
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
            <div className="text-[9vw] md:text-[2.2vw] text-[#ffffff] font-normal flex items-center gap-[2.5vw] md:gap-[1vw]">
              <div className="w-[1.5vw] h-[1.5vw] md:w-[0.5vw] md:h-[0.5vw] rounded-full bg-[#ffffff]" />
              {navTargetName}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
