"use client";

import React, { useEffect, useRef, useState } from "react";

interface Props {
  text: string;
  className?: string;
}

export function SplitTextLines({ text, className }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [lines, setLines] = useState<string[][]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    let timeoutId: NodeJS.Timeout;

    const split = () => {
      if (!containerRef.current) return;
      
      // Keep original text to measure
      const words = text.split(" ");
      containerRef.current.innerHTML = words.map(w => `<span class="word-measure inline-block mr-[0.25em]">${w}</span>`).join("");
      
      const wordSpans = Array.from(containerRef.current.querySelectorAll(".word-measure")) as HTMLElement[];
      
      let currentLine: string[] = [];
      let currentY = -1;
      const newLines: string[][] = [];

      wordSpans.forEach((span, i) => {
        if (currentY === -1) {
          currentY = span.offsetTop;
          currentLine.push(words[i]);
        } else if (Math.abs(span.offsetTop - currentY) > 5) { // new line
          newLines.push([...currentLine]);
          currentLine = [words[i]];
          currentY = span.offsetTop;
        } else {
          currentLine.push(words[i]);
        }
      });
      if (currentLine.length > 0) newLines.push(currentLine);
      
      // Clear it so React can render the new state safely
      containerRef.current.innerHTML = "";
      setLines(newLines);
    };

    split();

    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setLines([]);
        setTimeout(split, 10);
      }, 150);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timeoutId);
    };
  }, [text]);

  // If not mounted or no lines yet, render a hidden version for SEO / layout
  if (!isMounted || lines.length === 0) {
    return (
      <div ref={containerRef} className={`${className} opacity-0`}>
        {text}
      </div>
    );
  }

  return (
    <div className={`${className} split-text-container`}>
      {lines.map((lineWords, i) => (
        <span key={i} className="line-wrapper block overflow-hidden">
          <span className="line-inner block will-change-transform translate-y-[100%]">
            {lineWords.join(" ")}
          </span>
        </span>
      ))}
    </div>
  );
}
