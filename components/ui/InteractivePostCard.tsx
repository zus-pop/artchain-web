"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import GlassSurface from "@/components/GlassSurface";

interface InteractivePostCardProps {
  postId: number;
  title: string;
  imageUrl?: string | null;
  tagName?: string;
}

export const InteractivePostCard: React.FC<InteractivePostCardProps> = ({
  postId,
  title,
  imageUrl,
  tagName,
}) => {
  return (
    <Link href={`/posts/${postId}`} className="group block overflow-hidden rounded-2xl bg-[var(--site-ink)]/5 shadow-xl transition-all duration-700 hover:scale-[1.01] hover:shadow-2xl">
      <div className="relative aspect-[16/10] overflow-hidden">
        {/* Background Image - with Blur on Hover */}
        <Image
          src={imageUrl || "https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?auto=format&fit=crop&q=80&w=1200"}
          alt={title}
          fill
          className="object-cover transition-all duration-1000 group-hover:scale-110 group-hover:blur-[2px]"
        />

        {/* Tag Badge */}
        <div className="absolute top-5 left-5 z-20">
          <span className="px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.15em] shadow-lg backdrop-blur-md bg-white/20 text-white border border-white/30">
            {tagName || "Sự kiện"}
          </span>
        </div>

        {/* --- Circular Trajectory "Explore" Icon with GlassSurface --- */}
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
    </Link>
  );
};
