"use client";

import { getCampaigns } from "@/apis/campaign";
import { useGetContestsPaginated } from "@/apis/contests";
import { getPosts } from "@/apis/post";
import GlassSurface from "@/components/GlassSurface";
import { useAuth } from "@/hooks/useAuth";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { useMeQuery } from "@/hooks/useMeQuery";
import { useAuthStore } from "@/store";
import { Post } from "@/types/post";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDown,
  LogOut,
  Mail,
  Settings,
  User,
  MapPin,
  Phone,
  Facebook,
  Instagram,
  Youtube,
  Send,
} from "lucide-react";
// Avatar will be rendered as an initial-letter circle; no Next/Image needed here
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { CampaignAPIResponse } from "../../types/campaign";

const ArrowRightIcon = () => <span>&rarr;</span>;

// Animated Container Component
const AnimatedContainer = ({
  children,
  className = "",
  animation = "animate-fade-in-up",
  delay = 0,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
  animation?: string;
  delay?: number;
} & React.HTMLAttributes<HTMLDivElement>) => {
  const { ref, isIntersecting } = useIntersectionObserver<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={`${className} ${isIntersecting ? animation : "opacity-0"}`}
      style={{ animationDelay: `${delay}ms` }}
      {...props}
    >
      {children}
    </div>
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
  <div className="flex flex-col h-full">
    <img
      src={imgSrc}
      alt={title}
      className="w-full aspect-4/3 object-cover mb-4 sm:mb-6"
      onError={(e) => {
        (e.target as HTMLImageElement).src =
          "https://placehold.co/400x300/cccccc/333333?text=Image+Failed";
      }}
    />
    <h3 className="text-lg font-semibold mb-2 text-center">{title}</h3>
    <div className="text-black text-sm leading-relaxed mb-6 text-center line-clamp-3">
      <ReactMarkdown>{description}</ReactMarkdown>
    </div>
    <button className="w-full mt-auto cursor-pointer bg-[#FF6E1A] rounded-sm text-white px-4 py-2.5 font-medium text-sm hover:bg-[#FF833B] transition-colors flex items-center justify-center gap-2">
      Đăng kí tài trợ <ArrowRightIcon />
    </button>
  </div>
);

// Skeleton component for CampaignCard
const SkeletonCampaignCard = () => (
  <div className="flex flex-col h-full animate-pulse">
    <div className="w-full aspect-4/3 bg-gray-300 mb-4 sm:mb-6 rounded"></div>
    <div className="h-6 bg-gray-300 mb-2 rounded text-center"></div>
    <div className="space-y-2 mb-6">
      <div className="h-4 bg-gray-300 rounded"></div>
      <div className="h-4 bg-gray-300 rounded w-3/4"></div>
      <div className="h-4 bg-gray-300 rounded w-1/2"></div>
    </div>
    <div className="w-full h-10 mt-auto bg-gray-300 rounded-sm"></div>
  </div>
);

// Skeleton component for Contest Info
const SkeletonContestInfo = () => (
  <div className="max-w-lg animate-pulse">
    <div className="h-4 bg-gray-300 mb-2 rounded w-1/2"></div>
    <div className="h-12 bg-gray-300 mb-4 sm:mb-6 rounded"></div>
    <div className="space-y-3 mb-4 sm:mb-6">
      <div className="h-4 bg-gray-300 rounded"></div>
      <div className="h-4 bg-gray-300 rounded w-5/6"></div>
      <div className="h-4 bg-gray-300 rounded w-4/6"></div>
    </div>
    <div className="space-y-2 sm:space-y-3">
      <div className="h-4 bg-gray-300 rounded w-3/4"></div>
      <div className="h-4 bg-gray-300 rounded w-2/3"></div>
    </div>
    <div className="mt-6 sm:mt-10 h-12 bg-gray-300 rounded-sm"></div>
  </div>
);

// Skeleton component for NewsCardSmall
const SkeletonNewsCardSmall = () => (
  <div className="flex flex-col overflow-hidden animate-pulse">
    <div className="w-full h-32 sm:h-40 bg-gray-300"></div>
    <div className="p-3 sm:p-4">
      <div className="h-3 bg-gray-300 rounded mb-1 w-1/2"></div>
      <div className="h-4 bg-gray-300 rounded"></div>
    </div>
  </div>
);

// Skeleton component for Spotlight Post
const SkeletonSpotlightPost = () => (
  <div className="flex flex-col bg-[#EAE6E0] text-white animate-pulse">
    <div className="w-full h-48 sm:h-64 lg:h-80 bg-gray-300 mb-4 sm:mb-6"></div>
    <div className="h-4 bg-gray-300 rounded mb-2 w-1/3"></div>
    <div className="h-8 bg-gray-300 rounded mb-3 sm:mb-4"></div>
    <div className="space-y-2">
      <div className="h-4 bg-gray-300 rounded"></div>
      <div className="h-4 bg-gray-300 rounded w-5/6"></div>
      <div className="h-4 bg-gray-300 rounded w-4/6"></div>
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
    className={`flex flex-col overflow-hidden hover:scale-105 transition-transform duration-300 ${
      darkBg ? "bg-[#EAE6E0] text-black" : "bg-white text-black"
    }`}
  >
    <img
      src={imgSrc}
      alt={title}
      className="w-full h-32 sm:h-40 object-cover"
      onError={(e) => {
        (e.target as HTMLImageElement).src =
          "https://placehold.co/300x160/cccccc/333333?text=Image";
      }}
    />
    <div className="pt-2">
      <p className="text-3xl sm:text-sm font-semibold text-black uppercase mb-1">
        {category}
      </p>
      <div className="text-sm sm:text-base font-semibold">
        <ReactMarkdown>{title}</ReactMarkdown>
      </div>
      {content && (
        <div className="text-base text-gray-600 mt-2 line-clamp-2">
          <ReactMarkdown>{truncateAtWord(content, 100)}</ReactMarkdown>
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
        console.log("Fetched posts:", resp.data);
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
    <div className="min-h-screen bg-[#EAE6E0] text-black font-(family-name:--font-be-vietnam-pro) overflow-x-hidden">


      <main>
        {/* --- Hero Section --- */}
        <section
          id="hero"
          className="relative h-[80vh] min-h-[400px] lg:h-screen lg:min-h-[700px] flex items-center text-white pt-16"
        >
          <div className="absolute inset-0">
            <img
              src="https://res.cloudinary.com/dbke1s5nm/image/upload/v1762177079/herosection_jznhnz.png"
              alt="Nền bức tranh phong cảnh"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.backgroundColor =
                  "#6c7a89";
              }}
            />
          </div>

          <div className="relative z-5 mt-8 max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 w-full">
            <div className="max-w-xl mt-0 sm:mt-[-10vh] lg:mt-[-17vh]">
              <AnimatedContainer
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-[#423137] font-semibold tracking-tighter leading-tight sm:leading-tight"
                animation="animate-fade-in-down"
              >
                CUỘC THI <br />
                NÉT VẼ ƯỚC MƠ <br />
                2026
              </AnimatedContainer>
              <AnimatedContainer
                className="mt-4 sm:mt-6 text-sm sm:text-base lg:text-lg text-black leading-relaxed"
                animation="animate-fade-in-up"
                delay={200}
              >
                Gửi gắm những câu chuyện, ý tưởng và khát{" "}
                <br className="hidden sm:inline" />
                vọng qua màu sắc độc đáo của riêng mình. Nơi{" "}
                <br className="hidden sm:inline" />
                tài năng hội họa của bạn được tỏa sáng.
              </AnimatedContainer>
              <AnimatedContainer
                className="mt-6 sm:mt-10"
                animation="animate-zoom-in"
                delay={400}
              >
                <button
                  onClick={() => router.push("/gallery")}
                  className="bg-[#FF6E1A] cursor-pointer text-white px-6 sm:px-8 py-3 sm:py-4 font-medium text-sm sm:text-base hover:bg-[#FF833B] rounded-sm transition-colors flex items-center gap-2"
                >
                  Xem Triển Lãm <ArrowRightIcon />
                </button>
              </AnimatedContainer>
            </div>
          </div>
        </section>

        {/* --- Contest Info Section --- */}
        <AnimatedContainer
          id="contest"
          className="min-h-auto lg:min-h-screen bg-[#EAE6E0] flex items-center justify-center py-16 lg:py-32 overflow-x-hidden"
          animation="animate-fade-in-left"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 md:gap-16 items-center">
            {isLoadingContest ? (
              // Combined skeleton wrapper so text + image animate in sync
              <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center animate-pulse">
                <div>
                  {/* reuse existing skeleton for left column */}
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
                  <div className="h-64 rounded-xl sm:h-80 md:h-full  overflow-hidden md:-mr-[calc((100vw-72rem)/2+2rem)]">
                    <img
                      src={activeContest.bannerUrl}
                      alt="Minh họa thành phố"
                      className="h-full w-full object-cover md:w-[50vw] max-w-none "
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

        {/* --- News Section with 3 Columns --- */}
        <AnimatedContainer
          id="news"
          className="min-h-auto lg:min-h-screen bg-[#EAE6E0] flex items-center justify-center py-16 lg:py-32"
          animation="animate-zoom-in"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 w-full">
            <AnimatedContainer
              className="text-sm text-black sm:text-base font-semibold mb-4 sm:mb-6"
              animation="animate-fade-in-down"
            >
              Tin tức nổi bật
            </AnimatedContainer>

            {/* Desktop News Grid */}
            <div className="hidden lg:grid lg:grid-cols-[1fr_2px_1.2fr_2px_1fr] gap-6 lg:gap-8">
              {loadingPosts ? (
                <>
                  <div className="flex flex-col justify-between gap-6 sm:gap-8">
                    <SkeletonNewsCardSmall />
                    <div className="flex flex-col overflow-hidden animate-pulse">
                      <div className="w-full h-32 sm:h-40 bg-gray-300"></div>
                      <div className="p-3 sm:p-4">
                        <div className="h-3 bg-gray-300 rounded mb-1 w-2/3"></div>
                        <div className="h-4 bg-gray-300 rounded w-5/6"></div>
                      </div>
                    </div>
                  </div>
                  <div className="hidden lg:block w-0.5 bg-neutral-700 h-full"></div>
                  <SkeletonSpotlightPost />
                  <div className="hidden lg:block w-0.5 bg-neutral-700 h-full"></div>
                  <div className="flex flex-col justify-between gap-6 sm:gap-8">
                    <div className="flex flex-col overflow-hidden animate-pulse">
                      <div className="w-full h-32 sm:h-40 bg-gray-300"></div>
                      <div className="p-3 sm:p-4">
                        <div className="h-3 bg-gray-300 rounded mb-1 w-1/3"></div>
                        <div className="h-4 bg-gray-300 rounded w-4/6"></div>
                      </div>
                    </div>
                    <SkeletonNewsCardSmall />
                  </div>
                </>
              ) : (
                <>
                  <div className="flex flex-col justify-between gap-6 sm:gap-8">
                    {[smallPosts[0], smallPosts[1]].map((post, i) => (
                      post ? (
                        <Link key={post.post_id} href={`/posts/${post.post_id}`}>
                          <NewsCardSmall
                            imgSrc={post.image_url || "https://placehold.co/300x160/7F00FF/ffffff?text=Art"}
                            category={post.postTags?.[0]?.tag?.tag_name || "Digital Art"}
                            title={post.title || ""}
                            content={post.content}
                            darkBg={true}
                          />
                        </Link>
                      ) : (
                        <div key={i} className="flex flex-col overflow-hidden bg-gray-100 p-3 sm:p-4 min-h-[150px] justify-center text-center text-gray-400 text-xs">
                          Bài viết mới sẽ sớm được cập nhật
                        </div>
                      )
                    ))}
                  </div>

                  <div className="hidden lg:block w-0.5 bg-neutral-700 h-full"></div>

                  <div className="flex flex-col bg-[#EAE6E0] text-white hover:scale-105 transition-transform duration-300">
                    {spotlightPost ? (
                      <Link href={`/posts/${spotlightPost.post_id}`}>
                        <img
                          src={spotlightPost.image_url || "https://placehold.co/600x400/FF5733/ffffff?text=Spotlight"}
                          alt={spotlightPost.title}
                          className="w-full h-48 sm:h-64 lg:h-80 object-cover mb-4 sm:mb-6 cursor-pointer"
                        />
                      </Link>
                    ) : (
                      <div className="w-full h-48 sm:h-64 lg:h-80 bg-gray-200 flex items-center justify-center mb-6 text-gray-400">Không có bài viết nổi bật</div>
                    )}
                    <span className="text-xs sm:text-sm font-semibold text-black uppercase mb-2">Artist Spotlight</span>
                    {spotlightPost && (
                      <Link href={`/posts/${spotlightPost.post_id}`}>
                        <h3 className="text-2xl sm:text-3xl font-bold mb-3 text-black cursor-pointer line-clamp-2">
                           {spotlightPost.title}
                        </h3>
                      </Link>
                    )}
                    <div className="text-sm sm:text-base text-black leading-relaxed line-clamp-3">
                      {spotlightPost?.content || "Thông tin nghệ sĩ sẽ được cập nhật sớm."}
                    </div>
                  </div>

                  <div className="hidden lg:block w-0.5 bg-neutral-700 h-full"></div>

                  <div className="flex flex-col justify-between gap-6 sm:gap-8">
                    {[smallPosts[2], smallPosts[3]].map((post, i) => (
                      post ? (
                        <Link key={post.post_id} href={`/posts/${post.post_id}`}>
                          <NewsCardSmall
                            imgSrc={post.image_url || "https://placehold.co/300x160/7F00FF/ffffff?text=Art"}
                            category={post.postTags?.[0]?.tag?.tag_name || "Digital Art"}
                            title={post.title || ""}
                            content={post.content}
                            darkBg={true}
                          />
                        </Link>
                      ) : (
                        <div key={i} className="flex flex-col overflow-hidden bg-gray-100 p-3 sm:p-4 min-h-[150px] justify-center text-center text-gray-400 text-xs">
                          Bài viết mới sẽ sớm được cập nhật
                        </div>
                      )
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Mobile News Slider - Auto + Swipeable */}
            <div className="lg:hidden mt-4 overflow-hidden relative">
              {loadingPosts ? (
                <SkeletonNewsCardSmall />
              ) : uniquePosts.length > 0 ? (
                <>
                  <motion.div
                    className="flex cursor-grab active:cursor-grabbing"
                    animate={{ x: `-${currentPostIndex * 100}%` }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.2}
                    onDragEnd={(_, info) => {
                      const threshold = 50;
                      if (info.offset.x < -threshold) {
                        setCurrentPostIndex((prev) => (prev + 1) % uniquePosts.length);
                      } else if (info.offset.x > threshold) {
                        setCurrentPostIndex((prev) => (prev - 1 + uniquePosts.length) % uniquePosts.length);
                      }
                    }}
                  >
                    {uniquePosts.map((post) => (
                      <div key={post.post_id} className="min-w-full pr-4">
                        <Link href={`/posts/${post.post_id}`}>
                          <NewsCardSmall
                            imgSrc={post.image_url || "https://placehold.co/300x160/7F00FF/ffffff?text=Art"}
                            category={post.postTags?.[0]?.tag?.tag_name || "Digital Art"}
                            title={post.title || ""}
                            content={post.content}
                            darkBg={true}
                          />
                        </Link>
                      </div>
                    ))}
                  </motion.div>
                  {/* Indicators */}
                  <div className="flex justify-center gap-1.5 mt-6">
                    {uniquePosts.map((_, idx) => (
                      <button 
                        key={idx}
                        onClick={() => setCurrentPostIndex(idx)}
                        className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentPostIndex ? 'w-8 bg-[#FF6E1A]' : 'w-2 bg-black/20'}`}
                      />
                    ))}
                  </div>
                </>
              ) : (
                <div className="w-full text-center py-8 text-black opacity-50">Không có bài viết nào</div>
              )}
            </div>
          </div>
        </AnimatedContainer>


        {/* --- Campaigns Section --- */}
        <AnimatedContainer
          id="campaigns"
          className="min-h-auto lg:min-h-screen bg-[#EAE6E0] flex items-center justify-center py-16 lg:py-32"
          animation="animate-fade-in-right"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16">
            <AnimatedContainer
              className="text-sm sm:text-base font-semibold mb-4 sm:mb-6 text-black"
              animation="animate-fade-in-down"
            >
              Chiến dịch đang diễn ra
            </AnimatedContainer>
            {/* Desktop grid, Mobile auto-slider */}
            <div className="hidden sm:grid sm:grid-cols-2 md:grid-cols-3 gap-8 md:gap-10">
              {loadingCampaigns
                ? [0, 1, 2].map((i) => <SkeletonCampaignCard key={i} />)
                : campaigns.map((c, idx) => (
                    <Link key={c.campaignId ?? idx} href={`/campaigns/${c.campaignId}`} className="h-full">
                      <CampaignCard
                        imgSrc={c.image || "https://placehold.co/400x300/cccccc/333333?text=No+Image"}
                        title={c.title || "Không có tiêu đề"}
                        description={c.description || ""}
                      />
                    </Link>
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
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
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
                        className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentCampaignIndex ? 'w-8 bg-[#FF6E1A]' : 'w-2 bg-black/20'}`}
                      />
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-12 text-gray-400 text-sm">Các chiến dịch sẽ được cập nhật sớm.</div>
              )}
            </div>
          </div>
        </AnimatedContainer>
      </main>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed cursor-pointer bottom-4 right-4 bg-[#FF6E1A] text-white p-3 rounded-full shadow-lg hover:bg-[#FF833B] transition-colors z-50"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 10l7-7m0 0l7 7m-7-7v18"
            />
          </svg>
        </button>
      )}

      {/* --- Footer --- */}
      <footer className="relative bg-gradient-to-br from-black via-gray-900 to-black text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent"></div>
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
                <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-6">
                  Nơi nuôi dưỡng tài năng hội họa trẻ, kết nối cộng đồng nghệ sĩ
                  và lan tỏa giá trị nghệ thuật đến mọi nhà.
                </p>
                <div className="flex space-x-4">
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors duration-300"
                  >
                    <Facebook className="w-5 h-5" />
                  </a>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors duration-300"
                  >
                    <Instagram className="w-5 h-5" />
                  </a>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors duration-300"
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
                    <a href="#" className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center group">
                      <span className="w-1.5 h-1.5 bg-[#FF6E1A] rounded-full mr-3 opacity-100 transition-opacity"></span>
                      Nhiệm vụ
                    </a>
                  </li> */}
                  <li>
                    <a
                      href="#"
                      className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center group"
                    >
                      <span className="w-1.5 h-1.5 bg-[#FF6E1A] rounded-full mr-3 opacity-100 transition-opacity"></span>
                      Đội ngũ
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center group"
                    >
                      <span className="w-1.5 h-1.5 bg-[#FF6E1A] rounded-full mr-3 opacity-100 transition-opacity"></span>
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
                      className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center group"
                    >
                      <span className="w-1.5 h-1.5 bg-[#FF6E1A] rounded-full mr-3 opacity-100 transition-opacity"></span>
                      NÉT VẼ ƯỚC MƠ 2026
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center group"
                    >
                      <span className="w-1.5 h-1.5 bg-[#FF6E1A] rounded-full mr-3 opacity-100 transition-opacity"></span>
                      Thể lệ
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center group"
                    >
                      <span className="w-1.5 h-1.5 bg-[#FF6E1A] rounded-full mr-3 opacity-100 transition-opacity"></span>
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
                    <MapPin className="w-4 h-4 text-[#FF6E1A] mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300">
                      123 Đường ABC, Quận 1<br />
                      TP.HCM, Việt Nam
                    </span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Phone className="w-4 h-4 text-[#FF6E1A] flex-shrink-0" />
                    <span className="text-gray-300">+84 123 456 789</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Mail className="w-4 h-4 text-[#FF6E1A] flex-shrink-0" />
                    <span className="text-gray-300">artchain999@gmail.com</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Newsletter Signup */}
            <div className="border-t border-gray-800 pt-8 sm:pt-12">
              <div className="max-w-md mx-auto text-center">
                <h4 className="text-lg sm:text-xl font-bold text-white mb-3">
                  Đăng ký nhận tin
                </h4>
                <p className="text-gray-300 text-sm sm:text-base mb-6">
                  Nhận thông tin mới nhất về cuộc thi và các sự kiện nghệ thuật
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    placeholder="Nhập email của bạn"
                    className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#FF6E1A] focus:ring-1 focus:ring-[#FF6E1A] transition-colors"
                  />
                  <button className="px-6 py-3 bg-[#FF6E1A] hover:bg-[#FF833B] text-white font-medium rounded-lg transition-colors duration-300 flex items-center justify-center gap-2 whitespace-nowrap">
                    <Send className="w-4 h-4" />
                    Đăng ký
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 bg-black/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <p className="text-gray-400 text-xs sm:text-sm text-center md:text-left">
                &copy; 2026 ArtChain. Đã đăng ký bản quyền.
              </p>
              <div className="flex flex-wrap justify-center md:justify-end space-x-6 text-xs sm:text-sm">
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors duration-300"
                >
                  Điều khoản dịch vụ
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors duration-300"
                >
                  Chính sách bảo mật
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors duration-300"
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
