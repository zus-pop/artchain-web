"use client";

import React, { useEffect, useState } from "react";
import { getSponsors } from "@/apis/sponsor";
import { SponsorData } from "@/types/campaign";
import SplitText from "@/components/SplitText";
import BlurText from "@/components/BlurText";

export const SponsorSection = () => {
  const [sponsors, setSponsors] = useState<SponsorData[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchSponsors = async () => {
      try {
        const data = await getSponsors();
        
        // Filter by unique name (case-insensitive) to avoid seeing the same company multiple times
        const uniqueSponsorsMap = new Map<string, SponsorData>();
        
        data.filter(s => s.logoUrl).forEach(s => {
          const normalizedName = s.name.toLowerCase().trim();
          if (!uniqueSponsorsMap.has(normalizedName) || 
              Number(s.sponsorshipAmount) > Number(uniqueSponsorsMap.get(normalizedName)?.sponsorshipAmount || 0)) {
            uniqueSponsorsMap.set(normalizedName, s);
          }
        });

        const validSponsors = Array.from(uniqueSponsorsMap.values())
          .sort((a, b) => Number(b.sponsorshipAmount) - Number(a.sponsorshipAmount))
          .slice(0, 10);
          
        setSponsors(validSponsors);
      } catch (error) {
        console.error("Error fetching sponsors:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSponsors();
  }, []);

  const sponsorsLoop = sponsors.length ? [...sponsors, ...sponsors] : [];

  // Only show section if not loading and we have sponsors
  return (
    <section className={`relative bg-[var(--site-bg)] border-t border-[var(--site-ink)]/5 ${sponsors.length > 0 ? 'py-20 sm:py-28' : 'h-auto py-12'}`}>
      {loading || sponsors.length === 0 ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 flex items-center gap-3">
           <div className="w-2.5 h-2.5 rounded-sm bg-[var(--site-ink)]/10 animate-pulse" />
           <div className="h-4 w-32 bg-[var(--site-ink)]/5 rounded-sm animate-pulse" />
        </div>
      ) : (
        <div className="flex flex-col overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 w-full mb-16">
            {/* Section Header - Split Layout */}
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-10">
              <div className="flex flex-col gap-4">
                <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[var(--site-accent)]">
                  Đối tác & Tài trợ
                </span>
                <SplitText
                  text="Đồng hành cùng nghệ thuật"
                  tag="h2"
                  className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tighter text-[var(--site-ink)] leading-[1.1] py-1"
                  textAlign="left"
                  delay={40}
                  splitType="words"
                />
              </div>
              <div className="lg:pt-8">
                <BlurText
                  text="Sự hỗ trợ quý báu từ các tổ chức và cá nhân giúp ArtChain duy trì và phát triển cộng đồng nghệ thuật Việt Nam, mang những giá trị hội họa đến gần hơn với công chúng."
                  className="text-lg text-[var(--site-ink)]/50 max-w-xl leading-relaxed lg:mb-2"
                  delay={20}
                  animateBy="words"
                  direction="bottom"
                />
              </div>
            </div>
          </div>

          {/* Auto Moving Track */}
          <div className="relative overflow-hidden">
            <div className="sponsor-marquee flex gap-16 px-16 sm:px-32">
              {sponsorsLoop.map((sponsor, idx) => (
                <div
                  key={`${sponsor.sponsorId}-${idx}`}
                  className="relative flex-shrink-0 flex items-center justify-center transition-all duration-500"
                >
                  <div className="group relative w-48 h-24 sm:w-64 sm:h-32 rounded-sm border-[6px] border-white overflow-hidden flex items-center justify-center hover:scale-105 hover:border-[var(--site-accent)] transition-all duration-300 shadow-md">
                    <img
                      src={sponsor.logoUrl || ""}
                      alt={sponsor.name}
                      className="w-[80%] h-auto max-h-[80%] object-contain filter select-none transition-transform duration-300 group-hover:scale-90"
                    />
                    {/* Hover Overlay for Name */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4 text-center">
                      <span className="text-white text-xs sm:text-sm font-bold leading-tight">
                        {sponsor.name}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <style jsx>{`
            .sponsor-marquee {
              animation: sponsor-marquee 28s linear infinite;
              width: max-content;
            }
            @keyframes sponsor-marquee {
              from {
                transform: translateX(0);
              }
              to {
                transform: translateX(-50%);
              }
            }
          `}</style>
        </div>
      )}
    </section>
  );
};
