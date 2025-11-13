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
    <div className="border border-[#b8aaaa] overflow-hidden hover:shadow-lg transition-all hover:scale-105 duration-300 flex flex-col h-full">

      {/* Hình ảnh */}
      <div className="w-full mb-4 relative">
        <div className="relative h-48 w-full bg-gray-100">
          <Image
            src={news.image_url || "https://placehold.co/600x400/6b7280/ffffff?text=No+Image"}
            alt={news.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>
      </div>

      {/* Nội dung */}
      <div className="flex flex-col flex-grow p-4">
        {/* Tags */}
        {news.postTags && news.postTags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {news.postTags.map((postTag) => (
              <span key={postTag.tag_id} className="text-xs font-semibold text-gray-500 dark:text-gray-400 flex items-center">
                <Tag className="w-3 h-3 mr-1" />
                {postTag.tag.tag_name}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <h2 className="font-extrabold text-gray-900 dark:text-white leading-tight text-xl mb-2">
          {news.title}
        </h2>

        {/* Content Preview */}
        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
          {news.content.replace(/[#*`]/g, '').substring(0, 150)}...
        </p>

        {/* Footer/Metadata - luôn ở dưới cùng */}
        <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:justify-between sm:items-center border-t pt-3 border-[#b8aaaa] mt-auto">
          <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
            <span className="flex items-center">
              <Calendar className="w-4 h-4 mr-1 text-[#FF6E1A]" />
              {new Date(news.published_at).toLocaleDateString('vi-VN')}
            </span>
            <span className="flex items-center">
              <Eye className="w-4 h-4 mr-1 text-[#FF6E1A]" />
              {news.creator.fullName}
            </span>
          </div>

          {/* Read More Button */}
          <Link href={`/posts/${news.post_id}`}>
            <button className="flex cursor-pointer items-center text-[#FF6E1A] dark:text-[#FF6E1A] font-medium hover:text-[#FF6E1A] dark:hover:text-[#FF6E1A] transition-colors text-sm">
              Đọc Chi Tiết
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>
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
        className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronLeft className="w-4 h-4 mr-1" />
        Trước
      </button>

      {/* Page Numbers */}
      <div className="flex items-center space-x-1">
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
              className={`px-3 py-2 text-sm font-medium border transition-colors ${
                currentPage === pageNum
                  ? 'bg-[#FF6E1A] text-white border-[#FF6E1A]'
                  : 'text-gray-500 bg-white border-gray-300 hover:bg-gray-50'
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
        className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        Sau
        <ChevronRight className="w-4 h-4 ml-1" />
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
    <div className="min-h-screen pt-25 px-4 bg-[#EAE6E0] dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        {/* <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
            Tin Tức <span className="text-[#FF6E1A] dark:text-gray-300">&</span> Sự Kiện
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Cập nhật những thông tin mới nhất về cuộc thi, sự kiện và câu chuyện từ cộng đồng nghệ sĩ ArtChain
          </p>
        </div> */}

        {posts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              Chưa có tin tức nào được công bố
            </p>
          </div>
        )}
      </div>
    </div>
  );
}