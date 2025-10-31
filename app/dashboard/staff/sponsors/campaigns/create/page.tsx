"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { StaffSidebar } from "@/components/staff-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Breadcrumb } from "@/components/breadcrumb";
import {
  IconCalendar,
  IconMoneybag,
  IconFileText,
  IconDeviceFloppy,
} from "@tabler/icons-react";
import { CampaignStatus } from "@/types/dashboard";
import { createStaffCampaign } from "@/apis/staff";
import { toast } from "sonner";

interface CampaignFormData {
  title: string;
  description: string;
  goalAmount: number;
  deadline: string;
  status: CampaignStatus;
}

export default function CreateCampaignPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<CampaignFormData>({
    title: "",
    description: "",
    goalAmount: 0,
    deadline: "",
    status: "DRAFT",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (
    field: keyof CampaignFormData,
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const campaignData = {
        title: formData.title,
        description: formData.description,
        goalAmount: formData.goalAmount,
        deadline: formData.deadline ? `${formData.deadline}T23:59:59.000Z` : "",
        status: formData.status,
      };

      const response = await createStaffCampaign(campaignData);
      console.log("Campaign created successfully:", response);

      toast.success("Campaign created successfully!");
      router.push("/dashboard/staff/sponsors/campaigns");
    } catch (error) {
      console.error("Error creating campaign:", error);
      toast.error("Failed to create campaign. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveDraft = () => {
    console.log("Saving draft:", formData);
    // Here you would typically make an API call to save as draft
  };

  const calculateWordCount = (text: string) => {
    return text
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0).length;
  };

  const calculateReadingTime = (text: string) => {
    const wordsPerMinute = 200;
    const wordCount = calculateWordCount(text);
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return minutes;
  };

  const isFormValid =
    formData.title &&
    formData.description &&
    formData.goalAmount > 0 &&
    formData.deadline;

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
        <SiteHeader title="Create Sponsorship Campaign" />
        <div className="flex flex-1 flex-col">
          <div className="px-4 lg:px-6 py-2 border-b border-[#e6e2da] bg-white">
            <Breadcrumb
              items={[
                { label: "Sponsors", href: "/dashboard/staff/sponsors" },
                {
                  label: "Campaigns",
                  href: "/dashboard/staff/sponsors/campaigns",
                },
                { label: "Create Campaign" },
              ]}
              homeHref="/dashboard/staff"
            />
          </div>
          <div className="flex flex-1 flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold staff-text-primary">
                  Create New Campaign
                </h2>
                <p className="text-sm staff-text-secondary mt-1">
                  Set up a new sponsorship campaign to engage with the ArtChain
                  community
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSaveDraft}
                  className=" border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
                >
                  <IconDeviceFloppy className="h-4 w-4" />
                  Save Draft
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!isFormValid || isSubmitting}
                  className="staff-btn-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting ? "Creating..." : "Create Campaign"}
                </button>
              </div>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="max-w-4xl mx-auto space-y-6"
            >
              {/* Basic Information */}
              <div className="bg-white  border border-[#e6e2da] p-6">
                <h3 className="text-lg font-semibold staff-text-primary mb-4 flex items-center gap-2">
                  <IconFileText className="h-5 w-5" />
                  Basic Information
                </h3>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Campaign Title *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) =>
                        handleInputChange("title", e.target.value)
                      }
                      placeholder="Enter campaign title"
                      className="w-full px-3 py-2 border border-gray-300  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description *
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) =>
                        handleInputChange("description", e.target.value)
                      }
                      placeholder="Describe the campaign goals, objectives, and impact..."
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                    <div className="flex justify-between text-sm staff-text-secondary mt-1">
                      <span>
                        {calculateWordCount(formData.description)} words
                      </span>
                      <span>
                        ~{calculateReadingTime(formData.description)} min read
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Financial & Status Details */}
              <div className="bg-white  border border-[#e6e2da] p-6">
                <h3 className="text-lg font-semibold staff-text-primary mb-4 flex items-center gap-2">
                  <IconMoneybag className="h-5 w-5" />
                  Financial & Status Details
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Goal Amount ($) *
                    </label>
                    <input
                      type="number"
                      value={formData.goalAmount}
                      onChange={(e) =>
                        handleInputChange(
                          "goalAmount",
                          parseInt(e.target.value) || 0
                        )
                      }
                      placeholder="50000"
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) =>
                        handleInputChange(
                          "status",
                          e.target.value as CampaignStatus
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="DRAFT">Draft</option>
                      <option value="ACTIVE">Active</option>
                      <option value="PAUSED">Paused</option>
                      <option value="COMPLETED">Completed</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Deadline */}
              <div className="bg-white  border border-[#e6e2da] p-6">
                <h3 className="text-lg font-semibold staff-text-primary mb-4 flex items-center gap-2">
                  <IconCalendar className="h-5 w-5" />
                  Campaign Deadline
                </h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Deadline *
                  </label>
                  <input
                    type="date"
                    value={formData.deadline}
                    onChange={(e) =>
                      handleInputChange("deadline", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
            </form>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
