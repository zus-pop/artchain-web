"use client";
import { createStaffCampaign, getSponsorshipTierDefinitions } from "@/apis/staff";
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
  IconMoneybag,
} from "@tabler/icons-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import {
  CampaignTierInput,
  CreateCampaignRequest,
  TierDefinition,
} from "@/types/staff/campaign";
import { Lang, useTranslation } from "@/lib/i18n";
import { useLanguageStore } from "@/store/language-store";
import Link from "next/link";

const parseCurrencyInput = (value: string) => {
  const digitsOnly = value.replace(/\D/g, "");
  return digitsOnly ? Number(digitsOnly) : NaN;
};

const formatCurrencyInput = (value: string) => {
  const digitsOnly = value.replace(/\D/g, "");
  if (!digitsOnly) return "";
  return new Intl.NumberFormat("vi-VN").format(Number(digitsOnly));
};

// Zod schema for form validation
const getCampaignSchema = (t: Lang) =>
  z.object({
    title: z
      .string()
      .min(1, t.campaignTitleRequired)
      .max(200, t.campaignTitleMaxLength),
    description: z
      .string()
      .min(1, t.campaignDescriptionRequired)
      .max(1000, t.campaignDescriptionMaxLength),
    goalAmount: z
      .string()
      .min(1, t.goalAmountMin)
      .refine((value) => {
        const amount = parseCurrencyInput(value);
        return !Number.isNaN(amount) && amount >= 1000;
      }, t.goalAmountMin),
    deadline: z.string().min(1, t.deadlineRequired),
    status: z.enum(["DRAFT", "ACTIVE", "PAUSED", "COMPLETED"]),
    bronzeMinPrice: z.string().optional(),
    silverMinPrice: z.string().optional(),
    goldMinPrice: z.string().optional(),
    diamondMinPrice: z.string().optional(),
    image: z
      .any()
      .refine((file) => file instanceof File && file.size > 0, t.imageRequired),
  })
  .superRefine((data, ctx) => {
    const bronze = parseCurrencyInput(data.bronzeMinPrice || "");
    const silver = parseCurrencyInput(data.silverMinPrice || "");
    const gold = parseCurrencyInput(data.goldMinPrice || "");
    const diamond = parseCurrencyInput(data.diamondMinPrice || "");

    // Validation sequence: 1 (Bronze) < 2 (Silver) < 3 (Gold) < 4 (Diamond)
    if (!Number.isNaN(bronze) && !Number.isNaN(silver) && silver <= bronze) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["silverMinPrice"],
        message: "Tối thiểu hạng Bạc phải lớn hơn hạng Đồng",
      });
    }
    if (!Number.isNaN(silver) && !Number.isNaN(gold) && gold <= silver) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["goldMinPrice"],
        message: "Tối thiểu hạng Vàng phải lớn hơn hạng Bạc",
      });
    }
    if (!Number.isNaN(gold) && !Number.isNaN(diamond) && diamond <= gold) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["diamondMinPrice"],
        message: "Tối thiểu hạng Kim cương phải lớn hơn hạng Vàng",
      });
    }
  });

type CampaignFormData = z.infer<ReturnType<typeof getCampaignSchema>>;

export default function CreateCampaignPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const { currentLanguage } = useLanguageStore();
  const t = useTranslation(currentLanguage);

  const tierOrder: Array<TierDefinition["name"]> = [
    "bronze",
    "silver",
    "gold",
    "diamond",
  ];

  const fallbackTiers: TierDefinition[] = [
    {
      id: 1,
      name: "bronze",
      display: "Đồng",
      priority: 1,
      benefits: "Gói cơ bản",
    },
    {
      id: 2,
      name: "silver",
      display: "Bạc",
      priority: 2,
      benefits: "Gói nâng cao",
    },
    {
      id: 3,
      name: "gold",
      display: "Vàng",
      priority: 3,
      benefits: "Gói cao cấp",
    },
    {
      id: 4,
      name: "diamond",
      display: "Kim cương",
      priority: 4,
      benefits: "Gói cao nhất",
    },
  ];

  // Cleanup image preview URL on unmount
  useEffect(() => {
    return () => {
      if (imagePreviewUrl) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
    };
  }, [imagePreviewUrl]);

  // React Hook Form setup
  const form = useForm<CampaignFormData>({
    resolver: zodResolver(getCampaignSchema(t)),
    defaultValues: {
      title: "",
      description: "",
      goalAmount: "",
      deadline: "",
      status: "DRAFT",
      bronzeMinPrice: "",
      silverMinPrice: "",
      goldMinPrice: "",
      diamondMinPrice: "",
    },
    mode: "all",
  });

  const { data: tierDefinitionsRes } = useQuery({
    queryKey: ["tier-definitions"],
    queryFn: getSponsorshipTierDefinitions,
  });

  const tierDefinitions = tierOrder.map((name) => {
    return (
      tierDefinitionsRes?.data?.find((tier) => tier.name === name) ||
      fallbackTiers.find((tier) => tier.name === name)!
    );
  });

  const watchedImage = form.watch("image");

  const mutation = useMutation({
    mutationFn: async (data: CreateCampaignRequest) => {
      return createStaffCampaign(data);
    },
    onSuccess: () => {
      toast.success(t.campaignCreatedSuccessMessage);
      queryClient.invalidateQueries({ queryKey: ["campaign"] });
      router.push("/dashboard/staff/campaigns");
    },
    onError: (error) => {
      let message = error.message;
      if (error instanceof AxiosError) {
        message = error.response?.data.message;
      }
      toast.error(message);
    },
  });

  const handleSubmit = async (data: CampaignFormData) => {
    setIsSubmitting(true);

    const tierFieldByName: Record<
      TierDefinition["name"],
      "bronzeMinPrice" | "silverMinPrice" | "goldMinPrice" | "diamondMinPrice"
    > = {
      bronze: "bronzeMinPrice",
      silver: "silverMinPrice",
      gold: "goldMinPrice",
      diamond: "diamondMinPrice",
    };

    const tiersPayload: CampaignTierInput[] = tierDefinitions
      .map((tier) => {
        const minPrice = parseCurrencyInput(data[tierFieldByName[tier.name]] || "");
        if (Number.isNaN(minPrice) || minPrice <= 0) {
          return null;
        }

        return {
          tierId: tier.id,
          minPrice,
        };
      })
      .filter((tier): tier is CampaignTierInput => tier !== null);

    const payload: CreateCampaignRequest = {
      title: data.title,
      description: data.description,
      goalAmount: parseCurrencyInput(data.goalAmount),
      deadline: data.deadline,
      status: "DRAFT",
      image: data.image,
      tiers: tiersPayload,
    };

    await mutation.mutateAsync(payload);
    setIsSubmitting(false);
  };

  const handleSaveDraft = () => {
    console.log("Saving draft:", form.getValues());
    // Here you would typically make an API call to save as draft
  };

  const handleCurrencyInputChange = (
    fieldName:
      | "goalAmount"
      | "bronzeMinPrice"
      | "silverMinPrice"
      | "goldMinPrice"
      | "diamondMinPrice"
  ) => (e: React.ChangeEvent<HTMLInputElement>) => {
    form.setValue(fieldName, formatCurrencyInput(e.target.value), {
      shouldDirty: true,
      shouldValidate: true,
    });
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
        <SiteHeader title={t.createSponsorshipCampaign} />
        <div className="flex flex-1 flex-col">
          <div className="staff-page-header">
            <Breadcrumb
              items={[
                {
                  label: t.campaignsManagement,
                  href: "/dashboard/staff/campaigns",
                },
                { label: t.createCampaign },
              ]}
              homeHref="/dashboard/staff"
            />
          </div>
          <div className="flex flex-1 flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link
                  href="/dashboard/staff/campaigns"
                  className="staff-btn-outline p-2"
                >
                  <IconArrowLeft className="h-5 w-5 staff-text-secondary" />
                </Link>

                <div>
                  <h2 className="staff-type-page-title staff-text-primary">
                    {t.createNewCampaign}
                  </h2>
                  <p className="text-sm staff-text-secondary mt-1">
                    {t.setupNewCampaign}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSaveDraft}
                  className=" border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
                >
                  <IconDeviceFloppy className="h-4 w-4" />
                  {t.saveDraft}
                </button>
                <button
                  onClick={form.handleSubmit(handleSubmit)}
                  disabled={!form.formState.isValid || !form.watch("title") || !form.watch("goalAmount") || !form.watch("deadline") || !form.watch("image") || isSubmitting}
                  className="staff-btn-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting ? t.creatingCampaign : t.createCampaignBtn}
                </button>
              </div>
            </div>

            {/* Form */}
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            >
              {/* Left Column - Basic Information (takes 2/3 of space) */}
              <div className="lg:col-span-2 space-y-6">
                {/* Basic Information */}
                <div className="bg-white  border border-[var(--staff-border)] p-6">
                  <h3 className="staff-type-section-title staff-text-primary mb-4 flex items-center gap-2">
                    <IconFileText className="h-5 w-5" />
                    {t.basicInformationSection}
                  </h3>

                  <div className="space-y-6">
                    <div>
                      <label className="staff-type-label text-gray-700 mb-2 block">
                        {t.campaignTitleLabel} *
                      </label>
                      <input
                        type="text"
                        {...form.register("title")}
                        placeholder={t.enterCampaignTitle}
                        className="w-full px-3 py-2 border border-gray-300  focus:outline-none staff-field"
                        required
                      />
                      {form.formState.errors.title && (
                        <p className="mt-1 text-sm text-red-600">
                          {form.formState.errors.title.message}
                        </p>
                      )}
                    </div>

                    {/* Moved Deadline here */}
                    <div>
                      <label className="staff-type-label text-gray-700 mb-2 block">
                        {t.deadlineLabel} *
                      </label>
                      <input
                        type="date"
                        {...form.register("deadline")}
                        className="w-full px-3 py-2 border border-gray-300  focus:outline-none staff-field"
                        required
                      />
                      {form.formState.errors.deadline && (
                        <p className="mt-1 text-sm text-red-600">
                          {form.formState.errors.deadline.message}
                        </p>
                      )}
                    </div>

                    {/* Moved Goal here */}
                    <div>
                      <label className="staff-type-label text-gray-700 mb-2 block">
                        {t.goalAmountVND} *
                      </label>
                      <input
                        type="text"
                        inputMode="numeric"
                        {...form.register("goalAmount")}
                        onChange={handleCurrencyInputChange("goalAmount")}
                        className="w-full px-3 py-2 border border-gray-300  focus:outline-none staff-field"
                        required
                      />
                      {form.formState.errors.goalAmount && (
                        <p className="mt-1 text-sm text-red-600">
                          {form.formState.errors.goalAmount.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="staff-type-label text-gray-700 mb-2 block">
                        {t.campaignDescriptionLabel} *
                      </label>
                      <textarea
                        {...form.register("description")}
                        placeholder={t.enterCampaignDescription}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300  focus:outline-none staff-field"
                        required
                      />
                      <div className="flex justify-between items-center mt-1">
                        {form.formState.errors.description && (
                          <p className="text-sm text-red-600">
                            {form.formState.errors.description.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="staff-type-label text-gray-700 mb-2 block">
                        {t.campaignImageLabel} *
                      </label>
                      <div className="space-y-3">
                        {/* Hidden file input */}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              // Clean up previous preview URL
                              if (imagePreviewUrl) {
                                URL.revokeObjectURL(imagePreviewUrl);
                              }
                              // Create new preview URL
                              const previewUrl = URL.createObjectURL(file);
                              setImagePreviewUrl(previewUrl);

                              form.setValue("image", file);
                              form.trigger("image"); // Trigger validation
                            }
                          }}
                          className="hidden"
                          id="campaign-image"
                          required
                        />

                        {/* Custom upload area */}
                        <div className="relative">
                          <label
                            htmlFor="campaign-image"
                            className={`flex flex-col items-center justify-center aspect-video border-2 border-dashed rounded-sm cursor-pointer transition-colors duration-200 group ${
                              imagePreviewUrl
                                ? "border-green-300 bg-green-50"
                                : "border-gray-300 bg-gray-50 hover:bg-gray-100"
                            }`}
                          >
                            {!watchedImage && (
                              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <svg
                                  className="w-8 h-8 mb-4 text-gray-500 group-hover:text-gray-600 transition-colors"
                                  aria-hidden="true"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 20 16"
                                >
                                  <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                                  />
                                </svg>
                                <p className="mb-2 text-sm text-gray-500 group-hover:text-gray-600 transition-colors">
                                  {t.clickToUpload}
                                </p>
                                <p className="text-xs text-gray-500 group-hover:text-gray-600 transition-colors">
                                  {t.imageRequirements}
                                </p>
                              </div>
                            )}
                          </label>

                          {/* Preview overlay */}
                          {imagePreviewUrl && (
                            <div className="absolute inset-0 rounded-sm overflow-hidden">
                              <Image
                                src={imagePreviewUrl}
                                alt="Campaign preview"
                                fill
                                className="object-cover"
                              />
                              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200">
                                <div className="text-center text-white">
                                  <p className="text-sm font-medium mb-1">
                                    {t.clickToChangeImage}
                                  </p>
                                  <p className="text-xs">
                                    {form.watch("image")?.name}
                                  </p>
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  // Clean up preview URL
                                  if (imagePreviewUrl) {
                                    URL.revokeObjectURL(imagePreviewUrl);
                                    setImagePreviewUrl(null);
                                  }
                                  // Clear form value by creating a new FileList without the file
                                  form.setValue("image", undefined);
                                  // Reset the file input
                                  const fileInput = document.getElementById(
                                    "campaign-image"
                                  ) as HTMLInputElement;
                                  if (fileInput) fileInput.value = "";
                                }}
                                className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors shadow-lg"
                              >
                                ×
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Financial & Deadline (takes 1/3 of space) */}
              <div className="space-y-6">
                {/* Sponsorship Tiers only in the right column */}
                <div className="bg-white border border-[var(--staff-border)] p-6">
                  <h3 className="staff-type-section-title staff-text-primary mb-4 flex items-center gap-2">
                    <IconMoneybag className="h-5 w-5" />
Thông tin tài trợ
                  </h3>
                  <div className="space-y-4">
                    {tierDefinitions.map((tier) => {
                      const fieldName = `${tier.name}MinPrice` as
                        | "bronzeMinPrice"
                        | "silverMinPrice"
                        | "goldMinPrice"
                        | "diamondMinPrice";

                      return (
                        <div key={tier.id} className="border border-[var(--staff-border)] p-3 bg-[#fcfbf8]">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-semibold text-gray-800">
                              {tier.display}
                            </span>
                          </div>
                          <p className="text-xs text-gray-600 mb-2">{tier.benefits}</p>
                          <input
                            type="text"
                            inputMode="numeric"
                            {...form.register(fieldName)}
                            onChange={handleCurrencyInputChange(fieldName)}
                            className="w-full px-3 py-2 border border-gray-300 focus:outline-none staff-field"
                          />
                          {form.formState.errors[fieldName] && (
                            <p className="mt-1 text-xs text-red-600">
                              {form.formState.errors[fieldName]?.message as string}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
