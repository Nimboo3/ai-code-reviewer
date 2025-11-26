"use client";

import { useScroll, useTransform, useSpring, motion, useMotionValue, useMotionTemplate } from "framer-motion";
import { useEffect, useRef } from "react";

export function HeroBackground() {
  const { scrollY } = useScroll();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rafId = useRef<number | undefined>(undefined);

  // Smooth out the mouse movement with reduced stiffness for better performance
  const smoothMouseX = useSpring(mouseX, { stiffness: 30, damping: 20 });
  const smoothMouseY = useSpring(mouseY, { stiffness: 30, damping: 20 });

  // Parallax effects with reduced range for subtler movement
  const y = useTransform(scrollY, [0, 1000], [0, 150]); // Scroll parallax
  const gridX = useTransform(smoothMouseX, [-0.5, 0.5], [-15, 15]); // Mouse parallax X
  const gridY = useTransform(smoothMouseY, [-0.5, 0.5], [-15, 15]); // Mouse parallax Y
  
  // Combine scroll and mouse for Y
  const combinedY = useMotionTemplate`calc(${y}px + ${gridY}px)`;

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Throttle with requestAnimationFrame
      if (rafId.current) return;
      
      rafId.current = requestAnimationFrame(() => {
        // Normalize mouse position from -0.5 to 0.5
        const { innerWidth, innerHeight } = window;
        mouseX.set(e.clientX / innerWidth - 0.5);
        mouseY.set(e.clientY / innerHeight - 0.5);
        rafId.current = undefined;
      });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [mouseX, mouseY]);

  return (
    <motion.div 
      className="absolute inset-0 bg-grid-pattern opacity-20 will-change-transform"
      style={{ x: gridX, y: combinedY }}
    />
  );
}
