"use client";

import { createStaffContest } from "@/apis/staff";
import { Breadcrumb } from "@/components/breadcrumb";
import { SiteHeader } from "@/components/site-header";
import { StaffSidebar } from "@/components/staff-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  IconArrowLeft,
  IconCalendar,
  IconDeviceFloppy,
  IconFileText,
  IconTrophy,
  IconUpload,
} from "@tabler/icons-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

// Zod validation schema
const createContestSchema = z
  .object({
    title: z.string().min(1, "Title is required").max(255, "Title is too long"),
    description: z
      .string()
      .min(1, "Description is required")
      .max(2000, "Description is too long"),
    round2Quantity: z
      .number()
      .min(0, "Number of top competitors must be at least 0")
      .max(100, "Number of top competitors is too high"),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),
    banner: z
      .instanceof(File)
      .refine(
        (file) => file.size <= 5 * 1024 * 1024, // 5MB
        "Banner image must be less than 5MB"
      )
      .refine(
        (file) =>
          ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(
            file.type
          ),
        "Banner must be a valid image file (JPEG, PNG, WebP)"
      ),
    rule: z
      .instanceof(File)
      .refine(
        (file) => file.size <= 20 * 1024 * 1024, // 10MB
        "Rules file must be less than 10MB"
      )
      .refine(
        (file) => file.type === "application/pdf",
        "Rules file must be a PDF"
      ),
    roundStartDate: z.string().min(1, "Round start date is required"),
    roundEndDate: z.string().min(1, "Round end date is required"),
    roundSubmissionDeadline: z
      .string()
      .min(1, "Submission deadline is required"),
    roundResultAnnounceDate: z
      .string()
      .min(1, "Result announcement date is required"),
    roundSendOriginalDeadline: z
      .string()
      .min(1, "Original deadline is required"),
  })
  .refine((data) => new Date(data.endDate) > new Date(data.startDate), {
    message: "End date must be after start date",
    path: ["endDate"],
  })
  .refine(
    (data) => new Date(data.roundEndDate) > new Date(data.roundStartDate),
    {
      message: "Round end date must be after round start date",
      path: ["roundEndDate"],
    }
  )
  .refine(
    (data) =>
      new Date(data.roundSubmissionDeadline) >= new Date(data.roundStartDate),
    {
      message: "Submission deadline must be on or after round start date",
      path: ["roundSubmissionDeadline"],
    }
  );

type CreateContestFormData = z.infer<typeof createContestSchema>;

export default function CreateContestPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    trigger,
  } = useForm<CreateContestFormData>({
    resolver: zodResolver(createContestSchema),
    defaultValues: {
      round2Quantity: 0,
    },
  });

  const watchedBanner = watch("banner");

  // Update banner preview when file changes
  React.useEffect(() => {
    if (watchedBanner) {
      const url = URL.createObjectURL(watchedBanner);
      setBannerPreview(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setBannerPreview(null);
    }
  }, [watchedBanner]);

  const createMutation = useMutation({
    mutationFn: createStaffContest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff-contests"] });
      toast.success("Contest created successfully!");
      router.push("/dashboard/staff/contests");
    },
    onError: (error: unknown) => {
      console.error("Failed to create contest:", error);
      const errorMessage =
        error &&
        typeof error === "object" &&
        "response" in error &&
        error.response &&
        typeof error.response === "object" &&
        "data" in error.response &&
        error.response.data &&
        typeof error.response.data === "object" &&
        "message" in error.response.data
          ? String(error.response.data.message)
          : "Failed to create contest";
      toast.error(errorMessage);
    },
  });

  const onSubmit = (data: CreateContestFormData) => {
    createMutation.mutate(data);
  };

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    field: "banner" | "rule"
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setValue(field, file);
      trigger(field);
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
        <SiteHeader title="Create Contest" />
        <div className="flex flex-1 flex-col">
          <div className="px-4 lg:px-6 py-2 border-b border-[#e6e2da] bg-white">
            <Breadcrumb
              items={[
                {
                  label: "Contest Management",
                  href: "/dashboard/staff/contests",
                },
                { label: "Create Contest" },
              ]}
              homeHref="/dashboard/staff"
            />
          </div>
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Link
                    href="/dashboard/staff/contests"
                    className=" border border-[#e6e2da] p-2 hover:bg-gray-50 transition-colors"
                  >
                    <IconArrowLeft className="h-5 w-5 staff-text-secondary" />
                  </Link>
                  <div>
                    <h2 className="text-2xl font-bold staff-text-primary">
                      Create New Contest
                    </h2>
                    <p className="text-sm staff-text-secondary mt-1">
                      Set up a new art competition for young artists
                    </p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-6">
                    <div className="staff-card p-6">
                      <h3 className="text-lg font-semibold staff-text-primary mb-4 flex items-center gap-2">
                        <IconFileText className="h-5 w-5 " />
                        Basic Information
                      </h3>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Contest Title *
                          </label>
                          <input
                            type="text"
                            {...register("title")}
                            className="w-full px-3 py-2 border border-[#e6e2da] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter contest title"
                          />
                          {errors.title && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors.title.message}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description *
                          </label>
                          <textarea
                            {...register("description")}
                            rows={4}
                            className="w-full px-3 py-2 border border-[#e6e2da] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Describe the contest theme and objectives"
                          />
                          {errors.description && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors.description.message}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="staff-card p-6">
                      <h3 className="text-lg font-semibold staff-text-primary mb-4 flex items-center gap-2">
                        <IconCalendar className="h-5 w-5 " />
                        Contest Schedule & Round 2 Settings
                      </h3>

                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Start Date *
                            </label>
                            <input
                              type="date"
                              {...register("startDate")}
                              className="w-full px-3 py-2 border border-[#e6e2da] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            {errors.startDate && (
                              <p className="text-red-500 text-sm mt-1">
                                {errors.startDate.message}
                              </p>
                            )}
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              End Date *
                            </label>
                            <input
                              type="date"
                              {...register("endDate")}
                              className="w-full px-3 py-2 border border-[#e6e2da] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            {errors.endDate && (
                              <p className="text-red-500 text-sm mt-1">
                                {errors.endDate.message}
                              </p>
                            )}
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Number of Top Competitors for Round 2 *
                          </label>
                          <input
                            type="number"
                            {...register("round2Quantity", {
                              valueAsNumber: true,
                            })}
                            minLength={16}
                            step={4}
                            className="w-full px-3 py-2 border border-[#e6e2da] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="3"
                            min="0"
                          />
                          {errors.round2Quantity && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors.round2Quantity.message}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="staff-card p-6">
                      <h3 className="text-lg font-semibold staff-text-primary mb-4 flex items-center gap-2">
                        <IconTrophy className="h-5 w-5 text-yellow-600" />
                        Round 1 Schedule
                      </h3>

                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Round Start Date *
                            </label>
                            <input
                              type="date"
                              {...register("roundStartDate")}
                              className="w-full px-3 py-2 border border-[#e6e2da] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            {errors.roundStartDate && (
                              <p className="text-red-500 text-sm mt-1">
                                {errors.roundStartDate.message}
                              </p>
                            )}
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Round End Date *
                            </label>
                            <input
                              type="date"
                              {...register("roundEndDate")}
                              className="w-full px-3 py-2 border border-[#e6e2da] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            {errors.roundEndDate && (
                              <p className="text-red-500 text-sm mt-1">
                                {errors.roundEndDate.message}
                              </p>
                            )}
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Submission Deadline *
                          </label>
                          <input
                            type="date"
                            {...register("roundSubmissionDeadline")}
                            className="w-full px-3 py-2 border border-[#e6e2da] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                          {errors.roundSubmissionDeadline && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors.roundSubmissionDeadline.message}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Result Announcement Date *
                          </label>
                          <input
                            type="date"
                            {...register("roundResultAnnounceDate")}
                            className="w-full px-3 py-2 border border-[#e6e2da] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                          {errors.roundResultAnnounceDate && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors.roundResultAnnounceDate.message}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Send Original Deadline *
                          </label>
                          <input
                            type="date"
                            {...register("roundSendOriginalDeadline")}
                            className="w-full px-3 py-2 border border-[#e6e2da] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                          {errors.roundSendOriginalDeadline && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors.roundSendOriginalDeadline.message}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="staff-card p-6">
                      <h3 className="text-lg font-semibold staff-text-primary mb-4 flex items-center gap-2">
                        <IconUpload className="h-5 w-5" />
                        Files
                      </h3>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Banner Image *
                          </label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileChange(e, "banner")}
                            className="w-full px-3 py-2 border border-[#e6e2da] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                          {errors.banner && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors.banner.message}
                            </p>
                          )}
                          {bannerPreview && (
                            <div className="mt-2">
                              <Image
                                src={bannerPreview}
                                alt="Banner preview"
                                width={200}
                                height={100}
                                className="object-cover rounded border"
                              />
                            </div>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Rules File (PDF) *
                          </label>
                          <input
                            type="file"
                            accept=".pdf"
                            onChange={(e) => handleFileChange(e, "rule")}
                            className="w-full px-3 py-2 border border-[#e6e2da] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                          {errors.rule && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors.rule.message}
                            </p>
                          )}
                          {watch("rule") && (
                            <p className="text-sm text-gray-600 mt-1">
                              Selected: {watch("rule")?.name}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-4 pt-6 border-t border-[#e6e2da]">
                  <Link
                    href="/dashboard/staff/contests"
                    className="px-6 py-2 border border-[#e6e2da] text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </Link>
                  <button
                    type="submit"
                    disabled={isSubmitting || createMutation.isPending}
                    className="px-6 py-2 staff-btn-primary transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <IconDeviceFloppy className="h-4 w-4" />
                    {isSubmitting || createMutation.isPending
                      ? "Creating..."
                      : "Create Contest"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
