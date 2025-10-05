"use client";

import React from "react";
import Link from "next/link";
import { useGetContests } from "@/apis/contests";
import { Trophy } from "lucide-react";

const ContestShowcase = () => {
  // Get active contests from API
  const { data: contests, isLoading, error } = useGetContests("ACTIVE");

  // --- HÀM MÀU MỚI ---
  // Cung cấp một bộ màu hoàn chỉnh cho mỗi thẻ dựa trên index
  const getContestColors = (index: number) => {
    const colorSchemes = [
      {
        bg: "bg-purple-500",
        accent: "bg-purple-400",
        shadow: "shadow-purple-400",
        button: "bg-purple-600 hover:bg-purple-400",
      },
      {
        bg: "bg-blue-500",
        accent: "bg-blue-400",
        shadow: "shadow-blue-400",
        button: "bg-blue-600 hover:bg-blue-400",
      },
      {
        bg: "bg-green-500",
        accent: "bg-green-400",
        shadow: "shadow-green-400",
        button: "bg-green-600 hover:bg-green-400",
      },
      {
        bg: "bg-rose-500",
        accent: "bg-rose-400",
        shadow: "shadow-rose-400",
        button: "bg-rose-600 hover:bg-rose-400",
      },
    ];
    return colorSchemes[index % colorSchemes.length];
  };

  if (isLoading) {
    // Giữ nguyên giao diện loading
    return (
      <div className="w-full py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Cuộc Thi <span className="text-blue-400">Đang Diễn Ra</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-3xl p-6 animate-pulse">
                <div className="h-6 bg-gray-700 rounded mb-4"></div>
                <div className="h-4 bg-gray-700 rounded mb-2"></div>
                <div className="h-3 bg-gray-700 rounded mb-4"></div>
                <div className="h-10 bg-gray-700 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    // Giữ nguyên giao diện lỗi
    return (
      <div className="w-full py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Cuộc Thi <span className="text-blue-400">Đang Diễn Ra</span>
          </h2>
          <p className="text-red-400">Có lỗi xảy ra khi tải dữ liệu cuộc thi</p>
        </div>
      </div>
    );
  }

  // Show only first 3 contests for showcase
  const displayContests = contests?.slice(0, 2) || [];

  return (
    <div className="w-full py-20 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-800">
            Cuộc Thi <span className="text-red-500">Đang Diễn Ra</span>
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Tham gia ngay các cuộc thi hấp dẫn và thể hiện tài năng nghệ thuật của bạn
          </p>
        </div>

        {/* --- KHỐI THẺ CUỘC THI ĐÃ ĐƯỢC CẬP NHẬT --- */}
        {displayContests.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {displayContests.map((contest, index) => {
              const colors = getContestColors(index); // Lấy bộ màu cho thẻ hiện tại
              return (
                <div
                  key={contest.contestId}
                  className={`group flex flex-col justify-between gap-4 min-h-[240px] duration-500 relative rounded-lg p-5 hover:-translate-y-2 hover:shadow-xl ${colors.bg} ${colors.shadow}`}
                >
                  {/* Khối trang trí ở góc */}
                  <div
                    className={`absolute duration-700 shadow-md group-hover:-translate-y-4 group-hover:-translate-x-4 -bottom-10 -right-10 w-1/2 h-1/2 rounded-lg ${colors.accent}`}
                  />
                  
                  {/* Nội dung thẻ */}
                  <div className="z-10">
                    <h3 className="text-2xl font-bold mb-2 text-white">
                      {contest.title}
                    </h3>
                    <p className="text-gray-200 line-clamp-3">
                      {contest.description}
                    </p>
                  </div>
                  
                  {/* Nút hành động */}
                  <Link
                    href={`/contests/${contest.contestId}`}
                    className={`z-10 w-fit text-white font-semibold rounded p-2 px-6 transition-colors duration-200 ${colors.button}`}
                  >
                    Xem Chi Tiết
                  </Link>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <Trophy className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              Chưa có cuộc thi nào đang diễn ra
            </h3>
            <p className="text-gray-400">
              Hãy theo dõi để không bỏ lỡ các cuộc thi sắp tới
            </p>
          </div>
        )}

        {/* View All Button */}
        <div className="text-center mt-16">
          <Link
            href="/contests"

          >
            <button className="group group-hover:before:duration-500 group-hover:after:duration-500 after:duration-500 hover:border-rose-300 hover:before:[box-shadow:_20px_20px_20px_30px_#a21caf] duration-500 before:duration-500 hover:duration-500 underline underline-offset-2 hover:after:-right-8 hover:before:right-12 hover:before:-bottom-8 hover:before:blur hover:underline hover:underline-offset-4 origin-left hover:decoration-2 hover:text-rose-300 relative bg-neutral-800 h-16 w-64 border text-left p-3 text-gray-50 text-base font-bold rounded-lg overflow-hidden before:absolute before:w-12 before:h-12 before:content[''] before:right-1 before:top-1 before:z-10 before:bg-violet-500 before:rounded-full before:blur-lg after:absolute after:z-10 after:w-20 after:h-20 after:content[''] after:bg-rose-300 after:right-8 after:top-3 after:rounded-full after:blur-lg">
            Xem Thêm
    </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ContestShowcase;