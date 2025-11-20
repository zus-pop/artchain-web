"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";

interface FloatingInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const FloatingInput = React.forwardRef<HTMLInputElement, FloatingInputProps>(
  ({ className, label, error, id, type, ...props }, ref) => {
    const generatedId = React.useId();
    const inputId = id || `floating-input-${generatedId}`;
    const [showPassword, setShowPassword] = useState(false);

    const toggleShowPassword = () => setShowPassword(!showPassword);

    const inputType = type === "password" ? (showPassword ? "text" : "password") : type;

    return (
      <div className="relative w-full">
        <div className="relative group">
          <span
            className={cn(
              "absolute -left-0.5 top-2 bottom-2 w-1.5 rounded bg-linear-to-b transition-all duration-300 group-focus-within:opacity-100",
              error
                ? "from-red-500 to-red-600 opacity-100"
                : // Thay đổi: Gradient từ đỏ sang vàng
                  "from-red-500 to-yellow-500 opacity-70"
            )}
          ></span>
          <input
            ref={ref}
            id={inputId}
            type={inputType}
            className={cn(
              "peer w-full pl-6 pr-12 pt-6 pb-2 text-sm text-gray-800 bg-white border rounded-lg shadow-md focus:border-transparent focus:ring-2 focus:outline-none transition-all duration-300 delay-200 placeholder-transparent",
              error
                ? "border-red-300 focus:ring-red-300"
                : // Thay đổi: Viền focus màu vàng
                  "border-gray-200 focus:ring-yellow-300",
              className
            )}
            placeholder=""
            {...props}
          />
          <label
            htmlFor={inputId}
            className={cn(
              "absolute left-6 top-3.5 text-sm transition-all duration-200 ease-in-out peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-1 peer-focus:text-sm peer-focus:font-semibold cursor-text",
              error
                ? "text-red-500 peer-focus:text-red-500"
                : // Thay đổi: Chữ label khi focus có màu đỏ
                  "text-gray-500 peer-focus:text-red-500"
            )}
          >
            {label}
          </label>

          {/* Password Toggle Icon */}
          {type === "password" && (
            <div
              className="w-10 absolute top-0 bottom-0 right-0 flex items-center justify-center cursor-pointer text-gray-500 hover:text-gray-700"
              onClick={toggleShowPassword}
            >
              {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
            </div>
          )}
        </div>

        {/* Error message below input */}
        {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
      </div>
    );
  }
);

FloatingInput.displayName = "FloatingInput";

export { FloatingInput };
