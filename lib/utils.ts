import { Language } from "@/store/language-store";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format currency amount to Vietnamese locale (VND)
 * @param amount - The amount to format
 * @returns Formatted currency string
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
}

/**
 * Format number to Vietnamese locale
 * @param number - The number to format
 * @returns Formatted number string
 */
export function formatNumber(number: number): string {
  return new Intl.NumberFormat("vi-VN").format(number);
}

/**
 * Format date to the specified locale
 * @param dateString - The date string to format
 * @param locale - The locale string (e.g., "vi-VN", "en-US")
 * @param showTime - Whether to include time in the format
 * @returns Formatted date string
 */
export function formatDate({
  dateString,
  locale = "vi-VN",
  showTime = false,
  language = "vi",
}: {
  dateString: string;
  language?: Language;
  locale?: string;
  showTime?: boolean;
}): string {
  if (language === "en") {
    locale = "en-US";
  }
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    dateStyle: "medium",
    ...(showTime && { timeStyle: "short" }),
  };
  return date.toLocaleString(locale, options);
}

/**
 * Format date to YYYY-MM-DD format for HTML date inputs
 * @param dateString - The date string to format
 * @returns Date string in YYYY-MM-DD format
 */
export function formatDateForInput(dateString: string): string {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
