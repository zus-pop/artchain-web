"use client";

import { Breadcrumb } from "@/components/breadcrumb";
import { SiteHeader } from "@/components/site-header";
import { StaffSidebar } from "@/components/staff-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import {
  IconArrowLeft,
  IconCheck,
  IconEye,
  IconFileText,
  IconMail,
  IconSend,
  IconTrophy,
  IconUsers,
} from "@tabler/icons-react";
import Link from "next/link";
import { useState } from "react";

type AwardType = "GOLD" | "SILVER" | "BRONZE" | "HONORABLE_MENTION" | "SPECIAL";

interface Winner {
  id: string;
  name: string;
  email: string;
  age: number;
  artworkTitle: string;
  awardType: AwardType;
  prizeAmount: string;
  description: string;
}

interface Contest {
  id: string;
  title: string;
  endDate: string;
  totalSubmissions: number;
  winners: Winner[];
}

export default function AnnounceResultsPage() {
  const [selectedContest, setSelectedContest] = useState<string>("");
  const [announcementMessage, setAnnouncementMessage] = useState("");
  const [isPublishing, setIsPublishing] = useState(false);
  const [isPublished, setIsPublished] = useState(false);

  const [contests] = useState<Contest[]>([
    {
      id: "2",
      title: "Digital Art Competition 2025",
      endDate: "2025-12-15",
      totalSubmissions: 38,
      winners: [
        {
          id: "1",
          name: "Diana Lee",
          email: "diana.lee@email.com",
          age: 14,
          artworkTitle: "Cyber Symphony",
          awardType: "GOLD",
          prizeAmount: "$750",
          description: "Innovative use of digital tools and artistic vision",
        },
        {
          id: "2",
          name: "Frank Wilson",
          email: "frank.wilson@email.com",
          age: 11,
          artworkTitle: "Digital Dreams",
          awardType: "SILVER",
          prizeAmount: "$450",
          description: "Exceptional digital composition and creativity",
        },
        {
          id: "3",
          name: "Grace Kim",
          email: "grace.kim@email.com",
          age: 13,
          artworkTitle: "Pixel Poetry",
          awardType: "BRONZE",
          prizeAmount: "$250",
          description: "Outstanding digital artwork with unique perspective",
        },
      ],
    },
    {
      id: "4",
      title: "Sculpture & 3D Art Challenge",
      endDate: "2026-01-15",
      totalSubmissions: 15,
      winners: [
        {
          id: "4",
          name: "Henry Brown",
          email: "henry.brown@email.com",
          age: 16,
          artworkTitle: "Clay Dreams",
          awardType: "GOLD",
          prizeAmount: "$600",
          description: "Masterful clay sculpture with emotional depth",
        },
      ],
    },
  ]);

  const selectedContestData = contests.find((c) => c.id === selectedContest);

  const getAwardTypeBadgeColor = (type: AwardType) => {
    const colors = {
      GOLD: "bg-yellow-100 text-yellow-800 border-yellow-300",
      SILVER: "bg-gray-100 text-gray-800 border-gray-300",
      BRONZE: "bg-orange-100 text-orange-800 border-orange-300",
      HONORABLE_MENTION: "bg-blue-100 text-blue-800 border-blue-300",
      SPECIAL: "bg-purple-100 text-purple-800 border-purple-300",
    };
    return colors[type];
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 3000));
    setIsPublishing(false);
    setIsPublished(true);
  };

  const resetAnnouncement = () => {
    setSelectedContest("");
    setAnnouncementMessage("");
    setIsPublished(false);
  };

  if (isPublished) {
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
          <SiteHeader title="Announce Results" />
          <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
              <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
                {/* Success Message */}
                <div className="max-w-2xl mx-auto">
                  <div className="rounded-lg border border-green-200 bg-green-50 p-8 text-center">
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                      <IconCheck className="h-6 w-6 text-green-600" />
                    </div>
                    <h3 className="text-lg font-medium text-green-900 mb-2">
                      Results Announced Successfully!
                    </h3>
                    <p className="text-green-700 mb-6">
                      The contest results for{" "}
                      <strong>{selectedContestData?.title}</strong> have been
                      published. All participants and winners have been notified
                      via email.
                    </p>
                    <div className="flex gap-4 justify-center">
                      <Link
                        href="/dashboard/staff/contests/awards"
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                      >
                        View All Awards
                      </Link>
                      <button
                        onClick={resetAnnouncement}
                        className="border border-green-300 text-green-700 px-4 py-2 rounded-lg hover:bg-green-50 transition-colors"
                      >
                        Announce More Results
                      </button>
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
        <SiteHeader title="Announce Results" />
        <div className="flex flex-1 flex-col">
          <div className="px-4 lg:px-6 py-2 border-b border-gray-200 bg-white">
            <Breadcrumb
              items={[
                {
                  label: "Contest Management",
                  href: "/dashboard/staff/contests",
                },
                { label: "Awards", href: "/dashboard/staff/contests/awards" },
                { label: "Announce Results" },
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
                    href="/dashboard/staff/contests/awards"
                    className="rounded-lg border border-gray-200 p-2 hover:bg-gray-50 transition-colors"
                  >
                    <IconArrowLeft className="h-5 w-5 text-gray-600" />
                  </Link>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Announce Contest Results
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                      Publish winners and distribute prizes for completed
                      contests
                    </p>
                  </div>
                </div>
              </div>

              <div className="max-w-4xl mx-auto space-y-6">
                {/* Contest Selection */}
                <div className="rounded-lg border border-gray-200 bg-white p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <IconTrophy className="h-5 w-5 text-blue-600" />
                    Select Contest
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Choose contest to announce results for *
                      </label>
                      <select
                        value={selectedContest}
                        onChange={(e) => setSelectedContest(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        <option value="">Select a contest...</option>
                        {contests.map((contest) => (
                          <option key={contest.id} value={contest.id}>
                            {contest.title} ({contest.totalSubmissions}{" "}
                            submissions)
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Winners Preview */}
                {selectedContestData && (
                  <div className="rounded-lg border border-gray-200 bg-white p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <IconUsers className="h-5 w-5 text-green-600" />
                      Winners Preview
                    </h3>

                    <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                      <div className="flex items-center gap-2 text-blue-800">
                        <IconFileText className="h-5 w-5" />
                        <span className="font-medium">Contest Summary</span>
                      </div>
                      <div className="mt-2 text-sm text-blue-700">
                        <p>
                          <strong>{selectedContestData.title}</strong>
                        </p>
                        <p>
                          Ended: {selectedContestData.endDate} • Total
                          Submissions: {selectedContestData.totalSubmissions}
                        </p>
                        <p>Winners: {selectedContestData.winners.length}</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {selectedContestData.winners.map((winner, index) => (
                        <div
                          key={winner.id}
                          className="border border-gray-200 rounded-lg p-4"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-4">
                              <div className="flex-shrink-0">
                                <div
                                  className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${
                                    winner.awardType === "GOLD"
                                      ? "bg-yellow-100 border-yellow-300"
                                      : winner.awardType === "SILVER"
                                      ? "bg-gray-100 border-gray-300"
                                      : "bg-orange-100 border-orange-300"
                                  }`}
                                >
                                  <span
                                    className={`text-lg font-bold ${
                                      winner.awardType === "GOLD"
                                        ? "text-yellow-600"
                                        : winner.awardType === "SILVER"
                                        ? "text-gray-600"
                                        : "text-orange-600"
                                    }`}
                                  >
                                    {index + 1}
                                  </span>
                                </div>
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className="text-lg font-semibold text-gray-900">
                                    {winner.name}
                                  </h4>
                                  <span
                                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getAwardTypeBadgeColor(
                                      winner.awardType
                                    )}`}
                                  >
                                    {winner.awardType}
                                  </span>
                                </div>
                                <p className="text-gray-600 mb-2">
                                  <strong>
                                    &ldquo;{winner.artworkTitle}&rdquo;
                                  </strong>{" "}
                                  • Age {winner.age}
                                </p>
                                <p className="text-sm text-gray-600 mb-2">
                                  {winner.description}
                                </p>
                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                  <span className="flex items-center gap-1">
                                    <IconMail className="h-4 w-4" />
                                    {winner.email}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <IconTrophy className="h-4 w-4" />
                                    Prize: {winner.prizeAmount}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <button className="text-gray-400 hover:text-gray-600 p-1">
                              <IconEye className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Announcement Message */}
                {selectedContestData && (
                  <div className="rounded-lg border border-gray-200 bg-white p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <IconSend className="h-5 w-5 text-purple-600" />
                      Announcement Message
                    </h3>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Personal Message (Optional)
                        </label>
                        <textarea
                          value={announcementMessage}
                          onChange={(e) =>
                            setAnnouncementMessage(e.target.value)
                          }
                          rows={4}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Add a congratulatory message to all participants..."
                        />
                      </div>

                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">
                          What happens when you announce results:
                        </h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          <li>
                            • Winners will receive congratulatory emails with
                            their award details
                          </li>
                          <li>
                            • All participants will be notified of the results
                          </li>
                          <li>
                            • Awards will be marked as &ldquo;announced&rdquo;
                            in the system
                          </li>
                          <li>
                            • Results will be published on the contest page
                          </li>
                          <li>
                            • Certificates will be generated for all winners
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                {selectedContestData && (
                  <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
                    <Link
                      href="/dashboard/staff/contests/awards"
                      className="px-6 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </Link>
                    <button
                      onClick={handlePublish}
                      disabled={isPublishing}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {isPublishing ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Publishing Results...
                        </>
                      ) : (
                        <>
                          <IconSend className="h-4 w-4" />
                          Announce Results
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
