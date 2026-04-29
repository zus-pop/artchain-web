"use client";

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
          <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-[#423137] font-semibold tracking-tighter leading-tight sm:leading-tight">
            CUỘC THI <br />
            NÉT VẼ ƯỚC MƠ <br />
            2026
          </div>
          <div className="mt-4 sm:mt-6 text-sm sm:text-base lg:text-lg text-black leading-relaxed">
            Gửi gắm những câu chuyện, ý tưởng và khát{" "}
            <br className="hidden sm:inline" />
            vọng qua màu sắc độc đáo của riêng mình. Nơi{" "}
            <br className="hidden sm:inline" />
            tài năng hội họa của bạn được tỏa sáng.
          </div>
          <div className="mt-6 sm:mt-10">
            <button
              onClick={() => router.push("/gallery")}
              className="bg-[#FF6E1A] cursor-pointer text-white px-6 sm:px-8 py-3 sm:py-4 font-medium text-sm sm:text-base hover:bg-[#FF833B] rounded-sm transition-colors flex items-center gap-2"
            >
              Xem Triển Lãm <ArrowRightIcon />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;