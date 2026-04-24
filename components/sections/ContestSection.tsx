"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useGetContestsPaginated } from "@/apis/contests";
import { Contest } from "@/types/contest";

interface ContestCardProps {
  contest: Contest;
  status: "active" | "upcoming";
}

const ContestCard: React.FC<ContestCardProps> = ({ contest, status }) => (
  <motion.div 
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6 }}
    className="group relative flex flex-col gap-5 mb-16 last:mb-0"
  >
    <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-[var(--site-ink)]/5 shadow-sm">
      <Image
        src={contest.bannerUrl || "https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?auto=format&fit=crop&q=80&w=1200"}
        alt={contest.title}
        fill
        className="object-cover transition-transform duration-1000 group-hover:scale-105"
      />
      <div className="absolute top-5 left-5">
        <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.15em] shadow-lg backdrop-blur-md ${
          status === "active" 
            ? "bg-emerald-500 text-white" 
            : "bg-amber-500 text-white"
        }`}>
          {status === "active" ? "Đang diễn ra" : "Sắp tới"}
        </span>
      </div>
    </div>
    <div className="flex flex-col gap-3 px-2">
      <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--site-ink)] group-hover:text-[var(--site-accent)] transition-colors duration-300">
        {contest.title}
      </h3>
      <p className="text-sm sm:text-base text-[var(--site-ink)]/60 leading-relaxed max-w-xl line-clamp-3">
        {contest.description}
      </p>
      <div className="flex flex-wrap items-center gap-6 mt-3">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--site-ink)]/40">Thời gian:</span>
          <span className="text-xs sm:text-sm font-semibold text-[var(--site-ink)]">
            {new Date(contest.startDate).toLocaleDateString("vi-VN")} – {new Date(contest.endDate).toLocaleDateString("vi-VN")}
          </span>
        </div>
        <Link 
          href={`/contests/${contest.id}`} 
          className="text-xs font-bold uppercase tracking-[0.2em] border-b-2 border-[var(--site-accent)] pb-1 hover:border-[var(--site-ink)] transition-all duration-300"
        >
          Chi tiết
        </Link>
      </div>
    </div>
  </motion.div>
);

export const ContestSection = () => {
  // Fetch 2 Active contests and 1 Upcoming contest
  const { data: activeContests = [], isLoading: isLoadingActive } = useGetContestsPaginated("ACTIVE", 1, 2);
  const { data: upcomingContests = [], isLoading: isLoadingUpcoming } = useGetContestsPaginated("UPCOMING", 1, 1);

  const isLoading = isLoadingActive || isLoadingUpcoming;
  const allContests = [...activeContests, ...upcomingContests];

  return (
    <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 py-24 sm:py-32">
      <div className="flex flex-col lg:flex-row gap-16 lg:gap-32">
        
        {/* Left Side: Pinned Content — Stays fixed until the right side completes */}
        <div className="lg:w-1/3">
          <div className="lg:sticky lg:top-32 h-fit">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <span className="inline-block px-4 py-1.5 rounded-full bg-[var(--site-accent)]/10 text-[10px] font-bold uppercase tracking-[0.25em] mb-8 text-[var(--site-accent)]">
                Cuộc thi nghệ thuật
              </span>
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tighter leading-[1.05] text-[var(--site-ink)] mb-8">
                Khám phá các <br />
                cuộc thi nổi bật
              </h2>
              <p className="text-lg text-[var(--site-ink)]/60 leading-relaxed mb-12 max-w-md">
                Nơi những tài năng hội họa được tỏa sáng và công nhận. Tham gia ngay để có cơ hội nhận những giải thưởng giá trị và kết nối với cộng đồng nghệ thuật chuyên nghiệp.
              </p>
              <Link 
                href="/contests"
                className="group inline-flex items-center gap-4 px-10 py-5 bg-[var(--site-ink)] text-white font-bold rounded-sm hover:bg-[var(--site-accent)] transition-all duration-500 shadow-2xl hover:shadow-orange-200/50"
              >
                Xem tất cả cuộc thi
                <svg 
                  className="w-5 h-5 transition-transform duration-500 group-hover:translate-x-2" 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                >
                  <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
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
                <ContestCard 
                  key={contest.id} 
                  contest={contest} 
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

