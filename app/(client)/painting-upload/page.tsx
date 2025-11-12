"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useUploadPainting } from "@/hooks/use-upload-painting";
import { useUserById } from "@/hooks/use-user-by-id";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconChevronLeft, IconTrash, IconUpload } from "@tabler/icons-react";
import { School } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { useAuth } from "../../../hooks";
import Loader from "@/components/Loaders";

const SIZE = 10;
//                     B      KB    MB
const MAX_FILE_SIZE = 1024 * 1024 * SIZE;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const paintingUploadSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, "Tiêu đề bài thi phải có ít nhất 2 ký tự")
    .max(100, "Tiêu đề bài thi không được vượt quá 100 ký tự"),
  description: z
    .string()
    .trim()
    .max(500, "Mô tả không được vượt quá 500 ký tự")
    .optional(),
  image: z
    .instanceof(File, { message: "Vui lòng chọn ảnh tranh vẽ" })
    .refine(
      (file) => file.size <= MAX_FILE_SIZE,
      `Kích thước ảnh không được vượt quá ${SIZE}MB`
    )
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
      `Chỉ hỗ trợ định dạng: ${ACCEPTED_IMAGE_TYPES.map(
        (t) => `.${t.substring(t.indexOf("/") + 1)}`
      ).join(", ")}`
    )
    .optional(),
});

type PaintingUploadForm = z.infer<typeof paintingUploadSchema>;

export default function PaintingUploadSuspense() {
  return (
    <Suspense>
      <PaintingUpload />
    </Suspense>
  );
}

function PaintingUpload() {
  const router = useRouter();
  const params = useSearchParams();
  const contestId = params.get("contestId");
  const roundId = params.get("roundId");
  const competitorId = params.get("competitorId");

  const { control, handleSubmit, formState, setValue, watch } =
    useForm<PaintingUploadForm>({
      mode: "all",
      resolver: zodResolver(paintingUploadSchema),
      defaultValues: {
        title: "",
      },
    });
  const { isAuthenticated } = useAuth();
  const { data: currentUser, isLoading, isError } = useUserById(competitorId);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const { mutate, isPending } = useUploadPainting();

  // Watch the image field to update preview
  const watchedImage = watch("image");

  // Update preview when image changes
  useEffect(() => {
    if (watchedImage && watchedImage instanceof File) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(watchedImage);
    } else {
      setImagePreview(null);
    }
  }, [watchedImage]);

  const removeImage = () => {
    setValue("image", undefined);
    setImagePreview(null);
  };

  const onSubmit = async (data: PaintingUploadForm) => {
    if (!data.image) {
      toast.error("Vui lòng chọn ảnh tranh vẽ để gửi bài thi");
      return;
    }

    if (!contestId) {
      toast.error("Thiếu thông tin cuộc thi");
      return;
    }

    if (!currentUser?.userId) {
      toast.error("Không tìm thấy thông tin người dùng");
      return;
    }

    mutate({
      title: data.title,
      description: data.description,
      file: data.image,
      contestId: contestId,
      roundId: roundId!,
      competitorId: currentUser.userId.toString(),
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-muted-foreground mb-4">
                Bạn cần đăng nhập trước khi có thể tham dự cuộc thi
              </p>
              <Button onClick={() => router.push("/auth")} className="w-full">
                Đăng nhập
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-muted-foreground mb-4">
                Không thể tải thông tin người dùng. Vui lòng thử lại.
              </p>
              <Button onClick={() => router.refresh()} className="w-full">
                Thử lại
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fdfcf9] py-8 px-6 relative overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#FF6E1A] rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container pt-25 max-w-7xl mx-auto relative z-10">
        {/* === START MODIFIED HEADER SECTION: Back Button | Title/Icon === */}
        <div className="mb-10 flex items-center justify-between relative border-b border-[#e6e2da] pb-4">
          {/* 1. Back Button (Left) - ĐÃ CẬP NHẬT STYLE */}
          <Button
            type="button"
            variant="ghost"
            onClick={() => router.back()}
            className="h-10 px-0 text-gray-700 hover:text-[#FF6E1A] transition-all duration-200 cursor-pointer 
                       flex items-center gap-1 font-semibold hover:underline bg-transparent hover:bg-transparent"
          >
            <IconChevronLeft className="h-5 w-5" />
            <span>Quay lại</span>
          </Button>

          {/* 2. Title and Icon (Right) */}
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight hidden sm:block">
              Nộp Bài Thi
            </h1>
          </div>
        </div>
        {/* === END MODIFIED HEADER SECTION === */}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            {/* Left Side - Text Content */}
            <div className="flex flex-col h-full">
              {/* Title Input */}
              <Card className="border border-[#e6e2da] shadow-md bg-[#fffdf9] rounded-none overflow-hidden flex-1">
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <Label
                      htmlFor="title"
                      className="text-base font-bold flex items-center gap-3 text-gray-900"
                    >
                      <div className="w-2 h-2 bg-[#FF6E1A] rounded-full shadow-sm"></div>
                      Tiêu đề tác phẩm
                      <span className="text-[#FF6E1A]">*</span>
                    </Label>
                    <Controller
                      control={control}
                      name="title"
                      render={({ field }) => (
                        <Input
                          id="title"
                          placeholder="Ví dụ: 'Bức tranh về ước mơ tuổi thơ'..."
                          maxLength={100}
                          className="text-base h-12 border border-[#e6e2da] focus:border-[#FF6E1A] bg-white rounded-none shadow-sm transition-all duration-300"
                          {...field}
                        />
                      )}
                    />
                    {formState.errors.title && (
                      <div className="text-sm text-[#FF6E1A] flex items-center gap-2 mt-2">
                        <div className="w-1.5 h-1.5 bg-[#FF6E1A] rounded-full"></div>
                        {formState.errors.title.message}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Description Input */}
              <Card className="border border-[#e6e2da] shadow-md bg-[#fffdf9] rounded-none overflow-hidden flex-1 mt-6">
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <Label
                      htmlFor="description"
                      className="text-base font-bold flex items-center gap-3 text-gray-900"
                    >
                      <div className="w-2 h-2 bg-[#FF6E1A] rounded-full shadow-sm"></div>
                      Mô tả tác phẩm
                      <span className="text-gray-500 text-sm font-normal">
                        (tùy chọn)
                      </span>
                    </Label>
                    <Controller
                      control={control}
                      name="description"
                      render={({ field }) => (
                        <Textarea
                          id="description"
                          placeholder="Kể về cảm hứng sáng tạo..."
                          maxLength={500}
                          rows={6}
                          className="text-base border border-[#e6e2da] focus:border-[#FF6E1A] bg-white rounded-none shadow-sm transition-all duration-300 resize-none"
                          {...field}
                        />
                      )}
                    />
                    {formState.errors.description && (
                      <p className="text-sm text-[#FF6E1A] flex items-center gap-2 mt-2">
                        <div className="w-1.5 h-1.5 bg-[#FF6E1A] rounded-full"></div>
                        {formState.errors.description.message}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Submit Section */}
              <div className="flex flex-col space-y-4 mt-6">
                <Button
                  type="submit"
                  disabled={isPending || !formState.isValid || !watchedImage}
                  className="w-full h-14 text-lg font-bold bg-linear-to-r from-[#FF6E1A] to-[#FF6E1A] hover:from-[#FF6E1A] hover:to-[#FF6E1A] text-white shadow-sm rounded-none transition-all duration-200"
                >
                  {isPending ? (
                    <div className="flex items-center gap-3">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Đang gửi bài thi...
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <IconUpload className="h-5 w-5" />
                      Gửi bài thi
                    </div>
                  )}
                </Button>

                {/* Elegant Info Note */}
                <div className="bg-red-50 border border-[#FF6E1A] rounded-none p-4 shadow-sm">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-[#FF6E1A] rounded-none flex items-center justify-center shrink-0">
                      <span className="text-white text-sm font-bold">!</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-[#FF6E1A] mb-1 text-sm">
                        Lưu ý quan trọng
                      </h4>
                      <p className="text-[#FF6E1A] leading-relaxed text-sm">
                        Sau khi gửi bài thi, bạn không thể chỉnh sửa hoặc thay
                        đổi. Vui lòng kiểm tra kỹ tất cả thông tin trước khi
                        gửi.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Artistic Image Section */}
            <div className="flex flex-col h-full">
              {/* === Elegant User Info Card === */}
              <Card className="border border-[#e6e2da] shadow-md bg-[#fffdf9] rounded-none overflow-hidden mb-6">
                <CardContent className="p-4">
                  <h4 className="font-bold text-gray-900 mb-2 border-b pb-2 border-[#f0eee9]">
                    Thông tin thí sinh
                  </h4>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-transparent rounded-lg w-full">
                    {/* Thẻ Thí sinh */}
                    <div className="flex items-center gap-2 grow">
                      <div className="w-8 h-8 bg-[#FF6E1A] rounded-full flex items-center justify-center shrink-0">
                        <span className="text-[#FF6E1A] font-bold text-sm">
                          {currentUser?.fullName?.charAt(0)?.toUpperCase()}
                        </span>
                      </div>
                      <div className="text-left">
                        <p className="text-xs text-gray-500 uppercase tracking-wider">
                          Thí sinh
                        </p>
                        <p className="text-sm font-bold text-gray-900">
                          {currentUser?.fullName}
                        </p>
                      </div>
                    </div>

                    {/* Đường phân cách chỉ hiện trên desktop */}
                    <div className="hidden sm:block w-px h-10 bg-gray-200 shrink-0"></div>

                    {/* Thẻ Trường học */}
                    <div className="flex items-center gap-2 grow">
                      <School className="h-5 w-5 text-[#FF6E1A] shrink-0" />
                      <div className="text-left">
                        <p className="text-xs text-gray-500 uppercase tracking-wider">
                          Lớp / Trường
                        </p>
                        <p className="text-sm font-bold text-gray-900">
                          {currentUser?.schoolName}
                        </p>
                        <p className="text-xs text-gray-600">
                          Lớp {currentUser?.grade}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Image Upload Section */}
              <Card className="border border-[#e6e2da] shadow-md bg-[#fffdf9] rounded-none overflow-hidden flex-1">
                <CardContent className="p-6 h-full">
                  <div className="space-y-4 h-full flex flex-col">
                    <Label className="text-base font-bold flex items-center gap-3 text-gray-900">
                      <div className="w-2 h-2 bg-[#FF6E1A] rounded-full shadow-sm"></div>
                      Ảnh tác phẩm
                      <span className="text-[#FF6E1A]">*</span>
                    </Label>

                    {!imagePreview ? (
                      <div className="relative group flex-1">
                        <div className="border-2 border-dashed border-[#e6e2da] rounded-none p-8 text-center bg-[#f8f6f0] hover:bg-[#f6f3ee] transition-all duration-500 cursor-pointer h-full flex flex-col justify-center">
                          <div className="flex flex-col items-center space-y-4">
                            <div className="w-16 h-16 bg-[#FF6E1A] rounded-none flex items-center justify-center shadow-sm">
                              <IconUpload className="h-8 w-8 text-white" />
                            </div>
                            <div>
                              <h3 className="text-xl font-bold text-gray-900 mb-2">
                                Tải ảnh tranh vẽ lên
                              </h3>
                              <p className="text-gray-600 leading-relaxed">
                                Chọn ảnh từ máy tính • JPEG, PNG, WebP • Tối đa
                                10MB
                              </p>
                            </div>
                            <Controller
                              control={control}
                              name="image"
                              render={({ field: { onChange, ...field } }) => (
                                <input
                                  {...field}
                                  type="file"
                                  accept={ACCEPTED_IMAGE_TYPES.join(",")}
                                  onChange={(event) => {
                                    const file = event.target.files?.[0];
                                    onChange(file);
                                    if (file) {
                                      const reader = new FileReader();
                                      reader.onload = (e) => {
                                        setImagePreview(
                                          e.target?.result as string
                                        );
                                      };
                                      reader.readAsDataURL(file);
                                    }
                                  }}
                                  className="cursor-pointer opacity-0 absolute inset-0 w-full h-full"
                                  value=""
                                />
                              )}
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="lg"
                              className="pointer-events-none border border-[#e6e2da] hover:border-[#FF6E1A] hover:bg-red-50 rounded-none shadow-sm px-6 py-3"
                            >
                              Chọn ảnh
                            </Button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="relative group flex-1">
                        <div className="relative overflow-hidden rounded-none shadow-md border border-[#e6e2da] h-full">
                          <div className="w-full h-full relative">
                            <Image
                              src={imagePreview}
                              alt="Painting preview"
                              fill
                              className="object-contain transition-transform duration-700"
                            />
                          </div>
                          {/* Elegant Overlay */}
                          <div className="absolute inset-0 bg-linear-to-t from-foreground/10 via-transparent to-foreground/10"></div>
                          <div className="absolute inset-0 bg-linear-to-r from-[#FF6E1A]/5 via-transparent to-[#FF6E1A]/5"></div>

                          {/* Artistic Corner Accents */}
                          <div className="absolute top-4 left-4 w-8 h-8 border-l-3 border-t-3 border-background/60 rounded-tl"></div>
                          <div className="absolute top-4 right-4 w-8 h-8 border-r-3 border-t-3 border-background/60 rounded-tr"></div>
                          <div className="absolute bottom-4 left-4 w-8 h-8 border-l-3 border-b-3 border-background/60 rounded-bl"></div>
                          <div className="absolute bottom-4 right-4 w-8 h-8 border-r-3 border-b-3 border-background/60 rounded-br"></div>

                          {/* Delete Button */}
                          <div className="absolute top-4 right-4">
                            <Button
                              type="button"
                              size="sm"
                              variant="destructive"
                              onClick={removeImage}
                              className="bg-[#FF6E1A] hover:bg-[#FF6E1A] shadow-sm h-10 w-10 p-0 rounded-none border border-[#e6e2da]"
                            >
                              <IconTrash className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}

                    {formState.errors.image && (
                      <div className="bg-red-50 border border-[#FF6E1A] rounded-none p-4 shadow-sm">
                        <p className="text-sm text-[#FF6E1A] flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-[#FF6E1A] rounded-full"></div>
                          {formState.errors.image.message}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
