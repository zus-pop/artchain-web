"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { FloatingInput } from "@/components/ui/floating-input";
import { FloatingSelect } from "@/components/ui/floating-select";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRegisterMutation } from "@/hooks/useRegisterMutation";
import { useTranslation } from "@/lib/i18n";
import { useLanguageStore } from "@/store/language-store";
import { useWards } from "@/hooks/useWards";
import { AnimatedRoleCard } from "@/components/ui/animated-role-card";
import { AnimatedNavButton } from "@/components/ui/animated-nav-button";

// Schema for Guardian (Người đại diện)
const guardianSchema = z
  .object({
    username: z
      .string()
      .min(3, "Tên đăng nhập phải có ít nhất 3 ký tự")
      .max(20, "Tên đăng nhập không được quá 20 ký tự")
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "Tên đăng nhập chỉ được chứa chữ cái, số và dấu gạch dưới"
      ),
    password: z
      .string()
      .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Mật khẩu phải chứa ít nhất 1 chữ thường, 1 chữ hoa và 1 số"
      ),
    confirmPassword: z.string().min(1, "Vui lòng xác nhận mật khẩu"),
    fullName: z
      .string()
      .min(2, "Họ và tên phải có ít nhất 2 ký tự")
      .max(50, "Họ và tên không được quá 50 ký tự")
      .regex(
        /^[a-zA-ZÀ-ỹ\s]+$/,
        "Họ và tên chỉ được chứa chữ cái và khoảng trắng"
      ),
    email: z.string().email("Địa chỉ email không hợp lệ"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

// Schema for Competitor (Thí sinh)
const competitorSchema = z
  .object({
    username: z
      .string()
      .min(3, "Tên đăng nhập phải có ít nhất 3 ký tự")
      .max(20, "Tên đăng nhập không được quá 20 ký tự")
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "Tên đăng nhập chỉ được chứa chữ cái, số và dấu gạch dưới"
      ),
    password: z
      .string()
      .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Mật khẩu phải chứa ít nhất 1 chữ thường, 1 chữ hoa và 1 số"
      ),
    confirmPassword: z.string().min(1, "Vui lòng xác nhận mật khẩu"),
    fullName: z
      .string()
      .min(2, "Họ và tên phải có ít nhất 2 ký tự")
      .max(50, "Họ và tên không được quá 50 ký tự")
      .regex(
        /^[a-zA-ZÀ-ỹ\s]+$/,
        "Họ và tên chỉ được chứa chữ cái và khoảng trắng"
      ),
    email: z.string().email("Địa chỉ email không hợp lệ"),
    birthday: z.string().min(1, "Vui lòng chọn ngày sinh"),
    schoolName: z.string().min(1, "Vui lòng nhập tên trường"),
    ward: z.string().min(1, "Vui lòng chọn phường/xã"),
    grade: z.string().min(1, "Vui lòng nhập lớp"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

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
  const [selectedRole, setSelectedRole] = useState<'competitor' | 'guardian' | null>(null);
  const [showForm, setShowForm] = useState(false);
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

  const wardOptions = wards.map(ward => ({
    value: ward.name,
    label: ward.name
  }));

  // Role selection screen
  if (!showForm) {
    return (
      <div
        className={cn("flex flex-col gap-6 w-full mx-auto max-w-2xl", className)}
        {...props}
      >
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {translations.signUp}
          </h1>
          <p className="text-lg text-gray-600">
            {translations.selectAccountType}
          </p>
        </div>

        {/* Role Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Competitor Card */}
          <AnimatedRoleCard
            title={translations.iAmCompetitor}
            description={translations.competitorDesc}
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            }
            isSelected={selectedRole === 'competitor'}
            onClick={() => {
              setSelectedRole('competitor');
            }}
          />

          {/* Guardian Card */}
          <AnimatedRoleCard
            title={translations.iAmGuardian}
            description={translations.guardianDesc}
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 515.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 919.288 0M15 7a3 3 0 11-6 0 3 3 0 616 0zm6 3a2 2 0 11-4 0 2 2 0 414 0zM7 10a2 2 0 11-4 0 2 2 0 414 0z" />
              </svg>
            }
            isSelected={selectedRole === 'guardian'}
            onClick={() => {
              setSelectedRole('guardian');
            }}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col items-center gap-4">
          {/* Animated Continue Button */}
          <AnimatedNavButton
            direction="continue"
            onClick={() => {
              if (selectedRole) {
                setShowForm(true);
              }
            }}
            disabled={!selectedRole}
            className="mb-2"
          >
            {translations.continue}
          </AnimatedNavButton>
          
          <span className="text-sm font-semibold uppercase text-gray-500">
            {translations.alreadyHaveAccount}
          </span>
          
          <button
            onClick={onToggle}
            className="cursor-pointer text-sm font-semibold uppercase underline-offset-4 hover:underline text-gray-900"
          >
            {translations.signInNow}
          </button>
        </div>
      </div>
    );
  }

  // Form screen
  return (
    <div className={cn("flex flex-col gap-6 w-full mx-auto max-w-3xl", className)} {...props}>
      {/* Back button and header */}
      <div className="flex items-center justify-between w-full">
        <AnimatedNavButton
          direction="back"
          onClick={() => setShowForm(false)}
          className="w-40 h-12 text-base"
        >
          {translations.back}
        </AnimatedNavButton>
        <div className="text-right">
          <h1 className="text-3xl font-bold text-gray-900">
            {selectedRole === 'competitor' ? translations.registerCompetitor : translations.registerGuardian}
          </h1>
        </div>
      </div>

      {/* Guardian Form */}
      {selectedRole === 'guardian' && (
        <form onSubmit={guardianHandleSubmit(handleGuardianRegister)} className="space-y-6">
          {/* Full Name - Full width */}
          <div className="w-full">
            <Controller
              control={guardianControl}
              name="fullName"
              render={({ field }) => (
                <FloatingInput
                  label={translations.fullName}
                  error={guardianErrors.fullName?.message}
                  {...field}
                />
              )}
            />
          </div>

          {/* Email - Full width */}
          <div className="w-full">
            <Controller
              control={guardianControl}
              name="email"
              render={({ field }) => (
                <FloatingInput
                  type="email"
                  label={translations.email}
                  error={guardianErrors.email?.message}
                  {...field}
                />
              )}
            />
          </div>

          {/* Username and Password - 2 columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Controller
              control={guardianControl}
              name="username"
              render={({ field }) => (
                <FloatingInput
                  label={translations.username}
                  error={guardianErrors.username?.message}
                  {...field}
                />
              )}
            />

            <Controller
              control={guardianControl}
              name="password"
              render={({ field }) => (
                <FloatingInput
                  type="password"
                  label={translations.password}
                  error={guardianErrors.password?.message}
                  {...field}
                />
              )}
            />
          </div>

          {/* Confirm Password - Full width */}
          <div className="w-full">
            <Controller
              control={guardianControl}
              name="confirmPassword"
              render={({ field }) => (
                <FloatingInput
                  type="password"
                  label={translations.confirmPassword}
                  error={guardianErrors.confirmPassword?.message}
                  {...field}
                />
              )}
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-center pt-6">
            <button
              type="submit"
              disabled={!guardianIsValid || isPending}
              className="cursor-pointer relative after:content-[attr(data-label)] after:text-white after:absolute after:text-nowrap after:scale-0 hover:after:scale-100 after:duration-200 w-12 h-12 rounded-full border-3 border-blue-200 bg-black flex items-center justify-center duration-300 hover:rounded-[40px] hover:w-36 group/button overflow-hidden active:scale-90 disabled:opacity-50 disabled:cursor-not-allowed"
              data-label={isPending ? translations.processing : translations.register}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="w-6 h-6 fill-white delay-50 duration-200 group-hover/button:translate-x-30"
              >
                <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"></path>
              </svg>
            </button>
          </div>
        </form>
      )}

      {/* Competitor Form */}
      {selectedRole === 'competitor' && (
        <form onSubmit={competitorHandleSubmit(handleCompetitorRegister)} className="space-y-6">
          {/* Full Name - Full width */}
          <div className="w-full">
            <Controller
              control={competitorControl}
              name="fullName"
              render={({ field }) => (
                <FloatingInput
                  label={translations.fullName}
                  error={competitorErrors.fullName?.message}
                  {...field}
                />
              )}
            />
          </div>

          {/* Email - Full width */}
          <div className="w-full">
            <Controller
              control={competitorControl}
              name="email"
              render={({ field }) => (
                <FloatingInput
                  type="email"
                  label={translations.email}
                  error={competitorErrors.email?.message}
                  {...field}
                />
              )}
            />
          </div>

          {/* Username and Password - 2 columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Controller
              control={competitorControl}
              name="username"
              render={({ field }) => (
                <FloatingInput
                  label={translations.username}
                  error={competitorErrors.username?.message}
                  {...field}
                />
              )}
            />

            <Controller
              control={competitorControl}
              name="password"
              render={({ field }) => (
                <FloatingInput
                  type="password"
                  label={translations.password}
                  error={competitorErrors.password?.message}
                  {...field}
                />
              )}
            />
          </div>

          {/* Confirm Password and Birthday - 2 columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Controller
              control={competitorControl}
              name="confirmPassword"
              render={({ field }) => (
                <FloatingInput
                  type="password"
                  label={translations.confirmPassword}
                  error={competitorErrors.confirmPassword?.message}
                  {...field}
                />
              )}
            />

            <Controller
              control={competitorControl}
              name="birthday"
              render={({ field }) => (
                <FloatingInput
                  type="date"
                  label={translations.birthday}
                  error={competitorErrors.birthday?.message}
                  {...field}
                />
              )}
            />
          </div>

          {/* School Name - Full width */}
          <div className="w-full">
            <Controller
              control={competitorControl}
              name="schoolName"
              render={({ field }) => (
                <FloatingInput
                  label={translations.schoolName}
                  error={competitorErrors.schoolName?.message}
                  {...field}
                />
              )}
            />
          </div>

          {/* Ward and Grade - 2 columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Controller
              control={competitorControl}
              name="ward"
              render={({ field }) => (
                <FloatingSelect
                  label={translations.ward}
                  error={competitorErrors.ward?.message}
                  options={wardOptions}
                  {...field}
                />
              )}
            />

            <Controller
              control={competitorControl}
              name="grade"
              render={({ field }) => (
                <FloatingInput
                  label={translations.grade}
                  error={competitorErrors.grade?.message}
                  {...field}
                />
              )}
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-center pt-6">
            <button
              type="submit"
              disabled={!competitorIsValid || isPending}
              className="cursor-pointer relative after:content-[attr(data-label)] after:text-white after:absolute after:text-nowrap after:scale-0 hover:after:scale-100 after:duration-200 w-12 h-12 rounded-full border-3 border-red-200 bg-black flex items-center justify-center duration-300 hover:rounded-[40px] hover:w-36 group/button overflow-hidden active:scale-90 disabled:opacity-50 disabled:cursor-not-allowed"
              data-label={isPending ? translations.processing : translations.register}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="w-6 h-6 fill-white delay-50 duration-200 group-hover/button:translate-x-30"
              >
                <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"></path>
              </svg>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}