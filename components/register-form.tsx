"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRegisterMutation } from "@/hooks/useRegisterMutation";
import { useTranslation } from "@/lib/i18n";
import { useLanguageStore } from "@/store/language-store";
import { useWards } from "@/hooks/useWards";
// Import các icon từ @tabler/icons-react
import { IconSchool, IconUsers } from "@tabler/icons-react";
import Checkbox from "./Checkbox";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";

// Schema for Guardian (Người đại diện)
const guardianSchema = z
  .object({
    username: z
      .string()
      .min(3, "Tối thiểu 3 ký tự")
      .max(20, "Tối đa 20 ký tự")
      .regex(/^[a-zA-Z0-9_]+$/, "Chỉ chữ, số, gạch dưới"),
    password: z.string().min(6, "Tối thiểu 6 ký tự"),
    confirmPassword: z.string().min(1, "Xác nhận mật khẩu"),
    fullName: z.string().min(2, "Tối thiểu 2 ký tự").max(50, "Tối đa 50 ký tự"),
    email: z.email("Email không hợp lệ"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu không khớp",
    path: ["confirmPassword"],
  });

// Schema for Competitor (Thí sinh)
const competitorSchema = z
  .object({
    username: z
      .string()
      .min(3, "Tối thiểu 3 ký tự")
      .max(20, "Tối đa 20 ký tự")
      .regex(/^[a-zA-Z0-9_]+$/, "Chỉ chữ, số, gạch dưới"),
    password: z.string().min(6, "Tối thiểu 6 ký tự"),
    confirmPassword: z.string().min(1, "Xác nhận mật khẩu"),
    fullName: z.string().min(2, "Tối thiểu 2 ký tự").max(50, "Tối đa 50 ký tự"),
    email: z.email("Email không hợp lệ"),
    birthday: z.string().min(1, "Chọn ngày sinh"),
    schoolName: z.string().min(1, "Nhập tên trường"),
    ward: z.string().min(1, "Chọn phường/xã"),
    grade: z.string().min(1, "Nhập lớp"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu không khớp",
    path: ["confirmPassword"],
  })
  .refine(
    (data) => {
      if (!data.birthday || !data.grade) return true;
      const birthYear = new Date(data.birthday).getFullYear();
      const currentYear = new Date().getFullYear();
      const age = currentYear - birthYear;
      const gradeNum = parseInt(data.grade);
      const expectedAge = gradeNum + 5; // Lớp 1 = 6 tuổi, lớp 2 = 7 tuổi, v.v.
      return Math.abs(age - expectedAge) <= 4; // Sai số tối đa 4 năm
    },
    {
      message: "Tuổi không phù hợp với lớp học (sai số tối đa 4 năm)",
      path: ["birthday"],
    }
  );

type GuardianSchema = z.infer<typeof guardianSchema>;
type CompetitorSchema = z.infer<typeof competitorSchema>;

export function RegisterForm({
  className,
  onToggle,
  ...props
}: React.ComponentProps<"div"> & {
  onToggle?: () => void;
}) {
  const { currentLanguage } = useLanguageStore();
  const translations = useTranslation(currentLanguage);
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<
    "competitor" | "guardian" | null
  >(null);
  const [showForm, setShowForm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { wards } = useWards();

  // Guardian form
  const {
    control: guardianControl,
    handleSubmit: guardianHandleSubmit,
    formState: { errors: guardianErrors, isValid: guardianIsValid },
  } = useForm({
    mode: "all",
    resolver: zodResolver(guardianSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
      fullName: "",
      email: "",
    },
  });

  // Competitor form
  const {
    control: competitorControl,
    handleSubmit: competitorHandleSubmit,
    formState: { errors: competitorErrors, isValid: competitorIsValid },
    watch: competitorWatch,
    setValue: competitorSetValue,
  } = useForm({
    mode: "all",
    resolver: zodResolver(competitorSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
      fullName: "",
      email: "",
      birthday: "",
      schoolName: "",
      ward: "",
      grade: "",
    },
  });

  const { mutate, isPending } = useRegisterMutation(onToggle);

  // Watch birthday field for dynamic grade options
  const watchedBirthday = competitorWatch("birthday");

  // Calculate valid grade range based on birthday
  const getValidGrades = () => {
    if (!watchedBirthday) {
      // If no birthday selected, show all grades 1-9
      return Array.from({ length: 9 }, (_, i) => i + 1);
    }

    const birthYear = new Date(watchedBirthday).getFullYear();
    const currentYear = new Date().getFullYear();
    const age = currentYear - birthYear;

    // Expected grade = age - 5 (since grade 1 = 6 years old)
    const expectedGrade = age - 5;

    // For strict validation: only allow grades that match expected age ±1 year
    const minGrade = Math.max(1, expectedGrade - 1);
    const maxGrade = Math.min(9, expectedGrade + 1);

    const validGrades = [];
    for (let grade = minGrade; grade <= maxGrade; grade++) {
      validGrades.push(grade);
    }

    return validGrades.length > 0
      ? validGrades
      : Array.from({ length: 9 }, (_, i) => i + 1);
  };

  const validGrades = getValidGrades();

  // Clear grade selection if it's no longer valid when birthday changes
  useEffect(() => {
    const currentGrade = competitorWatch("grade");
    if (currentGrade && !validGrades.includes(parseInt(currentGrade))) {
      // Reset grade if it's not in the valid range
      competitorSetValue("grade", "");
    }
  }, [watchedBirthday, competitorSetValue, validGrades, competitorWatch]);

  const handleGuardianRegister = (data: GuardianSchema) => {
    mutate({
      username: data.username,
      password: data.password,
      fullName: data.fullName,
      email: data.email,
      role: "GUARDIAN",
    });
  };

  const handleCompetitorRegister = (data: CompetitorSchema) => {
    mutate({
      username: data.username,
      password: data.password,
      fullName: data.fullName,
      email: data.email,
      role: "COMPETITOR",
      birthday: data.birthday,
      schoolName: data.schoolName,
      ward: data.ward,
      grade: data.grade,
    });
  };

  const wardOptions = wards.map((ward) => ({
    value: ward.name,
    label: ward.name,
  }));

  // Role selection screen
  if (!showForm) {
    return (
      <div
        className={cn(
          "h-screen overflow-hidden flex items-center justify-center bg-[#EAE6E0] p-8",
          className
        )}
        {...props}
      >
        <div className="w-full max-w-2xl">
          {/* Header */}
          <div className="text-center mb-10">
            <img
              src="/images/newlogo.png"
              alt="Artchain Logo"
              className="w-22 h-22 mx-auto mb-6 cursor-pointer"
              onClick={() => router.push("/")}
            />
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              {translations.selectAccountType || "Chọn vai trò"}
            </h1>
          </div>

          {/* Role Selection Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            {/* Competitor Card - ĐÃ CẬP NHẬT CẤU TRÚC */}
            <div
              className={cn(
                "bg-white rounded-sm p-6 flex flex-col justify-center transition-all duration-200 min-h-40 cursor-pointer",
                selectedRole === "competitor"
                  ? "border-2 border-orange-500 shadow-md"
                  : "border border-gray-200 hover:border-gray-300"
              )}
              onClick={() => setSelectedRole("competitor")}
            >
              <div className="w-full">
                {/* Hàng 1: Icon và Checkbox */}
                <div className="flex justify-between items-center w-full mb-4">
                  <IconSchool
                    className="w-12 h-10 text-gray-700"
                    stroke={1.5}
                  />
                  <Checkbox
                    checked={selectedRole === "competitor"}
                    onChange={(checked) =>
                      setSelectedRole(checked ? "competitor" : null)
                    }
                    id="competitor-checkbox"
                  />
                </div>

                {/* Hàng 2: Text */}
                <h3 className="text-lg font-semibold text-gray-800 text-left w-full">
                  {translations.iAmCompetitor || "Thí sinh tự do"}
                </h3>
              </div>
            </div>

            {/* Guardian Card - ĐÃ CẬP NHẬT CẤU TRÚC */}
            <div
              className={cn(
                "bg-white rounded-sm p-6 flex flex-col justify-center transition-all duration-200 min-h-40 cursor-pointer",
                selectedRole === "guardian"
                  ? "border-2 border-orange-500 shadow-md"
                  : "border border-gray-200 hover:border-gray-300"
              )}
              onClick={() => setSelectedRole("guardian")}
            >
              <div className="w-full">
                {/* Hàng 1: Icon và Checkbox */}
                <div className="flex justify-between items-center w-full mb-4">
                  <IconUsers className="w-12 h-10 text-gray-700" stroke={1.5} />
                  <Checkbox
                    checked={selectedRole === "guardian"}
                    onChange={(checked) =>
                      setSelectedRole(checked ? "guardian" : null)
                    }
                    id="guardian-checkbox"
                  />
                </div>

                {/* Hàng 2: Text */}
                <h3 className="text-lg font-semibold text-gray-800 text-left w-full">
                  {translations.iAmGuardian || "Người giám hộ"}
                </h3>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col items-center gap-4">
            {/* Continue Button */}
            <button
              onClick={() => {
                if (selectedRole) {
                  setShowForm(true); // Proceed to the next step
                }
              }}
              disabled={!selectedRole}
              className="flex cursor-pointer items-center justify-center gap-2 w-full max-w-[300px] px-12 h-10 bg-orange-500 text-white text-lg font-semibold rounded-sm shadow-sm hover:bg-orange-600 duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {translations.continue || "Đăng kí"}
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

            <div className="text-base text-gray-700 mt-2">
              {translations.alreadyHaveAccount || "Đã có tài khoản?"}{" "}
              <span
                onClick={onToggle}
                className="text-black hover:text-orange-500 cursor-pointer underline underline-offset-8"
              >
                Đăng nhập
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Form screen (giữ nguyên)
  return (
    <div
      className={cn(
        "h-screen overflow-hidden grid grid-cols-1 md:grid-cols-2",
        className
      )}
      {...props}
    >
      {/* CỘT BÊN TRÁI (Biểu mẫu) */}
      <div className="flex flex-col justify-center bg-[#EAE6E0] p-8 sm:p-12 md:p-16 overflow-y-hidden min-h-screen">
        <div className="w-full max-w-sm mx-auto">
          {/* Back button */}
          <button
            type="button"
            onClick={() => setShowForm(false)}
            className="flex cursor-pointer items-center gap-2 text-base font-medium text-black mb-6 hover:text-orange-500 transition-colors"
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
          {/* Title */}
          <h1 className="text-5xl text-black leading-tight mb-6 ">
            {selectedRole === "competitor"
              ? "Đăng ký thí sinh"
              : "Đăng ký giám hộ"}
          </h1>

          {/* Guardian Form */}
          {selectedRole === "guardian" && (
            <form
              onSubmit={guardianHandleSubmit(handleGuardianRegister)}
              className="flex flex-col"
            >
              {/* Full Name and Email - 2 columns */}
              <div className="grid grid-cols-1 gap-4">
                <div className="grid gap-2">
                  <label
                    className="text-base font-medium text-black"
                    htmlFor="guardian-fullName"
                  >
                    Họ tên
                  </label>
                  <Controller
                    control={guardianControl}
                    name="fullName"
                    render={({ field }) => (
                      <input
                        id="guardian-fullName"
                        type="text"
                        placeholder="Họ và tên"
                        className="w-full h-10 px-4 rounded-md border border-gray-300 bg-white focus:outline-none focus:border-[#B8AAAA] focus:ring-1 focus:ring-[#B8AAAA]"
                        {...field}
                      />
                    )}
                  />
                  <p className="text-sm text-red-500 min-h-5">
                    {guardianErrors.fullName?.message}
                  </p>
                </div>

                <div className="grid gap-2">
                  <label
                    className="text-base font-medium text-black"
                    htmlFor="guardian-email"
                  >
                    {translations.email || "Email"}
                  </label>
                  <Controller
                    control={guardianControl}
                    name="email"
                    render={({ field }) => (
                      <input
                        id="guardian-email"
                        type="email"
                        placeholder="Email"
                        className="w-full h-10 px-4 rounded-md border border-gray-300 bg-white focus:outline-none focus:border-[#B8AAAA] focus:ring-1 focus:ring-[#B8AAAA]"
                        {...field}
                      />
                    )}
                  />
                  <p className="text-sm text-red-500 min-h-5">
                    {guardianErrors.email?.message}
                  </p>
                </div>
              </div>

              {/* Username and Password - 2 columns */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                <div className="grid gap-2">
                  <label
                    className="text-base font-medium text-black"
                    htmlFor="guardian-username"
                  >
                    Username
                  </label>
                  <Controller
                    control={guardianControl}
                    name="username"
                    render={({ field }) => (
                      <input
                        id="guardian-username"
                        type="text"
                        placeholder="Tên đăng nhập"
                        className="w-full h-10 px-4 rounded-md border border-gray-300 bg-white focus:outline-none focus:border-[#B8AAAA] focus:ring-1 focus:ring-[#B8AAAA]"
                        {...field}
                      />
                    )}
                  />
                  <p className="text-sm text-red-500 min-h-5">
                    {guardianErrors.username?.message}
                  </p>
                </div>

                <div className="grid gap-2">
                  <label
                    className="text-base font-medium text-black"
                    htmlFor="guardian-password"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <Controller
                      control={guardianControl}
                      name="password"
                      render={({ field }) => (
                        <input
                          id="guardian-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Mật khẩu"
                          className="w-full h-10 px-4 pr-12 rounded-md border border-gray-300 bg-white focus:outline-none focus:border-[#B8AAAA] focus:ring-1 focus:ring-[#B8AAAA]"
                          {...field}
                        />
                      )}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
                    >
                      {!showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  <p className="text-sm text-red-500 min-h-5">
                    {guardianErrors.password?.message}
                  </p>
                </div>
              </div>

              {/* Confirm Password - Full width */}
              <div className="grid gap-2 mt-2">
                <label
                  className="text-base font-medium text-black"
                  htmlFor="guardian-confirmPassword"
                >
                  Xác nhận
                </label>
                <div className="relative">
                  <Controller
                    control={guardianControl}
                    name="confirmPassword"
                    render={({ field }) => (
                      <input
                        id="guardian-confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Xác nhận mật khẩu"
                        className="w-full h-10 px-4 pr-12 rounded-md border border-gray-300 bg-white focus:outline-none focus:border-[#B8AAAA] focus:ring-1 focus:ring-[#B8AAAA]"
                        {...field}
                      />
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={
                      showConfirmPassword
                        ? "Hide confirm password"
                        : "Show confirm password"
                    }
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
                  >
                    {!showConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                <p className="text-sm text-red-500 min-h-5">
                  {guardianErrors.confirmPassword?.message}
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isPending}
                className="cursor-pointer flex items-center justify-center gap-2 w-full h-10 px-6 bg-orange-500 text-white font-semibold shadow-sm hover:bg-orange-600 duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-2 mb-4"
              >
                {isPending
                  ? translations.processing || "Đang xử lý..."
                  : translations.register || "Đăng ký"}
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
            </form>
          )}

          {/* Link to login */}
          {selectedRole === "guardian" && (
            <div className="text-base text-black mt-4 ml-20">
              {translations.alreadyHaveAccount || "Đã có tài khoản?"}{" "}
              <span
                onClick={onToggle}
                className="text-black hover:text-orange-500 cursor-pointer underline underline-offset-8"
              >
                Đăng nhập
              </span>
            </div>
          )}

          {/* Competitor Form */}
          {selectedRole === "competitor" && (
            <form
              onSubmit={competitorHandleSubmit(handleCompetitorRegister)}
              className="flex flex-col"
            >
              {/* Full Name and Email - 2 columns */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="grid">
                  <label
                    className="text-sm font-medium text-black"
                    htmlFor="competitor-fullName"
                  >
                    Họ tên
                  </label>
                  <Controller
                    control={competitorControl}
                    name="fullName"
                    render={({ field }) => (
                      <input
                        id="competitor-fullName"
                        type="text"
                        className="w-full mt-2 h-10 px-4 rounded-md border border-gray-300 bg-white focus:outline-none focus:border-[#B8AAAA] focus:ring-1 focus:ring-[#B8AAAA]"
                        {...field}
                      />
                    )}
                  />
                  <p className="text-sm text-red-500 min-h-5">
                    {competitorErrors.fullName?.message}
                  </p>
                </div>

                <div className="grid">
                  <label
                    className="text-sm font-medium text-black"
                    htmlFor="competitor-email"
                  >
                    {translations.email || "Email"}
                  </label>
                  <Controller
                    control={competitorControl}
                    name="email"
                    render={({ field }) => (
                      <input
                        id="competitor-email"
                        type="email"
                        className="w-full mt-2 h-10 px-4 rounded-md border border-gray-300 bg-white focus:outline-none focus:border-[#B8AAAA] focus:ring-1 focus:ring-[#B8AAAA]"
                        {...field}
                      />
                    )}
                  />
                  <p className="text-sm text-red-500 min-h-5">
                    {competitorErrors.email?.message}
                  </p>
                </div>
              </div>

              {/* Username and Password - 2 columns */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 ">
                <div className="grid">
                  <label
                    className="text-sm font-medium text-black"
                    htmlFor="competitor-username"
                  >
                    Username
                  </label>
                  <Controller
                    control={competitorControl}
                    name="username"
                    render={({ field }) => (
                      <input
                        id="competitor-username"
                        type="text"
                        className="w-full mt-2 h-10 px-4 rounded-md border border-gray-300 bg-white focus:outline-none focus:border-[#B8AAAA] focus:ring-1 focus:ring-[#B8AAAA]"
                        {...field}
                      />
                    )}
                  />
                  <p className="text-sm text-red-500 min-h-5">
                    {competitorErrors.username?.message}
                  </p>
                </div>

                <div className="grid">
                  <label
                    className="text-sm font-medium text-black"
                    htmlFor="competitor-password"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <Controller
                      control={competitorControl}
                      name="password"
                      render={({ field }) => (
                        <input
                          id="competitor-password"
                          type={showPassword ? "text" : "password"}
                          className="w-full mt-2 h-10 px-4 pr-12 rounded-md border border-gray-300 bg-white focus:outline-none focus:border-[#B8AAAA] focus:ring-1 focus:ring-[#B8AAAA]"
                          {...field}
                        />
                      )}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      className="absolute top-[55%] right-3 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
                    >
                      {!showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  <p className="text-sm text-red-500 min-h-5">
                    {competitorErrors.password?.message}
                  </p>
                </div>
              </div>

              {/* Confirm Password and Birthday - 2 columns */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 ">
                <div className="grid">
                  <label
                    className="text-sm font-medium text-black"
                    htmlFor="competitor-confirmPassword"
                  >
                    Xác nhận
                  </label>
                  <div className="relative">
                    <Controller
                      control={competitorControl}
                      name="confirmPassword"
                      render={({ field }) => (
                        <input
                          id="competitor-confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          className="w-full mt-2 h-10 px-4 pr-12 rounded-md border border-gray-300 bg-white focus:outline-none focus:border-[#B8AAAA] focus:ring-1 focus:ring-[#B8AAAA]"
                          {...field}
                        />
                      )}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      aria-label={
                        showConfirmPassword
                          ? "Hide confirm password"
                          : "Show confirm password"
                      }
                      className="absolute top-[55%] right-3 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
                    >
                      {!showConfirmPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  <p className="text-sm text-red-500 min-h-5">
                    {competitorErrors.confirmPassword?.message}
                  </p>
                </div>

                <div className="grid">
                  <label
                    className="text-sm font-medium text-black"
                    htmlFor="competitor-birthday"
                  >
                    Ngày sinh
                  </label>
                  <Controller
                    control={competitorControl}
                    name="birthday"
                    render={({ field }) => (
                      <input
                        id="competitor-birthday"
                        type="date"
                        min={`${new Date().getFullYear() - 16}-01-01`}
                        max={`${new Date().getFullYear() - 5}-12-31`}
                        className="w-full mt-2 h-10 px-4 rounded-md border border-gray-300 bg-white focus:outline-none focus:border-[#B8AAAA] focus:ring-1 focus:ring-[#B8AAAA]"
                        {...field}
                      />
                    )}
                  />
                  <p className="text-sm text-red-500 min-h-5">
                    {competitorErrors.birthday?.message}
                  </p>
                </div>
              </div>

              {/* School Name - Full width */}
              <div className="grid ">
                <label
                  className="text-sm font-medium text-black"
                  htmlFor="competitor-schoolName"
                >
                  Trường
                </label>
                <Controller
                  control={competitorControl}
                  name="schoolName"
                  render={({ field }) => (
                    <input
                      id="competitor-schoolName"
                      type="text"
                      className="w-full mt-2 h-10 px-4 rounded-md border border-gray-300 bg-white focus:outline-none focus:border-[#B8AAAA] focus:ring-1 focus:ring-[#B8AAAA]"
                      {...field}
                    />
                  )}
                />
                <p className="text-sm text-red-500 min-h-5">
                  {competitorErrors.schoolName?.message}
                </p>
              </div>

              {/* Ward and Grade - 2 columns */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 ">
                <div className="grid">
                  <label
                    className="text-sm font-medium text-black"
                    htmlFor="competitor-ward"
                  >
                    Phường/Xã
                  </label>
                  <Controller
                    control={competitorControl}
                    name="ward"
                    render={({ field }) => (
                      <>
                        <input
                          id="competitor-ward"
                          type="text"
                          list="ward-options"
                          className="w-full mt-2 h-10 px-4 rounded-md border border-gray-300 bg-white focus:outline-none focus:border-[#B8AAAA] focus:ring-1 focus:ring-[#B8AAAA]"
                          {...field}
                        />
                        <datalist id="ward-options">
                          {wardOptions.map((option) => (
                            <option key={option.value} value={option.value} />
                          ))}
                        </datalist>
                      </>
                    )}
                  />
                  <p className="text-sm text-red-500 min-h-5">
                    {competitorErrors.ward?.message}
                  </p>
                </div>

                <div className="grid">
                  <label
                    className="text-sm font-medium text-black"
                    htmlFor="competitor-grade"
                  >
                    Lớp
                  </label>
                  <Controller
                    control={competitorControl}
                    name="grade"
                    render={({ field }) => (
                      <select
                        id="competitor-grade"
                        className="w-full mt-2 h-10 px-4 rounded-md border border-gray-300 bg-white focus:outline-none focus:border-[#B8AAAA] focus:ring-1 focus:ring-[#B8AAAA]"
                        {...field}
                      >
                        <option value="">Chọn lớp</option>
                        {validGrades.map((grade) => (
                          <option key={grade} value={grade.toString()}>
                            Lớp {grade}
                          </option>
                        ))}
                      </select>
                    )}
                  />
                  <p className="text-sm text-red-500 min-h-5">
                    {competitorErrors.grade?.message}
                  </p>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isPending}
                className="cursor-pointer flex items-center justify-center gap-2 w-full h-10 px-6 bg-orange-500 text-white font-semibold shadow-sm hover:bg-orange-600 duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-2 mb-4"
              >
                {isPending
                  ? translations.processing || "Đang xử lý..."
                  : translations.register || "Đăng ký"}
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
            </form>
          )}

          {/* Link to login */}
          {selectedRole === "competitor" && (
            <div className="text-sm text-black mt-4 ml-20">
              {translations.alreadyHaveAccount || "Đã có tài khoản?"}{" "}
              <span
                onClick={onToggle}
                className="text-black hover:text-orange-500 cursor-pointer underline underline-offset-8"
              >
                Đăng nhập
              </span>
            </div>
          )}
        </div>
      </div>

      {/* CỘT BÊN PHẢI (Hình ảnh) */}
      <div className="hidden md:block relative w-full h-full overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1548811579-017cf2a4268b?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%D&auto=format&fit=crop&q=80&w=1289"
          alt="Statue"
          fill
          className="object-cover"
        />
      </div>
    </div>
  );
}
