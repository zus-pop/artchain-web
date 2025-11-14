"use client";
import React, { useState, useMemo } from "react";
import { AdminSidebar } from "@/components/admin-sidebar";
import { Breadcrumb } from "@/components/breadcrumb";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useQuery } from "@tanstack/react-query";
import { getSystemStatistics } from "@/apis/admin";
import { getUserGrowth, getTopCompetitors, getTopExaminers, getMostVotedPaintings } from "@/apis/admin";
import type { ApiListResponse, TopCompetitorItem, TopExaminerItem, TopPaintingItem } from "@/types/admin/toplists";
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
import Loader from "@/components/Loaders";

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
    { name: "Accepted", value: systemStats.paintings.accepted },
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

  // Controls and user-growth query (right-side line chart)
  const [startDate, setStartDate] = useState<string>(() => "2025-01-01");
  const [endDate, setEndDate] = useState<string>(() => "2025-12-31");
  const [groupBy, setGroupBy] = useState<string>(() => "month");
  const [topN, setTopN] = useState<number>(10);

  // Top lists queries (typed)
  const { data: topCompetitorsRaw } = useQuery<ApiListResponse<TopCompetitorItem> | TopCompetitorItem[]>({
    queryKey: ["top-competitors", topN],
    queryFn: () => getTopCompetitors(topN),
    enabled: true,
  });
  const { data: topExaminersRaw } = useQuery<ApiListResponse<TopExaminerItem> | TopExaminerItem[]>({
    queryKey: ["top-examiners", topN],
    queryFn: () => getTopExaminers(topN),
    enabled: true,
  });
  const { data: topPaintingsRaw } = useQuery<ApiListResponse<TopPaintingItem> | TopPaintingItem[]>({
    queryKey: ["top-paintings", topN],
    queryFn: () => getMostVotedPaintings(topN),
    enabled: true,
  });

  const topCompetitors = (topCompetitorsRaw as ApiListResponse<TopCompetitorItem>)?.data ?? (topCompetitorsRaw as TopCompetitorItem[]) ?? [];
  const topExaminers = (topExaminersRaw as ApiListResponse<TopExaminerItem>)?.data ?? (topExaminersRaw as TopExaminerItem[]) ?? [];
  const topPaintings = (topPaintingsRaw as ApiListResponse<TopPaintingItem>)?.data ?? (topPaintingsRaw as TopPaintingItem[]) ?? [];

  // Normalize top lists into chart-friendly shape
  const topCompetitorsData = ([...(topCompetitors || [])].map((it: any, idx: number) => ({
    name: it.name ?? it.username ?? it.fullName ?? it.competitorName ?? `#${it.id ?? idx + 1}`,
    value: Number(it.count ?? it.total ?? it.value ?? it.score ?? 0),
  })).sort((a, b) => a.value - b.value));

  const topExaminersData = ([...(topExaminers || [])].map((it: any, idx: number) => ({
    name: it.name ?? it.username ?? it.fullName ?? `#${it.id ?? idx + 1}`,
    value: Number(it.count ?? it.total ?? it.value ?? it.score ?? 0),
  })).sort((a, b) => a.value - b.value));

  const topPaintingsData = ([...(topPaintings || [])].map((p: any, idx: number) => ({
    name: p.title ?? p.name ?? p.paintingName ?? `#${p.id ?? idx + 1}`,
    value: Number(p.votes ?? p.count ?? p.total ?? p.value ?? 0),
  })).sort((a, b) => a.value - b.value));

  const {
    data: userGrowthRaw,
    isLoading: isLoadingUserGrowth,
  } = useQuery<any>({
    queryKey: ["user-growth", startDate, endDate, groupBy],
    queryFn: () => getUserGrowth({ startDate, endDate, groupBy }),
    enabled: true,
  });

  const userGrowthPayload = userGrowthRaw?.data ?? userGrowthRaw ?? null;
  const growth = userGrowthPayload?.growth ?? [];

  const growthChartData = useMemo(() => (
    (growth || []).map((g: any) => ({
      period: g.period,
      totalUsers: g.totalUsers,
      competitors: g.competitors,
      examiners: g.examiners,
      guardians: g.guardians,
      staffs: g.staffs,
      admins: g.admins,
      cumulativeTotal: g.cumulativeTotal,
    }))
  ), [growth]);

  // Custom tick renderer for period axis when grouped by day.
  // Renders the date in two lines: day on top, MM-YYYY on bottom to avoid overlapping.
  const renderPeriodTick = (tickProps: any) => {
    const { x, y, payload } = tickProps;
    const value: string = payload?.value ?? "";
    // Expecting ISO date like '2025-01-01' or period string. Try to parse.
    const d = new Date(value);
    const isValidDate = !isNaN(d.getTime());
    const top = isValidDate ? String(d.getDate()).padStart(2, '0') : value;
    const bottom = isValidDate ? `${String(d.getMonth() + 1).padStart(2, '0')}-${d.getFullYear()}` : '';

    return (
      <g transform={`translate(${x},${y})`}>
        <text x={0} y={0} textAnchor="middle" fontSize={11} fill="#666">
          <tspan x={0} dy={-6}>{top}</tspan>
          <tspan x={0} dy={14}>{bottom}</tspan>
        </text>
      </g>
    );
  };

  // Helper to build 5-step ticks and an upper bound rounded up to nearest 5
  const makeFiveStepTicks = (dataArr: { value?: number }[]) => {
    const max = dataArr && dataArr.length ? Math.max(...dataArr.map(d => d.value ?? 0)) : 0;
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
                {/* Row 1: User Roles (left 1/3) + User Growth line chart (right 2/3) */}
                <div className="rounded-lg border border-gray-200 bg-white p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                    <div className="md:col-span-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">User Roles Distribution</h3>
                      <div style={{ width: '100%', height: 260 }}>
                        <ResponsiveContainer width="100%" height="100%">
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
                    </div>

                    <div className="md:col-span-2">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 gap-3">
                        <div className="flex items-center gap-2">
                          <label className="text-sm text-gray-600">Start</label>
                          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="staff-input" />
                        </div>
                        <div className="flex items-center gap-2">
                          <label className="text-sm text-gray-600">End</label>
                          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="staff-input" />
                        </div>
                        <div className="flex items-center gap-2">
                          <label className="text-sm text-gray-600">Group by</label>
                          <select value={groupBy} onChange={(e) => setGroupBy(e.target.value)} className="staff-input">
                            <option value="day">Day</option>
                            <option value="week">Week</option>
                            <option value="month">Month</option>
                            <option value="year">Year</option>
                          </select>
                        </div>
                      </div>

                      <h3 className="text-sm text-gray-700 mb-2">User growth ({groupBy})</h3>
                      <div style={{ width: '100%', height: 300 }}>
                        {isLoadingUserGrowth ? (
                          <div className="flex items-center justify-center h-full">Loading...</div>
                        ) : (
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={growthChartData} margin={{ left: 0, right: 20 }}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="period" tick={groupBy === 'day' ? renderPeriodTick : undefined} interval={groupBy === 'day' ? 0 : undefined} />
                              <YAxis />
                              <Tooltip />
                              <Legend />
                              <Line type="monotone" dataKey="totalUsers" name="Total Users" stroke="#4f46e5" strokeWidth={2} />
                              <Line type="monotone" dataKey="cumulativeTotal" name="Cumulative" stroke="#06b6d4" strokeWidth={2} strokeDasharray="4 4" />
                              <Line type="monotone" dataKey="competitors" name="Competitors" stroke="#8884d8" strokeWidth={1} />
                              <Line type="monotone" dataKey="examiners" name="Examiners" stroke="#82ca9d" strokeWidth={1} />
                              <Line type="monotone" dataKey="guardians" name="Guardians" stroke="#f59e0b" strokeWidth={1} />
                              <Line type="monotone" dataKey="staffs" name="Staffs" stroke="#ff7c7c" strokeWidth={1} />
                              <Line type="monotone" dataKey="admins" name="Admins" stroke="#8dd1e1" strokeWidth={1} />
                            </LineChart>
                          </ResponsiveContainer>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* New Row: Top lists (Competitors + Examiners) */}
                <div className="rounded-lg border border-gray-200 bg-white p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Top lists</h3>
                    <div className="flex items-center gap-2">
                      <label className="text-sm text-gray-600">Top N</label>
                      <input type="number" min={1} value={topN} onChange={(e) => setTopN(Number(e.target.value) || 10)} className="staff-input w-20" />
                    </div>
                  </div>
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="rounded-lg border border-gray-100 bg-white p-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-3">Top Competitors</h4>
                      {topCompetitorsData.length === 0 ? (
                        <div className="text-sm text-gray-500">No data</div>
                      ) : (
                        <div style={{ width: '100%', height: 220 }}>
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={topCompetitorsData} layout="vertical" margin={{ left: 10, right: 10 }}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis type="number" />
                              <YAxis dataKey="name" type="category" width={140} />
                              <Tooltip />
                              <Bar dataKey="value" fill="#4f46e5" />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      )}
                    </div>

                    <div className="rounded-lg border border-gray-100 bg-white p-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-3">Top Examiners</h4>
                      {topExaminersData.length === 0 ? (
                        <div className="text-sm text-gray-500">No data</div>
                      ) : (
                        <div style={{ width: '100%', height: 220 }}>
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={topExaminersData} layout="vertical" margin={{ left: 10, right: 10 }}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis type="number" />
                              <YAxis dataKey="name" type="category" width={140} />
                              <Tooltip />
                              <Bar dataKey="value" fill="#16a34a" />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      )}
                    </div>
                  </div>
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
                        {/* Use explicit 5-step ticks and an upper bound rounded to nearest 5 */}
                        <YAxis domain={[0, contestTicks.upper]} ticks={contestTicks.ticks} />
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
                        <YAxis domain={[0, paintingTicks.upper]} ticks={paintingTicks.ticks} />
                        <Tooltip />
                        <Bar dataKey="value" fill="#82ca9d" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Row 3: Awards + Votes (left) and Exhibitions (right) */}
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <div className="rounded-lg border border-gray-200 bg-white p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Votes Overview</h3>
                      <div className="flex items-center justify-center h-48">
                        <div className="text-center">
                          <Vote className="h-16 w-16 text-purple-500 mx-auto mb-4" />
                          <p className="text-3xl font-bold text-gray-900">{systemStats?.votes.total || 0}</p>
                          <p className="text-sm text-gray-600">Total Votes</p>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-lg border border-gray-200 bg-white p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Awards Overview</h3>
                      <div className="flex items-center justify-center h-48">
                        <div className="text-center">
                          <Award className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
                          <p className="text-3xl font-bold text-gray-900">{systemStats?.awards.total || 0}</p>
                          <p className="text-sm text-gray-600">Total Awards</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg border border-gray-200 bg-white p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Exhibitions Status</h3>
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

                {/* Row 4: Top Paintings (most voted) + Campaigns */}
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="rounded-lg border border-gray-200 bg-white p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Paintings (Most Voted)</h3>
                    {topPaintingsData.length === 0 ? (
                      <div className="text-sm text-gray-500">No data</div>
                    ) : (
                      <div style={{ width: '100%', height: 260 }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={topPaintingsData} layout="vertical" margin={{ left: 10, right: 10 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type="number" />
                            <YAxis dataKey="name" type="category" width={180} />
                            <Tooltip />
                            <Bar dataKey="value" fill="#ef4444" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    )}
                  </div>

                  <div className="rounded-lg border border-gray-200 bg-white p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Campaigns Status</h3>
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
