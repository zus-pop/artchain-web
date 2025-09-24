"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export function LoginForm({
  className,
  onToggle,
  ...props
}: React.ComponentProps<"div"> & {
  onToggle?: () => void;
}) {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    staySignedIn: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login:", formData);
  };

  return (
    <div
      className={cn("flex flex-col gap-6 w-full mx-auto", className)}
      {...props}
    >
      <Card className="overflow-hidden p-0 bg-white">
        {/* Giữ nguyên grid-cols-2 cho bố cục 2 cột */}
        <CardContent className="grid p-0">
          <form onSubmit={handleSubmit} className="p-6 md:p-8 flex flex-col items-center justify-center">
            <div className="flex flex-col items-center text-center mb-8 w-full max-w-xs md:max-w-sm">
              <h1 className="text-5xl font-bold text-gray-900 mb-5">Sign in</h1>
            </div>
            {/* Sử dụng w-full max-w-xs/sm để giới hạn chiều rộng của form bên trong cột */}
            <div className="flex flex-col gap-6 w-full max-w-xs md:max-w-sm">
              {/* Username field */}
              <div className="grid gap-3">
                <Label
                  htmlFor="username"
                  className="text-xs font-semibold uppercase text-gray-700"
                >
                  Username
                </Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="Enter your username"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                  className="bg-input text-gray-900 border-border placeholder:text-gray-400 h-12"
                />
              </div>
              
              {/* Password field */}
              <div className="grid gap-3">
                <Label
                  htmlFor="password"
                  className="text-xs font-semibold uppercase text-gray-700"
                >
                  Password
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="bg-input text-gray-900 border-border placeholder:text-gray-400 h-12"
                />
              </div>
              <div className="h-px bg-gray-400 my-2 w-full" />
              {/* Checkbox "Stay signed in" */}
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="stay-signed-in" 
                  checked={formData.staySignedIn}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({ ...prev, staySignedIn: checked as boolean }))
                  }
                  className="data-[state=checked]:bg-black data-[state=checked]:border-black"
                />
                <Label htmlFor="stay-signed-in" className="text-sm text-gray-700">
                  Stay signed in
                </Label>
              </div>

              {/* Nút mũi tên và văn bản dưới cùng */}
              <div className="flex flex-col items-center gap-4 mt-8">
                <button
                  type="submit"
                  className="cursor-pointer relative after:content-['Login'] after:text-white after:absolute after:text-nowrap after:scale-0 hover:after:scale-100 after:duration-200 w-16 h-16 rounded-full border-4 border-rose-200 bg-black flex items-center justify-center duration-300 hover:rounded-[50px] hover:w-36 group/button overflow-hidden active:scale-90"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    className="w-8 h-8 fill-white delay-50 duration-200 group-hover/button:translate-x-30"
                  >
                    <path
                      d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"
                    ></path>
                  </svg>
                </button>
                <span className="text-sm font-semibold uppercase text-gray-500">
                  {"Can't sign in?"}
                </span>

                <button
                  type="button"
                  onClick={onToggle}
                  className="cursor-pointer text-sm font-semibold uppercase underline-offset-4 hover:underline text-gray-900"
                >
                  Create account
                </button>
              </div>
            </div>
          </form>

          {/* Cột hình ảnh - Thay bằng DatingProfileScroller */}
          {/* <div className="bg-muted relative hidden md:flex items-center justify-center p-4">
            <DatingProfileScroller />
          </div> */}
        </CardContent>
      </Card>
    </div>
  );
}
