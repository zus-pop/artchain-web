"use client";

import React from "react";
import Link from "next/link";

interface InteractiveHeroButtonProps {
  href: string;
  label: string;
  variant?: "primary" | "secondary";
  className?: string;
}

/**
 * InteractiveHeroButton
 * 
 * A specialized button for the Hero section with a sliding color fill effect.
 * Adapted from the user-provided style but integrated with ArtChain's theme.
 */
export const InteractiveHeroButton: React.FC<InteractiveHeroButtonProps> = ({
  href,
  label,
  variant = "primary",
  className = "",
}) => {
  return (
    <Link
      href={href}
      className={`
        relative flex items-center justify-center gap-3 px-6 sm:px-8 py-3 sm:py-3.5 
        overflow-hidden border-[0.5px] rounded-sm group shadow-lg text-[var(--site-ink)]
        transition-all duration-500 backdrop-blur-md font-semibold text-sm sm:text-base
        ${
          variant === "primary"
            ? "bg-[var(--site-surface)] border-[var(--site-ink)]/10 text-[var(--site-ink)]"
            : "bg-transparent border-black/20 text-black hover:border-black/40"
        }
        hover:text-white
        
        /* The Sliding Fill Effect */
        before:absolute before:inset-0 before:w-full before:h-full 
        before:transition-all before:duration-700 before:-left-full 
        before:bg-[var(--site-accent)] before:-z-10 before:aspect-square 
        hover:before:left-0 hover:before:scale-150
        ${className}
      `}
    >
      <span className="relative z-10 flex items-center gap-2.5">
        {label}
        <svg
          className={`w-7 h-7 sm:w-8 sm:h-8 group-hover:rotate-90 group-hover:bg-[var(--site-accent)] ease-linear duration-300 rounded-full border p-1.5 rotate-45 transition-all
            ${variant === "primary" 
              ? "bg-white text-[var(--site-ink)] border-[var(--site-ink)]/10 group-hover:border-none" 
              : "bg-white text-black border-black/10 group-hover:border-none"
            }
          `}
          viewBox="0 0 16 19"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M7 18C7 18.5523 7.44772 19 8 19C8.55228 19 9 18.5523 9 18H7ZM8.70711 0.292893C8.31658 -0.0976311 7.68342 -0.0976311 7.29289 0.292893L0.928932 6.65685C0.538408 7.04738 0.538408 7.68054 0.928932 8.07107C1.31946 8.46159 1.95262 8.46159 2.34315 8.07107L8 2.41421L13.6569 8.07107C14.0474 8.46159 14.6805 8.46159 15.0711 8.07107C15.4616 7.68054 15.4616 7.04738 15.0711 6.65685L8.70711 0.292893ZM9 18L9 1H7L7 18H9Z"
            className={`group-hover:fill-white transition-colors duration-300 ${
              variant === "primary" ? "fill-[var(--site-ink)]" : "fill-black"
            }`}
          />
        </svg>
      </span>
    </Link>
  );
};

export default InteractiveHeroButton;
