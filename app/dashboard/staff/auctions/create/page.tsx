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
  IconHammer,
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
      .min(1, "Auction title is required")
      .max(100, "Title must be less than 100 characters"),
    description: z
      .string()
      .min(1, "Description is required")
      .max(1000, "Description must be less than 1000 characters"),
    startTime: z.string().min(1, "Start time is required"),
    endTime: z.string().min(1, "End time is required"),
  })
  .refine((data) => new Date(data.endTime) > new Date(data.startTime), {
    message: "End time must be after start time",
    path: ["endTime"],
  });

type AuctionFormData = z.infer<typeof auctionSchema>;

export default function CreateAuctionPage() {
  const router = useRouter();
  const { currentLanguage } = useLanguageStore();
  const t = useTranslation(currentLanguage);
  const { user } = useAuthStore();

  // Form setup
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<AuctionFormData>({
    resolver: zodResolver(auctionSchema),
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
              <div className="flex flex-col gap-6 py-6 px-4 lg:px-6 max-w-7xl mx-auto">
                {/* Header */}
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

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Main Form Column */}
                  <div className="lg:col-span-2 space-y-6">
                    <div className="staff-card p-6">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <IconHammer className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h2 className="text-xl font-semibold staff-text-primary">
                            {t.auctionDetails}
                          </h2>
                          <p className="text-sm staff-text-secondary">
                            {t.basicAuctionInfo || "General information about the auction"}
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
                              placeholder={t.enterAuctionTitle || "Enter auction title"}
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
                              placeholder={t.describeAuction || "Briefly describe the auction purpose and theme"}
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
                                min={watchedStartTime}
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

                        {/* Form Actions */}
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

                  {/* Sidebar Help Column */}
                  <div className="space-y-6">
                    <div className="staff-card p-6 bg-blue-50 border-blue-100">
                      <h3 className="text-lg font-bold staff-text-primary mb-4 uppercase tracking-widest flex items-center gap-2 text-sm">
                        <IconCalendar className="h-4 w-4" />
                        {t.schedulingTips || "Scheduling Tips"}
                      </h3>
                      <ul className="space-y-3">
                        <li className="flex gap-2 text-xs text-blue-800 leading-relaxed font-medium">
                          <span className="shrink-0">•</span>
                          Ensure the start time is set in the future.
                        </li>
                        <li className="flex gap-2 text-xs text-blue-800 leading-relaxed font-medium">
                          <span className="shrink-0">•</span>
                          Allow at least 24 hours between start and end times for better competition.
                        </li>
                        <li className="flex gap-2 text-xs text-blue-800 leading-relaxed font-medium">
                          <span className="shrink-0">•</span>
                          Double-check the timezone settings (UTC).
                        </li>
                      </ul>
                    </div>

                    <div className="staff-card p-6 bg-gray-50 border-[#e6e2da]">
                      <h3 className="text-lg font-bold staff-text-primary mb-4 uppercase tracking-widest text-sm">
                        {t.auctionAccountability || "Staff Responsibility"}
                      </h3>
                      <p className="text-xs staff-text-secondary leading-relaxed font-bold">
                        As the creator of this auction, you will be listed as the primary moderator. You are responsible for ensuring all included paintings meet quality standards.
                      </p>
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-black text-xs uppercase">
                              {user?.fullName?.charAt(0) || "S"}
                           </div>
                           <div>
                              <p className="text-[10px] font-black uppercase tracking-tighter text-gray-400">{t.moderator || "Moderator"}</p>
                              <p className="text-sm font-bold staff-text-primary">{user?.fullName || "Staff Member"}</p>
                           </div>
                        </div>
                      </div>
                    </div>
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
