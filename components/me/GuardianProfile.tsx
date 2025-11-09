"use client";

import { GuardianChild, WhoAmI } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { Plus } from "lucide-react";
import { useState } from "react";

interface GuardianProfileScreenProps {
  authUser: WhoAmI | null;
  guardianChildren: GuardianChild[] | undefined;
  isLoadingChildren: boolean;
}

// GUARDIAN PROFILE SCREEN COMPONENT
export default function GuardianProfileScreen({
  authUser,
  guardianChildren,
  isLoadingChildren,
}: GuardianProfileScreenProps) {
  const [activeTab, setActiveTab] = useState<
    "children" | "competitions" | "progress" | "about"
  >("children");

  // Xử lý dữ liệu từ authUser, dùng fallback
  const profile = {
    name: authUser?.fullName || "Loading...",
    dob: authUser?.birthday
      ? new Date(authUser.birthday).toLocaleDateString("vi-VN")
      : "Chưa cập nhật",
    ward: authUser?.ward || "Chưa cập nhật",
    avatarUrl:
      authUser?.avatarUrl ||
      "https://images.unsplash.com/photo-1564153943327-fa0006d0f633?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1480",
    bannerUrl:
      "https://plus.unsplash.com/premium_photo-1667502842264-9cdcdac36086?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2022",
  };

  return (
    <div className="min-h-screen bg-[#EAE6E0]">
      {/* === Banner Section === */}
      <div className="relative h-48 w-full sm:h-56">
        <Image
          src={profile.bannerUrl}
          alt="Banner"
          layout="fill"
          objectFit="cover"
          className="bg-gradient-to-r from-blue-100 via-pink-100 to-orange-100"
        />
      </div>

      {/* === Main Content Area === */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* === Profile Info Section === */}
        <div className="relative -mt-24 sm:-mt-28">
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-end sm:justify-between sm:gap-8 mt-[7vh]">
            {/* Left side: Avatar và Tên */}
            <div className="flex items-end">
              <div className="relative h-32 w-32 flex-shrink-0 sm:h-40 sm:w-40">
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
                <p className="mt-1 text-sm text-black">Phụ huynh</p>
                <p className="text-sm text-black">
                  Quản lý {guardianChildren?.length || 0} thí sinh
                </p>
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

        {/* Guardian Stats
        <div className="py-10 border-black text-center">
          <div className="flex flex-wrap justify-center">
            <div className="w-full px-4">
              <div className="p-2 pt-3 pb-1.5 flex flex-col rounded-xl bg-gray-50 w-full mx-auto mb-6">
                <div className="flex divide-x divide-black">
                  <div className="flex-1 pr-6">
                    <p className="text-xs font-medium text-black">
                      Quản lý thí sinh
                    </p>
                    <p className="text-xl font-semibold text-black">
                      {guardianChildren?.length || 0}
                    </p>
                  </div>
                  <div className="flex-1 pl-6">
                    <p className="text-xs font-medium text-black">
                      Số bài dự thi
                    </p>
                    <p className="text-xl font-semibold text-black">
                      {guardianChildren?.reduce(
                        (total, child) =>
                          total + (child.status === 1 ? 1 : 0),
                        0
                      ) || 0}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div> */}

        {/* === Tabs Section === */}
        <div className="mt-10">
          <div className="border-b border-[#B1B1B1]">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              {/* Tab Con em */}
              <button
                onClick={() => setActiveTab("children")}
                className={`
                  ${
                    activeTab === "children"
                      ? "border-black text-black"
                      : "border-transparent text-black hover:border-black hover:text-black"
                  }
                  whitespace-nowrap cursor-pointer border-b-2 px-1 py-4 text-base font-medium
                `}
              >
                Thí sinh
              </button>

              {/* Tab Cuộc thi */}
              <button
                onClick={() => setActiveTab("competitions")}
                className={`
                  ${
                    activeTab === "competitions"
                      ? "border-black text-black"
                      : "border-transparent text-black hover:border-black hover:text-black"
                  }
                  whitespace-nowrap cursor-pointer border-b-2 px-1 py-4 text-base font-medium
                `}
              >
                Cuộc thi
              </button>

              {/* Tab Tiến độ */}
              <button
                onClick={() => setActiveTab("progress")}
                className={`
                  ${
                    activeTab === "progress"
                      ? "border-black text-black"
                      : "border-transparent text-black hover:border-black hover:text-black"
                  }
                  whitespace-nowrap cursor-pointer border-b-2 px-1 py-4 text-base font-medium
                `}
              >
                Tiến độ
              </button>

              {/* Tab Thông tin */}
              <button
                onClick={() => setActiveTab("about")}
                className={`
                  ${
                    activeTab === "about"
                      ? "border-black text-black"
                      : "border-transparent text-black hover:border-black hover:text-black"
                  }
                  whitespace-nowrap cursor-pointer border-b-2 px-1 py-4 text-base font-medium
                `}
              >
                Thông tin
              </button>
            </nav>
          </div>
        </div>

        {/* === Tab Content Section === */}
        <div className="py-8">
          {/* Nội dung tab "Con em" */}
          {activeTab === "children" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center mb-4">
                <div></div>
                <Link
                  href="/add-child"
                  className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition-colors flex items-center space-x-2 font-medium"
                >
                  <Plus className="h-4 w-4" />
                  <span>Thêm các bé</span>
                </Link>
              </div>
              {isLoadingChildren ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#423137] mx-auto"></div>
                  <p className="text-[#423137] mt-2">
                    Đang tải danh sách con em...
                  </p>
                </div>
              ) : guardianChildren && guardianChildren.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {guardianChildren.map((child) => (
                    <div
                      key={child.userId}
                      className="p-8 border border-[#423137] rounded-sm bg-[#F2F2F2] overflow-hidden aspect-video lg:aspect-[487/251]"
                    >
                      <div className="flex items-center space-x-3 mb-3">
                        <div>
                          <h4 className="font-semibold text-3xl text-[#423137]">
                            {child.fullName}
                          </h4>
                          {/* username removed to match provided design - keep styling unchanged */}
                        </div>
                      </div>
                      <div className="space-y-1 text-base text-[#423137]">
                        <p>
                          <span className="font-medium text-black">Email:</span>{" "}
                          {child.email}
                        </p>
                        <p>
                          <span className="font-medium text-black">
                            Trường:
                          </span>{" "}
                          {child.schoolName || "Chưa cập nhật"}
                        </p>
                        <p>
                          <span className="font-medium text-black">Lớp:</span>{" "}
                          {child.grade || "N/A"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <p className="text-black">Chưa có con em nào được đăng ký</p>
                  <p className="text-sm text-black mt-1">
                    Hãy thêm con em để bắt đầu tham gia cuộc thi
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Nội dung tab "Cuộc thi" */}
          {activeTab === "competitions" && (
            <div className="flex h-64 items-center justify-center rounded-lg border-2 border-dashed border-black bg-gray-50">
              <p className="text-black">Chưa có cuộc thi nào.</p>
            </div>
          )}

          {/* Nội dung tab "Tiến độ" */}
          {activeTab === "progress" && (
            <div className="flex h-64 items-center justify-center rounded-lg border-2 border-dashed border-black bg-gray-50">
              <p className="text-black">Chưa có tiến độ nào.</p>
            </div>
          )}

          {/* Nội dung tab "Thông tin" */}
          {activeTab === "about" && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-black">
                  Họ và tên
                </label>
                <p className="text-[#423137]">{authUser?.fullName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-black">
                  Email
                </label>
                <p className="text-[#423137]">{authUser?.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-black">
                  Số điện thoại
                </label>
                <p className="text-[#423137]">
                  {authUser?.phone || "Chưa cập nhật"}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
