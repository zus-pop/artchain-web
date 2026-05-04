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
  IconQuestionMark,
  IconClock,
  IconTrophy
} from '@tabler/icons-react';

export default function AuctionGuidePage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const steps = [
    {
      title: "Chuẩn bị trước khi đấu giá",
      description: (
        <ul className="list-disc pl-5 space-y-2 mt-2">
          <li>Người dùng cần tham gia phiên đấu giá trước khi đặt giá.</li>
          <li>Phiên phải đang ở trạng thái LIVE thì mới đặt giá được.</li>
          <li>Người dùng cần có ví hoạt động và đủ số dư tối thiểu bằng mức giá muốn đặt.</li>
        </ul>
      ),
      icon: <IconUserCheck size={32} />,
      color: "blue"
    },
    {
      title: "Cách đấu giá trong phiên",
      description: (
        <ul className="list-disc pl-5 space-y-2 mt-2">
          <li>Mỗi thời điểm chỉ có 1 tranh đang LIVE để đấu giá.</li>
          <li>Chỉ được đặt giá cho tranh đang LIVE, không đặt cho tranh khác trong cùng phiên.</li>
          <li>Giá đặt mới phải lớn hơn hoặc bằng giá hiện tại + bước giá.</li>
          <li>Khi đặt giá thành công, hệ thống cập nhật người dẫn đầu và phát realtime cho phòng đấu giá.</li>
        </ul>
      ),
      icon: <IconGavel size={32} />,
      color: "orange"
    },
    {
      title: "Luật giá trần",
      description: (
        <ul className="list-disc pl-5 space-y-2 mt-2">
          <li>Nếu tranh có giá trần, khi người dùng đặt giá đạt hoặc vượt giá trần, hệ thống sẽ phát thông báo realtime.</li>
          <li>Thông báo này chỉ phát 1 lần đầu tiên cho mỗi người dùng trên mỗi tranh.</li>
          <li>Các lần sau cùng người dùng đó tiếp tục đặt &gt;= giá trần sẽ không phát lại thông báo.</li>
        </ul>
      ),
      icon: <IconInfoCircle size={32} />,
      color: "purple"
    },
    {
      title: "Luật gia hạn thời gian (anti-sniping)",
      description: (
        <ul className="list-disc pl-5 space-y-2 mt-2">
          <li>Nếu đặt giá trong 60 giây cuối, thời gian kết thúc tranh được cộng thêm 60 giây.</li>
          <li>Nếu đặt giá đạt/vượt giá trần, thời gian kết thúc tranh được đẩy thành thời điểm hiện tại + 60 giây.</li>
        </ul>
      ),
      icon: <IconClock size={32} />,
      color: "red"
    },
    {
      title: "Kết thúc tranh và xác định thắng",
      description: (
        <ul className="list-disc pl-5 space-y-2 mt-2">
          <li>Khi hết thời gian của tranh LIVE, tranh được chuyển trạng thái END.</li>
          <li>Nếu có người dẫn đầu, người đó là người thắng tranh.</li>
          <li>Nếu không có người dẫn đầu, tranh được mở lại trạng thái bán phù hợp theo nghiệp vụ.</li>
        </ul>
      ),
      icon: <IconTrophy size={32} />,
      color: "yellow"
    },
    {
      title: "Thanh toán sau đấu giá",
      description: (
        <ul className="list-disc pl-5 space-y-2 mt-2">
          <li>Hệ thống trừ tiền ví người thắng khi tranh kết thúc hoặc khi phiên bị kết thúc thủ công.</li>
          <li>Có cơ chế chống trừ tiền trùng cho cùng 1 tranh.</li>
          <li>Nếu ví người thắng không đủ số dư tại thời điểm chốt, hệ thống sẽ báo lỗi xử lý thanh toán.</li>
        </ul>
      ),
      icon: <IconCreditCard size={32} />,
      color: "green"
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
