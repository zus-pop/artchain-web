"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { getPosts } from "@/apis/post";
import { Post } from "@/types/post";

import { InteractivePostCard } from "@/components/ui/InteractivePostCard";
import { InteractiveHeroButton } from "@/components/ui/InteractiveHeroButton";

export const PostSection = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await getPosts({ limit: 4 }); // Limit to 4 posts as requested
        if (response.success) {
          setPosts(response.data);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  // Auto-cycle every 5 seconds
  useEffect(() => {
    if (posts.length <= 1) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % posts.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [posts]);

  if (loading || posts.length === 0) return null;

  const activePost = posts[activeIndex];

  return (
    <section className="bg-[var(--site-bg)] py-24 sm:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16">
        
        {/* Section Header - Reformatted to match other sections */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-8">
          <div className="flex flex-col gap-4">
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[var(--site-accent)]">
              Cộng đồng
            </span>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tighter text-[var(--site-ink)]">
              Tin tức & <br className="hidden sm:block lg:hidden" /> Thông báo
            </h2>
            <p className="text-lg text-[var(--site-ink)]/50 max-w-xl leading-relaxed mt-2">
              Cập nhật những hoạt động mới nhất, các buổi triển lãm và câu chuyện nghệ thuật từ cộng đồng ArtChain.
            </p>
          </div>
          
          <InteractiveHeroButton 
            href="/posts" 
            label="Xem tất cả tin tức"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-16 lg:gap-24">
          
          {/* Left Column: Featured Post (Animated) */}
          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={activePost.post_id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6 }}
                className="flex flex-col gap-8"
              >
                {/* Reusable Interactive Card logic inside PostSection */}
                <InteractivePostCard 
                  postId={activePost.post_id}
                  title={activePost.title}
                  imageUrl={activePost.image_url}
                  tagName={activePost.postTags?.[0]?.tag?.tag_name}
                />

                <div className="flex flex-col gap-4 px-2">
                  <Link href={`/posts/${activePost.post_id}`}>
                    <h3 className="text-3xl sm:text-4xl font-bold leading-tight text-[var(--site-ink)] hover:text-[var(--site-accent)] transition-colors">
                      {activePost.title}
                    </h3>
                  </Link>
                  <p className="text-lg text-[var(--site-ink)]/60 leading-relaxed line-clamp-3 max-w-2xl">
                    {activePost.content.replace(/<[^>]*>/g, '')}
                  </p>
                  <span className="text-sm font-medium text-[var(--site-ink)]/40">
                    Đăng ngày {new Date(activePost.created_at).toLocaleDateString("vi-VN", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right Column: List of all posts with active indicator */}
          <div className="flex flex-col justify-between h-full">
            <div className="flex flex-col">
              {posts.map((post, idx) => (
                <div 
                  key={post.post_id}
                  className={`relative py-6 px-6 mb-2 rounded-sm transition-all duration-500 cursor-pointer group
                    ${idx === activeIndex ? "bg-[var(--site-ink)]/[0.03]" : "hover:bg-[var(--site-ink)]/[0.01]"}`}
                  onClick={() => setActiveIndex(idx)}
                >
                  {/* Active Indicator Bar */}
                  {idx === activeIndex && (
                    <motion.div 
                      layoutId="active-bar"
                      className="absolute left-0 top-0 bottom-0 w-1 bg-[var(--site-accent)]"
                    />
                  )}
                  
                  <div className="flex flex-col gap-2">
                    <span className={`text-[9px] font-bold uppercase tracking-[0.15em] transition-colors
                      ${idx === activeIndex ? "text-[var(--site-accent)]" : "text-[var(--site-ink)]/40 group-hover:text-[var(--site-accent)]"}`}>
                      {post.postTags?.[0]?.tag?.tag_name || "Bài viết"}
                    </span>
                    <h4 className={`text-lg font-bold transition-colors line-clamp-2
                      ${idx === activeIndex ? "text-[var(--site-ink)]" : "text-[var(--site-ink)]/60 group-hover:text-[var(--site-ink)]"}`}>
                      {post.title}
                    </h4>
                    <span className="text-xs text-[var(--site-ink)]/30">
                      {new Date(post.created_at).toLocaleDateString("vi-VN", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Auto-cycle indicator bar (global) */}
            <div className="mt-8 w-full h-[1px] bg-[var(--site-ink)]/10 relative overflow-hidden">
              <motion.div 
                key={activeIndex}
                initial={{ left: "-100%" }}
                animate={{ left: "0%" }}
                transition={{ duration: 5, ease: "linear" }}
                className="absolute inset-0 bg-[var(--site-accent)]"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default PostSection;
