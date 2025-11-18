"use client";

import { useCreateBatchAward } from "@/apis/award";
import { createStaffContest } from "@/apis/staff";
import { Breadcrumb } from "@/components/breadcrumb";
import { SiteHeader } from "@/components/site-header";
import { StaffSidebar } from "@/components/staff-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Lang, useTranslation } from "@/lib/i18n";
import { formatDateForInput } from "@/lib/utils";
import { useLanguageStore } from "@/store/language-store";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  IconArrowLeft,
  IconDeviceFloppy,
  IconEye,
  IconFileText,
  IconX,
} from "@tabler/icons-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

// Zod validation schema with translations
const createContestSchema = (t: Lang) =>
  z
    .object({
      title: z.string().min(1, t.titleRequired).max(255, t.titleTooLong),
      description: z
        .string()
        .min(1, t.descriptionRequired)
        .max(2000, t.descriptionTooLong),
      round2Quantity: z
        .number()
        .min(1, t.topCompetitorsMin)
        .max(100, t.topCompetitorsMax),
      numberOfTablesRound2: z.number().min(3, t.tablesMin).max(6, t.tablesMax),
      startDate: z
        .string()
        .min(1, t.startDateRequired)
        .refine((data) => new Date(data) > new Date(), {
          message: t.startDateFuture,
        }),
      endDate: z.string().min(1, t.endDateRequired),
      banner: z
        .any()
        .refine((file) => file && file instanceof File, t.bannerRequired)
        .refine(
          (file) =>
            file && file instanceof File && file.size <= 5 * 1024 * 1024, // 5MB
          t.bannerTooLarge
        )
        .refine(
          (file) =>
            file &&
            file instanceof File &&
            ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(
              file.type
            ),
          t.bannerInvalidType
        ),
      rule: z
        .any()
        .refine((file) => file && file instanceof File, t.rulesRequired)
        .refine(
          (file) =>
            file && file instanceof File && file.size <= 20 * 1024 * 1024, // 20MB
          t.rulesTooLarge
        )
        .refine(
          (file) =>
            file && file instanceof File && file.type === "application/pdf",
          t.rulesInvalidType
        ),
      roundStartDate: z.string().min(1, t.roundStartRequired),
      roundEndDate: z.string().min(1, t.roundEndRequired),
      roundSubmissionDeadline: z.string().min(1, t.submissionDeadlineRequired),
      roundResultAnnounceDate: z.string().min(1, t.resultDateRequired),
      roundSendOriginalDeadline: z.string().min(1, t.originalDeadlineRequired),
    })
    .refine((data) => new Date(data.endDate) > new Date(data.startDate), {
      message: t.endDateAfterStart,
      path: ["endDate"],
    })
    .refine(
      (data) => {
        if (!data.roundEndDate || !data.roundStartDate) return true;
        return new Date(data.roundEndDate) > new Date(data.roundStartDate);
      },
      {
        message: t.roundEndAfterStart,
        path: ["roundEndDate"],
      }
    )
    .refine(
      (data) => {
        if (!data.roundSubmissionDeadline || !data.roundStartDate) return true;
        return (
          new Date(data.roundSubmissionDeadline) >=
          new Date(data.roundStartDate)
        );
      },
      {
        message: t.submissionAfterRoundStart,
        path: ["roundSubmissionDeadline"],
      }
    )
    .refine(
      (data) => {
        if (!data.roundSubmissionDeadline || !data.roundEndDate) return true;
        return (
          new Date(data.roundSubmissionDeadline) <= new Date(data.roundEndDate)
        );
      },
      {
        message: t.submissionBeforeRoundEnd,
        path: ["roundSubmissionDeadline"],
      }
    )
    .refine(
      (data) => {
        if (!data.roundResultAnnounceDate || !data.roundStartDate) return true;
        return (
          new Date(data.roundResultAnnounceDate) >=
          new Date(data.roundStartDate)
        );
      },
      {
        message: t.resultDateWithinContest,
        path: ["roundResultAnnounceDate"],
      }
    )
    .refine(
      (data) => {
        if (!data.roundResultAnnounceDate || !data.roundEndDate) return true;
        return (
          new Date(data.roundResultAnnounceDate) <= new Date(data.roundEndDate)
        );
      },
      {
        message: t.resultDateWithinContest,
        path: ["roundResultAnnounceDate"],
      }
    )
    .refine(
      (data) => {
        if (!data.roundSendOriginalDeadline || !data.roundStartDate)
          return true;
        return (
          new Date(data.roundSendOriginalDeadline) >=
          new Date(data.roundStartDate)
        );
      },
      {
        message: t.originalDeadlineWithinContest,
        path: ["roundSendOriginalDeadline"],
      }
    )
    .refine(
      (data) => {
        if (!data.roundSendOriginalDeadline || !data.roundEndDate) return true;
        return (
          new Date(data.roundSendOriginalDeadline) <=
          new Date(data.roundEndDate)
        );
      },
      {
        message: t.originalDeadlineWithinContest,
        path: ["roundSendOriginalDeadline"],
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
        message: t.competitorsEvenlyDivided,
        path: ["numberOfTablesRound2"],
      }
    );

type CreateContestFormData = z.infer<ReturnType<typeof createContestSchema>>;

export default function CreateContestPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const { currentLanguage } = useLanguageStore();
  const t = useTranslation(currentLanguage);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting, isValid },
    setValue,
    watch,
  } = useForm<CreateContestFormData>({
    mode: "all",
    resolver: zodResolver(createContestSchema(t)),
    defaultValues: {
      round2Quantity: 0,
      numberOfTablesRound2: 0,
    },
  });

  const watchedRound2Quantity = watch("round2Quantity");

  // Watch date fields for interdependent validation and constraints
  const watchedStartDate = watch("startDate");
  const watchedEndDate = watch("endDate");
  const watchedRoundStartDate = watch("roundStartDate");
  const watchedRoundEndDate = watch("roundEndDate");
  const watchedRule = watch("rule");
  const watchedNumberOfTablesRound2 = watch("numberOfTablesRound2");

  // Get today's date for min constraint on startDate
  const today = new Date();
  const todayString = formatDateForInput(today);

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
        setValue("numberOfTablesRound2", defaultValue, {
          shouldValidate: true,
        });
      }
    }
    // Trigger validation for numberOfTablesRound2 when round2Quantity changes
  }, [watchedRound2Quantity, setValue, watch]);

  const createBatchAwardMutation = useCreateBatchAward();

  const createMutation = useMutation({
    mutationFn: createStaffContest,
    onSuccess: (value) => {
      queryClient.invalidateQueries({ queryKey: ["staff-contests"] });
      toast.success("Tạo cuộc thi thành công!");
      createBatchAwardMutation.mutate(
        {
          awards: [
            {
              contestId: value.data.contest.contestId,
              name: "Giải nhất",
              description: `Giải nhất cuộc thi ${value.data.contest.title}`,
              prize: 0,
              quantity: 1,
              rank: 1,
            },
            {
              contestId: value.data.contest.contestId,
              name: "Giải nhì",
              description: `Giải nhì cuộc thi ${value.data.contest.title}`,
              prize: 0,
              quantity: 1,
              rank: 2,
            },
            {
              contestId: value.data.contest.contestId,
              name: "Giải ba",
              description: `Giải ba cuộc thi ${value.data.contest.title}`,
              prize: 0,
              quantity: 1,
              rank: 3,
            },
          ],
        },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["awards"] });
          },
        }
      );
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
      setValue(field, file, { shouldValidate: true, shouldDirty: true });
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
        <SiteHeader title={t.createContest} />
        <div className="flex flex-1 flex-col">
          <div className="px-4 lg:px-6 py-2 border-b border-[#e6e2da] bg-white">
            <Breadcrumb
              items={[
                {
                  label: t.contestManagement,
                  href: "/dashboard/staff/contests",
                },
                { label: t.createContest },
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
                      {t.createNewContest}
                    </h2>
                    <p className="text-sm staff-text-secondary mt-1">
                      {t.setupNewArtCompetition}
                    </p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Basic Information */}
                <div className="staff-card p-6">
                  <h3 className="text-lg font-bold staff-text-primary mb-4">
                    {t.basicInformation}
                  </h3>
                  <div className="grid gap-4">
                    <div>
                      <label className="block text-sm font-medium staff-text-primary mb-2">
                        {t.contestTitle} *
                      </label>
                      <input
                        type="text"
                        {...register("title")}
                        className="w-full px-3 py-2 border border-[#e6e2da] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder={t.enterContestTitle}
                      />
                      {errors.title && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.title.message}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium staff-text-primary mb-2">
                      {t.description} *
                    </label>
                    <textarea
                      {...register("description")}
                      required
                      rows={4}
                      className="w-full px-3 py-2 border border-[#e6e2da] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder={t.describeContestTheme}
                    />
                    {errors.description && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.description.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Contest Dates */}
                <div className="staff-card p-6">
                  <h3 className="text-lg font-bold staff-text-primary mb-4">
                    {t.contestDates}
                  </h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium staff-text-primary mb-2">
                        {t.startDate} *
                      </label>
                      <Controller
                        name="startDate"
                        control={control}
                        render={({ field: { onChange, value, ...field } }) => (
                          <input
                            type="date"
                            {...field}
                            value={value || ""}
                            onKeyDown={(e) => e.preventDefault()}
                            onChange={(e) =>
                              onChange(e.target.value || undefined)
                            }
                            required
                            min={todayString}
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
                      <label className="block text-sm font-medium staff-text-primary mb-2">
                        {t.endDate} *
                      </label>
                      <Controller
                        name="endDate"
                        control={control}
                        render={({ field: { onChange, value, ...field } }) => (
                          <input
                            type="date"
                            {...field}
                            value={value || ""}
                            onKeyDown={(e) => e.preventDefault()}
                            onChange={(e) =>
                              onChange(e.target.value || undefined)
                            }
                            required
                            disabled={!watchedStartDate}
                            min={
                              watchedStartDate
                                ? formatDateForInput(new Date(watchedStartDate))
                                : todayString
                            }
                            className={`w-full px-3 py-2 border border-[#e6e2da] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                              !watchedStartDate
                                ? "opacity-50 bg-gray-50 cursor-not-allowed"
                                : ""
                            }`}
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
                </div>

                {/* Round Dates */}
                <div className="staff-card p-6">
                  <h3 className="text-lg font-bold staff-text-primary mb-4">
                    {t.roundDates}
                  </h3>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <div>
                      <label className="block text-sm font-medium staff-text-primary mb-2">
                        {t.roundStartDate}
                      </label>
                      <Controller
                        name="roundStartDate"
                        control={control}
                        render={({ field: { onChange, value, ...field } }) => (
                          <input
                            type="date"
                            {...field}
                            value={value || ""}
                            onKeyDown={(e) => e.preventDefault()}
                            onChange={(e) =>
                              onChange(e.target.value || undefined)
                            }
                            disabled={!watchedStartDate}
                            min={
                              watchedStartDate
                                ? formatDateForInput(new Date(watchedStartDate))
                                : todayString
                            }
                            max={
                              watchedEndDate
                                ? formatDateForInput(new Date(watchedEndDate))
                                : undefined
                            }
                            className={`w-full px-3 py-2 border border-[#e6e2da] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                              !watchedStartDate
                                ? "opacity-50 bg-gray-50 cursor-not-allowed"
                                : ""
                            }`}
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
                      <label className="block text-sm font-medium staff-text-primary mb-2">
                        {t.roundEndDate}
                      </label>
                      <Controller
                        name="roundEndDate"
                        control={control}
                        render={({ field: { onChange, value, ...field } }) => (
                          <input
                            type="date"
                            {...field}
                            value={value || ""}
                            onKeyDown={(e) => e.preventDefault()}
                            onChange={(e) =>
                              onChange(e.target.value || undefined)
                            }
                            disabled={!watchedRoundStartDate}
                            min={
                              watchedRoundStartDate
                                ? formatDateForInput(
                                    new Date(watchedRoundStartDate)
                                  )
                                : watchedStartDate
                                ? formatDateForInput(new Date(watchedStartDate))
                                : todayString
                            }
                            max={
                              watchedEndDate
                                ? formatDateForInput(new Date(watchedEndDate))
                                : undefined
                            }
                            className={`w-full px-3 py-2 border border-[#e6e2da] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                              !watchedRoundStartDate
                                ? "opacity-50 bg-gray-50 cursor-not-allowed"
                                : ""
                            }`}
                          />
                        )}
                      />
                      {errors.roundEndDate && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.roundEndDate.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium staff-text-primary mb-2">
                        {t.submissionDeadline}
                      </label>
                      <Controller
                        name="roundSubmissionDeadline"
                        control={control}
                        render={({ field: { onChange, value, ...field } }) => (
                          <input
                            type="date"
                            {...field}
                            value={value || ""}
                            onKeyDown={(e) => e.preventDefault()}
                            onChange={(e) =>
                              onChange(e.target.value || undefined)
                            }
                            disabled={
                              !watchedRoundStartDate || !watchedRoundEndDate
                            }
                            min={
                              watchedRoundStartDate
                                ? formatDateForInput(
                                    new Date(watchedRoundStartDate)
                                  )
                                : watchedStartDate
                                ? formatDateForInput(new Date(watchedStartDate))
                                : todayString
                            }
                            max={
                              watchedRoundEndDate
                                ? formatDateForInput(
                                    new Date(watchedRoundEndDate)
                                  )
                                : watchedEndDate
                                ? formatDateForInput(new Date(watchedEndDate))
                                : undefined
                            }
                            className={`w-full px-3 py-2 border border-[#e6e2da] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                              !watchedRoundStartDate || !watchedRoundEndDate
                                ? "opacity-50 bg-gray-50 cursor-not-allowed"
                                : ""
                            }`}
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
                      <label className="block text-sm font-medium staff-text-primary mb-2">
                        {t.resultAnnouncementDate}
                      </label>
                      <Controller
                        name="roundResultAnnounceDate"
                        control={control}
                        render={({ field: { onChange, value, ...field } }) => (
                          <input
                            type="date"
                            {...field}
                            value={value || ""}
                            onKeyDown={(e) => e.preventDefault()}
                            onChange={(e) =>
                              onChange(e.target.value || undefined)
                            }
                            disabled={
                              !watchedRoundStartDate || !watchedRoundEndDate
                            }
                            min={
                              watchedRoundStartDate
                                ? formatDateForInput(
                                    new Date(watchedRoundStartDate)
                                  )
                                : watchedStartDate
                                ? formatDateForInput(new Date(watchedStartDate))
                                : todayString
                            }
                            max={
                              watchedRoundEndDate
                                ? formatDateForInput(
                                    new Date(watchedRoundEndDate)
                                  )
                                : watchedEndDate
                                ? formatDateForInput(new Date(watchedEndDate))
                                : undefined
                            }
                            className={`w-full px-3 py-2 border border-[#e6e2da] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                              !watchedRoundStartDate || !watchedRoundEndDate
                                ? "opacity-50 bg-gray-50 cursor-not-allowed"
                                : ""
                            }`}
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
                      <label className="block text-sm font-medium staff-text-primary mb-2">
                        {t.sendOriginalDeadline}
                      </label>
                      <Controller
                        name="roundSendOriginalDeadline"
                        control={control}
                        render={({ field: { onChange, value, ...field } }) => (
                          <input
                            type="date"
                            {...field}
                            value={value || ""}
                            onKeyDown={(e) => e.preventDefault()}
                            onChange={(e) =>
                              onChange(e.target.value || undefined)
                            }
                            disabled={
                              !watchedRoundStartDate || !watchedRoundEndDate
                            }
                            min={
                              watchedRoundStartDate
                                ? formatDateForInput(
                                    new Date(watchedRoundStartDate)
                                  )
                                : watchedStartDate
                                ? formatDateForInput(new Date(watchedStartDate))
                                : todayString
                            }
                            max={
                              watchedRoundEndDate
                                ? formatDateForInput(
                                    new Date(watchedRoundEndDate)
                                  )
                                : watchedEndDate
                                ? formatDateForInput(new Date(watchedEndDate))
                                : undefined
                            }
                            className={`w-full px-3 py-2 border border-[#e6e2da] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                              !watchedRoundStartDate || !watchedRoundEndDate
                                ? "opacity-50 bg-gray-50 cursor-not-allowed"
                                : ""
                            }`}
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

                {/* Round 2 Configuration */}
                <div className="staff-card p-6">
                  <h3 className="text-lg font-bold staff-text-primary mb-4">
                    {t.round2Configuration}
                  </h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium staff-text-primary mb-2">
                        {t.round2CompetitorsLabel}
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
                            min="0"
                            className="w-full px-3 py-2 border border-[#e6e2da] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                      <label className="block text-sm font-medium staff-text-primary mb-2">
                        {t.numberOfTablesRound2}
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
                                      i <= Math.min(watchedRound2Quantity, 10);
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
                          />
                        )}
                      />
                      {errors.numberOfTablesRound2 && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.numberOfTablesRound2.message}
                        </p>
                      )}
                      {watchedRound2Quantity > 0 &&
                        watchedNumberOfTablesRound2 > 0 &&
                        watchedRound2Quantity % watchedNumberOfTablesRound2 ===
                          0 && (
                          <p className="text-sm text-gray-600 mt-1">
                            {t.competitorsDivisionMessage
                              .replace(
                                "{count}",
                                watchedRound2Quantity.toString()
                              )
                              .replace(
                                "{tables}",
                                watchedNumberOfTablesRound2.toString()
                              )
                              .replace(
                                "{perTable}",
                                Math.floor(
                                  watchedRound2Quantity /
                                    watchedNumberOfTablesRound2
                                ).toString()
                              )}
                          </p>
                        )}
                    </div>
                  </div>
                </div>

                {/* Files */}
                <div className="staff-card p-6">
                  <h3 className="text-lg font-bold staff-text-primary mb-4">
                    {t.files}
                  </h3>
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium staff-text-primary mb-2">
                          {t.bannerImage} *
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, "banner")}
                          className="w-full px-3 py-2 border border-[#e6e2da] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        {errors.banner && (
                          <p className="text-red-500 text-sm mt-1">
                            {typeof errors.banner.message === "string"
                              ? errors.banner.message
                              : "Invalid banner file"}
                          </p>
                        )}
                      </div>
                      {bannerPreview && (
                        <div>
                          <p className="text-sm font-medium staff-text-primary mb-2">
                            {t.bannerPreview}
                          </p>
                          <Image
                            src={bannerPreview}
                            alt="Banner preview"
                            width={300}
                            height={150}
                            className="object-cover rounded border shadow-sm w-full"
                          />
                        </div>
                      )}
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium staff-text-primary mb-2">
                          {t.rulesFilePDF} *
                        </label>
                        <input
                          type="file"
                          accept=".pdf"
                          onChange={(e) => handleFileChange(e, "rule")}
                          className="w-full px-3 py-2 border border-[#e6e2da] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        {errors.rule && (
                          <p className="text-red-500 text-sm mt-1">
                            {typeof errors.rule.message === "string"
                              ? errors.rule.message
                              : "Invalid rules file"}
                          </p>
                        )}
                        {watchedRule && (
                          <p className="text-sm text-gray-600 mt-1">
                            {t.selectedFile} {(watchedRule as File)?.name}
                          </p>
                        )}
                      </div>

                      {/* Small PDF Viewer */}
                      {watchedRule && (
                        <div className="border border-[#e6e2da] rounded overflow-hidden">
                          <div className="bg-blue-50 px-3 py-2 border-b border-[#e6e2da]">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <IconFileText className="h-4 w-4 text-blue-600" />
                                <span className="text-sm font-medium staff-text-primary">
                                  {t.pdfPreview}
                                </span>
                              </div>
                              <a
                                href={URL.createObjectURL(watchedRule)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 text-sm"
                              >
                                <IconEye className="h-4 w-4" />
                              </a>
                            </div>
                          </div>
                          <div className="relative bg-white">
                            <iframe
                              src={URL.createObjectURL(watchedRule)}
                              className="w-full h-[300px] border-0"
                              title="Contest Rules PDF Preview"
                              loading="lazy"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-4 justify-end">
                  <Link
                    href="/dashboard/staff/contests"
                    className="px-6 py-2 border-2 border-[#e6e2da] staff-text-primary font-semibold hover:bg-[#f7f7f7] transition-colors flex items-center gap-2"
                  >
                    <IconX className="h-4 w-4" />
                    {t.cancel}
                  </Link>
                  <button
                    type="submit"
                    disabled={
                      isSubmitting || createMutation.isPending || !isValid
                    }
                    className="px-6 py-2 bg-linear-to-r from-[#d9534f] to-[#e67e73] text-white font-semibold shadow-md hover:shadow-lg transition-shadow disabled:opacity-50 flex items-center gap-2"
                  >
                    <IconDeviceFloppy className="h-4 w-4" />
                    {isSubmitting || createMutation.isPending
                      ? t.creatingContest
                      : t.createContest}
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
