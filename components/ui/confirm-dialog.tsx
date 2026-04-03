"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  cancelText?: string;
  confirmText?: string;
  variant?: "primary" | "destructive" | "warning";
  isLoading?: boolean;
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  cancelText = "Hủy",
  confirmText = "Xác nhận",
  variant = "primary",
  isLoading = false,
}: ConfirmDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !isLoading && !open && onClose()}>
      <DialogContent className="sm:max-w-[440px] border-none shadow-2xl p-0 overflow-hidden bg-[#fffdf9]">
        <div className={cn(
          "h-2 w-full",
          variant === "destructive" ? "bg-red-500" : 
          variant === "warning" ? "bg-orange-500" : "bg-orange-500"
        )} />
        
        <div className="p-6">
          <DialogHeader className=" space-y-3">
            <DialogTitle className="text-xl font-black text-[#1a1a1a] uppercase tracking-tight">
              {title}
            </DialogTitle>
            <DialogDescription className="text-base text-gray-600 font-medium leading-relaxed">
              {description}
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter className="mt-8 gap-3 sm:gap-0">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 sm:flex-none border-2 border-[#e6e2da] hover:bg-gray-50 text-gray-700 font-bold uppercase tracking-widest text-xs h-11"
            >
              {cancelText}
            </Button>
            <Button
              variant={variant === "destructive" ? "destructive" : "default"}
              onClick={onConfirm}
              disabled={isLoading}
              className={cn(
                "flex-[2] sm:flex-none font-black uppercase tracking-widest text-xs h-11 shadow-lg shadow-gray-200/50",
                variant === "warning" && "bg-orange-500 hover:bg-orange-600 text-white",
                variant === "primary" && "bg-orange-500 hover:bg-orange-600 text-white"
              )}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Đang xử lý...</span>
                </div>
              ) : (
                confirmText
              )}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
