"use client";

import { useState } from "react";
import { StaffSidebar } from "@/components/staff-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Breadcrumb } from "@/components/breadcrumb";
import {
  IconTrendingUp,
  IconArrowLeft,
  IconCalendar,
  IconMoneybag,
  IconTarget,
  IconUsers,
  IconFileText,
  IconBuilding,
  IconDeviceFloppy,
  IconEye,
} from "@tabler/icons-react";
import { CampaignFormData, CampaignStatus } from "@/types/dashboard";

export default function CreateCampaignPage() {
  const [formData, setFormData] = useState<CampaignFormData>({
    title: "",
    description: "",
    sponsorId: "",
    goalAmount: 0,
    startDate: "",
    endDate: "",
    category: "",
    status: "DRAFT",
    targetParticipants: 0,
    requirements: "",
    benefits: "",
  });

  const [previewMode, setPreviewMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    "Community Support",
    "Education",
    "Innovation",
    "Events",
    "Cultural Preservation",
    "Technology",
    "Arts & Culture",
    "Youth Programs",
  ];

  const sponsors = [
    { id: "1", name: "John Smith", company: "Art Supplies Co." },
    { id: "2", name: "Sarah Johnson", company: "Creative Arts Foundation" },
    { id: "3", name: "Mike Chen", company: "TechArt Solutions" },
    { id: "4", name: "Emma Davis", company: "Youth Art Initiative" },
    { id: "5", name: "Robert Wilson", company: "Art Education Corp" },
  ];

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

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    console.log("Creating campaign:", formData);
    // Here you would typically make an API call to create the campaign

    setIsSubmitting(false);
    // Redirect to campaigns page or show success message
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
    formData.sponsorId &&
    formData.goalAmount > 0 &&
    formData.startDate &&
    formData.endDate &&
    formData.category;

  if (previewMode) {
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
              {/* Preview Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setPreviewMode(false)}
                    className="flex items-center gap-2 staff-text-secondary hover:staff-text-primary transition-colors"
                  >
                    <IconArrowLeft className="h-5 w-5" />
                    Back to Edit
                  </button>
                  <h2 className="text-2xl font-bold staff-text-primary">
                    Campaign Preview
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSaveDraft}
                    className=" border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
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

              {/* Preview Content */}
              <div className="max-w-4xl mx-auto">
                <div className="bg-white  border border-[#e6e2da] p-8">
                  <div className="mb-8">
                    <h1 className="text-3xl font-bold staff-text-primary mb-4">
                      {formData.title || "Campaign Title"}
                    </h1>
                    <div className="flex items-center gap-4 text-sm staff-text-secondary mb-4">
                      <span className="flex items-center gap-1">
                        <IconBuilding className="h-4 w-4" />
                        {sponsors.find((s) => s.id === formData.sponsorId)
                          ?.company || "Sponsor Company"}
                      </span>
                      <span className="flex items-center gap-1">
                        <IconTarget className="h-4 w-4" />
                        {formData.category || "Category"}
                      </span>
                      <span className="flex items-center gap-1">
                        <IconCalendar className="h-4 w-4" />
                        {formData.startDate} - {formData.endDate}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-blue-50  p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <IconMoneybag className="h-5 w-5 " />
                        <span className="text-sm font-medium text-blue-600">
                          Goal Amount
                        </span>
                      </div>
                      <p className="text-2xl font-bold staff-text-primary">
                        ${formData.goalAmount.toLocaleString()}
                      </p>
                    </div>

                    <div className="bg-green-50  p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <IconUsers className="h-5 w-5 " />
                        <span className="text-sm font-medium text-green-600">
                          Target Participants
                        </span>
                      </div>
                      <p className="text-2xl font-bold staff-text-primary">
                        {formData.targetParticipants}
                      </p>
                    </div>

                    <div className="bg-purple-50  p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <IconTrendingUp className="h-5 w-5 " />
                        <span className="text-sm font-medium text-purple-600">
                          Status
                        </span>
                      </div>
                      <p className="text-lg font-semibold staff-text-primary">
                        {formData.status}
                      </p>
                    </div>
                  </div>

                  <div className="prose max-w-none mb-8">
                    <h3 className="text-xl font-semibold staff-text-primary mb-3">
                      Description
                    </h3>
                    <p className="text-gray-700 whitespace-pre-wrap">
                      {formData.description || "No description provided."}
                    </p>
                  </div>

                  {(formData.requirements || formData.benefits) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {formData.requirements && (
                        <div>
                          <h3 className="text-lg font-semibold staff-text-primary mb-3">
                            Requirements
                          </h3>
                          <p className="text-gray-700 whitespace-pre-wrap">
                            {formData.requirements}
                          </p>
                        </div>
                      )}

                      {formData.benefits && (
                        <div>
                          <h3 className="text-lg font-semibold staff-text-primary mb-3">
                            Benefits
                          </h3>
                          <p className="text-gray-700 whitespace-pre-wrap">
                            {formData.benefits}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
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
                  onClick={() => setPreviewMode(true)}
                  className=" border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
                >
                  <IconEye className="h-4 w-4" />
                  Preview
                </button>
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                      Category *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) =>
                        handleInputChange("category", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select a category</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mt-6">
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

              {/* Sponsor & Financial Details */}
              <div className="bg-white  border border-[#e6e2da] p-6">
                <h3 className="text-lg font-semibold staff-text-primary mb-4 flex items-center gap-2">
                  <IconBuilding className="h-5 w-5" />
                  Sponsor & Financial Details
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sponsor *
                    </label>
                    <select
                      value={formData.sponsorId}
                      onChange={(e) =>
                        handleInputChange("sponsorId", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select a sponsor</option>
                      {sponsors.map((sponsor) => (
                        <option key={sponsor.id} value={sponsor.id}>
                          {sponsor.name} - {sponsor.company}
                        </option>
                      ))}
                    </select>
                  </div>

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
                      Target Participants
                    </label>
                    <input
                      type="number"
                      value={formData.targetParticipants}
                      onChange={(e) =>
                        handleInputChange(
                          "targetParticipants",
                          parseInt(e.target.value) || 0
                        )
                      }
                      placeholder="50"
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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

              {/* Dates */}
              <div className="bg-white  border border-[#e6e2da] p-6">
                <h3 className="text-lg font-semibold staff-text-primary mb-4 flex items-center gap-2">
                  <IconCalendar className="h-5 w-5" />
                  Campaign Dates
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Date *
                    </label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) =>
                        handleInputChange("startDate", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Date *
                    </label>
                    <input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) =>
                        handleInputChange("endDate", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Additional Details */}
              <div className="bg-white  border border-[#e6e2da] p-6">
                <h3 className="text-lg font-semibold staff-text-primary mb-4 flex items-center gap-2">
                  <IconTarget className="h-5 w-5" />
                  Additional Details
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Requirements
                    </label>
                    <textarea
                      value={formData.requirements}
                      onChange={(e) =>
                        handleInputChange("requirements", e.target.value)
                      }
                      placeholder="List any specific requirements for participants..."
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Benefits
                    </label>
                    <textarea
                      value={formData.benefits}
                      onChange={(e) =>
                        handleInputChange("benefits", e.target.value)
                      }
                      placeholder="Describe the benefits for participants and sponsors..."
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
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
