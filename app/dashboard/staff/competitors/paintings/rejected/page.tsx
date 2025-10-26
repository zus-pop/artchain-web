"use client";

import { useState } from "react";
import { StaffSidebar } from "@/components/staff-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Breadcrumb } from "@/components/breadcrumb";
import { Painting } from "@/types/dashboard";
import {
  IconEye,
  IconCalendar,
  IconUser,
  IconPalette,
  IconFilter,
  IconSearch,
  IconX,
  IconAlertCircle,
} from "@tabler/icons-react";

export default function RejectedPaintingsPage() {
  const [paintings] = useState<Painting[]>([
    {
      id: "1",
      title: "Incomplete Sketch",
      competitorName: "Tom Harris",
      competitorAge: 10,
      submittedDate: "2025-09-29",
      rejectedDate: "2025-10-01",
      imageUrl: "/paintings/rejected1.jpg",
      competitionName: "Spring Art Competition 2025",
      category: "Sketch",
      status: "REJECTED",
      description: "A sketch that was not completed",
      rejectedBy: "Staff User",
      rejectionReason:
        "The artwork appears to be incomplete. Please submit a finished piece.",
    },
    {
      id: "2",
      title: "Inappropriate Content",
      competitorName: "Jane Doe",
      competitorAge: 15,
      submittedDate: "2025-09-26",
      rejectedDate: "2025-09-28",
      imageUrl: "/paintings/rejected2.jpg",
      competitionName: "Modern Art Showcase",
      category: "Abstract",
      status: "REJECTED",
      description: "Abstract art with inappropriate themes",
      rejectedBy: "Staff User",
      rejectionReason:
        "The content does not align with competition guidelines. Please review the rules and submit appropriate artwork.",
    },
    {
      id: "3",
      title: "Poor Quality Image",
      competitorName: "Alex Brown",
      competitorAge: 12,
      submittedDate: "2025-09-23",
      rejectedDate: "2025-09-25",
      imageUrl: "/paintings/rejected3.jpg",
      competitionName: "Nature Art Competition",
      category: "Landscape",
      status: "REJECTED",
      description: "Landscape painting with low quality",
      rejectedBy: "Staff User",
      rejectionReason:
        "The submitted image quality is too low. Please upload a higher resolution image (minimum 1920x1080).",
    },
    {
      id: "4",
      title: "Copied Artwork",
      competitorName: "Chris Wilson",
      competitorAge: 14,
      submittedDate: "2025-09-21",
      rejectedDate: "2025-09-23",
      imageUrl: "/paintings/rejected4.jpg",
      competitionName: "Original Art Competition",
      category: "Portrait",
      status: "REJECTED",
      description: "Portrait that appears to be copied",
      rejectedBy: "Staff User",
      rejectionReason:
        "This artwork appears to be a copy of existing work. Only original artworks are accepted. Please submit your own creation.",
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [selectedPainting, setSelectedPainting] = useState<Painting | null>(
    null
  );
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const categories = [
    "ALL",
    ...Array.from(new Set(paintings.map((p) => p.category))),
  ];

  const filteredPaintings = paintings.filter((painting) => {
    const matchesSearch =
      painting.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      painting.competitorName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "ALL" || painting.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const openViewModal = (painting: Painting) => {
    setSelectedPainting(painting);
    setIsViewModalOpen(true);
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
        <SiteHeader title="Paintings - Rejected" />
        <div className="flex flex-1 flex-col">
          <div className="px-4 lg:px-6 py-2 border-b border-[#e6e2da] bg-white">
            <Breadcrumb
              items={[
                {
                  label: "Competitor Management",
                  href: "/dashboard/staff/competitors",
                },
                { label: "Paintings", href: "/dashboard/staff/competitors" },
                { label: "Rejected" },
              ]}
              homeHref="/dashboard/staff"
            />
          </div>
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
              {/* Page Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold staff-text-primary">
                    Rejected Paintings ({filteredPaintings.length})
                  </h2>
                  <p className="text-sm staff-text-secondary mt-1">
                    View all rejected competitor paintings
                  </p>
                </div>
              </div>

              {/* Search and Filter */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by title or competitor name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-[#e6e2da]  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <IconFilter className="h-5 w-5 text-gray-400" />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-4 py-2 border border-[#e6e2da]  focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Paintings Grid */}
              {filteredPaintings.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 ">
                  <IconPalette className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="staff-text-secondary text-lg">
                    No rejected paintings found
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredPaintings.map((painting) => (
                    <div
                      key={painting.id}
                      className="staff-card overflow-hidden hover:shadow-lg transition-shadow duration-200"
                    >
                      {/* Painting Image */}
                      <div className="relative h-64 bg-gray-100">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <IconPalette className="h-24 w-24 text-gray-300" />
                        </div>
                        <div className="absolute top-2 right-2">
                          <span className="inline-flex  px-3 py-1 text-xs font-semibold bg-red-100 text-red-800">
                            <IconX className="h-3 w-3 mr-1" />
                            REJECTED
                          </span>
                        </div>
                      </div>

                      {/* Painting Info */}
                      <div className="p-4">
                        <h3 className="text-lg font-semibold staff-text-primary mb-2">
                          {painting.title}
                        </h3>

                        <div className="space-y-2 text-sm staff-text-secondary mb-4">
                          <div className="flex items-center gap-2">
                            <IconUser className="h-4 w-4" />
                            <span>
                              {painting.competitorName} (Age{" "}
                              {painting.competitorAge})
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <IconPalette className="h-4 w-4" />
                            <span>{painting.category}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <IconCalendar className="h-4 w-4" />
                            <span>Rejected: {painting.rejectedDate}</span>
                          </div>
                        </div>

                        <div className="bg-red-50 border border-red-100  p-3 mb-4">
                          <div className="flex items-start gap-2">
                            <IconAlertCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                            <p className="text-xs text-red-800 line-clamp-2">
                              {painting.rejectionReason}
                            </p>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <button
                          onClick={() => openViewModal(painting)}
                          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50  hover:bg-blue-100 transition-colors"
                        >
                          <IconEye className="h-4 w-4" />
                          View Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </SidebarInset>

      {/* View Details Modal */}
      {isViewModalOpen && selectedPainting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white  max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold staff-text-primary">
                    {selectedPainting.title}
                  </h3>
                  <span className="inline-flex  px-3 py-1 text-xs font-semibold bg-red-100 text-red-800 mt-2">
                    <IconX className="h-3 w-3 mr-1" />
                    REJECTED
                  </span>
                </div>
                <button
                  onClick={() => setIsViewModalOpen(false)}
                  className="text-gray-400 hover:staff-text-secondary"
                >
                  <IconX className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Image */}
                <div className="relative h-96 bg-gray-100  flex items-center justify-center">
                  <IconPalette className="h-32 w-32 text-gray-300" />
                </div>

                {/* Rejection Reason Alert */}
                <div className="bg-red-50 border border-red-200  p-4">
                  <div className="flex items-start gap-3">
                    <IconAlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-red-900 mb-1">
                        Rejection Reason
                      </h4>
                      <p className="text-sm text-red-800">
                        {selectedPainting.rejectionReason}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium staff-text-secondary">
                      Competitor
                    </p>
                    <p className="text-base staff-text-primary">
                      {selectedPainting.competitorName}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium staff-text-secondary">Age</p>
                    <p className="text-base staff-text-primary">
                      {selectedPainting.competitorAge} years
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium staff-text-secondary">
                      Category
                    </p>
                    <p className="text-base staff-text-primary">
                      {selectedPainting.category}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium staff-text-secondary">
                      Submitted Date
                    </p>
                    <p className="text-base staff-text-primary">
                      {selectedPainting.submittedDate}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium staff-text-secondary">
                      Rejected Date
                    </p>
                    <p className="text-base staff-text-primary">
                      {selectedPainting.rejectedDate}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium staff-text-secondary">
                      Rejected By
                    </p>
                    <p className="text-base staff-text-primary">
                      {selectedPainting.rejectedBy}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm font-medium staff-text-secondary">
                      Competition
                    </p>
                    <p className="text-base staff-text-primary">
                      {selectedPainting.competitionName}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm font-medium staff-text-secondary">
                      Description
                    </p>
                    <p className="text-base staff-text-primary">
                      {selectedPainting.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </SidebarProvider>
  );
}
