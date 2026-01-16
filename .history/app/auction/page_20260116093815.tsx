import React from 'react';
import { ArrowUpRight, Timer, Hammer, Search, Heart, ArrowRight } from 'lucide-react';

export default function ArtAuctionFullPage() {
  return (
    <div className="min-h-screen bg-[#fafaf9] text-[#1a1a1a] font-sans selection:bg-[#f07d44] selection:text-white">
      
      {/* 1. Nav Bar - Glassmorphism */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl z-50">
        <div className="bg-white/60 backdrop-blur-xl border border-white/40 rounded-2xl px-8 py-4 flex items-center justify-between shadow-sm">
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
              Tham gia ngay
            </button>
          </div>
        </div>
      </nav>

      {/* 2. Hero Section - Bố cục bất đối xứng */}
      <section className="relative pt-40 pb-20 px-[5%] max-w-[1600px] mx-auto grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-1 hidden lg:block text-right">
           <p className="text-6xl font-black opacity-10 sticky top-40">01</p>
        </div>
        <div className="col-span-12 lg:col-span-7 relative z-10">
          <h1 className="text-[12vw] lg:text-[8rem] font-black leading-[0.85] tracking-tighter uppercase mb-8">
            Art <br /> 
            <span className="ml-[10%] text-[#f07d44]">Auction</span> <br />
            2026
          </h1>
          <div className="max-w-xs ml-auto lg:mr-20">
            <p className="text-xs uppercase tracking-[0.2em] font-bold mb-4 opacity-40">Giới thiệu</p>
            <p className="text-sm leading-relaxed opacity-70 italic">
              "Nơi những giá trị tinh thần được hữu hình hóa qua từng nét vẽ khung ngang, mở rộng tầm nhìn về nghệ thuật đương đại."
            </p>
          </div>
        </div>
        <div className="col-span-12 lg:col-span-4 mt-10 lg:mt-0">
          <div className="relative aspect-[3/4] lg:aspect-auto lg:h-[600px] rounded-[2.5rem] overflow-hidden shadow-2xl">
            <img src="https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=1000" className="w-full h-full object-cover" alt="Main Art" />
            <div className="absolute top-6 right-6 bg-white/90 backdrop-blur px-4 py-2 rounded-full shadow-lg text-[10px] font-black uppercase text-[#f07d44]">
                Tác phẩm tiêu biểu
            </div>
          </div>
        </div>
      </section>

      {/* 3. Phần Bộ sưu tập Tranh ngang (Gallery Section) */}
      <section className="py-24 px-[5%] max-w-[1600px] mx-auto bg-white rounded-[4rem] shadow-sm">
        <div className="flex justify-between items-end mb-16 px-4">
          <h2 className="text-5xl font-black uppercase tracking-tighter">Bộ sưu tập <br /> Tranh ngang</h2>
          <button className="flex items-center gap-2 font-bold text-xs uppercase tracking-[0.2em] border-b-2 border-[#f07d44] pb-1">
            Xem tất cả <ArrowRight size={14} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Tranh lớn tiêu điểm */}
          <div className="md:col-span-8 group">
            <div className="aspect-[21/9] rounded-[2.5rem] overflow-hidden shadow-md">
              <img src="https://images.unsplash.com/photo-1549490349-8643362247b5?q=80&w=1500" className="w-full h-full object-cover group-hover:scale-105 transition duration-1000" />
            </div>
            <div className="mt-6 px-4">
              <h3 className="text-3xl font-black uppercase italic">Vũ điệu của ánh sáng</h3>
              <p className="text-xs font-bold opacity-40 uppercase tracking-widest text-[#f07d44]">Họa sĩ: Trần Thế Vinh</p>
            </div>
          </div>
          {/* Tranh phụ bên cạnh */}
          <div className="md:col-span-4">
            <div className="aspect-[4/3] rounded-[2.5rem] overflow-hidden shadow-md mb-6">
              <img src="https://images.unsplash.com/photo-1501472312651-726afe119ff1?q=80&w=800" className="w-full h-full object-cover" />
            </div>
            <div className="px-4">
              <h4 className="text-xl font-black uppercase tracking-tight">Ký ức vùng cao</h4>
              <p className="text-[10px] font-bold opacity-40 uppercase tracking-widest text-[#f07d44]">Họa sĩ: Minh Tú</p>
            </div>
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

      {/* Footer */}
      <footer className="py-20 px-[5%] text-center border-t border-black/5 opacity-30">
         <p className="text-[10px] font-bold uppercase tracking-[0.5em]">© 2026 NÉT VẼ XANH — ART & AUCTION</p>
      </footer>
    </div>
  );
}