"use client";

import {
  useAssignAward,
  useGetAwardsByContestId,
  useRemoveAward,
} from "@/apis/award";
import { useAnnounceWinners } from "@/apis/email";
import { useGetRound2TopByContestId } from "@/apis/paintings";
import { getStaffContestById, getStaffContestExaminers } from "@/apis/staff";
import { getVotedAward, getVotedPaintings } from "@/apis/vote";
import { Breadcrumb } from "@/components/breadcrumb";
import { SiteHeader } from "@/components/site-header";
import { StaffSidebar } from "@/components/staff-sidebar";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Lang, useTranslation } from "@/lib/i18n";
import { formatCurrency } from "@/lib/utils";
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
import { useQueries, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { toast } from "sonner";

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
  const queryClient = useQueryClient();

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
      votedAwardsData?.data.awards?.map((award) => ({
        queryKey: ["votes", contestId, award.awardId],
        queryFn: async () => {
          return getVotedPaintings({
            contestId: contestId,
            awardId: award.awardId,
            accountId: "",
          });
        },
        enabled: !!contestId && !!award.awardId && award.totalVotes > 0,
      })) || [],
  });

  const awards = awardsData?.data || [];
  const contest = contestData?.data as Contest;

  // Fetch examiners to check evaluation status
  const { data: examinersData } = useQuery({
    queryKey: ["contest-examiners", contestId],
    queryFn: () => getStaffContestExaminers(Number(contestId)),
    enabled: !!contestId,
  });

  const isRound2Completed = (() => {
    if (!examinersData?.data) return true;
    const round2Examiners = examinersData.data.filter((e: any) => e.role === "ROUND_2");
    if (round2Examiners.length === 0) return true;
    return round2Examiners.every((e: any) => e.evaluatedCount === e.totalCount && e.totalCount > 0);
  })();

  const assignMutation = useAssignAward();
  const removeMutation = useRemoveAward();

  // Helper function to compare paintings for ranking
  const comparePaintings = (
    a: VotedPaining["paintings"][0],
    b: VotedPaining["paintings"][0]
  ) => {
    // First compare by vote count (descending)
    if (a.voteCount !== b.voteCount) {
      return b.voteCount - a.voteCount;
    }

    // If vote counts are equal, compare by criteria in order
    if (a.avgScoreRound2 !== b.avgScoreRound2) {
      return b.avgScoreRound2 - a.avgScoreRound2;
    }
    if (a.avgCreativityScore !== b.avgCreativityScore) {
      return b.avgCreativityScore - a.avgCreativityScore;
    }
    if (a.avgCompositionScore !== b.avgCompositionScore) {
      return b.avgCompositionScore - a.avgCompositionScore;
    }
    if (a.avgColorScore !== b.avgColorScore) {
      return b.avgColorScore - a.avgColorScore;
    }
    if (a.avgTechnicalScore !== b.avgTechnicalScore) {
      return b.avgTechnicalScore - a.avgTechnicalScore;
    }
    if (a.avgAestheticScore !== b.avgAestheticScore) {
      return b.avgAestheticScore - a.avgAestheticScore;
    }

    // If all criteria are equal, maintain current order (stable sort)
    return 0;
  };

  const handleAssignAward = async (paintingId: string, award: Award) => {
    await assignMutation.mutateAsync({
      awardId: award.awardId,
      paintingId: paintingId,
    });
    // Invalidate awards query to update progress immediately
    queryClient.invalidateQueries({ queryKey: ["awards", contestId] });
  };

  const handleRemoveAward = async (paintingId: string) => {
    await removeMutation.mutateAsync(paintingId);
    // Invalidate awards query to update progress immediately
    queryClient.invalidateQueries({ queryKey: ["awards", contestId] });
  };

  const handleAssignAllAwards = async () => {
    if (!topPaintingsData?.data) return;

    // Get unassigned top paintings, sorted by table number
    const unassignedTopPaintings = topPaintingsData.data
      .filter((tableData) => {
        const topPainting = tableData.topPainting;
        return !awards.some((award) =>
          award.paintings.some((p) => p.paintingId === topPainting.paintingId)
        );
      })
      .sort((a, b) => parseInt(a.table) - parseInt(b.table))
      .map((tableData) => tableData.topPainting);

    // Get available awards, sorted by rank
    const availableAwards = awards
      .filter(
        (award) => award.rank <= 3 && award.paintings.length < award.quantity
      )
      .sort((a, b) => a.rank - b.rank);

    // Assign paintings to awards
    let paintingIndex = 0;
    for (const award of availableAwards) {
      const slotsAvailable = award.quantity - award.paintings.length;
      for (
        let i = 0;
        i < slotsAvailable && paintingIndex < unassignedTopPaintings.length;
        i++
      ) {
        await handleAssignAward(
          unassignedTopPaintings[paintingIndex].paintingId,
          award
        );
        paintingIndex++;
      }
    }
  };

  const handleRemoveAllAwards = async () => {
    // Get all assigned paintings
    const assignedPaintings = awards.flatMap((award) =>
      award.paintings.map((p) => p.paintingId)
    );

    // Remove awards from all assigned paintings
    for (const paintingId of assignedPaintings) {
      await handleRemoveAward(paintingId);
    }
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
          toast.success("Gửi thông báo qua email thành công!");
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

  // Check if there are unassigned top paintings
  const hasUnassignedTopPaintings =
    topPaintingsData?.data?.some((tableData) => {
      const topPainting = tableData.topPainting;
      return !awards.some((award) =>
        award.paintings.some((p) => p.paintingId === topPainting.paintingId)
      );
    }) ?? false;

  // Check if there are any assigned awards
  const hasAssignedAwards = awards.some((award) => award.paintings.length > 0);

  // Check if all award slots are filled (not all paintings awarded)
  const allAwardSlotsFilled =
    totalAwardSlots > 0 && assignedSlots >= totalAwardSlots;

  // Check if there are any mismatches in vote results tab
  const hasVoteResultMismatches =
    votedAwardsData?.data.awards?.some((award, awardIndex) => {
      const votedPaintingsQuery = votedPaintingsQueries[awardIndex];
      const votedPaintingsData = votedPaintingsQuery?.data?.data as
        | VotedPaining
        | undefined;
      const votedPaintings = votedPaintingsData?.paintings || [];

      // Find corresponding prize award for assignment
      const prizeAward = awards.find((a) => a.awardId === award.awardId);

      // Get the top voted painting
      const topVotedPainting =
        votedPaintings.length > 0
          ? votedPaintings.reduce((prev, current) =>
              comparePaintings(prev, current) <= 0 ? prev : current
            )
          : null;

      // Get currently assigned painting for this award
      const currentlyAssignedPainting = prizeAward?.paintings?.[0];

      // Check for mismatch
      return (
        (currentlyAssignedPainting &&
          topVotedPainting &&
          currentlyAssignedPainting.paintingId !==
            topVotedPainting.paintingId) ||
        (currentlyAssignedPainting && award.totalVotes === 0)
      );
    }) || false;

  // Count the number of mismatches
  const mismatchCount =
    votedAwardsData?.data.awards?.reduce((count, award, awardIndex) => {
      const votedPaintingsQuery = votedPaintingsQueries[awardIndex];
      const votedPaintingsData = votedPaintingsQuery?.data?.data as
        | VotedPaining
        | undefined;
      const votedPaintings = votedPaintingsData?.paintings || [];

      // Find corresponding prize award for assignment
      const prizeAward = awards.find((a) => a.awardId === award.awardId);

      // Get the top voted painting
      const topVotedPainting =
        votedPaintings.length > 0
          ? votedPaintings.reduce((prev, current) =>
              comparePaintings(prev, current) <= 0 ? prev : current
            )
          : null;

      // Get currently assigned painting for this award
      const currentlyAssignedPainting = prizeAward?.paintings?.[0];

      // Check for mismatch
      const hasMismatch =
        (currentlyAssignedPainting &&
          topVotedPainting &&
          currentlyAssignedPainting.paintingId !==
            topVotedPainting.paintingId) ||
        (currentlyAssignedPainting && award.totalVotes === 0);
      return hasMismatch ? count + 1 : count;
    }, 0) || 0;

  // Check if there are any awards with no votes
  const hasAwardsWithNoVotes =
    votedAwardsData?.data.awards?.some((award) => award.totalVotes === 0) ||
    false;

  const parseContestEndDate = (value?: string) => {
    if (!value) return null;
    const trimmed = value.trim();
    let parsed = new Date(trimmed);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed;
    }
    const match = trimmed.match(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/);
    if (!match) return null;
    const [, day, month, year] = match;
    parsed = new Date(Number(year), Number(month) - 1, Number(day));
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  };

  const contestEndDate = parseContestEndDate(contest?.endDate);
  const contestEndTimestamp = contestEndDate
    ? new Date(
        contestEndDate.getFullYear(),
        contestEndDate.getMonth(),
        contestEndDate.getDate(),
        23,
        59,
        59,
        999
      ).getTime()
    : null;
  const isContestEnded = contestEndTimestamp
    ? contestEndTimestamp <= Date.now()
    : false;

  const topAwards = awards.filter((award) => award.rank <= 3);
  const votedAwardsList = awards.filter((award) => award.rank > 3 || !award.rank);

  const topTotalSlots = topAwards.reduce((acc, curr) => acc + curr.quantity, 0);
  const topAssignedSlots = topAwards.reduce((acc, curr) => acc + curr.paintings.length, 0);
  const isTopAwardsFullyAssigned = topTotalSlots > 0 && topAssignedSlots >= topTotalSlots;

  const voteTotalSlots = votedAwardsList.reduce((acc, curr) => acc + curr.quantity, 0);
  const voteAssignedSlots = votedAwardsList.reduce((acc, curr) => acc + curr.paintings.length, 0);
  const isVoteAwardsFullyAssigned = voteTotalSlots > 0 && voteAssignedSlots >= voteTotalSlots;

  // Button disable states
  const isTopAnnounceDisabled = !isTopAwardsFullyAssigned;
  const isVoteAnnounceDisabled = !isVoteAwardsFullyAssigned;

  const isEmailDisabled =
    !allAwardSlotsFilled ||
    hasVoteResultMismatches ||
    isSendingEmail ||
    hasAwardsWithNoVotes;

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
        <SiteHeader title={`${contest?.title || "Contest"}`} />
        <div className="flex flex-1 flex-col">
          <div className="staff-page-header">
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
                      {assignedSlots} / {totalAwardSlots} {t.slotsFilled}
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
                  {/* <div className="flex gap-2">
                    <button
                      onClick={handleSendEmailAnnouncement}
                      disabled={isEmailDisabled}
                      className="staff-btn-secondary flex items-center justify-center px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      title={
                        hasAwardsWithNoVotes
                          ? "Cannot send email when awards have no votes"
                          : !allAwardSlotsFilled
                          ? "All award slots must be filled before sending email"
                          : hasVoteResultMismatches
                          ? t.allAwardSlotsMustBeFilledEmailMismatchTooltip
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
                  </div> */}
                </div>
              </div>

              {/* Tabs */}
              <div className="border-b border-[var(--staff-border)]">
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
                        (topPaintingsData?.data ?? []).map((tableData) => {
                          const isExpanded = expandedAwards.has(
                            tableData.table
                          );
                          const topPainting = tableData.topPainting;
                          const assignedAward = awards.find((award) =>
                            award.paintings.some(
                              (p) => p.paintingId === topPainting.paintingId
                            )
                          );
                          const assignedAwardInTable = awards.find((award) =>
                            award.paintings.some((p) =>
                              tableData.paintings.some(
                                (tablePainting) =>
                                  tablePainting.paintingId === p.paintingId
                              )
                            )
                          );
                          const headerAward =
                            assignedAward ?? assignedAwardInTable ?? null;
                          const headerAwardLabel = headerAward
                            ? headerAward.name
                            : t.unassigned;

                          return (
                            <div
                              key={tableData.table}
                              className="staff-card p-6"
                            >
                              {/* Table Header - Shows Top Painting */}
                              <div
                                className={`border border-blue-200 p-4 mb-4 transition-all duration-300 ${
                                  isExpanded
                                    ? "bg-linear-to-r from-blue-50 to-indigo-50 shadow-lg ring-1 ring-blue-200/50"
                                    : "bg-linear-to-r from-blue-50 to-indigo-50 hover:shadow-md"
                                }`}
                              >
                                <div className="flex items-center gap-4">
                                  <div className="shrink-0">
                                    <div
                                      className={`w-14 h-14 flex rounded-full items-center justify-center shadow-sm transition-all duration-300 ${
                                        isExpanded
                                          ? "bg-blue-200 scale-110"
                                          : "bg-blue-100"
                                      }`}
                                    >
                                      <IconTrophy
                                        className={`h-8 w-8 text-blue-600 transition-transform duration-300 ${
                                          isExpanded ? "scale-110" : ""
                                        }`}
                                      />
                                    </div>
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                      <h3 className="text-xl font-bold text-blue-900">
                                        {t.table} {tableData.table}
                                      </h3>
                                      <div className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-semibold">
                                        {t.topPaintings}
                                      </div>
                                    </div>
                                    <div className="text-sm text-gray-700 mb-1">
                                      <span className="font-semibold">
                                        &ldquo;{topPainting.title}
                                        &rdquo;
                                      </span>
                                    </div>
                                    <div className="text-sm text-gray-600">
                                      {t.byArtist}: {topPainting.competitorName}
                                    </div>
                                    <div className="text-sm text-gray-600">
                                      {t.scoreLabel}:{" "}
                                      {topPainting.avgScoreRound2}
                                    </div>
                                  </div>

                                  {/* Top Painting Preview */}
                                  {topPainting.imageUrl && (
                                    <div
                                      className="shrink-0 w-24 h-24 bg-gray-100 overflow-hidden border border-blue-300 shadow-md cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105"
                                      onClick={() =>
                                        setSelectedImage(topPainting.imageUrl)
                                      }
                                    >
                                      <img
                                        src={topPainting.imageUrl}
                                        alt={topPainting.title}
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                  )}

                                  {/* Award Status - Table Header */}
                                  <div className="shrink-0 flex flex-col items-end gap-3">
                                    {headerAward ? (
                                      <div className="flex flex-col items-center gap-2">
                                        <div className="flex flex-col items-center gap-1">
                                          <div className="flex items-center gap-2 px-3 py-2 bg-green-100 text-green-800 text-sm font-medium rounded-sm">
                                            <IconTrophy className="h-4 w-4" />
                                            {headerAwardLabel}
                                          </div>
                                          <div className="text-xs text-green-600">
                                            {(() => {
                                              const prizeValue = parseFloat(
                                                headerAward.prize
                                              );
                                              return isNaN(prizeValue)
                                                ? "Invalid prize"
                                                : formatCurrency(prizeValue);
                                            })()}
                                          </div>
                                        </div>
                                      </div>
                                    ) : (
                                      <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-600 text-sm font-medium rounded-sm">
                                        <IconTrophy className="h-4 w-4" />
                                        {headerAwardLabel}
                                      </div>
                                    )}
                                  </div>

                                  <button
                                    onClick={() =>
                                      toggleAwardExpansion(tableData.table)
                                    }
                                    className={`shrink-0 p-3 transition-all duration-300 border ${
                                      isExpanded
                                        ? "bg-blue-100 border-blue-300 hover:bg-blue-200 shadow-md"
                                        : "hover:bg-blue-100 border-blue-200"
                                    }`}
                                  >
                                    <IconChevronDown
                                      className={`h-5 w-5 text-blue-600 transition-transform duration-300 ${
                                        isExpanded ? "rotate-180" : ""
                                      }`}
                                    />
                                  </button>
                                </div>
                              </div>

                              {/* Table Paintings - View Only */}
                              <div
                                className={`transition-all duration-500 ease-in-out ${
                                  isExpanded
                                    ? "opacity-100"
                                    : "opacity-0 h-0 overflow-hidden"
                                }`}
                              >
                                <div className="space-y-3 pt-4 border-t border-blue-200/50">
                                  {tableData.paintings.map(
                                    (painting, index) => (
                                      <div
                                        key={painting.paintingId}
                                        className={`border border-[var(--staff-border)] p-4 hover:shadow-md transition-all duration-300 hover:border-blue-300 hover:bg-blue-50/30 rounded-sm ${
                                          isExpanded
                                            ? `animate-slide-in-up`
                                            : ""
                                        }`}
                                        style={{
                                          animationDelay: `${index * 50}ms`,
                                        }}
                                      >
                                        {/* Award Status Indicator */}
                                        <div className="flex items-center justify-between mb-3">
                                          <div className="flex items-center gap-2">
                                            <div className="flex items-center justify-center w-8 h-8 bg-gray-100 text-gray-600 font-bold text-sm">
                                              #{index + 1}
                                            </div>
                                            {(() => {
                                              const assignedAward = awards.find(
                                                (award) =>
                                                  award.paintings.some(
                                                    (assignedPainting) =>
                                                      assignedPainting.paintingId ===
                                                      painting.paintingId
                                                  )
                                              );
                                              return assignedAward ? (
                                                <div className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 text-xs font-medium">
                                                  <IconTrophy className="h-3 w-3" />
                                                  {t.awarded}
                                                </div>
                                              ) : (
                                                <div className="flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium">
                                                  <IconTrophy className="h-3 w-3" />
                                                  {t.unassigned}
                                                </div>
                                              );
                                            })()}
                                          </div>
                                        </div>

                                        <div className="flex gap-4">
                                          {/* Painting Image - Left side with click to view full */}
                                          {painting.imageUrl && (
                                            <div
                                              className="shrink-0 w-40 h-40 bg-gray-100 overflow-hidden border-2 border-[var(--staff-border)] shadow-sm cursor-pointer hover:shadow-md transition-shadow"
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
                                            <h4 className="font-bold staff-text-primary text-base mb-1">
                                              {painting.title}
                                            </h4>
                                            <p className="text-sm staff-text-secondary mb-2">
                                              {t.byArtist}{" "}
                                              {painting.competitorName}
                                            </p>
                                            <div className="flex gap-4 text-xs staff-text-secondary mb-4">
                                              <span>
                                                {t.scoreLabel}{" "}
                                                {painting.avgScoreRound2.toFixed(
                                                  2
                                                )}
                                              </span>
                                              <span>
                                                {t.evaluationsLabel}{" "}
                                                {painting.evaluationCount}
                                              </span>
                                            </div>

                                            {/* Detailed Score Breakdown */}
                                            <div className="bg-gray-50 border border-[var(--staff-border)] rounded-sm p-3 mb-4">
                                              <div className="text-xs font-semibold staff-text-primary mb-2">
                                                {t.scoreBreakdown}:
                                              </div>
                                              <div className="grid grid-cols-2 gap-2 text-xs">
                                                <div className="flex justify-between">
                                                  <span className="staff-text-secondary">
                                                    {t.creativity}:
                                                  </span>
                                                  <span className="font-medium">
                                                    {painting.avgCreativityScore.toFixed(
                                                      2
                                                    )}
                                                  </span>
                                                </div>
                                                <div className="flex justify-between">
                                                  <span className="staff-text-secondary">
                                                    {t.composition}:
                                                  </span>
                                                  <span className="font-medium">
                                                    {painting.avgCompositionScore.toFixed(
                                                      2
                                                    )}
                                                  </span>
                                                </div>
                                                <div className="flex justify-between">
                                                  <span className="staff-text-secondary">
                                                    {t.color}:
                                                  </span>
                                                  <span className="font-medium">
                                                    {painting.avgColorScore.toFixed(
                                                      2
                                                    )}
                                                  </span>
                                                </div>
                                                <div className="flex justify-between">
                                                  <span className="staff-text-secondary">
                                                    {t.technical}:
                                                  </span>
                                                  <span className="font-medium">
                                                    {painting.avgTechnicalScore.toFixed(
                                                      2
                                                    )}
                                                  </span>
                                                </div>
                                                <div className="flex justify-between">
                                                  <span className="staff-text-secondary">
                                                    {t.aesthetic}:
                                                  </span>
                                                  <span className="font-medium">
                                                    {painting.avgAestheticScore.toFixed(
                                                      2
                                                    )}
                                                  </span>
                                                </div>
                                                <div className="flex justify-between">
                                                  <span className="staff-text-secondary font-semibold">
                                                    Total:
                                                  </span>
                                                  <span className="font-bold text-blue-600">
                                                    {painting.avgScoreRound2.toFixed(
                                                      2
                                                    )}
                                                  </span>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    )
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })
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

                            // Find corresponding prize award for assignment
                            const prizeAward = awards.find(
                              (a) => a.awardId === award.awardId
                            );

                            // Get the top voted painting
                            const topVotedPainting =
                              votedPaintings.length > 0
                                ? votedPaintings.reduce((prev, current) =>
                                    comparePaintings(prev, current) <= 0
                                      ? prev
                                      : current
                                  )
                                : null;

                            // Get currently assigned painting for this award
                            const currentlyAssignedPainting =
                              prizeAward?.paintings?.[0];

                            // Get vote count for currently assigned painting
                            const currentlyAssignedVoteCount =
                              currentlyAssignedPainting
                                ? votedPaintings.find(
                                    (p) =>
                                      p.paintingId ===
                                      currentlyAssignedPainting.paintingId
                                  )?.voteCount || 0
                                : 0;

                            return (
                              <div
                                key={award.awardId}
                                className="staff-card p-4"
                              >
                                {/* Award Header */}
                                <div
                                  className={`border border-yellow-200 p-3 mb-3 transition-all duration-300 ${
                                    isExpanded
                                      ? "bg-linear-to-r from-yellow-50 to-amber-50 shadow-lg ring-1 ring-yellow-200/50"
                                      : "bg-linear-to-r from-yellow-50 to-amber-50 hover:shadow-md"
                                  }`}
                                >
                                  <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                                    {/* Left side - Trophy, Name, Prize */}
                                    <div className="flex min-w-0 flex-1 items-start gap-3">
                                      <div className="shrink-0">
                                        <div
                                          className={`flex h-12 w-12 items-center justify-center rounded-full shadow-sm transition-all duration-300 ${
                                            isExpanded
                                              ? "bg-yellow-200 scale-110"
                                              : "bg-yellow-100"
                                          }`}
                                        >
                                          <IconTrophy
                                            className={`h-6 w-6 text-yellow-600 transition-transform duration-300 ${
                                              isExpanded ? "scale-110" : ""
                                            }`}
                                          />
                                        </div>
                                      </div>
                                      <div className="min-w-0 flex-1">
                                        <div className="flex flex-wrap items-center gap-2">
                                          <h3 className="min-w-0 text-lg leading-tight font-bold text-yellow-900 break-words">
                                            {award.name}
                                          </h3>
                                          {currentlyAssignedPainting && (
                                            <div className="shrink-0 whitespace-nowrap rounded-sm border border-green-300 bg-green-100 px-2 py-1 text-xs font-semibold text-green-800">
                                              {t.assignedStatus}
                                            </div>
                                          )}
                                          <div className="shrink-0 whitespace-nowrap bg-yellow-100 px-2 py-1 text-sm font-semibold text-yellow-800">
                                            {(() => {
                                              const prizeValue = parseFloat(
                                                award.prize
                                              );
                                              return isNaN(prizeValue)
                                                ? "Invalid prize"
                                                : formatCurrency(prizeValue);
                                            })()}
                                          </div>
                                          <div className="shrink-0 whitespace-nowrap bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
                                            {t.totalVotesLabel}{" "}
                                            {award.totalVotes}
                                          </div>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Right side - Assign action and status */}
                                    <div className="flex items-center justify-end gap-2 lg:ml-4 lg:gap-3">
                                      {currentlyAssignedPainting ? (
                                        <div className="flex flex-wrap items-center justify-end gap-2">
                                          <button
                                            onClick={() =>
                                              handleRemoveAward(
                                                currentlyAssignedPainting.paintingId
                                              )
                                            }
                                            disabled={
                                              assignMutation.isPending ||
                                              removeMutation.isPending
                                            }
                                            className="flex items-center gap-1 rounded-sm px-2 py-1 text-xs font-medium staff-btn-outline transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                                            title={t.removeAwardTitle}
                                          >
                                            <IconX className="h-3 w-3" />
                                            {t.remove}
                                          </button>
                                        </div>
                                      ) : (
                                        <div className="flex flex-wrap items-center justify-end gap-2">
                                          <label className="whitespace-nowrap text-sm font-semibold staff-text-primary">
                                            {t.assignAward}
                                          </label>
                                          <div className="flex flex-wrap justify-end gap-2">
                                            {(() => {
                                              const isAlreadyAssigned =
                                                prizeAward
                                                  ? prizeAward.paintings.some(
                                                      (p) =>
                                                        p.paintingId ===
                                                        topVotedPainting!
                                                          .paintingId
                                                    )
                                                  : false;
                                              return prizeAward &&
                                                prizeAward.paintings.length <
                                                  prizeAward.quantity &&
                                                !isAlreadyAssigned &&
                                                award.totalVotes > 0 ? (
                                                <button
                                                  onClick={() =>
                                                    handleAssignAward(
                                                      topVotedPainting!
                                                        .paintingId,
                                                      prizeAward
                                                    )
                                                  }
                                                  disabled={
                                                    assignMutation.isPending ||
                                                    removeMutation.isPending ||
                                                    !isContestEnded
                                                  }
                                                  title={
                                                    !isContestEnded
                                                      ? "Contest must end before awarding"
                                                      : undefined
                                                  }
                                                  className="rounded-sm border border-[var(--staff-border)] bg-white px-3 py-1.5 text-sm whitespace-nowrap staff-text-primary transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                                                >
                                                  {award.totalVotes > 0 &&
                                                  topVotedPainting
                                                    ? `${t.assignToTopVoted}`
                                                    : `Assign Painting (${prizeAward.paintings.length}/${prizeAward.quantity})`}
                                                </button>
                                              ) : award.totalVotes === 0 ? (
                                                <button
                                                  disabled
                                                  className="cursor-not-allowed rounded-sm border border-[var(--staff-border)] bg-gray-50 px-3 py-1.5 text-sm whitespace-nowrap text-gray-500"
                                                >
                                                  {t.noVotesYet}
                                                </button>
                                              ) : isAlreadyAssigned ? (
                                                <div className="flex items-center gap-2 rounded-sm border border-green-300 bg-green-100 px-3 py-1.5 text-sm whitespace-nowrap text-green-800">
                                                  <IconTrophy className="h-4 w-4" />
                                                  {t.assignedStatus}
                                                </div>
                                              ) : (
                                                <div className="flex items-center gap-2 rounded-sm border border-[var(--staff-border)] bg-gray-50 px-3 py-1.5 text-sm whitespace-nowrap text-gray-500">
                                                  <IconTrophy className="h-4 w-4" />
                                                  {t.awardSlotsFull}
                                                </div>
                                              );
                                            })()}
                                          </div>
                                        </div>
                                      )}

                                      <button
                                        onClick={() =>
                                          toggleAwardExpansion(award.awardId)
                                        }
                                        className={`shrink-0 border p-2 transition-all duration-300 ${
                                          isExpanded
                                            ? "bg-yellow-100 border-yellow-300 hover:bg-yellow-200 shadow-md"
                                            : "hover:bg-yellow-100 border-yellow-200"
                                        }`}
                                      >
                                        <IconChevronDown
                                          className={`h-4 w-4 text-yellow-600 transition-transform duration-300 ${
                                            isExpanded ? "rotate-180" : ""
                                          }`}
                                        />
                                      </button>
                                    </div>
                                  </div>

                                  {/* Painting Comparison at Bottom */}
                                  {award.totalVotes > 0 &&
                                  currentlyAssignedPainting &&
                                  topVotedPainting &&
                                  currentlyAssignedPainting.paintingId !==
                                    topVotedPainting.paintingId ? (
                                    <div className="mt-3 pt-3 border-t border-yellow-200/50">
                                      <div className="flex gap-2">
                                        {/* Currently Assigned Painting */}
                                        <div className="flex-1 flex flex-col items-center gap-1">
                                          <div className="text-xs font-semibold text-red-600">
                                            {t.currentlyAssigned}
                                          </div>
                                          {currentlyAssignedPainting.imageUrl ? (
                                            <div
                                              className="w-full aspect-4/3 bg-gray-100 overflow-hidden border-2 border-red-300 shadow-md cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 relative group"
                                              onClick={() =>
                                                setSelectedImage(
                                                  currentlyAssignedPainting.imageUrl
                                                )
                                              }
                                            >
                                              <img
                                                src={
                                                  currentlyAssignedPainting.imageUrl
                                                }
                                                alt={
                                                  currentlyAssignedPainting.title
                                                }
                                                className="w-full h-full object-cover"
                                              />
                                              <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/70 to-transparent p-3">
                                                <div className="text-white">
                                                  <div className="font-semibold text-sm mb-1 line-clamp-2">
                                                    {
                                                      currentlyAssignedPainting.title
                                                    }
                                                  </div>
                                                  <div className="text-xs opacity-90 mb-1">
                                                    {t.byArtist}{" "}
                                                    {
                                                      currentlyAssignedPainting.competitorName
                                                    }
                                                  </div>
                                                  <div className="text-xs opacity-75">
                                                    {t.averageScoreLabel}{" "}
                                                    {currentlyAssignedPainting.averageScore?.toFixed(
                                                      2
                                                    ) || "N/A"}
                                                  </div>
                                                  <div className="text-xs opacity-75">
                                                    {t.votesLabel}{" "}
                                                    {currentlyAssignedVoteCount}
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          ) : (
                                            <div className="w-full aspect-4/3 bg-gray-100 border-2 border-red-300 shadow-md flex flex-col items-center justify-center p-4">
                                              <div className="text-center">
                                                <div className="font-semibold text-sm text-gray-800 mb-1">
                                                  {
                                                    currentlyAssignedPainting.title
                                                  }
                                                </div>
                                                <div className="text-xs text-gray-600 mb-1">
                                                  {t.byArtist}{" "}
                                                  {
                                                    currentlyAssignedPainting.competitorName
                                                  }
                                                </div>
                                                <div className="text-xs text-gray-500 mb-2">
                                                  {t.averageScoreLabel}{" "}
                                                  {currentlyAssignedPainting.averageScore?.toFixed(
                                                    2
                                                  ) || "N/A"}
                                                </div>
                                                <div className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-sm">
                                                  {currentlyAssignedVoteCount}{" "}
                                                  {t.votesLabel.toLowerCase()}
                                                </div>
                                              </div>
                                            </div>
                                          )}
                                        </div>
                                        {/* Top Voted Painting */}
                                        <div className="flex-1 flex flex-col items-center gap-1">
                                          <div className="text-xs font-semibold text-green-600">
                                            {t.topVoted}
                                          </div>
                                          {topVotedPainting.imageUrl ? (
                                            <div
                                              className="w-full aspect-4/3 bg-gray-100 overflow-hidden border-2 border-green-300 shadow-md cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 relative group"
                                              onClick={() =>
                                                setSelectedImage(
                                                  topVotedPainting.imageUrl
                                                )
                                              }
                                            >
                                              <img
                                                src={topVotedPainting.imageUrl}
                                                alt={topVotedPainting.title}
                                                className="w-full h-full object-cover"
                                              />
                                              <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/70 to-transparent p-3">
                                                <div className="text-white">
                                                  <div className="font-semibold text-sm mb-1 line-clamp-2">
                                                    {topVotedPainting.title}
                                                  </div>
                                                  <div className="text-xs opacity-90 mb-1">
                                                    {t.byArtist}{" "}
                                                    {
                                                      topVotedPainting.competitorName
                                                    }
                                                  </div>
                                                  <div className="text-xs opacity-75">
                                                    {t.averageScoreLabel}{" "}
                                                    {topVotedPainting.avgScoreRound2?.toFixed(
                                                      2
                                                    ) || "N/A"}
                                                  </div>
                                                  <div className="text-xs opacity-75">
                                                    {t.votesLabel}{" "}
                                                    {topVotedPainting.voteCount}
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          ) : (
                                            <div className="w-full aspect-4/3 bg-gray-100 border-2 border-green-300 shadow-md flex flex-col items-center justify-center p-4">
                                              <div className="text-center">
                                                <div className="font-semibold text-sm text-gray-800 mb-1">
                                                  {topVotedPainting.title}
                                                </div>
                                                <div className="text-xs text-gray-600 mb-1">
                                                  {t.byArtist}{" "}
                                                  {
                                                    topVotedPainting.competitorName
                                                  }
                                                </div>
                                                <div className="text-xs text-gray-500 mb-2">
                                                  {t.averageScoreLabel}{" "}
                                                  {topVotedPainting.avgScoreRound2?.toFixed(
                                                    2
                                                  ) || "N/A"}
                                                </div>
                                                <div className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-sm">
                                                  {t.votesLabel.toLowerCase()}
                                                  {
                                                    topVotedPainting.voteCount
                                                  }{" "}
                                                </div>
                                              </div>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  ) : // Show top voted painting preview when matched or no assignment
                                  award.totalVotes > 0 &&
                                    topVotedPainting?.imageUrl ? (
                                    <div className="mt-3 pt-3 border-t border-yellow-200/50">
                                      <div
                                        className="w-full aspect-video bg-gray-100 overflow-hidden border border-yellow-300 shadow-md cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 relative group"
                                        onClick={() =>
                                          setSelectedImage(
                                            topVotedPainting.imageUrl
                                          )
                                        }
                                      >
                                        <img
                                          src={topVotedPainting.imageUrl}
                                          alt={topVotedPainting.title}
                                          className="w-full h-full object-cover"
                                        />
                                        <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/70 to-transparent p-3">
                                          <div className="text-white">
                                            <div className="font-semibold text-sm mb-1 line-clamp-2">
                                              {topVotedPainting.title}
                                            </div>
                                            <div className="text-xs opacity-90 mb-1">
                                              {t.byArtist}{" "}
                                              {topVotedPainting.competitorName}
                                            </div>
                                            <div className="text-xs opacity-75">
                                              {t.averageScoreLabel}{" "}
                                              {topVotedPainting.avgScoreRound2?.toFixed(
                                                2
                                              ) || "N/A"}
                                            </div>
                                            <div className="text-xs opacity-75">
                                              {t.votesLabel}{" "}
                                              {topVotedPainting.voteCount}
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  ) : award.totalVotes > 0 &&
                                    topVotedPainting ? (
                                    <div className="mt-3 pt-3 border-t border-yellow-200/50">
                                      <div className="w-full aspect-video bg-gray-100 border border-yellow-300 shadow-md flex flex-col items-center justify-center p-4">
                                        <div className="text-center">
                                          <div className="font-semibold text-sm text-gray-800 mb-1">
                                            {topVotedPainting.title}
                                          </div>
                                          <div className="text-xs text-gray-600 mb-1">
                                            {t.byArtist}{" "}
                                            {topVotedPainting.competitorName}
                                          </div>
                                          <div className="text-xs text-gray-500">
                                            {t.averageScoreLabel}{" "}
                                            {topVotedPainting.avgScoreRound2?.toFixed(
                                              2
                                            ) || "N/A"}
                                          </div>
                                          <div className="text-xs opacity-75">
                                            {t.votesLabel}{" "}
                                            {topVotedPainting.voteCount}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  ) : null}
                                </div>

                                {/* Voted Paintings - View Only with Reassignment Option */}
                                <div
                                  className={`transition-all duration-500 ease-in-out ${
                                    isExpanded
                                      ? "opacity-100"
                                      : "opacity-0 h-0 overflow-hidden"
                                  }`}
                                >
                                  <div className="space-y-3 pt-4 border-t border-yellow-200/50">
                                    {isLoading ? (
                                      <div className="text-center py-8 staff-text-secondary">
                                        {t.loadingVotedPaintings}
                                      </div>
                                    ) : votedPaintings.length > 0 ? (
                                      votedPaintings.map((painting, index) => {
                                        const isProcessing =
                                          assignMutation.isPending ||
                                          removeMutation.isPending;

                                        const isAssignedToThisAward = prizeAward
                                          ? prizeAward.paintings.some(
                                              (assignedPainting) =>
                                                assignedPainting.paintingId ===
                                                painting.paintingId
                                            )
                                          : false;

                                        const isTopVoted =
                                          topVotedPainting?.paintingId ===
                                          painting.paintingId;

                                        return (
                                          <div
                                            key={painting.paintingId}
                                            className={`border border-[var(--staff-border)] p-4 hover:shadow-md transition-all duration-300 rounded-sm ${
                                              isTopVoted
                                                ? "hover:border-yellow-300 hover:bg-yellow-50/50 ring-1 ring-yellow-200/50"
                                                : "hover:border-yellow-300 hover:bg-yellow-50/30"
                                            } ${
                                              isExpanded
                                                ? `animate-slide-in-up`
                                                : ""
                                            }`}
                                            style={{
                                              animationDelay: `${index * 50}ms`,
                                            }}
                                          >
                                            <div className="flex gap-4">
                                              {/* Painting Image */}
                                              {painting.imageUrl && (
                                                <div
                                                  className="shrink-0 w-40 h-40 bg-gray-100 rounded-sm overflow-hidden border-2 border-[var(--staff-border)] shadow-sm cursor-pointer hover:shadow-md transition-shadow"
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
                                                    <div className="flex items-center gap-2 mb-1">
                                                      <h4 className="font-bold staff-text-primary text-base">
                                                        {painting.title}
                                                      </h4>
                                                      {isTopVoted &&
                                                        award.totalVotes >
                                                          0 && (
                                                          <div className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-sm">
                                                            🏆 {t.topVoted}{" "}
                                                          </div>
                                                        )}
                                                    </div>
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
                                                        {painting.avgScoreRound2.toFixed(
                                                          2
                                                        )}
                                                      </span>
                                                    </div>
                                                  </div>

                                                  {/* Assignment Status and Actions */}
                                                  {/* <div className="ml-4 flex flex-col items-end gap-1">
                                                    {isAssignedToThisAward ? (
                                                      <div className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-sm">
                                                        <IconTrophy className="h-3 w-3" />
                                                        {t.currentWinner}
                                                      </div>
                                                    ) : prizeAward &&
                                                      prizeAward.paintings
                                                        .length <
                                                        prizeAward.quantity ? (
                                                      <button
                                                        onClick={() =>
                                                          handleAssignAward(
                                                            painting.paintingId,
                                                            prizeAward
                                                          )
                                                        }
                                                        disabled={isProcessing}
                                                        className="staff-btn-primary px-2 py-1 text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                                                      >
                                                        {isProcessing
                                                          ? t.assigningAwardStatus
                                                          : t.assignAwardButton}
                                                      </button>
                                                    ) : prizeAward &&
                                                      prizeAward.paintings
                                                        .length >=
                                                        prizeAward.quantity ? (
                                                      <div className="px-2 py-1 text-xs bg-gray-100 text-gray-500 rounded-sm">
                                                        {t.awardSlotsFull}
                                                      </div>
                                                    ) : (
                                                      <div className="px-2 py-1 text-xs bg-gray-100 text-gray-500 rounded-sm">
                                                        {
                                                          t.noMatchingAwardStatus
                                                        }
                                                      </div>
                                                    )}
                                                  </div> */}
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
                                </div>
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
                    <h3 className="staff-type-section-title staff-text-primary mb-4">
                      {activeTab === "top-paintings"
                        ? t.topAwardsSummary
                        : t.votedAwardsSummary}
                    </h3>
                    {activeTab === "top-paintings" && (
                      <div className="flex gap-2 mb-4">
                        <button
                          onClick={handleAssignAllAwards}
                          disabled={
                            !hasUnassignedTopPaintings ||
                            assignMutation.isPending ||
                            removeMutation.isPending ||
                            !isRound2Completed
                          }
                          className="flex-1 staff-btn-primary flex items-center justify-center px-3 py-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                          title={
                            !isRound2Completed
                              ? "All Round 2 evaluations must be completed first"
                              : hasUnassignedTopPaintings
                              ? "Assign all available awards to top paintings"
                              : "All top paintings are already assigned"
                          }
                        >
                          <IconTrophy className="h-4 w-4 mr-2" />
                          {t.assignAllAwards}
                        </button>
                        <button
                          onClick={handleRemoveAllAwards}
                          disabled={
                            !hasAssignedAwards ||
                            assignMutation.isPending ||
                            removeMutation.isPending
                          }
                          className="flex-1 staff-btn-outline flex items-center justify-center px-3 py-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                          title={
                            hasAssignedAwards
                              ? "Remove all awards from paintings"
                              : "No awards are currently assigned"
                          }
                        >
                          <IconX className="h-4 w-4 mr-2" />
                          {t.removeAllAwards}
                        </button>
                      </div>
                    )}
                    <div className="space-y-3">
                      {activeTab === "top-paintings"
                        ? // Prize awards summary for top paintings tab
                          awards
                            .filter((award) => award.rank <= 3)
                            .sort((a, b) => a.rank - b.rank)
                            .map((award) => {
                              const isFull =
                                award.paintings.length >= award.quantity;

                              return (
                                <div
                                  key={award.awardId}
                                  className={`p-4 rounded-sm border-2 ${
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
                                        {(() => {
                                          const prizeValue = parseFloat(
                                            award.prize
                                          );
                                          return isNaN(prizeValue)
                                            ? "Invalid prize"
                                            : formatCurrency(prizeValue);
                                        })()}
                                      </div>
                                      <div className="text-xs staff-text-secondary space-y-1">
                                        <div>
                                          {t.assignedLabel}{" "}
                                          {award.paintings.length}/
                                          {award.quantity}
                                        </div>
                                      </div>
                                      {isFull && (
                                        <div className="mt-2 px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-sm">
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

                            // Check for mismatch for this specific award
                            const votedPaintingsQuery =
                              votedPaintingsQueries[
                                votedAwardsData.data.awards.indexOf(award)
                              ];
                            const votedPaintingsData = votedPaintingsQuery?.data
                              ?.data as VotedPaining | undefined;
                            const votedPaintings =
                              votedPaintingsData?.paintings || [];
                            const topVotedPainting =
                              votedPaintings.length > 0
                                ? votedPaintings.reduce((prev, current) =>
                                    comparePaintings(prev, current) <= 0
                                      ? prev
                                      : current
                                  )
                                : null;
                            const currentlyAssignedPainting =
                              prizeAward?.paintings?.[0];
                            const hasMismatch =
                              (currentlyAssignedPainting &&
                                topVotedPainting &&
                                currentlyAssignedPainting.paintingId !==
                                  topVotedPainting.paintingId) ||
                              (currentlyAssignedPainting &&
                                award.totalVotes === 0);

                            return (
                              <div
                                key={award.awardId}
                                className={`p-4 rounded-sm border-2 ${
                                  hasMismatch && award.totalVotes === 0
                                    ? "bg-orange-50 border-orange-300"
                                    : hasMismatch && award.totalVotes > 0
                                    ? "bg-red-50 border-red-300"
                                    : isFull
                                    ? "bg-green-50 border-green-300"
                                    : "bg-blue-50 border-blue-300"
                                }`}
                              >
                                <div className="flex items-start gap-3">
                                  <IconTrophy
                                    className={`h-6 w-6 mt-0.5 ${
                                      hasMismatch && award.totalVotes === 0
                                        ? "text-orange-600"
                                        : hasMismatch && award.totalVotes > 0
                                        ? "text-red-600"
                                        : isFull
                                        ? "text-green-600"
                                        : "text-blue-600"
                                    }`}
                                  />
                                  <div className="flex-1 min-w-0">
                                    <div className="font-semibold text-sm mb-1">
                                      {award.name}
                                    </div>
                                    <div className="text-xs text-green-600 mb-2">
                                      {(() => {
                                        const prizeValue = parseFloat(
                                          award.prize
                                        );
                                        return isNaN(prizeValue)
                                          ? "Invalid prize"
                                          : formatCurrency(prizeValue);
                                      })()}
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
                                    {hasMismatch && award.totalVotes === 0 && (
                                      <div className="mt-2 px-2 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded-sm">
                                        {t.noVotesYet}
                                      </div>
                                    )}
                                    {hasMismatch && award.totalVotes > 0 && (
                                      <div className="mt-2 px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-sm">
                                        {t.mismatchStatus}
                                      </div>
                                    )}
                                    {isFull && !hasMismatch && (
                                      <div className="mt-2 px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-sm">
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
                    <div className="mt-6 pt-4]">
                      {/* <div className="flex justify-between text-sm mb-2">
                        <span className="staff-text-primary font-medium">
                          {t.overallProgress}
                        </span>
                        <span className="staff-text-secondary">
                          {assignedSlots}/{totalAwardSlots} {t.slotsFilled}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${
                            activeTab === "vote-results" && mismatchCount > 0
                              ? "bg-red-600"
                              : allAwardSlotsFilled
                              ? "bg-green-600"
                              : "bg-blue-600"
                          }`}
                          style={{
                            width:
                              totalAwardSlots > 0
                                ? `${(assignedSlots / totalAwardSlots) * 100}%`
                                : "0%",
                          }}
                        ></div>
                      </div> */}
                      {activeTab === "vote-results" && mismatchCount > 0 && (
                        <div className="mt-2 px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-sm">
                          {mismatchCount} {t.mismatchesFound}
                        </div>
                      )}
                      {allAwardSlotsFilled &&
                        (activeTab !== "vote-results" ||
                          mismatchCount === 0) && (
                          <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-sm">
                            <div className="flex items-center gap-2 text-green-800 text-sm font-medium">
                              <IconTrophy className="h-4 w-4" />
                              {t.allAwardsAssignedReady}
                            </div>
                          </div>
                        )}
                        
                      {/* Announce Buttons - Specific to active tab */}
                      {activeTab === "top-paintings" && (
                        <div className="mt-4 border-t border-[var(--staff-border)] pt-4">
                          <button
                            type="button"
                            onClick={() => {
                              if (isTopAnnounceDisabled) return;
                              router.push(
                                `/dashboard/staff/contests/awards/announce?id=${contestId}&type=top`
                              );
                            }}
                            disabled={isTopAnnounceDisabled}
                            className="w-full staff-btn-primary flex items-center justify-center px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            title={
                              !isTopAwardsFullyAssigned
                                ? "All top awards must be assigned before announcing"
                                : "Công Bố Giải Thưởng"
                            }
                          >
                            <IconSpeakerphone className="h-4 w-4" />
                            <span className="ml-2">Công Bố Giải Thưởng</span>
                          </button>
                        </div>
                      )}
                      
                      {activeTab === "vote-results" && (
                        <div className="mt-4 border-t border-[var(--staff-border)] pt-4">
                          <button
                            type="button"
                            onClick={() => {
                              if (isVoteAnnounceDisabled) return;
                              router.push(
                                `/dashboard/staff/contests/awards/announce?id=${contestId}&type=vote`
                              );
                            }}
                            disabled={isVoteAnnounceDisabled}
                            className="w-full staff-btn-primary flex items-center justify-center px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            title={
                              !isVoteAwardsFullyAssigned
                                ? "All vote awards must be assigned before announcing"
                                : "Công Bố Giải Thưởng"
                            }
                          >
                            <IconSpeakerphone className="h-4 w-4" />
                            <span className="ml-2">Công Bố Giải Thưởng</span>
                          </button>
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
