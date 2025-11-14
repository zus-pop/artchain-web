"use client";
import React, { useState, useMemo } from "react";
import { AdminSidebar } from "@/components/admin-sidebar";
import { Breadcrumb } from "@/components/breadcrumb";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useQuery } from "@tanstack/react-query";
import { getSystemStatistics } from "@/apis/admin";
import {
  getUserGrowth,
  getTopCompetitors,
  getTopExaminers,
  getMostVotedPaintings,
} from "@/apis/admin";
import type {
  ApiListResponse,
  TopCompetitorItem,
  TopExaminerItem,
  TopPaintingItem,
} from "@/types/admin/toplists";
import { UserGrowthItem, UserGrowthResponse } from "@/types/admin/system";

interface TickProps {
  x: number;
  y: number;
  payload: {
    value: string;
  };
}
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
import {
  Users,
  Trophy,
  Palette,
  Vote,
  Award,
  Image,
  Target,
} from "lucide-react";
import Loader from "@/components/Loaders";
import { useLanguageStore } from "@/store/language-store";
import { useTranslation } from "@/lib/i18n";

export default function AdminDashboardPage() {
  // Fetch system statistics
  const { data: stats, isLoading } = useQuery({
    queryKey: ["system-statistics"],
    queryFn: getSystemStatistics,
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const systemStats = stats?.data;

  // Prepare chart data
  const userRoleData = systemStats
    ? [
        {
          name: "Competitors",
          value: systemStats.users.byRole.competitors,
          color: "#8884d8",
        },
        {
          name: "Guardians",
          value: systemStats.users.byRole.guardians,
          color: "#82ca9d",
        },
        {
          name: "Examiners",
          value: systemStats.users.byRole.examiners,
          color: "#ffc658",
        },
        {
          name: "Staff",
          value: systemStats.users.byRole.staffs,
          color: "#ff7c7c",
        },
        {
          name: "Admins",
          value: systemStats.users.byRole.admins,
          color: "#8dd1e1",
        },
      ]
    : [];

  const contestStatusData = systemStats
    ? [
        {
          name: "Active",
          value: systemStats.contests.active,
          color: "#10b981",
        },
        {
          name: "Upcoming",
          value: systemStats.contests.upcoming,
          color: "#f59e0b",
        },
        { name: "Ended", value: systemStats.contests.ended, color: "#ef4444" },
        {
          name: "Completed",
          value: systemStats.contests.completed,
          color: "#6366f1",
        },
      ]
    : [];

  const paintingStatusData = systemStats
    ? [
        { name: "Accepted", value: systemStats.paintings.accepted },
        { name: "Pending", value: systemStats.paintings.pending },
        { name: "Rejected", value: systemStats.paintings.rejected },
      ]
    : [];

  const exhibitionData = systemStats
    ? [
        {
          name: "Active",
          value: systemStats.exhibitions.active,
          color: "#10b981",
        },
        {
          name: "Draft",
          value: systemStats.exhibitions.draft,
          color: "#6366f1",
        },
      ]
    : [];

  const campaignData = systemStats
    ? [
        {
          name: "Active",
          value: systemStats.campaigns.active,
          color: "#f59e0b",
        },
        { name: "Draft", value: systemStats.campaigns.draft, color: "#8b5cf6" },
      ]
    : [];

  // Controls and user-growth query (right-side line chart)
  const [startDate, setStartDate] = useState<string>(() => "2025-01-01");
  const [endDate, setEndDate] = useState<string>(() => "2025-12-31");
  const [groupBy, setGroupBy] = useState<string>(() => "month");
  // Sorting for top competitors names (dropdown inside the Top Competitors card)
  const [sortBy, setSortBy] = useState<"totalSubmissions" | "awardsWon">(
    "totalSubmissions"
  );

  // Translation
  const { currentLanguage } = useLanguageStore();
  const t = useTranslation(currentLanguage);

  // Top lists queries (typed) - Get top 10 by default
  const { data: topCompetitorsRaw } = useQuery<
    ApiListResponse<TopCompetitorItem> | TopCompetitorItem[]
  >({
    queryKey: ["top-competitors"],
    queryFn: () => getTopCompetitors(10),
    enabled: true,
  });
  const { data: topExaminersRaw } = useQuery<
    ApiListResponse<TopExaminerItem> | TopExaminerItem[]
  >({
    queryKey: ["top-examiners"],
    queryFn: () => getTopExaminers(10),
    enabled: true,
  });
  const { data: topPaintingsRaw } = useQuery<
    ApiListResponse<TopPaintingItem> | TopPaintingItem[]
  >({
    queryKey: ["top-paintings"],
    queryFn: () => getMostVotedPaintings(10),
    enabled: true,
  });

  const topCompetitors =
    (topCompetitorsRaw as ApiListResponse<TopCompetitorItem>)?.data ??
    (topCompetitorsRaw as TopCompetitorItem[]) ??
    [];
  const topExaminers =
    (topExaminersRaw as ApiListResponse<TopExaminerItem>)?.data ??
    (topExaminersRaw as TopExaminerItem[]) ??
    [];
  const topPaintings =
    (topPaintingsRaw as ApiListResponse<TopPaintingItem>)?.data ??
    (topPaintingsRaw as TopPaintingItem[]) ??
    [];

  // Prepare two arrays:
  // - `topCompetitorsDataBars`: fixed ordering for the chart (descending by submissions then awards)
  // - `topCompetitorsDataNames`: ordering used by the names dropdown (controlled by user)
  const topCompetitorsDataBars = useMemo(() => {
    const arr = (topCompetitors || []).map(
      (it: TopCompetitorItem, idx: number) => ({
        name: it.fullName ?? `#${it.competitorId ?? idx + 1}`,
        value: Number(it.totalSubmissions ?? 0),
        awardsWon: Number(it.awardsWon ?? 0),
      })
    );

    // Always sort bars descending by totalSubmissions, tie-breaker awardsWon
    arr.sort((a, b) => {
      if (b.value !== a.value) return b.value - a.value;
      return b.awardsWon - a.awardsWon;
    });

    return arr;
  }, [topCompetitors]);

  const topCompetitorsDataNames = useMemo(() => {
    const arr = (topCompetitors || []).map(
      (it: TopCompetitorItem, idx: number) => ({
        name: it.fullName ?? `#${it.competitorId ?? idx + 1}`,
        value: Number(it.totalSubmissions ?? 0),
        awardsWon: Number(it.awardsWon ?? 0),
      })
    );

    if (sortBy === "totalSubmissions") {
      arr.sort((a, b) => {
        if (b.value !== a.value) return b.value - a.value;
        return b.awardsWon - a.awardsWon;
      });
    } else {
      arr.sort((a, b) => {
        if (b.awardsWon !== a.awardsWon) return b.awardsWon - a.awardsWon;
        return b.value - a.value;
      });
    }

    return arr;
  }, [topCompetitors, sortBy]);

  const topExaminersData = [...(topExaminers || [])]
    .map((it: TopExaminerItem, idx: number) => ({
      name: it.fullName ?? `#${it.examinerId ?? idx + 1}`,
      value: Number(it.totalEvaluations ?? 0),
    }))
    .sort((a, b) => b.value - a.value);

  const topPaintingsData = [...(topPaintings || [])]
    .map((p: TopPaintingItem, idx: number) => ({
      name: p.title ?? `#${p.paintingId ?? idx + 1}`,
      value: Number(p.voteCount ?? 0),
    }))
    .sort((a, b) => b.value - a.value);

  const topPaintingsList = [...(topPaintings || [])]
    .map((p: TopPaintingItem, idx: number) => ({
      title: p.title ?? `#${p.paintingId ?? idx + 1}`,
      competitorName: p.competitorName ?? "Unknown",
      voteCount: Number(p.voteCount ?? 0),
    }))
    .sort((a, b) => b.voteCount - a.voteCount);

  const { data: userGrowthRaw, isLoading: isLoadingUserGrowth } = useQuery<
    UserGrowthResponse | UserGrowthResponse["data"] | null
  >({
    queryKey: ["user-growth", startDate, endDate, groupBy],
    queryFn: () => getUserGrowth({ startDate, endDate, groupBy }),
    enabled: true,
  });

  const userGrowthPayload =
    (userGrowthRaw as UserGrowthResponse)?.data ??
    (userGrowthRaw as UserGrowthResponse["data"]) ??
    null;
  const growth = userGrowthPayload?.growth ?? [];

  const growthChartData = useMemo(
    () =>
      (growth || []).map((g: UserGrowthItem) => ({
        period: g.period,
        totalUsers: g.totalUsers,
        competitors: g.competitors,
        examiners: g.examiners,
        guardians: g.guardians,
        staffs: g.staffs,
        admins: g.admins,
        cumulativeTotal: g.cumulativeTotal,
      })),
    [growth]
  );

  // Custom tick renderer for period axis when grouped by day.
  // Renders the date in two lines: day on top, MM-YYYY on bottom to avoid overlapping.
  const renderPeriodTick = (tickProps: TickProps) => {
    const { x, y, payload } = tickProps;
    const value: string = payload?.value ?? "";
    // Expecting ISO date like '2025-01-01' or period string. Try to parse.
    const d = new Date(value);
    const isValidDate = !isNaN(d.getTime());
    const top = isValidDate ? String(d.getDate()).padStart(2, "0") : value;
    const bottom = isValidDate
      ? `${String(d.getMonth() + 1).padStart(2, "0")}-${d.getFullYear()}`
      : "";

    return (
      <g transform={`translate(${x},${y})`}>
        <text x={0} y={0} textAnchor="middle" fontSize={11} fill="#666">
          <tspan x={0} dy={-6}>
            {top}
          </tspan>
          <tspan x={0} dy={14}>
            {bottom}
          </tspan>
        </text>
      </g>
    );
  };

  // Helper to build 5-step ticks and an upper bound rounded up to nearest 5
  const makeFiveStepTicks = (dataArr: { value?: number }[]) => {
    const max =
      dataArr && dataArr.length
        ? Math.max(...dataArr.map((d) => d.value ?? 0))
        : 0;
    const upper = Math.max(5, Math.ceil(max / 5) * 5);
    const ticks = [] as number[];
    for (let v = 0; v <= upper; v += 5) ticks.push(v);
    return { upper, ticks };
  };

  const contestTicks = makeFiveStepTicks(contestStatusData);
  const paintingTicks = makeFiveStepTicks(paintingStatusData);

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
              <Loader />
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
        <SiteHeader title={t.adminDashboard} />
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
                      <p className="text-sm font-medium text-gray-600">
                        {t.totalUsers}
                      </p>
                      <p className="text-3xl font-bold text-gray-900">
                        {systemStats?.users.total || 0}
                      </p>
                    </div>
                    <div className="rounded-lg bg-blue-50 p-3">
                      <Users className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    {systemStats?.users.active || 0} {t.activeUsers}
                  </p>
                </div>

                <div className="rounded-lg border border-gray-200 bg-white p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        {t.totalContestsAdmin}
                      </p>
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
                      <p className="text-sm font-medium text-gray-600">
                        {t.totalPaintingsAdmin}
                      </p>
                      <p className="text-3xl font-bold text-gray-900">
                        {systemStats?.paintings.total || 0}
                      </p>
                    </div>
                    <div className="rounded-lg bg-green-50 p-3">
                      <Palette className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    {systemStats?.paintings.pending || 0} {t.pendingReviews}
                  </p>
                </div>

                <div className="rounded-lg border border-gray-200 bg-white p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        {t.totalEvaluationsAdmin}
                      </p>
                      <p className="text-3xl font-bold text-gray-900">
                        {systemStats?.evaluations.total || 0}
                      </p>
                    </div>
                    <div className="rounded-lg bg-purple-50 p-3">
                      <Vote className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    {t.systemEvaluations}
                  </p>
                </div>
              </div>

              {/* Charts Section */}
              <div className="space-y-6">
                {/* Row 1: User Roles (left 1/3) + User Growth line chart (right 2/3) */}
                <div className="rounded-lg border border-gray-200 bg-white p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                    <div className="md:col-span-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        {t.userRolesDistribution}
                      </h3>
                      <div style={{ width: "100%", height: 260 }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={userRoleData}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              label={(props: PieLabelRenderProps) =>
                                `${props.name} ${(
                                  (props.percent as number) * 100
                                ).toFixed(0)}%`
                              }
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                            >
                              {userRoleData.map((entry, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={entry.color}
                                />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 gap-3">
                        <div className="flex items-center gap-2">
                          <label className="text-sm text-gray-600">Start</label>
                          <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="staff-input"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <label className="text-sm text-gray-600">End</label>
                          <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="staff-input"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <label className="text-sm text-gray-600">
                            {t.groupBy}
                          </label>
                          <select
                            value={groupBy}
                            onChange={(e) => setGroupBy(e.target.value)}
                            className="staff-input"
                          >
                            <option value="day">{t.day}</option>
                            <option value="week">{t.week}</option>
                            <option value="month">{t.month}</option>
                            <option value="year">Year</option>
                          </select>
                        </div>
                      </div>

                      <h3 className="text-sm text-gray-700 mb-2">
                        User growth ({groupBy})
                      </h3>
                      <div style={{ width: "100%", height: 300 }}>
                        {isLoadingUserGrowth ? (
                          <div className="flex items-center justify-center h-full">
                            Loading...
                          </div>
                        ) : (
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                              data={growthChartData}
                              margin={{ left: 0, right: 20 }}
                            >
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis
                                dataKey="period"
                                tick={
                                  groupBy === "day"
                                    ? renderPeriodTick
                                    : undefined
                                }
                                interval={groupBy === "day" ? 0 : undefined}
                              />
                              <YAxis />
                              <Tooltip />
                              <Legend />
                              <Line
                                type="monotone"
                                dataKey="totalUsers"
                                name={t.totalUsers}
                                stroke="#4f46e5"
                                strokeWidth={2}
                              />
                              <Line
                                type="monotone"
                                dataKey="cumulativeTotal"
                                name={t.cumulative}
                                stroke="#06b6d4"
                                strokeWidth={2}
                                strokeDasharray="4 4"
                              />
                              <Line
                                type="monotone"
                                dataKey="competitors"
                                name="Competitors"
                                stroke="#8884d8"
                                strokeWidth={1}
                              />
                              <Line
                                type="monotone"
                                dataKey="examiners"
                                name="Examiners"
                                stroke="#82ca9d"
                                strokeWidth={1}
                              />
                              <Line
                                type="monotone"
                                dataKey="guardians"
                                name="Guardians"
                                stroke="#f59e0b"
                                strokeWidth={1}
                              />
                              <Line
                                type="monotone"
                                dataKey="staffs"
                                name="Staffs"
                                stroke="#ff7c7c"
                                strokeWidth={1}
                              />
                              <Line
                                type="monotone"
                                dataKey="admins"
                                name="Admins"
                                stroke="#8dd1e1"
                                strokeWidth={1}
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Row 2: Contest Status + Painting Status */}
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="rounded-lg border border-gray-200 bg-white p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      {t.contestStatusOverview}
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={contestStatusData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        {/* Use explicit 5-step ticks and an upper bound rounded to nearest 5 */}
                        <YAxis
                          domain={[0, contestTicks.upper]}
                          ticks={contestTicks.ticks}
                        />
                        <Tooltip />
                        <Bar dataKey="value" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="rounded-lg border border-gray-200 bg-white p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      {t.paintingSubmissionsStatus}
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={paintingStatusData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis
                          domain={[0, paintingTicks.upper]}
                          ticks={paintingTicks.ticks}
                        />
                        <Tooltip />
                        <Bar dataKey="value" fill="#82ca9d" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Row 3: Votes + Awards + Exhibitions */}
                <div className="grid gap-6 md:grid-cols-3">
                  <div className="rounded-lg border border-gray-200 bg-white p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      {t.votesOverview}
                    </h3>
                    <div className="flex items-center justify-center h-48">
                      <div className="text-center">
                        <Vote className="h-16 w-16 text-purple-500 mx-auto mb-4" />
                        <p className="text-3xl font-bold text-gray-900">
                          {systemStats?.votes.total || 0}
                        </p>
                        <p className="text-sm text-gray-600">Total Votes</p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg border border-gray-200 bg-white p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      {t.awardsOverview}
                    </h3>
                    <div className="flex items-center justify-center h-48">
                      <div className="text-center">
                        <Award className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
                        <p className="text-3xl font-bold text-gray-900">
                          {systemStats?.awards.total || 0}
                        </p>
                        <p className="text-sm text-gray-600">Total Awards</p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg border border-gray-200 bg-white p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      {t.exhibitionsStatus}
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
                </div>

{/* New Row: Top lists (Competitors + Examiners) */}
                <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <h3 className="text-xl font-bold text-gray-900">
                        {t.topPerformers}
                      </h3>
                    </div>
                  </div>
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="rounded-lg border border-gray-100 bg-white p-4 shadow-sm">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <h4 className="text-sm font-semibold text-gray-800">
                            {t.topCompetitors}
                          </h4>
                        </div>
                        <div className="flex items-center gap-2">
                          <label className="sr-only">Sort by</label>
                          <select
                            value={sortBy}
                            onChange={(e) =>
                              setSortBy(
                                e.target.value as
                                  | "totalSubmissions"
                                  | "awardsWon"
                              )
                            }
                            className="text-xs border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="totalSubmissions">
                              Submissions
                            </option>
                            <option value="awardsWon">Awards</option>
                          </select>
                        </div>
                      </div>
                      {/* List of top competitors names */}
                      <div className="mt-4">
                        <ul className="text-sm space-y-2 max-h-60 overflow-y-auto">
                          {topCompetitorsDataNames
                            .slice(0, 10)
                            .map((item, index) => {
                              const rank = index + 1;
                              const isTop3 = rank <= 3;
                              return (
                                <li
                                  key={index}
                                  className={`flex items-center justify-between p-2 rounded-lg transition-colors ${
                                    isTop3
                                      ? "bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200"
                                      : "hover:bg-gray-50"
                                  }`}
                                >
                                  <div className="flex items-center gap-2">
                                    <span
                                      className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                                        rank === 1
                                          ? "bg-yellow-500 text-white"
                                          : rank === 2
                                          ? "bg-gray-400 text-white"
                                          : rank === 3
                                          ? "bg-orange-600 text-white"
                                          : "bg-gray-200 text-gray-700"
                                      }`}
                                    >
                                      {rank}
                                    </span>
                                    <span
                                      className={`font-medium ${
                                        isTop3
                                          ? "text-gray-900"
                                          : "text-gray-700"
                                      }`}
                                    >
                                      {item.name}
                                    </span>
                                  </div>
                                  <span
                                    className={`text-xs font-semibold px-2 py-1 rounded-full ${
                                      sortBy === "totalSubmissions"
                                        ? "bg-blue-100 text-blue-800"
                                        : "bg-green-100 text-green-800"
                                    }`}
                                  >
                                    {sortBy === "totalSubmissions"
                                      ? `${item.value}`
                                      : `${item.awardsWon}`}
                                  </span>
                                </li>
                              );
                            })}
                        </ul>
                      </div>
                    </div>

                    <div className="rounded-lg border border-gray-100 bg-white p-4 shadow-sm">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <h4 className="text-sm font-semibold text-gray-800">
                          {t.topExaminersAdmin}
                        </h4>
                      </div>
                      {/* List of top examiners names */}
                      <div className="mt-4">
                        <ul className="text-sm space-y-2 max-h-60 overflow-y-auto">
                          {topExaminersData.slice(0, 10).map((item, index) => {
                            const rank = index + 1;
                            const isTop3 = rank <= 3;
                            return (
                              <li
                                key={index}
                                className={`flex items-center justify-between p-2 rounded-lg transition-colors ${
                                  isTop3
                                    ? "bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200"
                                    : "hover:bg-gray-50"
                                }`}
                              >
                                <div className="flex items-center gap-2">
                                  <span
                                    className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                                      rank === 1
                                        ? "bg-green-500 text-white"
                                        : rank === 2
                                        ? "bg-emerald-400 text-white"
                                        : rank === 3
                                        ? "bg-teal-600 text-white"
                                        : "bg-gray-200 text-gray-700"
                                    }`}
                                  >
                                    {rank}
                                  </span>
                                  <span
                                    className={`font-medium ${
                                      isTop3 ? "text-gray-900" : "text-gray-700"
                                    }`}
                                  >
                                    {item.name}
                                  </span>
                                </div>
                                <span className="text-xs font-semibold px-2 py-1 rounded-full bg-purple-100 text-purple-800">
                                  {item.value}
                                </span>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Row 4: Top Paintings (most voted) + Campaigns */}
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                      <h3 className="text-lg font-bold text-gray-900">
                        {t.topPaintingsMostVoted}
                      </h3>
                    </div>
                    {/* List of top paintings */}
                    <div className="mt-4">
                      <ul className="text-sm space-y-2 max-h-60 overflow-y-auto">
                        {topPaintingsList.slice(0, 10).map((item, index) => {
                          const rank = index + 1;
                          const isTop3 = rank <= 3;
                          return (
                            <li
                              key={index}
                              className={`flex items-center justify-between p-2 rounded-lg transition-colors ${
                                isTop3
                                  ? "bg-gradient-to-r from-red-50 to-pink-50 border border-red-200"
                                  : "hover:bg-gray-50"
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <span
                                  className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                                    rank === 1
                                      ? "bg-red-500 text-white"
                                      : rank === 2
                                      ? "bg-pink-400 text-white"
                                      : rank === 3
                                      ? "bg-rose-600 text-white"
                                      : "bg-gray-200 text-gray-700"
                                  }`}
                                >
                                  {rank}
                                </span>
                                <div>
                                  <span
                                    className={`font-medium block ${
                                      isTop3 ? "text-gray-900" : "text-gray-700"
                                    }`}
                                  >
                                    {item.title}
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    by {item.competitorName}
                                  </span>
                                </div>
                              </div>
                              <span className="text-xs font-semibold px-2 py-1 rounded-full bg-red-100 text-red-800">
                                {item.voteCount} votes
                              </span>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </div>

                  <div className="rounded-lg border border-gray-200 bg-white p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      {t.campaignsStatus}
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
