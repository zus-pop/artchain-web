"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import Lottie from 'lottie-react';
import { IconTrophy, IconConfetti, IconArrowRight, IconHome } from '@tabler/icons-react';
import { HeaderWrapper } from '@/components/sections/HeaderWrapper';
import congratulationAnimation from '@/public/load/congratulation.json';

export default function CongratulationPage() {
  const [mounted, setMounted] = useState(false);
  const [showLottie, setShowLottie] = useState(true);

  const [winningData, setWinningData] = useState<any>(null);

  useEffect(() => {
    setMounted(true);
    // Move dynamic data generation here to avoid hydration mismatch
    setWinningData({
      paintingTitle: "Vũ điệu của ánh sáng",
      artist: "Trần Thế Vinh",
      finalBid: 25400000,
      imageUrl: "https://images.unsplash.com/photo-1549490349-8643362247b5?q=80&w=1500",
      auctionTitle: "Phiên đấu giá tranh phong cảnh đương đại 2026",
      transactionId: "ART-2026-X892",
      date: new Date().toLocaleDateString('vi-VN', { 
        day: '2-digit', 
        month: 'long', 
        year: 'numeric' 
      })
    });
  }, []);

  const formatVnd = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#fcfbf9] text-[#1a1a1a] font-sans selection:bg-[#f07d44] selection:text-white overflow-x-hidden">
      <HeaderWrapper />
      
      <main className="relative pt-32 pb-20 px-[5%] max-w-[1400px] mx-auto min-h-screen flex flex-col items-center justify-center">
        
        {/* Background Confetti Elements (CSS Animated) */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden h-full w-full">
           {Array.from({ length: 40 }).map((_, i) => (
             <div 
               key={i}
               className="absolute animate-confetti-fall"
               style={{
                 top: `-20px`,
                 left: `${Math.random() * 100}%`,
                 width: `${Math.random() * 10 + 5}px`,
                 height: `${Math.random() * 10 + 5}px`,
                 backgroundColor: ['#f07d44', '#ffcc00', '#44aaff', '#55bb44', '#ff66aa'][Math.floor(Math.random() * 5)],
                 borderRadius: Math.random() > 0.5 ? '50%' : '0%',
                 animationDelay: `${Math.random() * 5}s`,
                 animationDuration: `${Math.random() * 3 + 2}s`,
                 opacity: 0.6,
                 transform: `rotate(${Math.random() * 360}deg)`
               }}
             />
           ))}
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative z-10 w-full max-w-4xl bg-white shadow-[0_40px_100px_-20px_rgba(0,0,0,0.15)] rounded-sm overflow-hidden grid grid-cols-1 lg:grid-cols-2"
        >
          {/* Left Column: Visuals */}
          <div className="bg-[#1a1a1a] p-12 flex flex-col justify-between text-white relative overflow-hidden h-full min-h-[400px]">
            <div className="relative z-10">
               <motion.div
                 initial={{ y: 20, opacity: 0 }}
                 animate={{ y: 0, opacity: 1 }}
                 transition={{ delay: 0.3 }}
                 className="inline-flex items-center gap-2 bg-white/10 backdrop-blur px-4 py-2 rounded-full border border-white/20 mb-8"
               >
                 <IconTrophy size={18} className="text-[#f07d44]" />
                 <span className="text-[10px] font-bold uppercase tracking-widest">Đấu giá thành công</span>
               </motion.div>
               
               <motion.h1 
                 initial={{ y: 20, opacity: 0 }}
                 animate={{ y: 0, opacity: 1 }}
                 transition={{ delay: 0.4 }}
                 className="text-5xl font-black uppercase tracking-tighter leading-none mb-6"
               >
                 Chúc mừng <br /> <span className="text-[#f07d44]">Quý khách!</span>
               </motion.h1>
               
               <motion.p 
                 initial={{ y: 20, opacity: 0 }}
                 animate={{ y: 0, opacity: 1 }}
                 transition={{ delay: 0.5 }}
                 className="text-sm opacity-60 leading-relaxed max-w-xs"
               >
                 Bạn đã giành được tác phẩm tuyệt vời này. Chúng tôi rất vinh dự được kết nối bạn với tác phẩm nghệ thuật.
               </motion.p>
            </div>

            <motion.div 
              initial={{ scale: 1.1, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.3 }}
              transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
              className="absolute -bottom-20 -right-20 pointer-events-none"
            >
               <IconConfetti size={300} stroke={0.5} />
            </motion.div>

            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-20 pt-8 border-t border-white/10 space-y-4"
            >
               <div>
                  <p className="text-[10px] font-bold opacity-30 uppercase tracking-widest mb-1">Mã giao dịch</p>
                  <p className="font-mono text-sm font-bold tracking-wider">{winningData?.transactionId}</p>
               </div>
               <div>
                  <p className="text-[10px] font-bold opacity-30 uppercase tracking-widest mb-1">Ngày mua</p>
                  <p className="text-sm font-bold">{winningData?.date}</p>
               </div>
            </motion.div>
          </div>

          {/* Right Column: Content */}
          <div className="p-8 lg:p-12 flex flex-col justify-center">
             <div className="mb-8">
                <div className="aspect-[4/3] rounded-xl overflow-hidden shadow-lg mb-6 border border-gray-100 relative group">
                   <Image 
                     src={winningData.imageUrl} 
                     alt={winningData.paintingTitle}
                     fill
                     className="object-cover group-hover:scale-105 transition-transform duration-1000"
                   />
                </div>
                <h2 className="text-2xl font-black uppercase tracking-tight mb-2">{winningData?.paintingTitle}</h2>
                <p className="text-sm font-medium text-[#f07d44] uppercase tracking-widest mb-6">Họa sĩ: {winningData?.artist}</p>
                
                <div className="bg-[#fcfbf9] border border-[#e6e2da] p-6 rounded-xl">
                   <div className="flex justify-between items-center mb-2">
                      <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Giá  cuối</span>
                      <span className="bg-green-100 text-green-700 text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter">Winner Bid</span>
                   </div>
                   <p className="text-3xl font-black text-slate-900">{winningData ? formatVnd(winningData.finalBid) : ""}</p>
                </div>
             </div>

             <div className="space-y-3">
                
                <div className="flex gap-3">
                  <Link href="/auction" className="flex-1">
                    <button className="w-full border-2 border-[#e6e2da] py-4 rounded-xl font-black text-[10px] uppercase tracking-widest hover:border-[#f07d44] hover:text-[#f07d44] transition-all flex items-center justify-center gap-2 cursor-pointer">
                       <IconHome size={16} /> Trang chủ
                    </button>
                  </Link>
                  <Link href="/auction/list" className="flex-1">
                    <button className="w-full border-2 border-[#e6e2da] py-4 rounded-xl font-black text-[10px] uppercase tracking-widest hover:border-[#f07d44] hover:text-[#f07d44] transition-all flex items-center justify-center gap-2 cursor-pointer">
                       <IconArrowRight size={16} /> Tiếp tục đấu giá
                    </button>
                  </Link>
                </div>
             </div>
          </div>
        </motion.div>

        {/* Floating Success Indicator */}
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="mt-12 text-center"
        >
           <p className="text-sm font-bold opacity-30 flex items-center gap-2 justify-center italic">
              "Nghệ thuật là ngôn ngữ duy nhất vượt qua mọi ranh giới."
           </p>
        </motion.div>
        
      </main>

      <footer className="py-20 px-[5%] text-center border-t border-black/5 opacity-30">
         <p className="text-[10px] font-bold uppercase tracking-[0.5em]">© 2026 NÉT VẼ ƯỚC MƠ — CHÚC MỪNG CHIẾN THẮNG</p>
      </footer>
      
      <style jsx global>{`
        @keyframes confettiFall {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(100vh) rotate(360deg); }
        }
        .animate-confetti-fall {
          animation: confettiFall linear infinite;
        }
      `}</style>

      <AnimatePresence>
        {showLottie && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowLottie(false)}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
          >
            <motion.div 
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className="w-full max-w-lg flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-full aspect-square">
                <Lottie 
                  animationData={congratulationAnimation} 
                  loop={true} 
                  className="w-full h-full"
                />
              </div>
              <motion.h2 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-white text-5xl font-black uppercase tracking-tighter text-center -mt-10 drop-shadow-2xl"
              >
Xin chúc mừng
              </motion.h2>
              <p className="text-white/60 text-xs uppercase tracking-[0.4em] font-bold mt-4 animate-pulse">
                Bấm vào bên ngoài để tiếp tục
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
