"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import Image from "next/image";
import { getCampaigns } from "@/apis/campaign";
import { CampaignAPIResponse } from "@/types/campaign";
import { formatNumber } from "@/lib/utils";
import { InteractiveHeroButton } from "@/components/ui/InteractiveHeroButton";

// ─── Types ────────────────────────────────────────────────────────────────────

type Direction = -1 | 1;

// ─── Campaign Panel (Cinematic Overlay Style) ───────────────────────────────

const CampaignPanel = ({ item }: { item: CampaignAPIResponse }) => {
  const progress = Math.min(
    100,
    (Number(item.currentAmount) / Number(item.goalAmount)) * 100
  );

  return (
    <div className="absolute inset-0 w-full h-full rounded-sm overflow-hidden">
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
          <div className="flex items-center">
             <span className="px-4 py-1.5 rounded-sm text-[10px] font-bold uppercase tracking-[0.15em] shadow-lg backdrop-blur-md bg-white/20 text-white border border-white/30">
               {item.status === "ACTIVE" ? "Đang diễn ra" : "Đã kết thúc"}
             </span>
          </div>

          {/* Stable Title Container */}
          <div className="min-h-[140px] sm:min-h-[160px] flex flex-col justify-start">
            <h3 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tighter leading-[1.15] py-1 text-left">
              {item.title}
            </h3>
          </div>

          <div className="space-y-8">
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
                <div
                  className="h-full bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <div className="flex items-center gap-6">
               <InteractiveHeroButton href={`/campaigns/${item.campaignId}`} label="Đồng hành ngay" variant="primary" />
            </div>
          </div>
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
    getCampaigns({ limit: 3 })
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
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tighter text-[var(--site-ink)] max-w-2xl leading-[1.1] py-1 text-left">
              Góp sức cho thế hệ nghệ thuật
            </h2>
          </div>
          
          <div className="flex flex-col gap-6 lg:pt-10">
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
          <div className="absolute inset-0">
            <CampaignPanel item={campaigns[currentIndex]} />
          </div>

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
                    className={`relative w-24 h-12 sm:w-32 sm:h-16 rounded-sm border-2 transition-all duration-700 overflow-hidden shadow-2xl group/btn
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
