"use client";
import React from "react";
import { AdminSidebar } from "@/components/admin-sidebar";
import { Breadcrumb } from "@/components/breadcrumb";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useQuery } from "@tanstack/react-query";
import { getSystemStatistics } from "@/apis/admin";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  PieLabelRenderProps,
} from "recharts";
import { Users, Trophy, Palette, Vote, Award, Image, Target } from "lucide-react";

export default function AdminDashboardPage() {
  // Fetch system statistics
  const { data: stats, isLoading } = useQuery({
    queryKey: ["system-statistics"],
    queryFn: getSystemStatistics,
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const systemStats = stats?.data;

  // Prepare chart data
  const userRoleData = systemStats ? [
    { name: "Competitors", value: systemStats.users.byRole.competitors, color: "#8884d8" },
    { name: "Guardians", value: systemStats.users.byRole.guardians, color: "#82ca9d" },
    { name: "Examiners", value: systemStats.users.byRole.examiners, color: "#ffc658" },
    { name: "Staff", value: systemStats.users.byRole.staffs, color: "#ff7c7c" },
    { name: "Admins", value: systemStats.users.byRole.admins, color: "#8dd1e1" },
  ] : [];

  const contestStatusData = systemStats ? [
    { name: "Active", value: systemStats.contests.active, color: "#10b981" },
    { name: "Upcoming", value: systemStats.contests.upcoming, color: "#f59e0b" },
    { name: "Ended", value: systemStats.contests.ended, color: "#ef4444" },
    { name: "Completed", value: systemStats.contests.completed, color: "#6366f1" },
  ] : [];

  const paintingStatusData = systemStats ? [
    { name: "Approved", value: systemStats.paintings.approved },
    { name: "Pending", value: systemStats.paintings.pending },
    { name: "Rejected", value: systemStats.paintings.rejected },
  ] : [];

  const exhibitionData = systemStats ? [
    { name: "Active", value: systemStats.exhibitions.active, color: "#10b981" },
    { name: "Completed", value: systemStats.exhibitions.completed, color: "#6366f1" },
  ] : [];

  const campaignData = systemStats ? [
    { name: "Active", value: systemStats.campaigns.active, color: "#f59e0b" },
    { name: "Completed", value: systemStats.campaigns.completed, color: "#8b5cf6" },
  ] : [];

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
        <AdminSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader title="Admin Dashboard" />
          <div className="flex flex-1 flex-col">
            <div className="px-4 lg:px-6 py-2 border-b border-gray-200 bg-white">
              <Breadcrumb items={[]} homeHref="/dashboard/admin" />
            </div>
            <div className="flex items-center justify-center flex-1">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#423137]"></div>
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
      <AdminSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader title="Admin Dashboard" />
        <div className="flex flex-1 flex-col">
          <div className="px-4 lg:px-6 py-2 border-b border-gray-200 bg-white">
            <Breadcrumb items={[]} homeHref="/dashboard/admin" />
          </div>
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
              {/* Overview Cards */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-lg border border-gray-200 bg-white p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Users</p>
                      <p className="text-3xl font-bold text-gray-900">
                        {systemStats?.users.total || 0}
                      </p>
                    </div>
                    <div className="rounded-lg bg-blue-50 p-3">
                      <Users className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    {systemStats?.users.active || 0} active users
                  </p>
                </div>

                <div className="rounded-lg border border-gray-200 bg-white p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Contests</p>
                      <p className="text-3xl font-bold text-gray-900">
                        {systemStats?.contests.total || 0}
                      </p>
                    </div>
                    <div className="rounded-lg bg-orange-50 p-3">
                      <Trophy className="h-6 w-6 text-orange-600" />
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    {systemStats?.contests.active || 0} active contests
                  </p>
                </div>

                <div className="rounded-lg border border-gray-200 bg-white p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Paintings</p>
                      <p className="text-3xl font-bold text-gray-900">
                        {systemStats?.paintings.total || 0}
                      </p>
                    </div>
                    <div className="rounded-lg bg-green-50 p-3">
                      <Palette className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    {systemStats?.paintings.pending || 0} pending reviews
                  </p>
                </div>

                <div className="rounded-lg border border-gray-200 bg-white p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Evaluations</p>
                      <p className="text-3xl font-bold text-gray-900">
                        {systemStats?.evaluations.total || 0}
                      </p>
                    </div>
                    <div className="rounded-lg bg-purple-50 p-3">
                      <Vote className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    System evaluations
                  </p>
                </div>
              </div>

              {/* Charts Section */}
              <div className="space-y-6">
                {/* Row 1: User Roles Distribution - Full Width */}
                <div className="rounded-lg border border-gray-200 bg-white p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    User Roles Distribution
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={userRoleData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={(props: PieLabelRenderProps) => `${props.name} ${((props.percent as number) * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {userRoleData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Row 2: Contest Status + Painting Status */}
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="rounded-lg border border-gray-200 bg-white p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Contest Status Overview
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={contestStatusData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="rounded-lg border border-gray-200 bg-white p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Painting Submissions Status
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={paintingStatusData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value" fill="#82ca9d" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Row 3: Votes + Awards */}
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="rounded-lg border border-gray-200 bg-white p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Votes Overview
                    </h3>
                    <div className="flex items-center justify-center h-48">
                      <div className="text-center">
                        <Vote className="h-16 w-16 text-purple-500 mx-auto mb-4" />
                        <p className="text-3xl font-bold text-gray-900">{systemStats?.votes.total || 0}</p>
                        <p className="text-sm text-gray-600">Total Votes</p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg border border-gray-200 bg-white p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Awards Overview
                    </h3>
                    <div className="flex items-center justify-center h-48">
                      <div className="text-center">
                        <Award className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
                        <p className="text-3xl font-bold text-gray-900">{systemStats?.awards.total || 0}</p>
                        <p className="text-sm text-gray-600">Total Awards</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Row 4: Exhibitions + Campaigns */}
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="rounded-lg border border-gray-200 bg-white p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Exhibitions Status
                    </h3>
                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                        <Pie
                          data={exhibitionData}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={70}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {exhibitionData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="rounded-lg border border-gray-200 bg-white p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Campaigns Status
                    </h3>
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart data={campaignData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
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
