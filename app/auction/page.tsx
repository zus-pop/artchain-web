"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Timer, Gavel, ArrowRight, ArrowLeft } from 'lucide-react';
import { useGetAuctions } from '@/apis/auction';
import { HeaderWrapper } from '@/components/sections/HeaderWrapper';
import { motion, AnimatePresence } from 'framer-motion';

import { useAuth } from '@/hooks/useAuth';
import { useMeQuery } from '@/hooks/useMeQuery';
import { createWallet } from '@/apis/wallet';
import { Check, X } from 'lucide-react';
import { toast } from 'sonner';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 20 } as const
  }
};

export default function ModernArtAuction() {
  const [activeSection, setActiveSection] = useState('section-01');
  const [mounted, setMounted] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [isCreatingWallet, setIsCreatingWallet] = useState(false);
  const [activeLiveId, setActiveLiveId] = useState<string | number | null>(null);
  const { user } = useAuth();
  const { data: userData, refetch: refetchUser } = useMeQuery();
  const displayUser = userData || user;
  const hasWallet = !!displayUser?.wallet;

  const { data: allAuctions = [], isLoading } = useGetAuctions({
    page: 1,
    limit: 10,
    status: "LIVE" as any,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  // Initialize activeLiveId when auctions load
  useEffect(() => {
    if (allAuctions.length > 0 && !activeLiveId) {
      setActiveLiveId(allAuctions[0].auctionId);
    }
  }, [allAuctions, activeLiveId]);

  useEffect(() => {
    if (!mounted || !hasWallet) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { 
        threshold: 0.1,
        rootMargin: "-15% 0px -15% 0px"
      } 
    );

    const sections = document.querySelectorAll('section[id^="section-"]');
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, [mounted, hasWallet, isLoading, allAuctions]);

  const handleBecomeBidder = async () => {
    if (!displayUser?.userId) {
      toast.error("Vui lòng đăng nhập để tiếp tục");
      return;
    }

    try {
      setIsCreatingWallet(true);
      await createWallet(displayUser.userId);
      await refetchUser();
      setShowTerms(false);
      toast.success("Chúc mừng! Bạn đã trở thành người đấu giá");
    } catch (error) {
      console.error("Failed to create wallet:", error);
      toast.error("Có lỗi xảy ra khi kích hoạt tài khoản đấu giá");
    } finally {
      setIsCreatingWallet(false);
    }
  };

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

  const sortedAuctions = [...allAuctions].sort((a, b) => 
    (b.auctionPaintings?.length || 0) - (a.auctionPaintings?.length || 0)
  );

  const featuredAuction = sortedAuctions[0];

  const formatAuctionItem = (auction: any) => {
    const leadPainting = (auction.auctionPaintings ?? []).reduce((best: any, current: any) => {
      if (!best) return current;
      return (current.currentBid ?? 0) > (best.currentBid ?? 0) ? current : best;
    }, auction.auctionPaintings?.[0]);

    const artistName = leadPainting?.painting?.competitorName || auction.auctioneer?.fullName || 'Nghệ sĩ';

    const statusLabel = auction.status === "LIVE" || auction.status === "ONGOING" || auction.status === "ACTIVE" 
      ? "ĐANG ĐẤU GIÁ" 
      : "ĐÃ KẾT THÚC";

    return {
      id: auction.auctionId,
      title: auction.title,
      paintingTitle: leadPainting?.painting?.title || "Không có tiêu đề",
      artist: `Họa sĩ: ${artistName}`,
      bid: formatVnd(leadPainting?.currentBid ?? leadPainting?.basePrice ?? 0),
      time: getTimeLeft(auction.endTime),
      status: statusLabel,
      img: leadPainting?.painting?.imageUrl || 'https://images.unsplash.com/photo-1501472312651-726afe119ff1?q=80&w=1200',
      watchers: auction.participantCount ?? 0,
    };
  };

  const liveItems = sortedAuctions.map(formatAuctionItem);
  const featuredItem = featuredAuction ? formatAuctionItem(featuredAuction) : null;

  if (!mounted) return null;

  // Render Become Bidder Landing Page if NO wallet
  if (!hasWallet) {
    return (
      <div className="min-h-screen bg-[#eae6e0] text-[#1a1a1a] font-sans selection:bg-[#f07d44] selection:text-white relative">
        <HeaderWrapper />
        
        <main className="pt-40 pb-20 px-[5%] max-w-4xl mx-auto flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-20 h-20 bg-[#f07d44]/10 rounded-full flex items-center justify-center mb-8 mx-auto">
              <Gavel className="text-[#f07d44] w-10 h-10" />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tighter mb-6 leading-none">
              Sẵn sàng sở hữu <br />
              <span className="text-[#f07d44]">Kiệt tác</span> nghệ thuật?
            </h1>
            <p className="text-lg text-black/60 mb-12 max-w-2xl mx-auto">
              Tham gia cộng đồng đấu giá nghệ thuật tại ArtChain. Chỉ với một tài khoản đấu giá, bạn có thể tham gia đấu giá trực tiếp các tác phẩm từ những nghệ sĩ tài năng nhất.
            </p>
            
            <button 
              onClick={() => setShowTerms(true)}
              className="bg-[#1a1a1a] text-white px-10 py-5 rounded-full font-bold text-sm uppercase tracking-widest hover:bg-[#f07d44] transition-all flex items-center gap-3 mx-auto shadow-2xl"
            >
              Trở thành người đấu giá <ArrowRight size={20} />
            </button>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 text-left">
            <div className="bg-white/50 backdrop-blur-sm p-8 rounded-sm border border-white/20">
              <div className="w-10 h-10 bg-[#f07d44] text-white rounded-full flex items-center justify-center font-bold mb-4">1</div>
              <h3 className="font-bold uppercase tracking-wider mb-2">Đăng ký ví</h3>
              <p className="text-sm opacity-60">Tạo ví ArtChain để quản lý số dư và tham gia đấu giá an toàn.</p>
            </div>
            <div className="bg-white/50 backdrop-blur-sm p-8 rounded-sm border border-white/20">
              <div className="w-10 h-10 bg-[#f07d44] text-white rounded-full flex items-center justify-center font-bold mb-4">2</div>
              <h3 className="font-bold uppercase tracking-wider mb-2">Nạp tiền</h3>
              <p className="text-sm opacity-60">Nạp tiền vào ví để có thể đặt giá cho những tác phẩm bạn yêu thích.</p>
            </div>
            <div className="bg-white/50 backdrop-blur-sm p-8 rounded-sm border border-white/20">
              <div className="w-10 h-10 bg-[#f07d44] text-white rounded-full flex items-center justify-center font-bold mb-4">3</div>
              <h3 className="font-bold uppercase tracking-wider mb-2">Đấu giá & Sở hữu</h3>
              <p className="text-sm opacity-60">Tham gia phiên đấu giá trực tiếp và nhận tác phẩm nghệ thuật tận nơi.</p>
            </div>
          </div>
        </main>

        <AnimatePresence>
          {showTerms && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowTerms(false)}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl relative z-10 flex flex-col max-h-[90vh]"
              >
                <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-[#1a1a1a] text-white text-center">
                  <div>
                    <h2 className="text-2xl font-black uppercase tracking-tighter">Điều khoản & Điều kiện</h2>
                    <p className="text-[10px] uppercase tracking-widest opacity-50 mt-1">Vui lòng đọc kỹ trước khi bắt đầu</p>
                  </div>
                  <button onClick={() => setShowTerms(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors text-white">
                    <X size={24} />
                  </button>
                </div>
                
                <div className="p-8 overflow-y-auto flex-1 text-sm leading-relaxed space-y-6">
                  <section>
                    <h4 className="font-bold text-[#f07d44] uppercase mb-2">1. Quy định chung</h4>
                    <p>Bằng việc đăng ký tài khoản đấu giá, bạn đồng ý tuân thủ tất cả các quy định về đấu giá tại ArtChain. Các giao dịch đấu giá là thỏa thuận ràng buộc về mặt pháp lý.</p>
                  </section>
                  
                  <section>
                    <h4 className="font-bold text-[#f07d44] uppercase mb-2">2. Quy tắc đặt giá</h4>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Mỗi bước giá phải lớn hơn giá hiện tại ít nhất bằng mức quy định (Bước giá).</li>
                      <li>Sau khi xác nhận đặt giá, bạn không thể hủy hoặc rút lại giá đã đặt.</li>
                      <li>Người đặt giá cao nhất tại thời điểm kết thúc phiên đấu giá sẽ là người thắng cuộc.</li>
                    </ul>
                  </section>
                  
                  <section>
                    <h4 className="font-bold text-[#f07d44] uppercase mb-2">3. Thanh toán & Nhận tác phẩm</h4>
                    <p>Người thắng cuộc có trách nhiệm thanh toán toàn bộ số tiền trúng đấu giá trong vòng 48 giờ. Tác phẩm sẽ được vận chuyển sau khi ArtChain xác nhận đã nhận đủ thanh toán.</p>
                  </section>

                  <section>
                    <h4 className="font-bold text-[#f07d44] uppercase mb-2">4. Trách nhiệm người dùng</h4>
                    <p>Bạn chịu trách nhiệm bảo mật thông tin tài khoản và mọi hoạt động diễn ra dưới tài khoản của mình. ArtChain có quyền đình chỉ tài khoản nếu phát hiện hành vi gian lận hoặc vi phạm quy định.</p>
                  </section>
                </div>

                <div className="p-8 border-t border-gray-100 flex flex-col md:flex-row gap-4">
                  <button 
                    onClick={() => setShowTerms(false)}
                    className="flex-1 px-8 py-4 rounded-xl font-bold text-xs uppercase tracking-widest border border-gray-200 hover:bg-gray-50 transition-all text-center"
                  >
                    Hủy bỏ
                  </button>
                  <button 
                    onClick={handleBecomeBidder}
                    disabled={isCreatingWallet}
                    className="flex-1 bg-[#1a1a1a] text-white px-8 py-4 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-[#f07d44] transition-all flex items-center justify-center gap-2 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isCreatingWallet ? (
                      <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    ) : (
                      <>Tôi đã đọc và đồng ý <Check size={18} /></>
                    )}
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <footer className="py-20 px-[5%] text-center border-t border-black/5 opacity-30">
          <p className="text-[10px] font-bold uppercase tracking-[0.5em]">© 2026 NÉT VẼ ƯỚC MƠ — BỘ SƯU TẬP TÁC PHẨM</p>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#eae6e0] text-[#1a1a1a] font-sans selection:bg-[#f07d44] selection:text-white relative">

      <HeaderWrapper />
      
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

      {/* Hero Section */}
      <section id="section-01" className="relative pt-40 pb-20 px-[5%] max-w-[1600px] mx-auto grid grid-cols-12 gap-6 min-h-[90vh]">
        <div className="col-span-12 lg:col-span-1 hidden lg:block relative">
           <p className={getNumberStyle('section-01')}>01</p>
        </div>

        <motion.div 
          className="col-span-12 lg:col-span-7 relative z-10"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1 
            variants={itemVariants}
            className="text-[12vw] lg:text-[8rem] font-black leading-[0.85] tracking-tighter uppercase mb-8"
          >
            Art <br /> 
            <span className="ml-[10%] text-[#f07d44]">Auction</span> <br />
            2026
          </motion.h1>
          <motion.div variants={itemVariants} className="max-w-xs ml-auto lg:mr-20">
            <p className="text-xs uppercase tracking-[0.2em] font-bold mb-4 opacity-40">Giới thiệu phiên đấu giá</p>
            <p className="text-sm leading-relaxed opacity-70 italic">
              "Nơi hội tụ những kiệt tác nghệ thuật đương đại. Sàn đấu giá uy tín, minh bạch, kết nối nhà sưu tập và nghệ sĩ tài năng."
            </p>
          </motion.div>
        </motion.div>

        <motion.div 
          className="col-span-12 lg:col-span-4 mt-10 lg:mt-0"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <div className="relative aspect-[3/4] lg:aspect-auto lg:h-[600px] overflow-hidden shadow-2xl">
            <img 
              src="https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=1000" 
              className="w-full h-full object-cover"
              alt="Main Art"
            />
          </div>
        </motion.div>
      </section>

      {/* Live Bidding Section (Section 02) */}
      <section id="section-02" className="py-24 px-[5%] max-w-[1600px] mx-auto mb-20 relative min-h-[90vh]">
        <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 lg:col-span-1 hidden lg:block relative">
                <p className={getNumberStyle('section-02')}>02</p>
            </div>

            <div className="col-span-12 lg:col-span-11">
                <motion.div 
                  className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={containerVariants}
                >
                  <motion.div variants={itemVariants}>
                    <h2 className="text-5xl lg:text-6xl font-black uppercase tracking-tighter leading-none">Đấu giá trực tiếp</h2>
                    <p className="text-sm opacity-60 mt-4 max-w-sm uppercase tracking-widest font-bold">Tham gia đặt giá ngay cho các tác phẩm đang diễn ra</p>
                  </motion.div>
                  <motion.div variants={itemVariants} className="flex gap-4">
                    <div className="flex gap-2">
                       <button 
                          onClick={() => {
                             const idx = liveItems.findIndex(i => i.id === (activeLiveId || liveItems[0]?.id));
                             const newIdx = (liveItems.length + idx - 1) % liveItems.length;
                             setActiveLiveId(liveItems[newIdx].id);
                          }}
                          className="p-2 border border-black/10 hover:bg-black/5 transition-colors rounded-full"
                       >
                          <ArrowLeft size={20} />
                       </button>
                       <button 
                          onClick={() => {
                             const idx = liveItems.findIndex(i => i.id === (activeLiveId || liveItems[0]?.id));
                             const newIdx = (idx + 1) % liveItems.length;
                             setActiveLiveId(liveItems[newIdx].id);
                          }}
                          className="p-2 border border-black/10 hover:bg-black/5 transition-colors rounded-full"
                       >
                          <ArrowRight size={20} />
                       </button>
                    </div>
                  </motion.div>
                </motion.div>

                <div className="relative">
                {isLoading ? (
                  <div className="bg-white h-[400px] animate-pulse shadow-sm" />
                ) : liveItems.length === 0 ? (
                  <div className="py-20 text-center border-2 border-dashed border-gray-200">
                    <p className="text-sm font-bold uppercase text-gray-400">Hiện chưa có phiên đấu giá</p>
                  </div>
                ) : (
                  <AnimatePresence mode="wait">
                    {liveItems.filter(item => item.id === (activeLiveId || liveItems[0].id)).map((item) => (
                      <motion.div 
                        key={item.id} 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.4 }}
                        className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center"
                      >
                        <div className="lg:col-span-7 relative group">
                            <div className="aspect-video overflow-hidden shadow-md bg-gray-100">
                              <img src={item.img} className="w-full h-full object-cover" alt={item.title} />
                            </div>
                            <div className="absolute top-4 left-4 bg-red-500 text-white text-[10px] font-bold px-3 py-1 animate-pulse">LIVE</div>
                        </div>

                        <div className="lg:col-span-5">
                            <h3 className="text-4xl font-black uppercase italic leading-none mb-4">{item.title}</h3>
                            <p className="text-[#f07d44] font-bold uppercase tracking-widest text-xs mb-10">{item.artist}</p>

                            <div className="grid grid-cols-2 gap-10 mb-12">
                              <div>
                                  <p className="text-[10px] uppercase font-bold opacity-40 tracking-[0.2em] mb-2">Giá hiện tại</p>
                                  <p className="text-3xl font-black">{item.bid}</p>
                              </div>
                              <div>
                                  <p className="text-[10px] uppercase font-bold opacity-40 tracking-[0.2em] mb-2">Thời gian</p>
                                  <p className="text-3xl font-black flex items-center gap-2"><Timer size={24} className="opacity-20" /> {item.time}</p>
                              </div>
                            </div>

                            <Link href={`/auction/${item.id}`}>
                              <button className="w-full bg-[#1a1a1a] text-white py-5 font-bold text-xs uppercase tracking-[0.3em] hover:bg-[#f07d44] transition-all flex items-center justify-center gap-3">
                                  Đấu giá ngay <Gavel size={16} />
                              </button>
                            </Link>
                            <p className="mt-6 text-[11px] opacity-40 font-bold uppercase tracking-wider">
                              {item.watchers} người đang theo dõi lô tranh này
                            </p>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                )}
                </div>
            </div>
        </div>
      </section>

      {/* Collection Section (Section 03) */}
      <section id="section-03" className="py-24 px-[5%] max-w-[1600px] mx-auto mb-20 relative min-h-[90vh]">
        <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 lg:col-span-1 hidden lg:block relative">
                <p className={getNumberStyle('section-03')}>03</p>
            </div>

            <motion.div 
              className="col-span-12 lg:col-span-11 bg-white shadow-sm p-8 lg:p-16"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={containerVariants}
            >
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                  <motion.div variants={itemVariants} className="max-w-xl">
                      <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#f07d44] mb-4 block">Phiên đấu giá được đề xuất</span>
                      <h2 className="text-5xl lg:text-6xl font-black uppercase tracking-tighter leading-none">
                        {featuredItem?.title || "Sàn Đấu Giá"}
                      </h2>
                  </motion.div>
                  <motion.div variants={itemVariants}>
                    <Link href="/auction/list">
                      <button className="flex items-center gap-2 font-bold text-sm uppercase tracking-widest pb-2 border-b-2 border-[#f07d44] hover:gap-4 transition-all">
                          Xem tất cả <ArrowRight size={16} />
                      </button>
                    </Link>
                  </motion.div>
                </div>

                <div className="flex flex-col gap-16">
                  {featuredAuction ? (
                    <>
                      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                          <div className="md:col-span-8 group">
                          <Link href={`/auction/${featuredAuction.auctionId}`}>
                            <div className="relative aspect-[21/9] overflow-hidden bg-gray-100 shadow-md">
                                <img 
                                  src={featuredItem?.img} 
                                  className="w-full h-full object-cover group-hover:scale-105 transition duration-1000"
                                  alt={featuredItem?.paintingTitle}
                                />
                                <div className="absolute top-6 left-6 flex gap-2">
                                  <div className="bg-red-500 text-white text-[10px] font-bold px-3 py-1 animate-pulse shadow-lg">LIVE</div>
                                  <div className="bg-white/90 backdrop-blur px-3 py-1 text-[10px] font-bold flex items-center gap-1 shadow-sm text-black">
                                      <Timer size={12} /> {featuredItem?.time}
                                  </div>
                                </div>
                            </div>
                          </Link>
                          <div className="mt-8">
                              <h3 className="text-4xl font-black uppercase italic leading-none mb-3 line-clamp-1">{featuredItem?.paintingTitle}</h3>
                              <p className="text-sm opacity-60 leading-relaxed font-black uppercase tracking-widest text-[#f07d44]">{featuredItem?.artist}</p>
                          </div>
                          </div>

                          <div className="md:col-span-4 flex flex-col justify-end h-full">
                            <div className="bg-[#1a1a1a] text-white p-10 flex flex-col justify-between aspect-square md:aspect-auto md:h-full shadow-xl">
                                <div>
                                <p className="text-[10px] font-bold opacity-40 uppercase tracking-widest mb-4">Thông tin phiên đấu giá</p>
                                <p className="text-sm opacity-80 leading-relaxed text-balance line-clamp-4">{featuredAuction.description || "Phiên đấu giá nghệ thuật đương đại quy tụ những tác phẩm xuất sắc nhất từ các nghệ sĩ tài năng."}</p>
                                </div>
                                <div className="mt-10">
                                <p className="text-[10px] font-bold opacity-40 uppercase tracking-widest mb-1 text-[#f07d44]">Giá hiện tại cao nhất</p>
                                <p className="text-3xl font-black">{featuredItem?.bid}</p>
                                </div>
                            </div>
                          </div>
                      </motion.div>

                      {featuredAuction.auctionPaintings && featuredAuction.auctionPaintings.length > 1 && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                            {featuredAuction.auctionPaintings.slice(1, 4).map((ap: any, i: number) => (
                              <motion.div key={ap.auctionPaintingId} variants={itemVariants}>
                                <Link href={`/auction/${featuredAuction.auctionId}`} className="group flex flex-col">
                                    <div className="aspect-video overflow-hidden mb-6 shadow-md relative bg-gray-50">
                                      <img 
                                          src={ap.painting?.imageUrl || "https://images.unsplash.com/photo-1501472312651-726afe119ff1?q=80&w=800"} 
                                          className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                                          alt={ap.painting?.title}
                                      />
                                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                                          <div className="bg-white p-4 shadow-xl text-black"><ArrowUpRight size={20} /></div>
                                      </div>
                                    </div>
                                    <div className="px-2">
                                      <div className="flex justify-between items-start mb-2">
                                          <h4 className="text-lg font-black uppercase tracking-tight line-clamp-1">{ap.painting?.title}</h4>
                                      </div>
                                      <p className="text-[10px] font-bold opacity-40 uppercase tracking-widest mb-1 text-black">Giá hiện tại</p>
                                      <p className="text-2xl font-black text-[#f07d44]">{formatVnd(ap.currentBid || ap.basePrice)}</p>
                                    </div>
                                </Link>
                              </motion.div>
                            ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="py-20 text-center bg-gray-50 border-2 border-dashed border-gray-200">
                      <p className="text-sm font-bold uppercase text-gray-400">Không có dữ liệu phiên đấu giá diễn ra</p>
                    </div>
                  )}
                </div>
            </motion.div>
        </div>
      </section>

      <footer className="py-20 px-[5%] text-center border-t border-black/5 opacity-30">
          <p className="text-[10px] font-bold uppercase tracking-[0.5em]">© 2026 NÉT VẼ ƯỚC MƠ — BỘ SƯU TẬP TÁC PHẨM</p>
      </footer>
    </div>
  );
}