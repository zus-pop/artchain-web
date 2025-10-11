"use client";

import React from "react";
import Link from "next/link";
import { useGetContests } from "@/apis/contests";
import { Trophy } from "lucide-react";

const ContestShowcase = () => {
  // Get active contests from API
  const { data: contests, isLoading, error } = useGetContests("ACTIVE");

  if (isLoading) {
  return (
    <div className="w-full py-20 px-4">
      <div className="mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Cuộc Thi <span className="text-red-500]">Đang Diễn Ra</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="bg-[var(--primary)] bg-opacity-90 backdrop-blur-sm border border-white/10 rounded-3xl p-6 animate-pulse relative overflow-hidden"
            >
              <div className="absolute -bottom-8 -right-8 w-1/2 h-1/2 bg-white/10 rounded-xl" />
              <div className="h-6 w-3/4 bg-white/30 rounded mb-4"></div>
              <div className="h-4 w-full bg-white/20 rounded mb-2"></div>
              <div className="h-3 w-5/6 bg-white/20 rounded mb-4"></div>
              <div className="h-10 w-32 bg-white/30 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


  if (error) {
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

  const displayContests = contests?.slice(0, 2) || [];

  return (
    <div className="mb-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-800">
            Cuộc Thi <span className="text-red-500">Đang Diễn Ra</span>
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Tham gia ngay các cuộc thi hấp dẫn và thể hiện tài năng nghệ thuật
            của bạn
          </p>
        </div>

        {displayContests.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {displayContests.map((contest) => (
              <div
                key={contest.contestId}
                className={`group m-5 flex flex-col justify-between gap-4 min-h-[240px] duration-500 relative rounded-lg p-5 hover:-translate-y-2 hover:shadow-xl bg-[hsl(2,68%,58%)] shadow-md`}
              >
                <div
                  className={`absolute duration-700 shadow-md group-hover:-translate-y-4 group-hover:-translate-x-4 -bottom-10 -right-10 w-1/2 h-1/2 rounded-lg bg-[hsl(2,68%,88%)]`}
                />

                <div className="z-10">
                  <h3 className="text-2xl font-bold mb-2 text-white">
                    {contest.title}
                  </h3>
                  <p className="text-gray-100 line-clamp-3">
                    {contest.description}
                  </p>
                </div>
                <Link
                  href={`/contests/${contest.contestId}`}
                  className={`z-10 w-fit text-gray-800 font-semibold rounded p-2 px-6 transition-colors duration-200 bg-white bg-opacity-20 hover:bg-opacity-40`}
                >
                  Xem Chi Tiết
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Trophy className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-yellow-300 mb-2">
              Chưa có cuộc thi nào đang diễn ra
            </h3>
            <p className="text-gray-400">
              Hãy theo dõi để không bỏ lỡ các cuộc thi sắp tới
            </p>
          </div>
        )}

        <div className="text-center mt-16">
          <Link href="/contests">
            <button className="overflow-hidden relative w-32 p-2 h-12 bg-gray-800 text-white border-none rounded-md text-xl font-bold cursor-pointer z-10 group">
              Explore!
              <span className="absolute w-36 h-32 -top-8 -left-2 bg-red-200 rotate-12 transform scale-x-0 group-hover:scale-x-100 transition-transform group-hover:duration-500 duration-1000 origin-right" />
              <span className="absolute w-36 h-32 -top-8 -left-2 bg-red-400 rotate-12 transform scale-x-0 group-hover:scale-x-100 transition-transform group-hover:duration-700 duration-700 origin-right" />
              <span className="absolute w-36 h-32 -top-8 -left-2 bg-red-600 rotate-12 transform scale-x-0 group-hover:scale-x-100 transition-transform group-hover:duration-1000 duration-500 origin-right" />
              <span className="absolute inset-0 z-10 flex items-center justify-center text-2xl text-[--secondary-foreground] opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                →
              </span>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ContestShowcase;
