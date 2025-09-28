"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface FloatingInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const FloatingInput = React.forwardRef<HTMLInputElement, FloatingInputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const inputId = id || `floating-input-${Math.random().toString(36).substr(2, 9)}`;
    
    return (
      <div className="relative w-full">
        <div className="relative group">
          <span className="absolute -left-0.5 top-2 bottom-2 w-1.5 rounded bg-gradient-to-b from-blue-500 to-purple-500 opacity-70 transition-all duration-300 group-focus-within:opacity-100"></span>
          <input
            ref={ref}
            id={inputId}
            className={cn(
              "peer w-full pl-6 pr-4 pt-6 pb-2 text-sm text-gray-800 bg-white border border-gray-200 rounded-lg shadow-md focus:border-transparent focus:ring-2 focus:ring-blue-300 focus:outline-none transition-all duration-300 delay-200 placeholder-transparent",
              error && "border-red-300 focus:ring-red-300",
              className
            )}
            placeholder=""
            {...props}
          />
          <label
            htmlFor={inputId}
            className={cn(
              "absolute left-6 top-3.5 text-sm text-gray-500 transition-all duration-200 ease-in-out peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-1 peer-focus:text-sm peer-focus:font-semibold cursor-text",
              error ? "peer-focus:text-red-500" : "peer-focus:text-blue-500"
            )}
          >
            {label}
          </label>
        </div>
        {error && (
          <span className="text-red-400 text-xs mt-1 block">{error}</span>
        )}
      </div>
    );
  }
);

FloatingInput.displayName = "FloatingInput";

export { FloatingInput };