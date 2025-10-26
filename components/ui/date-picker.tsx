"use client";

import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerProps {
  date?: Date;
  onDateChange?: (date: Date | undefined) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
}

export function DatePicker({
  date,
  onDateChange,
  placeholder = "Chọn ngày",
  label,
  error,
  disabled = false,
  className,
}: DatePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const generatedId = React.useId();
  const inputId = `date-picker-${generatedId}`;

  const handleDateSelect = (selectedDate: Date | undefined) => {
    onDateChange?.(selectedDate);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full">
      <div className="relative group">
        <span
          className={cn(
            "absolute -left-0.5 top-2 bottom-2 w-1.5 rounded bg-linear-to-b transition-all duration-300 group-focus-within:opacity-100",
            error
              ? "from-red-500 to-red-600 opacity-100"
              : "from-red-500 to-yellow-500 opacity-70"
          )}
        ></span>

        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button
              id={inputId}
              variant="outline"
              disabled={disabled}
              className={cn(
                "peer w-full pl-6 pr-12 p-4 h-auto text-sm text-gray-800 bg-white border rounded-lg shadow-md focus:border-transparent focus:ring-2 focus:outline-none transition-all duration-300 delay-200 justify-start text-left font-normal placeholder-transparent",
                !date && "text-muted-foreground",
                error
                  ? "border-red-300 focus:ring-red-300"
                  : "border-gray-200 focus:ring-yellow-300",
                className
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "dd/MM/yyyy") : placeholder}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleDateSelect}
              disabled={(date) =>
                date > new Date() || date < new Date("1900-01-01")
              }
              initialFocus
            />
          </PopoverContent>
        </Popover>

        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              "absolute left-6 top-3.5 text-sm transition-all duration-200 ease-in-out peer-focus:top-1 peer-focus:text-sm peer-focus:font-semibold cursor-text",
              date || isOpen
                ? "top-1 text-sm font-semibold"
                : "top-3.5 text-base text-gray-400",
              error
                ? "text-red-500 peer-focus:text-red-500"
                : "text-gray-500 peer-focus:text-red-500"
            )}
          >
            {label}
          </label>
        )}

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
    </div>
  );
}
