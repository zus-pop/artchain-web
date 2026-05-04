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
    setRejectionReason(reason);
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
        <SiteHeader title="Duyệt Tranh Chờ Phê Duyệt" />
        <div className="flex flex-1 flex-col">
          <div className="staff-page-header">
            <Breadcrumb
              items={[
                {
                  label: "Quản Lý Thí Sinh",
                  href: "/dashboard/staff/competitors",
                },
                { label: "Tranh", href: "/dashboard/staff/competitors" },
                { label: "Chờ Duyệt" },
              ]}
              homeHref="/dashboard/staff"
            />
          </div>
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
              {/* Page Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="staff-type-page-title staff-text-primary">
                    Tranh Chờ Duyệt ({filteredPaintings.length})
                  </h2>
                  <p className="text-sm staff-text-secondary mt-1">
                    Xem xét và phê duyệt hoặc từ chối tranh của thí sinh
                  </p>
                </div>
              </div>

              {/* Search and Filter */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                   <input
                    type="text"
                    placeholder="Tìm kiếm theo tiêu đề hoặc tên thí sinh..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-[var(--staff-border)]  focus:outline-none staff-field"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <IconFilter className="h-5 w-5 text-gray-400" />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="staff-select"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category === "ALL" ? "Tất cả" : category}
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
                    Không tìm thấy tranh chờ duyệt nào
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
                          <span className="inline-flex  px-3 py-1 text-xs font-semibold bg-yellow-100 text-yellow-800">
                            CHỜ DUYỆT
                          </span>
                        </div>
                      </div>

                      {/* Painting Info */}
                      <div className="p-4">
                        <h3 className="staff-type-section-title staff-text-primary mb-2">
                          {painting.title}
                        </h3>

                        <div className="space-y-2 text-sm staff-text-secondary mb-4">
                          <div className="flex items-center gap-2">
                            <IconUser className="h-4 w-4" />
                            <span>
                              {painting.competitorName} ({painting.competitorAge} tuổi)
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

                        <p className="text-sm staff-text-secondary mb-4 line-clamp-2">
                          {painting.description}
                        </p>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                          <button
                            onClick={() => openViewModal(painting)}
                            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50  hover:bg-blue-100 transition-colors"
                          >
                            <IconEye className="h-4 w-4" />
                            Xem Chi Tiết
                          </button>
                          <button
                            onClick={() => handleApprove(painting.id)}
                            className="flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-white staff-btn-secondary transition-colors"
                            title="Phê Duyệt"
                          >
                            <IconCheck className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => openRejectModal(painting)}
                            className="flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-white bg-red-600  hover:bg-red-700 transition-colors"
                            title="Từ Chối"
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
          <div className="bg-white  max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="staff-type-page-title staff-text-primary">
                  {selectedPainting.title}
                </h3>
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

                {/* Details */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium staff-text-secondary">
                      Thí sinh
                    </p>
                    <p className="text-base staff-text-primary">
                      {selectedPainting.competitorName}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium staff-text-secondary">Tuổi</p>
                    <p className="text-base staff-text-primary">
                      {selectedPainting.competitorAge} tuổi
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium staff-text-secondary">
                      Thể loại
                    </p>
                    <p className="text-base staff-text-primary">
                      {selectedPainting.category}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium staff-text-secondary">
                      Ngày nộp
                    </p>
                    <p className="text-base staff-text-primary">
                      {selectedPainting.submittedDate}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm font-medium staff-text-secondary">
                      Cuộc thi
                    </p>
                    <p className="text-base staff-text-primary">
                      {selectedPainting.competitionName}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm font-medium staff-text-secondary">
                      Mô tả
                    </p>
                    <p className="text-base staff-text-primary">
                      {selectedPainting.description}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => handleApprove(selectedPainting.id)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white staff-btn-secondary transition-colors"
                  >
                    <IconCheck className="h-5 w-5" />
                    Phê Duyệt Tranh
                  </button>
                  <button
                    onClick={() => {
                      setIsViewModalOpen(false);
                      openRejectModal(selectedPainting);
                    }}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600  hover:bg-red-700 transition-colors"
                  >
                    <IconX className="h-5 w-5" />
                    Từ Chối Tranh
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
          <div className="bg-white  max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold staff-text-primary">
                  Từ Chối Tranh
                </h3>
                <button
                  onClick={() => {
                    setIsRejectModalOpen(false);
                    setRejectionReason("");
                  }}
                  className="text-gray-400 hover:staff-text-secondary"
                >
                  <IconX className="h-6 w-6" />
                </button>
              </div>

              <p className="text-sm staff-text-secondary mb-4">
                Bạn có chắc chắn muốn từ chối tác phẩm &ldquo;{selectedPainting.title}
                &rdquo; của {selectedPainting.competitorName}?
              </p>

              <div className="mb-4">
                <label className="staff-type-label text-gray-700 mb-2 block">
                  Lý do từ chối <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Vui lòng cung cấp lý do từ chối..."
                  className="w-full px-3 py-2 border border-[var(--staff-border)]  focus:outline-none focus:ring-2 focus:ring-[var(--staff-primary)] min-h-[100px]"
                  required
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setIsRejectModalOpen(false);
                    setRejectionReason("");
                  }}
                  className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100  hover:bg-gray-200 transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={() =>
                    handleReject(selectedPainting.id, rejectionReason)
                  }
                  disabled={!rejectionReason.trim()}
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600  hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Xác Nhận Từ Chối
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </SidebarProvider>
  );
}
