"use client";

import { Breadcrumb } from "@/components/breadcrumb";
import { SiteHeader } from "@/components/site-header";
import { StaffSidebar } from "@/components/staff-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import {
  IconArrowLeft,
  IconCalendar,
  IconCurrencyDollar,
  IconDeviceFloppy,
  IconFileText,
  IconTag,
  IconTrophy,
} from "@tabler/icons-react";
import Link from "next/link";
import { useState } from "react";

type ContestCategory =
  | "Mixed Media"
  | "Digital Art"
  | "Traditional"
  | "Sculpture"
  | "Photography"
  | "Other";

export default function CreateContestPage() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Mixed Media" as ContestCategory,
    startDate: "",
    endDate: "",
    maxParticipants: "",
    prizePool: "",
    rules: "",
    requirements: "",
    judgingCriteria: "",
  });

  const categories: ContestCategory[] = [
    "Mixed Media",
    "Digital Art",
    "Traditional",
    "Sculpture",
    "Photography",
    "Other",
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Creating contest:", formData);
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
          <div className="px-4 lg:px-6 py-2 border-b border-gray-200 bg-white">
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
              {/* Page Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Link
                    href="/dashboard/staff/contests"
                    className="rounded-lg border border-gray-200 p-2 hover:bg-gray-50 transition-colors"
                  >
                    <IconArrowLeft className="h-5 w-5 text-gray-600" />
                  </Link>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Create New Contest
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                      Set up a new art competition for young artists
                    </p>
                  </div>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Basic Information */}
                  <div className="space-y-6">
                    <div className="rounded-lg border border-gray-200 bg-white p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <IconFileText className="h-5 w-5 text-blue-600" />
                        Basic Information
                      </h3>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Contest Title *
                          </label>
                          <input
                            type="text"
                            value={formData.title}
                            onChange={(e) =>
                              handleInputChange("title", e.target.value)
                            }
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter contest title"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Category *
                          </label>
                          <select
                            value={formData.category}
                            onChange={(e) =>
                              handleInputChange("category", e.target.value)
                            }
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                          >
                            {categories.map((category) => (
                              <option key={category} value={category}>
                                {category}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description *
                          </label>
                          <textarea
                            value={formData.description}
                            onChange={(e) =>
                              handleInputChange("description", e.target.value)
                            }
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Describe the contest theme and objectives"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    {/* Dates and Participants */}
                    <div className="rounded-lg border border-gray-200 bg-white p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <IconCalendar className="h-5 w-5 text-green-600" />
                        Schedule & Capacity
                      </h3>

                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Start Date *
                            </label>
                            <input
                              type="date"
                              value={formData.startDate}
                              onChange={(e) =>
                                handleInputChange("startDate", e.target.value)
                              }
                              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              End Date *
                            </label>
                            <input
                              type="date"
                              value={formData.endDate}
                              onChange={(e) =>
                                handleInputChange("endDate", e.target.value)
                              }
                              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Maximum Participants *
                          </label>
                          <input
                            type="number"
                            value={formData.maxParticipants}
                            onChange={(e) =>
                              handleInputChange(
                                "maxParticipants",
                                e.target.value
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="100"
                            min="1"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Prizes and Rules */}
                  <div className="space-y-6">
                    {/* Prizes */}
                    <div className="rounded-lg border border-gray-200 bg-white p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <IconTrophy className="h-5 w-5 text-yellow-600" />
                        Prizes & Awards
                      </h3>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Total Prize Pool
                          </label>
                          <div className="relative">
                            <IconCurrencyDollar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                              type="text"
                              value={formData.prizePool}
                              onChange={(e) =>
                                handleInputChange("prizePool", e.target.value)
                              }
                              className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="2500"
                            />
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            Leave empty if no prizes
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Rules and Requirements */}
                    <div className="rounded-lg border border-gray-200 bg-white p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <IconTag className="h-5 w-5 text-purple-600" />
                        Rules & Requirements
                      </h3>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Contest Rules
                          </label>
                          <textarea
                            value={formData.rules}
                            onChange={(e) =>
                              handleInputChange("rules", e.target.value)
                            }
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter contest rules and guidelines"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Submission Requirements
                          </label>
                          <textarea
                            value={formData.requirements}
                            onChange={(e) =>
                              handleInputChange("requirements", e.target.value)
                            }
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="File format, size limits, age restrictions, etc."
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Judging Criteria
                          </label>
                          <textarea
                            value={formData.judgingCriteria}
                            onChange={(e) =>
                              handleInputChange(
                                "judgingCriteria",
                                e.target.value
                              )
                            }
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Creativity, technique, originality, presentation, etc."
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
                  <Link
                    href="/dashboard/staff/contests"
                    className="px-6 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </Link>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                  >
                    <IconDeviceFloppy className="h-4 w-4" />
                    Create Contest
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
