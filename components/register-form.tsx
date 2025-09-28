"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FloatingInput } from "@/components/ui/floating-input";
import { Checkbox } from "@/components/ui/checkbox";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRegisterMutation } from "../apis/auth";
import { useTranslation } from "@/lib/i18n";
import { useLanguageStore } from "@/store/language-store";

const schema = z
  .object({
    username: z
      .string({ message: "Username is required" })
      .trim()
      .nonempty("Username is required"),
    password: z
      .string({ message: "Password is required" })
      .trim()
      .nonempty("Password is required"),
    confirmPassword: z
      .string({ message: "Confirmed Password is required" })
      .trim()
      .nonempty("Confirmed Password is required"),
    email: z.email("Need the right format email"),
    acceptTerms: z.boolean().optional(),
    receiveEmails: z.boolean().optional(),
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: "custom",
        message: "The passwords did not match",
        path: ["confirmPassword"],
      });
    }
  });

type Schema = z.infer<typeof schema>;
export function RegisterForm({
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
      email: "",
      confirmPassword: "",
      acceptTerms: false,
      receiveEmails: false,
    },
  });
  const { mutate, isPending } = useRegisterMutation(onToggle);

  //   Form dưới này bỏ đi
  const [formData, setFormData] = useState({
    fullname: "",
    username: "",
    password: "",
    phoneNumber: "",
    acceptTerms: false,
    receiveEmails: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleRegister = (data: Schema) => {
    mutate({
      username: data.username,
      password: data.password,
      email: data.email,
    });
  };

  return (
    <div
      className={cn("flex flex-col gap-3 w-full mx-auto", className)}
      {...props}
    >
      <Card className="overflow-hidden p-0 bg-white">
        <CardContent className="grid p-0">
          <form className="p-4 md:p-6 flex flex-col items-center justify-center">
            <div className="flex flex-col items-center text-center mb-4 w-full max-w-xs md:max-w-sm">
              <h1 className="text-3xl font-bold text-gray-900 mb-3">{translations.signUp}</h1>
            </div>

            <div className="flex flex-col gap-3 w-full max-w-xs md:max-w-sm">
              {/* Email field */}
              <div className="grid gap-1">
                <Controller
                  control={control}
                  name="email"
                  render={({ field }) => (
                    <FloatingInput
                      type="email"
                      label={translations.email}
                      error={errors.email?.message}
                      {...field}
                    />
                  )}
                />
              </div>

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

              {/* Confirm password field */}
              <div className="grid gap-1">
                <Controller
                  control={control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FloatingInput
                      type="password"
                      label={translations.confirmPassword}
                      error={errors.confirmPassword?.message}
                      {...field}
                    />
                  )}
                />
              </div>

              <div className="h-px bg-gray-400 my-1 w-full" />

              {/* Checkboxes */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="acceptTerms"
                    checked={formData.acceptTerms}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({
                        ...prev,
                        acceptTerms: checked as boolean,
                      }))
                    }
                    className="data-[state=checked]:bg-black data-[state=checked]:border-black [&[data-state=checked]]:bg-black [&[data-state=checked]]:border-black"
                    style={
                      {
                        "--tw-bg-opacity": "1",
                        backgroundColor: formData.acceptTerms
                          ? "rgb(0 0 0 / var(--tw-bg-opacity))"
                          : undefined,
                        borderColor: formData.acceptTerms
                          ? "rgb(0 0 0 / var(--tw-bg-opacity))"
                          : undefined,
                      } as React.CSSProperties
                    }
                    required
                  />
                  <span
                    className="text-sm text-gray-700"
                  >
                    I agree to the{" "}
                    <a className="text-blue-500 hover:text-blue-700" href="#">
                      terms
                    </a>{" "}
                    and{" "}
                    <a className="text-blue-500 hover:text-blue-700" href="#">
                      privacy policy
                    </a>
                  </span>
                </div>
              </div>

              {/* Button section */}
              <div className="flex flex-col items-center gap-3 mt-4">
                <button
                  onClick={handleSubmit(handleRegister)}
                  type="submit"
                  disabled={!isValid || isPending}
                  className="cursor-pointer relative after:content-[attr(data-label)] after:text-white after:absolute after:text-nowrap after:scale-0 hover:after:scale-100 after:duration-200 w-12 h-12 rounded-full border-3 border-blue-200 bg-black flex items-center justify-center duration-300 hover:rounded-[40px] hover:w-28 group/button overflow-hidden active:scale-90 disabled:opacity-50 disabled:cursor-not-allowed"
                  data-label={translations.signUp}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    className="w-6 h-6 fill-white delay-50 duration-200 group-hover/button:translate-x-30"
                  >
                    <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"></path>
                  </svg>
                </button>

                <button
                  type="button"
                  onClick={onToggle}
                  className="cursor-pointer text-sm font-semibold uppercase underline-offset-4 hover:underline text-gray-900"
                >
                  {translations.alreadyHaveAccount}
                </button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
