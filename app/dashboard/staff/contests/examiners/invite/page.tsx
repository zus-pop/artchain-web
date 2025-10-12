"use client";

import { useState } from "react";
import Link from "next/link";
import { StaffSidebar } from "@/components/staff-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Breadcrumb } from "@/components/breadcrumb";
import {
  IconUsers,
  IconMail,
  IconBriefcase,
  IconStar,
  IconSend,
  IconArrowLeft,
  IconCheck,
  IconX,
} from "@tabler/icons-react";

type Specialization =
  | "Mixed Media"
  | "Digital Art"
  | "Traditional Painting"
  | "Photography"
  | "Sculpture"
  | "Contemporary Art"
  | "Graphic Design"
  | "3D Art"
  | "Children's Art";

interface InviteForm {
  email: string;
  fullName: string;
  specialization: Specialization[];
  experience: string;
  message: string;
}

export default function InviteExaminerPage() {
  const [formData, setFormData] = useState<InviteForm>({
    email: "",
    fullName: "",
    specialization: [],
    experience: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [inviteSent, setInviteSent] = useState(false);

  const specializations: Specialization[] = [
    "Mixed Media",
    "Digital Art",
    "Traditional Painting",
    "Photography",
    "Sculpture",
    "Contemporary Art",
    "Graphic Design",
    "3D Art",
    "Children's Art",
  ];

  const experienceLevels = [
    "1-3 years",
    "3-5 years",
    "5-10 years",
    "10-15 years",
    "15+ years",
  ];

  const handleInputChange = (
    field: keyof InviteForm,
    value: string | Specialization[]
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const toggleSpecialization = (spec: Specialization) => {
    setFormData((prev) => ({
      ...prev,
      specialization: prev.specialization.includes(spec)
        ? prev.specialization.filter((s) => s !== spec)
        : [...prev.specialization, spec],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsSubmitting(false);
    setInviteSent(true);
  };

  const resetForm = () => {
    setFormData({
      email: "",
      fullName: "",
      specialization: [],
      experience: "",
      message: "",
    });
    setInviteSent(false);
  };

  if (inviteSent) {
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
          <SiteHeader title="Invite Examiner" />
          <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
              <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
                {/* Success Message */}
                <div className="max-w-2xl mx-auto">
                  <div className="rounded-lg border border-green-200 bg-green-50 p-8 text-center">
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                      <IconCheck className="h-6 w-6 text-green-600" />
                    </div>
                    <h3 className="text-lg font-medium text-green-900 mb-2">
                      Invitation Sent Successfully!
                    </h3>
                    <p className="text-green-700 mb-6">
                      An invitation has been sent to{" "}
                      <strong>{formData.email}</strong> to join as an examiner.
                      They will receive an email with instructions to complete
                      their registration.
                    </p>
                    <div className="flex gap-4 justify-center">
                      <Link
                        href="/dashboard/staff/contests/examiners"
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                      >
                        View All Examiners
                      </Link>
                      <button
                        onClick={resetForm}
                        className="border border-green-300 text-green-700 px-4 py-2 rounded-lg hover:bg-green-50 transition-colors"
                      >
                        Send Another Invite
                      </button>
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
        <SiteHeader title="Invite Examiner" />
        <div className="flex flex-1 flex-col">
          <div className="px-4 lg:px-6 py-2 border-b border-gray-200 bg-white">
            <Breadcrumb
              items={[
                {
                  label: "Contest Management",
                  href: "/dashboard/staff/contests",
                },
                {
                  label: "Examiners",
                  href: "/dashboard/staff/contests/examiners",
                },
                { label: "Invite Examiner" },
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
                    href="/dashboard/staff/contests/examiners"
                    className="rounded-lg border border-gray-200 p-2 hover:bg-gray-50 transition-colors"
                  >
                    <IconArrowLeft className="h-5 w-5 text-gray-600" />
                  </Link>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Invite New Examiner
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                      Send an invitation to a qualified art professional to join
                      as a contest judge
                    </p>
                  </div>
                </div>
              </div>

              {/* Form */}
              <div className="max-w-2xl mx-auto">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Basic Information */}
                  <div className="rounded-lg border border-gray-200 bg-white p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <IconUsers className="h-5 w-5 text-blue-600" />
                      Basic Information
                    </h3>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          value={formData.fullName}
                          onChange={(e) =>
                            handleInputChange("fullName", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter full name"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email Address *
                        </label>
                        <div className="relative">
                          <IconMail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <input
                            type="email"
                            value={formData.email}
                            onChange={(e) =>
                              handleInputChange("email", e.target.value)
                            }
                            className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="examiner@example.com"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Professional Information */}
                  <div className="rounded-lg border border-gray-200 bg-white p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <IconBriefcase className="h-5 w-5 text-green-600" />
                      Professional Information
                    </h3>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Areas of Specialization *
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {specializations.map((spec) => (
                            <button
                              key={spec}
                              type="button"
                              onClick={() => toggleSpecialization(spec)}
                              className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                                formData.specialization.includes(spec)
                                  ? "bg-blue-100 border-blue-300 text-blue-800"
                                  : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
                              }`}
                            >
                              {spec}
                            </button>
                          ))}
                        </div>
                        {formData.specialization.length === 0 && (
                          <p className="text-xs text-red-600 mt-1">
                            Please select at least one specialization
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Years of Experience *
                        </label>
                        <select
                          value={formData.experience}
                          onChange={(e) =>
                            handleInputChange("experience", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        >
                          <option value="">Select experience level</option>
                          {experienceLevels.map((level) => (
                            <option key={level} value={level}>
                              {level}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Personal Message */}
                  <div className="rounded-lg border border-gray-200 bg-white p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <IconMail className="h-5 w-5 text-purple-600" />
                      Personal Message
                    </h3>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Invitation Message
                      </label>
                      <textarea
                        value={formData.message}
                        onChange={(e) =>
                          handleInputChange("message", e.target.value)
                        }
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Add a personal message to accompany the invitation..."
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        This message will be included in the invitation email
                      </p>
                    </div>
                  </div>

                  {/* Form Actions */}
                  <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
                    <Link
                      href="/dashboard/staff/contests/examiners"
                      className="px-6 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </Link>
                    <button
                      type="submit"
                      disabled={
                        isSubmitting || formData.specialization.length === 0
                      }
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Sending...
                        </>
                      ) : (
                        <>
                          <IconSend className="h-4 w-4" />
                          Send Invitation
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
