"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface AnimatedRoleCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  isSelected: boolean;
  onClick: () => void;
  className?: string;
}

export function AnimatedRoleCard({
  title,
  description,
  icon,
  isSelected,
  onClick,
  className,
}: AnimatedRoleCardProps) {
  return (
    <div
      className={cn(
        "relative h-32 w-full bg-white rounded-2xl overflow-hidden cursor-pointer group p-4 z-0 border-2 transition-all duration-300 bg-border border-gray-200 ",
        isSelected 
          ? "border-blue-500 shadow-lg" 
          : "border-gray-200 hover:border-blue-300 hover:shadow-md",
        className
      )}
      onClick={onClick}
    >
      {/* Animated circle background */}
      <div
        className={cn(
          "absolute h-20 w-20 -top-10 -right-10 rounded-full bg-blue-500 transition-transform duration-500 z-[-1]",
          isSelected || "group-hover:scale-[800%]"
        )}
        style={{
          transform: isSelected ? "scale(800%)" : undefined,
        }}
      />

      {/* Selection indicator */}
      {/* <div className="absolute top-3 right-3">
        <div className={cn(
          "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300",
          isSelected
            ? "border-white bg-white"
            : "border-gray-300 group-hover:border-white"
        )}>
          {isSelected && (
            <div className="w-3 h-3 bg-blue-500 rounded-full" />
          )}
        </div>
      </div> */}

      {/* More Info Button */}
      <button
        className={cn(
          "text-xs absolute bottom-3 left-4 transition-all duration-500",
          isSelected 
            ? "text-white" 
            : "text-blue-600 group-hover:text-white"
        )}
      >
        <span
          className={cn(
            "relative before:h-[0.16em] before:absolute before:w-full before:content-[''] before:bottom-0 before:left-0 before:transition-colors before:duration-300",
            isSelected
              ? "before:bg-white"
              : "before:bg-blue-600 group-hover:before:bg-white"
          )}
        >
        </span>
        <i className="fa-solid fa-arrow-right ml-1"></i>
      </button>

      {/* Icon and Content */}
      <div className="flex items-start gap-3 h-full">
        <div className={cn(
          "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 mt-1",
          isSelected 
            ? "bg-white/20" 
            : "bg-blue-100 group-hover:bg-white/20"
        )}>
          <div className={cn(
            "transition-colors duration-500",
            isSelected 
              ? "text-white" 
              : "text-blue-600 group-hover:text-white"
          )}>
            {icon}
          </div>
        </div>
        
        <div className="flex-1">
          <h3 className={cn(
            "font-bold text-lg leading-tight transition-colors duration-500",
            isSelected 
              ? "text-white" 
              : "text-gray-900 group-hover:text-white"
          )}>
            {title}
          </h3>
          <p className={cn(
            "text-sm mt-1 transition-colors duration-500",
            isSelected 
              ? "text-white/90" 
              : "text-gray-600 group-hover:text-white/90"
          )}>
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}