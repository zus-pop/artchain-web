"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useGetContestsPaginated } from "@/apis/contests";
import { Contest } from "@/types/contest";

import { InteractiveContestCard } from "@/components/ui/InteractiveContestCard";
import { InteractiveHeroButton } from "@/components/ui/InteractiveHeroButton";

export const ContestSection = () => {
  // Fetch 2 Active contests and 1 Upcoming contest
  const { data: activeContests = [], isLoading: isLoadingActive } = useGetContestsPaginated("ACTIVE", 1, 2);
  const { data: upcomingContests = [], isLoading: isLoadingUpcoming } = useGetContestsPaginated("UPCOMING", 1, 1);

  const isLoading = isLoadingActive || isLoadingUpcoming;
  const allContests = [...activeContests, ...upcomingContests];


  return (
    <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 py-24 sm:py-32">
      <div className="flex flex-col lg:flex-row gap-16 lg:gap-32 items-stretch">
        
        {/* Left Side: Pinned Content Column */}
        <div className="lg:w-1/3 relative">
          <div className="sticky top-[110px] h-fit z-40">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <span className="inline-block px-4 py-1.5 rounded-full bg-[var(--site-accent)]/10 text-[10px] font-bold uppercase tracking-[0.25em] mb-8 text-[var(--site-accent)]">
Cuộc thi
              </span>
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tighter leading-[1.05] text-[var(--site-ink)] mb-8">
                Nổi Bật
              </h2>
              <p className="text-lg text-[var(--site-ink)]/60 leading-relaxed mb-12 max-w-md">
                Cập nhật các cuộc thi đang diễn ra và sắp tới. Dù bạn đã sẵn sàng tham gia hay đang chuẩn bị cho bước tiếp theo, chúng tôi luôn có cơ hội phù hợp dành cho bạn.
              </p>
              <InteractiveHeroButton 
                href="/contests"
                label="Xem tất cả cuộc thi"
              />
            </motion.div>
          </div>
        </div>

        {/* Right Side: Scrollable Contest List */}
        <div className="lg:w-2/3">
          <div className="flex flex-col">
            {isLoading ? (
              <div className="flex flex-col gap-16">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="aspect-[16/10] bg-[var(--site-ink)]/5 rounded-2xl mb-6" />
                    <div className="h-8 bg-[var(--site-ink)]/10 w-3/4 rounded mb-4" />
                    <div className="h-4 bg-[var(--site-ink)]/5 w-1/2 rounded" />
                  </div>
                ))}
              </div>
            ) : allContests.length > 0 ? (
              allContests.map((contest, index) => (
                <InteractiveContestCard 
                  key={contest.contestId}
                  contestId={contest.contestId}
                  title={contest.title}
                  bannerUrl={contest.bannerUrl}
                  startDate={contest.startDate}
                  endDate={contest.endDate}
                  status={index < activeContests.length ? "active" : "upcoming"} 
                />
              ))
            ) : (
              <div className="text-center py-20 border-2 border-dashed border-[var(--site-ink)]/10 rounded-2xl">
                <p className="text-[var(--site-ink)]/40 italic font-medium">Hiện tại chưa có cuộc thi nào diễn ra...</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </section>
  );
};

export default ContestSection;
