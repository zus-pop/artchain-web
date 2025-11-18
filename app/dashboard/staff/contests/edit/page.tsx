"use client";

import { getStaffContestById, updateStaffContest } from "@/apis/staff";
import { Breadcrumb } from "@/components/breadcrumb";
import { SiteHeader } from "@/components/site-header";
import { StaffSidebar } from "@/components/staff-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Contest } from "@/types/dashboard";
import { UpdateContestRequest } from "@/types/staff/contest-dto";
import { useTranslation, Lang } from "@/lib/i18n";
import { useLanguageStore } from "@/store/language-store";
import { IconArrowLeft, IconDeviceFloppy, IconX } from "@tabler/icons-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { toast } from "sonner";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// Zod validation schema with translations
const editContestSchema = (t: Lang) =>
  z
    .object({
      title: z.string().min(1, t.titleRequired).max(255, t.titleTooLong),
      description: z
        .string()
        .min(1, t.descriptionRequired)
        .max(2000, t.descriptionTooLong),
      round2Quantity: z
        .number()
        .min(0, t.topCompetitorsMin)
        .max(100, t.topCompetitorsMax),
      numberOfTablesRound2: z.number().min(0, t.tablesMin).max(26, t.tablesMax),
      startDate: z.string().min(1, t.startDateRequired),
      endDate: z.string().min(1, t.endDateRequired),
      banner: z
        .any()
        .optional()
        .refine((file) => !file || file instanceof File, t.bannerInvalidType)
        .refine(
          (file) =>
            !file || (file instanceof File && file.size <= 5 * 1024 * 1024), // 5MB
          t.bannerTooLarge
        )
        .refine(
          (file) =>
            !file ||
            (file instanceof File &&
              ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(
                file.type
              )),
          t.bannerInvalidType
        ),
      rule: z
        .any()
        .optional()
        .refine((file) => !file || file instanceof File, t.rulesInvalidType)
        .refine(
          (file) =>
            !file || (file instanceof File && file.size <= 20 * 1024 * 1024), // 20MB
          t.rulesTooLarge
        )
        .refine(
          (file) =>
            !file || (file instanceof File && file.type === "application/pdf"),
          t.rulesInvalidType
        ),
      roundStartDate: z.string().optional(),
      roundEndDate: z.string().optional(),
      roundSubmissionDeadline: z.string().optional(),
      roundResultAnnounceDate: z.string().optional(),
      roundSendOriginalDeadline: z.string().optional(),
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

type EditContestFormData = z.infer<ReturnType<typeof editContestSchema>>;

function EditContestContent() {
  const searchParams = useSearchParams();
  const contestId = searchParams.get("id");
  const router = useRouter();
  const queryClient = useQueryClient();
  const { currentLanguage } = useLanguageStore();
  const t = useTranslation(currentLanguage);

  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [ruleFile, setRuleFile] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting, isValid },
    setValue,
    watch,
  } = useForm<EditContestFormData>({
    mode: "all",
    resolver: zodResolver(editContestSchema(t)),
    defaultValues: {
      round2Quantity: 0,
      numberOfTablesRound2: 0,
    },
  });

  const watchedRound2Quantity = watch("round2Quantity");

  // Fetch contest details
  const { data: contestData, isLoading } = useQuery({
    queryKey: ["contest-detail", contestId],
    queryFn: () => getStaffContestById(Number(contestId)),
    enabled: !!contestId,
  });

  const contest = contestData?.data as Contest;

  // Initialize form with contest data
  useEffect(() => {
    if (contest) {
      // Find round 1 data (round with ID 1 or name containing "round 1")
      const round1Data = contest.rounds?.find(
        (round) =>
          round.roundId === 1 ||
          round.name?.toLowerCase().includes("round 1") ||
          round.name?.toLowerCase().includes("round_1")
      );

      setValue("title", contest.title || "");
      setValue("description", contest.description || "");
      setValue("round2Quantity", contest.round2Quantity);
      setValue("numberOfTablesRound2", contest.numberOfTablesRound2);
      setValue(
        "startDate",
        contest.startDate
          ? new Date(contest.startDate).toISOString().split("T")[0]
          : ""
      );
      setValue(
        "endDate",
        contest.endDate
          ? new Date(contest.endDate).toISOString().split("T")[0]
          : ""
      );
      setValue(
        "roundStartDate",
        round1Data?.startDate
          ? new Date(round1Data.startDate).toISOString().split("T")[0]
          : ""
      );
      setValue(
        "roundEndDate",
        round1Data?.endDate
          ? new Date(round1Data.endDate).toISOString().split("T")[0]
          : ""
      );
      setValue(
        "roundSubmissionDeadline",
        round1Data?.submissionDeadline
          ? new Date(round1Data.submissionDeadline).toISOString().split("T")[0]
          : ""
      );
      setValue(
        "roundResultAnnounceDate",
        round1Data?.resultAnnounceDate
          ? new Date(round1Data.resultAnnounceDate).toISOString().split("T")[0]
          : ""
      );
      setValue(
        "roundSendOriginalDeadline",
        round1Data?.sendOriginalDeadline
          ? new Date(round1Data.sendOriginalDeadline)
              .toISOString()
              .split("T")[0]
          : ""
      );

      if (contest.bannerUrl) {
        setBannerPreview(contest.bannerUrl);
      }
    }
  }, [contest, setValue]);

  // Update numberOfTablesRound2 when round2Quantity changes
  useEffect(() => {
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

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: updateStaffContest,
    onSuccess: () => {
      toast.success("Contest updated successfully!");
      queryClient.invalidateQueries({
        queryKey: ["contest-detail", contestId],
      });
      queryClient.invalidateQueries({
        queryKey: ["staff-contests"],
      });
      router.push(`/dashboard/staff/contests/detail?id=${contestId}`);
    },
    onError: (error) => {
      let message = error.message;
      if (error instanceof AxiosError) {
        message = error.response?.data.message;
      }
      toast.error(message);
    },
  });

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "banner" | "rule"
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue(type, file, { shouldValidate: true, shouldDirty: true });
      if (type === "banner") {
        setBannerFile(file);
        const previewUrl = URL.createObjectURL(file);
        setBannerPreview(previewUrl);
      } else {
        setRuleFile(file);
      }
    }
  };

  const onSubmit = (data: EditContestFormData) => {
    if (!contestId) return;

    const updateData: UpdateContestRequest = {
      contestId,
      ...data,
    };

    // Add files if they exist
    if (bannerFile) {
      updateData.banner = bannerFile;
    }
    if (ruleFile) {
      updateData.rule = ruleFile;
    }
    const postDraftData: UpdateContestRequest = {
      contestId,
      round2Quantity: data.round2Quantity,
      numberOfTablesRound2: data.numberOfTablesRound2,
    };

    updateMutation.mutate(
      contest.status !== "DRAFT" ? postDraftData : updateData
    );
  };

  const handleCancel = () => {
    router.push(`/dashboard/staff/contests/detail?id=${contestId}`);
  };

  if (!contestId) {
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
          <SiteHeader title={t.editContestTitle} />
          <div className="flex flex-1 items-center justify-center">
            <div className="text-gray-500">{t.contestIdRequired}</div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  if (isLoading) {
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
          <SiteHeader title={t.editContestTitle} />
          <div className="flex flex-1 items-center justify-center">
            <div className="text-gray-500">{t.loadingContestDetails}</div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  if (!contest) {
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
          <SiteHeader title={t.editContestTitle} />
          <div className="flex flex-1 items-center justify-center">
            <div className="text-gray-500">{t.contestNotFound}</div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  const readOnly = contest.status !== "DRAFT";

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
        <SiteHeader title={t.editContestTitle} />
        <div className="flex flex-1 flex-col">
          <div className="px-4 lg:px-6 py-2 border-b border-[#e6e2da] bg-white">
            <Breadcrumb
              items={[
                {
                  label: t.contestManagementBreadcrumb,
                  href: "/dashboard/staff/contests",
                },
                {
                  label: contest.title,
                  href: `/dashboard/staff/contests/detail?id=${contestId}`,
                },
                { label: t.editBreadcrumb },
              ]}
              homeHref="/dashboard/staff"
            />
          </div>
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
              {/* Page Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Link
                    href={`/dashboard/staff/contests/detail?id=${contestId}`}
                    className="border-2 border-[#e6e2da] p-2 hover:bg-[#f9f7f4] transition-colors"
                  >
                    <IconArrowLeft className="h-5 w-5 staff-text-secondary" />
                  </Link>
                  <div>
                    <h2 className="text-2xl font-bold staff-text-primary">
                      {t.editContestTitle}
                    </h2>
                  </div>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Basic Information */}
                <div className="staff-card p-6">
                  <h3 className="text-lg font-bold staff-text-primary mb-4">
                    Basic Information
                  </h3>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div>
                      <label className="block text-sm font-medium staff-text-primary mb-2">
                        Title *
                      </label>
                      <input
                        type="text"
                        {...register("title")}
                        readOnly={readOnly}
                        className={`w-full px-3 py-2 border border-[#e6e2da] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          readOnly
                            ? "opacity-50 bg-gray-50 cursor-not-allowed"
                            : ""
                        }`}
                      />
                      {errors.title && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.title.message}
                        </p>
                      )}
                    </div>
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
                            className={`w-full px-3 py-2 border border-[#e6e2da] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
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
                        <p className="text-sm text-gray-600 mt-1">
                          {t.competitorsDivisionMessage
                            .replace(
                              "{count}",
                              watchedRound2Quantity.toString()
                            )
                            .replace(
                              "{tables}",
                              (watch("numberOfTablesRound2") || 0).toString()
                            )
                            .replace(
                              "{perTable}",
                              (watch("numberOfTablesRound2")
                                ? Math.floor(
                                    watchedRound2Quantity /
                                      (watch("numberOfTablesRound2") || 1)
                                  )
                                : 0
                              ).toString()
                            )}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium staff-text-primary mb-2">
                      Description *
                    </label>
                    <textarea
                      {...register("description")}
                      required
                      rows={4}
                      readOnly={readOnly}
                      className={`w-full px-3 py-2 border border-[#e6e2da] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        readOnly
                          ? "opacity-50 bg-gray-50 cursor-not-allowed"
                          : ""
                      }`}
                    />
                    {errors.description && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.description.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Dates */}
                <div className="staff-card p-6">
                  <h3 className="text-lg font-bold staff-text-primary mb-4">
                    {t.contestDates}
                  </h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium staff-text-primary mb-2">
                        Start Date *
                      </label>
                      <Controller
                        name="startDate"
                        control={control}
                        render={({ field: { onChange, value, ...field } }) => (
                          <input
                            type="date"
                            {...field}
                            value={value || ""}
                            onChange={(e) =>
                              onChange(e.target.value || undefined)
                            }
                            required
                            readOnly={readOnly}
                            className={`w-full px-3 py-2 border border-[#e6e2da] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                              readOnly
                                ? "opacity-50 bg-gray-50 cursor-not-allowed"
                                : ""
                            }`}
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
                        End Date *
                      </label>
                      <Controller
                        name="endDate"
                        control={control}
                        render={({ field: { onChange, value, ...field } }) => (
                          <input
                            type="date"
                            {...field}
                            value={value || ""}
                            onChange={(e) =>
                              onChange(e.target.value || undefined)
                            }
                            required
                            readOnly={readOnly}
                            className={`w-full px-3 py-2 border border-[#e6e2da] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                              readOnly
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
                        Round Start Date
                      </label>
                      <Controller
                        name="roundStartDate"
                        control={control}
                        render={({ field: { onChange, value, ...field } }) => (
                          <input
                            type="date"
                            {...field}
                            value={value || ""}
                            onChange={(e) =>
                              onChange(e.target.value || undefined)
                            }
                            readOnly={readOnly}
                            className={`w-full px-3 py-2 border border-[#e6e2da] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                              readOnly
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
                        Round End Date
                      </label>
                      <Controller
                        name="roundEndDate"
                        control={control}
                        render={({ field: { onChange, value, ...field } }) => (
                          <input
                            type="date"
                            {...field}
                            value={value || ""}
                            onChange={(e) =>
                              onChange(e.target.value || undefined)
                            }
                            readOnly={readOnly}
                            className={`w-full px-3 py-2 border border-[#e6e2da] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                              readOnly
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
                        Submission Deadline
                      </label>
                      <Controller
                        name="roundSubmissionDeadline"
                        control={control}
                        render={({ field: { onChange, value, ...field } }) => (
                          <input
                            type="date"
                            {...field}
                            value={value || ""}
                            onChange={(e) =>
                              onChange(e.target.value || undefined)
                            }
                            readOnly={readOnly}
                            className={`w-full px-3 py-2 border border-[#e6e2da] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                              readOnly
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
                        Result Announce Date
                      </label>
                      <Controller
                        name="roundResultAnnounceDate"
                        control={control}
                        render={({ field: { onChange, value, ...field } }) => (
                          <input
                            type="date"
                            {...field}
                            value={value || ""}
                            onChange={(e) =>
                              onChange(e.target.value || undefined)
                            }
                            readOnly={readOnly}
                            className={`w-full px-3 py-2 border border-[#e6e2da] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                              readOnly
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
                        Original Deadline
                      </label>
                      <Controller
                        name="roundSendOriginalDeadline"
                        control={control}
                        render={({ field: { onChange, value, ...field } }) => (
                          <input
                            type="date"
                            {...field}
                            value={value || ""}
                            onChange={(e) =>
                              onChange(e.target.value || undefined)
                            }
                            readOnly={readOnly}
                            className={`w-full px-3 py-2 border border-[#e6e2da] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                              readOnly
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

                {/* Files */}
                <div className="staff-card p-6">
                  <h3 className="text-lg font-bold staff-text-primary mb-4">
                    {t.files}
                  </h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium staff-text-primary mb-2">
                        {t.bannerImage}
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, "banner")}
                        disabled={readOnly}
                        className="w-full px-3 py-2 border border-[#e6e2da] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:bg-gray-50 disabled:cursor-not-allowed"
                      />
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
                      <label className="block text-sm font-medium staff-text-primary mb-2">
                        {t.rulesFile}
                      </label>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        disabled={readOnly}
                        onChange={(e) => handleFileChange(e, "rule")}
                        className="w-full px-3 py-2 border border-[#e6e2da] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:bg-gray-50 disabled:cursor-not-allowed"
                      />
                      {ruleFile && (
                        <p className="text-sm staff-text-secondary mt-1">
                          {t.selectedFile}: {ruleFile.name}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-4 justify-end">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-6 py-2 border-2 border-[#e6e2da] staff-text-primary font-semibold hover:bg-[#f7f7f7] transition-colors flex items-center gap-2"
                  >
                    <IconX className="h-4 w-4" />
                    {t.cancel}
                  </button>
                  <button
                    type="submit"
                    disabled={
                      isSubmitting || updateMutation.isPending || !isValid
                    }
                    className="px-6 py-2 bg-linear-to-r from-[#d9534f] to-[#e67e73] text-white font-semibold shadow-md hover:shadow-lg transition-shadow disabled:opacity-50 flex items-center gap-2"
                  >
                    <IconDeviceFloppy className="h-4 w-4" />
                    {isSubmitting || updateMutation.isPending
                      ? "Saving..."
                      : t.saveChanges}
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

export default function EditContestPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#d9534f]"></div>
        </div>
      }
    >
      <EditContestContent />
    </Suspense>
  );
}
