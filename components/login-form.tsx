"use client";

import { useLoginMutation } from "@/hooks/useLoginMutation";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n";
import { useLanguageStore } from "@/store/language-store";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import Image from "next/image"; // Import Next.js Image

// Định nghĩa schema validation
const schema = z.object({
  username: z
    .string({ message: "Username is required" })
    .trim()
    .nonempty("Username is required"),
  password: z
    .string({ message: "Password is required" })
    .trim()
    .nonempty("Password is required"),
  staySignedIn: z.boolean().optional(),
});

type Schema = z.infer<typeof schema>;

// Prop interface, bao gồm onToggle
export type LoginFormProps = React.ComponentProps<"div"> & {
  onToggle?: () => void;
};

export function LoginForm({
  className,
  onToggle,
  ...props
}: LoginFormProps) {
  const { currentLanguage } = useLanguageStore();
  const translations = useTranslation(currentLanguage);

  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    mode: "all",
    resolver: zodResolver(schema),
    defaultValues: {
      username: "",
      password: "",
      staySignedIn: false,
    },
  });

  const { mutate, isPending } = useLoginMutation();

  const handleLogin = (data: Schema) => {
    mutate({
      username: data.username,
      password: data.password,
      staySignedIn: data.staySignedIn,
    });
  };

  return (
    <div
      // Layout 2 cột, chiếm toàn bộ màn hình và không cuộn
      className={cn(
        "h-screen overflow-hidden grid grid-cols-1 md:grid-cols-2",
        className
      )}
      {...props}
    >
      {/* CỘT BÊN TRÁI (Biểu mẫu) */}
      <div
        // Cột form có thể cuộn nội bộ nếu màn hình quá thấp
        className="flex flex-col justify-center bg-[#EAE6E0] p-8 sm:p-12 md:p-16 overflow-y-hidden min-h-screen"
      >
        <div className="w-full max-w-sm mx-auto">
          {/* Nút Quay lại (Gán onToggle vào đây) */}
          <button
            type="button"
            onClick={() => router.push("/")}
            className="flex items-center gap-2 text-base font-medium text-black hover:text-black mb-6 relative after:content-[''] after:absolute after:bottom-[-2px] after:left-0 after:w-0 after:h-0.5 after:bg-black after:transition-all after:duration-300 hover:after:w-full"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            {translations.back || "Quay lại"}
          </button>

          {/* Logo (Sử dụng đường dẫn từ AuthContainer của bạn) */}
          <div className="mb-6">
            <img 
                src="/images/newlogo.png" 
                alt="Artchain Logo" 
                className="w-20 h-20 sm:w-22 sm:h-22 object-contain flex-shrink-0"
              />
          </div>

          {/* Tiêu đề với gạch chân xanh */}
          <h1 className="text-5xl text-[#423137] font-medium tracking-normal mb-10">
              {translations.signIn || "Đăng nhập"}
          </h1>

          {/* Biểu mẫu (Xóa gap và dùng margin-top thủ công) */}
          <form
            onSubmit={handleSubmit(handleLogin)}
            className="flex flex-col"
          >
            {/* Trường Tên đăng nhập */}
            <div className="grid gap-2">
              <label
                className="text-base font-medium text-black"
                htmlFor="username"
              >
                {translations.username || "Tên đăng nhập"}
              </label>
              <Controller
                control={control}
                name="username"
                render={({ field }) => (
                  <input
                    id="username"
                    type="text"
                    className="w-full h-12 px-4 rounded-sm border border-gray-300 bg-white focus:outline-none focus:border-[#B8AAAA] focus:ring-1 focus:ring-[#B8AAAA]"
                    {...field}
                  />
                )}
              />
              <p className="text-sm text-red-500 min-h-5">
                {errors.username?.message}
              </p>
            </div>

            {/* Trường Mật khẩu */}
            <div className="grid gap-2 mt-2">
              <label
                className="text-base font-medium text-black"
                htmlFor="password"
              >
                {translations.password || "Mật khẩu"}
              </label>
              <Controller
                control={control}
                name="password"
                render={({ field }) => (
                  <input
                    id="password"
                    type="password"
                    className="w-full h-12 px-4 rounded-sm border border-gray-300 bg-white focus:outline-none focus:border-[#B8AAAA] focus:ring-1 focus:ring-[#B8AAAA]"
                    {...field}
                  />
                )}
              />
              <p className="text-sm text-red-500 min-h-5">
                {errors.password?.message}
              </p>
            </div>

            {/* Checkbox Ghi nhớ đăng nhập */}
            <div className="flex items-center gap-2 mt-2">
              <Controller
                control={control}
                name="staySignedIn"
                render={({ field }) => (
                  <input
                    id="staySignedIn"
                    type="checkbox"
                    checked={field.value}
                    onChange={field.onChange}
                    className="h-4 w-4 rounded border-gray-400 text-orange-500 focus:ring-orange-500"
                  />
                )}
              />
              <label
                htmlFor="staySignedIn"
                className="text-sm text-black"
              >
                {translations.staySignedIn || "Ghi nhớ đăng nhập"}
              </label>
            </div>

            {/* Nút Đăng nhập */}
            <button
              type="submit"
              disabled={!isValid || isPending}
              className="flex items-center justify-center gap-2 w-full h-14 rounded-sm px-6 bg-orange-500 text-white font-semibold shadow-sm hover:bg-orange-600 duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-10 mb-4"
            >
              {translations.login || "Đăng nhập"}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
            
            {/* Đã xóa nút "Tạo tài khoản" ở đây */}
          </form>
          <div className="text-base ml-23 text-black">
            Chưa có tài khoản?{" "}
            <span 
              onClick={onToggle}
              className="text-black hover:text-orange-500 cursor-pointer underline underline-offset-8"
            >
              Đăng kí
            </span>
          </div>
        </div>
      </div>
      {/* CỘT BÊN PHẢI (Hình ảnh) */}
      <div className="hidden md:block relative w-full h-full overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1548811579-017cf2a4268b?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1289"
          alt="Statue"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}