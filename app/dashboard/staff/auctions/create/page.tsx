"use client";

import { useCreateAuction } from "@/apis/auction";
import { Breadcrumb } from "@/components/breadcrumb";
import { SiteHeader } from "@/components/site-header";
import { StaffSidebar } from "@/components/staff-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useLanguageStore } from "@/store/language-store";
import { useTranslation } from "@/lib/i18n";
import { useAuthStore } from "@/store/auth-store";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  IconArrowLeft,
  IconCalendar,
  IconDeviceFloppy,
  IconGavel,
  IconX,
} from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";

// Validation schema
const auctionSchema = z
  .object({
    title: z
      .string()
      .min(1, "Tiêu đề đấu giá là bắt buộc")
      .max(100, "Tiêu đề phải ít hơn 100 ký tự"),
    description: z
      .string()
      .min(1, "Mô tả là bắt buộc")
      .max(1000, "Mô tả phải ít hơn 1000 ký tự"),
    startTime: z.string().min(1, "Thời gian bắt đầu là bắt buộc"),
    endTime: z.string().min(1, "Thời gian kết thúc là bắt buộc"),
  })
  .refine(
    (data) => {
      const now = new Date();
      const start = new Date(data.startTime);
      return start.getTime() > now.getTime() - 60000;
    },
    {
      message: "Thời gian bắt đầu phải ở tương lai",
      path: ["startTime"],
    }
  )
  .refine((data) => new Date(data.endTime) > new Date(data.startTime), {
    message: "Thời gian kết thúc phải sau thời gian bắt đầu",
    path: ["endTime"],
  })
  .refine(
    (data) => {
      const start = new Date(data.startTime);
      const end = new Date(data.endTime);
      const diffInHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
      return diffInHours <= 24;
    },
    {
      message: "Thời gian đấu giá không được quá 24 giờ",
      path: ["endTime"],
    }
  );

type AuctionFormData = z.infer<typeof auctionSchema>;

export default function CreateAuctionPage() {
  const router = useRouter();
  const { currentLanguage } = useLanguageStore();
  const t = useTranslation(currentLanguage);
  const { user } = useAuthStore();

  const now = new Date();
  const minDateTime = now.toISOString().slice(0, 16);

  // Form setup
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<AuctionFormData>({
    resolver: zodResolver(auctionSchema),
    mode: "onChange",
    defaultValues: {
      title: "",
      description: "",
      startTime: "",
      endTime: "",
    },
  });

  const watchedStartTime = watch("startTime");

  // Mutation
  const createAuctionMutation = useCreateAuction();

  const onSubmit = async (data: AuctionFormData) => {
    try {
      if (!user?.userId) {
        toast.error("User session not found");
        return;
      }

      await createAuctionMutation.mutateAsync({
        ...data,
        auctioneerId: user.userId,
      });
      router.push("/dashboard/staff/auctions");
    } catch (error) {
      console.error("Failed to create auction:", error);
    }
  };

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <StaffSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader title={t.createAuction} />
        <div className="flex flex-1 flex-col overflow-hidden">
          <div className="px-4 lg:px-6 py-2 border-b border-[#e6e2da] bg-[#fffdf9]">
            <Breadcrumb
              items={[
                {
                  label: t.auctionManagement,
                  href: "/dashboard/staff/auctions",
                },
                { label: t.createAuction },
              ]}
              homeHref="/dashboard/staff"
            />
          </div>
          <div className="flex-1 overflow-y-auto">
            <div className="@container/main">
              <div className="flex flex-col gap-6 py-6 px-4 lg:px-6 max-w-4xl mx-auto">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Link
                      href="/dashboard/staff/auctions"
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
                      title={t.allAuctions}
                    >
                      <IconArrowLeft className="h-5 w-5" />
                    </Link>
                    <div>
                      <h1 className="text-3xl font-bold staff-text-primary">
                        {t.createAuction}
                      </h1>
                      <p className="text-sm staff-text-secondary mt-1">
                        {t.setupNewAuction || "Setup a new auction session"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="staff-card p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <IconGavel className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold staff-text-primary">
                          {t.auctionDetails}
                        </h2>
                        <p className="text-sm staff-text-secondary">
                          {t.basicAuctionInfo ||
                            "General information about the auction"}
                        </p>
                      </div>
                    </div>

                    <form
                      onSubmit={handleSubmit(onSubmit)}
                      className="space-y-6"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium staff-text-primary mb-2">
                            {t.auctionTitle}
                          </label>
                          <input
                            type="text"
                            {...register("title")}
                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                              errors.title
                                ? "border-red-300 bg-red-50"
                                : "border-[#e6e2da] bg-white"
                            }`}
                            placeholder={
                              t.enterAuctionTitle || "Nhập tiêu đề đấu giá"
                            }
                          />
                          {errors.title && (
                            <p className="mt-1 text-xs font-bold text-red-600 uppercase tracking-tighter">
                              {errors.title.message}
                            </p>
                          )}
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium staff-text-primary mb-2">
                            {t.descriptionLabel}
                          </label>
                          <textarea
                            {...register("description")}
                            rows={5}
                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none ${
                              errors.description
                                ? "border-red-300 bg-red-50"
                                : "border-[#e6e2da] bg-white"
                            }`}
                            placeholder={
                              t.describeAuction ||
                              "Mô tả ngắn gọn về phiên đấu giá"
                            }
                          />
                          {errors.description && (
                            <p className="mt-1 text-xs font-bold text-red-600 uppercase tracking-tighter">
                              {errors.description.message}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium staff-text-primary mb-2">
                            {t.auctionStartTime}
                          </label>
                          <div className="relative">
                            <input
                              type="datetime-local"
                              {...register("startTime")}
                              min={minDateTime}
                              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                                errors.startTime
                                  ? "border-red-300 bg-red-50"
                                  : "border-[#e6e2da] bg-white"
                              }`}
                            />
                          </div>
                          {errors.startTime && (
                            <p className="mt-1 text-xs font-bold text-red-600 uppercase tracking-tighter">
                              {errors.startTime.message}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium staff-text-primary mb-2">
                            {t.auctionEndTime}
                          </label>
                          <div className="relative">
                            <input
                              type="datetime-local"
                              {...register("endTime")}
                              min={watchedStartTime || minDateTime}
                              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                                errors.endTime
                                  ? "border-red-300 bg-red-50"
                                  : "border-[#e6e2da] bg-white"
                              }`}
                            />
                          </div>
                          {errors.endTime && (
                            <p className="mt-1 text-xs font-bold text-red-600 uppercase tracking-tighter">
                              {errors.endTime.message}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-end gap-3 pt-8 border-t border-[#e6e2da]">
                        <Link
                          href="/dashboard/staff/auctions"
                          className="staff-btn-secondary flex items-center gap-2 px-6"
                        >
                          <IconX className="h-4 w-4" />
                          {t.cancel}
                        </Link>
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="staff-btn-primary flex items-center gap-2 px-8 py-2.5"
                        >
                          {isSubmitting ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          ) : (
                            <IconDeviceFloppy className="h-4 w-4" />
                          )}
                          {isSubmitting ? t.creating : t.createAuction}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
