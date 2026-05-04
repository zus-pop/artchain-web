"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

/**
 * 3D Parallax Hero Component
 * 
 * Creates a depth effect using three layered images that tilt based on mouse movement.
 * Layer 1 is on top (foremost), Layer 3 is at the bottom (background).
 */
export default function ParallaxHero() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Mouse position values (-0.5 to 0.5)
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);

  // Smooth springs for fluid movement — increased stiffness for faster trigger
  const mouseXSpring = useSpring(x, { stiffness: 250, damping: 25 });
  const mouseYSpring = useSpring(y, { stiffness: 250, damping: 25 });

  // Transform mouse position to rotation values
  const rotateX = useTransform(mouseYSpring, [0, 1], [10, -10]);
  const rotateY = useTransform(mouseXSpring, [0, 1], [-10, 10]);

  const handleMouseMove = (event: React.MouseEvent | MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    x.set(mouseX / width);
    y.set(mouseY / height);
  };

  const handleMouseLeave = () => {
    x.set(0.5);
    y.set(0.5);
  };

  // Parallax offsets for each layer — reduced amplitude for subtlety
  // Layer 1 (Top) moves WITH the mouse
  const l1X = useTransform(mouseXSpring, [0, 1], [-30, 30]);
  const l1Y = useTransform(mouseYSpring, [0, 1], [-30, 30]);
  
  // Layer 2 (Middle) moves slightly AGAINST the mouse
  const l2X = useTransform(mouseXSpring, [0, 1], [10, -10]);
  const l2Y = useTransform(mouseYSpring, [0, 1], [10, -10]);

  // Layer 3 (Bottom) moves strongly AGAINST the mouse
  const l3X = useTransform(mouseXSpring, [0, 1], [20, -20]);
  const l3Y = useTransform(mouseYSpring, [0, 1], [20, -20]);

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="fixed inset-0 w-screen h-screen bg-black overflow-hidden cursor-crosshair z-[100]"
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className="relative w-full h-full"
      >
        <div className="absolute inset-0 w-full h-full">
          {/* Layer 3 (Bottom/Background) */}
          <motion.div
            style={{
              x: l3X,
              y: l3Y,
              z: 0,
            }}
            className="absolute inset-0 z-10"
          >
            <img
              src="/images/hero/hero3.png"
              alt="Background Layer"
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 min-w-[150vw] min-h-[150vh] object-cover object-top select-none pointer-events-none"
            />
          </motion.div>

          {/* Layer 2 (Middle) */}
          <motion.div
            style={{
              x: l2X,
              y: l2Y,
              z: 50,
            }}
            className="absolute inset-0 z-20 pointer-events-none"
          >
            <img
              src="/images/hero/hero2.png"
              alt="Middle Layer"
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 min-w-[150vw] min-h-[150vh] object-cover object-top select-none"
            />
          </motion.div>

          {/* Layer 1 (Top/Foreground) */}
          <motion.div
            style={{
              x: l1X,
              y: l1Y,
              z: 100,
            }}
            className="absolute inset-0 z-30 pointer-events-none"
          >
            <img
              src="/images/hero/hero1.png"
              alt="Foreground Layer"
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 min-w-[150vw] min-h-[150vh] object-cover object-top select-none"
            />
          </motion.div>

          {/* Subtle reflection overlay */}
          <motion.div
            style={{
              z: 120,
              opacity: useTransform(mouseYSpring, [0, 1], [0.05, 0.2]),
            }}
            className="absolute inset-0 z-40 bg-gradient-to-br from-white/10 to-transparent pointer-events-none"
          />
        </div>
      </motion.div>
      <div className="absolute top-10 left-10 z-50">
        <h2 className="text-[var(--site-ink)] text-2xl font-bold tracking-tighter mix-blend-difference">
          ARTCHAIN <span className="font-light italic text-[var(--site-accent)]">EXPERIENCE</span>
        </h2>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-50 text-center pointer-events-none">
        <p className="text-white/60 text-[10px] font-medium tracking-[0.3em] uppercase mix-blend-difference">
          Interactive Parallax Environment
        </p>
      </div>
    </div>
  );
}
