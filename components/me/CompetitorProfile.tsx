"use client";

import { WhoAmI } from "@/types";
import Image from "next/image";
import { useState } from "react";
import { Lang } from "../../lib/i18n";

// --- Dữ liệu giả lập cho các bài đã nộp ---
// (Dựa trên hình ảnh của bạn)
// Bạn sẽ thay thế phần này bằng dữ liệu thật từ API
const submittedArtworks = [
  {
    id: 1,
    imageUrl: "/images/art-example-1.jpg", // <-- THAY BẰNG ĐƯỜNG DẪN ẢNH THẬT
    submissionDate: "3/6/2025",
    competitionName: "Vẽ tranh cho em",
  },
  {
    id: 2,
    imageUrl: "/images/art-example-2.jpg", // <-- THAY BẰNG ĐƯỜNG DẪN ẢNH THẬT
    submissionDate: "3/6/2025",
    competitionName: "Vẽ tranh cho em",
  },
  {
    id: 3,
    imageUrl: "/images/art-example-3.jpg", // <-- THAY BẰNG ĐƯỜNG DẪN ẢNH THẬT
    submissionDate: "3/6/2025",
    competitionName: "Vẽ tranh cho em",
  },
];
// ------------------------------------------

interface CompetitorProfileScreenProps {
  authUser: WhoAmI | null;
  t: Lang; // Giữ prop 't' nhưng code này sẽ không dùng vì text trong ảnh là cố định
}

export default function CompetitorProfileScreen({
  authUser,
}: CompetitorProfileScreenProps) {
  // State để quản lý tab đang active
  const [activeTab, setActiveTab] = useState<"submitted" | "awards">(
    "submitted"
  );

  // Xử lý dữ liệu từ authUser, dùng fallback là dữ liệu trong ảnh
  // LƯU Ý: Kiểu WhoAmI của bạn có thể không có 'class', bạn cần thêm vào nếu muốn dùng
  const profile = {
    name: authUser?.fullName || "Việt Hoàng",
    school: authUser?.schoolName || "Trường Tiểu học Nha Trang",
    class: authUser?.grade ? `Lớp ${authUser.grade}` : "Lớp 5", // Giả sử authUser có 'class'
    dob: authUser?.birthday
      ? new Date(authUser.birthday).toLocaleDateString("vi-VN")
      : "15/10/2004",
    ward: authUser?.ward || "Phường Sài Gòn",
    avatarUrl:
      authUser?.avatarUrl ||
      "https://images.unsplash.com/photo-1564153943327-fa0006d0f633?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1480", // <-- THAY BẰNG AVATAR THẬT
    bannerUrl:
      "https://plus.unsplash.com/premium_photo-1667502842264-9cdcdac36086?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2022", // <-- THAY BẰNG BANNER THẬT
  };

  return (
    <div className="min-h-screen bg-[#EAE6E0]">
      {/* === Banner Section === */}
      {/* Lấy banner có style giống ảnh (watercolor) */}
      <div className="relative h-48 w-full sm:h-56">
        <Image
          src={profile.bannerUrl}
          alt="Banner"
          layout="fill"
          objectFit="cover"
          className="bg-linear-to-r from-blue-100 via-pink-100 to-orange-100" // Placeholder
        />
      </div>

      {/* === Main Content Area === */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* === Profile Info Section === */}
        {/* Dùng margin âm để kéo phần info này đè lên banner */}
        <div className="relative -mt-24 sm:-mt-28">
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-end sm:justify-between sm:gap-8 mt-[7vh]">
            {/* Left side: Avatar và Tên/Trường/Lớp */}
            <div className="flex items-end">
              <div className="relative h-32 w-32 shrink-0 sm:h-40 sm:w-40">
                <Image
                  src={profile.avatarUrl}
                  alt={profile.name}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-full border-4 border-white shadow-lg bg-black"
                />
              </div>
              <div className="ml-4 sm:ml-6">
                <h1 className="text-2xl font-bold text-black sm:text-3xl">
                  {profile.name}
                </h1>
                <p className="mt-1 text-sm text-black">{profile.school}</p>
                <p className="text-sm text-black">{profile.class}</p>
              </div>
            </div>

            {/* Right side: Thông tin Ngày sinh / Phường */}
            <div className="flex w-full justify-start gap-8 sm:w-auto sm:justify-end">
              <div>
                <p className="text-sm font-bold text-black">Ngày sinh</p>
                <p className="mt-1 text-base font-regular text-black">
                  {profile.dob}
                </p>
              </div>
            </div>
            <div className="mr-15">
              <p className="text-sm font-bold text-black">Phường</p>
              <p className="mt-1 text-base font-regular text-black">
                {profile.ward}
              </p>
            </div>
          </div>
        </div>

        {/* === Tabs Section === */}
        {/* Thay thế Tabs của ShadCN bằng tab-nav đơn giản */}
        <div className="mt-10">
          <div className="border-b border-[#B1B1B1]">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              {/* Tab Đã nộp */}
              <button
                onClick={() => setActiveTab("submitted")}
                className={`
                  ${
                    activeTab === "submitted"
                      ? "border-black text-black"
                      : "border-transparent text-black"
                  }
                  whitespace-nowrap cursor-pointer border-b-2 px-1 py-4 text-base font-medium
                `}
              >
                Đã nộp
              </button>

              {/* Tab Giải thưởng */}
              <button
                onClick={() => setActiveTab("awards")}
                className={`
                  ${
                    activeTab === "awards"
                      ? "border-black text-black"
                      : "border-transparent text-black hover:border-black hover:text-black"
                  }
                  whitespace-nowrap cursor-pointer border-b-2 px-1 py-4 text-base font-medium
                `}
              >
                Giải thưởng
              </button>
            </nav>
          </div>
        </div>

        {/* === Tab Content Section === */}
        <div className="py-8">
          {/* Nội dung tab "Đã nộp" */}
          {activeTab === "submitted" && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {submittedArtworks.map((art) => (
                <div key={art.id} className="overflow-hidden">
                  <div className="relative h-56 w-full">
                    <Image
                      src={art.imageUrl}
                      alt={art.competitionName}
                      layout="fill"
                      objectFit="cover"
                      className="bg-black rounded-md" // Placeholder
                    />
                  </div>
                  <div className="py-2">
                    <p className="text-sm text-black">
                      Ngày nộp: {art.submissionDate}
                    </p>
                    <p className="mt-1 font-medium text-black">
                      Cuộc thi: {art.competitionName}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Nội dung tab "Giải thưởng" (Placeholder) */}
          {activeTab === "awards" && (
            <div className="flex h-64 items-center justify-center rounded-lg border-2 border-dashed border-black bg-gray-50">
              <p className="text-black">Chưa có giải thưởng nào.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
