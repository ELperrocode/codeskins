"use client";
import { cn } from "../../../lib/utils";
import React, { useEffect, useRef } from "react";

export const BackgroundBeams = ({ className }: { className?: string }) => {
  const beamsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!beamsRef.current) return;

    const beams = beamsRef.current;
    const handleMouseMove = (e: MouseEvent) => {
      const rect = beams.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      beams.style.setProperty("--mouse-x", `${mouseX}px`);
      beams.style.setProperty("--mouse-y", `${mouseY}px`);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      ref={beamsRef}
      className={cn(
        "pointer-events-none absolute inset-0 z-30 transition duration-300 lg:absolute",
        className
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 to-orange-500/20" />
      <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 to-orange-500/10" />
      <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/5 to-orange-500/5" />
      <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/2 to-orange-500/2" />
      <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/1 to-orange-500/1" />
    </div>
  );
}; 