import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Eye, Tag, ArrowRight, Loader2 } from 'lucide-react';
import { getPosts } from '@/apis/post';
import { Post } from '@/types/post';

const NewsCard = ({ news }: { news: Post }) => {
  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg transition-all duration-300 hover:shadow-2xl overflow-hidden flex flex-col h-full p-4 border border-gray-100 dark:border-gray-700">

      {/* Hình ảnh */}
      <div className="w-full mb-4 relative">
        <div className="relative h-48 w-full">
          <Image
            src={news.image_url || "https://placehold.co/600x400/6b7280/ffffff?text=No+Image"}
            alt={news.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>
      </div>

      {/* Nội dung - flex-grow để chiếm không gian còn lại */}
      <div className="flex flex-col flex-grow">
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
      </div>

      {/* Footer/Metadata - luôn ở dưới cùng */}
      <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:justify-between sm:items-center border-t pt-3 border-gray-100 dark:border-gray-700 mt-auto">
        <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
          <span className="flex items-center">
            <Calendar className="w-4 h-4 mr-1 text-red-500" />
            {new Date(news.published_at).toLocaleDateString('vi-VN')}
          </span>
          <span className="flex items-center">
            <Eye className="w-4 h-4 mr-1 text-red-500" />
            {news.creator.fullName}
          </span>
        </div>

        {/* Read More Button */}
        <Link href={`/posts/${news.post_id}`}>
          <button className="flex items-center text-red-600 dark:text-red-400 font-medium hover:text-red-800 dark:hover:text-red-300 transition-colors text-sm">
            Đọc Chi Tiết
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>
        </Link>
      </div>
    </div>
  );
};

const News = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await getPosts({ limit: 3 });
        setPosts(response.data);
      } catch (err) {
        console.error('Error fetching posts:', err);
        setError('Failed to load posts');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <section className="py-16 px-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
              Tin Tức & Sự Kiện
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Cập nhật những thông tin mới nhất về cuộc thi, sự kiện và câu chuyện từ cộng đồng nghệ sĩ ArtChain
            </p>
          </div>
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-red-600" />
            <span className="ml-2 text-gray-600">Loading posts...</span>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 px-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
              Tin Tức & Sự Kiện
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Cập nhật những thông tin mới nhất về cuộc thi, sự kiện và câu chuyện từ cộng đồng nghệ sĩ ArtChain
            </p>
          </div>
          <div className="text-center py-12">
            <p className="text-red-500">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 dark:text-white mb-4">
            Tin Tức <span className="text-red-500 dark:text-gray-300">&</span> Sự Kiện
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Cập nhật những thông tin mới nhất về cuộc thi, sự kiện và câu chuyện từ cộng đồng nghệ sĩ ArtChain
          </p>
        </div>

        {posts.length > 0 && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map(post => (
                <NewsCard key={post.post_id} news={post} />
              ))}
            </div>

            <div className="text-center mt-16">
              <Link href="/posts">
                <button className="overflow-hidden relative w-32 p-2 h-12 bg-gray-800 text-white border-none rounded-mdnew text-xl font-bold cursor-pointer z-10 group">
                  Explore!
                  <span className="absolute w-36 h-32 -top-8 -left-2 bg-red-200 rotate-12 transform scale-x-0 group-hover:scale-x-100 transition-transform group-hover:duration-500 duration-1000 origin-right" />
                  <span className="absolute w-36 h-32 -top-8 -left-2 bg-red-400 rotate-12 transform scale-x-0 group-hover:scale-x-100 transition-transform group-hover:duration-700 duration-700 origin-right" />
                  <span className="absolute w-36 h-32 -top-8 -left-2 bg-red-600 rotate-12 transform scale-x-0 group-hover:scale-x-100 transition-transform group-hover:duration-1000 duration-500 origin-right" />
                  <span className="absolute inset-0 z-10 flex items-center justify-center text-2xl text-[--secondary-foreground] opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    →
                  </span>
                </button>
              </Link>
            </div>
          </div>
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
    </section>
  );
};

export default News;