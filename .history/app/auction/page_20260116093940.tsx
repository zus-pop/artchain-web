import React from 'react';
import { ArrowUpRight, Timer, Hammer, Search, ArrowRight } from 'lucide-react';

export default function ModernArtAuction() {
  return (
    <div className="min-h-screen bg-[#fafaf9] text-[#1a1a1a] font-sans">
      
      {/* 1. Nav Bar - Glassmorphism */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl z-50">
        <div className="bg-white/60 backdrop-blur-xl border border-white/40 rounded-2xl px-8 py-4 flex items-center justify-between shadow-sm">
          <div className="text-xl font-black tracking-tighter uppercase">Nét Vẽ Xanh</div>
          <div className="hidden lg:flex gap-10 text-[11px] uppercase tracking-widest font-bold opacity-70">
            <a href="#" className="hover:opacity-100 transition">Cuộc thi</a>
            <a href="#" className="hover:opacity-100 transition">Đấu giá</a>
            <a href="#" className="hover:opacity-100 transition">Triển lãm</a>
            <a href="#" className="hover:opacity-100 transition">Về chúng tôi</a>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-black/5 rounded-full transition"><Search size={20} /></button>
            <button className="bg-[#f07d44] text-white px-6 py-2 rounded-xl font-bold text-sm shadow-lg shadow-orange-200 hover:scale-105 transition">
              Tham gia
            </button>
          </div>
        </div>
      </nav>

      {/* 2. Hero Section - Inspired by 'Visit Tokyo' */}
      <section className="relative pt-40 pb-20 px-[5%] max-w-[1600px] mx-auto grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-1 hidden lg:block">
           <p className="text-6xl font-black opacity-10 sticky top-40 text-right">01</p>
        </div>

        <div className="col-span-12 lg:col-span-7 relative z-10">
          <h1 className="text-[12vw] lg:text-[8rem] font-black leading-[0.85] tracking-tighter uppercase mb-8">
            Art <br /> 
            <span className="ml-[10%] text-[#f07d44]">Auction</span> <br />
            2026
          </h1>
          <div className="max-w-xs ml-auto lg:mr-20">
            <p className="text-xs uppercase tracking-[0.2em] font-bold mb-4 opacity-40">Giới thiệu phiên đấu giá</p>
            <p className="text-sm leading-relaxed opacity-70 italic">
              "Nơi những giá trị tinh thần được hữu hình hóa qua từng nét vẽ khung ngang, mở rộng tầm nhìn về nghệ thuật đương đại."
            </p>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4 mt-10 lg:mt-0">
          <div className="relative aspect-[3/4] lg:aspect-auto lg:h-[600px] rounded-[2.5rem] overflow-hidden shadow-2xl">
            <img 
              src="https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=1000" 
              className="w-full h-full object-cover"
              alt="Main Art"
            />
            <div className="absolute top-6 right-6 bg-white/90 backdrop-blur px-4 py-2 rounded-full shadow-lg">
                <span className="text-[10px] font-black uppercase tracking-widest italic text-[#f07d44]">Tác phẩm tiêu biểu</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Re-organized Landscape Collection - Bento Grid Style */}
      <section className="py-24 px-[5%] max-w-[1600px] mx-auto bg-white rounded-[4rem] shadow-sm mb-20">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-xl">
            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#f07d44] mb-4 block">Landscape Collection</span>
            <h2 className="text-5xl lg:text-6xl font-black uppercase tracking-tighter leading-none">
              Tuyển tập <br /> Tranh khung ngang
            </h2>
          </div>
          <button className="flex items-center gap-2 font-bold text-sm uppercase tracking-widest pb-2 border-b-2 border-[#f07d44] hover:gap-4 transition-all">
            Xem tất cả <ArrowRight size={16} />
          </button>
        </div>

        {/* The Grid - Sửa lỗi chồng lấn bằng cách sử dụng grid flow ổn định */}
        <div className="flex flex-col gap-16">
          
          {/* Hàng 1: Featured Landscape */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            <div className="md:col-span-8 group">
              <div className="relative aspect-[21/9] rounded-[2.5rem] overflow-hidden bg-gray-100 shadow-md">
                <img 
                  src="https://images.unsplash.com/photo-1549490349-8643362247b5?q=80&w=1500" 
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-1000"
                  alt="Featured Art"
                />
                <div className="absolute top-6 left-6 flex gap-2">
                  <div className="bg-red-500 text-white text-[10px] font-bold px-3 py-1 rounded-full animate-pulse shadow-lg">LIVE</div>
                  <div className="bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 shadow-sm">
                    <Timer size={12} /> 02:45:12
                  </div>
                </div>
              </div>
              <div className="mt-8">
                <h3 className="text-4xl font-black uppercase italic leading-none mb-3">Vũ điệu của ánh sáng</h3>
                <p className="text-sm opacity-60 leading-relaxed font-medium uppercase tracking-widest text-[#f07d44]">Họa sĩ: Trần Thế Vinh</p>
              </div>
            </div>

            <div className="md:col-span-4 flex flex-col justify-end h-full">
              <div className="bg-[#1a1a1a] text-white p-10 rounded-[2.5rem] flex flex-col justify-between aspect-square md:aspect-auto md:h-full">
                <div>
                  <p className="text-[10px] font-bold opacity-40 uppercase tracking-widest mb-4">Thông tin đấu giá</p>
                  <p className="text-sm opacity-80 leading-relaxed">Tác phẩm nghệ thuật đương đại sử dụng chất liệu tổng hợp, mô phỏng sự chuyển động của cực quang.</p>
                </div>
                <div className="mt-10">
                  <p className="text-[10px] font-bold opacity-40 uppercase tracking-widest mb-1 text-[#f07d44]">Giá khởi điểm</p>
                  <p className="text-3xl font-black">25,400,000đ</p>
                </div>
              </div>
            </div>
          </div>

          {/* Hàng 2: Secondary Items */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[1, 2, 3].map((i) => (
              <div key={i} className="group flex flex-col">
                <div className="aspect-video rounded-[2rem] overflow-hidden mb-6 shadow-md relative">
                  <img 
                    src={`https://images.unsplash.com/photo-1501472312651-726afe119ff1?q=80&w=800&sig=${i}`} 
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                    <div className="bg-white p-4 rounded-full shadow-xl"><ArrowUpRight size={20} /></div>
                  </div>
                </div>
                <div className="px-2">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-lg font-black uppercase tracking-tight">Landscape Art #{i}</h4>
                    <span className="font-bold text-[#f07d44]">8.0M</span>
                  </div>
                  <p className="text-[10px] font-bold opacity-30 uppercase tracking-[0.2em]">Lô #00{i+1} — Họa sĩ: Minh Tú</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
{/* 4. Live Bidding Section (Đấu giá trực tiếp) - Thêm mới dưới Gallery */}
      <section className="py-32 px-[5%] max-w-7xl mx-auto">
        <div className="mb-20">
          <h2 className="text-6xl font-serif font-bold text-slate-900 leading-tight">Live Bidding</h2>
          <p className="text-slate-400 mt-4 max-w-sm">Các tác phẩm đang được đấu giá trực tiếp trên sàn. Hãy sở hữu ngay di sản của bạn.</p>
        </div>

        <div className="flex flex-col gap-20">
          {[
            { id: 1, title: "Morning Fog over the Thames", artist: "J.M.W. Turner, 1844", bid: "$2,400,000", time: "04h 22m", status: "LIVE NOW", img: "https://images.unsplash.com/photo-1501472312651-726afe119ff1?q=80&w=1200" },
            { id: 2, title: "Valley of the Yosemite", artist: "Albert Bierstadt, 1864", bid: "$850,000", time: "06h 15m", status: "", img: "https://images.unsplash.com/photo-1549490349-8643362247b5?q=80&w=1200" }
          ].map((item) => (
            <div key={item.id} className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center border-b border-slate-100 pb-20 last:border-0">
              {/* Ảnh bên trái */}
              <div className="lg:col-span-7 relative group">
                <div className="aspect-video rounded-xl overflow-hidden shadow-xl">
                  <img src={item.img} className="w-full h-full object-cover group-hover:scale-105 transition duration-700" alt={item.title} />
                </div>
                {item.status && (
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded text-[9px] font-black uppercase tracking-widest shadow-sm">
                    {item.status}
                  </div>
                )}
              </div>

              {/* Thông tin bên phải */}
              <div className="lg:col-span-5">
                <h3 className="text-4xl font-serif font-bold text-slate-900 mb-2 leading-snug">{item.title}</h3>
                <p className="text-slate-400 italic text-lg mb-10">{item.artist}</p>

                <div className="grid grid-cols-2 gap-10 mb-12">
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-[0.2em] mb-2">Giá hiện tại</p>
                    <p className="text-3xl font-bold text-slate-900">{item.bid}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-[0.2em] mb-2">Thời gian còn lại</p>
                    <p className="text-3xl font-bold flex items-center gap-2"><Timer size={24} className="opacity-20" /> {item.time}</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button className="flex-1 bg-[#1a1a1a] text-white py-5 rounded-lg font-bold text-xs uppercase tracking-[0.3em] hover:bg-[#f07d44] transition-all flex items-center justify-center gap-3">
                    Đặt giá thầu <Hammer size={16} />
                  </button>
                  <button className="p-5 border border-slate-200 rounded-lg hover:bg-slate-50 transition">
                    <Heart size={20} className="text-slate-400" />
                  </button>
                </div>
                <p className="mt-4 text-[11px] text-slate-400 font-medium flex items-center gap-2">
                   <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span> 14 người đang theo dõi lô tranh này
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Footer Minimalist */}
      <footer className="py-20 px-[5%] text-center border-t border-black/5">
         <p className="text-[10px] font-bold uppercase tracking-[0.5em] opacity-20">© 2026 NÉT VẼ XANH — BỘ SƯU TẬP TÁC PHẨM</p>
      </footer>

    </div>
  );
}