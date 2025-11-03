"use client";

import { Breadcrumb } from "@/components/breadcrumb";
import { SiteHeader } from "@/components/site-header";
import { StaffSidebar } from "@/components/staff-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { getStaffContestById } from "@/apis/staff";
import {
  useGetAwardsByContestId,
  useAssignAward,
  useRemoveAward,
} from "@/apis/award";
import { useGetRound2TopByContestId } from "@/apis/paintings";
import { useQuery } from "@tanstack/react-query";
import { Award } from "@/types/award";
import { TopPainting } from "@/types/painting";
import {
  IconTrophy,
  IconX,
  IconCheck,
  IconArrowLeft,
} from "@tabler/icons-react";
import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";

const formatCurrency = (value: number) => {
  return value.toLocaleString("vi-VN");
};

function PaintingAwardRow({
  painting,
  index,
  availableAwards,
  onAssign,
  onRemove,
  isProcessing,
}: {
  painting: TopPainting;
  index: number;
  availableAwards: Award[];
  onAssign: (painting: TopPainting, award: Award) => void;
  onRemove: (painting: TopPainting) => void;
  isProcessing: boolean;
}) {
  const assignedAward = painting.award;
  return (
    <div className="border border-[#e6e2da] rounded-lg p-4 hover:shadow-md transition-shadow">
      {/* Award Status Indicator */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-12 h-12 bg-yellow-100 text-yellow-800 rounded-full font-bold">
            #{index + 1}
          </div>
          {assignedAward ? (
            <div className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
              <IconTrophy className="h-3 w-3" />
              Awarded
            </div>
          ) : (
            <div className="flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
              <IconTrophy className="h-3 w-3" />
              Unassigned
            </div>
          )}
        </div>
        {assignedAward && (
          <button
            onClick={() => onRemove(painting)}
            disabled={isProcessing}
            className="px-2 py-1 bg-red-100 hover:bg-red-200 text-red-700 text-xs font-medium rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Remove Award"
          >
            <IconX className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="flex gap-4">
        {/* Painting Image */}
        {painting.imageUrl && (
          <div className="shrink-0 w-32 h-32 bg-gray-100 rounded overflow-hidden">
            <img
              src={painting.imageUrl}
              alt={painting.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Painting Info */}
        <div className="flex-1 min-w-0">
          <h4 className="font-bold staff-text-primary text-lg mb-1">
            {painting.title}
          </h4>
          <p className="text-sm staff-text-secondary mb-2">
            By {painting.competitorName}
          </p>
          <div className="flex gap-4 text-xs staff-text-secondary mb-3">
            <span>Score: {painting.avgScoreRound2.toFixed(2)}</span>
            <span>Evaluations: {painting.evaluationCount}</span>
          </div>

          {/* Award Assignment */}
          {assignedAward ? (
            <div className="bg-green-50 border-2 border-green-300 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <IconCheck className="h-5 w-5 text-green-600" />
                <div className="flex-1">
                  <div className="text-base font-bold text-green-900">
                    {assignedAward.name}
                  </div>
                  <div className="text-sm text-green-700">
                    Prize: {formatCurrency(parseFloat(assignedAward.prize))} ₫
                  </div>
                </div>
                <button
                  onClick={() => onRemove(painting)}
                  disabled={isProcessing}
                  className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                  title="Remove Award"
                >
                  <IconX className="h-4 w-4" />
                  Remove
                </button>
              </div>
              <button
                onClick={() => onRemove(painting)}
                disabled={isProcessing}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <IconX className="h-4 w-4" />
                {isProcessing ? "Removing..." : "Remove Award"}
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <label className="text-sm font-semibold staff-text-primary">
                Assign Award:
              </label>
              <div className="flex flex-wrap gap-2">
                {availableAwards.length > 0 ? (
                  availableAwards.map((award) => (
                    <button
                      key={award.awardId}
                      onClick={() => onAssign(painting, award)}
                      disabled={isProcessing}
                      className="px-3 py-1.5 text-sm bg-blue-50 hover:bg-blue-100 border border-blue-300 text-blue-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {award.name} ({award.paintings.length}/{award.quantity})
                    </button>
                  ))
                ) : (
                  <span className="text-sm text-gray-500">
                    No awards available
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AwardsManagementPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const contestId = searchParams.get("id") as string;

  const [currentPaintingId, setCurrentPaintingId] = useState<string>("");

  const { data: contestData } = useQuery({
    queryKey: ["staff-contest", contestId],
    queryFn: () => getStaffContestById(Number(contestId)),
    enabled: !!contestId,
    staleTime: 2 * 60 * 1000,
  });

  const { data: awardsData } = useGetAwardsByContestId(contestId);
  const { data: paintingsData, isLoading: paintingsLoading } =
    useGetRound2TopByContestId(contestId);

  const awards = (awardsData?.data as Award[]) || [];
  const paintings = (paintingsData?.data as TopPainting[]) || [];
  const contest = contestData?.data;

  const assignMutation = useAssignAward(currentPaintingId);
  const removeMutation = useRemoveAward(currentPaintingId);

  const handleAssignAward = async (painting: TopPainting, award: Award) => {
    setCurrentPaintingId(painting.paintingId);
    await assignMutation.mutateAsync({ awardId: award.awardId });
  };

  const handleRemoveAward = async (painting: TopPainting) => {
    setCurrentPaintingId(painting.paintingId);
    await removeMutation.mutateAsync();
  };

  const getAvailableAwards = (): Award[] => {
    return awards.filter((award) => award.paintings.length < award.quantity);
  };

  const totalAwardSlots = awards.reduce(
    (sum, award) => sum + award.quantity,
    0
  );
  const assignedSlots = awards.reduce(
    (sum, award) => sum + award.paintings.length,
    0
  );

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
        <SiteHeader title={`${contest?.title || "Contest"} - Awards`} />
        <div className="flex flex-1 flex-col">
          <div className="px-4 lg:px-6 py-2 border-b border-[#e6e2da] bg-white">
            <Breadcrumb
              items={[
                {
                  label: "Contest Management",
                  href: "/dashboard/staff/contests",
                },
                {
                  label: contest?.title || "Contest Detail",
                  href: `/dashboard/staff/contests/detail?id=${contestId}`,
                },
                { label: "Awards" },
              ]}
              homeHref="/dashboard/staff"
            />
          </div>
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
              {/* Page Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() =>
                      router.push(
                        `/dashboard/staff/contests/detail?id=${contestId}`
                      )
                    }
                    className="staff-btn-outline p-2"
                    title="Back to Contest"
                  >
                    <IconArrowLeft className="h-4 w-4" />
                  </button>
                  <div>
                    <h2 className="text-2xl font-bold staff-text-primary">
                      Award Assignment - {contest?.title || "Contest"}
                    </h2>
                    <p className="text-sm staff-text-secondary mt-1">
                      Assign awards to top paintings • {assignedSlots} /{" "}
                      {totalAwardSlots} slots filled
                    </p>
                  </div>
                </div>
                <button
                  onClick={() =>
                    router.push(
                      `/dashboard/staff/contests/awards/manage?id=${contestId}`
                    )
                  }
                  className="staff-btn-primary flex items-center gap-2"
                >
                  <IconTrophy className="h-4 w-4" />
                  Manage Awards
                </button>
              </div>

              {/* Two Column Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Top Paintings (2/3 width) */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="staff-card p-6">
                    <h3 className="text-lg font-bold staff-text-primary mb-4">
                      Top Paintings ({paintings.length})
                    </h3>
                    {paintingsLoading ? (
                      <div className="text-center py-12 staff-text-secondary">
                        Loading paintings...
                      </div>
                    ) : paintings.length > 0 ? (
                      <div className="space-y-4">
                        {paintings.map((painting, index) => {
                          const availableAwards = getAvailableAwards();
                          const isProcessing =
                            currentPaintingId === painting.paintingId &&
                            (assignMutation.isPending ||
                              removeMutation.isPending);

                          return (
                            <PaintingAwardRow
                              key={painting.paintingId}
                              painting={painting}
                              index={index}
                              availableAwards={
                                painting.award ? [] : availableAwards
                              }
                              onAssign={handleAssignAward}
                              onRemove={handleRemoveAward}
                              isProcessing={isProcessing}
                            />
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-12 staff-text-secondary">
                        No top paintings available yet
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Column: Awards & Assigned Paintings (1/3 width) */}
                <div className="space-y-4">
                  {/* Available Awards */}
                  <div className="staff-card p-4 sticky top-4">
                    <h3 className="text-lg font-semibold staff-text-primary mb-3">
                      Available Awards
                    </h3>
                    <div className="space-y-2">
                      {awards.map((award) => (
                        <div
                          key={award.awardId}
                          className={`p-3 rounded-lg border-2 ${
                            award.paintings.length >= award.quantity
                              ? "bg-gray-100 border-gray-300"
                              : "bg-blue-50 border-blue-300"
                          }`}
                        >
                          <div className="flex items-start gap-2">
                            <IconTrophy className="h-5 w-5 text-blue-600 mt-0.5" />
                            <div className="flex-1 min-w-0">
                              <div className="font-semibold text-sm">
                                {award.name}
                              </div>
                              <div className="text-xs text-green-600 mt-0.5">
                                {formatCurrency(parseFloat(award.prize))} ₫
                              </div>
                              <div className="text-xs staff-text-secondary mt-1">
                                {award.paintings.length}/{award.quantity}{" "}
                                assigned
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
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
