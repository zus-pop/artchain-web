"use client";
import React, { useState } from 'react';
import { Timer, Heart, Filter, Search, Eye, Hammer, TrendingUp } from 'lucide-react';

interface AuctionItem {
  id: number;
  title: string;
  artist: string;
  currentBid: string;
  startingBid: string;
  timeLeft: string;
  bids: number;
  watchers: number;
  image: string;
  status: 'live' | 'upcoming' | 'ending-soon';
  category: string;
}

export default function AuctionListPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all', label: 'Tất cả' },
    { id: 'landscape', label: 'Phong cảnh' },
    { id: 'abstract', label: 'Trừu tượng' },
    { id: 'portrait', label: 'Chân dung' },
    { id: 'contemporary', label: 'Đương đại' },
  ];

  const auctionItems: AuctionItem[] = [
    {
      id: 1,
      title: "Sương sớm trên sông Hương",
      artist: "Nguyễn Văn Minh",
      currentBid: "42.500.000đ",
      startingBid: "30.000.000đ",
      timeLeft: "04h 22m",
      bids: 28,
      watchers: 14,
      image: "https://images.unsplash.com/photo-1501472312651-726afe119ff1?q=80&w=800",
      status: 'live',
      category: 'landscape'
    },
    {
      id: 2,
      title: "Thung lũng mây",
      artist: "Lê Thanh Hương",
      currentBid: "28.900.000đ",
      startingBid: "20.000.000đ",
      timeLeft: "06h 15m",
      bids: 15,
      watchers: 9,
      image: "https://images.unsplash.com/photo-1549490349-8643362247b5?q=80&w=800",
      status: 'live',
      category: 'landscape'
    },
    {
      id: 3,
      title: "Vũ điệu của ánh sáng",
      artist: "Trần Thế Vinh",
      currentBid: "38.200.000đ",
      startingBid: "25.000.000đ",
      timeLeft: "02h 45m",
      bids: 42,
      watchers: 23,
      image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=800",
      status: 'ending-soon',
      category: 'abstract'
    },
    {
      id: 4,
      title: "Hoàng hôn trên biển",
      artist: "Phạm Minh Tuấn",
      currentBid: "19.500.000đ",
      startingBid: "15.000.000đ",
      timeLeft: "12h 30m",
      bids: 8,
      watchers: 5,
      image: "https://images.unsplash.com/photo-1501472312651-726afe119ff1?q=80&w=800&sig=2",
      status: 'live',
      category: 'landscape'
    },
    {
      id: 5,
      title: "Ký ức thành phố",
      artist: "Đỗ Hải Yến",
      currentBid: "52.000.000đ",
      startingBid: "40.000.000đ",
      timeLeft: "08h 20m",
      bids: 31,
      watchers: 18,
      image: "https://images.unsplash.com/photo-1549490349-8643362247b5?q=80&w=800&sig=3",
      status: 'live',
      category: 'contemporary'
    },
    {
      id: 6,
      title: "Con đường về quê",
      artist: "Võ Thanh Bình",
      currentBid: "15.800.000đ",
      startingBid: "12.000.000đ",
      timeLeft: "15h 00m",
      bids: 12,
      watchers: 7,
      image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=800&sig=4",
      status: 'upcoming',
      category: 'landscape'
    },
    {
      id: 7,
      title: "Giao thoa không gian",
      artist: "Nguyễn Thu Hà",
      currentBid: "45.300.000đ",
      startingBid: "35.000.000đ",
      timeLeft: "01h 10m",
      bids: 56,
      watchers: 32,
      image: "https://images.unsplash.com/photo-1501472312651-726afe119ff1?q=80&w=800&sig=5",
      status: 'ending-soon',
      category: 'abstract'
    },
    {
      id: 8,
      title: "Mùa thu Hà Nội",
      artist: "Bùi Xuân Phái",
      currentBid: "62.000.000đ",
      startingBid: "50.000.000đ",
      timeLeft: "10h 45m",
      bids: 38,
      watchers: 25,
      image: "https://images.unsplash.com/photo-1549490349-8643362247b5?q=80&w=800&sig=6",
      status: 'live',
      category: 'landscape'
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'live':
        return <div className="bg-green-500 text-white text-[9px] font-bold px-3 py-1 rounded-full flex items-center gap-1">
          <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
          ĐANG ĐẤU GIÁ
        </div>;
      case 'ending-soon':
        return <div className="bg-red-500 text-white text-[9px] font-bold px-3 py-1 rounded-full animate-pulse">
          SẮP KẾT THÚC
        </div>;
      case 'upcoming':
        return <div className="bg-blue-500 text-white text-[9px] font-bold px-3 py-1 rounded-full">
          SẮP DIỄN RA
        </div>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#eae6e0] text-[#1a1a1a] font-sans selection:bg-[#f07d44] selection:text-white">
      
      {/* Header Section */}
      <section className="relative pt-32 pb-16 px-[5%] max-w-[1600px] mx-auto">
        <div className="mb-12">
          <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#f07d44] mb-4 block">
            Sàn đấu giá trực tuyến
          </span>
          <h1 className="text-6xl lg:text-7xl font-black uppercase tracking-tighter leading-none mb-6">
            Cuộc đấu giá <br />
            <span className="text-[#f07d44]">Đang diễn ra</span>
          </h1>
          <p className="text-sm opacity-70 max-w-xl leading-relaxed">
            Khám phá và tham gia đấu giá các tác phẩm nghệ thuật độc đáo từ các họa sĩ tài năng. 
            Mỗi tác phẩm đều được chứng thực nguồn gốc và đi kèm giấy chứng nhận.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white shadow-sm p-8 mb-12">
          <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
            {/* Search */}
            <div className="flex-1 w-full lg:max-w-md">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Tìm kiếm tác phẩm, nghệ sĩ..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-md bg-gray-50 border-2 border-transparent focus:border-[#f07d44] focus:bg-white transition outline-none text-sm"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="flex gap-2 flex-wrap">
              <div className="flex items-center gap-2 mr-2 text-xs font-bold uppercase tracking-widest opacity-40">
                <Filter size={16} />
                Thể loại:
              </div>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-md text-xs font-bold uppercase tracking-widest transition ${
                    selectedCategory === cat.id
                      ? 'bg-[#f07d44] text-white shadow-lg shadow-orange-200'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="mt-6 pt-6 border-t border-gray-100 flex gap-8 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="font-bold uppercase tracking-wider opacity-60">
                {auctionItems.filter(i => i.status === 'live').length} đấu giá đang diễn ra
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span className="font-bold uppercase tracking-wider opacity-60">
                {auctionItems.filter(i => i.status === 'ending-soon').length} sắp kết thúc
              </span>
            </div>
          </div>
        </div>

        {/* Auction Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {auctionItems.map((item) => (
            <div
              key={item.id}
              className="group bg-white overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
              {/* Image */}
              <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                />
                
                {/* Status Badge */}
                <div className="absolute top-4 left-4">
                  {getStatusBadge(item.status)}
                </div>

                {/* Favorite Button */}
                <button className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition hover:scale-110">
                  <Heart size={18} className="text-gray-600" />
                </button>

                {/* Time Left Overlay */}
                <div className="absolute bottom-4 left-4 right-4 bg-black/80 backdrop-blur-sm text-white px-4 py-2 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold">
                    <Timer size={14} />
                    {item.timeLeft}
                  </div>
                  <div className="flex items-center gap-3 text-[10px] opacity-60">
                    <span className="flex items-center gap-1">
                      <Hammer size={12} /> {item.bids}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye size={12} /> {item.watchers}
                    </span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="mb-4">
                  <h3 className="text-xl font-black uppercase tracking-tight leading-tight mb-1 group-hover:text-[#f07d44] transition">
                    {item.title}
                  </h3>
                  <p className="text-[10px] font-bold opacity-40 uppercase tracking-[0.2em]">
                    {item.artist}
                  </p>
                </div>

                <div className="space-y-3 mb-4">
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-widest opacity-40 mb-1">
                      Giá hiện tại
                    </p>
                    <p className="text-2xl font-black text-[#f07d44] flex items-baseline gap-2">
                      {item.currentBid}
                      <span className="text-xs font-normal text-gray-400 flex items-center gap-1">
                        <TrendingUp size={12} />
                        {item.bids} lượt
                      </span>
                    </p>
                  </div>
                  <div className="flex items-center justify-between text-[10px] opacity-40">
                    <span className="font-bold uppercase tracking-wider">Giá khởi điểm:</span>
                    <span className="font-black">{item.startingBid}</span>
                  </div>
                </div>

                <button className="w-full bg-[#1a1a1a] text-white py-3 rounded-md font-bold text-xs uppercase tracking-[0.25em] hover:bg-[#f07d44] transition-all flex items-center justify-center gap-2 shadow-lg group-hover:shadow-xl">
                  Đặt giá thầu
                  <Hammer size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        <div className="mt-16 text-center">
          <button className="bg-white text-[#1a1a1a] px-12 py-4 rounded-md font-bold text-sm uppercase tracking-[0.3em] hover:bg-[#f07d44] hover:text-white transition-all shadow-lg hover:shadow-2xl">
            Xem thêm cuộc đấu giá
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-[5%] text-center border-t border-black/5 opacity-30">
        <p className="text-[10px] font-bold uppercase tracking-[0.5em]">
          © 2026 NÉT VẼ XANH — SÀN ĐẤU GIÁ NGHỆ THUẬT
        </p>
      </footer>
    </div>
  );
}
