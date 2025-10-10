"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface AnimatedNavButtonProps {
  direction: "back" | "continue";
  onClick: () => void;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
}

export function AnimatedNavButton({
  direction,
  onClick,
  disabled = false,
  className,
  children,
  ...props
}: AnimatedNavButtonProps) {
  const isBack = direction === "back";
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "bg-white text-center w-48 rounded-2xl h-14 relative text-black text-xl font-semibold group transition-all duration-300",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
      type="button"
      {...props}
    >
      <div
        className={cn(
          "bg-red-400 rounded-xl h-12 w-1/4 flex items-center justify-center absolute top-[4px] group-hover:w-[184px] z-10 duration-500",
          isBack ? "left-1" : "right-1"
        )}
      >
        {isBack ? (
          // Back Arrow (Left Arrow)
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1024 1024"
            height="25px"
            width="25px"
          >
            <path
              d="M224 480h640a32 32 0 1 1 0 64H224a32 32 0 0 1 0-64z"
              fill="#000000"
            />
            <path
              d="m237.248 512 265.408 265.344a32 32 0 0 1-45.312 45.312l-288-288a32 32 0 0 1 0-45.312l288-288a32 32 0 1 1 45.312 45.312L237.248 512z"
              fill="#000000"
            />
          </svg>
        ) : (
          // Continue Arrow (Right Arrow)  
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1024 1024"
            height="25px"
            width="25px"
          >
            <path
              d="M800 544H160a32 32 0 1 1 0-64h640a32 32 0 0 1 0 64z"
              fill="#000000"
            />
            <path
              d="m786.752 512-265.408-265.344a32 32 0 0 1 45.312-45.312l288 288a32 32 0 0 1 0 45.312l-288 288a32 32 0 1 1-45.312-45.312L786.752 512z"
              fill="#000000"
            />
          </svg>
        )}
      </div>
      <p className={cn(
        "transition-transform duration-300",
        isBack ? "translate-x-2" : "-translate-x-2"
      )}>
        {children}
      </p>
    </button>
  );
}