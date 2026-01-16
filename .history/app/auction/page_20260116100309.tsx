import React from 'react';
import { ArrowUpRight, Timer, Hammer, Search, ArrowRight, Heart } from 'lucide-react';

export default function ModernArtAuction() {
  // Định nghĩa style chung cho số thứ tự để tái sử dụng
  const stickyNumberStyle = "text-6xl font-black opacity-10 sticky top-40 text-right select-none pointer-events-none";
  

  return (
    <div className="min-h-screen bg-[#fafaf9] text-[#1a1a1a] font-sans selection:bg-[#f07d44] selection:text-white">
      
      {/* 1. Nav Bar */}
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

      {/* ================= SECTION 01: HERO ================= */}
      <section className="relative pt-48 pb-24 px-[5%] max-w-[1600px] mx-auto grid grid-cols-12 gap-8">
          <div className="col-span-12 lg:col-span-1 hidden lg:block">
            <p className={stickyNumberStyle}>01</p>
          </div>
          {/* Tấm kính Hero */}
          <div className="col-span-12 lg:col-span-11 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[4rem] p-10 lg:p-20 shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-7">
              <h1 className="text-[10vw] lg:text-[7rem] font-black leading-[0.85] tracking-tighter uppercase mb-10">
                Art <br /> 
                <span className="ml-[10%] text-[#f07d44]">Auction</span> <br />
                2026
              </h1>
              <p className="max-w-xs ml-auto lg:mr-24 text-sm leading-relaxed opacity-60 italic font-medium">
                "Nơi những giá trị tinh thần được hữu hình hóa qua từng nét vẽ khung ngang."
              </p>
            </div>
            <div className="lg:col-span-5">
              <div className="relative aspect-[3/4] rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl">
                <img src="https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=1000" className="w-full h-full object-cover" alt="Hero" />
              </div>
            </div>
          </div>
        </section>

      {/* ================= SECTION 02: COLLECTION ================= */}
      {/* Đã tái cấu trúc để thêm cột số 02 */}
      <section className="py-24 px-[5%] max-w-[1600px] mx-auto mb-20 relative">
        <div className="grid grid-cols-12 gap-6">
            {/* Số thứ tự 02 Sticky */}
            <div className="col-span-12 lg:col-span-1 hidden lg:block relative">
                <p className={stickyNumberStyle}>02</p>
            </div>

            {/* Nội dung chính của Section 2 (Bọc trong thẻ trắng) */}
            <div className="col-span-12 lg:col-span-11 bg-white rounded-[4rem] shadow-sm p-8 lg:p-16">
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

                {/* The Grid */}
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
                    <div className="bg-[#1a1a1a] text-white p-10 rounded-[2.5rem] flex flex-col justify-between aspect-square md:aspect-auto md:h-full shadow-xl">
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
                        <div className="aspect-video rounded-[2rem] overflow-hidden mb-6 shadow-md relative bg-gray-50">
                        <img 
                            src={`https://images.unsplash.com/photo-1501472312651-726afe119ff1?q=80&w=800&sig=${i}`} 
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
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
            </div>
        </div>
      </section>

      {/* ================= SECTION 03: LIVE BIDDING ================= */}
      {/* Đã tái cấu trúc để thêm cột số 03 */}
      <section className="py-24 px-[5%] max-w-[1600px] mx-auto relative mb-32">
          <div className="grid grid-cols-12 gap-8">
            <div className="col-span-12 lg:col-span-1 hidden lg:block">
              <p className={stickyNumberStyle}>03</p>
            </div>
            {/* Tấm kính Live Bidding */}
            <div className="col-span-12 lg:col-span-11 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[4rem] p-10 lg:p-20 shadow-2xl">
              <h2 className="text-7xl font-serif font-bold mb-20">Live Bidding</h2>
              <div className="flex flex-col gap-24">
                {[1, 2].map((i) => (
                  <div key={i} className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center border-b border-white/10 pb-20 last:border-0">
                    <div className="lg:col-span-7 aspect-video rounded-3xl overflow-hidden shadow-2xl bg-white/5">
                      <img src="https://images.unsplash.com/photo-1501472312651-726afe119ff1?q=80&w=1200" className="w-full h-full object-cover" />
                    </div>
                    <div className="lg:col-span-5">
                      <p className="text-[10px] uppercase font-black text-[#f07d44] tracking-[0.4em] mb-4">Lô trực tiếp #{i}</p>
                      <h3 className="text-4xl font-serif font-bold mb-8">Morning Fog over the Thames</h3>
                      <div className="flex gap-12 mb-12">
                        <div>
                          <p className="text-[10px] uppercase font-bold opacity-40 mb-2">Giá hiện tại</p>
                          <p className="text-3xl font-black italic">$2.4M</p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase font-bold opacity-40 mb-2">Kết thúc sau</p>
                          <p className="text-3xl font-black flex items-center gap-2 tracking-tighter"><Timer size={24} color="#f07d44" /> 04:22:15</p>
                        </div>
                      </div>
                      <button className="w-full bg-white text-black py-6 rounded-2xl font-black text-xs uppercase tracking-[0.3em] hover:bg-[#f07d44] hover:text-white transition-all shadow-xl">
                        Đặt giá ngay <Hammer size={18} className="inline ml-2" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

      {/* Footer Minimalist */}
      <footer className="py-20 px-[5%] text-center border-t border-black/5 opacity-30">
         <p className="text-[10px] font-bold uppercase tracking-[0.5em]">© 2026 NÉT VẼ XANH — BỘ SƯU TẬP TÁC PHẨM</p>
      </footer>

    </div>
  );
}