"use client";

import React, { useRef, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

/**
 * ParallaxBackground Component
 * 
 * A 3D layered parallax background that reacts to mouse movement.
 * Optimized for Hero sections.
 */
export const ParallaxBackground = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Mouse position values (-0.5 to 0.5)
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);

  // Smooth springs for fluid movement — snappy trigger as requested
  const mouseXSpring = useSpring(x, { stiffness: 250, damping: 25 });
  const mouseYSpring = useSpring(y, { stiffness: 250, damping: 25 });

  // Transform mouse position to rotation values
  const rotateX = useTransform(mouseYSpring, [0, 1], [8, -8]);
  const rotateY = useTransform(mouseXSpring, [0, 1], [-8, 8]);

  useEffect(() => {
    const handleGlobalMouseMove = (event: MouseEvent) => {
      // We use window dimensions for global tracking to ensure consistent feel
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      x.set(event.clientX / width);
      y.set(event.clientY / height);
    };

    window.addEventListener("mousemove", handleGlobalMouseMove);
    return () => window.removeEventListener("mousemove", handleGlobalMouseMove);
  }, [x, y]);

  // Parallax offsets for each layer — subtle amplitude as requested
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
      className="absolute inset-0 w-full h-full overflow-hidden bg-black select-none pointer-events-none"
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
              alt=""
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 min-w-[130%] min-h-[130%] object-cover object-top pointer-events-none"
            />
          </motion.div>

          {/* Layer 2 (Middle) */}
          <motion.div
            style={{
              x: l2X,
              y: l2Y,
              z: 40,
            }}
            className="absolute inset-0 z-20"
          >
            <img
              src="/images/hero/hero2.png"
              alt=""
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 min-w-[130%] min-h-[130%] object-cover object-top pointer-events-none"
            />
          </motion.div>

          {/* Layer 1 (Top/Foreground) */}
          <motion.div
            style={{
              x: l1X,
              y: l1Y,
              z: 80,
            }}
            className="absolute inset-0 z-30"
          >
            <img
              src="/images/hero/hero1.png"
              alt=""
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 min-w-[130%] min-h-[130%] object-cover object-top pointer-events-none"
            />
          </motion.div>

          {/* Dynamic Light Reflection Overlay */}
          <motion.div
            style={{
              z: 100,
              opacity: useTransform(mouseYSpring, [0, 1], [0.05, 0.15]),
            }}
            className="absolute inset-0 z-40 bg-gradient-to-br from-white/10 to-transparent pointer-events-none"
          />
        </div>
      </motion.div>
    </div>
  );
};

export default ParallaxBackground;
