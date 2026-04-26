"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import GlassSurface from "@/components/GlassSurface";

interface InteractiveContestCardProps {
  contestId: string;
  title: string;
  bannerUrl?: string;
  startDate: string;
  endDate: string;
  status: "active" | "upcoming";
}

export const InteractiveContestCard: React.FC<InteractiveContestCardProps> = ({
  contestId,
  title,
  bannerUrl,
  startDate,
  endDate,
  status,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="group relative mb-16 last:mb-0"
    >
      <Link href={`/contests/${contestId}`} className="block">
        {/* Main Card Container */}
        <div className="relative aspect-[16/10] overflow-hidden rounded-sm bg-[var(--site-ink)]/5 shadow-xl transition-all duration-700 group-hover:scale-[1.01] group-hover:shadow-2xl">
          
          {/* Background Image - Now with Blur on Hover */}
          <Image
            src={bannerUrl || "https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?auto=format&fit=crop&q=80&w=1200"}
            alt={title}
            fill
            className="object-cover transition-all duration-1000 group-hover:scale-110 group-hover:blur-[2px]"
          />

          {/* Status Badge */}
          <div className="absolute top-5 left-5 z-20">
            <span className="px-4 py-1.5 rounded-sm text-[10px] font-bold uppercase tracking-[0.15em] shadow-lg backdrop-blur-md bg-white/20 border border-white/30 text-white">
              {status === "active" ? "Đang diễn ra" : "Sắp tới"}
            </span>
          </div>

          {/* --- Circular Trajectory "Explore" Icon with GlassSurface --- */}
          {/* Arc motion from Top Down into the corner */}
          <div className="absolute top-0 right-0 w-40 h-40 pointer-events-none overflow-hidden z-40">
            <div className="absolute -top-20 -right-20 w-40 h-40 origin-center transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] rotate-[-90deg] group-hover:rotate-0">
              <div className="absolute bottom-4 left-4 pointer-events-auto">
                <GlassSurface 
                  width={56} 
                  height={56} 
                  borderRadius={28} 
                  brightness={120} 
                  opacity={0.9}
                  blur={8}
                  className="items-center justify-center shadow-2xl border border-white/60"
                >
                  <div className="flex items-center justify-center w-full h-full text-[var(--site-ink)]">
                    <svg 
                      className="w-6 h-6 transition-transform duration-500 group-hover:rotate-12" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path 
                        d="M12 4V20M12 4L18 10M12 4L6 10" 
                        stroke="currentColor" 
                        strokeWidth="2.5" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                        className="rotate-45 origin-center"
                      />
                    </svg>
                  </div>
                </GlassSurface>
              </div>
            </div>
          </div>

          {/* Cinematic Overlay on Hover */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500 pointer-events-none" />
        </div>

        {/* Content Below Card */}
        <div className="flex flex-col gap-3 px-2 mt-6">
          <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--site-ink)] group-hover:text-[var(--site-accent)] transition-colors duration-500">
            {title}
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--site-ink)]/40">Thời gian:</span>
            <span className="text-xs sm:text-sm font-semibold text-[var(--site-ink)]">
              {new Date(startDate).toLocaleDateString("vi-VN")} – {new Date(endDate).toLocaleDateString("vi-VN")}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};
