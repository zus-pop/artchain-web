"use client";

import { Breadcrumb } from "@/components/breadcrumb";
import { SiteHeader } from "@/components/site-header";
import { StaffSidebar } from "@/components/staff-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import {
  IconArrowLeft,
  IconCalendar,
  IconDeviceFloppy,
  IconFileText,
  IconTrophy,
  IconPlus,
  IconTrash,
  IconPhoto,
} from "@tabler/icons-react";
import Link from "next/link";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createStaffContest } from "@/apis/staff";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type RoundFormData = {
  name: string;
  table: string;
  startDate: string;
  endDate: string;
  submissionDeadline: string;
  status: "DRAFT" | "ACTIVE" | "COMPLETED" | "CANCELLED";
};

export default function CreateContestPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    bannerUrl: "",
    numOfAward: "",
    startDate: "",
    endDate: "",
    status: "DRAFT" as "DRAFT" | "ACTIVE" | "COMPLETED" | "CANCELLED",
  });

  const [rounds, setRounds] = useState<RoundFormData[]>([]);

  const createMutation = useMutation({
    mutationFn: createStaffContest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff-contests"] });
      router.push("/dashboard/staff/contests");
    },
    onError: (error: unknown) => {
      console.error("Failed to create contest:", error);
      const errorMessage =
        error &&
        typeof error === "object" &&
        "response" in error &&
        error.response &&
        typeof error.response === "object" &&
        "data" in error.response &&
        error.response.data &&
        typeof error.response.data === "object" &&
        "message" in error.response.data
          ? String(error.response.data.message)
          : "Failed to create contest";
      toast.error(errorMessage);
    },
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const addRound = () => {
    setRounds((prev) => [
      ...prev,
      {
        name: "",
        table: "paintings",
        startDate: "",
        endDate: "",
        submissionDeadline: "",
        status: "DRAFT",
      },
    ]);
  };

  const removeRound = (index: number) => {
    setRounds((prev) => prev.filter((_, i) => i !== index));
  };

  const updateRound = (index: number, field: string, value: string) => {
    setRounds((prev) =>
      prev.map((round, i) =>
        i === index ? { ...round, [field]: value } : round
      )
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.title || !formData.description) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!formData.startDate || !formData.endDate) {
      toast.error("Please select start and end dates");
      return;
    }

    if (new Date(formData.endDate) <= new Date(formData.startDate)) {
      toast.error("End date must be after start date");
      return;
    }

    const numOfAward = parseInt(formData.numOfAward);
    if (isNaN(numOfAward) || numOfAward < 0) {
      toast.error("Please enter a valid number of awards");
      return;
    }

    // Validate rounds if any
    for (let i = 0; i < rounds.length; i++) {
      const round = rounds[i];
      if (!round.name || !round.startDate || !round.endDate) {
        toast.error(`Round ${i + 1}: Please fill in all required fields`);
        return;
      }
      if (new Date(round.endDate) <= new Date(round.startDate)) {
        toast.error(`Round ${i + 1}: End date must be after start date`);
        return;
      }
    }

    // Prepare data
    const contestData = {
      title: formData.title,
      description: formData.description,
      bannerUrl: formData.bannerUrl || undefined,
      numOfAward,
      startDate: new Date(formData.startDate).toISOString(),
      endDate: new Date(formData.endDate).toISOString(),
      status: formData.status,
      rounds: rounds.length > 0 ? rounds.map((round) => ({
        name: round.name,
        table: round.table,
        startDate: new Date(round.startDate).toISOString(),
        endDate: new Date(round.endDate).toISOString(),
        submissionDeadline: round.submissionDeadline
          ? new Date(round.submissionDeadline).toISOString()
          : undefined,
        status: round.status,
      })) : undefined,
    };

    createMutation.mutate(contestData);
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
        <SiteHeader title="Create Contest" />
        <div className="flex flex-1 flex-col">
          <div className="px-4 lg:px-6 py-2 border-b border-[#e6e2da] bg-white">
            <Breadcrumb
              items={[
                {
                  label: "Contest Management",
                  href: "/dashboard/staff/contests",
                },
                { label: "Create Contest" },
              ]}
              homeHref="/dashboard/staff"
            />
          </div>
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Link
                    href="/dashboard/staff/contests"
                    className=" border border-[#e6e2da] p-2 hover:bg-gray-50 transition-colors"
                  >
                    <IconArrowLeft className="h-5 w-5 staff-text-secondary" />
                  </Link>
                  <div>
                    <h2 className="text-2xl font-bold staff-text-primary">
                      Create New Contest
                    </h2>
                    <p className="text-sm staff-text-secondary mt-1">
                      Set up a new art competition for young artists
                    </p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-6">
                    <div className="staff-card p-6">
                      <h3 className="text-lg font-semibold staff-text-primary mb-4 flex items-center gap-2">
                        <IconFileText className="h-5 w-5 " />
                        Basic Information
                      </h3>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Contest Title *
                          </label>
                          <input
                            type="text"
                            value={formData.title}
                            onChange={(e) =>
                              handleInputChange("title", e.target.value)
                            }
                            className="w-full px-3 py-2 border border-[#e6e2da]  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter contest title"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description *
                          </label>
                          <textarea
                            value={formData.description}
                            onChange={(e) =>
                              handleInputChange("description", e.target.value)
                            }
                            rows={4}
                            className="w-full px-3 py-2 border border-[#e6e2da]  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Describe the contest theme and objectives"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Banner URL
                          </label>
                          <div className="relative">
                            <IconPhoto className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                              type="url"
                              value={formData.bannerUrl}
                              onChange={(e) =>
                                handleInputChange("bannerUrl", e.target.value)
                              }
                              className="w-full pl-10 pr-3 py-2 border border-[#e6e2da]  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="https://example.com/banner.jpg"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="staff-card p-6">
                      <h3 className="text-lg font-semibold staff-text-primary mb-4 flex items-center gap-2">
                        <IconCalendar className="h-5 w-5 " />
                        Schedule & Awards
                      </h3>

                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Start Date *
                            </label>
                            <input
                              type="date"
                              value={formData.startDate}
                              onChange={(e) =>
                                handleInputChange("startDate", e.target.value)
                              }
                              className="w-full px-3 py-2 border border-[#e6e2da]  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              End Date *
                            </label>
                            <input
                              type="date"
                              value={formData.endDate}
                              onChange={(e) =>
                                handleInputChange("endDate", e.target.value)
                              }
                              className="w-full px-3 py-2 border border-[#e6e2da]  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Number of Awards *
                          </label>
                          <input
                            type="number"
                            value={formData.numOfAward}
                            onChange={(e) =>
                              handleInputChange("numOfAward", e.target.value)
                            }
                            className="w-full px-3 py-2 border border-[#e6e2da]  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="3"
                            min="0"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Status *
                          </label>
                          <select
                            value={formData.status}
                            onChange={(e) =>
                              handleInputChange("status", e.target.value)
                            }
                            className="w-full px-3 py-2 border border-[#e6e2da]  focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                          >
                            <option value="DRAFT">Draft</option>
                            <option value="ACTIVE">Active</option>
                            <option value="COMPLETED">Completed</option>
                            <option value="CANCELLED">Cancelled</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="staff-card p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold staff-text-primary flex items-center gap-2">
                          <IconTrophy className="h-5 w-5 text-yellow-600" />
                          Rounds
                        </h3>
                        <button
                          type="button"
                          onClick={addRound}
                          className="flex items-center gap-2 px-3 py-1.5 text-sm staff-btn-primary transition-colors"
                        >
                          <IconPlus className="h-4 w-4" />
                          Add Round
                        </button>
                      </div>

                      <div className="space-y-4">
                        {rounds.length === 0 ? (
                          <p className="text-sm staff-text-secondary text-center py-8">
                            No rounds added yet. Click &quot;Add Round&quot; to
                            create one.
                          </p>
                        ) : (
                          rounds.map((round, index) => (
                            <div
                              key={index}
                              className="border border-[#e6e2da] p-4 space-y-3"
                            >
                              <div className="flex items-center justify-between">
                                <h4 className="font-medium text-gray-900">
                                  Round {index + 1}
                                </h4>
                                <button
                                  type="button"
                                  onClick={() => removeRound(index)}
                                  className="text-red-600 hover:text-red-700 p-1"
                                  title="Remove round"
                                >
                                  <IconTrash className="h-4 w-4" />
                                </button>
                              </div>

                              <div className="space-y-3">
                                <div>
                                  <label className="block text-xs font-medium text-gray-700 mb-1">
                                    Round Name *
                                  </label>
                                  <input
                                    type="text"
                                    value={round.name}
                                    onChange={(e) =>
                                      updateRound(index, "name", e.target.value)
                                    }
                                    className="w-full px-2 py-1.5 text-sm border border-[#e6e2da]  focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="ROUND1"
                                    required
                                  />
                                </div>

                                <div>
                                  <label className="block text-xs font-medium text-gray-700 mb-1">
                                    Table *
                                  </label>
                                  <select
                                    value={round.table}
                                    onChange={(e) =>
                                      updateRound(
                                        index,
                                        "table",
                                        e.target.value
                                      )
                                    }
                                    className="w-full px-2 py-1.5 text-sm border border-[#e6e2da]  focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                  >
                                    <option value="paintings">Paintings</option>
                                    <option value="sculptures">
                                      Sculptures
                                    </option>
                                    <option value="photos">Photos</option>
                                  </select>
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                  <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                      Start Date *
                                    </label>
                                    <input
                                      type="date"
                                      value={round.startDate}
                                      onChange={(e) =>
                                        updateRound(
                                          index,
                                          "startDate",
                                          e.target.value
                                        )
                                      }
                                      className="w-full px-2 py-1.5 text-sm border border-[#e6e2da]  focus:outline-none focus:ring-2 focus:ring-blue-500"
                                      required
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                      End Date *
                                    </label>
                                    <input
                                      type="date"
                                      value={round.endDate}
                                      onChange={(e) =>
                                        updateRound(
                                          index,
                                          "endDate",
                                          e.target.value
                                        )
                                      }
                                      className="w-full px-2 py-1.5 text-sm border border-[#e6e2da]  focus:outline-none focus:ring-2 focus:ring-blue-500"
                                      required
                                    />
                                  </div>
                                </div>

                                <div>
                                  <label className="block text-xs font-medium text-gray-700 mb-1">
                                    Submission Deadline
                                  </label>
                                  <input
                                    type="date"
                                    value={round.submissionDeadline}
                                    onChange={(e) =>
                                      updateRound(
                                        index,
                                        "submissionDeadline",
                                        e.target.value
                                      )
                                    }
                                    className="w-full px-2 py-1.5 text-sm border border-[#e6e2da]  focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  />
                                </div>

                                <div>
                                  <label className="block text-xs font-medium text-gray-700 mb-1">
                                    Status *
                                  </label>
                                  <select
                                    value={round.status}
                                    onChange={(e) =>
                                      updateRound(
                                        index,
                                        "status",
                                        e.target.value
                                      )
                                    }
                                    className="w-full px-2 py-1.5 text-sm border border-[#e6e2da]  focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                  >
                                    <option value="DRAFT">Draft</option>
                                    <option value="ACTIVE">Active</option>
                                    <option value="COMPLETED">Completed</option>
                                    <option value="CANCELLED">Cancelled</option>
                                  </select>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-4 pt-6 border-t border-[#e6e2da]">
                  <Link
                    href="/dashboard/staff/contests"
                    className="px-6 py-2 border border-[#e6e2da]  text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </Link>
                  <button
                    type="submit"
                    disabled={createMutation.isPending}
                    className="px-6 py-2 staff-btn-primary transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <IconDeviceFloppy className="h-4 w-4" />
                    {createMutation.isPending ? "Creating..." : "Create Contest"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
