"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import { useRouter } from "next/navigation";
import { useGetContestsPaginated } from "@/apis/contests";

// --- Local Helpers (extracted from old page.tsx for self-contained component) ---

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

const SkeletonContestInfo = () => (
  <div className="max-w-lg animate-pulse">
    <div className="h-4 bg-gray-200 mb-2 rounded w-1/2"></div>
    <div className="h-12 bg-gray-200 mb-4 sm:mb-6 rounded"></div>
    <div className="space-y-3 mb-4 sm:mb-6">
      <div className="h-4 bg-gray-200 rounded"></div>
      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
      <div className="h-4 bg-gray-200 rounded w-4/6"></div>
    </div>
    <div className="space-y-2 sm:space-y-3">
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
    </div>
    <div className="mt-6 sm:mt-10 h-12 bg-gray-200 rounded-sm"></div>
  </div>
);

// --- Main Component ---

export const ContestSection = () => {
  const router = useRouter();

  // Fetch active contest for contest info section
  const { data: activeContests, isLoading: isLoadingContest } =
    useGetContestsPaginated("ACTIVE", 1, 1);
  const activeContest = activeContests?.[0];

  return (
    <AnimatedContainer
      id="contest"
      className="min-h-auto lg:min-h-screen bg-[#EAE6E0] flex items-center justify-center py-16 lg:py-32 overflow-x-hidden"
      animation="animate-fade-in-left"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 md:gap-16 items-center">
        {isLoadingContest ? (
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center animate-pulse">
            <div>
              <SkeletonContestInfo />
            </div>
            <div className="h-64 rounded-xl sm:h-80 md:h-full bg-gray-300 md:-mr-[calc((100vw-72rem)/2+2rem)] overflow-hidden" />
          </div>
        ) : (
          <>
            <div className="max-w-lg">
              <h2 className="text-sm sm:text-base font-semibold text-black mb-2">
                Cuộc thi đang diễn ra
              </h2>
              <h3 className="text-3xl leading-17 text-[#423137] sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">
                {activeContest?.title || "Không có cuộc thi nào"}
              </h3>
              <p className="text-sm sm:text-base text-black leading-relaxed mb-4 sm:mb-6 line-clamp-4">
                {activeContest?.description ||
                  "Các cuộc thi sẽ được cập nhật sớm. Hãy theo dõi để không bỏ lỡ những cơ hội tham gia thú vị."}
              </p>
              <div className="space-y-2 sm:space-y-3 text-sm sm:text-base text-black">
                <p>
                  <strong>Thời gian:</strong>{" "}
                  {activeContest
                    ? `${new Date(
                        activeContest.startDate
                      ).toLocaleDateString("vi-VN")} đến ${new Date(
                        activeContest.endDate
                      ).toLocaleDateString("vi-VN")}`
                    : "Chưa có thông tin thời gian"}
                </p>
                <p>
                  <strong>Lưu ý:</strong>
                  <br />
                  {activeContest?.rounds?.[0]?.sendOriginalDeadline
                    ? `Thí sinh cần nộp bản cứng tác phẩm trước ngày ${(() => {
                        const deadline =
                          activeContest.rounds[0].sendOriginalDeadline;
                        const date = new Date(deadline);
                        const day = date
                          .getUTCDate()
                          .toString()
                          .padStart(2, "0");
                        const month = (date.getUTCMonth() + 1)
                          .toString()
                          .padStart(2, "0");
                        const year = date.getUTCFullYear();
                        return `${day}/${month}/${year}`;
                      })()}`
                    : "Thông tin deadline sẽ được cập nhật sớm."}
                </p>
              </div>
              {activeContest && (
                <button
                  onClick={() =>
                    activeContest.contestId &&
                    router.push(`/contests/${activeContest.contestId}`)
                  }
                  className="mt-6 sm:mt-10 bg-[#FF6E1A] cursor-pointer text-white px-6 sm:px-8 py-3 sm:py-4 font-medium text-sm sm:text-base hover:bg-[#FF833B] rounded-sm transition-colors flex items-center gap-2"
                >
                  Tham gia ngay <ArrowRightIcon />
                </button>
              )}
            </div>

            {activeContest ? (
              <div className="h-64 rounded-xl sm:h-80 md:h-full overflow-hidden md:-mr-[calc((100vw-72rem)/2+2rem)]">
                <img
                  src={activeContest.bannerUrl}
                  alt="Minh họa thành phố"
                  className="h-full w-full object-cover md:w-[50vw] max-w-none"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.backgroundColor =
                      "#89c4f4";
                  }}
                />
              </div>
            ) : (
              <div className="h-64 rounded-xl sm:h-80 md:h-full bg-gray-100 md:-mr-[calc((100vw-72rem)/2+2rem)] flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <div className="text-6xl mb-4">🎨</div>
                  <p className="text-lg font-medium">Chưa có hình ảnh</p>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </AnimatedContainer>
  );
};

export default ContestSection;
