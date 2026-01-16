import React from 'react';
import { ArrowUpRight, Timer, Hammer, Search, ArrowRight, Heart } from 'lucide-react';
import GlassSurface from '@/components/GlassSurface';

// Thành phần số thứ tự sử dụng GlassSurface theo đúng thông số bạn cung cấp
const SectionNumberGlass = ({ children }: { children: React.ReactNode }) => (
  <div className="sticky top-40 z-20">
    <GlassSurface
      width="80px"
      height="100px"
      borderRadius={50}
      backgroundOpacity={0.58}
      blur={5}
      saturation={3}
      brightness={54}
      opacity={1}
      displace={0.5}
      distortionScale={180}
      redOffset={0}
      greenOffset={10}
      blueOffset={20}
      className="flex items-center justify-center overflow-visible shadow-2xl border border-white/10"
    >
      <span className="text-4xl font-black tracking-tighter text-[#f07d44] drop-shadow-md">
        {children}
      </span>
    </GlassSurface>
  </div>
);

export default function ModernArtAuction() {
  return (
    /* CONTAINER CHÍNH: Chứa ảnh nền và Overlay tối cho toàn bộ trang */
    <div className="relative min-h-screen font-sans selection:bg-[#f07d44] selection:text-white">
      
      {/* 1. TOÀN BỘ BACKGROUND ẢNH VÀ OVERLAY */}
      <div className="fixed inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1514924013411-cbf25faa35bb?q=80&w=2000" 
          className="w-full h-full object-cover"
          alt="Global Background"
        />
        {/* Lớp phủ tối (Overlay) để text trắng bên trên nổi bật */}
        <div className="absolute inset-0 bg-black/70 backdrop-blur-[2px]"></div>
      </div>

      {/* 2. NỘI DUNG CHÍNH (Z-INDEX CAO HƠN BACKGROUND) */}
      <div className="relative z-10 text-white/90">
        
        {/* Nav Bar - Giữ nguyên vibe kính mờ */}
        <nav className="fixed top-6 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl z-50">
          <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-2xl px-8 py-4 flex items-center justify-between shadow-2xl">
            <div className="text-xl font-black tracking-tighter uppercase text-white">Nét Vẽ Xanh</div>
            <div className="hidden lg:flex gap-10 text-[11px] uppercase tracking-widest font-bold opacity-70">
              <a href="#" className="hover:text-[#f07d44] transition">Cuộc thi</a>
              <a href="#" className="hover:text-[#f07d44] transition">Đấu giá</a>
              <a href="#" className="hover:text-[#f07d44] transition">Triển lãm</a>
            </div>
            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-white/10 rounded-full transition"><Search size={20} /></button>
              <button className="bg-[#f07d44] text-white px-6 py-2 rounded-xl font-bold text-sm shadow-lg hover:scale-105 transition">
                Tham gia
              </button>
            </div>
          </div>
        </nav>

        {/* SECTION 01: HERO */}
        <section className="relative pt-48 pb-24 px-[5%] max-w-[1600px] mx-auto grid grid-cols-12 gap-8">
          <div className="col-span-12 lg:col-span-1 hidden lg:block">
            <SectionNumberGlass>01</SectionNumberGlass>
          </div>
          <div className="col-span-12 lg:col-span-7">
            <h1 className="text-[10vw] lg:text-[7.5rem] font-black leading-[0.85] tracking-tighter uppercase mb-10 text-white">
              Art <br /> 
              <span className="ml-[10%] text-[#f07d44]">Auction</span> <br />
              2026
            </h1>
            <div className="max-w-xs ml-auto lg:mr-24">
              <p className="text-sm leading-relaxed opacity-60 italic font-medium">
                "Nơi những giá trị tinh thần được hữu hình hóa qua từng nét vẽ khung ngang."
              </p>
            </div>
          </div>
          <div className="col-span-12 lg:col-span-4">
            <div className="relative aspect-[3/4] lg:h-[650px] rounded-[3rem] overflow-hidden shadow-2xl border border-white/10">
              <img src="https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=1000" className="w-full h-full object-cover" />
            </div>
          </div>
        </section>

        {/* SECTION 02: COLLECTION (NỀN KÍNH MỜ MÀU TRẮNG) */}
        <section className="relative py-32 px-[5%] max-w-[1600px] mx-auto mb-20">
          <div className="grid grid-cols-12 gap-8">
            <div className="col-span-12 lg:col-span-1 hidden lg:block">
              <SectionNumberGlass>02</SectionNumberGlass>
            </div>
            <div className="col-span-12 lg:col-span-11">
              <GlassSurface
                width="100%"
                height="auto"
                borderRadius={80}
                backgroundOpacity={0.85} // Độ trắng cao
                blur={25}
                brightness={110} // Làm sáng để tạo màu trắng kính
                className="p-10 lg:p-20 shadow-2xl border border-white/50 text-slate-900"
              >
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#f07d44] mb-4 block">Landscape Art</span>
                    <h2 className="text-5xl lg:text-7xl font-black uppercase tracking-tighter leading-none">Tuyển tập Tranh ngang</h2>
                  </div>
                  <button className="flex items-center gap-2 font-bold text-xs uppercase tracking-widest pb-1 border-b-2 border-[#f07d44]">
                    Xem tất cả <ArrowRight size={18} />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
                  <div className="md:col-span-8 group">
                    <div className="aspect-[21/9] rounded-[2.5rem] overflow-hidden shadow-xl">
                      <img src="https://images.unsplash.com/photo-1549490349-8643362247b5?q=80&w=1500" className="w-full h-full object-cover" />
                    </div>
                    <h3 className="text-3xl font-black mt-8 italic uppercase">Vũ điệu của ánh sáng</h3>
                  </div>
                  <div className="md:col-span-4 h-full">
                    <div className="bg-black/5 p-10 rounded-[2.5rem] h-full flex flex-col justify-between border border-black/5">
                      <p className="text-sm leading-relaxed font-medium opacity-70">
                        Cảm giác mở rộng vô tận của khung hình ngang.
                      </p>
                      <button className="w-full bg-[#1a1a1a] text-white py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest">
                        Đặt lịch xem tranh
                      </button>
                    </div>
                  </div>
                </div>
              </GlassSurface>
            </div>
          </div>
        </section>

        {/* SECTION 03: LIVE BIDDING */}
        <section className="py-32 px-[5%] max-w-[1600px] mx-auto relative">
          <div className="grid grid-cols-12 gap-8">
            <div className="col-span-12 lg:col-span-1 hidden lg:block">
              <SectionNumberGlass>03</SectionNumberGlass>
            </div>
            <div className="col-span-12 lg:col-span-11 pl-4">
              <h2 className="text-7xl font-serif font-bold mb-20 text-white">Live Bidding</h2>
              {[1, 2].map((i) => (
                <div key={i} className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-24 border-b border-white/10 pb-20">
                  <div className="lg:col-span-7 aspect-video rounded-3xl overflow-hidden shadow-2xl">
                    <img src="https://images.unsplash.com/photo-1501472312651-726afe119ff1?q=80&w=1200" className="w-full h-full object-cover" />
                  </div>
                  <div className="lg:col-span-5">
                    <h3 className="text-4xl font-serif font-bold mb-4">Morning Fog over the Thames</h3>
                    <div className="flex gap-10 mb-10">
                      <div>
                        <p className="text-[10px] uppercase font-black opacity-40 mb-1">Current Bid</p>
                        <p className="text-3xl font-black">$2,400,000</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-black opacity-40 mb-1">Time Left</p>
                        <p className="text-3xl font-black flex items-center gap-2"><Timer size={24} color="#f07d44" /> 04:22</p>
                      </div>
                    </div>
                    <button className="w-full bg-[#f07d44] text-white py-6 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl">
                      Place A Bid <Hammer size={18} className="inline ml-2" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}