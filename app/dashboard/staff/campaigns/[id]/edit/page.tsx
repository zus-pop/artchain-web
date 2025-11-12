"use client";

import { Breadcrumb } from "@/components/breadcrumb";
import { SiteHeader } from "@/components/site-header";
import { StaffSidebar } from "@/components/staff-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import {
  IconArrowLeft,
  IconUpload,
  IconX,
  IconCheck,
} from "@tabler/icons-react";
import { useState, use, useEffect } from "react";
import { updateStaffCampaign } from "@/apis/staff";
import { getCampaign } from "@/apis/campaign";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLanguageStore } from "@/store/language-store";
import { useTranslation } from "@/lib/i18n";
import { toast } from "sonner";
import { CreateCampaignRequest } from "@/types/staff/campaign";

export default function EditCampaignPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    goalAmount: "",
    deadline: "",
    status: "DRAFT" as "DRAFT" | "ACTIVE" | "PAUSED" | "COMPLETED",
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { currentLanguage } = useLanguageStore();
  const t = useTranslation(currentLanguage);

  const queryClient = useQueryClient();

  // Fetch campaign data
  const { data: campaignResponse, isLoading } = useQuery({
    queryKey: ["campaign", id],
    queryFn: () => getCampaign(id),
    enabled: !!id,
  });

  const campaignData = campaignResponse?.data;

  // Initialize form data when campaign loads
  useEffect(() => {
    if (campaignData) {
      setFormData({
        title: campaignData.title,
        description: campaignData.description,
        goalAmount: campaignData.goalAmount,
        deadline: campaignData.deadline.split("T")[0], // Format for date input
        status: campaignData.status as any,
      });
      setImagePreview(campaignData.image);
    }
  }, [campaignData]);

  // Update campaign mutation
  const updateMutation = useMutation({
    mutationFn: (data: Partial<CreateCampaignRequest>) =>
      updateStaffCampaign(id, data),
    onSuccess: () => {
      toast.success(t.campaignUpdatedSuccessMessage);
      queryClient.invalidateQueries({ queryKey: ["campaign", id] });
      router.push(`/dashboard/staff/campaigns/${id}`);
    },
    onError: (error: any) => {
      toast.error(error.message || t.failedUpdateCampaignMessage);
      setIsSubmitting(false);
    },
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        toast.error(t.fileSizeTooLarge);
        return;
      }
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error(t.selectValidImage);
        return;
      }
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error(t.titleRequired);
      return;
    }

    if (!formData.description.trim()) {
      toast.error(t.descriptionRequired);
      return;
    }

    if (!formData.goalAmount || parseFloat(formData.goalAmount) <= 0) {
      toast.error(t.goalAmountMin);
      return;
    }

    if (!formData.deadline) {
      toast.error(t.deadlineRequired);
      return;
    }

    const deadlineDate = new Date(formData.deadline);
    if (deadlineDate <= new Date()) {
      toast.error(t.deadlineMustBeFutureEdit);
      return;
    }

    setIsSubmitting(true);

    const submitData = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      goalAmount: parseFloat(formData.goalAmount),
      deadline: formData.deadline,
      status: formData.status,
      ...(selectedImage && { image: selectedImage }),
    };

    updateMutation.mutate(submitData);
  };

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
          <SiteHeader title="Edit Campaign" />
          <div className="flex flex-1 flex-col">
            <div className="flex flex-1 items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  if (!campaignData) {
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
          <SiteHeader title="Edit Campaign" />
          <div className="flex flex-1 flex-col">
            <div className="flex flex-1 items-center justify-center">
              <p className="text-gray-500">Campaign not found</p>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

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
        <SiteHeader title={t.editCampaignTitle} />
        <div className="flex flex-1 flex-col">
          <div className="px-4 lg:px-6 py-2 border-b border-[#e6e2da] bg-white">
            <Breadcrumb
              items={[
                {
                  label: t.campaignsManagement,
                  href: "/dashboard/staff/campaigns",
                },
                {
                  label: campaignData.title,
                  href: `/dashboard/staff/campaigns/${id}`,
                },
                { label: t.editCampaignTitle },
              ]}
              homeHref="/dashboard/staff"
            />
          </div>
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Link
                    href={`/dashboard/staff/campaigns/${id}`}
                    className="border border-[#e6e2da] p-2 hover:bg-gray-50 transition-colors"
                  >
                    <IconArrowLeft className="h-5 w-5" />
                  </Link>
                  <div>
                    <h2 className="text-2xl font-bold staff-text-primary">
                      {t.editCampaignTitle}
                    </h2>
                    <p className="text-sm staff-text-secondary mt-1">
                      {t.updateCampaignDetails}
                    </p>
                  </div>
                </div>
              </div>

              {/* Edit Form */}
              <div className="max-w-4xl mx-auto">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Basic Information */}
                  <div className="staff-card p-6">
                    <h3 className="text-lg font-semibold staff-text-primary mb-4">
                      {t.basicInformationSection}
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium staff-text-primary mb-2">
                          {t.campaignTitleRequiredEdit}
                        </label>
                        <input
                          type="text"
                          value={formData.title}
                          onChange={(e) =>
                            handleInputChange("title", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-[#e6e2da] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d9534f]"
                          placeholder={t.enterCampaignTitle}
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium staff-text-primary mb-2">
                          {t.descriptionRequiredEdit}
                        </label>
                        <textarea
                          value={formData.description}
                          onChange={(e) =>
                            handleInputChange("description", e.target.value)
                          }
                          rows={4}
                          className="w-full px-3 py-2 border border-[#e6e2da] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d9534f]"
                          placeholder={t.describeCampaignEdit}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Financial & Status */}
                  <div className="staff-card p-6">
                    <h3 className="text-lg font-semibold staff-text-primary mb-4">
                      {t.financialStatusDetails}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium staff-text-primary mb-2">
                          {t.goalAmountRequiredEdit}
                        </label>
                        <input
                          type="number"
                          value={formData.goalAmount}
                          onChange={(e) =>
                            handleInputChange("goalAmount", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-[#e6e2da] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d9534f]"
                          placeholder={t.goalAmountPlaceholderEdit}
                          min="1"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium staff-text-primary mb-2">
                          {t.deadlineRequiredEdit}
                        </label>
                        <input
                          type="date"
                          value={formData.deadline}
                          onChange={(e) =>
                            handleInputChange("deadline", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-[#e6e2da] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d9534f]"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium staff-text-primary mb-2">
                          {t.statusRequiredEdit}
                        </label>
                        <select
                          value={formData.status}
                          onChange={(e) =>
                            handleInputChange("status", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-[#e6e2da] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d9534f]"
                        >
                          <option value="DRAFT">Draft</option>
                          <option value="ACTIVE">Active</option>
                          <option value="PAUSED">Paused</option>
                          <option value="COMPLETED">Completed</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Campaign Image */}
                  <div className="staff-card p-6">
                    <h3 className="text-lg font-semibold staff-text-primary mb-4">
                      {t.campaignImageLabel}
                    </h3>
                    <div className="space-y-4">
                      <div
                        className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#d9534f] transition-colors cursor-pointer"
                        onClick={() =>
                          document.getElementById("image-upload")?.click()
                        }
                      >
                        {imagePreview ? (
                          <div className="space-y-4">
                            <div className="relative w-full h-48 mx-auto">
                              <img
                                src={imagePreview}
                                alt="Campaign preview"
                                className="w-full h-full object-cover rounded-lg border border-gray-200"
                              />
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedImage(null);
                                  setImagePreview(campaignData.image);
                                }}
                                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                              >
                                <IconX className="h-4 w-4" />
                              </button>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {selectedImage
                                  ? selectedImage.name
                                  : t.currentImageEdit}
                              </p>
                              <p className="text-xs text-gray-500">
                                {t.clickToChangeImage}
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                              <IconUpload className="h-6 w-6 text-gray-400" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {t.clickToUploadImageEdit}
                              </p>
                              <p className="text-xs text-gray-500">
                                {t.imageRequirements}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      <input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />

                      <p className="text-xs staff-text-secondary">
                        {t.uploadCampaignImageOptionalEdit}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end gap-4 pt-6 border-t border-[#e6e2da]">
                    <Link
                      href={`/dashboard/staff/campaigns/${id}`}
                      className="px-6 py-2 border border-[#e6e2da] staff-text-primary hover:bg-gray-50 transition-colors"
                    >
                      {t.cancel}
                    </Link>
                    <button
                      type="submit"
                      disabled={isSubmitting || updateMutation.isPending}
                      className="px-6 py-2 staff-btn-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {isSubmitting || updateMutation.isPending ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          {t.updatingCampaign}
                        </>
                      ) : (
                        <>
                          <IconCheck className="h-4 w-4" />
                          {t.updateCampaignBtn}
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
