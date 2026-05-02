"use client";

import React from "react";
import ImageSlider from "@/components/ImageSlider";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

const ExhibitionCTA = () => {
  return (
    <div className="max-w-7xl mx-auto py-12">
      <div className="bg-[#f8f7f4] rounded-[2.5rem] overflow-hidden flex flex-col lg:flex-row items-center p-8 lg:p-16 gap-16 border border-[#e6e2da] shadow-sm">
        {/* Left Content */}
        <div className="flex-1 space-y-8">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-[#423137]/60 font-medium leading-relaxed max-w-xl"
          >
            Khám phá những tác phẩm nghệ thuật kỹ thuật số độc bản và trải
            nghiệm không gian triển lãm 3D sống động. Cùng ArtChain kiến tạo một
            tương lai bền vững cho nghệ thuật Việt.
          </motion.p>
        </div>

        {/* Right Staggered Image Grid */}
        <div className="flex-1 w-full flex items-center justify-center gap-4 h-[400px]">
          <div className="flex flex-col gap-4 mt-12">
            <div className="relative w-[150px] sm:w-[180px] h-[100px] sm:h-[120px] rounded-2xl overflow-hidden shadow-lg">
              <Image
                src="https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?auto=format&fit=crop&q=80&w=400"
                alt="Art"
                fill
                className="object-cover"
              />
            </div>
            <div className="relative w-[150px] sm:w-[180px] h-[220px] sm:h-[280px] rounded-2xl overflow-hidden shadow-lg">
              <Image
                src="https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?auto=format&fit=crop&q=80&w=400"
                alt="Art"
                fill
                className="object-cover"
              />
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div className="relative w-[150px] sm:w-[180px] h-[260px] sm:h-[320px] rounded-2xl overflow-hidden shadow-lg">
              <Image
                src="https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&q=80&w=400"
                alt="Art"
                fill
                className="object-cover"
              />
            </div>
            <div className="relative w-[150px] sm:w-[180px] h-[150px] sm:h-[180px] rounded-2xl overflow-hidden shadow-lg">
              <Image
                src="https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&q=80&w=400"
                alt="Art"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ExhibitionPage = () => {
  return (
    <div className="min-h-screen pt-32 pb-24 w-full bg-[#EAE6E0] px-4 sm:px-8 lg:px-16">
      <div className="max-w-7xl mx-auto">
        {/* Page Header (Campaign Style Layout) */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-[#423137] leading-[1.1] tracking-tight">
              Sẵn sàng khám phá <br />
              không gian <span className="text-[#FF6E1A]">Triển lãm</span>?
            </h1>
          </motion.div>
        </div>

        {/* Section dưới giữ nguyên */}
        {/* <ExhibitionCTA /> */}
        <div className="mt-12">
          <ImageSlider />
        </div>
      </div>
    </div>
  );
};

export default ExhibitionPage;
