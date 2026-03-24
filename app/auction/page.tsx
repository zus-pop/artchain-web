"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Timer, Hammer, ArrowRight, Heart } from 'lucide-react';
import { useGetAuctions } from '@/apis/auction';

export default function ModernArtAuction() {
  const [activeSection, setActiveSection] = useState('section-01');
  const currentYear = new Date().getFullYear();
  const { data: ongoingAuctions = [], isLoading: isLoadingOngoing } = useGetAuctions({
    status: 'ONGOING',
    startFrom: `${currentYear}-01-01`,
    startTo: `${currentYear}-12-31`,
    endFrom: `${currentYear}-01-01`,
    endTo: `${currentYear}-12-31`,
    page: 1,
    limit: 10,
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.3 } 
    );

    const sections = document.querySelectorAll('section[id^="section-"]');
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const getNumberStyle = (sectionId: string) => {
    const isActive = activeSection === sectionId;
    return `text-6xl font-black sticky top-40 text-right select-none transition-colors duration-500 ${
      isActive ? 'text-[#f07d44] opacity-100' : 'text-gray-300 opacity-20'
    }`;
  };

  const formatVnd = (amount: number) => `${new Intl.NumberFormat('vi-VN').format(amount)}đ`;

  const getTimeLeft = (endTime: string) => {
    const diff = new Date(endTime).getTime() - Date.now();
    if (diff <= 0) return 'Đã kết thúc';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);

    if (days > 0) return `${days}d ${hours}h`;
    return `${hours}h ${minutes}m`;
  };

  const liveItems = ongoingAuctions.slice(0, 2).map((auction) => {
    const leadPainting = (auction.auctionPaintings ?? []).reduce((best, current) => {
      if (!best) return current;
      return (current.currentBid ?? 0) > (best.currentBid ?? 0) ? current : best;
    }, auction.auctionPaintings?.[0]);

    const competitorId = leadPainting?.painting?.competitorId;
    const shortCompetitorId = competitorId ? competitorId.slice(-6) : null;

    return {
      id: auction.auctionId,
      title: leadPainting?.painting?.title || auction.title,
      artist: shortCompetitorId
        ? `Tác giả ID: ${shortCompetitorId}`
        : auction.auctioneer?.fullName || 'Không rõ tác giả',
      bid: formatVnd(leadPainting?.currentBid ?? leadPainting?.basePrice ?? 0),
      time: getTimeLeft(auction.endTime),
      status: 'ĐANG ĐẤU GIÁ',
      img: leadPainting?.painting?.imageUrl || 'https://images.unsplash.com/photo-1501472312651-726afe119ff1?q=80&w=1200',
      watchers: auction.participantCount ?? 0,
    };
  });

  return (
    <div className="min-h-screen bg-[#eae6e0] text-[#1a1a1a] font-sans selection:bg-[#f07d44] selection:text-white relative">
      
      {/* Quick Action Navigation Sidebar */}
      <div className="fixed left-8 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-4 hidden lg:flex">
        {['section-01', 'section-02', 'section-03'].map((section, index) => (
          <button
            key={section}
            onClick={() => scrollToSection(section)}
            className={`w-3 h-3 rounded-full transition-all duration-500 ${
              activeSection === section 
                ? 'bg-[#f07d44] scale-125 shadow-lg shadow-orange-200' 
                : 'bg-black/10 hover:bg-black/30'
            }`}
            aria-label={`Go to section ${index + 1}`}
          />
        ))}
      </div>

      {/* 1. Nav Bar */}
      {/* <nav className="fixed top-6 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl z-50">
      <GlassSurface
          width="100%"
          height="auto"
          borderRadius={50}
          backgroundOpacity={0.58}
          blur={5}
          saturation={3}
          brightness={54}
          opacity={1}
          displace={0.5}
          distortionScale={-180}
          redOffset={0}
          greenOffset={10}
          blueOffset={20}
          className="max-w-7xl w-full"
          style={{ justifyContent: "flex-start" }}
        >
            
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
        </GlassSurface>
      </nav> */}

      {/* ================= SECTION 01: HERO ================= */}
      <section id="section-01" className="relative pt-40 pb-20 px-[5%] max-w-[1600px] mx-auto grid grid-cols-12 gap-6 min-h-[90vh]">
        {/* Số thứ tự 01 Sticky */}
        <div className="col-span-12 lg:col-span-1 hidden lg:block relative">
           <p className={getNumberStyle('section-01')}>01</p>
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
              "Nơi hội tụ những kiệt tác nghệ thuật đương đại. Sàn đấu giá uy tín, minh bạch, kết nối nhà sưu tập và nghệ sĩ tài năng."
            </p>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4 mt-10 lg:mt-0">
          <div className="relative aspect-[3/4] lg:aspect-auto lg:h-[600px] overflow-hidden shadow-2xl">
            <img 
              src="https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=1000" 
              className="w-full h-full object-cover"
              alt="Main Art"
            />
            <div className="absolute top-6 right-6 bg-white/90 backdrop-blur px-4 py-2 shadow-lg">
                <span className="text-[10px] font-black uppercase tracking-widest">Tác phẩm tiêu biểu</span>
            </div>
          </div>
        </div>
      </section>

      {/* ================= SECTION 02: COLLECTION ================= */}
      <section id="section-02" className="py-24 px-[5%] max-w-[1600px] mx-auto mb-20 relative min-h-[90vh]">
        <div className="grid grid-cols-12 gap-6">
            {/* Số thứ tự 02 Sticky */}
            <div className="col-span-12 lg:col-span-1 hidden lg:block relative">
                <p className={getNumberStyle('section-02')}>02</p>
            </div>

            {/* Nội dung chính của Section 2 (Bọc trong thẻ trắng) */}
            <div className="col-span-12 lg:col-span-11 bg-white shadow-sm p-8 lg:p-16">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                <div className="max-w-xl">
                    <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#f07d44] mb-4 block">Bộ sưu tập đặc biệt</span>
                    <h2 className="text-5xl lg:text-6xl font-black uppercase tracking-tighter leading-none">
                    Tranh phong cảnh <br /> đương đại
                    </h2>
                </div>
                <Link href="/auction/list">
                  <button className="flex items-center gap-2 font-bold text-sm uppercase tracking-widest pb-2 border-b-2 border-[#f07d44] hover:gap-4 transition-all">
                      Xem tất cả <ArrowRight size={16} />
                  </button>
                </Link>
                </div>

                {/* The Grid */}
                <div className="flex flex-col gap-16">
                {/* Hàng 1: Featured Landscape */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                    <div className="md:col-span-8 group">
                    <div className="relative aspect-[21/9] overflow-hidden bg-gray-100 shadow-md">
                        <img 
                        src="https://images.unsplash.com/photo-1549490349-8643362247b5?q=80&w=1500" 
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-1000"
                        alt="Featured Art"
                        />
                        <div className="absolute top-6 left-6 flex gap-2">
                        <div className="bg-red-500 text-white text-[10px] font-bold px-3 py-1 animate-pulse shadow-lg">LIVE</div>
                        <div className="bg-white/90 backdrop-blur px-3 py-1 text-[10px] font-bold flex items-center gap-1 shadow-sm">
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
                    <div className="bg-[#1a1a1a] text-white p-10 flex flex-col justify-between aspect-square md:aspect-auto md:h-full shadow-xl">
                        <div>
                        <p className="text-[10px] font-bold opacity-40 uppercase tracking-widest mb-4">Thông tin tác phẩm</p>
                        <p className="text-sm opacity-80 leading-relaxed">Sơn dầu trên canvas, 120x80cm. Tác phẩm độc bản, được nghệ sĩ ký tên và đóng dấu chứng thực. Đi kèm giấy chứng nhận nguồn gốc.</p>
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
                        <div className="aspect-video overflow-hidden mb-6 shadow-md relative bg-gray-50">
                        <img 
                            src={`https://images.unsplash.com/photo-1501472312651-726afe119ff1?q=80&w=800&sig=${i}`} 
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                        />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                            <div className="bg-white p-4 shadow-xl"><ArrowUpRight size={20} /></div>
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
      <section id="section-03" className="py-32 px-[5%] max-w-[1600px] mx-auto relative min-h-[90vh]">
        <div className="grid grid-cols-12 gap-6">
             {/* Số thứ tự 03 Sticky */}
            <div className="col-span-12 lg:col-span-1 hidden lg:block relative">
                <p className={getNumberStyle('section-03')}>03</p>
            </div>

            {/* Nội dung chính của Section 3 */}
            <div className="col-span-12 lg:col-span-11">
                <div className="mb-20 pl-4 lg:pl-0 flex flex-col md:flex-row md:items-end justify-between gap-6">
                  <div>
                    <h2 className="text-6xl font-serif font-bold text-slate-900 leading-tight">Đấu giá trực tiếp</h2>
                    <p className="text-slate-400 mt-4 max-w-sm">Các tác phẩm nghệ thuật đang được đấu giá trực tuyến. Tham gia ngay để sở hữu những kiệt tác độc đáo cho bộ sưu tập của bạn.</p>
                  </div>
                  <Link href="/auction/list">
                    <button className="bg-white border-2 border-[#FF6E1A] text-[#FF6E1A] px-8 py-4 rounded-md font-bold text-xs uppercase tracking-[0.3em] hover:bg-[#FF6E1A] hover:text-white transition-all whitespace-nowrap flex items-center gap-3">
                      Xem tất cả <ArrowRight size={16} />
                    </button>
                  </Link>
                </div>

                <div className="flex flex-col gap-20">
                {isLoadingOngoing ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {Array.from({ length: 2 }).map((_, i) => (
                      <div key={i} className="bg-white h-[360px] animate-pulse rounded-md" />
                    ))}
                  </div>
                ) : liveItems.length === 0 ? (
                  <div className="py-20 text-center border border-slate-200 bg-white/60">
                    <p className="text-lg font-bold uppercase tracking-wider text-slate-500">Hiện chưa có phiên đấu giá ongoing</p>
                  </div>
                ) : (
                  liveItems.map((item) => (
                    <div key={item.id} className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center border-b border-slate-200 pb-20 last:border-0 px-4 lg:px-0">
                    {/* Ảnh bên trái */}
                    <div className="lg:col-span-7 relative group">
                        <div className="aspect-video overflow-hidden shadow-xl bg-gray-100">
                        <img src={item.img} className="w-full h-full object-cover" alt={item.title} />
                        </div>
                        {item.status && (
                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 text-[9px] font-bold text-[#FF6E1A] uppercase tracking-widest shadow-sm">
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
                        <button className="flex-1 bg-[#FF6E1A] text-white py-5 rounded-md font-bold text-xs uppercase tracking-[0.3em] hover:bg-[#f07d44] transition-all flex items-center justify-center gap-3 shadow-lg">
                            Đặt giá thầu <Hammer size={16} />
                        </button>
                        <button className="p-5 border border-slate-200 rounded-md hover:bg-slate-50 transition">
                            <Heart size={20} className="text-slate-400" />
                        </button>
                        </div>
                        <p className="mt-6 text-[11px] text-slate-400 font-medium flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span> {item.watchers} người đang theo dõi lô tranh này
                        </p>
                    </div>
                    </div>
                  ))
                )}
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