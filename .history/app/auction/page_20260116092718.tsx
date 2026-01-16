import React from 'react';
import { ArrowUpRight, Timer, Hammer, Search, Menu } from 'lucide-react';

export default function ModernArtAuction() {
  return (
    <div className="min-h-screen bg-[#fafaf9] text-[#1a1a1a] font-sans">
      
      {/* 1. Nav Bar - Giữ vibe Glassmorphism từ bản gốc của bạn */}
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

      {/* 2. Hero Section - Bố cục bất đối xứng (Inspired by 'Visit Tokyo') */}
      <section className="relative pt-40 pb-20 px-[5%] max-w-[1600px] mx-auto grid grid-cols-12 gap-6">
        
        {/* Số thứ tự trang trí - Style 01/02 */}
        <div className="col-span-12 lg:col-span-1 hidden lg:block">
           <p className="text-6xl font-black opacity-10 sticky top-40">01</p>
        </div>

        {/* Tiêu đề chính - Typography lớn đè ảnh */}
        <div className="col-span-12 lg:col-span-7 relative z-10">
          <h1 className="text-[12vw] lg:text-[8rem] font-black leading-[0.85] tracking-tighter uppercase mb-8">
            Art <br /> 
            <span className="ml-[10%] text-[#f07d44]">Auction</span> <br />
            2026
          </h1>
          
          {/* Khối text nhỏ đặt cạnh tiêu đề lớn */}
          <div className="max-w-xs ml-auto lg:mr-20">
            <p className="text-xs uppercase tracking-[0.2em] font-bold mb-4 opacity-40">Giới thiệu phiên đấu giá</p>
            <p className="text-sm leading-relaxed opacity-70 italic">
              "Nơi những giá trị tinh thần được hữu hình hóa qua từng nét vẽ khung ngang, mở rộng tầm nhìn về nghệ thuật đương đại."
            </p>
          </div>
        </div>

        {/* Ảnh Hero - Khung ngang lớn chiếm bên phải */}
        <div className="col-span-12 lg:col-span-4 mt-10 lg:mt-0">
          <div className="relative aspect-[3/4] lg:aspect-auto lg:h-[600px] rounded-[2rem] overflow-hidden shadow-2xl">
            <img 
              src="https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=1000" 
              className="w-full h-full object-cover"
              alt="Main Art"
            />
            {/* Tag thông tin nhỏ đè lên ảnh */}
            <div className="absolute top-6 right-6 bg-white/90 backdrop-blur px-4 py-2 rounded-full shadow-lg">
                <span className="text-[10px] font-black uppercase tracking-widest italic">Tác phẩm tiêu biểu</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Phân bổ ảnh & Text - Grid Layout (Inspired by 'Green Paradise') */}
      <section className="py-32 px-[5%] max-w-[1600px] mx-auto bg-white rounded-[3rem] shadow-sm">
        <div className="mb-20">
          <h2 className="text-5xl font-black uppercase tracking-tighter">Bộ sưu tập <br /> Tranh ngang</h2>
          <div className="w-20 h-2 bg-[#f07d44] mt-6"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          
          {/* Card 1: Kiểu bố cục dọc nhưng ảnh ngang (Asymmetrical) */}
          <div className="lg:mt-20">
            <div className="aspect-video rounded-[2rem] overflow-hidden mb-6 group relative">
              <img src="https://images.unsplash.com/photo-1501472312651-726afe119ff1?q=80&w=800" className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                <ArrowUpRight className="text-white w-12 h-12" />
              </div>
            </div>
            <div className="flex justify-between items-start px-2">
              <div>
                <h3 className="text-xl font-bold uppercase tracking-tight">Ký ức vùng cao</h3>
                <p className="text-xs opacity-50 uppercase font-bold tracking-widest mt-1">Họa sĩ: Minh Tú</p>
              </div>
              <p className="text-lg font-black text-[#f07d44]">12.5M</p>
            </div>
          </div>

          {/* Card 2: Featured Card - Lớn hơn, có mô tả chi tiết */}
          <div className="md:col-span-2 lg:col-span-2">
            <div className="aspect-[21/9] rounded-[2rem] overflow-hidden mb-6 relative group">
              <img src="https://images.unsplash.com/photo-1549490349-8643362247b5?q=80&w=1500" className="w-full h-full object-cover group-hover:scale-105 transition duration-700" />
              <div className="absolute top-6 left-6 flex gap-2">
                <div className="bg-red-500 text-white text-[10px] font-bold px-3 py-1 rounded-full animate-pulse">LIVE</div>
                <div className="bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1">
                  <Timer size={12} /> 02:45:12
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-2">
               <div>
                  <h3 className="text-3xl font-black uppercase italic">Vũ điệu của ánh sáng</h3>
                  <p className="text-sm opacity-60 mt-2 leading-relaxed">
                    Một tác phẩm phá vỡ mọi quy tắc về khung hình, sử dụng tỷ lệ panorama để mô tả sự vô tận của không gian.
                  </p>
               </div>
               <div className="flex flex-col items-end justify-center">
                  <button className="flex items-center gap-3 bg-[#1a1a1a] text-white px-10 py-4 rounded-2xl font-bold uppercase tracking-widest hover:bg-[#f07d44] transition shadow-xl">
                    Đặt giá <Hammer size={18} />
                  </button>
               </div>
            </div>
          </div>

          {/* Các item nhỏ khác với cách sắp xếp Sole nhau */}
          {[1, 2, 3].map((i) => (
             <div key={i} className={`flex flex-col ${i === 2 ? 'lg:-mt-20' : ''}`}>
                <div className="aspect-video rounded-[2rem] overflow-hidden mb-4 shadow-lg group">
                   <img src={`https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?q=80&w=800&sig=${i}`} className="w-full h-full object-cover grayscale hover:grayscale-0 transition duration-500" />
                </div>
                <div className="px-4">
                  <p className="text-[10px] font-bold opacity-30 uppercase tracking-[0.3em]">Lot #00{i+4}</p>
                  <div className="flex justify-between mt-1">
                    <span className="font-bold text-sm uppercase">Landscape Art {i}</span>
                    <span className="font-bold text-sm">8.0M</span>
                  </div>
                </div>
             </div>
          ))}

        </div>
      </section>

      {/* Footer Minimalist */}
      <footer className="py-20 px-[5%] text-center border-t border-black/5 mt-20">
         <p className="text-[10px] font-bold uppercase tracking-[0.5em] opacity-30">© 2026 Nét Vẽ Xanh Production</p>
      </footer>

    </div>
  );
}