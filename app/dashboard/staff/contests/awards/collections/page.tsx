"use client";

import { Breadcrumb } from "@/components/breadcrumb";
import { SiteHeader } from "@/components/site-header";
import { StaffSidebar } from "@/components/staff-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import {
  IconAward,
  IconEdit,
  IconEye,
  IconMedal,
  IconPalette,
  IconPlus,
  IconStar,
  IconTag,
  IconTrash,
  IconTrophy,
} from "@tabler/icons-react";
import { useState } from "react";

type AwardTemplateType =
  | "GOLD"
  | "SILVER"
  | "BRONZE"
  | "HONORABLE_MENTION"
  | "SPECIAL"
  | "PARTICIPATION";

interface AwardTemplate {
  id: string;
  name: string;
  type: AwardTemplateType;
  description: string;
  prizeAmount: string;
  certificateDesign: string;
  badgeDesign: string;
  createdDate: string;
  lastUsed: string;
  usageCount: number;
  isActive: boolean;
}

export default function AwardCollectionsPage() {
  const [templates] = useState<AwardTemplate[]>([
    {
      id: "1",
      name: "Gold Medal Excellence",
      type: "GOLD",
      description: "First place award with gold medal design and certificate",
      prizeAmount: "$500",
      certificateDesign: "Classic Gold Frame",
      badgeDesign: "Gold Star Burst",
      createdDate: "2024-01-15",
      lastUsed: "2025-10-15",
      usageCount: 12,
      isActive: true,
    },
    {
      id: "2",
      name: "Silver Achievement",
      type: "SILVER",
      description: "Second place award with silver medal design",
      prizeAmount: "$300",
      certificateDesign: "Silver Elegance",
      badgeDesign: "Silver Crescent",
      createdDate: "2024-01-15",
      lastUsed: "2025-10-15",
      usageCount: 10,
      isActive: true,
    },
    {
      id: "3",
      name: "Bronze Honor",
      type: "BRONZE",
      description: "Third place award with bronze medal design",
      prizeAmount: "$200",
      certificateDesign: "Bronze Heritage",
      badgeDesign: "Bronze Shield",
      createdDate: "2024-01-15",
      lastUsed: "2025-10-15",
      usageCount: 8,
      isActive: true,
    },
    {
      id: "4",
      name: "Honorable Mention",
      type: "HONORABLE_MENTION",
      description: "Recognition award for outstanding effort",
      prizeAmount: "$50",
      certificateDesign: "Blue Recognition",
      badgeDesign: "Blue Ribbon",
      createdDate: "2024-02-01",
      lastUsed: "2025-09-20",
      usageCount: 15,
      isActive: true,
    },
    {
      id: "5",
      name: "Special Recognition",
      type: "SPECIAL",
      description: "Special category award for unique achievements",
      prizeAmount: "$250",
      certificateDesign: "Purple Excellence",
      badgeDesign: "Purple Gem",
      createdDate: "2024-03-10",
      lastUsed: "2025-09-25",
      usageCount: 3,
      isActive: true,
    },
    {
      id: "6",
      name: "Participation Certificate",
      type: "PARTICIPATION",
      description: "Certificate for all participants",
      prizeAmount: "$0",
      certificateDesign: "Green Participation",
      badgeDesign: "Green Leaf",
      createdDate: "2024-01-01",
      lastUsed: "2025-10-01",
      usageCount: 45,
      isActive: true,
    },
  ]);

  const [selectedType, setSelectedType] = useState<AwardTemplateType | "ALL">(
    "ALL"
  );

  const typeOptions = [
    "ALL",
    "GOLD",
    "SILVER",
    "BRONZE",
    "HONORABLE_MENTION",
    "SPECIAL",
    "PARTICIPATION",
  ];

  const filteredTemplates = templates.filter(
    (template) => selectedType === "ALL" || template.type === selectedType
  );

  const getTypeBadgeColor = (type: AwardTemplateType) => {
    const colors = {
      GOLD: "bg-yellow-100 text-yellow-800 border-yellow-300",
      SILVER: "bg-gray-100 text-gray-800 border-gray-300",
      BRONZE: "bg-orange-100 text-orange-800 border-orange-300",
      HONORABLE_MENTION: "bg-blue-100 text-blue-800 border-blue-300",
      SPECIAL: "bg-purple-100 text-purple-800 border-purple-300",
      PARTICIPATION: "bg-green-100 text-green-800 border-green-300",
    };
    return colors[type];
  };

  const getTypeIcon = (type: AwardTemplateType) => {
    const icons = {
      GOLD: IconTrophy,
      SILVER: IconMedal,
      BRONZE: IconAward,
      HONORABLE_MENTION: IconStar,
      SPECIAL: IconStar,
      PARTICIPATION: IconTag,
    };
    return icons[type];
  };

  const activeTemplates = templates.filter((t) => t.isActive).length;
  const totalUsage = templates.reduce((sum, t) => sum + t.usageCount, 0);

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
        <SiteHeader title="Award Collections" />
        <div className="flex flex-1 flex-col">
          <div className="px-4 lg:px-6 py-2 border-b border-gray-200 bg-white">
            <Breadcrumb
              items={[
                {
                  label: "Contest Management",
                  href: "/dashboard/staff/contests",
                },
                { label: "Awards", href: "/dashboard/staff/contests/awards" },
                { label: "Collections" },
              ]}
              homeHref="/dashboard/staff"
            />
          </div>
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
              {/* Page Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Award Templates ({filteredTemplates.length})
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Manage award designs, certificates, and prize structures
                  </p>
                </div>
                <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors flex items-center gap-2">
                  <IconPlus className="h-4 w-4" />
                  Create Template
                </button>
              </div>

              {/* Statistics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="rounded-lg border border-gray-200 bg-white p-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-blue-100 p-2">
                      <IconAward className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Active Templates
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {activeTemplates}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border border-gray-200 bg-white p-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-green-100 p-2">
                      <IconTrophy className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Total Awards Given
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {totalUsage}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border border-gray-200 bg-white p-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-purple-100 p-2">
                      <IconPalette className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Design Variations
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {templates.length}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Filter */}
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-700">
                  Filter by type:
                </span>
                <div className="flex gap-2">
                  {typeOptions.map((type) => (
                    <button
                      key={type}
                      onClick={() =>
                        setSelectedType(type as AwardTemplateType | "ALL")
                      }
                      className={`px-3 py-1 text-sm rounded-lg border transition-colors ${
                        selectedType === type
                          ? "bg-blue-100 border-blue-300 text-blue-800"
                          : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {type.replace("_", " ")}
                    </button>
                  ))}
                </div>
              </div>

              {/* Templates Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTemplates.map((template) => {
                  const TypeIcon = getTypeIcon(template.type);
                  return (
                    <div
                      key={template.id}
                      className="rounded-lg border border-gray-200 bg-white p-6 hover:shadow-md transition-shadow duration-200"
                    >
                      {/* Template Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`p-2 rounded-lg border ${
                              template.type === "GOLD"
                                ? "bg-yellow-100 border-yellow-300"
                                : template.type === "SILVER"
                                ? "bg-gray-100 border-gray-300"
                                : template.type === "BRONZE"
                                ? "bg-orange-100 border-orange-300"
                                : template.type === "HONORABLE_MENTION"
                                ? "bg-blue-100 border-blue-300"
                                : template.type === "SPECIAL"
                                ? "bg-purple-100 border-purple-300"
                                : "bg-green-100 border-green-300"
                            }`}
                          >
                            <TypeIcon
                              className={`h-6 w-6 ${
                                template.type === "GOLD"
                                  ? "text-yellow-600"
                                  : template.type === "SILVER"
                                  ? "text-gray-600"
                                  : template.type === "BRONZE"
                                  ? "text-orange-600"
                                  : template.type === "HONORABLE_MENTION"
                                  ? "text-blue-600"
                                  : template.type === "SPECIAL"
                                  ? "text-purple-600"
                                  : "text-green-600"
                              }`}
                            />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                              {template.name}
                            </h3>
                            <span
                              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getTypeBadgeColor(
                                template.type
                              )}`}
                            >
                              {template.type.replace("_", " ")}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <button className="text-gray-400 hover:text-gray-600 p-1">
                            <IconEye className="h-4 w-4" />
                          </button>
                          <button className="text-gray-400 hover:text-gray-600 p-1">
                            <IconEdit className="h-4 w-4" />
                          </button>
                          <button className="text-gray-400 hover:text-red-600 p-1">
                            <IconTrash className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      {/* Template Details */}
                      <div className="space-y-3 mb-4">
                        <p className="text-sm text-gray-600">
                          {template.description}
                        </p>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Prize:</span>
                            <span className="ml-1 font-medium text-green-600">
                              {template.prizeAmount}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-500">Used:</span>
                            <span className="ml-1 font-medium">
                              {template.usageCount} times
                            </span>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <div className="text-xs text-gray-500">
                            Certificate:{" "}
                            <span className="font-medium">
                              {template.certificateDesign}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500">
                            Badge:{" "}
                            <span className="font-medium">
                              {template.badgeDesign}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Status and Dates */}
                      <div className="border-t border-gray-100 pt-3">
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>Created: {template.createdDate}</span>
                          <span>Last used: {template.lastUsed}</span>
                        </div>
                        <div className="mt-2 flex items-center justify-between">
                          <span
                            className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                              template.isActive
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {template.isActive ? "Active" : "Inactive"}
                          </span>
                          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                            Use Template
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {filteredTemplates.length === 0 && (
                <div className="text-center py-12">
                  <IconAward className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No templates found
                  </h3>
                  <p className="text-gray-600">
                    Try adjusting your filter criteria.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
