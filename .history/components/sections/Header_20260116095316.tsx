import React from 'react';
import { ArrowUpRight, Timer, Hammer, Search, ArrowRight, Heart } from 'lucide-react';
import GlassSurface from '../GlassSurface';

// Giả định component GlassSurface đã được import hoặc định nghĩa trong dự án của bạn
// Tôi sẽ sử dụng các props bạn cung cấp để tạo style cho 01, 02, 03
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
      className="flex items-center justify-center overflow-visible shadow-2xl"
    >
      <span className="text-4xl font-black tracking-tighter text-[#f07d44] drop-shadow-md">
        {children}
      </span>
    </GlassSurface>
  </div>
);

export default function ModernArtAuction() {
  return (
    <div className="min-h-screen bg-[#fafaf9] text-[#1a1a1a] font-sans selection:bg-[#f07d44] selection:text-white transition-colors duration-500">
      
      {/* 1. Nav Bar - Glassmorphism */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl z-50">
        <div className="bg-white/40 backdrop-blur-2xl border border-white/40 rounded-2xl px-8 py-4 flex items-center justify-between shadow-xl">
          <div className="text-xl font-black tracking-tighter uppercase">Nét Vẽ Xanh</div>
          <div className="hidden lg:flex gap-10 text-[11px] uppercase tracking-widest font-bold opacity-70">
            <a href="#" className="hover:opacity-100 transition">Cuộc thi</a>
            <a href="#" className="hover:opacity-100 transition border-b border-[#f07d44]">Đấu giá</a>
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
           <SectionNumberGlass>01</SectionNumberGlass>
        </div>

        <div className="col-span-12 lg:col-span-7 relative z-10">
          <h1 className="text-[10vw] lg:text-[7.5rem] font-black leading-[0.85] tracking-tighter uppercase mb-10">
            Art <br /> 
            <span className="ml-[10%] text-[#f07d44]">Auction</span> <br />
            2026
          </h1>
          <div className="max-w-xs ml-auto lg:mr-24">
            <p className="text-[10px] uppercase tracking-[0.3em] font-black mb-4 opacity-30 italic">Perspective / 01</p>
            <p className="text-sm leading-relaxed opacity-60 italic font-medium">
              "Nơi những giá trị tinh thần được hữu hình hóa qua từng nét vẽ khung ngang, mở rộng tầm nhìn về nghệ thuật đương đại."
            </p>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4">
          <div className="relative aspect-[3/4] lg:h-[650px] rounded-[3rem] overflow-hidden shadow-2xl group">
            <img 
              src="https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=1000" 
              className="w-full h-full object-cover group-hover:scale-105 transition duration-1000"
              alt="Main Art"
            />
          </div>
        </div>
      </section>

      {/* ================= SECTION 02: COLLECTION (WHITE GLASS SURFACE) ================= */}
      <section className="relative py-32 px-[5%] max-w-[1600px] mx-auto mb-20">
        <div className="grid grid-cols-12 gap-8">
            <div className="col-span-12 lg:col-span-1 hidden lg:block">
                <SectionNumberGlass>02</SectionNumberGlass>
            </div>

            <div className="col-span-12 lg:col-span-11 relative">
                {/* Sử dụng GlassSurface làm nền trắng cho Section 2 */}
                <GlassSurface
                  width="100%"
                  height="auto"
                  borderRadius={80}
                  backgroundOpacity={0.85} // Tăng độ trắng
                  blur={20} // Làm mờ mạnh hơn cho vibe trắng
                  saturation={1.5}
                  brightness={110} // Tăng độ sáng để ra màu trắng kính
                  opacity={1}
                  className="p-8 lg:p-20 shadow-2xl border border-white/50"
                >
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
                        <div className="max-w-xl text-[#1a1a1a]">
                            <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#f07d44] mb-6 block">Collection / Landscape</span>
                            <h2 className="text-6xl lg:text-7xl font-black uppercase tracking-tighter leading-none">
                                Tuyển tập <br /> Tranh khung ngang
                            </h2>
                        </div>
                        <button className="flex items-center gap-2 font-bold text-xs uppercase tracking-widest pb-2 border-b-2 border-[#f07d44] hover:gap-6 transition-all text-[#1a1a1a]">
                            Khám phá tất cả <ArrowRight size={18} />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
                        <div className="md:col-span-8 group">
                            <div className="relative aspect-[21/9] rounded-[3rem] overflow-hidden shadow-2xl border border-black/5">
                                <img 
                                    src="https://images.unsplash.com/photo-1549490349-8643362247b5?q=80&w=1500" 
                                    className="w-full h-full object-cover group-hover:scale-105 transition duration-1000"
                                    alt="Featured Art"
                                />
                                <div className="absolute top-6 left-6 flex gap-3">
                                    <div className="bg-red-500 text-white text-[10px] font-black px-4 py-1.5 rounded-full animate-pulse shadow-lg">LIVE</div>
                                </div>
                            </div>
                            <div className="mt-8 flex justify-between items-end px-4 text-[#1a1a1a]">
                                <div>
                                    <h3 className="text-4xl font-black uppercase italic leading-none mb-3">Vũ điệu của ánh sáng</h3>
                                    <p className="text-xs font-bold uppercase tracking-widest text-[#f07d44]">Họa sĩ: Trần Thế Vinh</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] uppercase font-bold opacity-40 mb-1 tracking-widest">Giá hiện tại</p>
                                    <p className="text-3xl font-black italic tracking-tighter">25,400,000đ</p>
                                </div>
                            </div>
                        </div>

                        <div className="md:col-span-4 h-full">
                            <div className="bg-black/5 border border-black/5 p-12 rounded-[3rem] h-full flex flex-col justify-between shadow-sm">
                                <div>
                                    <h4 className="text-xl font-bold uppercase tracking-widest mb-6 text-[#1a1a1a]">Thông điệp</h4>
                                    <p className="text-sm opacity-70 leading-relaxed font-medium text-[#1a1a1a]">
                                        Các tác phẩm nghệ thuật khung ngang mang lại cảm giác mở rộng vô tận, phá vỡ giới hạn của không gian sống hiện đại.
                                    </p>
                                </div>
                                <div className="mt-12">
                                    <button className="w-full bg-[#1a1a1a] text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-[#f07d44] transition-all">
                                        Đặt lịch triển lãm
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </GlassSurface>
            </div>
        </div>
      </section>

      {/* ================= SECTION 03: LIVE BIDDING ================= */}
      <section className="py-32 px-[5%] max-w-[1600px] mx-auto relative">
        <div className="grid grid-cols-12 gap-8">
            <div className="col-span-12 lg:col-span-1 hidden lg:block">
                <SectionNumberGlass>03</SectionNumberGlass>
            </div>

            <div className="col-span-12 lg:col-span-11 pl-4">
                <div className="mb-24">
                    <h2 className="text-7xl font-serif font-bold text-slate-900 leading-tight">Live Bidding</h2>
                    <p className="text-slate-400 mt-6 max-w-sm font-medium">Sở hữu những tác phẩm độc bản từ các nghệ sĩ tiêu biểu nhất mùa giải 2026.</p>
                </div>

                <div className="flex flex-col gap-24">
                {[
                    { id: 1, title: "Morning Fog over the Thames", artist: "J.M.W. Turner, 1844", bid: "$2,400,000", time: "04h 22m", img: "https://images.unsplash.com/photo-1501472312651-726afe119ff1?q=80&w=1200" },
                    { id: 2, title: "Valley of the Yosemite", artist: "Albert Bierstadt, 1864", bid: "$850,000", time: "06h 15m", img: "https://images.unsplash.com/photo-1549490349-8643362247b5?q=80&w=1200" }
                ].map((item) => (
                    <div key={item.id} className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center border-b border-slate-100 pb-24 last:border-0">
                      <div className="lg:col-span-7 group">
                          <div className="aspect-video rounded-[2.5rem] overflow-hidden shadow-2xl bg-gray-100">
                            <img src={item.img} className="w-full h-full object-cover group-hover:scale-105 transition duration-700" alt={item.title} />
                          </div>
                      </div>
                      <div className="lg:col-span-5">
                          <h3 className="text-5xl font-serif font-bold text-slate-900 mb-4 leading-tight">{item.title}</h3>
                          <p className="text-slate-400 italic text-xl mb-12">{item.artist}</p>
                          <div className="grid grid-cols-2 gap-12 mb-12 font-sans">
                            <div>
                                <p className="text-[11px] uppercase font-black text-slate-300 tracking-[0.2em] mb-2">Current Bid</p>
                                <p className="text-3xl font-black text-slate-900">{item.bid}</p>
                            </div>
                            <div>
                                <p className="text-[11px] uppercase font-black text-slate-300 tracking-[0.2em] mb-2">Time Left</p>
                                <p className="text-3xl font-black flex items-center gap-2"><Timer size={28} className="text-[#f07d44]" /> {item.time}</p>
                            </div>
                          </div>
                          <div className="flex gap-4">
                            <button className="flex-1 bg-[#1a1a1a] text-white py-6 rounded-2xl font-black text-xs uppercase tracking-[0.3em] hover:bg-[#f07d44] transition-all flex items-center justify-center gap-3 shadow-2xl">
                                Place A Bid <Hammer size={18} />
                            </button>
                            <button className="p-6 border border-slate-200 rounded-2xl hover:bg-slate-50 transition text-slate-300 hover:text-red-500">
                                <Heart size={24} />
                            </button>
                          </div>
                      </div>
                    </div>
                ))}
                </div>
            </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-24 border-t border-black/5 flex flex-col items-center gap-8 opacity-40">
         <p className="text-[10px] font-bold uppercase tracking-[0.6em]">NÉT VẼ XANH — CURATED EXHIBITION 2026</p>
      </footer>

    </div>
  );
}