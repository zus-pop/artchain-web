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
  IconCheck,
} from "@tabler/icons-react";

export default function ApprovedPaintingsPage() {
  const [paintings] = useState<Painting[]>([
    {
      id: "1",
      title: "Sunset Paradise",
      competitorName: "Emma Wilson",
      competitorAge: 13,
      submittedDate: "2025-09-28",
      approvedDate: "2025-09-30",
      imageUrl: "/paintings/approved1.jpg",
      competitionName: "Summer Art Festival",
      category: "Landscape",
      status: "APPROVED",
      description: "Beautiful sunset with vibrant orange and purple hues",
      approvedBy: "Staff User",
    },
    {
      id: "2",
      title: "Wildlife Wonder",
      competitorName: "Michael Chen",
      competitorAge: 11,
      submittedDate: "2025-09-25",
      approvedDate: "2025-09-27",
      imageUrl: "/paintings/approved2.jpg",
      competitionName: "Nature Art Competition",
      category: "Wildlife",
      status: "APPROVED",
      description: "A majestic lion in its natural habitat",
      approvedBy: "Staff User",
    },
    {
      id: "3",
      title: "Modern Geometry",
      competitorName: "Sarah Kim",
      competitorAge: 16,
      submittedDate: "2025-09-24",
      approvedDate: "2025-09-26",
      imageUrl: "/paintings/approved3.jpg",
      competitionName: "Modern Art Showcase",
      category: "Abstract",
      status: "APPROVED",
      description: "Geometric shapes creating a harmonious composition",
      approvedBy: "Staff User",
    },
    {
      id: "4",
      title: "Flower Garden",
      competitorName: "Lily Anderson",
      competitorAge: 9,
      submittedDate: "2025-09-22",
      approvedDate: "2025-09-24",
      imageUrl: "/paintings/approved4.jpg",
      competitionName: "Spring Art Competition 2025",
      category: "Nature",
      status: "APPROVED",
      description: "A colorful garden full of blooming flowers",
      approvedBy: "Staff User",
    },
    {
      id: "5",
      title: "Space Adventure",
      competitorName: "Jake Thompson",
      competitorAge: 14,
      submittedDate: "2025-09-20",
      approvedDate: "2025-09-22",
      imageUrl: "/paintings/approved5.jpg",
      competitionName: "Imagination Competition",
      category: "Fantasy",
      status: "APPROVED",
      description: "A creative depiction of space exploration",
      approvedBy: "Staff User",
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
        <SiteHeader title="Paintings - Approved" />
        <div className="flex flex-1 flex-col">
          <div className="px-4 lg:px-6 py-2 border-b border-[#e6e2da] bg-white">
            <Breadcrumb
              items={[
                {
                  label: "Competitor Management",
                  href: "/dashboard/staff/competitors",
                },
                { label: "Paintings", href: "/dashboard/staff/competitors" },
                { label: "Approved" },
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
                    Approved Paintings ({filteredPaintings.length})
                  </h2>
                  <p className="text-sm staff-text-secondary mt-1">
                    View all approved competitor paintings
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
                    No approved paintings found
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
                          <span className="inline-flex  px-3 py-1 text-xs font-semibold bg-green-100 text-green-800">
                            <IconCheck className="h-3 w-3 mr-1" />
                            APPROVED
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
                            <span>Approved: {painting.approvedDate}</span>
                          </div>
                        </div>

                        <p className="text-sm staff-text-secondary mb-4 line-clamp-2">
                          {painting.description}
                        </p>

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
                  <span className="inline-flex  px-3 py-1 text-xs font-semibold bg-green-100 text-green-800 mt-2">
                    <IconCheck className="h-3 w-3 mr-1" />
                    APPROVED
                  </span>
                </div>
                <button
                  onClick={() => setIsViewModalOpen(false)}
                  className="text-gray-400 hover:staff-text-secondary"
                >
                  <IconEye className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Image */}
                <div className="relative h-96 bg-gray-100  flex items-center justify-center">
                  <IconPalette className="h-32 w-32 text-gray-300" />
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
                      Approved Date
                    </p>
                    <p className="text-base staff-text-primary">
                      {selectedPainting.approvedDate}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium staff-text-secondary">
                      Approved By
                    </p>
                    <p className="text-base staff-text-primary">
                      {selectedPainting.approvedBy}
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
