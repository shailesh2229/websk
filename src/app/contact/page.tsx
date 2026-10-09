"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { RoundedButton } from "@/components/ui/RoundedButton";
import { ArrowDownRight } from "lucide-react";
import Image from "next/image";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    organization: "",
    services: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        alert("Message sent successfully!");
        setFormData({
          name: "",
          email: "",
          organization: "",
          services: "",
          message: "",
        });
      } else {
        throw new Error("Failed to send");
      }
    } catch (err) {
      // Fallback to mailto if API fails
      window.location.href = `mailto:websk2026@gmail.com?subject=New Inquiry from ${formData.name}&body=${formData.message}`;
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <main className="w-full bg-[#1c1d20] min-h-screen text-[#ffffff] pt-[17vw] pb-[8vw]">
      <div className="w-full relative flex">
        {/* Left Column: Heading + Form */}
        <div
          className="flex flex-col"
          style={{ paddingLeft: "16vw", width: "69vw" }}
        >
          <div className="flex items-start mb-[8vw] relative">
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
              className="text-[6vw] font-normal leading-[1.1] tracking-[-0.02em]"
            >
              Let's start a<br />
              project together
            </motion.h1>

            <div className="absolute right-[5vw] top-[2vw] flex flex-col items-center">
              <div className="w-[5.2vw] h-[5.2vw] rounded-full bg-[#8b9193] mb-[1vw] overflow-hidden relative">
                <Image src="/shailesh-avatar.png" alt="Shailesh" fill className="object-cover object-center" sizes="120px" quality={100} />
              </div>
              <ArrowDownRight className="w-[1.2vw] h-[1.2vw] text-[#ffffff] stroke-[1]" />
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col w-[45vw] relative pb-[10vw]"
          >
            {[
              {
                id: "01",
                name: "name",
                label: "What's your name?",
                placeholder: "John Doe *",
              },
              {
                id: "02",
                name: "email",
                label: "What's your email?",
                placeholder: "john@doe.com *",
                type: "email",
              },
              {
                id: "03",
                name: "organization",
                label: "What's the name of your organization?",
                placeholder: "John & Doe ®",
              },
              {
                id: "04",
                name: "services",
                label: "What services are you looking for?",
                placeholder: "Web Design, Web Development ...",
              },
            ].map((field) => (
              <div
                key={field.id}
                className="flex items-start border-b border-[rgba(255,255,255,0.15)] focus-within:border-[#ffffff] transition-colors h-[9vw]"
              >
                <span className="text-[0.65vw] tracking-[0.03em] text-[#999] pt-[2vw] w-[4vw]">
                  {field.id}
                </span>
                <div className="flex flex-col w-[41vw] pt-[2vw]">
                  <label
                    htmlFor={field.name}
                    className="text-[1.4vw] font-normal mb-[1vw] transition-colors text-[rgba(255,255,255,0.4)] focus-within:text-[#ffffff]"
                  >
                    {field.label}
                  </label>
                  <input
                    type={field.type || "text"}
                    id={field.name}
                    name={field.name}
                    value={formData[field.name as keyof typeof formData]}
                    onChange={handleChange}
                    placeholder={field.placeholder}
                    required={field.placeholder.includes("*")}
                    className="bg-transparent border-none outline-none text-[1.4vw] text-[#ffffff] placeholder-[rgba(255,255,255,0.4)] w-full font-normal"
                  />
                </div>
              </div>
            ))}

            <div className="flex items-start border-b border-[rgba(255,255,255,0.15)] focus-within:border-[#ffffff] transition-colors min-h-[9vw] pb-[2vw] relative">
              <span className="text-[0.65vw] tracking-[0.03em] text-[#999] pt-[2vw] w-[4vw]">
                05
              </span>
              <div className="flex flex-col w-[41vw] pt-[2vw]">
                <label
                  htmlFor="message"
                  className="text-[1.4vw] font-normal mb-[1vw] transition-colors text-[rgba(255,255,255,0.4)] focus-within:text-[#ffffff]"
                >
                  Your message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Hello Shailesh, can you help me with ... *"
                  required
                  rows={2}
                  className="bg-transparent border-none outline-none text-[1.4vw] text-[#ffffff] placeholder-[rgba(255,255,255,0.4)] w-full font-normal resize-none"
                />
              </div>

              {/* Send it button */}
              <div className="absolute right-[-8vw] top-[100%] -translate-y-1/2 z-10">
                <RoundedButton
                  type="submit"
                  className="w-[12vw] h-[12vw] bg-[#3A4BE0] text-[#ffffff] text-[1.2vw] font-normal"
                  fillColor="#2B38C4"
                >
                  Send it!
                </RoundedButton>
              </div>
            </div>
          </form>
        </div>

        {/* Right Column: Details */}
        <div
          className="w-[31vw] flex flex-col gap-[4vw] mt-[10vw]"
          style={{ paddingRight: "11vw" }}
        >
          <div className="flex flex-col gap-[1vw]">
            <h3 className="text-[0.65vw] tracking-[0.03em] uppercase text-[#999]">
              CONTACT DETAILS
            </h3>
            <a
              href="mailto:websk2026@gmail.com"
              className="text-[1vw] font-normal text-[#ffffff] hover:opacity-70 transition-opacity"
            >
              websk2026@gmail.com
            </a>
            <a
              href="tel:+910000000000"
              className="text-[1vw] font-normal text-[#ffffff] hover:opacity-70 transition-opacity"
            >
              +91 000 000 0000
            </a>
          </div>

          <div className="flex flex-col gap-[1vw]">
            <h3 className="text-[0.65vw] tracking-[0.03em] uppercase text-[#999]">
              BUSINESS DETAILS
            </h3>
            <span className="text-[1vw] font-normal text-[#ffffff]">Websk</span>
            <span className="text-[1vw] font-normal text-[rgba(255,255,255,0.5)]">
              Location: Ahmedabad, India
            </span>
          </div>

          <div className="flex flex-col gap-[1vw]">
            <h3 className="text-[0.65vw] tracking-[0.03em] uppercase text-[#999]">
              SOCIALS
            </h3>
            <div className="flex flex-col gap-[0.5vw]">
              {["LinkedIn", "GitHub", "Instagram"].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="text-[1vw] font-normal text-[#ffffff] hover:opacity-70 transition-opacity w-fit"
                >
                  {social}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Meta Row Only */}
      <div
        className="w-full flex items-end justify-between mt-[10vw]"
        style={{ paddingLeft: "2.8vw", paddingRight: "3vw" }}
      >
        <div className="flex items-start" style={{ gap: "2vw" }}>
          <div className="flex flex-col">
            <span className="text-[0.65vw] tracking-[0.03em] uppercase text-[rgba(255,255,255,0.5)] mb-[1vw]">
              VERSION
            </span>
            <span className="text-[1vw] text-[#ffffff]">2026 © Edition</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[0.65vw] tracking-[0.03em] uppercase text-[rgba(255,255,255,0.5)] mb-[1vw]">
              LOCAL TIME
            </span>
            <span className="text-[1vw] text-[#ffffff]">IST</span>
          </div>
        </div>

        <div className="flex flex-col items-start">
          <span className="text-[0.65vw] tracking-[0.03em] uppercase text-[rgba(255,255,255,0.5)] mb-[1vw]">
            SOCIALS
          </span>
          <div className="flex items-center" style={{ gap: "2vw" }}>
            <a
              href="#"
              className="text-[1vw] text-[#ffffff] hover:opacity-70 transition-opacity"
            >
              LinkedIn
            </a>
            <a
              href="#"
              className="text-[1vw] text-[#ffffff] hover:opacity-70 transition-opacity"
            >
              GitHub
            </a>
            <a
              href="#"
              className="text-[1vw] text-[#ffffff] hover:opacity-70 transition-opacity"
            >
              Instagram
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
