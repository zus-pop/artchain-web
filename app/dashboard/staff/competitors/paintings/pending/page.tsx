"use client";

import { useState } from "react";
import { StaffSidebar } from "@/components/staff-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Breadcrumb } from "@/components/breadcrumb";
import { Painting, PaintingStatus } from "@/types/dashboard";
import {
  IconCheck,
  IconX,
  IconEye,
  IconCalendar,
  IconUser,
  IconPalette,
  IconFilter,
  IconSearch,
} from "@tabler/icons-react";

export default function PendingPaintingsPage() {
  const [paintings, setPaintings] = useState<Painting[]>([
    {
      id: "1",
      title: "Summer Dreams",
      competitorName: "Alice Johnson",
      competitorAge: 12,
      submittedDate: "2025-10-05",
      imageUrl: "/paintings/sample1.jpg",
      competitionName: "Spring Art Competition 2025",
      category: "Landscape",
      status: "PENDING",
      description: "A beautiful summer landscape with vibrant colors",
    },
    {
      id: "2",
      title: "City Lights",
      competitorName: "Bob Smith",
      competitorAge: 15,
      submittedDate: "2025-10-04",
      imageUrl: "/paintings/sample2.jpg",
      competitionName: "Urban Art Challenge",
      category: "Urban",
      status: "PENDING",
      description: "Night view of the city with colorful lights",
    },
    {
      id: "3",
      title: "Ocean Waves",
      competitorName: "Charlie Brown",
      competitorAge: 10,
      submittedDate: "2025-10-03",
      imageUrl: "/paintings/sample3.jpg",
      competitionName: "Nature Art Competition",
      category: "Seascape",
      status: "PENDING",
      description: "Dynamic waves crashing on the shore",
    },
    {
      id: "4",
      title: "Forest Path",
      competitorName: "Diana Lee",
      competitorAge: 14,
      submittedDate: "2025-10-02",
      imageUrl: "/paintings/sample4.jpg",
      competitionName: "Nature Art Competition",
      category: "Landscape",
      status: "PENDING",
      description: "A peaceful path through the forest",
    },
    {
      id: "5",
      title: "Abstract Emotions",
      competitorName: "Eva Martinez",
      competitorAge: 16,
      submittedDate: "2025-10-01",
      imageUrl: "/paintings/sample5.jpg",
      competitionName: "Modern Art Showcase",
      category: "Abstract",
      status: "PENDING",
      description: "Expression of emotions through abstract art",
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [selectedPainting, setSelectedPainting] = useState<Painting | null>(
    null
  );
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);

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
    const isPending = painting.status === "PENDING";
    return matchesSearch && matchesCategory && isPending;
  });

  const handleApprove = (paintingId: string) => {
    setPaintings(
      paintings.map((p) =>
        p.id === paintingId ? { ...p, status: "APPROVED" as PaintingStatus } : p
      )
    );
    if (selectedPainting?.id === paintingId) {
      setIsViewModalOpen(false);
      setSelectedPainting(null);
    }
  };

  const handleReject = (paintingId: string, reason: string) => {
    setPaintings(
      paintings.map((p) =>
        p.id === paintingId ? { ...p, status: "REJECTED" as PaintingStatus } : p
      )
    );
    setIsRejectModalOpen(false);
    setRejectionReason("");
    if (selectedPainting?.id === paintingId) {
      setIsViewModalOpen(false);
      setSelectedPainting(null);
    }
  };

  const openViewModal = (painting: Painting) => {
    setSelectedPainting(painting);
    setIsViewModalOpen(true);
  };

  const openRejectModal = (painting: Painting) => {
    setSelectedPainting(painting);
    setIsRejectModalOpen(true);
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
        <SiteHeader title="Pending Paintings Review" />
        <div className="flex flex-1 flex-col">
          <div className="px-4 lg:px-6 py-2 border-b border-gray-200 bg-white">
            <Breadcrumb
              items={[
                {
                  label: "Competitor Management",
                  href: "/dashboard/staff/competitors",
                },
                { label: "Paintings", href: "/dashboard/staff/competitors" },
                { label: "Pending Review" },
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
                    Pending Paintings ({filteredPaintings.length})
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Review and approve or reject competitor paintings
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
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <IconFilter className="h-5 w-5 text-gray-400" />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <IconPalette className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">
                    No pending paintings found
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredPaintings.map((painting) => (
                    <div
                      key={painting.id}
                      className="rounded-lg border border-gray-200 bg-white overflow-hidden hover:shadow-lg transition-shadow duration-200"
                    >
                      {/* Painting Image */}
                      <div className="relative h-64 bg-gray-100">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <IconPalette className="h-24 w-24 text-gray-300" />
                        </div>
                        <div className="absolute top-2 right-2">
                          <span className="inline-flex rounded-lg px-3 py-1 text-xs font-semibold bg-yellow-100 text-yellow-800">
                            PENDING
                          </span>
                        </div>
                      </div>

                      {/* Painting Info */}
                      <div className="p-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {painting.title}
                        </h3>

                        <div className="space-y-2 text-sm text-gray-600 mb-4">
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
                            <span>{painting.submittedDate}</span>
                          </div>
                        </div>

                        <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                          {painting.description}
                        </p>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                          <button
                            onClick={() => openViewModal(painting)}
                            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                          >
                            <IconEye className="h-4 w-4" />
                            View Details
                          </button>
                          <button
                            onClick={() => handleApprove(painting.id)}
                            className="flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
                            title="Approve"
                          >
                            <IconCheck className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => openRejectModal(painting)}
                            className="flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
                            title="Reject"
                          >
                            <IconX className="h-4 w-4" />
                          </button>
                        </div>
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
          <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-2xl font-bold text-gray-900">
                  {selectedPainting.title}
                </h3>
                <button
                  onClick={() => setIsViewModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <IconX className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Image */}
                <div className="relative h-96 bg-gray-100 rounded-lg flex items-center justify-center">
                  <IconPalette className="h-32 w-32 text-gray-300" />
                </div>

                {/* Details */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Competitor
                    </p>
                    <p className="text-base text-gray-900">
                      {selectedPainting.competitorName}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Age</p>
                    <p className="text-base text-gray-900">
                      {selectedPainting.competitorAge} years
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Category
                    </p>
                    <p className="text-base text-gray-900">
                      {selectedPainting.category}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Submitted Date
                    </p>
                    <p className="text-base text-gray-900">
                      {selectedPainting.submittedDate}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm font-medium text-gray-500">
                      Competition
                    </p>
                    <p className="text-base text-gray-900">
                      {selectedPainting.competitionName}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm font-medium text-gray-500">
                      Description
                    </p>
                    <p className="text-base text-gray-900">
                      {selectedPainting.description}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => handleApprove(selectedPainting.id)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <IconCheck className="h-5 w-5" />
                    Approve Painting
                  </button>
                  <button
                    onClick={() => {
                      setIsViewModalOpen(false);
                      openRejectModal(selectedPainting);
                    }}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <IconX className="h-5 w-5" />
                    Reject Painting
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {isRejectModalOpen && selectedPainting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-gray-900">
                  Reject Painting
                </h3>
                <button
                  onClick={() => {
                    setIsRejectModalOpen(false);
                    setRejectionReason("");
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <IconX className="h-6 w-6" />
                </button>
              </div>

              <p className="text-sm text-gray-600 mb-4">
                Are you sure you want to reject "{selectedPainting.title}" by{" "}
                {selectedPainting.competitorName}?
              </p>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for Rejection <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Please provide a reason for rejection..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 min-h-[100px]"
                  required
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setIsRejectModalOpen(false);
                    setRejectionReason("");
                  }}
                  className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() =>
                    handleReject(selectedPainting.id, rejectionReason)
                  }
                  disabled={!rejectionReason.trim()}
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Confirm Rejection
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </SidebarProvider>
  );
}
