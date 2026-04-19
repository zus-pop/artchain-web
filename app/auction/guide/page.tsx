"use client";

import React, { useState, useEffect } from 'react';
import { HeaderWrapper } from '@/components/sections/HeaderWrapper';
import { motion } from 'framer-motion';
import { 
  IconUserCheck, 
  IconGavel, 
  IconCreditCard, 
  IconTruck, 
  IconCircleCheck,
  IconChevronRight,
  IconInfoCircle,
  IconQuestionMark
} from '@tabler/icons-react';

export default function AuctionGuidePage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const steps = [
    {
      title: "Đăng ký & Xác thực",
      description: "Tạo tài khoản và cập nhật thông tin cá nhân. Để tham gia đấu giá, bạn cần đảm bảo ví nội bộ có đủ số dư tối thiểu hoặc thực hiện nạp tiền.",
      icon: <IconUserCheck size={32} />,
      color: "blue"
    },
    {
      title: "Tìm kiếm & Đặt giá",
      description: "Khám phá danh mục các tác phẩm đang diễn ra. Bạn có thể đặt giá thủ công hoặc sử dụng tính năng đặt giá tối đa. Hệ thống sẽ khóa một khoản tiền tương ứng khi bạn là người dẫn đầu.",
      icon: <IconGavel size={32} />,
      color: "orange"
    },
    {
      title: "Thắng cuộc & Thanh toán",
      description: "Khi phiên kết thúc và bạn là người trả giá cao nhất, hệ thống sẽ tự động chuyển trạng thái đơn hàng. Bạn cần xác nhận nhận hàng trong vòng 24 giờ.",
      icon: <IconCreditCard size={32} />,
      color: "green"
    },
    {
      title: "Kiểm định & Vận chuyển",
      description: "Tác phẩm sẽ được chuyên gia kiểm định chất lượng và niêm phong. Sau đó, đơn vị vận chuyển chuyên dụng sẽ giao tới tận tay bạn.",
      icon: <IconTruck size={32} />,
      color: "purple"
    },
    {
      title: "Hoàn tất & Sở hữu",
      description: "Sau khi nhận hàng và kiểm tra tính nguyên vẹn, bạn xác nhận trên hệ thống. Chúc mừng bạn đã sở hữu một kiệt tác nghệ thuật!",
      icon: <IconCircleCheck size={32} />,
      color: "emerald"
    }
  ];

  return (
    <div className="min-h-screen bg-[#fcfbf9] text-[#1a1a1a] font-sans selection:bg-[#f07d44] selection:text-white">
      <HeaderWrapper />
      
      <main className="pt-32 pb-20 px-[5%] max-w-5xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-[#f07d44]/10 text-[#f07d44] px-4 py-2 rounded-full mb-6"
          >
            <IconInfoCircle size={18} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Cẩm nang người sưu tầm</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-6xl font-black uppercase tracking-tighter leading-none mb-8"
          >
            Hướng dẫn <br /> <span className="text-[#f07d44]">Tham gia đấu giá</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-black/60 max-w-2xl mx-auto italic"
          >
            "Quy trình đấu giá tại ArtChain được thiết kế để đảm bảo tính minh bạch, an toàn và tinh tế nhất cho các nhà sưu tập."
          </motion.p>
        </div>

        {/* Step by Step Guide */}
        <div className="relative space-y-12 mb-32">
           {/* Line connection (Desktop) */}
           <div className="absolute left-[39px] top-10 bottom-10 w-[2px] bg-black/5 hidden md:block"></div>

           {steps.map((step, index) => (
             <motion.div 
               key={index}
               initial={{ opacity: 0, x: -20 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true }}
               transition={{ delay: index * 0.1 }}
               className="relative flex flex-col md:flex-row gap-8 md:items-start group"
             >
                {/* Icon Circle */}
                <div className="relative z-10 w-20 h-20 shrink-0 bg-white border border-black/5 shadow-sm rounded-sm flex items-center justify-center text-black/40 group-hover:text-[#f07d44] group-hover:border-[#f07d44]/30 transition-all duration-500">
                   {step.icon}
                   <div className="absolute -top-2 -right-2 w-7 h-7 bg-[#1a1a1a] text-white text-[10px] font-black flex items-center justify-center rounded-lg">
                      0{index + 1}
                   </div>
                </div>

                {/* Content */}
                <div className="flex-1 bg-white p-8 rounded-3xl border border-black/5 hover:shadow-xl hover:shadow-black/5 transition-all duration-500">
                   <h3 className="text-xl font-black uppercase tracking-tight mb-4 flex items-center gap-2">
                      {step.title}
                      <IconChevronRight size={18} className="opacity-20 group-hover:translate-x-1 group-hover:opacity-100 transition-all" />
                   </h3>
                   <p className="text-black/60 leading-relaxed text-sm md:text-base">
                      {step.description}
                   </p>
                </div>
             </motion.div>
           ))}
        </div>

        {/* Support Banner */}
        <motion.div 
           initial={{ opacity: 0, scale: 0.95 }}
           whileInView={{ opacity: 1, scale: 1 }}
           viewport={{ once: true }}
           className="bg-[#1a1a1a] text-white p-12 rounded-[40px] relative overflow-hidden text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-8"
        >
           <div className="relative z-10 max-w-md">
              <h2 className="text-3xl font-black uppercase tracking-tighter mb-4">Bạn vẫn còn <span className="text-[#f07d44]">thắc mắc?</span></h2>
              <p className="text-white/40 text-sm leading-relaxed mb-8 italic">
                 Nếu bạn cần hỗ trợ về kỹ thuật hoặc có câu hỏi về tác phẩm, đừng ngần ngại liên hệ với chuyên viên của chúng tôi.
              </p>
              <button className="bg-[#f07d44] text-white px-8 py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-orange-600 transition-all">
                 Liên hệ hỗ trợ
              </button>
           </div>
           
           <div className="relative z-10 w-40 h-40 bg-white/5 backdrop-blur-xl rounded-sm border border-white/10 flex items-center justify-center">
              <IconQuestionMark size={80} className="text-[#f07d44] opacity-50" />
           </div>

           {/* Decor */}
           <div className="absolute -top-10 -right-10 w-60 h-60 bg-[#f07d44] rounded-full blur-[100px] opacity-20"></div>
        </motion.div>
      </main>

      <footer className="py-20 px-[5%] text-center border-t border-black/5 opacity-30 mt-20">
         <p className="text-[10px] font-bold uppercase tracking-[0.5em]">© 2026 NÉT VẼ ƯỚC MƠ — NÂNG TẦM TRẢI NGHIỆM NGHỆ THUẬT</p>
      </footer>
    </div>
  );
}
