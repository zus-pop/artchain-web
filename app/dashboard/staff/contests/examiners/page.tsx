"use client";

import { Breadcrumb } from "@/components/breadcrumb";
import { SiteHeader } from "@/components/site-header";
import { StaffSidebar } from "@/components/staff-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import {
  IconEye,
  IconFilter,
  IconPlus,
  IconSearch,
  IconStar,
  IconTrophy,
  IconUsers,
} from "@tabler/icons-react";
import Link from "next/link";
import { useState } from "react";

type ExaminerStatus = "ACTIVE" | "INACTIVE" | "PENDING";

interface Examiner {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  specialization: string[];
  experience: string;
  status: ExaminerStatus;
  contestsJudged: number;
  averageRating: number;
  joinedDate: string;
  lastActive: string;
  totalSubmissionsReviewed: number;
  currentContests: number;
}

export default function ExaminersManagementPage() {
  const [examiners] = useState<Examiner[]>([
    {
      id: "1",
      fullName: "Dr. Sarah Mitchell",
      email: "sarah.mitchell@artacademy.edu",
      phone: "+1 (555) 123-4567",
      specialization: ["Mixed Media", "Traditional Painting"],
      experience: "15 years",
      status: "ACTIVE",
      contestsJudged: 24,
      averageRating: 4.8,
      joinedDate: "2023-01-15",
      lastActive: "2025-10-06",
      totalSubmissionsReviewed: 450,
      currentContests: 2,
    },
    {
      id: "2",
      fullName: "Prof. Michael Chen",
      email: "michael.chen@designschool.com",
      phone: "+1 (555) 234-5678",
      specialization: ["Digital Art", "Graphic Design"],
      experience: "12 years",
      status: "ACTIVE",
      contestsJudged: 18,
      averageRating: 4.6,
      joinedDate: "2023-03-20",
      lastActive: "2025-10-05",
      totalSubmissionsReviewed: 320,
      currentContests: 1,
    },
    {
      id: "3",
      fullName: "Emma Rodriguez",
      email: "emma.rodriguez@artgallery.com",
      phone: "+1 (555) 345-6789",
      specialization: ["Photography", "Contemporary Art"],
      experience: "8 years",
      status: "ACTIVE",
      contestsJudged: 12,
      averageRating: 4.7,
      joinedDate: "2024-01-10",
      lastActive: "2025-10-04",
      totalSubmissionsReviewed: 180,
      currentContests: 1,
    },
    {
      id: "4",
      fullName: "David Thompson",
      email: "david.thompson@sculpturestudio.org",
      phone: "+1 (555) 456-7890",
      specialization: ["Sculpture", "3D Art"],
      experience: "20 years",
      status: "INACTIVE",
      contestsJudged: 35,
      averageRating: 4.9,
      joinedDate: "2022-06-15",
      lastActive: "2025-08-20",
      totalSubmissionsReviewed: 620,
      currentContests: 0,
    },
    {
      id: "5",
      fullName: "Lisa Park",
      email: "lisa.park@arteducation.org",
      phone: "+1 (555) 567-8901",
      specialization: ["Children's Art", "Mixed Media"],
      experience: "10 years",
      status: "PENDING",
      contestsJudged: 0,
      averageRating: 0,
      joinedDate: "2025-10-01",
      lastActive: "2025-10-01",
      totalSubmissionsReviewed: 0,
      currentContests: 0,
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<ExaminerStatus | "ALL">(
    "ALL"
  );
  const [selectedSpecialization, setSelectedSpecialization] =
    useState<string>("ALL");

  const statusOptions = ["ALL", "ACTIVE", "INACTIVE", "PENDING"];
  const specializationOptions = [
    "ALL",
    "Mixed Media",
    "Digital Art",
    "Traditional Painting",
    "Photography",
    "Sculpture",
    "Contemporary Art",
    "Graphic Design",
    "3D Art",
    "Children's Art",
  ];

  const filteredExaminers = examiners.filter((examiner) => {
    const matchesSearch =
      examiner.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      examiner.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      examiner.specialization.some((spec) =>
        spec.toLowerCase().includes(searchQuery.toLowerCase())
      );
    const matchesStatus =
      selectedStatus === "ALL" || examiner.status === selectedStatus;
    const matchesSpecialization =
      selectedSpecialization === "ALL" ||
      examiner.specialization.includes(selectedSpecialization);
    return matchesSearch && matchesStatus && matchesSpecialization;
  });

  const getStatusBadgeColor = (status: ExaminerStatus) => {
    const colors = {
      ACTIVE: "bg-green-100 text-green-800",
      INACTIVE: "bg-gray-100 text-gray-800",
      PENDING: "bg-yellow-100 text-yellow-800",
    };
    return colors[status];
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <IconStar
        key={i}
        className={`h-3 w-3 ${
          i < Math.floor(rating)
            ? "text-yellow-400 fill-current"
            : "text-gray-300"
        }`}
      />
    ));
  };

  const totalExaminers = examiners.length;
  const activeExaminers = examiners.filter((e) => e.status === "ACTIVE").length;
  const totalContestsJudged = examiners.reduce(
    (sum, e) => sum + e.contestsJudged,
    0
  );
  const averageRating = examiners
    .filter((e) => e.averageRating > 0)
    .reduce((sum, e, _, arr) => sum + e.averageRating / arr.length, 0);

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
        <SiteHeader title="Examiner Management" />
        <div className="flex flex-1 flex-col">
          <div className="px-4 lg:px-6 py-2 border-b border-gray-200 bg-white">
            <Breadcrumb
              items={[
                {
                  label: "Contest Management",
                  href: "/dashboard/staff/contests",
                },
                { label: "Examiners" },
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
                    All Examiners ({filteredExaminers.length})
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Manage contest judges and their assignments
                  </p>
                </div>
                <Link
                  href="/dashboard/staff/contests/examiners/invite"
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <IconPlus className="h-4 w-4" />
                  Invite Examiner
                </Link>
              </div>

              {/* Statistics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="rounded-lg border border-gray-200 bg-white p-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-blue-100 p-2">
                      <IconUsers className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Total Examiners
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {totalExaminers}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border border-gray-200 bg-white p-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-green-100 p-2">
                      <IconUsers className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Active Examiners
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {activeExaminers}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border border-gray-200 bg-white p-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-purple-100 p-2">
                      <IconTrophy className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Contests Judged
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {totalContestsJudged}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border border-gray-200 bg-white p-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-yellow-100 p-2">
                      <IconStar className="h-5 w-5 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Avg. Rating
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {averageRating.toFixed(1)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Search and Filter */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by name, email, or specialization..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <IconFilter className="h-5 w-5 text-gray-400" />
                  <select
                    value={selectedStatus}
                    onChange={(e) =>
                      setSelectedStatus(
                        e.target.value as ExaminerStatus | "ALL"
                      )
                    }
                    className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={selectedSpecialization}
                    onChange={(e) => setSelectedSpecialization(e.target.value)}
                    className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {specializationOptions.map((spec) => (
                      <option key={spec} value={spec}>
                        {spec}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Examiners Table */}
              <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Examiner
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Specialization
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Performance
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Activity
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredExaminers.length === 0 ? (
                        <tr>
                          <td
                            colSpan={6}
                            className="px-6 py-12 text-center text-gray-500"
                          >
                            No examiners found matching your criteria
                          </td>
                        </tr>
                      ) : (
                        filteredExaminers.map((examiner) => (
                          <tr key={examiner.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                                  {examiner.fullName
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")
                                    .slice(0, 2)}
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">
                                    {examiner.fullName}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {examiner.email}
                                  </div>
                                  <div className="text-xs text-gray-400">
                                    {examiner.experience} experience
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {examiner.specialization.slice(0, 2).join(", ")}
                                {examiner.specialization.length > 2 && (
                                  <span className="text-gray-500">
                                    {" "}
                                    +{examiner.specialization.length - 2} more
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`inline-flex rounded-lg px-2 py-1 text-xs font-semibold ${getStatusBadgeColor(
                                  examiner.status
                                )}`}
                              >
                                {examiner.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <div className="flex items-center gap-2">
                                <div className="flex">
                                  {renderStars(examiner.averageRating)}
                                </div>
                                <span className="font-medium">
                                  {examiner.averageRating > 0
                                    ? examiner.averageRating.toFixed(1)
                                    : "N/A"}
                                </span>
                              </div>
                              <div className="text-xs text-gray-400 mt-1">
                                {examiner.contestsJudged} contests judged
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <div>
                                <div>Joined: {examiner.joinedDate}</div>
                                <div>Last active: {examiner.lastActive}</div>
                                <div className="text-xs text-blue-600 font-medium mt-1">
                                  {examiner.currentContests} active contests
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button
                                className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors mr-2"
                                title="View Details"
                              >
                                <IconEye className="h-4 w-4" />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
