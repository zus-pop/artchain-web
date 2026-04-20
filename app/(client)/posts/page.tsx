'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Calendar, Eye, Tag, ArrowRight, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { getPosts } from '@/apis/post';
import { Post, PostsResponseDTO } from '@/types/post';
import Loader from '@/components/Loaders';

const NewsCard = ({ news }: { news: Post }) => {
  return (
    <div className="group bg-white border border-[#e6e2da] shadow-sm rounded-md overflow-hidden hover:shadow-md transition-all hover:scale-[1.01] duration-300 flex flex-col h-full">

      {/* Hình ảnh */}
      <Link href={`/posts/${news.post_id}`} className="block w-full aspect-video overflow-hidden border-b border-[#e6e2da] relative">
        <Image
          src={news.image_url || "https://placehold.co/600x400/EAE6E0/423137?text=No+Image"}
          alt={news.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </Link>

      {/* Nội dung */}
      <div className="flex flex-col flex-1 p-4">
        {/* Tags */}
        {news.postTags && news.postTags.length > 0 ? (
          <div className="flex flex-wrap gap-1.5 mb-2">
            {news.postTags.map((postTag) => (
              <span key={postTag.tag_id} className="text-[10px] font-bold tracking-widest text-[#FF6E1A] uppercase drop-shadow-sm">
                {postTag.tag.tag_name}
              </span>
            ))}
          </div>
        ) : (
          <div className="text-[10px] font-bold tracking-widest text-[#FF6E1A] uppercase mb-2 drop-shadow-sm">Tin Tức</div>
        )}

        {/* Title */}
        <Link href={`/posts/${news.post_id}`}>
          <h2 className="text-lg font-bold text-[#423137] leading-snug mb-2.5 line-clamp-2 hover:text-[#FF6E1A] transition-colors duration-200">
            {news.title}
          </h2>
        </Link>
        
        {/* Content Preview */}
        <p className="text-xs text-[#423137]/70 font-medium leading-relaxed line-clamp-3 mb-4 flex-1">
          {news.content.replace(/[#*`]/g, '').substring(0, 150)}...
        </p>

        {/* Footer/Metadata - luôn ở dưới cùng */}
        <div className="mt-auto flex items-center justify-between gap-3 pt-3">
          <div className="flex items-center space-x-3 text-[10px] text-[#423137]/70 font-semibold">
            <span className="flex items-center">
              <Calendar className="w-3 h-3 mr-1 text-[#423137]/40" />
              {new Date(news.published_at).toLocaleDateString('vi-VN')}
            </span>
            <span className="flex items-center">
              <Eye className="w-3 h-3 mr-1 text-[#423137]/40" />
              {news.creator.fullName}
            </span>
          </div>

          <Link href={`/posts/${news.post_id}`}>
            <span className="flex-shrink-0 flex items-center text-xs font-bold text-[#FF6E1A] transition-colors duration-200 group-hover:text-[#FF833B]">
              Chi tiết <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};

const Pagination = ({ 
  currentPage, 
  totalPages, 
  hasNextPage, 
  hasPreviousPage, 
  onPageChange 
}: {
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  onPageChange: (page: number) => void;
}) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center space-x-2 mt-8">
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!hasPreviousPage}
        className="flex items-center px-3.5 py-2 text-xs font-semibold border transition-colors border-[#e6e2da] text-[#423137]/70 bg-white hover:border-[#FF6E1A] hover:text-[#FF6E1A] rounded-sm disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <ChevronLeft className="w-3.5 h-3.5 mr-1" />
        Trước
      </button>

      {/* Page Numbers */}
      <div className="flex items-center space-x-1 border-[#e6e2da]">
        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
          let pageNum;
          if (totalPages <= 5) {
            pageNum = i + 1;
          } else if (currentPage <= 3) {
            pageNum = i + 1;
          } else if (currentPage >= totalPages - 2) {
            pageNum = totalPages - 4 + i;
          } else {
            pageNum = currentPage - 2 + i;
          }

          return (
            <button
              key={pageNum}
              onClick={() => onPageChange(pageNum)}
              className={`w-8 h-8 rounded-sm text-xs font-semibold border transition-colors ${
                currentPage === pageNum
                  ? 'bg-[#FF6E1A] text-white border-[#FF6E1A]'
                  : 'bg-white border-[#e6e2da] text-[#423137]/70 hover:border-[#FF6E1A] hover:text-[#FF6E1A]'
              }`}
            >
              {pageNum}
            </button>
          );
        })}
      </div>

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!hasNextPage}
        className="flex items-center px-3.5 py-2 text-xs font-semibold border transition-colors border-[#e6e2da] text-[#423137]/70 bg-white hover:border-[#FF6E1A] hover:text-[#FF6E1A] rounded-sm disabled:opacity-30 disabled:cursor-not-allowed"
      >
        Sau
        <ChevronRight className="w-3.5 h-3.5 ml-1" />
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
          limit: 6
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

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top when changing page
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20 px-4 bg-[#EAE6E0] dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto">
          <Loader />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-20 px-4 bg-[#EAE6E0] dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <p className="text-[#FF6E1A]">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 px-4 sm:px-8 lg:px-16 bg-[#EAE6E0] pb-16">
      <div className="max-w-7xl mx-auto">
        <p className="text-xs font-semibold tracking-widest text-[#423137]/60 uppercase mb-5">
           Tin Tức & Sự Kiện
        </p>

        {posts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map(post => (
              <NewsCard key={post.post_id} news={post} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {paginationMeta && (
          <Pagination
            currentPage={currentPage}
            totalPages={paginationMeta.totalPages}
            hasNextPage={paginationMeta.hasNextPage}
            hasPreviousPage={paginationMeta.hasPreviousPage}
            onPageChange={handlePageChange}
          />
        )}

        {/* Empty State */}
        {posts.length === 0 && (
          <div className="text-center py-24">
            <p className="text-[#423137]/40 font-semibold text-sm">
              Chưa có tin tức nào được công bố
            </p>
          </div>
        )}
      </div>
    </div>
  );
}