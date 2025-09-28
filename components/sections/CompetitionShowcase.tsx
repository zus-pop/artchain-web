"use client";

import React from "react";
import Link from "next/link";

const CompetitionShowcase = () => {
  const competitions = [
    {
      id: 1,
      title: "Phong Cảnh Thiên Nhiên",
      description: "Vẽ tranh về vẻ đẹp của thiên nhiên Việt Nam",
      deadline: "15/12/2024",
      prize: "50,000,000 VND",
      participants: 234,
      status: "Đang mở",
      bgGradient: "from-green-400 to-blue-500"
    },
    {
      id: 2,
      title: "Chân Dung Người Việt",
      description: "Thể hiện vẻ đẹp con người Việt Nam qua tranh vẽ",
      deadline: "20/12/2024",
      prize: "30,000,000 VND", 
      participants: 189,
      status: "Đang mở",
      bgGradient: "from-purple-400 to-pink-500"
    },
    {
      id: 3,
      title: "Nghệ Thuật Trừu Tượng",
      description: "Sáng tạo không giới hạn với nghệ thuật trừu tượng",
      deadline: "25/12/2024",
      prize: "40,000,000 VND",
      participants: 156,
      status: "Đang mở", 
      bgGradient: "from-yellow-400 to-red-500"
    }
  ];

  return (
    <div className="w-full py-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Cuộc Thi <span className="text-blue-400">Đang Diễn Ra</span>
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Tham gia ngay các cuộc thi hấp dẫn và thể hiện tài năng nghệ thuật của bạn
          </p>
        </div>

        {/* Competition Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {competitions.map((competition) => (
            <div 
              key={competition.id}
              className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-3xl p-6 hover:scale-105 transition-transform duration-300 hover:border-white/20"
            >
              {/* Status Badge */}
              <div className="flex justify-between items-start mb-4">
                <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm font-medium">
                  {competition.status}
                </span>
                <div className="text-right">
                  <p className="text-gray-400 text-sm">Giải thưởng</p>
                  <p className="text-yellow-400 font-bold text-lg">{competition.prize}</p>
                </div>
              </div>

              {/* Competition Info */}
              <h3 className="text-xl font-bold text-white mb-2">
                {competition.title}
              </h3>
              <p className="text-gray-300 mb-4 text-sm leading-relaxed">
                {competition.description}
              </p>

              {/* Stats */}
              <div className="flex justify-between items-center mb-6">
                <div>
                  <p className="text-gray-400 text-sm">Thí sinh tham gia</p>
                  <p className="text-white font-semibold">{competition.participants}</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-400 text-sm">Hạn nộp</p>
                  <p className="text-white font-semibold">{competition.deadline}</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="bg-gray-700 h-2 rounded-full overflow-hidden">
                  <div 
                    className={`h-full bg-gradient-to-r ${competition.bgGradient} rounded-full`}
                    style={{ width: `${Math.min(competition.participants / 3, 100)}%` }}
                  ></div>
                </div>
                <p className="text-gray-400 text-xs mt-1">
                  {Math.floor(competition.participants / 3)}% đã đạt mục tiêu tham gia
                </p>
              </div>

              {/* Action Button */}
              <Link 
                href={`/competitions/${competition.id}`}
                className={`w-full bg-gradient-to-r ${competition.bgGradient} text-white font-semibold py-3 px-6 rounded-xl hover:shadow-lg transition-all duration-200 block text-center`}
              >
                Tham Gia Ngay
              </Link>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link 
            href="/competitions"
            className="inline-flex items-center bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold py-3 px-8 rounded-xl hover:shadow-lg transition-all duration-200"
          >
            Xem Tất Cả Cuộc Thi
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CompetitionShowcase;