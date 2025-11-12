'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Calendar, Tag, ArrowLeft, Loader2, User } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { getPost } from '@/apis/post';
import { Post } from '@/types/post';
import Loader from '@/components/Loaders';
import ReactMarkdown from 'react-markdown';

export default function PostDetailPage() {
  const params = useParams();
  const postId = params.id as string;

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const postData = await getPost(postId);
        setPost(postData);
      } catch (err) {
        console.error('Error fetching post:', err);
        setError('Failed to load post');
      } finally {
        setLoading(false);
      }
    };

    if (postId) {
      fetchPost();
    }
  }, [postId]);

  if (loading) {
    return (
      <div className="min-h-screen pt-25 px-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-4xl mx-auto">
          <Loader />
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen pt-25 px-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <p className="text-red-500 mb-4">{error || 'Post not found'}</p>
            <Link href="/posts">
              <button className="flex cursor-pointer items-center text-[#FF6E1A] dark:text-[#FF6E1A] font-medium hover:text-[#FF6E1A] dark:hover:text-[#FF6E1A] transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Quay lại danh sách bài viết
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-25 px-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <div className="mb-6">
          <Link href="/posts">
            <button className="flex cursor-pointer items-center text-[#FF6E1A] dark:text-[#FF6E1A] font-medium hover:text-[#FF6E1A] dark:hover:text-[#FF6E1A] transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quay lại danh sách bài viết
            </button>
          </Link>
        </div>

        {/* Post Header */}
        <div className="bg-white dark:bg-gray-800 shadow-lg overflow-hidden mb-6">
          {/* Featured Image */}
          {post.image_url && (
            <div className="w-full h-64 md:h-96 relative">
              <Image
                src={post.image_url}
                alt={post.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            </div>
          )}

          {/* Post Content */}
          <div className="p-6 md:p-8">
            {/* Tags */}
            {post.postTags && post.postTags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {post.postTags.map((postTag) => (
                  <span key={postTag.tag_id} className="inline-flex items-center px-3 py-1 text-sm font-medium bg-[#FF6E1A]/20 text-[#FF6E1A] dark:bg-[#FF6E1A] dark:text-[#FF6E1A]">
                    <Tag className="w-3 h-3 mr-1" />
                    {postTag.tag.tag_name}
                  </span>
                ))}
              </div>
            )}

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-4 leading-tight">
              {post.title}
            </h1>

            {/* Meta Information */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                <span className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1 text-[#FF6E1A]" />
                  {new Date(post.published_at).toLocaleDateString('vi-VN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
                <span className="flex items-center">
                  <User className="w-4 h-4 mr-1 text-[#FF6E1A]" />
                  {post.creator.fullName}
                </span>
              </div>
            </div>
            {/* Content */}
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <div className="text-gray-700 dark:text-gray-300 leading-relaxed">
                <ReactMarkdown>
                  {post.content}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        </div>

        {/* Author Information */}
        <div className="bg-white dark:bg-gray-800 shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Thông tin tác giả</h3>
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-[#FF6E1A]/20 dark:bg-[#FF6E1A] flex items-center justify-center">
              <User className="w-6 h-6 text-[#FF6E1A] dark:text-[#FF6E1A]" />
            </div>
            <div>
              <p className="font-medium text-gray-900 dark:text-white">{post.creator.fullName}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{post.creator.email}</p>
              <p className="text-sm text-[#FF6E1A] dark:text-[#FF6E1A] font-medium">{post.creator.role}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}