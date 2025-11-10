"use client";

import {
  useAssignAward,
  useGetAwardsByContestId,
  useRemoveAward,
} from "@/apis/award";
import { useAnnounceWinners } from "@/apis/email";
import { useGetRound2TopByContestId } from "@/apis/paintings";
import { getStaffContestById } from "@/apis/staff";
import { getVotedAward, getVotedPaintings } from "@/apis/vote";
import { Breadcrumb } from "@/components/breadcrumb";
import { SiteHeader } from "@/components/site-header";
import { StaffSidebar } from "@/components/staff-sidebar";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Lang, useTranslation } from "@/lib/i18n";
import { useLanguageStore } from "@/store/language-store";
import { Contest } from "@/types";
import { Award } from "@/types/award";
import { TopPainting } from "@/types/painting";
import { VotedPaining } from "@/types/vote";
import {
  IconArrowLeft,
  IconChevronDown,
  IconChevronUp,
  IconMail,
  IconSpeakerphone,
  IconTrophy,
  IconX,
} from "@tabler/icons-react";
import { useQueries, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
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
  onImageClick,
  t,
}: {
  painting: TopPainting;
  index: number;
  availableAwards: Award[];
  onAssign: (painting: TopPainting, award: Award) => void;
  onRemove: (painting: TopPainting) => void;
  isProcessing: boolean;
  onImageClick: (imageUrl: string) => void;
  t: Lang;
}) {
  const assignedAward = painting.award;
  return (
    <div className="border border-[#e6e2da] p-4 hover:shadow-md transition-shadow">
      {/* Award Status Indicator */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-12 h-12 bg-yellow-100 text-yellow-800 rounded-full font-bold">
            #{index + 1}
          </div>
          {assignedAward ? (
            <div className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
              <IconTrophy className="h-3 w-3" />
              {t.awarded}
            </div>
          ) : (
            <div className="flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
              <IconTrophy className="h-3 w-3" />
              {t.unassigned}
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-4">
        {/* Painting Image - Left side with click to view full */}
        {painting.imageUrl && (
          <div
            className="shrink-0 w-40 h-40 bg-gray-100 rounded-lg overflow-hidden border-2 border-[#e6e2da] shadow-sm cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => onImageClick(painting.imageUrl)}
          >
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
            {t.byArtist} {painting.competitorName}
          </p>
          <div className="flex gap-4 text-xs staff-text-secondary mb-4">
            <span>
              {t.scoreLabel} {painting.avgScoreRound2.toFixed(2)}
            </span>
            <span>
              {t.evaluationsLabel} {painting.evaluationCount}
            </span>
          </div>

          {/* Award Assignment */}
          {assignedAward ? (
            <div className="bg-gray-50 border border-[#e6e2da] rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="shrink-0 w-10 h-10 bg-[#e6e2da] rounded-full flex items-center justify-center">
                  <IconTrophy className="h-5 w-5 staff-text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="font-bold staff-text-primary text-base">
                        {assignedAward.name}
                      </h5>
                      <div className="text-sm staff-text-secondary">
                        {t.prizeLabel}{" "}
                        {formatCurrency(parseFloat(assignedAward.prize))} ₫
                      </div>
                    </div>
                    <button
                      onClick={() => onRemove(painting)}
                      disabled={isProcessing}
                      className="shrink-0 ml-4 px-3 py-1.5 staff-btn-outline text-sm font-medium rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                      title={t.removeAwardTitle}
                    >
                      <IconX className="h-4 w-4" />
                      {isProcessing ? t.removing : t.remove}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <label className="text-sm font-semibold staff-text-primary flex items-center gap-2">
                <IconTrophy className="h-4 w-4 staff-text-primary" />
                {t.assignAward}
              </label>
              <div className="flex flex-wrap gap-2">
                {availableAwards.length > 0 ? (
                  availableAwards.map((award) => (
                    <button
                      key={award.awardId}
                      onClick={() => onAssign(painting, award)}
                      disabled={isProcessing}
                      className="px-3 py-1.5 text-sm bg-white hover:bg-gray-50 border border-[#e6e2da] staff-text-primary rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {award.name} ({award.paintings.length}/{award.quantity})
                    </button>
                  ))
                ) : (
                  <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 border border-[#e6e2da] text-gray-500 rounded-lg">
                    <IconTrophy className="h-4 w-4" />
                    <span className="text-sm">{t.noAwardsAvailable}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AwardsManagementSuspense() {
  return (
    <Suspense>
      <AwardsManagementPage />
    </Suspense>
  );
}

function AwardsManagementPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const contestId = searchParams.get("id") as string;

  const [currentPaintingId, setCurrentPaintingId] = useState<string>("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [expandedAwards, setExpandedAwards] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<"top-paintings" | "vote-results">(
    "top-paintings"
  );

  const { currentLanguage } = useLanguageStore();
  const t = useTranslation(currentLanguage);

  const { data: contestData } = useQuery({
    queryKey: ["staff-contest", contestId],
    queryFn: () => getStaffContestById(Number(contestId)),
    enabled: !!contestId,
    staleTime: 2 * 60 * 1000,
  });

  const announceWinner = useAnnounceWinners();

  // Top paintings query (for top-paintings tab)
  const { data: topPaintingsData, isLoading: isLoadingTopPaintings } =
    useGetRound2TopByContestId(contestId);

  // Awards query
  const { data: awardsData } = useGetAwardsByContestId(contestId);

  // Voted awards query (for vote-results tab)
  const { data: votedAwardsData, isLoading: isLoadingVotedAwards } =
    getVotedAward(contestId);

  // Voted paintings queries (for vote-results tab) - create all queries but only enable when needed
  const votedPaintingsQueries = useQueries({
    queries:
      votedAwardsData?.data.awards?.map((award: any) => ({
        queryKey: ["votes", contestId, award.awardId],
        queryFn: async () => {
          return getVotedPaintings({
            contestId: contestId,
            awardId: award.awardId,
          });
        },
        enabled: !!contestId && !!award.awardId,
      })) || [],
  });

  const awards = awardsData?.data || [];
  const contest = contestData?.data as Contest;

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

  const handleSendEmailAnnouncement = async () => {
    if (!contest) {
      return;
    }
    setIsSendingEmail(true);
    const winnerEmails = awards.flatMap((a) =>
      a.paintings.map((p) => p.competitorEmail)
    );
    announceWinner.mutate(
      {
        contestName: contest.title,
        winnerEmails: winnerEmails,
      },
      {
        onSuccess: () => {
          // Show success message
          toast.success("Email announcement sent successfully");
          setIsSendingEmail(false);
        },
        onError: (error) => {
          let message = error.message;
          if (error instanceof AxiosError) {
            message = error.response?.data.message;
          }
          toast.error(message);
          setIsSendingEmail(false);
        },
      }
    );
  };

  const getAvailableAwards = (): Award[] => {
    return awards.filter(
      (award) => award.paintings.length < award.quantity && award.rank <= 3
    );
  };

  const totalAwardSlots = awards.reduce(
    (sum, award) => sum + award.quantity,
    0
  );
  const assignedSlots = awards.reduce(
    (sum, award) => sum + award.paintings.length,
    0
  );

  // Check if all award slots are filled (not all paintings awarded)
  const allAwardSlotsFilled =
    totalAwardSlots > 0 && assignedSlots >= totalAwardSlots;

  const toggleAwardExpansion = (awardId: string) => {
    const newExpanded = new Set(expandedAwards);
    if (newExpanded.has(awardId)) {
      newExpanded.delete(awardId);
    } else {
      newExpanded.add(awardId);
    }
    setExpandedAwards(newExpanded);
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
        <SiteHeader title={`${contest?.title || "Contest"} - Awards`} />
        <div className="flex flex-1 flex-col">
          <div className="px-4 lg:px-6 py-2 border-b border-[#e6e2da] bg-white">
            <Breadcrumb
              items={[
                {
                  label: t.contestManagement,
                  href: "/dashboard/staff/contests",
                },
                {
                  label: contest?.title || "Contest Detail",
                  href: `/dashboard/staff/contests/detail?id=${contestId}`,
                },
                { label: t.awardsBreadcrumb },
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
                    <h2 className="text-xl font-bold staff-text-primary">
                      {t.awardAssignment} - {contest?.title || "Contest"}
                    </h2>
                    <p className="text-sm staff-text-secondary mt-1">
                      Assign awards to voted paintings • {assignedSlots} /{" "}
                      {totalAwardSlots} {t.slotsFilled}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() =>
                      router.push(
                        `/dashboard/staff/contests/awards/manage?id=${contestId}`
                      )
                    }
                    className="staff-btn-outline flex items-center justify-center px-4 py-2"
                  >
                    <IconTrophy className="h-4 w-4" />
                    <span className="ml-2">{t.manageAwards}</span>
                  </button>
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        router.push(
                          `/dashboard/staff/contests/awards/announce?id=${contestId}`
                        )
                      }
                      disabled={!allAwardSlotsFilled}
                      className="staff-btn-primary flex items-center justify-center px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      title={
                        !allAwardSlotsFilled
                          ? "All award slots must be filled before announcing results"
                          : t.announceContestResults
                      }
                    >
                      <IconSpeakerphone className="h-4 w-4" />
                      <span className="ml-2">{t.announceResults}</span>
                    </button>
                    <button
                      onClick={handleSendEmailAnnouncement}
                      disabled={!allAwardSlotsFilled || isSendingEmail}
                      className="staff-btn-secondary flex items-center justify-center px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      title={
                        !allAwardSlotsFilled
                          ? "All award slots must be filled before sending email"
                          : "Send email announcement to participants"
                      }
                    >
                      {isSendingEmail ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                          <span className="ml-2">{t.sendingEmail}</span>
                        </>
                      ) : (
                        <>
                          <IconMail className="h-4 w-4" />
                          <span className="ml-2">
                            {t.sendEmailAnnouncement}
                          </span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="border-b border-[#e6e2da]">
                <div className="flex space-x-8">
                  <button
                    onClick={() => setActiveTab("top-paintings")}
                    className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === "top-paintings"
                        ? "border-blue-600 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {t.topPaintingsTab}
                  </button>
                  <button
                    onClick={() => setActiveTab("vote-results")}
                    className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === "vote-results"
                        ? "border-blue-600 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {t.voteResultsTab}
                  </button>
                </div>
              </div>

              {/* Two Column Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Content based on active tab (2/3 width) */}
                <div className="lg:col-span-2 space-y-4">
                  {activeTab === "top-paintings" ? (
                    /* Top Paintings Tab */
                    <div className="space-y-4">
                      {isLoadingTopPaintings ? (
                        <div className="text-center py-8 staff-text-secondary">
                          {t.loadingTopPaintings}
                        </div>
                      ) : (topPaintingsData?.data?.length ?? 0) > 0 ? (
                        (topPaintingsData?.data ?? []).map(
                          (painting, index) => (
                            <PaintingAwardRow
                              key={painting.paintingId}
                              painting={painting}
                              index={index}
                              availableAwards={getAvailableAwards()}
                              onAssign={handleAssignAward}
                              onRemove={handleRemoveAward}
                              isProcessing={
                                currentPaintingId === painting.paintingId &&
                                (assignMutation.isPending ||
                                  removeMutation.isPending)
                              }
                              onImageClick={setSelectedImage}
                              t={t}
                            />
                          )
                        )
                      ) : (
                        <div className="text-center py-8 staff-text-secondary">
                          {t.noTopPaintingsFound}
                        </div>
                      )}
                    </div>
                  ) : (
                    /* Vote Results Tab */
                    <div className="space-y-4">
                      {isLoadingVotedAwards ? (
                        <div className="text-center py-8 staff-text-secondary">
                          {t.loadingVotedAwards}
                        </div>
                      ) : votedAwardsData &&
                        votedAwardsData.data.awards.length > 0 ? (
                        votedAwardsData?.data?.awards?.map(
                          (award, awardIndex) => {
                            const votedPaintingsQuery =
                              votedPaintingsQueries[awardIndex];
                            const votedPaintingsData = votedPaintingsQuery?.data
                              ?.data as VotedPaining | undefined;
                            const votedPaintings =
                              votedPaintingsData?.paintings || [];
                            const isExpanded = expandedAwards.has(
                              award.awardId
                            );
                            const isLoading = votedPaintingsQuery?.isLoading;

                            return (
                              <div
                                key={award.awardId}
                                className="staff-card p-6"
                              >
                                {/* Award Header */}
                                <div className="flex items-center justify-between mb-4">
                                  <div className="flex items-center gap-3">
                                    <div className="shrink-0 w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                                      <IconTrophy className="h-6 w-6 text-yellow-600" />
                                    </div>
                                    <div>
                                      <h3 className="text-lg font-bold staff-text-primary">
                                        {award.name}
                                      </h3>
                                      <div className="text-sm staff-text-secondary">
                                        {t.prizeLabel}{" "}
                                        {formatCurrency(
                                          parseFloat(award.prize)
                                        )}{" "}
                                        ₫ • {t.totalVotesLabel}{" "}
                                        {award.totalVotes}
                                      </div>
                                    </div>
                                  </div>
                                  <button
                                    onClick={() =>
                                      toggleAwardExpansion(award.awardId)
                                    }
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                  >
                                    {isExpanded ? (
                                      <IconChevronUp className="h-5 w-5 staff-text-secondary" />
                                    ) : (
                                      <IconChevronDown className="h-5 w-5 staff-text-secondary" />
                                    )}
                                  </button>
                                </div>

                                {/* Voted Paintings */}
                                {isExpanded && (
                                  <div className="space-y-3">
                                    {isLoading ? (
                                      <div className="text-center py-8 staff-text-secondary">
                                        {t.loadingVotedPaintings}
                                      </div>
                                    ) : votedPaintings.length > 0 ? (
                                      votedPaintings.map((painting) => {
                                        // Find corresponding prize award for assignment
                                        const prizeAward = awards.find(
                                          (a) => a.name === award.name
                                        );
                                        const isProcessing =
                                          prizeAward &&
                                          currentPaintingId ===
                                            painting.paintingId &&
                                          (assignMutation.isPending ||
                                            removeMutation.isPending);

                                        // Check if this painting is already assigned to the corresponding prize award
                                        const isAssignedToThisAward = prizeAward
                                          ? prizeAward.paintings.some(
                                              (assignedPainting) =>
                                                assignedPainting.paintingId ===
                                                painting.paintingId
                                            )
                                          : false;

                                        return (
                                          <div
                                            key={painting.paintingId}
                                            className="border border-[#e6e2da] rounded-lg p-4 hover:shadow-md transition-shadow"
                                          >
                                            <div className="flex gap-4">
                                              {/* Painting Image */}
                                              {painting.imageUrl && (
                                                <div
                                                  className="shrink-0 w-32 h-32 bg-gray-100 rounded-lg overflow-hidden border-2 border-[#e6e2da] shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                                                  onClick={() =>
                                                    setSelectedImage(
                                                      painting.imageUrl
                                                    )
                                                  }
                                                >
                                                  <img
                                                    src={painting.imageUrl}
                                                    alt={painting.title}
                                                    className="w-full h-full object-cover"
                                                  />
                                                </div>
                                              )}

                                              {/* Painting Info */}
                                              <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between">
                                                  <div className="flex-1 min-w-0">
                                                    <h4 className="font-bold staff-text-primary text-base mb-1">
                                                      {painting.title}
                                                    </h4>
                                                    <p className="text-sm staff-text-secondary mb-2">
                                                      {t.byArtist}{" "}
                                                      {painting.competitorName}
                                                    </p>
                                                    <div className="flex gap-4 text-xs staff-text-secondary mb-3">
                                                      <span>
                                                        {t.votesLabel}{" "}
                                                        {painting.voteCount}
                                                      </span>
                                                      <span>
                                                        {t.scoreLabel}{" "}
                                                        {painting.averageScore.toFixed(
                                                          2
                                                        )}
                                                      </span>
                                                    </div>
                                                  </div>

                                                  {/* Assignment Status */}
                                                  <div className="ml-4">
                                                    {isAssignedToThisAward ? (
                                                      <div className="flex items-center gap-2">
                                                        <div className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                                                          <IconTrophy className="h-4 w-4" />
                                                          {t.assignedStatus}
                                                        </div>
                                                        <button
                                                          onClick={() =>
                                                            handleRemoveAward(
                                                              painting as any
                                                            )
                                                          }
                                                          disabled={
                                                            isProcessing
                                                          }
                                                          className="shrink-0 ml-2 px-3 py-1.5 staff-btn-outline text-sm font-medium rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                                                          title={
                                                            t.removeAwardTitle
                                                          }
                                                        >
                                                          <IconX className="h-4 w-4" />
                                                          {isProcessing
                                                            ? t.removing
                                                            : t.remove}
                                                        </button>
                                                      </div>
                                                    ) : prizeAward &&
                                                      prizeAward.paintings
                                                        .length <
                                                        prizeAward.quantity ? (
                                                      <button
                                                        onClick={() =>
                                                          handleAssignAward(
                                                            painting as any,
                                                            prizeAward
                                                          )
                                                        }
                                                        disabled={isProcessing}
                                                        className="staff-btn-primary px-3 py-1.5 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                                      >
                                                        {isProcessing
                                                          ? t.assigningAwardStatus
                                                          : t.assignAwardButton}
                                                      </button>
                                                    ) : (
                                                      <div className="px-3 py-1.5 text-sm bg-gray-100 text-gray-500 rounded-lg">
                                                        {prizeAward
                                                          ? t.slotsFullStatus
                                                          : t.noMatchingAwardStatus}
                                                      </div>
                                                    )}
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        );
                                      })
                                    ) : (
                                      <div className="text-center py-8 staff-text-secondary">
                                        {t.noPaintingsVotedForAward}
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            );
                          }
                        )
                      ) : (
                        <div className="text-center py-8 staff-text-secondary">
                          {t.noVotedAwardsFound}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Right Column: Awards Summary (1/3 width) */}
                <div className="space-y-4">
                  {/* Awards Summary */}
                  <div className="staff-card p-4 sticky top-4">
                    <h3 className="text-lg font-semibold staff-text-primary mb-4">
                      {activeTab === "top-paintings"
                        ? t.topAwardsSummary
                        : t.votedAwardsSummary}
                    </h3>
                    <div className="space-y-3">
                      {activeTab === "top-paintings"
                        ? // Prize awards summary for top paintings tab
                          awards
                            .filter((award) => award.rank <= 3)
                            .map((award) => {
                              const isFull =
                                award.paintings.length >= award.quantity;

                              return (
                                <div
                                  key={award.awardId}
                                  className={`p-4 rounded-lg border-2 ${
                                    isFull
                                      ? "bg-green-50 border-green-300"
                                      : "bg-blue-50 border-blue-300"
                                  }`}
                                >
                                  <div className="flex items-start gap-3">
                                    <IconTrophy
                                      className={`h-6 w-6 mt-0.5 ${
                                        isFull
                                          ? "text-green-600"
                                          : "text-blue-600"
                                      }`}
                                    />
                                    <div className="flex-1 min-w-0">
                                      <div className="font-semibold text-sm mb-1">
                                        {award.name}
                                      </div>
                                      <div className="text-xs text-green-600 mb-2">
                                        {formatCurrency(
                                          parseFloat(award.prize)
                                        )}{" "}
                                        ₫
                                      </div>
                                      <div className="text-xs staff-text-secondary space-y-1">
                                        <div>
                                          {t.assignedLabel}{" "}
                                          {award.paintings.length}/
                                          {award.quantity}
                                        </div>
                                      </div>
                                      {isFull && (
                                        <div className="mt-2 px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
                                          {t.completeStatus}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              );
                            })
                        : // Voted awards summary for vote results tab
                          votedAwardsData?.data.awards?.map((award) => {
                            const prizeAward = awards.find(
                              (a) => a.name === award.name
                            );
                            const isFull = prizeAward
                              ? prizeAward.paintings.length >=
                                prizeAward.quantity
                              : false;

                            return (
                              <div
                                key={award.awardId}
                                className={`p-4 rounded-lg border-2 ${
                                  isFull
                                    ? "bg-green-50 border-green-300"
                                    : "bg-blue-50 border-blue-300"
                                }`}
                              >
                                <div className="flex items-start gap-3">
                                  <IconTrophy
                                    className={`h-6 w-6 mt-0.5 ${
                                      isFull
                                        ? "text-green-600"
                                        : "text-blue-600"
                                    }`}
                                  />
                                  <div className="flex-1 min-w-0">
                                    <div className="font-semibold text-sm mb-1">
                                      {award.name}
                                    </div>
                                    <div className="text-xs text-green-600 mb-2">
                                      {formatCurrency(parseFloat(award.prize))}{" "}
                                      ₫
                                    </div>
                                    <div className="text-xs staff-text-secondary space-y-1">
                                      <div>
                                        {t.assignedLabel}{" "}
                                        {prizeAward
                                          ? prizeAward.paintings.length
                                          : 0}
                                        /
                                        {prizeAward
                                          ? prizeAward.quantity
                                          : award.quantity}
                                      </div>
                                      <div>
                                        {t.totalVotesLabel} {award.totalVotes}
                                      </div>
                                    </div>
                                    {isFull && (
                                      <div className="mt-2 px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
                                        {t.completeStatus}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                    </div>

                    {/* Overall Progress */}
                    <div className="mt-6 pt-4 border-t border-[#e6e2da]">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="staff-text-primary font-medium">
                          {t.overallProgress}
                        </span>
                        <span className="staff-text-secondary">
                          {assignedSlots}/{totalAwardSlots} {t.slotsFilled}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{
                            width:
                              totalAwardSlots > 0
                                ? `${(assignedSlots / totalAwardSlots) * 100}%`
                                : "0%",
                          }}
                        ></div>
                      </div>
                      {allAwardSlotsFilled && (
                        <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                          <div className="flex items-center gap-2 text-green-800 text-sm font-medium">
                            <IconTrophy className="h-4 w-4" />
                            {t.allAwardsAssignedReady}
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
      </SidebarInset>

      {/* Full Image Modal */}
      <Dialog
        open={!!selectedImage}
        onOpenChange={() => setSelectedImage(null)}
      >
        <DialogContent className="max-w-5xl w-full max-h-[90vh] p-0">
          <DialogTitle className="sr-only">Full Image View</DialogTitle>
          <div className="relative">
            {selectedImage && (
              <img
                src={selectedImage}
                alt="Full size painting"
                className="w-full h-auto max-h-[85vh] object-contain"
              />
            )}
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
              aria-label="Close"
            >
              <IconX className="h-5 w-5" />
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
}
