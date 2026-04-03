"use client";

import React, { useState, useEffect } from 'react';
import { HeaderWrapper } from '@/components/sections/HeaderWrapper';
import { motion } from 'framer-motion';
import { 
  IconGavel, 
  IconWallet, 
  IconClock, 
  IconShieldCheck, 
  IconAlertCircle,
  IconGavel as IconLegal,
  IconFileCertificate,
  IconScale
} from '@tabler/icons-react';

export default function AuctionRulesPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const ruleSections = [
    {
      title: "1. Nguyên tắc thanh toán qua ví nội bộ",
      content: [
        "Nền tảng không sử dụng hình thức thanh toán ngoài cho các bước chốt đơn đấu giá.",
        "Khi người thắng đấu giá được xác định, hệ thống sẽ thực hiện khóa một khoản tiền tương ứng với giá trúng đấu cộng các khoản phí liên quan (nếu có).",
        "Khoản tiền này sẽ được khóa tạm thời trên hệ thống cho tới khi đơn hàng được hoàn tất hoặc hủy theo quy định."
      ],
      icon: <IconWallet size={40} className="text-[#f07d44]" />
    },
    {
      title: "2. Quy trình xác nhận nhận hàng",
      content: [
        "Người thắng đấu giá có nghĩa vụ xác nhận nhận hàng trong vòng 24 giờ kể từ thời điểm hệ thống phát đi thông báo.",
        "Trường hợp quá thời hạn 24 giờ mà không có bất kỳ phản hồi nào, hệ thống có quyền tự động xử lý theo chính sách hủy nhận và áp dụng phí vi phạm.",
        "Sau khi xác nhận, tác phẩm sẽ bước vào giai đoạn kiểm định nghiêm ngặt trước khi vận chuyển."
      ],
      icon: <IconClock size={40} className="text-[#f07d44]" />
    },
    {
      title: "3. Chính sách phí vi phạm & Hủy đơn",
      content: [
        "Nếu người thắng từ chối thực hiện nghĩa vụ mua hàng sau khi đã chốt đấu giá, hệ thống sẽ khấu trừ phí vi phạm quy định.",
        "Mức phí vi phạm mặc định là 12% trên tổng giá trị trúng đấu giá tác phẩm.",
        "Số tiền hoàn lại cho người dùng = Giá trúng đấu - (Giá trúng đấu x 12%) - các chi phí thực tế đã phát sinh (vận chuyển, kiểm định - nếu có)."
      ],
      icon: <IconAlertCircle size={40} className="text-[#f07d44]" />
    },
    {
      title: "4. Kiểm định & Vận chuyển an toàn",
      content: [
        "Mọi tác phẩm trước khi giao tới khách hàng đều được kiểm định bởi chuyên gia và niêm phong bảo mật.",
        "Nếu trong quá trình nhận hàng, tác phẩm bị hư hỏng do vận chuyển hoặc đóng gói, người dùng được quyền khiếu nại và sẽ được hoàn 100% số dư đã khóa.",
        "Người dùng chịu trách nhiệm kiểm tra hiện trạng và quay video mở kiện hàng làm minh chứng."
      ],
      icon: <IconShieldCheck size={40} className="text-[#f07d44]" />
    },
    {
      title: "5. Tranh chấp & Khiếu nại",
      content: [
        "Thời hạn gửi khiếu nại là 72 giờ kể từ thời điểm phát sinh sự kiện hoặc thời điểm nhận hàng thực tế.",
        "Các quyết định cuối cùng sẽ dựa trên dữ liệu hệ thống, chứng từ vận hành và kết quả xác minh thực tế từ các đơn vị liên quan.",
        "Trong mọi trường hợp, sự minh bạch và công bằng cho cộng đồng nghệ thuật là ưu tiên hàng đầu của chúng tôi."
      ],
      icon: <IconScale size={40} className="text-[#f07d44]" />
    }
  ];

  return (
    <div className="min-h-screen bg-[#fcfbf9] text-[#1a1a1a] font-sans selection:bg-[#f07d44] selection:text-white">
      <HeaderWrapper />
      
      <main className="pt-32 pb-20 px-[5%] max-w-6xl mx-auto">
        {/* Legal Header */}
        <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-8 border-b-2 border-black/5 pb-16">
          <div className="max-w-xl">
             <motion.div
               initial={{ opacity: 0, x: -20 }}
               animate={{ opacity: 1, x: 0 }}
               className="flex items-center gap-2 text-[#f07d44] text-[11px] font-black uppercase tracking-[0.4em] mb-4"
             >
                <IconLegal size={16} /> Chính sách pháp lý
             </motion.div>
             
             <motion.h1 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.1 }}
               className="text-5xl md:text-6xl font-black uppercase tracking-tighter leading-none"
             >
               Luật & Điều khoản <br /> <span className="text-[#f07d44]">Đấu giá</span>
             </motion.h1>
          </div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            className="hidden lg:block"
          >
             <IconFileCertificate size={150} stroke={0.5} />
          </motion.div>
        </div>

        {/* Content Section */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
           <div className="md:col-span-4 hidden md:block">
              <div className="sticky top-40 bg-white p-8 rounded-3xl border border-black/5 shadow-sm space-y-6">
                 <p className="text-[10px] font-black uppercase tracking-widest text-black/30 border-b border-black/5 pb-4">Nội dung chính</p>
                 <nav className="flex flex-col gap-4">
                    {ruleSections.map((s, i) => (
                      <button key={i} className="text-left text-sm font-bold opacity-40 hover:opacity-100 hover:text-[#f07d44] transition-all truncate">
                        {s.title}
                      </button>
                    ))}
                 </nav>
                 <div className="pt-6 relative">
                    <p className="text-[10px] font-medium italic opacity-40 leading-relaxed">
                       "Bằng việc xác nhận đặt giá, bạn đồng ý vô điều kiện đối với các chính sách và điều khoản này của ArtChain."
                    </p>
                 </div>
              </div>
           </div>

           <div className="md:col-span-8 space-y-24">
              {ruleSections.map((section, idx) => (
                <motion.section 
                  key={idx}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="relative"
                >
                   <div className="bg-white p-10 md:p-16 rounded-[40px] border border-black/5 hover:border-[#f07d44]/30 transition-all duration-700 shadow-sm hover:shadow-xl hover:shadow-black/5 overflow-hidden group">
                      <div className="absolute top-10 right-10 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-700">
                         {section.icon}
                      </div>

                      <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight mb-10 text-slate-800">
                         {section.title}
                      </h2>
                      
                      <div className="space-y-6">
                         {section.content.map((p, pIdx) => (
                           <div key={pIdx} className="flex gap-4">
                              <span className="w-1.5 h-1.5 bg-[#f07d44] rounded-full mt-2 shrink-0"></span>
                              <p className="text-black/60 leading-relaxed text-sm md:text-base selection:bg-[#f07d44] selection:text-white">
                                 {p}
                              </p>
                           </div>
                         ))}
                      </div>
                   </div>
                </motion.section>
              ))}
           </div>
        </div>

        {/* Footer legal mention */}
        <div className="mt-32 pt-20 border-t border-black/5 text-center">
            <p className="text-[10px] font-black uppercase tracking-[0.5em] opacity-20 italic">
               Phiên bản cập nhật tháng 04/2026 — ArtChain Legal Team
            </p>
        </div>
      </main>

      <footer className="py-20 px-[5%] text-center border-t border-black/5 opacity-30 mt-10">
         <p className="text-[10px] font-bold uppercase tracking-[0.5em]">© 2026 NÉT VẼ XANH — ĐẢM BẢO QUYỀN LỢI NHÀ SƯU TẬP</p>
      </footer>
    </div>
  );
}
