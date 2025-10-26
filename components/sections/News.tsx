import React from 'react';
import Image from 'next/image';
import { Calendar, Eye, Tag, Star, ArrowRight } from 'lucide-react';
import newsData from '@/store/mock/news.json';

// Helper function to format view count
const formatViews = (views: number): string => {
  if (views >= 1000) {
    return `${(views / 1000).toFixed(1)}k`;
  }
  return views.toString();
};

interface NewsItem {
  id: number;
  category: string;
  title_vi: string;
  title_en: string;
  slug: string;
  summary: string;
  content_preview: string;
  thumbnail_url: string;
  author: string;
  published_date: string;
  views: number;
  is_featured: boolean;
}

const NewsCard = ({ news, isFeatured = false }: { news: NewsItem; isFeatured?: boolean }) => {
  const baseClasses = "bg-white dark:bg-gray-800 rounded-xl shadow-lg transition-all duration-300 hover:shadow-2xl overflow-hidden";
  
  // Thiết lập kiểu dáng đặc biệt cho bài nổi bật (Featured)
  const featuredClasses = isFeatured 
    ? "col-span-1 lg:col-span-2 flex flex-col md:flex-row p-4 md:p-6 border-4 border-indigo-500/50" 
    : "flex flex-col p-4 border border-gray-100 dark:border-gray-700";

  return (
    <div className={`${baseClasses} ${featuredClasses}`}>
      
      {/* Hình ảnh (Chỉ hiển thị cho featured trên mobile và cả 2 trên desktop) */}
      <div className={isFeatured ? "md:w-1/2 w-full md:pr-4 relative" : "w-full mb-4 relative"}>
        <div className={`relative ${isFeatured ? 'h-64 md:h-full' : 'h-48'} w-full`}>
          <Image
            src={news.thumbnail_url}
            alt={news.title_vi}
            fill
            className="object-cover rounded-lg"
            sizes={isFeatured ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"}
            onError={(e) => { 
              const target = e.target as HTMLImageElement;
              target.src = "https://placehold.co/600x400/6b7280/ffffff?text=No+Image";
            }}
          />
        </div>
      </div>

      {/* Nội dung */}
      <div className={isFeatured ? "md:w-1/2 w-full flex flex-col justify-between pt-4 md:pt-0" : "flex flex-col flex-grow"}>
        <div className="flex flex-col">
          {isFeatured && (
            <div className="flex items-center text-indigo-500 font-bold mb-2">
              <Star className="w-5 h-5 mr-2 fill-indigo-500 text-indigo-500" />
              <span className="uppercase text-sm tracking-widest">Tin Nổi Bật</span>
            </div>
          )}
          
          {/* Category Tag */}
          <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1 flex items-center">
            <Tag className="w-3 h-3 mr-1" />
            {news.category}
          </span>
          
          {/* Title */}
          <h2 className={`font-extrabold text-gray-900 dark:text-white leading-tight ${isFeatured ? 'text-2xl md:text-3xl mb-3' : 'text-xl mb-2'}`}>
            {news.title_vi}
          </h2>
          
          {/* Summary */}
          <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
            {news.summary}
          </p>
        </div>

        {/* Footer/Metadata */}
        <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:justify-between sm:items-center border-t pt-3 border-gray-100 dark:border-gray-700">
          <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
            <span className="flex items-center">
              <Calendar className="w-4 h-4 mr-1 text-indigo-500" />
              {news.published_date}
            </span>
            <span className="flex items-center">
              <Eye className="w-4 h-4 mr-1 text-indigo-500" />
              {formatViews(news.views)} lượt xem
            </span>
          </div>
          
          {/* Read More Button */}
          <button className="flex items-center text-indigo-600 dark:text-indigo-400 font-medium hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors text-sm">
            Đọc Chi Tiết
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
};

const News = () => {
  // Lấy tất cả tin tức, không tách featured
  const allNews = newsData;

  return (
    <section className="py-16 px-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
            Tin Tức & Sự Kiện
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Cập nhật những thông tin mới nhất về cuộc thi, sự kiện và câu chuyện từ cộng đồng nghệ sĩ ArtChain
          </p>
        </div>

        {allNews.length > 0 && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allNews.map(news => (
                <NewsCard key={news.id} news={news} isFeatured={false} />
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {newsData.length === 0 && (
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