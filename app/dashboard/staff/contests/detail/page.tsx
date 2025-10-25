"use client";

import { Breadcrumb } from "@/components/breadcrumb";
import { SiteHeader } from "@/components/site-header";
import { StaffSidebar } from "@/components/staff-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { IconArrowLeft, IconDeviceFloppy } from "@tabler/icons-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createStaffContest,
  getStaffContestById,
  updateStaffContest,
} from "@/apis/staff";
import { ContestStatus } from "@/types/contest";
import Image from "next/image";

export default function ContestDetailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const contestId = searchParams.get("id");
  const queryClient = useQueryClient();

  const isEditMode = !!contestId;

  // Fetch contest details if editing
  const { data: contestData, isLoading } = useQuery({
    queryKey: ["contest-detail", contestId],
    queryFn: () => getStaffContestById(Number(contestId)),
    enabled: isEditMode,
    staleTime: 1 * 60 * 1000,
  });

  const contest = contestData?.data;

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    bannerUrl: "",
    numOfAward: 1,
    startDate: "",
    endDate: "",
    status: "DRAFT" as ContestStatus,
  });

  // Update form when contest data loads
  useState(() => {
    if (contest) {
      setFormData({
        title: contest.title,
        description: contest.description,
        bannerUrl: contest.bannerUrl || "",
        numOfAward: contest.numOfAward,
        startDate: contest.startDate.slice(0, 16),
        endDate: contest.endDate.slice(0, 16),
        status: contest.status,
      });
    }
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: createStaffContest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff-contests"] });
      router.push("/dashboard/staff/contests");
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: (data: typeof formData) =>
      updateStaffContest(Number(contestId), data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff-contests"] });
      queryClient.invalidateQueries({ queryKey: ["contest-detail", contestId] });
      router.push("/dashboard/staff/contests");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Convert datetime-local to ISO string
    const submitData = {
      ...formData,
      startDate: new Date(formData.startDate).toISOString(),
      endDate: new Date(formData.endDate).toISOString(),
    };

    if (isEditMode) {
      updateMutation.mutate(submitData);
    } else {
      createMutation.mutate(submitData);
    }
  };

  if (isEditMode && isLoading) {
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
          <SiteHeader title="Contest Detail" />
          <div className="flex flex-1 items-center justify-center">
            <div className="text-gray-500">Loading contest details...</div>
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
        <SiteHeader title={isEditMode ? "Edit Contest" : "Create Contest"} />
        <div className="flex flex-1 flex-col">
          <div className="px-4 lg:px-6 py-2 border-b border-[#e6e2da] bg-white">
            <Breadcrumb
              items={[
                {
                  label: "Contest Management",
                  href: "/dashboard/staff/contests",
                },
                { label: isEditMode ? "Edit Contest" : "Create Contest" },
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
                    href="/dashboard/staff/contests"
                    className="border border-[#e6e2da] p-2 hover:bg-gray-50 transition-colors"
                  >
                    <IconArrowLeft className="h-5 w-5 staff-text-secondary" />
                  </Link>
                  <div>
                    <h2 className="text-2xl font-bold staff-text-primary">
                      {isEditMode ? "Edit Contest" : "Create New Contest"}
                    </h2>
                    <p className="text-sm staff-text-secondary mt-1">
                      {isEditMode
                        ? "Update contest information"
                        : "Set up a new art competition for young artists"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
                <div className="staff-card p-6 space-y-6">
                  {/* Banner URL */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Banner Image URL
                    </label>
                    <input
                      type="text"
                      value={formData.bannerUrl}
                      onChange={(e) =>
                        setFormData({ ...formData, bannerUrl: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-[#e6e2da] rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://example.com/banner.jpg"
                    />
                    {formData.bannerUrl && (
                      <div className="mt-3">
                        <Image
                          src={formData.bannerUrl}
                          alt="Banner preview"
                          width={600}
                          height={300}
                          className="rounded object-cover w-full"
                        />
                      </div>
                    )}
                  </div>

                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contest Title *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-[#e6e2da] rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter contest title"
                      required
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description *
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({ ...formData, description: e.target.value })
                      }
                      rows={4}
                      className="w-full px-3 py-2 border border-[#e6e2da] rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Describe the contest theme and objectives"
                      required
                    />
                  </div>

                  {/* Number of Awards */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Number of Awards *
                    </label>
                    <input
                      type="number"
                      value={formData.numOfAward}
                      onChange={(e) =>
                        setFormData({ ...formData, numOfAward: Number(e.target.value) })
                      }
                      className="w-full px-3 py-2 border border-[#e6e2da] rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="5"
                      min="1"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Number of prizes/awards for this contest
                    </p>
                  </div>

                  {/* Dates */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Start Date *
                      </label>
                      <input
                        type="datetime-local"
                        value={formData.startDate}
                        onChange={(e) =>
                          setFormData({ ...formData, startDate: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-[#e6e2da] rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        End Date *
                      </label>
                      <input
                        type="datetime-local"
                        value={formData.endDate}
                        onChange={(e) =>
                          setFormData({ ...formData, endDate: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-[#e6e2da] rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>

                  {/* Status */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status *
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          status: e.target.value as ContestStatus,
                        })
                      }
                      className="w-full px-3 py-2 border border-[#e6e2da] rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="DRAFT">DRAFT</option>
                      <option value="ACTIVE">ACTIVE</option>
                      <option value="COMPLETED">COMPLETED</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </select>
                    <p className="text-xs text-gray-500 mt-1">
                      DRAFT: Not visible to users | ACTIVE: Live and accepting submissions
                    </p>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end gap-4 pt-6 border-t border-[#e6e2da]">
                  <Link
                    href="/dashboard/staff/contests"
                    className="px-6 py-2 border border-[#e6e2da] rounded text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </Link>
                  <button
                    type="submit"
                    disabled={createMutation.isPending || updateMutation.isPending}
                    className="px-6 py-2 staff-btn-primary transition-colors flex items-center gap-2 disabled:opacity-50"
                  >
                    <IconDeviceFloppy className="h-4 w-4" />
                    {createMutation.isPending || updateMutation.isPending
                      ? "Saving..."
                      : isEditMode
                      ? "Update Contest"
                      : "Create Contest"}
                  </button>
                </div>

                {/* Error Messages */}
                {(createMutation.isError || updateMutation.isError) && (
                  <div className="text-red-600 text-sm p-3 bg-red-50 rounded border border-red-200">
                    Failed to {isEditMode ? "update" : "create"} contest. Please try
                    again.
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
