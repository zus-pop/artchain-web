"use client";

import { motion, Variants } from "framer-motion";
import { useRouter } from "next/navigation";
import React from "react";

const ArrowRightIcon = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 14 14"
    fill="none"
    aria-hidden="true"
    className="inline-block"
  >
    <path
      d="M1 7h12M7 1l6 6-6 6"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay: delay * 0.12,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

const fadeLeft: Variants = {
  hidden: { opacity: 0, x: -32 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

const fadeRight: Variants = {
  hidden: { opacity: 0, x: 32 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.94 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.55,
      delay: delay * 0.1,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

const AnimatedContainer = ({
  children,
  className = "",
  animation = "fadeUp",
  delay = 0,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
  animation?: string;
  delay?: number;
} & Omit<React.HTMLAttributes<HTMLDivElement>, "style">) => {
  const variants = {
    fadeUp,
    "animate-fade-in-up": fadeUp,
    "animate-fade-in-down": { hidden: { opacity: 0, y: -20 }, visible: fadeUp.visible },
    "animate-fade-in-left": fadeLeft,
    "animate-fade-in-right": fadeRight,
    "animate-zoom-in": scaleIn,
    "animate-fade-in": { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } } },
  } as Record<string, Variants>;

  const chosen = variants[animation] ?? fadeUp;

  return (
    <motion.div
      className={className}
      variants={chosen}
      initial="hidden"
      whileInView="visible"
      custom={delay}
      viewport={{ once: true, margin: "-60px" }}
      {...(props as object)}
    >
      {children}
    </motion.div>
  );
};

const HeroSection = () => {
  const router = useRouter();

  return (
    <section
      id="hero"
      className="relative w-full h-[80vh] min-h-[400px] lg:h-screen lg:min-h-[700px] flex items-center text-white pt-16"
    >
      <div className="absolute inset-0">
        <img
          src="https://res.cloudinary.com/dbke1s5nm/image/upload/v1762177079/herosection_jznhnz.png"
          alt="Nền bức tranh phong cảnh"
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).style.backgroundColor =
              "#6c7a89";
          }}
        />
      </div>

      <div className="relative z-5 mt-8 max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 w-full">
        <div className="max-w-xl mt-0 sm:mt-[-10vh] lg:mt-[-17vh]">
          <AnimatedContainer
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-[#423137] font-semibold tracking-tighter leading-tight sm:leading-tight"
            animation="animate-fade-in-down"
          >
            CUỘC THI <br />
            NÉT VẼ ƯỚC MƠ <br />
            2026
          </AnimatedContainer>
          <AnimatedContainer
            className="mt-4 sm:mt-6 text-sm sm:text-base lg:text-lg text-black leading-relaxed"
            animation="animate-fade-in-up"
            delay={200}
          >
            Gửi gắm những câu chuyện, ý tưởng và khát{" "}
            <br className="hidden sm:inline" />
            vọng qua màu sắc độc đáo của riêng mình. Nơi{" "}
            <br className="hidden sm:inline" />
            tài năng hội họa của bạn được tỏa sáng.
          </AnimatedContainer>
          <AnimatedContainer
            className="mt-6 sm:mt-10"
            animation="animate-zoom-in"
            delay={400}
          >
            <button
              onClick={() => router.push("/gallery")}
              className="bg-[#FF6E1A] cursor-pointer text-white px-6 sm:px-8 py-3 sm:py-4 font-medium text-sm sm:text-base hover:bg-[#FF833B] rounded-sm transition-colors flex items-center gap-2"
            >
              Xem Triển Lãm <ArrowRightIcon />
            </button>
          </AnimatedContainer>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;