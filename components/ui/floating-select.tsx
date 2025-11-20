import React from "react";
import { cn } from "@/lib/utils";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  options: { value: string; label: string }[];
}

export const FloatingSelect = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, className, ...props }, ref) => {
    return (
      <div className="relative">
        <select
          ref={ref}
          className={cn(
            "peer w-full px-4 pt-6 pb-2 text-base bg-white border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors",
            error && "border-red-500 focus:border-red-500",
            className
          )}
          {...props}
        >
          <option value="">{`Chọn ${label}`}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <label className="absolute left-4 top-2 text-xs text-gray-500 transition-all pointer-events-none">
          {label}
        </label>

        {error && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="group relative">
              <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs cursor-pointer">
                !
              </div>
              <div className="absolute bottom-full right-0 mb-2 w-48 p-2 bg-red-500 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                {error}
                <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-red-500"></div>
              </div>
            </div>
          </div>
        )}

        {/* Error message below select */}
        {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
      </div>
    );
  }
);

FloatingSelect.displayName = "FloatingSelect";
