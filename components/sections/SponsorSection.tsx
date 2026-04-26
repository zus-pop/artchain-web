"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { getSponsors } from "@/apis/sponsor";
import { SponsorData } from "@/types/campaign";
import SplitText from "@/components/SplitText";
import BlurText from "@/components/BlurText";

export const SponsorSection = () => {
  const [sponsors, setSponsors] = useState<SponsorData[]>([]);
  const [loading, setLoading] = useState(true);
  
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  // Calculate the total horizontal movement needed
  // We'll move the list by (number of items * width of item + gaps) - container width
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-70%"]);

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

  // Only show section if not loading and we have sponsors
  // But we MUST render the container for the ref to avoid hydration errors with useScroll
  return (
    <section ref={targetRef} className={`relative bg-[var(--site-bg)] border-t border-[var(--site-ink)]/5 ${sponsors.length > 0 ? 'h-[600vh]' : 'h-auto py-12'}`}>
      {loading || sponsors.length === 0 ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 flex items-center gap-3">
           <div className="w-2.5 h-2.5 rounded-sm bg-[var(--site-ink)]/10 animate-pulse" />
           <div className="h-4 w-32 bg-[var(--site-ink)]/5 rounded-sm animate-pulse" />
        </div>
      ) : (
        /* Sticky Container */
        <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden">
        
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 w-full mb-24">
          {/* Section Header - Split Layout */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col lg:flex-row lg:items-start justify-between gap-10"
          >
            <div className="flex flex-col gap-4">
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[var(--site-accent)]">
                Đối tác & Tài trợ
              </span>
              <SplitText
                text="Đồng hành cùng nghệ thuật"
                tag="h2"
                className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tighter text-[var(--site-ink)] leading-[0.95]"
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
          </motion.div>
        </div>

        {/* Horizontal Moving Track */}
        <div className="flex items-center">
          <motion.div style={{ x }} className="flex gap-40 px-16 sm:px-32">
            {sponsors.map((sponsor, idx) => (
              <div
                key={`${sponsor.sponsorId}-${idx}`}
                className="relative flex-shrink-0 flex items-center justify-center transition-all duration-500"
              >
                <div className="relative w-56 h-28 sm:w-80 sm:h-40 flex items-center justify-center">
                  <img
                    src={sponsor.logoUrl || ""}
                    alt={sponsor.name}
                    className="max-w-full max-h-full object-contain filter drop-shadow-sm select-none"
                  />
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
      )}
    </section>
  );
};
