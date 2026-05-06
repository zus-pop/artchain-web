"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Calendar, Eye, Tag, ArrowRight, ChevronLeft, ChevronRight, MessageSquare, Phone } from 'lucide-react';
import Link from 'next/link';
import { getPosts } from '@/apis/post';
import { Post, PostsResponseDTO } from '@/types/post';
import Loader from '@/components/Loaders';
import { motion, AnimatePresence } from 'framer-motion';
import GlassSurface from '@/components/GlassSurface';

// ── Interactive Overlay (from InteractivePostCard) ────────────────
const InteractiveOverlay = () => (
  <div className="absolute top-0 right-0 w-32 h-32 pointer-events-none overflow-hidden z-40">
    <div className="absolute -top-16 -right-16 w-32 h-32 origin-center transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] rotate-[-90deg] group-hover:rotate-0">
      <div className="absolute bottom-4 left-4 pointer-events-auto">
        <GlassSurface 
          width={48} 
          height={48} 
          borderRadius={24} 
          brightness={120} 
          opacity={0.9}
          blur={8}
          className="items-center justify-center shadow-2xl border border-white/60"
        >
          <div className="flex items-center justify-center w-full h-full text-[var(--site-ink)]">
            <svg 
              className="w-5 h-5 transition-transform duration-500 group-hover:rotate-12" 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                d="M12 4V20M12 4L18 10M12 4L6 10" 
                stroke="currentColor" 
                strokeWidth="2.5" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                className="rotate-45 origin-center"
              />
            </svg>
          </div>
        </GlassSurface>
      </div>
    </div>
  </div>
);

const NewsCard = ({ news, index }: { news: Post; index: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="h-full"
    >
      <Link href={`/posts/${news.post_id}`} className="group block h-full bg-white rounded-sm overflow-hidden border border-[#e6e2da] shadow-sm transition-all duration-300 hover:shadow-xl hover:scale-[1.01]">
        
        {/* Image Section */}
        <div className="relative aspect-[16/10] overflow-hidden m-4 rounded-sm flex-shrink-0">
          <motion.div
            initial={{ scale: 1.2 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ once: true }}
            className="w-full h-full"
          >
            <Image
              src={news.image_url || "https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?auto=format&fit=crop&q=80&w=1200"}
              alt={news.title}
              fill
              className="object-cover transition-all duration-1000 group-hover:scale-110 group-hover:blur-[2px]"
            />
          </motion.div>
          
          <InteractiveOverlay />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500 pointer-events-none z-30" />
        </div>

        {/* Content Section */}
        <div className="flex flex-col px-6 pb-8 pt-2 flex-1">
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-3">
             <span className="text-[10px] font-bold tracking-widest px-3 py-1 bg-[#FF6E1A]/10 text-[#FF6E1A] rounded-full uppercase">
                {news.postTags?.[0]?.tag?.tag_name || "Tin tức"}
             </span>
          </div>

          <h3 className="text-[20px] font-bold text-[#423137] leading-tight mb-3 group-hover:text-[#FF6E1A] transition-colors line-clamp-2">
            {news.title}
          </h3>
          
          <p className="text-[14px] text-[#423137]/50 font-medium leading-relaxed mb-8 line-clamp-2">
            {news.content.replace(/[#*`]/g, '')}
          </p>

          {/* Footer Metadata */}
          <div className="mt-auto flex items-center justify-between text-[#423137]/40 border-t border-gray-100 pt-6">
            <div className="flex items-center gap-4 text-[11px] font-bold">
               <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(news.published_at).toLocaleDateString('vi-VN')}
               </span>
               <span className="flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5" />
                  {news.creator.fullName}
               </span>
            </div>
            <div className="text-[11px] font-bold text-[#FF6E1A] flex items-center gap-1">
               Chi tiết <ArrowRight className="w-3 h-3" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

const HeroPost = () => (
  <div className="relative w-full py-8 md:py-12 mb-4 overflow-hidden">
    {/* Subtle Background Pattern */}
    <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#423137 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

    <div className="relative max-w-4xl mx-auto px-6 flex flex-col items-center text-center">
       {/* Blinking Badge (Shrunk) */}
       {/* <motion.div
         initial={{ opacity: 0, scale: 0.9 }}
         animate={{ opacity: 1, scale: 1 }}
         transition={{ duration: 0.5 }}
         className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-full border border-[#e6e2da] text-[10px] font-bold tracking-tight text-[#423137]/60 mb-6 shadow-sm"
       >
          <div className="w-1.5 h-1.5 rounded-full bg-[#FF6E1A] animate-pulse shadow-[0_0_6px_rgba(255,110,26,0.8)]" />
          Cập nhật tin tức mới nhất
       </motion.div> */}

       <motion.h1
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ duration: 0.6, delay: 0.1 }}
         className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#423137] leading-[1.1] tracking-tight mb-6"
       >
          Cập nhật những <span className="text-[#FF6E1A]">Tin Tức</span> <br /> & Thông báo từ ArtChain
       </motion.h1>

       <motion.p
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ duration: 0.6, delay: 0.2 }}
         className="text-sm md:text-base text-[#423137]/50 font-medium leading-relaxed max-w-2xl"
       >
          Nơi tổng hợp mọi thông báo quan trọng, sự kiện sắp tới và các hoạt động cộng đồng nổi bật. 
          Luôn đồng hành cùng sự phát triển của hệ sinh thái ArtChain.
       </motion.p>
    </div>
  </div>
);

const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange 
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 mt-16">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center gap-1 text-xs font-semibold px-4 py-2 rounded-sm border border-[#423137]/20 text-[#423137]/60 hover:border-[#FF6E1A] hover:text-[#FF6E1A] transition-colors duration-200 disabled:opacity-30"
      >
        <ChevronLeft className="h-4 w-4" /> Trước
      </button>
      <span className="text-sm font-bold text-[#423137] px-4">{currentPage} / {totalPages}</span>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center gap-1 text-xs font-semibold px-4 py-2 rounded-sm border border-[#423137]/20 text-[#423137]/60 hover:border-[#FF6E1A] hover:text-[#FF6E1A] transition-colors duration-200 disabled:opacity-30"
      >
        Sau <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
};

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationMeta, setPaginationMeta] = useState<{
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  } | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response: PostsResponseDTO = await getPosts({ 
          page: currentPage, 
          limit: 9
        });
        setPosts(response.data);
        setPaginationMeta(response.meta);
      } catch (err) {
        console.error('Error fetching posts:', err);
        setError('Failed to load posts');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [currentPage]);

  if (loading) {
    return (
      <div className="w-full pt-32 px-4 sm:px-8 lg:px-16 min-h-screen bg-[#EAE6E0] flex flex-col items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-24 w-full bg-[#EAE6E0] px-4 sm:px-8 lg:px-16 overflow-x-hidden">
      <div className="max-w-7xl mx-auto">
        
        {/* Hero Section (Small Section) */}
        <HeroPost />

        {/* List Section Header */}
        <div className="mb-8">
            <p className="text-[10px] font-bold tracking-[0.25em] text-[#423137]/40 uppercase mb-4">
              Tất cả bài viết
            </p>
        </div>

        {/* Posts Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            {posts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
                {posts.map((post, index) => (
                  <NewsCard key={post.post_id} news={post} index={index} />
                ))}
              </div>
            ) : (
              <div className="text-center py-32 bg-white/10 rounded-3xl border border-dashed border-[#423137]/10">
                <p className="text-base font-semibold text-[#423137]/30">Chưa có bài viết nào</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Pagination */}
        {paginationMeta && (
          <Pagination
            currentPage={currentPage}
            totalPages={paginationMeta.totalPages}
            onPageChange={(page) => {
               setCurrentPage(page);
               window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}
      </div>
    </div>
  );
}