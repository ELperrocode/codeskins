"use client";
import { cn } from "../../../lib/utils";
import React, { useRef, useEffect } from "react";

export const BackgroundGradient = ({
  children,
  className,
  containerClassName,
  animate = true,
}: {
  children?: React.ReactNode;
  className?: string;
  containerClassName?: string;
  animate?: boolean;
}) => {
  const mouseX = useRef(0);
  const mouseY = useRef(0);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      mouseX.current = event.clientX;
      mouseY.current = event.clientY;
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      className={cn(
        "relative h-full w-full bg-slate-900 dark:bg-slate-900",
        containerClassName
      )}
    >
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-slate-900 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-slate-900">
        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-r from-yellow-500 to-orange-500 opacity-40 transition duration-1000 ease-out group-hover:opacity-100 group-hover:duration-200 animate-pulse",
            className
          )}
        />
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  );
}; 