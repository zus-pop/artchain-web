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
import { useForm, Controller } from "react-hook-form";
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
    numberOfTablesRound2: z
      .number()
      .min(0, "Number of tables must be at least 0")
      .max(26, "Maximum of table round 2 is 26"),

    startDate: z
      .string()
      .min(1, "Start date is required")
      .refine((data) => new Date(data) > new Date(), {
        message: "Start date must be in the future",
        path: ["startDate"],
      }),
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
  )
  .refine(
    (data) => {
      // If round2Quantity is 0, numberOfTablesRound2 must also be 0
      if (data.round2Quantity === 0) {
        return data.numberOfTablesRound2 === 0;
      }
      // If round2Quantity > 0, numberOfTablesRound2 must be at least 1 and round2Quantity must be divisible by numberOfTablesRound2
      return (
        data.numberOfTablesRound2 >= 1 &&
        data.round2Quantity % data.numberOfTablesRound2 === 0
      );
    },
    {
      message:
        "Number of competitors must be evenly divisible by the number of tables",
      path: ["numberOfTablesRound2"],
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
    control,
    formState: { errors, isSubmitting, isValid },
    setValue,
    watch,
    trigger,
  } = useForm<CreateContestFormData>({
    mode: "all",
    resolver: zodResolver(createContestSchema),
    defaultValues: {
      round2Quantity: 0,
      numberOfTablesRound2: 0,
    },
  });

  const watchedRound2Quantity = watch("round2Quantity");

  // Watch date fields for interdependent validation
  const watchedStartDate = watch("startDate");
  const watchedRoundStartDate = watch("roundStartDate");

  // Cleanup banner preview URL on unmount
  React.useEffect(() => {
    return () => {
      if (bannerPreview) {
        URL.revokeObjectURL(bannerPreview);
      }
    };
  }, [bannerPreview]);

  // Update numberOfTablesRound2 when round2Quantity changes
  React.useEffect(() => {
    if (watchedRound2Quantity === 0) {
      setValue("numberOfTablesRound2", 0);
    } else if (watchedRound2Quantity > 0) {
      const currentValue = watch("numberOfTablesRound2") || 0;
      // If current value is 0 or doesn't divide evenly into round2Quantity, set it to a divisor
      if (currentValue === 0 || watchedRound2Quantity % currentValue !== 0) {
        // Find the largest divisor that's reasonable (prefer smaller numbers)
        const possibleDivisors = [];
        for (let i = 1; i <= Math.min(watchedRound2Quantity, 10); i++) {
          if (watchedRound2Quantity % i === 0) {
            possibleDivisors.push(i);
          }
        }
        // Use the middle value or a reasonable default
        const defaultValue =
          possibleDivisors[Math.floor(possibleDivisors.length / 2)] || 1;
        setValue("numberOfTablesRound2", defaultValue);
      }
    }
  }, [watchedRound2Quantity, setValue, watch]);

  // Validate endDate when startDate changes
  React.useEffect(() => {
    if (watchedStartDate) {
      trigger("endDate");
    }
  }, [watchedStartDate, trigger]);

  // Validate roundEndDate and roundSubmissionDeadline when roundStartDate changes
  React.useEffect(() => {
    if (watchedRoundStartDate) {
      trigger("roundEndDate");
      trigger("roundSubmissionDeadline");
    }
  }, [watchedRoundStartDate, trigger]);

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
      if (field === "banner") {
        const previewUrl = URL.createObjectURL(file);
        setBannerPreview(previewUrl);
      }
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
                            <Controller
                              name="startDate"
                              control={control}
                              render={({
                                field: { onChange, value, ...field },
                              }) => (
                                <input
                                  type="date"
                                  {...field}
                                  value={value || ""}
                                  onChange={(e) =>
                                    onChange(e.target.value || undefined)
                                  }
                                  className="w-full px-3 py-2 border border-[#e6e2da] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                              )}
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
                            <Controller
                              name="endDate"
                              control={control}
                              render={({
                                field: { onChange, value, ...field },
                              }) => (
                                <input
                                  type="date"
                                  {...field}
                                  value={value || ""}
                                  onChange={(e) =>
                                    onChange(e.target.value || undefined)
                                  }
                                  className="w-full px-3 py-2 border border-[#e6e2da] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                              )}
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
                          <Controller
                            name="round2Quantity"
                            control={control}
                            render={({ field }) => (
                              <input
                                type="number"
                                {...field}
                                onChange={(e) => {
                                  const value = parseInt(e.target.value) || 0;
                                  field.onChange(value);
                                }}
                                step={1}
                                className="w-full px-3 py-2 border border-[#e6e2da] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="3"
                                min="0"
                              />
                            )}
                          />
                          {errors.round2Quantity && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors.round2Quantity.message}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Number of Tables for Round 2 *
                            {watchedRound2Quantity === 0 && (
                              <span className="text-gray-500 text-xs ml-1">
                                (Disabled when no competitors advance)
                              </span>
                            )}
                          </label>
                          <Controller
                            name="numberOfTablesRound2"
                            control={control}
                            render={({ field }) => (
                              <input
                                type="number"
                                {...field}
                                onChange={(e) => {
                                  const value = parseInt(e.target.value) || 0;
                                  field.onChange(value);
                                }}
                                disabled={watchedRound2Quantity === 0}
                                step={1}
                                className="w-full px-3 py-2 border border-[#e6e2da] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                                placeholder={
                                  watchedRound2Quantity === 0
                                    ? "0"
                                    : (() => {
                                        const divisors = [];
                                        for (
                                          let i = 1;
                                          i <=
                                          Math.min(watchedRound2Quantity, 10);
                                          i++
                                        ) {
                                          if (watchedRound2Quantity % i === 0) {
                                            divisors.push(i);
                                          }
                                        }
                                        return (
                                          divisors[
                                            Math.floor(divisors.length / 2)
                                          ]?.toString() || "1"
                                        );
                                      })()
                                }
                                min={watchedRound2Quantity === 0 ? "0" : "1"}
                                max="26"
                              />
                            )}
                          />
                          {errors.numberOfTablesRound2 && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors.numberOfTablesRound2.message}
                            </p>
                          )}
                          {watchedRound2Quantity > 0 && (
                            <p className="text-xs text-gray-600 mt-1">
                              {watchedRound2Quantity} competitors ÷ tables =
                              even distribution. Valid:{" "}
                              {(() => {
                                const divisors = [];
                                for (
                                  let i = 1;
                                  i <= Math.min(watchedRound2Quantity, 10);
                                  i++
                                ) {
                                  if (watchedRound2Quantity % i === 0) {
                                    divisors.push(i);
                                  }
                                }
                                return (
                                  divisors.slice(0, 5).join(", ") +
                                  (divisors.length > 5 ? "..." : "")
                                );
                              })()}
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
                            <Controller
                              name="roundStartDate"
                              control={control}
                              render={({
                                field: { onChange, value, ...field },
                              }) => (
                                <input
                                  type="date"
                                  {...field}
                                  value={value || ""}
                                  onChange={(e) =>
                                    onChange(e.target.value || undefined)
                                  }
                                  className="w-full px-3 py-2 border border-[#e6e2da] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                              )}
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
                            <Controller
                              name="roundEndDate"
                              control={control}
                              render={({
                                field: { onChange, value, ...field },
                              }) => (
                                <input
                                  type="date"
                                  {...field}
                                  value={value || ""}
                                  onChange={(e) =>
                                    onChange(e.target.value || undefined)
                                  }
                                  className="w-full px-3 py-2 border border-[#e6e2da] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                              )}
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
                          <Controller
                            name="roundSubmissionDeadline"
                            control={control}
                            render={({
                              field: { onChange, value, ...field },
                            }) => (
                              <input
                                type="date"
                                {...field}
                                value={value || ""}
                                onChange={(e) =>
                                  onChange(e.target.value || undefined)
                                }
                                className="w-full px-3 py-2 border border-[#e6e2da] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                            )}
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
                          <Controller
                            name="roundResultAnnounceDate"
                            control={control}
                            render={({
                              field: { onChange, value, ...field },
                            }) => (
                              <input
                                type="date"
                                {...field}
                                value={value || ""}
                                onChange={(e) =>
                                  onChange(e.target.value || undefined)
                                }
                                className="w-full px-3 py-2 border border-[#e6e2da] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                            )}
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
                          <Controller
                            name="roundSendOriginalDeadline"
                            control={control}
                            render={({
                              field: { onChange, value, ...field },
                            }) => (
                              <input
                                type="date"
                                {...field}
                                value={value || ""}
                                onChange={(e) =>
                                  onChange(e.target.value || undefined)
                                }
                                className="w-full px-3 py-2 border border-[#e6e2da] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                            )}
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
                    disabled={
                      isSubmitting || createMutation.isPending || !isValid
                    }
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
