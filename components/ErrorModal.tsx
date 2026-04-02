"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useEffect, useMemo, useState } from "react";

interface ErrorModalProps {
  title: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  errorMessage: string;
  confirmQuestion?: string;
  onConfirmUpload?: () => void;
  onResubmit?: () => void;
  confirmKeyword?: string;
}

export function ErrorModal({
  title,
  isOpen,
  onOpenChange,
  errorMessage,
  confirmQuestion = "Bạn có muốn vẫn gửi bài thi hiện tại hay nộp lại tranh mới?",
  onConfirmUpload,
  onResubmit,
  confirmKeyword = "GỬI BÀI THI",
}: ErrorModalProps) {
  const [confirmText, setConfirmText] = useState("");

  const isConfirmEnabled = useMemo(() => {
    if (!confirmKeyword) return true;
    return confirmText.trim() === confirmKeyword;
  }, [confirmKeyword, confirmText]);

  useEffect(() => {
    if (isOpen) {
      setConfirmText("");
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="border-[#FF6E1A]/30 bg-[#fffdf9]">
        <DialogHeader>
          <DialogTitle className="text-lg text-[#FF6E1A]">{title}</DialogTitle>
          <DialogDescription className="mt-2 text-base text-foreground">
            <span className="font-semibold text-lg text-[#FF6E1A]">
              Lý do:{" "}
            </span>
            <span>{errorMessage}</span>
          </DialogDescription>
          <DialogDescription className="mt-2 text-sm text-foreground">
            {confirmQuestion}
          </DialogDescription>

          <div className="mt-2 space-y-2">
            <p className="text-sm text-foreground">
              Nhập <span className="font-semibold">{confirmKeyword}</span> để
              tiếp tục gửi bài thi hiện tại.
            </p>
            <Input
              value={confirmText}
              onChange={(event) => setConfirmText(event.target.value)}
              placeholder={confirmKeyword}
              className="border-[#e6e2da] focus-visible:ring-[#FF6E1A]/30 focus-visible:border-[#FF6E1A]"
            />
          </div>
        </DialogHeader>

        <DialogFooter>
          <DialogClose asChild>
            <Button
              type="button"
              variant="outline"
              className="border-[#FF6E1A]/40 text-[#FF6E1A] hover:border-[#FF6E1A] hover:bg-[#ffe7d3] hover:text-[#d95f13]"
              onClick={onResubmit}
            >
              Nộp lại tranh mới
            </Button>
          </DialogClose>
          <Button
            type="button"
            className="bg-[#FF6E1A] text-white hover:bg-[#e85f11]"
            onClick={onConfirmUpload}
            disabled={!isConfirmEnabled}
          >
            Vẫn gửi bài thi này
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
