"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useUploadPainting } from "@/hooks/use-upload-painting";
import { useUserById } from "@/hooks/use-user-by-id";
import { useAuthStore } from "@/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconTrash, IconUpload } from "@tabler/icons-react";
import { School } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import React, { Suspense, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

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

export function PaintingUpload() {
  const router = useRouter();
  const params = useSearchParams();
  const contestId = params.get("contestId");
  const competitorId = params.get("competitorId");
  const roundId = params.get("roundId");

  console.log("contestId:", contestId);
  console.log("competitorId:", competitorId);
  console.log("roundId:", roundId);

  const { control, handleSubmit, formState, setValue, watch } =
    useForm<PaintingUploadForm>({
      mode: "all",
      resolver: zodResolver(paintingUploadSchema),
      defaultValues: {
        title: "",
      },
    });

  const accessToken = useAuthStore((state) => state.accessToken);
  const { data: currentUser, isLoading } = useUserById(competitorId);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const { mutate, isPending } = useUploadPainting();

  // Watch the image field to update preview
  const watchedImage = watch("image");

  // Update preview when image changes
  React.useEffect(() => {
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

    mutate({
      title: data.title,
      description: data.description,
      file: data.image,
      contestId: "12",
      roundId: "12",
      competitorId: "12",
    });
  };

  if (!accessToken) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Đang tải thông tin...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-muted/30 py-8 px-6 relative overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container max-w-6xl mx-auto relative z-10">
        {/* Elegant Header Section */}
        <div className="text-center mb-8 relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 bg-primary/5 rounded-full blur-xl"></div>
          </div>
          <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-primary via-primary/80 to-secondary rounded-lg shadow-2xl shadow-primary/25 mb-6 transform hover:scale-105 transition-all duration-500">
            <IconUpload className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground via-foreground/90 to-foreground/80 bg-clip-text text-transparent mb-3 tracking-tight">
            Nộp Bài Thi
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6 leading-relaxed font-medium">
            Chia sẻ tác phẩm nghệ thuật của bạn với cộng đồng
          </p>

          {/* Elegant User Info Card */}
          <div className="inline-flex items-center gap-6 px-6 py-4 bg-card/80 backdrop-blur-xl border border-border/50 rounded-lg shadow-xl shadow-foreground/5">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-primary-foreground font-bold text-sm">
                  {currentUser?.fullName?.charAt(0)?.toUpperCase()}
                </span>
              </div>
              <div className="text-left">
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                  Thí sinh
                </p>
                <p className="text-sm font-bold text-foreground">
                  {currentUser?.fullName}
                </p>
              </div>
            </div>
            <div className="w-px h-8 bg-gradient-to-b from-transparent via-border to-transparent"></div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-secondary to-secondary/80 rounded-lg flex items-center justify-center shadow-lg">
                <School className="h-6 w-6 text-secondary-foreground" />
              </div>
              <div className="text-left">
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                  Trường học
                </p>
                <p className="text-sm font-bold text-foreground">
                  {currentUser?.schoolName}
                </p>
                <p className="text-xs text-muted-foreground">
                  Lớp {currentUser?.grade}
                </p>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            {/* Left Side - Text Content */}
            <div className="flex flex-col h-full">
              {/* Title Input */}
              <Card className="border-0 shadow-2xl shadow-foreground/5 bg-card/90 backdrop-blur-xl rounded-lg overflow-hidden flex-1">
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <Label
                      htmlFor="title"
                      className="text-base font-bold flex items-center gap-3 text-foreground"
                    >
                      <div className="w-2 h-2 bg-gradient-to-r from-primary to-primary/80 rounded-full shadow-sm"></div>
                      Tiêu đề tác phẩm
                      <span className="text-destructive">*</span>
                    </Label>
                    <Controller
                      control={control}
                      name="title"
                      render={({ field }) => (
                        <Input
                          id="title"
                          placeholder="Ví dụ: 'Bức tranh về ước mơ tuổi thơ'..."
                          maxLength={100}
                          className="text-base h-12 border-2 border-border focus:border-primary bg-background rounded-lg shadow-sm transition-all duration-300 focus:shadow-lg focus:shadow-primary/25"
                          {...field}
                        />
                      )}
                    />
                    {formState.errors.title && (
                      <div className="text-sm text-destructive flex items-center gap-2 mt-2">
                        <div className="w-1.5 h-1.5 bg-destructive rounded-full"></div>
                        {formState.errors.title.message}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Description Input */}
              <Card className="border-0 shadow-2xl shadow-foreground/5 bg-card/90 backdrop-blur-xl rounded-lg overflow-hidden flex-1 mt-6">
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <Label
                      htmlFor="description"
                      className="text-base font-bold flex items-center gap-3 text-foreground"
                    >
                      <div className="w-2 h-2 bg-gradient-to-r from-secondary to-secondary/80 rounded-full shadow-sm"></div>
                      Mô tả tác phẩm
                      <span className="text-muted-foreground text-sm font-normal">
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
                          className="text-base border-2 border-border focus:border-secondary bg-background rounded-lg shadow-sm transition-all duration-300 focus:shadow-lg focus:shadow-secondary/25 resize-none"
                          {...field}
                        />
                      )}
                    />
                    {formState.errors.description && (
                      <p className="text-sm text-destructive flex items-center gap-2 mt-2">
                        <div className="w-1.5 h-1.5 bg-destructive rounded-full"></div>
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
                  className="w-full h-14 text-lg font-bold bg-gradient-to-r from-primary via-primary/90 to-primary/80 hover:from-primary/90 hover:via-primary hover:to-primary shadow-2xl shadow-primary/25 hover:shadow-primary/40 rounded-lg transition-all duration-500 transform hover:scale-[1.02] hover:-translate-y-1"
                >
                  {isPending ? (
                    <div className="flex items-center gap-3">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-foreground"></div>
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
                <div className="bg-accent/50 border-2 border-accent/30 rounded-lg p-4 shadow-lg backdrop-blur-sm">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-gradient-to-r from-accent-foreground to-accent-foreground/80 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg">
                      <span className="text-accent text-sm font-bold">!</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-accent-foreground mb-1 text-sm">
                        Lưu ý quan trọng
                      </h4>
                      <p className="text-accent-foreground/80 leading-relaxed text-sm">
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
              {/* Image Upload Section */}
              <Card className="border-0 shadow-2xl shadow-foreground/5 bg-card/90 backdrop-blur-xl rounded-lg overflow-hidden flex-1">
                <CardContent className="p-6 h-full">
                  <div className="space-y-4 h-full flex flex-col">
                    <Label className="text-base font-bold flex items-center gap-3 text-foreground">
                      <div className="w-2 h-2 bg-gradient-to-r from-accent to-accent/80 rounded-full shadow-sm"></div>
                      Ảnh tác phẩm
                      <span className="text-destructive">*</span>
                    </Label>

                    {!imagePreview ? (
                      <div className="relative group flex-1">
                        <div className="border-3 border-dashed border-border rounded-lg p-8 text-center bg-gradient-to-br from-muted/30 to-muted/50 hover:from-primary/5 hover:to-primary/10 transition-all duration-500 cursor-pointer backdrop-blur-sm h-full flex flex-col justify-center">
                          <div className="flex flex-col items-center space-y-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-primary via-primary/80 to-secondary rounded-lg flex items-center justify-center shadow-2xl shadow-primary/25 group-hover:scale-110 transition-all duration-500">
                              <IconUpload className="h-8 w-8 text-primary-foreground" />
                            </div>
                            <div>
                              <h3 className="text-xl font-bold text-foreground mb-2">
                                Tải ảnh tranh vẽ lên
                              </h3>
                              <p className="text-muted-foreground leading-relaxed">
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
                              className="pointer-events-none border-2 border-border hover:border-primary hover:bg-primary/5 rounded-lg shadow-lg backdrop-blur-sm px-6 py-3"
                            >
                              Chọn ảnh
                            </Button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="relative group flex-1">
                        <div className="relative overflow-hidden rounded-lg shadow-2xl shadow-foreground/10 ring-1 ring-border/20 h-full">
                          <div className="w-full h-full relative">
                            <Image
                              src={imagePreview}
                              alt="Painting preview"
                              fill
                              className="object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                          </div>
                          {/* Elegant Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-foreground/10 via-transparent to-foreground/10"></div>
                          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5"></div>

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
                              className="bg-destructive/90 hover:bg-destructive shadow-2xl backdrop-blur-sm h-10 w-10 p-0 rounded-lg border-2 border-background/20"
                            >
                              <IconTrash className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}

                    {formState.errors.image && (
                      <div className="bg-destructive/10 border-2 border-destructive/30 rounded-lg p-4 shadow-lg">
                        <p className="text-sm text-destructive flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-destructive rounded-full"></div>
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
