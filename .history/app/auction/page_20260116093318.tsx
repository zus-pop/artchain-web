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
            Xem tất cả lô tranh <ArrowRight size={16} />
          </button>
        </div>

        {/* The Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* A. Featured Item (Tác phẩm lớn nhất - Chiếm 8/12 cột) */}
          <div className="md:col-span-8 group">
            <div className="relative aspect-[21/9] rounded-[2.5rem] overflow-hidden bg-gray-100 shadow-lg">
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
            <div className="mt-8 flex flex-col md:flex-row justify-between items-start gap-6 px-4">
              <div className="max-w-md">
                <h3 className="text-3xl font-black uppercase italic leading-none mb-3">Vũ điệu của ánh sáng</h3>
                <p className="text-sm opacity-60 leading-relaxed font-medium uppercase tracking-widest text-[#f07d44]">Lô #001 — Họa sĩ: Trần Thế Vinh</p>
              </div>
              <div className="flex items-center gap-8">
                <div className="text-right">
                  <p className="text-[10px] font-bold opacity-30 uppercase tracking-widest mb-1">Giá hiện tại</p>
                  <p className="text-2xl font-black">25,400,000đ</p>
                </div>
                <button className="bg-[#1a1a1a] text-white p-5 rounded-2xl hover:bg-[#f07d44] transition-colors shadow-xl">
                  <Hammer size={24} />
                </button>
              </div>
            </div>
          </div>

          {/* B. Secondary Item (Tác phẩm vừa - Chiếm 4/12 cột) */}
          <div className="md:col-span-4 flex flex-col justify-end">
            <div className="relative aspect-[4/3] rounded-[2.5rem] overflow-hidden shadow-md group mb-6">
               <img 
                src="https://images.unsplash.com/photo-1501472312651-726afe119ff1?q=80&w=800" 
                className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                 <div className="bg-white p-4 rounded-full"><ArrowUpRight size={24} /></div>
              </div>
            </div>
            <div className="px-4">
              <h4 className="text-xl font-black uppercase tracking-tight mb-1">Ký ức vùng cao</h4>
              <p className="text-[10px] font-bold opacity-40 uppercase tracking-[0.2em] mb-4 text-[#f07d44]">Lô #002 — Họa sĩ: Minh Tú</p>
              <p className="text-xl font-bold">12,500,000đ</p>
            </div>
          </div>

          {/* C. Bottom Row (3 tác phẩm nhỏ dàn ngang - Mỗi cái 4/12 cột) */}
          {[1, 2, 3].map((i) => (
             <div key={i} className={`md:col-span-4 mt-8 ${i === 2 ? 'md:translate-y-12' : ''}`}>
                <div className="aspect-video rounded-[2rem] overflow-hidden mb-6 shadow-md group relative bg-gray-50">
                   <img 
                    src={`https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?q=80&w=800&sig=${i}`} 
                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition duration-500"
                   />
                </div>
                <div className="px-6 flex justify-between items-end">
                  <div>
                    <p className="text-[9px] font-bold opacity-30 uppercase tracking-[0.3em] mb-1">Lot #00{i+2}</p>
                    <h5 className="font-bold text-sm uppercase tracking-tighter italic">Horizon Study {i}</h5>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-[#f07d44]">{8 + i}.0M</p>
                  </div>
                </div>
             </div>
          ))}

        </div>
      </section>

      {/* 4. Footer Minimalist */}
      <footer className="py-20 px-[5%] text-center border-t border-black/5">
         <div className="mb-8 flex justify-center gap-8 opacity-40 text-[10px] font-bold uppercase tracking-[0.3em]">
            <a href="#" className="hover:text-[#f07d44]">Instagram</a>
            <a href="#" className="hover:text-[#f07d44]">Facebook</a>
            <a href="#" className="hover:text-[#f07d44]">Twitter</a>
         </div>
         <p className="text-[10px] font-bold uppercase tracking-[0.5em] opacity-20">© 2026 NÉT VẼ XANH — ART & AUCTION</p>
      </footer>

    </div>
  );
}