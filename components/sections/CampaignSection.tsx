"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { getCampaigns } from "@/apis/campaign";
import { CampaignAPIResponse } from "@/types/campaign";
import { formatNumber } from "@/lib/utils";
import { InteractiveHeroButton } from "@/components/ui/InteractiveHeroButton";
import { ChevronLeft, ChevronRight } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Direction = -1 | 1;

// ─── Animation Variants (Cinematic Slow Zoom Out) ──────────────────────────
const zoomVariants = {
  enter: {
    scale: 1.15, // Starts slightly zoomed in to "zoom out" into center
    opacity: 0,
  },
  center: {
    scale: 1,
    opacity: 1,
  },
  exit: {
    scale: 0.95,
    opacity: 0,
  },
};

const transition = {
  duration: 1.5, // Slower transition as requested
  ease: [0.16, 1, 0.3, 1], // Smooth deceleration (slow down at the end)
};

// ─── Campaign Panel (Cinematic Overlay Style) ───────────────────────────────

const CampaignPanel = ({ item }: { item: CampaignAPIResponse }) => {
  const progress = Math.min(
    100,
    (Number(item.currentAmount) / Number(item.goalAmount)) * 100
  );

  return (
    <div className="absolute inset-0 w-full h-full rounded-[2.5rem] overflow-hidden">
      {/* Background Image - Full width/height */}
      <div className="absolute inset-0">
        <Image
          src={item.image || "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=1200"}
          alt={item.title}
          fill
          priority
          draggable={false}
          className="object-cover select-none"
        />
        {/* Cinematic Overlays */}
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
      </div>

      {/* Content Overlay - Positioned on the left */}
      <div className="relative h-full w-full lg:w-3/5 p-10 sm:p-16 flex flex-col">
        <div className="space-y-8 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="flex items-center gap-3"
          >
             <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_10px_#34d399]" />
             <span className="text-[10px] font-bold text-white uppercase tracking-[0.3em]">
               {item.status === "ACTIVE" ? "Đang diễn ra" : "Đã kết thúc"}
             </span>
          </motion.div>

          {/* Stable Title Container */}
          <div className="min-h-[140px] sm:min-h-[160px] flex flex-col justify-start">
            <motion.h3 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tighter leading-[1.05]"
            >
              {item.title}
            </motion.h3>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.8 }}
            className="space-y-8"
          >
            {/* Progress Section */}
            <div className="space-y-4 max-w-lg">
              <div className="flex justify-between items-end text-white">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest block">
                    Đã quyên góp
                  </span>
                  <span className="text-3xl font-black">
                    {formatNumber(Number(item.currentAmount))} <span className="text-sm font-bold text-white/30 tracking-normal">VND</span>
                  </span>
                </div>
                <div className="text-right flex flex-col gap-1">
                   <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest block">Mục tiêu</span>
                   <span className="text-base font-bold text-white/60">{formatNumber(Number(item.goalAmount))} VND</span>
                </div>
              </div>

              <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden backdrop-blur-sm">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1.5, delay: 1.5 }}
                  className="h-full bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full"
                />
              </div>
            </div>

            <div className="flex items-center gap-6">
               <InteractiveHeroButton href={`/campaigns/${item.campaignId}`} label="Đồng hành ngay" variant="primary" />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

// ─── CampaignSection ──────────────────────────────────────────────────────────

export const CampaignSection = () => {
  const [campaigns, setCampaigns] = useState<CampaignAPIResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<Direction>(1);

  const touchStartX = useRef(0);

  useEffect(() => {
    // Fetch only top 3, sorted by most recent
    getCampaigns({ limit: 3, sortBy: "createdAt", order: "DESC" })
      .then((res) => setCampaigns(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const navigate = useCallback(
    (dir: Direction) => {
      setDirection(dir);
      setCurrentIndex((prev) => {
        let next = prev + dir;
        if (next < 0) next = campaigns.length - 1;
        if (next >= campaigns.length) next = 0;
        return next;
      });
    },
    [campaigns.length]
  );

  if (loading || campaigns.length === 0) return null;

  return (
    <section className="bg-[var(--site-bg)] py-24 sm:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16">

        {/* ── Header ── */}
        <div className="flex flex-col lg:flex-row lg:items-start justify-between mb-16 gap-10">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[var(--site-accent)]">
                Chiến dịch
              </span>
            </div>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tighter text-[var(--site-ink)] max-w-2xl leading-[0.95]">
              Góp sức cho <br className="hidden sm:block" /> thế hệ nghệ thuật
            </h2>
          </div>
          
          <div className="flex flex-col gap-6 lg:pt-8">
            <p className="text-lg text-[var(--site-ink)]/50 max-w-md leading-relaxed lg:mb-2">
              Mỗi sự đóng góp của bạn đều trực tiếp hỗ trợ các tài năng trẻ và duy trì những hoạt động nghệ thuật cộng đồng đầy ý nghĩa.
            </p>
            <InteractiveHeroButton href="/campaigns" label="Xem tất cả" />
          </div>
        </div>

        {/* ── Overlay Swap Container ── */}
        <div
          className="relative h-[800px] md:h-[700px] w-full"
          onTouchStart={(e) => { touchStartX.current = e.changedTouches[0].clientX; }}
          onTouchEnd={(e) => {
            const diff = touchStartX.current - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 50) {
              const dir = diff > 0 ? 1 : -1;
              setDirection(dir as Direction);
              setCurrentIndex((prev) => (prev + dir + campaigns.length) % campaigns.length);
            }
          }}
        >
          <AnimatePresence initial={false} mode="sync">
            <motion.div
              key={currentIndex}
              variants={zoomVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={transition}
              className="absolute inset-0"
              style={{ willChange: "transform, opacity" }}
            >
              <CampaignPanel item={campaigns[currentIndex]} />
            </motion.div>
          </AnimatePresence>

          {/* Navigation Controls Overlay - RECTANGULAR Thumbnails */}
          <div className="absolute bottom-10 left-10 sm:left-16 z-20 flex items-center gap-5">
             <div className="flex items-center gap-4">
                {campaigns.map((c, i) => (
                  <button
                    key={c.campaignId}
                    onClick={() => {
                      if (i === currentIndex) return;
                      setDirection(i > currentIndex ? 1 : -1);
                      setCurrentIndex(i);
                    }}
                    className={`relative w-24 h-12 sm:w-32 sm:h-16 rounded-xl border-2 transition-all duration-700 overflow-hidden shadow-2xl group/btn
                      ${i === currentIndex 
                        ? 'border-white scale-110 z-10 ring-4 ring-white/10' 
                        : 'border-white/20 opacity-40 hover:opacity-100 hover:border-white/50'}`}
                  >
                    <img
                      src={c.image || `https://i.pravatar.cc/100?u=${c.campaignId}`}
                      alt="nav"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover/btn:scale-110"
                    />
                  </button>
                ))}
             </div>
          </div>
        </div>
      </div>
    </section>
  );
};
