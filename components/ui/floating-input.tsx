"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface FloatingInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const FloatingInput = React.forwardRef<HTMLInputElement, FloatingInputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const generatedId = React.useId();
    const inputId = id || `floating-input-${generatedId}`;

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

          {/* Error Icon with Tooltip */}
          {error && (
            <div className="group/error w-10 absolute top-0 bottom-0 right-0 flex items-center justify-center text-red-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1rem"
                height="1rem"
                strokeLinejoin="round"
                strokeLinecap="round"
                viewBox="0 0 24 24"
                strokeWidth="2"
                fill="none"
                stroke="currentColor"
                className="cursor-pointer"
              >
                <path fill="none" d="M0 0h24v24H0z" stroke="none"></path>
                <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0"></path>
                <path d="M12 8v4"></path>
                <path d="M12 16h.01"></path>
              </svg>
              <span className="text-xs absolute cursor-default select-none rounded-md px-2 py-1 bg-red-500 text-white opacity-0 right-0 top-0 z-50 transition-all duration-300 group-hover/error:opacity-100 group-hover/error:-translate-y-full group-hover/error:-translate-x-2 whitespace-nowrap shadow-lg">
                {error}
              </span>
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
