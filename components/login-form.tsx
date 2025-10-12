"use client";

import { useLoginMutation } from "@/hooks/useLoginMutation";
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
    mutate({
      username: data.username,
      password: data.password,
    });
  };

  return (
    <div
      className={cn("flex flex-col gap-3 w-full mx-auto", className)}
      {...props}
    >
      <form className="p-4 md:p-6 flex flex-col items-center justify-center">
        <div className="flex flex-col items-center text-center mb-4 w-full max-w-xs md:max-w-sm">
          <h1 className="text-3xl font-bold text-gray-800 mb-3">
            {translations.signIn}
          </h1>
        </div>
        <div className="flex flex-col gap-3 w-full max-w-xs md:max-w-sm">
          {/* ... Các trường input không đổi */}
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
          {/* Thay đổi: Dùng màu border cho đường kẻ */}
          <div className="h-px bg-border my-1 w-full" />

          <label
            className="relative flex cursor-pointer items-center gap-2"
            htmlFor="star"
          >
            <div className="relative h-[2em] w-[2em]">
              <input
                className="peer appearance-none"
                id="star"
                name="star"
                type="checkbox"
              />
              {/* Thay đổi: Dùng màu secondary cho viền checkbox */}
              <span className="absolute left-1/2 top-1/2 h-[1em] w-[1em] -translate-x-1/2 -translate-y-1/2 rounded-[0.25em] border-[1px] border-black"></span>
              <svg
                // Thay đổi: Stroke mặc định là secondary, khi check là primary
                className="absolute left-1/2 top-1/2 h-[2em] w-[2em] -translate-x-1/2 -translate-y-1/2 stroke-black duration-500 ease-out [stroke-dasharray:100] [stroke-dashoffset:100] peer-checked:stroke-black peer-checked:[stroke-dashoffset:0]"
                viewBox="0 0 38 37"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Thay đổi: Bỏ stroke cố định, để SVG cha quyết định */}
                <path
                  d="M6.617 36.785c-.676-5.093 4.49-10.776 6.318-14.952 1.887-4.31 4.315-10.701 6.055-15.506C20.343 2.59 20.456.693 20.57.789c3.262 2.744 1.697 10.518 2.106 14.675 1.926 19.575 4.62 12.875-7.635 4.43C12.194 17.933 2.911 12.1 1.351 8.82c-1.177-2.477 5.266 0 7.898 0 2.575 0 27.078-1.544 27.907-1.108.222.117-.312.422-.526.554-1.922 1.178-3.489 1.57-5.266 3.046-3.855 3.201-8.602 6.002-12.11 9.691-4.018 4.225-5.388 10.245-11.321 10.245"
                  strokeWidth="1.5px"
                  pathLength={100}
                />
              </svg>
            </div>

            {/* Thay đổi: Dùng màu muted-foreground cho text phụ */}
            <p className="text-sm text-muted-foreground">
              {/* {translations.staySignedIn} */}
              Stay signed in
            </p>
          </label>

          <div className="flex flex-col items-center gap-3 mt-4">
            <button
              onClick={handleSubmit(handleLogin)}
              type="submit"
              disabled={!isValid || isPending}
              // Thay đổi: Dùng màu primary và primary-foreground cho nút
              className="group/button relative flex h-12 w-12 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-primary duration-300 hover:w-28 hover:rounded-[40px] active:scale-90 disabled:cursor-not-allowed disabled:opacity-50 after:absolute after:text-nowrap after:text-primary-foreground after:content-[attr(data-label)] after:scale-0 after:duration-200 hover:after:scale-100"
              data-label={translations.login}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                // Thay đổi: Fill icon bằng màu primary-foreground
                className="h-6 w-6 fill-primary-foreground duration-200 delay-50 group-hover/button:translate-x-30"
              >
                <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"></path>
              </svg>
            </button>
            {/* Thay đổi: Dùng màu muted-foreground cho text phụ */}
            <span className="text-sm font-semibold uppercase text-muted-foreground">
              {translations.cantSignIn}
            </span>

            <button
              type="button"
              onClick={onToggle}
              // Thay đổi: Dùng màu foreground chính
              className="cursor-pointer text-sm font-semibold uppercase text-foreground underline-offset-4 hover:underline"
            >
              {translations.createAccount}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}