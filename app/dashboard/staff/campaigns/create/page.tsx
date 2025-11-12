"use client";
import { createStaffCampaign } from "@/apis/staff";
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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { CreateCampaignRequest } from "@/types/staff/campaign";
import { Lang, useTranslation } from "@/lib/i18n";
import { useLanguageStore } from "@/store/language-store";
import Link from "next/link";

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
    goalAmount: z.number().min(1000, t.goalAmountMin),
    deadline: z.string().min(1, t.deadlineRequired),
    status: z.enum(["DRAFT", "ACTIVE", "PAUSED", "COMPLETED"]),
    image: z
      .any()
      .refine((file) => file instanceof File && file.size > 0, t.imageRequired),
  });

type CampaignFormData = z.infer<ReturnType<typeof getCampaignSchema>>;

export default function CreateCampaignPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const { currentLanguage } = useLanguageStore();
  const t = useTranslation(currentLanguage);

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
      goalAmount: 0,
      deadline: "",
      status: "DRAFT",
    },
    mode: "all",
  });

  const watchedImage = form.watch("image");

  const mutation = useMutation({
    mutationFn: async (data: CreateCampaignRequest) => {
      return createStaffCampaign(data);
    },
    onSuccess: () => {
      toast.success(t.campaignCreatedSuccessMessage);
      queryClient.invalidateQueries({ queryKey: ["staff-campaigns"] });
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
    await mutation.mutateAsync(data);
    setIsSubmitting(false);
  };

  const handleSaveDraft = () => {
    console.log("Saving draft:", form.getValues());
    // Here you would typically make an API call to save as draft
  };

  const formatVNDAmount = (amount: number) => {
    return new Intl.NumberFormat("vi-VN").format(amount);
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
          <div className="px-4 lg:px-6 py-2 border-b border-[#e6e2da] bg-white">
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
                  className="border-2 border-[#e6e2da] p-2 hover:bg-[#f9f7f4] transition-colors"
                >
                  <IconArrowLeft className="h-5 w-5 staff-text-secondary" />
                </Link>

                <div>
                  <h2 className="text-2xl font-bold staff-text-primary">
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
                  disabled={!form.formState.isValid || isSubmitting}
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
                <div className="bg-white  border border-[#e6e2da] p-6">
                  <h3 className="text-lg font-semibold staff-text-primary mb-4 flex items-center gap-2">
                    <IconFileText className="h-5 w-5" />
                    {t.basicInformationSection}
                  </h3>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t.campaignTitleLabel} *
                      </label>
                      <input
                        type="text"
                        {...form.register("title")}
                        placeholder={t.enterCampaignTitle}
                        className="w-full px-3 py-2 border border-gray-300  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                      {form.formState.errors.title && (
                        <p className="mt-1 text-sm text-red-600">
                          {form.formState.errors.title.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t.campaignDescriptionLabel} *
                      </label>
                      <textarea
                        {...form.register("description")}
                        placeholder={t.enterCampaignDescription}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                      <label className="block text-sm font-medium text-gray-700 mb-2">
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
                            className={`flex flex-col items-center justify-center aspect-video border-2 border-dashed rounded-lg cursor-pointer transition-colors duration-200 group ${
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
                            <div className="absolute inset-0 rounded-lg overflow-hidden">
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
                {/* Financial & Status Details */}
                <div className="bg-white  border border-[#e6e2da] p-6">
                  <h3 className="text-lg font-semibold staff-text-primary mb-4 flex items-center gap-2">
                    <IconMoneybag className="h-5 w-5" />
                    {t.financialStatusDetails}
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t.goalAmountVND} *
                      </label>
                      <input
                        type="number"
                        {...form.register("goalAmount", {
                          valueAsNumber: true,
                        })}
                        step={100_000}
                        className="w-full px-3 py-2 border border-gray-300  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                      {form.watch("goalAmount") > 0 && (
                        <p className="mt-1 text-sm text-gray-600">
                          {t.formattedAmount.replace(
                            "{amount}",
                            formatVNDAmount(form.watch("goalAmount"))
                          )}
                        </p>
                      )}
                      {form.formState.errors.goalAmount && (
                        <p className="mt-1 text-sm text-red-600">
                          {form.formState.errors.goalAmount.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t.campaignStatus}
                      </label>
                      <select
                        {...form.register("status")}
                        className="w-full px-3 py-2 border border-gray-300  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="DRAFT">{t.draftOption}</option>
                        <option value="ACTIVE">{t.activeOption}</option>
                        <option value="PAUSED">{t.pausedOption}</option>
                        <option value="COMPLETED">{t.completedOption}</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Deadline */}
                <div className="bg-white  border border-[#e6e2da] p-6">
                  <h3 className="text-lg font-semibold staff-text-primary mb-4 flex items-center gap-2">
                    <IconCalendar className="h-5 w-5" />
                    {t.campaignDeadline}
                  </h3>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t.deadlineLabel} *
                    </label>
                    <input
                      type="date"
                      {...form.register("deadline")}
                      className="w-full px-3 py-2 border border-gray-300  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                    {form.formState.errors.deadline && (
                      <p className="mt-1 text-sm text-red-600">
                        {form.formState.errors.deadline.message}
                      </p>
                    )}
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
