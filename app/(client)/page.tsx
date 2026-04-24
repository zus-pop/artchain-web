"use client";

import { getCampaigns } from "@/apis/campaign";
import { useGetContestsPaginated } from "@/apis/contests";
import { getPosts } from "@/apis/post";
import { useAuth } from "@/hooks/useAuth";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { useAuthStore } from "@/store";
import { Post } from "@/types/post";
import { AnimatePresence, motion } from "framer-motion";
import {
  Mail,
  MapPin,
  Phone,
  Facebook,
  Instagram,
  Youtube,
  Send,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import HeroSection from "@/components/sections/HeroSection";
import { ContestSection } from "@/components/sections/ContestSection";
import { PostSection } from "@/components/sections/PostSection";
import ParallaxBackground from "@/components/sections/ParallaxBackground";
import { CampaignAPIResponse } from "../../types/campaign";

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

import { Variants } from "framer-motion";

// Animation variants — ceremonial, confident, never bouncy
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay: delay * 0.12,
      ease: [0.22, 1, 0.36, 1], // ease-out-quint
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

// Viewport-triggered animated section wrapper (replaces CSS AnimatedContainer)
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

const CampaignCard = ({
  imgSrc,
  title,
  description,
}: {
  imgSrc: string;
  title: string;
  description: string;
}) => (
  <motion.div
    className="group flex flex-col h-full bg-[var(--site-surface)] border border-[var(--site-border)] shadow-sm rounded-md overflow-hidden"
    whileHover={{ y: -4, boxShadow: "0 12px 32px rgba(66,49,55,0.10)" }}
    transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
  >
    {/* Image — fixed 4:3 aspect ratio, subtle zoom on hover */}
    <div className="w-full aspect-4/3 overflow-hidden border-b border-[var(--site-border)]">
      <img
        src={imgSrc}
        alt={title}
        loading="lazy"
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        onError={(e) => {
          (e.target as HTMLImageElement).src =
            "https://placehold.co/400x300/cccccc/333333?text=Image+Failed";
        }}
      />
    </div>
    {/* Card body */}
    <div className="flex flex-col flex-1 p-4">
      <h3 className="text-sm font-bold text-[var(--site-ink)] leading-snug mb-2 line-clamp-2">{title}</h3>
      <div className="text-xs text-[var(--site-ink-muted)] font-medium leading-relaxed mb-4 line-clamp-3 flex-1">
        {cleanMarkdown(description)}
      </div>
      {/* CTA button */}
      <motion.button
        className="w-full mt-auto cursor-pointer bg-[var(--site-accent)] transition-colors duration-200 rounded-sm text-white text-xs font-bold tracking-wide px-4 py-2.5 flex items-center justify-center gap-1.5 shadow-sm"
        whileHover={{ backgroundColor: "var(--site-accent-hover)" }}
        whileTap={{ scale: 0.97 }}
        transition={{ duration: 0.15 }}
      >
        Đăng kí tài trợ <ArrowRightIcon />
      </motion.button>
    </div>
  </motion.div>
);

// Skeleton component for CampaignCard
const SkeletonCampaignCard = () => (
  <div className="flex flex-col h-full animate-pulse">
    <div className="w-full aspect-4/3 bg-[var(--site-skeleton)] mb-4"></div>
    <div className="h-4 bg-[var(--site-skeleton)] rounded mb-2 w-3/4"></div>
    <div className="space-y-2 mb-4">
      <div className="h-3 bg-[var(--site-skeleton)] rounded"></div>
      <div className="h-3 bg-[var(--site-skeleton)] rounded w-5/6"></div>
      <div className="h-3 bg-[var(--site-skeleton)] rounded w-2/3"></div>
    </div>
    <div className="w-full h-9 mt-auto bg-[var(--site-skeleton)] rounded-sm"></div>
  </div>
);

// Skeleton component for Contest Info
const SkeletonContestInfo = () => (
  <div className="max-w-lg animate-pulse">
    <div className="h-4 bg-[var(--site-skeleton)] mb-2 rounded w-1/2"></div>
    <div className="h-12 bg-[var(--site-skeleton)] mb-4 sm:mb-6 rounded"></div>
    <div className="space-y-3 mb-4 sm:mb-6">
      <div className="h-4 bg-[var(--site-skeleton)] rounded"></div>
      <div className="h-4 bg-[var(--site-skeleton)] rounded w-5/6"></div>
      <div className="h-4 bg-[var(--site-skeleton)] rounded w-4/6"></div>
    </div>
    <div className="space-y-2 sm:space-y-3">
      <div className="h-4 bg-[var(--site-skeleton)] rounded w-3/4"></div>
      <div className="h-4 bg-[var(--site-skeleton)] rounded w-2/3"></div>
    </div>
    <div className="mt-6 sm:mt-10 h-12 bg-[var(--site-skeleton)] rounded-sm"></div>
  </div>
);

// Skeleton component for NewsCardSmall
const SkeletonNewsCardSmall = () => (
  <div className="flex flex-col overflow-hidden animate-pulse">
    <div className="w-full h-32 sm:h-40 bg-[var(--site-skeleton)]"></div>
    <div className="p-3 sm:p-4">
      <div className="h-3 bg-[var(--site-skeleton)] rounded mb-1 w-1/2"></div>
      <div className="h-4 bg-[var(--site-skeleton)] rounded"></div>
    </div>
  </div>
);

// Skeleton component for Spotlight Post
const SkeletonSpotlightPost = () => (
  <div className="flex flex-col bg-[var(--site-bg)] animate-pulse">
    <div className="w-full h-48 sm:h-64 lg:h-80 bg-[var(--site-skeleton)] mb-4 sm:mb-6"></div>
    <div className="h-4 bg-[var(--site-skeleton)] rounded mb-2 w-1/3"></div>
    <div className="h-8 bg-[var(--site-skeleton)] rounded mb-3 sm:mb-4"></div>
    <div className="space-y-2">
      <div className="h-4 bg-[var(--site-skeleton)] rounded"></div>
      <div className="h-4 bg-[var(--site-skeleton)] rounded w-5/6"></div>
      <div className="h-4 bg-[var(--site-skeleton)] rounded w-4/6"></div>
    </div>
  </div>
);

// Truncate text at a word boundary so we don't cut mid-word
const truncateAtWord = (text: string | undefined, maxChars: number) => {
  if (!text) return text;
  if (text.length <= maxChars) return text;

  const lastSpace = text.lastIndexOf(" ", maxChars);
  if (lastSpace > 0) return text.slice(0, lastSpace) + "...";

  const nextSpace = text.indexOf(" ", maxChars);
  if (nextSpace > 0) return text.slice(0, nextSpace) + "...";

  return text;
};

// Helper to strip markdown and HTML entities for clean plain-text excerpts
const cleanMarkdown = (text: string | undefined) => {
  if (!text) return "";
  return text
    // Remove images
    .replace(/!\[.*?\]\(.*?\)/g, "")
    // Remove links
    .replace(/\[(.*?)\]\(.*?\)/g, "$1")
    // Remove headings
    .replace(/#{1,6}\s/g, "")
    // Remove bold/italics
    .replace(/(\*\*|\*|__|_)(.*?)\1/g, "$2")
    // Remove lists and blockquotes
    .replace(/^\s*[->*+]\s/gm, "")
    // Remove HTML entities like &#x20;
    .replace(/&#x[0-9a-fA-F]+;/g, " ")
    .replace(/&nbsp;/g, " ")
    // Replace multiple spaces/newlines with a single space
    .replace(/\s+/g, " ")
    .trim();
};

// Component Card cho Tin tức nhỏ
const NewsCardSmall = ({
  imgSrc,
  category,
  title,
  content,
  darkBg = false,
}: {
  imgSrc: string;
  category: string;
  title: string;
  content?: string;
  darkBg?: boolean;
}) => (
  <div
    className={`group flex flex-col h-full overflow-hidden transition-all duration-300 hover:shadow-md hover:scale-[1.01] border border-[var(--site-border)] shadow-sm rounded-md ${
      darkBg ? "bg-[var(--site-surface-warm)] text-[var(--site-ink)]" : "bg-[var(--site-surface)] text-[var(--site-ink)]"
    }`}
  >
    {/* Image — fixed aspect ratio for consistency */}
    <div className="w-full aspect-video overflow-hidden border-b border-[var(--site-border)]">
      <img
        src={imgSrc}
        alt={title}
        loading="lazy"
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        onError={(e) => {
          (e.target as HTMLImageElement).src =
            "https://placehold.co/300x160/cccccc/333333?text=Image";
        }}
      />
    </div>
    {/* Text block */}
    <div className="flex flex-col flex-1 p-4">
      {/* Category / Tag — small label */}
      <p className="text-[10px] font-bold tracking-widest text-[var(--site-accent)] uppercase mb-1.5">
        {category}
      </p>
      {/* Title — balanced weight */}
      <div className="text-sm font-bold text-[var(--site-ink)] leading-snug line-clamp-2">
        {cleanMarkdown(title)}
      </div>
      {/* Description — muted, compact */}
      {content && (
        <div className="text-xs text-[var(--site-ink-muted)] font-medium mt-1.5 line-clamp-2 leading-relaxed">
          {truncateAtWord(cleanMarkdown(content), 120)}
        </div>
      )}
    </div>
  </div>
);

// --- Component Chính Của Trang ---
export default function Page() {
  const router = useRouter();

  // Slider states for mobile
  const [currentPostIndex, setCurrentPostIndex] = useState(0);
  const [currentCampaignIndex, setCurrentCampaignIndex] = useState(0);

  // Scroll to top state and function
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Auth hooks
  const { isAuthenticated, user } = useAuth();
  useEffect(() => {
    if (!isAuthenticated) return;
    // Redirect based on user role
    if (user?.role === "ADMIN" || user?.role === "STAFF") {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, user, router]);

  // Fetch active contest for contest info section
  const { data: activeContests, isLoading: isLoadingContest } =
    useGetContestsPaginated("ACTIVE", 1, 1);
  const activeContest = activeContests?.[0];

  // News posts fetched to fill the NewsCardSmall components (do not change UI)
  const [posts, setPosts] = useState<Post[]>([]);
  const [loadingPosts, setLoadingPosts] = useState<boolean>(true);
  const [campaigns, setCampaigns] = useState<CampaignAPIResponse[]>([]);
  const [loadingCampaigns, setLoadingCampaigns] = useState<boolean>(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoadingPosts(true);
        const resp = await getPosts({ limit: 5 });
        if (mounted) setPosts(resp.data || []);
      } catch (err) {
        console.error("Error fetching posts:", err);
      } finally {
        if (mounted) setLoadingPosts(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  // fetch campaigns (limit = 3)
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoadingCampaigns(true);
        // Only fetch campaigns with ACTIVE status
        const resp = await getCampaigns({ limit: 3, status: "ACTIVE" });
        // resp shape may vary; try common properties
        const items = resp?.data ?? [];
        if (mounted)
          setCampaigns(Array.isArray(items) ? items.slice(0, 3) : []);
      } catch (err) {
        console.error("Error fetching campaigns:", err);
        if (mounted) setCampaigns([]);
      } finally {
        if (mounted) setLoadingCampaigns(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  // Deduplicate posts by post_id and pick spotlight + small unique posts
  const uniquePostsMap = new Map<number | string, Post>();
  for (const p of posts) {
    if (p && p.post_id != null && !uniquePostsMap.has(p.post_id)) {
      uniquePostsMap.set(p.post_id, p);
    }
  }
  const uniquePosts = Array.from(uniquePostsMap.values());

  const spotlightPost = uniquePosts.length > 0 ? uniquePosts[0] : null;
  const remainingUnique = spotlightPost ? uniquePosts.slice(1) : uniquePosts;
  const smallPosts = Array.from(
    { length: 4 },
    (_, i) => remainingUnique[i] ?? null
  );

  // Auto-slide logic
  useEffect(() => {
    if (uniquePosts.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentPostIndex((prev) => (prev + 1) % uniquePosts.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [uniquePosts.length]);

  useEffect(() => {
    if (campaigns.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentCampaignIndex((prev) => (prev + 1) % campaigns.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [campaigns.length]);

  return (
    <div className="min-h-screen bg-[var(--site-bg)] text-[var(--site-ink)] font-(family-name:--font-be-vietnam-pro)">


      <main>
        {/* --- Hero Section --- */}
        <section
          id="hero"
          className="relative h-[80vh] min-h-[480px] lg:h-screen lg:min-h-[700px] flex items-start pt-24 lg:pt-[22vh]"
        >
          {/* 3D Parallax Background Experience */}
          <ParallaxBackground />

          {/* Vignette — soft edge darkening for exhibition-room depth */}
          <div
            className="absolute inset-0 pointer-events-none z-10"
            style={{
              background:
                "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.5) 100%)",
            }}
          />

          {/* Hero content — rendered via HeroSection component */}
          <div className="relative z-20 w-full">
            <HeroSection />
          </div>

          {/* Scroll-cue fade at bottom */}
          <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-[var(--site-bg)] to-transparent pointer-events-none" />
        </section>

        {/* --- Contest Showcase Section --- */}
        <ContestSection />

        {/* --- Community News & Announcements Section --- */}
        <PostSection />


        {/* --- Campaigns Section --- white background for rhythm --- */}
        <AnimatedContainer
          id="campaigns"
          className="bg-[var(--site-surface)] py-20 lg:py-28"
          animation="animate-fade-in-right"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16">
            {/* Section header — matches News section style */}
            <AnimatedContainer
              className="flex items-baseline justify-between mb-10 lg:mb-12"
              animation="animate-fade-in-down"
            >
              <div>
                <p className="text-[10px] font-semibold tracking-[0.18em] text-[var(--site-accent)] uppercase mb-2">Tài trợ & hợp tác</p>
                <h2 className="text-2xl sm:text-3xl font-bold text-[var(--site-ink)]">Chiến dịch đang diễn ra</h2>
              </div>
              <Link href="/campaigns" className="hidden sm:inline-flex text-xs font-semibold text-[var(--site-ink-muted)] hover:text-[var(--site-accent)] transition-colors items-center gap-1.5">
                Xem tất cả <ArrowRightIcon />
              </Link>
            </AnimatedContainer>
            {/* Desktop grid, Mobile auto-slider */}
            <div className="hidden sm:grid sm:grid-cols-2 md:grid-cols-3 gap-8 md:gap-10">
              {loadingCampaigns
                ? [0, 1, 2].map((i) => <SkeletonCampaignCard key={i} />)
                : campaigns.map((c, idx) => (
                    <motion.div
                      key={c.campaignId ?? idx}
                      variants={scaleIn}
                      initial="hidden"
                      whileInView="visible"
                      custom={idx}
                      viewport={{ once: true, margin: "-40px" }}
                    >
                      <Link href={`/campaigns/${c.campaignId}`} className="h-full block">
                        <CampaignCard
                          imgSrc={c.image || "https://placehold.co/400x300/cccccc/333333?text=No+Image"}
                          title={c.title || "Không có tiêu đề"}
                          description={c.description || ""}
                        />
                      </Link>
                    </motion.div>
                  ))}
            </div>

            <div className="sm:hidden relative overflow-hidden">
              {loadingCampaigns ? (
                <SkeletonCampaignCard />
              ) : campaigns.length > 0 ? (
                <>
                  <motion.div
                    className="flex cursor-grab active:cursor-grabbing"
                    animate={{ x: `-${currentCampaignIndex * 100}%` }}
                    transition={{ type: "tween", ease: [0.25, 0.1, 0.25, 1], duration: 0.4 }}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.2}
                    onDragEnd={(_, info) => {
                      const threshold = 50;
                      if (info.offset.x < -threshold) {
                        setCurrentCampaignIndex((prev) => (prev + 1) % campaigns.length);
                      } else if (info.offset.x > threshold) {
                        setCurrentCampaignIndex((prev) => (prev - 1 + campaigns.length) % campaigns.length);
                      }
                    }}
                  >
                    {campaigns.map((c, idx) => (
                      <div key={c.campaignId ?? idx} className="min-w-full pr-4">
                        <Link href={`/campaigns/${c.campaignId}`} className="h-full block">
                          <CampaignCard
                            imgSrc={c.image || "https://placehold.co/400x300/cccccc/333333?text=No+Image"}
                            title={c.title || "Không có tiêu đề"}
                            description={c.description || ""}
                          />
                        </Link>
                      </div>
                    ))}
                  </motion.div>
                  {/* Indicators */}
                  <div className="flex justify-center gap-1.5 mt-8">
                    {campaigns.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentCampaignIndex(idx)}
                        aria-label={`Chuyển đến chiến dịch ${idx + 1}`}
                        aria-current={idx === currentCampaignIndex ? "true" : undefined}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          idx === currentCampaignIndex
                            ? "w-8 bg-[var(--site-accent)]"
                            : "w-2 bg-[var(--site-ink)]/20"
                        }`}
                      />
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-12 text-[var(--site-ink-muted)] text-sm">Các chiến dịch sẽ được cập nhật sớm.</div>
              )}
            </div>
          </div>
        </AnimatedContainer>
      </main>

      {/* Scroll to Top Button — animated pop-in/out */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            key="scroll-top"
            aria-label="Cuộn lên đầu trang"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="fixed cursor-pointer bottom-4 right-4 bg-[var(--site-accent)] text-white p-3 rounded-full shadow-lg z-50"
            initial={{ opacity: 0, scale: 0.6, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.6, y: 12 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ scale: 1.1, backgroundColor: "var(--site-accent-hover)" }}
            whileTap={{ scale: 0.92 }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </motion.button>
        )}
      </AnimatePresence>

      {/* --- Footer --- */}
      <footer className="relative bg-[var(--site-ink)] text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--site-bg)]/20 via-transparent to-[var(--site-bg)]/20"></div>
        </div>

        <div className="relative py-12 sm:py-16 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16">
            {/* Main Footer Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-12 mb-8 sm:mb-12">
              {/* About Section */}
              <div className="lg:col-span-2">
                <div className="flex items-center space-x-3 mb-4">
                  <img
                    src="/images/newlogo.png"
                    alt="Artchain Logo"
                    className="w-8 h-8 sm:w-10 sm:h-10 object-contain"
                  />
                  <h3 className="text-xl sm:text-2xl font-bold text-white">
                    ArtChain
                  </h3>
                </div>
                <p className="text-white/80 text-sm sm:text-base leading-relaxed mb-6">
                  Nơi nuôi dưỡng tài năng hội họa trẻ, kết nối cộng đồng nghệ sĩ
                  và lan tỏa giá trị nghệ thuật đến mọi nhà.
                </p>
                <div className="flex space-x-4">
                  <a
                    href="#"
                    className="text-white/60 hover:text-white transition-colors duration-300"
                  >
                    <Facebook className="w-5 h-5" />
                  </a>
                  <a
                    href="#"
                    className="text-white/60 hover:text-white transition-colors duration-300"
                  >
                    <Instagram className="w-5 h-5" />
                  </a>
                  <a
                    href="#"
                    className="text-white/60 hover:text-white transition-colors duration-300"
                  >
                    <Youtube className="w-5 h-5" />
                  </a>
                </div>
              </div>

              {/* About Links */}
              <div>
                <h5 className="font-bold text-white mb-4 sm:mb-6 text-sm sm:text-base uppercase tracking-wider">
                  Về chúng tôi
                </h5>
                <ul className="space-y-3 text-sm sm:text-base">
                  {/* <li>
                    <a href="#" className="text-white/80 hover:text-white transition-colors duration-300 flex items-center group">
                      <span className="w-1.5 h-1.5 bg-[var(--site-accent)] rounded-full mr-3 opacity-100 transition-opacity"></span>
                      Nhiệm vụ
                    </a>
                  </li> */}
                  <li>
                    <a
                      href="#"
                      className="text-white/80 hover:text-white transition-colors duration-300 flex items-center group"
                    >
                      <span className="w-1.5 h-1.5 bg-[var(--site-accent)] rounded-full mr-3 opacity-100 transition-opacity"></span>
                      Đội ngũ
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-white/80 hover:text-white transition-colors duration-300 flex items-center group"
                    >
                      <span className="w-1.5 h-1.5 bg-[var(--site-accent)] rounded-full mr-3 opacity-100 transition-opacity"></span>
                      Liên hệ
                    </a>
                  </li>
                </ul>
              </div>

              {/* Contest Links */}
              <div>
                <h5 className="font-bold text-white mb-4 sm:mb-6 text-sm sm:text-base uppercase tracking-wider">
                  Cuộc thi
                </h5>
                <ul className="space-y-3 text-sm sm:text-base">
                  <li>
                    <a
                      href="#"
                      className="text-white/80 hover:text-white transition-colors duration-300 flex items-center group"
                    >
                      <span className="w-1.5 h-1.5 bg-[var(--site-accent)] rounded-full mr-3 opacity-100 transition-opacity"></span>
                      NÉT VẼ ƯỚC MƠ 2026
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-white/80 hover:text-white transition-colors duration-300 flex items-center group"
                    >
                      <span className="w-1.5 h-1.5 bg-[var(--site-accent)] rounded-full mr-3 opacity-100 transition-opacity"></span>
                      Thể lệ
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-white/80 hover:text-white transition-colors duration-300 flex items-center group"
                    >
                      <span className="w-1.5 h-1.5 bg-[var(--site-accent)] rounded-full mr-3 opacity-100 transition-opacity"></span>
                      Nộp bài
                    </a>
                  </li>
                </ul>
              </div>

              {/* Contact Info */}
              <div>
                <h5 className="font-bold text-white mb-4 sm:mb-6 text-sm sm:text-base uppercase tracking-wider">
                  Liên hệ
                </h5>
                <ul className="space-y-3 text-sm sm:text-base">
                  <li className="flex items-start space-x-3">
                    <MapPin className="w-4 h-4 text-[var(--site-accent)] mt-0.5 flex-shrink-0" />
                    <span className="text-white/80">
                      123 Đường ABC, Quận 1<br />
                      TP.HCM, Việt Nam
                    </span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Phone className="w-4 h-4 text-[var(--site-accent)] flex-shrink-0" />
                    <span className="text-white/80">+84 123 456 789</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Mail className="w-4 h-4 text-[var(--site-accent)] flex-shrink-0" />
                    <span className="text-white/80">artchain999@gmail.com</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Newsletter Signup */}
            {/* <div className="border-t border-white/10 pt-8 sm:pt-12">
              <div className="max-w-md mx-auto text-center">
                <h4 className="text-lg sm:text-xl font-bold text-white mb-3">
                  Đăng ký nhận tin
                </h4>
                <p className="text-white/80 text-sm sm:text-base mb-6">
                  Nhận thông tin mới nhất về cuộc thi và các sự kiện nghệ thuật
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    placeholder="Nhập email của bạn"
                    className="flex-1 px-4 py-3 bg-[var(--site-bg)]/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-[var(--site-accent)] focus:ring-1 focus:ring-[var(--site-accent)] transition-colors"
                  />
                  <button className="px-6 py-3 bg-[var(--site-accent)] hover:bg-[var(--site-accent-hover)] text-white font-medium rounded-lg transition-colors duration-300 flex items-center justify-center gap-2 whitespace-nowrap">
                    <Send className="w-4 h-4" />
                    Đăng ký
                  </button>
                </div>
              </div>
            </div> */}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 bg-black/10 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <p className="text-white/60 text-xs sm:text-sm text-center md:text-left">
                &copy; 2026 ArtChain. Đã đăng ký bản quyền.
              </p>
              <div className="flex flex-wrap justify-center md:justify-end space-x-6 text-xs sm:text-sm">
                <a
                  href="#"
                  className="text-white/60 hover:text-white transition-colors duration-300"
                >
                  Điều khoản dịch vụ
                </a>
                <a
                  href="#"
                  className="text-white/60 hover:text-white transition-colors duration-300"
                >
                  Chính sách bảo mật
                </a>
                <a
                  href="#"
                  className="text-white/60 hover:text-white transition-colors duration-300"
                >
                  Cookie Policy
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
