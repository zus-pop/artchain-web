"use client";

import { useGetAwardsByContestId } from "@/apis/award";
import {
  useAddPaintingToExhibition,
  useDeletePaintingToExhibition,
  useGetExhibitionById,
} from "@/apis/exhibition";
import { getAllStaffContests } from "@/apis/staff";
import { Breadcrumb } from "@/components/breadcrumb";
import { SiteHeader } from "@/components/site-header";
import { StaffSidebar } from "@/components/staff-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import {
  IconArrowLeft,
  IconPhoto,
  IconPlus,
  IconTrash,
  IconTrophy,
} from "@tabler/icons-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { use, useState } from "react";

export default function EditExhibitionPaintingsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  // Painting management state
  const [selectedPaintingIds, setSelectedPaintingIds] = useState<string[]>([]);
  const [selectedContestId, setSelectedContestId] = useState<string>("");

  // Fetch exhibition details
  const { data: exhibitionResponse, isLoading } = useGetExhibitionById(id);
  const exhibition = exhibitionResponse?.data;

  // Fetch contests for selection
  const { data: contestsResponse } = useQuery({
    queryKey: ["staff-contests"],
    queryFn: () => getAllStaffContests({ limit: 100 }),
  });

  // Fetch awards for selected contest
  const { data: awardsResponse, isLoading: awardsLoading } =
    useGetAwardsByContestId(selectedContestId || "");

  // Mutations
  const addPaintingMutation = useAddPaintingToExhibition();
  const deletePaintingMutation = useDeletePaintingToExhibition();
  const queryClient = useQueryClient();

  const handleAddPaintings = async () => {
    if (selectedPaintingIds.length === 0) return;

    try {
      await addPaintingMutation.mutateAsync({
        exhibitionId: id,
        paintingIds: selectedPaintingIds,
      });
      setSelectedPaintingIds([]);
      // Refetch exhibition data
      queryClient.invalidateQueries({ queryKey: ["exhibition", id] });
    } catch (error) {
      console.error("Failed to add paintings:", error);
    }
  };

  const handleRemovePainting = async (paintingId: string) => {
    if (
      !confirm(
        "Are you sure you want to remove this painting from the exhibition?"
      )
    )
      return;

    try {
      await deletePaintingMutation.mutateAsync({
        exhibitionId: id,
        paintingId,
      });
      // Refetch exhibition data
      queryClient.invalidateQueries({ queryKey: ["exhibition", id] });
    } catch (error) {
      console.error("Failed to remove painting:", error);
    }
  };

  const handlePaintingSelection = (paintingId: string, checked: boolean) => {
    if (checked) {
      setSelectedPaintingIds((prev) => [...prev, paintingId]);
    } else {
      setSelectedPaintingIds((prev) => prev.filter((id) => id !== paintingId));
    }
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
          <SiteHeader title="Edit Exhibition Paintings" />
          <div className="flex flex-1 flex-col items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 staff-text-secondary">Loading exhibition...</p>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  if (!exhibition) {
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
          <SiteHeader title="Edit Exhibition Paintings" />
          <div className="flex flex-1 flex-col items-center justify-center py-12">
            <div className="text-center">
              <p className="staff-text-secondary">Exhibition not found</p>
              <Link
                href="/dashboard/staff/exhibitions"
                className="staff-btn-primary mt-4 inline-block"
              >
                Back to Exhibitions
              </Link>
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
        <SiteHeader title="Edit Exhibition Paintings" />
        <div className="flex flex-1 flex-col overflow-hidden">
          <div className="px-4 lg:px-6 py-2 border-b border-[#e6e2da] bg-[#fffdf9]">
            <Breadcrumb
              items={[
                {
                  label: "Exhibition Management",
                  href: "/dashboard/staff/exhibitions",
                },
                {
                  label: exhibition.name,
                  href: `/dashboard/staff/exhibitions/${id}`,
                },
                { label: "Manage Paintings" },
              ]}
              homeHref="/dashboard/staff"
            />
          </div>
          <div className="flex-1 overflow-y-auto">
            <div className="@container/main">
              <div className="flex flex-col gap-6 py-6 px-4 lg:px-6 max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Link
                      href={`/dashboard/staff/exhibitions/${id}/edit`}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Back to Exhibition Edit"
                    >
                      <IconArrowLeft className="h-5 w-5" />
                    </Link>
                    <div>
                      <h1 className="text-3xl font-bold staff-text-primary">
                        Manage Paintings
                      </h1>
                      <p className="text-sm staff-text-secondary mt-1">
                        Curate paintings from contest winners for this
                        exhibition
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Link
                      href={`/dashboard/staff/exhibitions/${id}`}
                      className="staff-btn-secondary flex items-center gap-2"
                    >
                      <IconArrowLeft className="h-4 w-4" />
                      Back to Exhibition
                    </Link>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Main Content Column */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Current Paintings */}
                    <div className="staff-card p-6">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-green-100">
                            <IconPhoto className="h-5 w-5 text-green-600" />
                          </div>
                          <div>
                            <h2 className="text-xl font-semibold staff-text-primary">
                              Current Paintings
                            </h2>
                            <p className="text-sm staff-text-secondary">
                              {exhibition.exhibitionPaintings?.length || 0}{" "}
                              paintings in this exhibition
                            </p>
                          </div>
                        </div>
                      </div>

                      {exhibition.exhibitionPaintings &&
                      exhibition.exhibitionPaintings.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          {exhibition.exhibitionPaintings.map(
                            (exhibitionPainting) => (
                              <div
                                key={exhibitionPainting.paintingId}
                                className="overflow-hidden hover:shadow-md transition-shadow"
                              >
                                <div className="aspect-square bg-gray-100 relative">
                                  {exhibitionPainting.imageUrl &&
                                  exhibitionPainting.imageUrl.trim() !== "" ? (
                                    <Image
                                      src={exhibitionPainting.imageUrl}
                                      alt={exhibitionPainting.title}
                                      fill
                                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                  ) : (
                                    <div className="flex items-center justify-center h-full text-gray-400">
                                      <div className="text-center">
                                        <IconPhoto className="h-16 w-16 mx-auto mb-4 opacity-50" />
                                        <p className="text-lg">
                                          No image available
                                        </p>
                                      </div>
                                    </div>
                                  )}
                                  <div className="absolute top-2 right-2">
                                    <button
                                      onClick={() =>
                                        handleRemovePainting(
                                          exhibitionPainting.paintingId
                                        )
                                      }
                                      className="p-1.5 bg-red-500 text-white hover:bg-red-600 transition-colors shadow-lg"
                                      title="Remove from exhibition"
                                      disabled={
                                        deletePaintingMutation.isPending
                                      }
                                    >
                                      <IconTrash className="h-3 w-3" />
                                    </button>
                                  </div>
                                </div>
                                <div className="p-3">
                                  <h4 className="font-medium staff-text-primary text-sm line-clamp-1">
                                    {exhibitionPainting.title}
                                  </h4>
                                  <p className="text-xs staff-text-secondary mt-1 line-clamp-2">
                                    {exhibitionPainting.description}
                                  </p>
                                  <div className="flex items-center justify-between mt-3">
                                    <span className="text-xs staff-text-secondary">
                                      Added:{" "}
                                      {new Date(
                                        exhibitionPainting.addedAt
                                      ).toLocaleDateString()}
                                    </span>
                                    
                                  </div>
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <IconPhoto className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                          <h3 className="text-lg font-medium staff-text-primary mb-2">
                            No paintings yet
                          </h3>
                          <p className="text-sm staff-text-secondary">
                            Add paintings from contest winners below
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Sidebar Column */}
                  <div className="space-y-6 lg:sticky lg:top-6 lg:self-start">
                    {/* Quick Stats */}
                    <div className="staff-card p-6">
                      <h3 className="text-lg font-semibold staff-text-primary mb-4">
                        Exhibition Stats
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between py-2">
                          <span className="text-sm staff-text-secondary">
                            Total Paintings
                          </span>
                          <span className="font-semibold staff-text-primary text-lg">
                            {exhibition.exhibitionPaintings?.length || 0}
                          </span>
                        </div>
                        <div className="flex items-center justify-between py-2">
                          <span className="text-sm staff-text-secondary">
                            Status
                          </span>
                          <span
                            className={`px-3 py-1 text-xs font-semibold rounded-full ${
                              exhibition.status === "ACTIVE"
                                ? "bg-green-100 text-green-800"
                                : exhibition.status === "DRAFT"
                                ? "bg-yellow-100 text-yellow-800"
                                : exhibition.status === "COMPLETED"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {exhibition.status}
                          </span>
                        </div>
                        <div className="flex flex-col py-2">
                          <span className="text-sm staff-text-secondary mb-1">
                            Duration
                          </span>
                          <span className="text-sm font-medium staff-text-primary">
                            {new Date(
                              exhibition.startDate
                            ).toLocaleDateString()}{" "}
                            -{" "}
                            {new Date(exhibition.endDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Add Paintings Section */}
                    <div className="staff-card p-6">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-purple-100">
                          <IconTrophy className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold staff-text-primary">
                            Add Paintings
                          </h3>
                          <p className="text-sm staff-text-secondary">
                            Select from contest winners
                          </p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        {/* Contest Selection */}
                        <div>
                          <label className="block text-sm font-medium staff-text-primary mb-2">
                            Choose Contest
                          </label>
                          <select
                            value={selectedContestId}
                            onChange={(e) =>
                              setSelectedContestId(e.target.value)
                            }
                            className="w-full px-3 py-2 border border-[#e6e2da] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                          >
                            <option value="">Select a contest...</option>
                            {contestsResponse?.data?.map((contest) => (
                              <option
                                key={contest.contestId}
                                value={contest.contestId.toString()}
                              >
                                {contest.title}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Awards Display */}
                        {selectedContestId && (
                          <div className="space-y-4">
                            {awardsLoading ? (
                              <div className="text-center py-6">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                                <p className="mt-2 text-sm staff-text-secondary">
                                  Loading awards...
                                </p>
                              </div>
                            ) : awardsResponse?.data &&
                              awardsResponse.data.length > 0 ? (
                              <div className="space-y-4 max-h-96 overflow-y-auto">
                                {awardsResponse.data.map((award) => (
                                  <div
                                    key={award.awardId}
                                    className="rounded-lg p-3"
                                  >
                                    <div className="flex items-center justify-between mb-3">
                                      <div>
                                        <h4 className="font-semibold staff-text-primary text-sm">
                                          {award.name}
                                        </h4>
                                        <p className="text-xs staff-text-secondary">
                                          Rank #{award.rank}
                                        </p>
                                      </div>
                                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium">
                                        {award.paintings?.length || 0}
                                      </span>
                                    </div>

                                    {award.paintings &&
                                    award.paintings.length > 0 ? (
                                      <div className="grid grid-cols-2 gap-2">
                                        {award.paintings.map((painting) => {
                                          const isAlreadyAdded =
                                            exhibition.exhibitionPaintings?.some(
                                              (exhibitionPainting) =>
                                                exhibitionPainting.paintingId ===
                                                painting.paintingId
                                            );

                                          return (
                                            <div
                                              key={painting.paintingId}
                                              className={`relative group ${
                                                isAlreadyAdded
                                                  ? "cursor-not-allowed opacity-60"
                                                  : "cursor-pointer"
                                              }`}
                                              onClick={() =>
                                                !isAlreadyAdded &&
                                                handlePaintingSelection(
                                                  painting.paintingId,
                                                  !selectedPaintingIds.includes(
                                                    painting.paintingId
                                                  )
                                                )
                                              }
                                            >
                                              <div
                                                className={`aspect-square bg-gray-100 border-2 transition-colors relative overflow-hidden ${
                                                  isAlreadyAdded
                                                    ? "border-gray-300"
                                                    : "border-transparent group-hover:border-blue-300"
                                                }`}
                                              >
                                                {painting.imageUrl &&
                                                painting.imageUrl.trim() !==
                                                  "" ? (
                                                  <Image
                                                    src={painting.imageUrl}
                                                    alt={painting.title}
                                                    fill
                                                    className="object-cover"
                                                  />
                                                ) : (
                                                  <div className="flex items-center justify-center h-full text-gray-400">
                                                    <div className="text-center">
                                                      <IconPhoto className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                                      <p className="text-xs">
                                                        No image
                                                      </p>
                                                    </div>
                                                  </div>
                                                )}
                                                {isAlreadyAdded ? (
                                                  <div className="absolute inset-0 bg-opacity-40 flex items-center justify-center">
                                                    <span className="bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded font-medium">
                                                      Added
                                                    </span>
                                                  </div>
                                                ) : (
                                                  <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-20 transition-opacity">
                                                    <div className="absolute top-2 left-2">
                                                      <input
                                                        type="checkbox"
                                                        checked={selectedPaintingIds.includes(
                                                          painting.paintingId
                                                        )}
                                                        onChange={(e) => {
                                                          e.stopPropagation();
                                                          handlePaintingSelection(
                                                            painting.paintingId,
                                                            e.target.checked
                                                          );
                                                        }}
                                                        className="w-5 h-5 text-blue-600 bg-white border-2 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 cursor-pointer transition-all duration-200 hover:border-blue-400 checked:bg-blue-600 checked:border-blue-600"
                                                      />
                                                    </div>
                                                  </div>
                                                )}
                                              </div>
                                              <p
                                                className={`text-xs mt-1 line-clamp-1 text-center ${
                                                  isAlreadyAdded
                                                    ? "text-gray-500"
                                                    : "staff-text-primary"
                                                }`}
                                              >
                                                {painting.title}
                                              </p>
                                            </div>
                                          );
                                        })}
                                      </div>
                                    ) : (
                                      <div className="text-center py-2 text-gray-500 text-xs">
                                        No paintings awarded
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="text-center py-6">
                                <IconTrophy className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                                <p className="text-sm staff-text-secondary">
                                  No awards found
                                </p>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Selected paintings count and add button */}
                        {selectedPaintingIds.length > 0 && (
                          <div className="bg-blue-50 border border-blue-200 p-3">
                            <div className="flex items-center justify-between">
                              <span className="text-sm staff-text-primary font-medium">
                                {selectedPaintingIds.length} painting
                                {selectedPaintingIds.length !== 1
                                  ? "s"
                                  : ""}{" "}
                                selected
                              </span>
                              <button
                                type="button"
                                onClick={handleAddPaintings}
                                className="staff-btn-primary flex items-center gap-2 text-sm px-3 py-1.5"
                                disabled={addPaintingMutation.isPending}
                              >
                                <IconPlus className="h-3 w-3" />
                                {addPaintingMutation.isPending
                                  ? "Adding..."
                                  : "Add"}
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
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
