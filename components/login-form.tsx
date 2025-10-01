"use client";

import { useLoginMutation } from "@/apis/auth";
import { FloatingInput } from "@/components/ui/floating-input";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n";
import { useLanguageStore } from "@/store/language-store";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

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

export function LoginForm({
  className,
  onToggle,
  ...props
}: React.ComponentProps<"div"> & {
  onToggle?: () => void;
}) {
  const { currentLanguage } = useLanguageStore();
  const translations = useTranslation(currentLanguage);
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
    mutate(data);
  };

  return (
    <div
      className={cn("flex flex-col gap-3 w-full mx-auto", className)}
      {...props}
    >
      <form className="p-4 md:p-6 flex flex-col items-center justify-center">
            <div className="flex flex-col items-center text-center mb-4 w-full max-w-xs md:max-w-sm">
              <h1 className="text-3xl font-bold text-gray-900 mb-3">{translations.signIn}</h1>
            </div>
            {/* Sử dụng w-full max-w-xs/sm để giới hạn chiều rộng của form bên trong cột */}
            <div className="flex flex-col gap-3 w-full max-w-xs md:max-w-sm">
              {/* Username field */}
              <div className="grid gap-1">
                <Controller
                  control={control}
                  name="username"
                  render={({ field }) => (
                    <FloatingInput
                      label={translations.username}
                      error={errors.username?.message}
                      {...field}
                    />
                  )}
                />
              </div>

              {/* Password field */}
              <div className="grid gap-1">
                <Controller
                  control={control}
                  name="password"
                  render={({ field }) => (
                    <FloatingInput
                      type="password"
                      label={translations.password}
                      error={errors.password?.message}
                      {...field}
                    />
                  )}
                />
              </div>
              <div className="h-px bg-gray-400 my-1 w-full" />
              {/* Stay signed in text */}
              <div className="flex items-center justify-center">
                <span className="text-sm text-gray-500">
                  {translations.staySignedIn}
                </span>
              </div>

              {/* Nút mũi tên và văn bản dưới cùng */}
              <div className="flex flex-col items-center gap-3 mt-4">
                <button
                  onClick={handleSubmit(handleLogin)}
                  type="submit"
                  disabled={!isValid || isPending}
                  className="cursor-pointer relative after:content-[attr(data-label)] after:text-white after:absolute after:text-nowrap after:scale-0 hover:after:scale-100 after:duration-200 w-12 h-12 rounded-full border-3 border-blue-200 bg-black flex items-center justify-center duration-300 hover:rounded-[40px] hover:w-28 group/button overflow-hidden active:scale-90 disabled:opacity-50 disabled:cursor-not-allowed"
                  data-label={translations.login}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    className="w-6 h-6 fill-white delay-50 duration-200 group-hover/button:translate-x-30"
                  >
                    <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"></path>
                  </svg>
                </button>
                <span className="text-sm font-semibold uppercase text-gray-500">
                  {translations.cantSignIn}
                </span>

                <button
                  type="button"
                  onClick={onToggle}
                  className="cursor-pointer text-sm font-semibold uppercase underline-offset-4 hover:underline text-gray-900"
                >
                  {translations.createAccount}
                </button>
              </div>
            </div>
          </form>
    </div>
  );
}
