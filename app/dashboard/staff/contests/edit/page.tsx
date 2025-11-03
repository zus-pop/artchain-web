"use client";

import { getStaffContestById, updateStaffContest } from "@/apis/staff";
import { Breadcrumb } from "@/components/breadcrumb";
import { SiteHeader } from "@/components/site-header";
import { StaffSidebar } from "@/components/staff-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Contest } from "@/types/dashboard";
import { UpdateContestRequest } from "@/types/staff/contest-dto";
import { IconArrowLeft, IconDeviceFloppy, IconX } from "@tabler/icons-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { toast } from "sonner";

function EditContestContent() {
  const searchParams = useSearchParams();
  const contestId = searchParams.get("id");
  const router = useRouter();
  const queryClient = useQueryClient();

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    round2Quantity: 0,
    startDate: "",
    endDate: "",
    roundStartDate: "",
    roundEndDate: "",
    roundSubmissionDeadline: "",
    roundResultAnnounceDate: "",
    roundSendOriginalDeadline: "",
  });

  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [ruleFile, setRuleFile] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);

  // Fetch contest details
  const { data: contestData, isLoading } = useQuery({
    queryKey: ["contest-detail", contestId],
    queryFn: () => getStaffContestById(Number(contestId)),
    enabled: !!contestId,
  });

  const contest = contestData?.data as Contest;

  // Initialize form with contest data
  useEffect(() => {
    if (contest) {
      // Find round 1 data (round with ID 1 or name containing "round 1")
      const round1Data = contest.rounds?.find(
        (round: any) =>
          round.roundId === 1 ||
          round.name?.toLowerCase().includes("round 1") ||
          round.name?.toLowerCase().includes("round_1")
      );

      setFormData({
        title: contest.title || "",
        description: contest.description || "",
        round2Quantity: contest.round2Quantity,
        startDate: contest.startDate
          ? new Date(contest.startDate).toISOString().split("T")[0]
          : "",
        endDate: contest.endDate
          ? new Date(contest.endDate).toISOString().split("T")[0]
          : "",
        roundStartDate: round1Data?.startDate
          ? new Date(round1Data.startDate).toISOString().split("T")[0]
          : "",
        roundEndDate: round1Data?.endDate
          ? new Date(round1Data.endDate).toISOString().split("T")[0]
          : "",
        roundSubmissionDeadline: round1Data?.submissionDeadline
          ? new Date(round1Data.submissionDeadline).toISOString().split("T")[0]
          : "",
        roundResultAnnounceDate: round1Data?.resultAnnounceDate
          ? new Date(round1Data.resultAnnounceDate).toISOString().split("T")[0]
          : "",
        roundSendOriginalDeadline: round1Data?.sendOriginalDeadline
          ? new Date(round1Data.sendOriginalDeadline)
              .toISOString()
              .split("T")[0]
          : "",
      });

      if (contest.bannerUrl) {
        setBannerPreview(contest.bannerUrl);
      }
    }
  }, [contest]);

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: updateStaffContest,
    onSuccess: () => {
      toast.success("Contest updated successfully!");
      queryClient.invalidateQueries({
        queryKey: ["contest-detail", contestId],
      });
      queryClient.invalidateQueries({
        queryKey: ["staff-contests"],
      });
      router.push(`/dashboard/staff/contests/detail?id=${contestId}`);
    },
    onError: (error) => {
      let message = error.message;
      if (error instanceof AxiosError) {
        message = error.response?.data.message;
      }
      toast.error(message);
    },
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "banner" | "rule"
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      if (type === "banner") {
        setBannerFile(file);
        const previewUrl = URL.createObjectURL(file);
        setBannerPreview(previewUrl);
      } else {
        setRuleFile(file);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!contestId) return;

    const updateData: UpdateContestRequest = {
      contestId,
      ...formData,
    };

    // Add files if they exist
    if (bannerFile) {
      updateData.banner = bannerFile;
    }
    if (ruleFile) {
      updateData.rule = ruleFile;
    }

    updateMutation.mutate(updateData);
  };

  const handleCancel = () => {
    router.push(`/dashboard/staff/contests/detail?id=${contestId}`);
  };

  if (!contestId) {
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
          <SiteHeader title="Edit Contest" />
          <div className="flex flex-1 items-center justify-center">
            <div className="text-gray-500">Contest ID is required</div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

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
          <SiteHeader title="Edit Contest" />
          <div className="flex flex-1 items-center justify-center">
            <div className="text-gray-500">Loading contest details...</div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  if (!contest) {
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
          <SiteHeader title="Edit Contest" />
          <div className="flex flex-1 items-center justify-center">
            <div className="text-gray-500">Contest not found</div>
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
        <SiteHeader title="Edit Contest" />
        <div className="flex flex-1 flex-col">
          <div className="px-4 lg:px-6 py-2 border-b border-[#e6e2da] bg-white">
            <Breadcrumb
              items={[
                {
                  label: "Contest Management",
                  href: "/dashboard/staff/contests",
                },
                {
                  label: contest.title,
                  href: `/dashboard/staff/contests/detail?id=${contestId}`,
                },
                { label: "Edit" },
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
                    href={`/dashboard/staff/contests/detail?id=${contestId}`}
                    className="border-2 border-[#e6e2da] p-2 hover:bg-[#f9f7f4] transition-colors"
                  >
                    <IconArrowLeft className="h-5 w-5 staff-text-secondary" />
                  </Link>
                  <div>
                    <h2 className="text-2xl font-bold staff-text-primary">
                      Edit Contest
                    </h2>
                    <p className="text-sm staff-text-secondary mt-1">
                      Contest ID: {contest.contestId}
                    </p>
                  </div>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="staff-card p-6">
                  <h3 className="text-lg font-bold staff-text-primary mb-4">
                    Basic Information
                  </h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium staff-text-primary mb-2">
                        Title *
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-[#e6e2da] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium staff-text-primary mb-2">
                        Number of round 2 competitors
                      </label>
                      <input
                        type="number"
                        name="round2Quantity"
                        value={formData.round2Quantity}
                        minLength={16}
                        step={4}
                        onChange={handleInputChange}
                        min="0"
                        className="w-full px-3 py-2 border border-[#e6e2da] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium staff-text-primary mb-2">
                      Description *
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                      rows={4}
                      className="w-full px-3 py-2 border border-[#e6e2da] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Dates */}
                <div className="staff-card p-6">
                  <h3 className="text-lg font-bold staff-text-primary mb-4">
                    Contest Dates
                  </h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium staff-text-primary mb-2">
                        Start Date *
                      </label>
                      <input
                        type="date"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-[#e6e2da] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium staff-text-primary mb-2">
                        End Date *
                      </label>
                      <input
                        type="date"
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-[#e6e2da] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Round Dates */}
                <div className="staff-card p-6">
                  <h3 className="text-lg font-bold staff-text-primary mb-4">
                    Round Dates
                  </h3>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <div>
                      <label className="block text-sm font-medium staff-text-primary mb-2">
                        Round Start Date
                      </label>
                      <input
                        type="date"
                        name="roundStartDate"
                        value={formData.roundStartDate}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-[#e6e2da] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium staff-text-primary mb-2">
                        Round End Date
                      </label>
                      <input
                        type="date"
                        name="roundEndDate"
                        value={formData.roundEndDate}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-[#e6e2da] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium staff-text-primary mb-2">
                        Submission Deadline
                      </label>
                      <input
                        type="date"
                        name="roundSubmissionDeadline"
                        value={formData.roundSubmissionDeadline}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-[#e6e2da] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium staff-text-primary mb-2">
                        Result Announce Date
                      </label>
                      <input
                        type="date"
                        name="roundResultAnnounceDate"
                        value={formData.roundResultAnnounceDate}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-[#e6e2da] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium staff-text-primary mb-2">
                        Original Deadline
                      </label>
                      <input
                        type="date"
                        name="roundSendOriginalDeadline"
                        value={formData.roundSendOriginalDeadline}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-[#e6e2da] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Files */}
                <div className="staff-card p-6">
                  <h3 className="text-lg font-bold staff-text-primary mb-4">
                    Files
                  </h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium staff-text-primary mb-2">
                        Banner Image
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, "banner")}
                        className="w-full px-3 py-2 border border-[#e6e2da] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      {bannerPreview && (
                        <div className="mt-2">
                          <Image
                            src={bannerPreview}
                            alt="Banner preview"
                            width={200}
                            height={100}
                            className="object-cover rounded border"
                          />
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium staff-text-primary mb-2">
                        Rules File
                      </label>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => handleFileChange(e, "rule")}
                        className="w-full px-3 py-2 border border-[#e6e2da] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      {ruleFile && (
                        <p className="text-sm staff-text-secondary mt-1">
                          Selected: {ruleFile.name}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-4 justify-end">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-6 py-2 border-2 border-[#e6e2da] staff-text-primary font-semibold hover:bg-[#f7f7f7] transition-colors flex items-center gap-2"
                  >
                    <IconX className="h-4 w-4" />
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={updateMutation.isPending}
                    className="px-6 py-2 bg-linear-to-r from-[#d9534f] to-[#e67e73] text-white font-semibold shadow-md hover:shadow-lg transition-shadow disabled:opacity-50 flex items-center gap-2"
                  >
                    <IconDeviceFloppy className="h-4 w-4" />
                    {updateMutation.isPending ? "Saving..." : "Save Changes"}
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

export default function EditContestPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#d9534f]"></div>
        </div>
      }
    >
      <EditContestContent />
    </Suspense>
  );
}
