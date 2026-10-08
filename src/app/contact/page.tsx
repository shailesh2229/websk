"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MagneticButton } from "@/components/ui/MagneticButton";
import Image from "next/image";

const links = [
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" }
];

export default function ContactPage() {
  const pathname = usePathname();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    organization: "",
    services: "",
    message: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        alert("Message sent successfully!");
        setFormData({ name: "", email: "", organization: "", services: "", message: "" });
      } else {
        throw new Error("Failed to send");
      }
    } catch (err) {
      // Fallback to mailto if API fails
      window.location.href = `mailto:websk2026@gmail.com?subject=New Inquiry from ${formData.name}&body=${formData.message}`;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <main className="w-full bg-[#1c1d20] min-h-screen text-white pt-8 pb-32">
      
      {/* Top Bar */}
      <header className="w-full px-[4vw] flex items-center justify-between mb-32 z-50 relative">
        <div className="text-[14px]">© Websk</div>
        <nav className="flex items-center gap-8 text-[14px]">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link key={link.href} href={link.href} className="relative flex flex-col items-center group">
                <span className="mb-1 transition-opacity hover:opacity-70">{link.label}</span>
                <span className={`w-1 h-1 rounded-full bg-white transition-opacity ${isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`} />
              </Link>
            );
          })}
        </nav>
      </header>

      <div className="max-w-[1440px] mx-auto px-[4vw] flex flex-col md:flex-row gap-16 md:gap-32 relative z-10">
        
        {/* Left Column: Heading + Form */}
        <div className="w-full md:w-[65%] flex flex-col">
          <div className="flex items-end gap-6 mb-24">
            <motion.h1 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
              className="text-[clamp(48px,7vw,90px)] font-light leading-[1.1] tracking-tight"
            >
              Let&apos;s start a<br />project together
            </motion.h1>
            <div className="w-[80px] h-[80px] rounded-full bg-[#333] mb-4 shrink-0 overflow-hidden relative hidden md:block">
              {/* TODO avatar image */}
              <div className="absolute inset-0 flex items-center justify-center text-[#999] text-[10px]">
                TODO: /public/avatar.jpg
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-12">
            {[
              { id: "01", name: "name", label: "What's your name?", placeholder: "John Doe *" },
              { id: "02", name: "email", label: "What's your email?", placeholder: "john@doe.com *", type: "email" },
              { id: "03", name: "organization", label: "What's the name of your organization?", placeholder: "John & Doe ®" },
              { id: "04", name: "services", label: "What services are you looking for?", placeholder: "Web Design, Web Development ..." }
            ].map((field) => (
              <div key={field.id} className="flex flex-col md:flex-row gap-4 md:gap-8 border-b border-[#333] pb-6">
                <span className="text-[14px] text-[#999] pt-2">{field.id}</span>
                <div className="flex flex-col w-full">
                  <label htmlFor={field.name} className="text-[20px] md:text-[24px] font-light mb-4">{field.label}</label>
                  <input
                    type={field.type || "text"}
                    id={field.name}
                    name={field.name}
                    value={formData[field.name as keyof typeof formData]}
                    onChange={handleChange}
                    placeholder={field.placeholder}
                    required={field.placeholder.includes("*")}
                    className="bg-transparent border-none outline-none text-[18px] text-white placeholder-[#666] w-full"
                  />
                </div>
              </div>
            ))}

            <div className="flex flex-col md:flex-row gap-4 md:gap-8 border-b border-[#333] pb-6">
              <span className="text-[14px] text-[#999] pt-2">05</span>
              <div className="flex flex-col w-full">
                <label htmlFor="message" className="text-[20px] md:text-[24px] font-light mb-4">Your message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Hello Shailesh, can you help me with ... *"
                  required
                  rows={4}
                  className="bg-transparent border-none outline-none text-[18px] text-white placeholder-[#666] w-full resize-none"
                />
              </div>
            </div>

            <div className="mt-12 flex justify-start">
              <MagneticButton>
                <button 
                  type="submit"
                  className="w-[140px] h-[140px] md:w-[170px] md:h-[170px] bg-[#3A4BE0] rounded-full flex items-center justify-center text-white text-[16px] md:text-[18px] transition-transform hover:scale-105"
                >
                  Send it
                </button>
              </MagneticButton>
            </div>
          </form>
        </div>

        {/* Right Column: Details */}
        <div className="w-full md:w-[35%] flex flex-col gap-16 mt-24">
          
          <div className="flex flex-col gap-4">
            <h3 className="text-[10px] tracking-widest text-[#999]">CONTACT DETAILS</h3>
            <a href="mailto:websk2026@gmail.com" className="text-[16px] md:text-[18px] font-light hover:underline">websk2026@gmail.com</a>
            <a href="tel:+910000000000" className="text-[16px] md:text-[18px] font-light hover:underline">+91 000 000 0000</a>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-[10px] tracking-widest text-[#999]">BUSINESS DETAILS</h3>
            <span className="text-[16px] md:text-[18px] font-light">Websk</span>
            <span className="text-[16px] md:text-[18px] font-light text-[#999]">Location: Ahmedabad, India</span>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-[10px] tracking-widest text-[#999]">SOCIALS</h3>
            <div className="flex flex-col gap-2">
              {["LinkedIn", "GitHub", "Instagram"].map(social => (
                <a key={social} href="#" className="text-[16px] md:text-[18px] font-light hover:underline w-fit">
                  {social}
                </a>
              ))}
            </div>
          </div>

        </div>

      </div>
    </main>
  );
}
