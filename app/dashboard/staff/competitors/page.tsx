"use client";

import { useState } from "react";
import Link from "next/link";
import { StaffSidebar } from "@/components/staff-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Breadcrumb } from "@/components/breadcrumb";
import { Competitor, CompetitorStatus } from "@/types/dashboard";
import {
  IconUser,
  IconSearch,
  IconFilter,
  IconEye,
  IconPalette,
  IconPlus,
  IconMail,
  IconPhone,
  IconCalendar,
  IconMapPin,
  IconAward,
  IconClock,
} from "@tabler/icons-react";

export default function CompetitorsManagementPage() {
  const [competitors] = useState<Competitor[]>([
    {
      id: "1",
      fullName: "Alice Johnson",
      username: "alice_art",
      email: "alice.johnson@email.com",
      phone: "+1 (555) 123-4567",
      age: 12,
      school: "Springfield Elementary",
      location: "Springfield, IL",
      status: "ACTIVE",
      joinedDate: "2025-01-15",
      lastActive: "2025-10-06",
      totalPaintings: 8,
      approvedPaintings: 6,
      pendingPaintings: 1,
      rejectedPaintings: 1,
      competitionsEntered: 3,
      awardsWon: 2,
      guardianName: "Sarah Johnson",
      guardianEmail: "sarah.johnson@email.com",
    },
    {
      id: "2",
      fullName: "Bob Smith",
      username: "bob_creates",
      email: "bob.smith@email.com",
      phone: "+1 (555) 234-5678",
      age: 15,
      school: "Lincoln High School",
      location: "Chicago, IL",
      status: "ACTIVE",
      joinedDate: "2025-02-20",
      lastActive: "2025-10-05",
      totalPaintings: 12,
      approvedPaintings: 10,
      pendingPaintings: 2,
      rejectedPaintings: 0,
      competitionsEntered: 5,
      awardsWon: 3,
      guardianName: "Mike Smith",
      guardianEmail: "mike.smith@email.com",
    },
    {
      id: "3",
      fullName: "Charlie Brown",
      username: "charlie_draws",
      email: "charlie.brown@email.com",
      phone: "+1 (555) 345-6789",
      age: 10,
      school: "Washington Elementary",
      location: "Milwaukee, WI",
      status: "ACTIVE",
      joinedDate: "2025-03-10",
      lastActive: "2025-10-04",
      totalPaintings: 5,
      approvedPaintings: 4,
      pendingPaintings: 0,
      rejectedPaintings: 1,
      competitionsEntered: 2,
      awardsWon: 1,
      guardianName: "Lucy Brown",
      guardianEmail: "lucy.brown@email.com",
    },
    {
      id: "4",
      fullName: "Diana Lee",
      username: "diana_art",
      email: "diana.lee@email.com",
      phone: "+1 (555) 456-7890",
      age: 14,
      school: "Jefferson Middle School",
      location: "Madison, WI",
      status: "ACTIVE",
      joinedDate: "2025-04-05",
      lastActive: "2025-10-03",
      totalPaintings: 9,
      approvedPaintings: 7,
      pendingPaintings: 1,
      rejectedPaintings: 1,
      competitionsEntered: 4,
      awardsWon: 2,
      guardianName: "Tom Lee",
      guardianEmail: "tom.lee@email.com",
    },
    {
      id: "5",
      fullName: "Eva Martinez",
      username: "eva_creates",
      email: "eva.martinez@email.com",
      phone: "+1 (555) 567-8901",
      age: 16,
      school: "Roosevelt High School",
      location: "Chicago, IL",
      status: "ACTIVE",
      joinedDate: "2025-05-12",
      lastActive: "2025-10-02",
      totalPaintings: 15,
      approvedPaintings: 13,
      pendingPaintings: 2,
      rejectedPaintings: 0,
      competitionsEntered: 6,
      awardsWon: 4,
      guardianName: "Maria Martinez",
      guardianEmail: "maria.martinez@email.com",
    },
    {
      id: "6",
      fullName: "Frank Wilson",
      username: "frank_paints",
      email: "frank.wilson@email.com",
      phone: "+1 (555) 678-9012",
      age: 11,
      school: "Adams Elementary",
      location: "Springfield, IL",
      status: "INACTIVE",
      joinedDate: "2025-06-18",
      lastActive: "2025-09-15",
      totalPaintings: 3,
      approvedPaintings: 2,
      pendingPaintings: 0,
      rejectedPaintings: 1,
      competitionsEntered: 1,
      awardsWon: 0,
      guardianName: "Helen Wilson",
      guardianEmail: "helen.wilson@email.com",
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<
    CompetitorStatus | "ALL"
  >("ALL");
  const [selectedCompetitor, setSelectedCompetitor] =
    useState<Competitor | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const statusOptions = ["ALL", "ACTIVE", "INACTIVE", "SUSPENDED"];

  const filteredCompetitors = competitors.filter((competitor) => {
    const matchesSearch =
      competitor.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      competitor.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      competitor.username.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      selectedStatus === "ALL" || competitor.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadgeColor = (status: CompetitorStatus) => {
    const colors = {
      ACTIVE: "bg-green-100 text-green-800",
      INACTIVE: "bg-gray-100 text-gray-800",
      SUSPENDED: "bg-red-100 text-red-800",
    };
    return colors[status];
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const openViewModal = (competitor: Competitor) => {
    setSelectedCompetitor(competitor);
    setIsViewModalOpen(true);
  };

  const totalCompetitors = competitors.length;
  const activeCompetitors = competitors.filter(
    (c) => c.status === "ACTIVE"
  ).length;
  const totalPaintings = competitors.reduce(
    (sum, c) => sum + c.totalPaintings,
    0
  );
  const pendingPaintings = competitors.reduce(
    (sum, c) => sum + c.pendingPaintings,
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
        <SiteHeader title="Competitor Management" />
        <div className="flex flex-1 flex-col">
          <div className="px-4 lg:px-6 py-2 border-b border-gray-200 bg-white">
            <Breadcrumb
              items={[{ label: "Competitor Management" }]}
              homeHref="/dashboard/staff"
            />
          </div>
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
              {/* Page Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    All Competitors ({filteredCompetitors.length})
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Manage all registered competitors and their activities
                  </p>
                </div>
                <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2">
                  <IconPlus className="h-4 w-4" />
                  Add Competitor
                </button>
              </div>

              {/* Statistics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="rounded-lg border border-gray-200 bg-white p-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-blue-100 p-2">
                      <IconUser className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Total Competitors
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {totalCompetitors}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border border-gray-200 bg-white p-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-green-100 p-2">
                      <IconUser className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Active Competitors
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {activeCompetitors}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border border-gray-200 bg-white p-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-purple-100 p-2">
                      <IconPalette className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Total Paintings
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {totalPaintings}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border border-gray-200 bg-white p-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-yellow-100 p-2">
                      <IconClock className="h-5 w-5 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Pending Reviews
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {pendingPaintings}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link
                  href="/dashboard/staff/competitors/paintings/pending"
                  className="rounded-lg border border-gray-200 bg-white p-4 hover:shadow-md transition-shadow duration-200 group"
                >
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-yellow-100 p-3 group-hover:bg-yellow-200 transition-colors">
                      <IconClock className="h-6 w-6 text-yellow-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        Review Paintings
                      </h3>
                      <p className="text-sm text-gray-600">
                        Approve or reject pending submissions
                      </p>
                    </div>
                  </div>
                </Link>

                <Link
                  href="/dashboard/staff/competitors/paintings/approved"
                  className="rounded-lg border border-gray-200 bg-white p-4 hover:shadow-md transition-shadow duration-200 group"
                >
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-green-100 p-3 group-hover:bg-green-200 transition-colors">
                      <IconAward className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        Approved Paintings
                      </h3>
                      <p className="text-sm text-gray-600">
                        View all approved artworks
                      </p>
                    </div>
                  </div>
                </Link>

                <Link
                  href="/dashboard/staff/competitors/search"
                  className="rounded-lg border border-gray-200 bg-white p-4 hover:shadow-md transition-shadow duration-200 group"
                >
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-blue-100 p-3 group-hover:bg-blue-200 transition-colors">
                      <IconSearch className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        Search & Filter
                      </h3>
                      <p className="text-sm text-gray-600">
                        Advanced competitor search
                      </p>
                    </div>
                  </div>
                </Link>
              </div>

              {/* Search and Filter */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by name, email, or username..."
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
                        e.target.value as CompetitorStatus | "ALL"
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
              </div>

              {/* Competitors Table */}
              <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Competitor
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Contact
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Paintings
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
                      {filteredCompetitors.length === 0 ? (
                        <tr>
                          <td
                            colSpan={6}
                            className="px-6 py-12 text-center text-gray-500"
                          >
                            No competitors found matching your criteria
                          </td>
                        </tr>
                      ) : (
                        filteredCompetitors.map((competitor) => (
                          <tr key={competitor.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                                  {getInitials(competitor.fullName)}
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">
                                    {competitor.fullName}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    @{competitor.username} • Age{" "}
                                    {competitor.age}
                                  </div>
                                  {competitor.school && (
                                    <div className="text-xs text-gray-400">
                                      {competitor.school}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {competitor.email}
                              </div>
                              {competitor.phone && (
                                <div className="text-sm text-gray-500">
                                  {competitor.phone}
                                </div>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`inline-flex rounded-lg px-2 py-1 text-xs font-semibold ${getStatusBadgeColor(
                                  competitor.status
                                )}`}
                              >
                                {competitor.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                <div className="flex items-center gap-4">
                                  <span className="text-green-600 font-medium">
                                    {competitor.approvedPaintings} ✓
                                  </span>
                                  <span className="text-yellow-600 font-medium">
                                    {competitor.pendingPaintings} ⏳
                                  </span>
                                  <span className="text-red-600 font-medium">
                                    {competitor.rejectedPaintings} ✗
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <div>
                                <div>Joined: {competitor.joinedDate}</div>
                                <div>Last active: {competitor.lastActive}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button
                                onClick={() => openViewModal(competitor)}
                                className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors"
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

      {/* Competitor Details Modal */}
      {isViewModalOpen && selectedCompetitor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xl">
                    {getInitials(selectedCompetitor.fullName)}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      {selectedCompetitor.fullName}
                    </h3>
                    <p className="text-gray-600">
                      @{selectedCompetitor.username}
                    </p>
                    <span
                      className={`inline-flex rounded-lg px-3 py-1 text-sm font-semibold mt-2 ${getStatusBadgeColor(
                        selectedCompetitor.status
                      )}`}
                    >
                      {selectedCompetitor.status}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setIsViewModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <IconEye className="h-6 w-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900">
                    Basic Information
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <IconUser className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Age</p>
                        <p className="text-base text-gray-900">
                          {selectedCompetitor.age} years old
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <IconMail className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Email
                        </p>
                        <p className="text-base text-gray-900">
                          {selectedCompetitor.email}
                        </p>
                      </div>
                    </div>
                    {selectedCompetitor.phone && (
                      <div className="flex items-center gap-3">
                        <IconPhone className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">
                            Phone
                          </p>
                          <p className="text-base text-gray-900">
                            {selectedCompetitor.phone}
                          </p>
                        </div>
                      </div>
                    )}
                    {selectedCompetitor.location && (
                      <div className="flex items-center gap-3">
                        <IconMapPin className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">
                            Location
                          </p>
                          <p className="text-base text-gray-900">
                            {selectedCompetitor.location}
                          </p>
                        </div>
                      </div>
                    )}
                    {selectedCompetitor.school && (
                      <div className="flex items-center gap-3">
                        <IconAward className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">
                            School
                          </p>
                          <p className="text-base text-gray-900">
                            {selectedCompetitor.school}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Activity Statistics */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900">
                    Activity Statistics
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-lg border border-gray-200 p-4">
                      <div className="text-2xl font-bold text-purple-600">
                        {selectedCompetitor.totalPaintings}
                      </div>
                      <div className="text-sm text-gray-600">
                        Total Paintings
                      </div>
                    </div>
                    <div className="rounded-lg border border-gray-200 p-4">
                      <div className="text-2xl font-bold text-green-600">
                        {selectedCompetitor.approvedPaintings}
                      </div>
                      <div className="text-sm text-gray-600">Approved</div>
                    </div>
                    <div className="rounded-lg border border-gray-200 p-4">
                      <div className="text-2xl font-bold text-yellow-600">
                        {selectedCompetitor.pendingPaintings}
                      </div>
                      <div className="text-sm text-gray-600">Pending</div>
                    </div>
                    <div className="rounded-lg border border-gray-200 p-4">
                      <div className="text-2xl font-bold text-red-600">
                        {selectedCompetitor.rejectedPaintings}
                      </div>
                      <div className="text-sm text-gray-600">Rejected</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">
                        Competitions Entered
                      </span>
                      <span className="font-semibold">
                        {selectedCompetitor.competitionsEntered}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Awards Won</span>
                      <span className="font-semibold">
                        {selectedCompetitor.awardsWon}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Guardian Information */}
                {(selectedCompetitor.guardianName ||
                  selectedCompetitor.guardianEmail) && (
                  <div className="space-y-4 lg:col-span-2">
                    <h4 className="text-lg font-semibold text-gray-900">
                      Guardian Information
                    </h4>
                    <div className="rounded-lg border border-gray-200 p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {selectedCompetitor.guardianName && (
                          <div>
                            <p className="text-sm font-medium text-gray-500">
                              Guardian Name
                            </p>
                            <p className="text-base text-gray-900">
                              {selectedCompetitor.guardianName}
                            </p>
                          </div>
                        )}
                        {selectedCompetitor.guardianEmail && (
                          <div>
                            <p className="text-sm font-medium text-gray-500">
                              Guardian Email
                            </p>
                            <p className="text-base text-gray-900">
                              {selectedCompetitor.guardianEmail}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Activity Timeline */}
                <div className="space-y-4 lg:col-span-2">
                  <h4 className="text-lg font-semibold text-gray-900">
                    Activity Timeline
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <IconCalendar className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Joined ArtChain
                        </p>
                        <p className="text-sm text-gray-600">
                          {selectedCompetitor.joinedDate}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <IconClock className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Last Active
                        </p>
                        <p className="text-sm text-gray-600">
                          {selectedCompetitor.lastActive}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </SidebarProvider>
  );
}
