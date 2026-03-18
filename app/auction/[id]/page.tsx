"use client";
import React, { useState } from 'react';
import { 
  Timer, 
  Heart, 
  Hammer, 
  Eye, 
  Share2, 
  ShieldCheck, 
  History, 
  ChevronRight,
  TrendingUp,
  Award,
  ArrowLeft,
  Info,
  LineChart
} from 'lucide-react';
import Link from 'next/link';

export default function AuctionDetailPage() {
  const [activeTab, setActiveTab] = useState('bids');
  const [bidAmount, setBidAmount] = useState('');

  // Mock data for the auction item
  const item = {
    id: 1,
    title: "Sương sớm trên sông Hương",
    artist: "Nguyễn Văn Minh",
    description: "Tác phẩm khắc họa vẻ đẹp huyền ảo của dòng sông Hương vào một buổi sáng sớm đầy sương mù. Với những nét vẽ tinh tế và bảng màu nhẹ nhàng, họa sĩ đã thành công trong việc tạo nên một không gian tĩnh lặng, đậm chất thơ mộng của xứ Huế.",
    currentBid: "42.500.000đ",
    startingBid: "30.000.000đ",
    bidIncrement: "1.000.000đ",
    timeLeft: "04h 22m 15s",
    bidsCount: 28,
    watchers: 144,
    viewsCount: 1250,
    image: "https://images.unsplash.com/photo-1501472312651-726afe119ff1?q=80&w=1200",
    status: 'live',
    category: 'Phong cảnh',
    medium: 'Sơn dầu trên toan',
    size: '120 x 80 cm',
    year: '2023',
    certificate: 'Có kèm giấy chứng nhận bản gốc',
    history: [
      { id: 1, user: "Hoàng Nam", amount: "42.500.000đ", time: "2 phút trước" },
      { id: 2, user: "Minh Thu", amount: "41.500.000đ", time: "15 phút trước" },
      { id: 3, user: "Trần Đức", amount: "40.000.000đ", time: "45 phút trước" },
      { id: 4, user: "Lê Lan", amount: "39.000.000đ", time: "1 giờ trước" },
    ]
  };

  return (
    <div className="min-h-screen bg-[#eae6e0] text-[#1a1a1a] font-sans selection:bg-[#f07d44] selection:text-white animate-in fade-in duration-700">
      
      {/* Navigation Breadcrumb */}
      <div className="pt-24 px-[5%] max-w-[1600px] mx-auto">
        <nav className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest opacity-50 mb-8">
          <Link href="/auction/list" className="hover:text-[#f07d44] transition flex items-center gap-1">
             Quay lại danh sách
          </Link>
          <ChevronRight size={10} />
          <span className="text-[#1a1a1a] opacity-100">{item.title}</span>
        </nav>
      </div>

      <main className="px-[5%] max-w-[1600px] mx-auto pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column: Image & Gallery */}
          <div className="lg:col-span-7 space-y-8">
            <div className="relative bg-white p-4 shadow-sm group">
              <div className="aspect-[4/3] overflow-hidden bg-gray-100 relative">
                <img 
                  src={item.image} 
                  alt={item.title}
                  className="w-full h-full object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="absolute top-6 left-6">
                  <div className="bg-green-500 text-white text-[10px] font-black px-4 py-1.5 rounded-full flex items-center gap-2 shadow-lg">
                    <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                    ĐANG ĐẤU GIÁ LIVE
                  </div>
                </div>
              </div>
            </div>

            {/* Artwork Details Mobile/Tablet Visible */}
            <div className="bg-white p-10 shadow-sm border-l-4 border-[#f07d44]">
              <h2 className="text-xs font-black uppercase tracking-[0.3em] text-[#f07d44] mb-6 flex items-center gap-2">
                <Info size={16} /> Thông tin tác phẩm
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-widest opacity-40 mb-1">Họa sĩ</p>
                  <p className="font-bold text-sm uppercase">{item.artist}</p>
                </div>
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-widest opacity-40 mb-1">Chất liệu</p>
                  <p className="font-bold text-sm uppercase">{item.medium}</p>
                </div>
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-widest opacity-40 mb-1">Kích thước</p>
                  <p className="font-bold text-sm uppercase">{item.size}</p>
                </div>
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-widest opacity-40 mb-1">Năm sáng tác</p>
                  <p className="font-bold text-sm uppercase">{item.year}</p>
                </div>
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-widest opacity-40 mb-1">Thể loại</p>
                  <p className="font-bold text-sm uppercase">{item.category}</p>
                </div>
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-widest opacity-40 mb-1">Chứng nhận</p>
                  <p className="font-bold text-sm uppercase text-green-600">Bản gốc</p>
                </div>
              </div>
              <div className="mt-8 pt-8 border-t border-gray-100">
                <p className="text-sm leading-relaxed opacity-70">
                  {item.description}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Bidding Actions */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-10 shadow-xl relative overflow-hidden">
              {/* Background Accent */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#f07d44]/5 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>
              
              <div className="relative z-10">
                <div className="mb-8">
                  <h1 className="text-4xl font-black uppercase tracking-tighter leading-none mb-2">
                    {item.title}
                  </h1>
                  <p className="text-xs font-bold text-[#f07d44] uppercase tracking-[0.3em]">
                    By {item.artist}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-6 mb-8 py-6 border-y border-gray-100">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-40 mb-2 flex items-center gap-2">
                      <Timer size={14} /> Thời gian còn lại
                    </p>
                    <p className="text-2xl font-black tracking-tight">{item.timeLeft}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-40 mb-2 flex items-center gap-2">
                      <TrendingUp size={14} /> Lượt đấu giá
                    </p>
                    <p className="text-2xl font-black tracking-tight">{item.bidsCount} lượt</p>
                  </div>
                </div>

                <div className="mb-8">
                  <p className="text-[10px] font-bold uppercase tracking-widest opacity-40 mb-2">
                    Giá thầu hiện tại
                  </p>
                  <div className="flex items-baseline gap-3">
                    <span className="text-5xl font-black text-[#f07d44] tracking-tighter">
                      {item.currentBid}
                    </span>
                  </div>
                  <div className="flex justify-between mt-4 text-[10px] font-bold uppercase tracking-widest opacity-40">
                    <span>Giá khởi điểm: {item.startingBid}</span>
                    <span>Bước giá: {item.bidIncrement}</span>
                  </div>
                </div>

                {/* Bid Input Area */}
                <div className="space-y-4 mb-8">
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="Nhập giá thầu của bạn..."
                      value={bidAmount}
                      onChange={(e) => setBidAmount(e.target.value)}
                      className="w-full bg-gray-50 border-2 border-gray-100 px-6 py-4 rounded-md font-bold focus:border-[#f07d44] outline-none transition"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black opacity-30">VND</div>
                  </div>
                  <button className="w-full bg-[#1a1a1a] text-white py-5 rounded-md font-black text-sm uppercase tracking-[0.3em] hover:bg-[#f07d44] transition-all flex items-center justify-center gap-3 shadow-xl hover:shadow-[#f07d44]/20 group">
                    Đặt giá thầu ngay
                    <Hammer size={18} className="group-hover:rotate-12 transition" />
                  </button>
                </div>

                <div className="flex grid grid-cols-2 gap-4">
                  <button className="flex items-center justify-center gap-2 py-3 border-2 border-gray-100 font-bold text-[10px] uppercase tracking-widest hover:bg-gray-50 transition">
                    <Heart size={14} /> Theo dõi ({item.watchers})
                  </button>
                  <button className="flex items-center justify-center gap-2 py-3 border-2 border-gray-100 font-bold text-[10px] uppercase tracking-widest hover:bg-gray-50 transition">
                    <Share2 size={14} /> Chia sẻ
                  </button>
                </div>
              </div>
            </div>

            {/* Trust Badges & Tabs */}
            <div className="bg-white shadow-sm">
              <div className="flex border-b border-gray-100">
                <button 
                  onClick={() => setActiveTab('bids')}
                  className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest transition ${activeTab === 'bids' ? 'border-b-2 border-[#f07d44] text-[#f07d44]' : 'opacity-40'}`}
                >
                  Lịch sử đấu giá
                </button>
                <button 
                  onClick={() => setActiveTab('chart')}
                  className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest transition ${activeTab === 'chart' ? 'border-b-2 border-[#f07d44] text-[#f07d44]' : 'opacity-40'}`}
                >
                  Xu hướng giá
                </button>
              </div>
              
              <div className="p-8">
                {activeTab === 'bids' ? (
                  <div className="space-y-6">
                    {item.history.map((bid, index) => (
                      <div key={bid.id} className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-[10px] ${index === 0 ? 'bg-orange-100 text-[#f07d44]' : 'bg-gray-100'}`}>
                            {bid.user.charAt(0)}
                          </div>
                          <div>
                            <p className="text-xs font-bold uppercase">{bid.user}</p>
                            <p className="text-[9px] opacity-40">{bid.time}</p>
                          </div>
                        </div>
                        <p className={`text-sm font-black ${index === 0 ? 'text-[#f07d44]' : ''}`}>{bid.amount}</p>
                      </div>
                    ))}
                    <button className="w-full py-3 text-[9px] font-black uppercase tracking-widest opacity-40 hover:opacity-100 transition">
                      Xem tất cả lịch sử
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-[10px] font-black uppercase tracking-widest opacity-60 flex items-center gap-2">
                        <LineChart size={14} /> Biểu đồ tăng trưởng giá
                      </h4>
                      <span className="text-[9px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded">+41.6%</span>
                    </div>
                    
                    {/* Simplified Visual Price Chart */}
                    <div className="h-40 flex items-end gap-2 px-2 border-b border-l border-gray-100 pb-2">
                      {[30, 35, 32, 38, 40, 42.5].map((val, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-2 group/bar">
                          <div className="w-full bg-gray-100 group-hover/bar:bg-orange-100 transition-colors relative" style={{ height: `${(val/45)*100}%` }}>
                            {i === 5 && <div className="absolute -top-1 left-0 right-0 h-1 bg-[#f07d44]"></div>}
                            <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[8px] font-bold opacity-0 group-hover/bar:opacity-100 transition whitespace-nowrap bg-black text-white px-1 py-0.5 rounded">
                              {val}M
                            </div>
                          </div>
                          <span className="text-[8px] font-bold opacity-30">T{i+1}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-3 rounded">
                        <p className="text-[8px] font-bold uppercase opacity-40 mb-1">Giá thấp nhất</p>
                        <p className="text-xs font-black">30.000.000đ</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded">
                        <p className="text-[8px] font-bold uppercase opacity-40 mb-1">Giá cao nhất</p>
                        <p className="text-xs font-black text-[#f07d44]">42.500.000đ</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>
      </main>

      {/* Suggested Items Section */}
      <section className="bg-white/50 py-24 px-[5%] border-t border-gray-100 overflow-hidden">
        <div className="max-w-[1600px] mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#f07d44] mb-4 block">Gợi ý dành cho bạn</span>
              <h2 className="text-4xl font-black uppercase tracking-tighter">Các tác phẩm <span className="text-[#f07d44]">Liên quan</span></h2>
            </div>
            <Link href="/auction/list" className="text-[10px] font-bold uppercase tracking-widest border-b-2 border-black pb-1 hover:text-[#f07d44] hover:border-[#f07d44] transition">
              Xem tất cả
            </Link>
          </div>

          <div className="relative group/marquee">
            <div className="flex gap-8 animate-marquee group-hover/marquee:[animation-play-state:paused]">
              {/* Double the items for seamless loop */}
              {[1, 2, 3, 4, 1, 2, 3, 4].map((i, index) => (
                <div key={`${i}-${index}`} className="min-w-[300px] md:min-w-[350px] group">
                  <div className="aspect-[4/3] bg-gray-100 mb-4 overflow-hidden relative">
                    <img src={`https://images.unsplash.com/photo-${1500000000000 + (i*100)}?q=80&w=600`} alt="related" className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
                    <div className="absolute bottom-4 left-4">
                       <span className="bg-white/90 backdrop-blur px-3 py-1 text-[9px] font-black uppercase">Live</span>
                    </div>
                  </div>
                  <h3 className="text-sm font-black uppercase mb-1 group-hover:text-[#f07d44] transition">Tên tác phẩm nghệ thuật #{i}</h3>
                  <p className="text-[10px] opacity-40 font-bold uppercase tracking-widest mb-2">Họa sĩ tương ứng</p>
                  <p className="text-sm font-black text-[#f07d44]">25.000.000đ</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <style jsx global>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-50% - 1rem)); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
      `}</style>

      {/* Basic Footer */}

      <footer className="py-20 px-[5%] text-center border-t border-black/5 opacity-30">
        <p className="text-[10px] font-bold uppercase tracking-[0.5em]">
          © 2026 NÉT VẼ XANH — CHI TIẾT ĐẤU GIÁ
        </p>
      </footer>
    </div>
  );
}
