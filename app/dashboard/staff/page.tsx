import { Breadcrumb } from "@/components/breadcrumb";
import { SiteHeader } from "@/components/site-header";
import { StaffSidebar } from "@/components/staff-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import Link from "next/link";

export default function StaffDashboardPage() {
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
        <SiteHeader title="Staff Dashboard" />
        <div className="flex flex-1 flex-col">
          <div className="px-4 lg:px-6 py-2 border-b border-[#e6e2da] bg-white">
            <Breadcrumb items={[]} homeHref="/dashboard/staff" />
          </div>
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
              {/* Staff Dashboard Content */}
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <div className="staff-card staff-stat-info p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium staff-text-secondary">
                        Total Competitors
                      </p>
                      <p className="text-3xl font-bold staff-text-primary">
                        1,234
                      </p>
                    </div>
                    <div className="stat-icon">
                      <svg
                        className="h-6 w-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                        />
                      </svg>
                    </div>
                  </div>
                  <p className="mt-2 text-sm staff-text-secondary">
                    +8.2% from last month
                  </p>
                </div>

                <div className="staff-card staff-stat-secondary p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium staff-text-secondary">
                        Pending Paintings
                      </p>
                      <p className="text-3xl font-bold staff-text-primary">
                        67
                      </p>
                    </div>
                    <div className="stat-icon">
                      <svg
                        className="h-6 w-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  </div>
                  <p className="mt-2 text-sm staff-text-secondary">
                    Awaiting review
                  </p>
                </div>

                <div className="staff-card staff-stat-success p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium staff-text-secondary">
                        Active Contests
                      </p>
                      <p className="text-3xl font-bold staff-text-primary">8</p>
                    </div>
                    <div className="stat-icon">
                      <svg
                        className="h-6 w-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                        />
                      </svg>
                    </div>
                  </div>
                  <p className="mt-2 text-sm staff-text-secondary">
                    Currently running
                  </p>
                </div>

                <div className="staff-card staff-stat-primary p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium staff-text-secondary">
                        Active Sponsors
                      </p>
                      <p className="text-3xl font-bold staff-text-primary">
                        15
                      </p>
                    </div>
                    <div className="stat-icon">
                      <svg
                        className="h-6 w-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                  </div>
                  <p className="mt-2 text-sm staff-text-secondary">
                    2 new this month
                  </p>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="staff-card p-6">
                <h2 className="staff-heading mb-6">Quick Actions</h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <Link
                    href="/dashboard/staff/competitors/paintings/pending"
                    className="flex items-center space-x-3  border-2 border-[#e6e2da] p-4 hover:bg-linear-to-br hover:from-orange-50 hover:to-amber-50 hover:border-orange-200 transition-all duration-300 group"
                  >
                    <div className=" bg-linear-to-br from-orange-500 to-amber-500 p-2.5 shadow-md group-hover:scale-110 transition-transform">
                      <svg
                        className="h-5 w-5 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-bold staff-text-primary">
                        Review Paintings
                      </p>
                      <p className="text-xs staff-text-secondary">67 pending</p>
                    </div>
                  </Link>

                  <Link
                    href="/dashboard/staff/contests/create"
                    className="flex items-center space-x-3  border-2 border-[#e6e2da] p-4 hover:bg-linear-to-br hover:from-red-50 hover:to-pink-50 hover:border-red-200 transition-all duration-300 group"
                  >
                    <div className=" bg-linear-to-br from-[#d9534f] to-[#e67e73] p-2.5 shadow-md group-hover:scale-110 transition-transform">
                      <svg
                        className="h-5 w-5 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-bold staff-text-primary">
                        Create Contest
                      </p>
                      <p className="text-xs staff-text-secondary">Start new</p>
                    </div>
                  </Link>

                  <Link
                    href="/dashboard/staff/contests/examiners/invite"
                    className="flex items-center space-x-3  border-2 border-[#e6e2da] p-4 hover:bg-linear-to-br hover:from-green-50 hover:to-emerald-50 hover:border-green-200 transition-all duration-300 group"
                  >
                    <div className=" bg-linear-to-br from-green-500 to-emerald-500 p-2.5 shadow-md group-hover:scale-110 transition-transform">
                      <svg
                        className="h-5 w-5 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-bold staff-text-primary">
                        Invite Examiner
                      </p>
                      <p className="text-xs staff-text-secondary">
                        Send invitation
                      </p>
                    </div>
                  </Link>

                  <Link
                    href="/dashboard/staff/posts/create"
                    className="flex items-center space-x-3  border-2 border-[#e6e2da] p-4 hover:bg-linear-to-br hover:from-blue-50 hover:to-indigo-50 hover:border-blue-200 transition-all duration-300 group"
                  >
                    <div className="bg-linear-to-br from-blue-500 to-indigo-500 p-2.5 shadow-md group-hover:scale-110 transition-transform">
                      <svg
                        className="h-5 w-5 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-bold staff-text-primary">
                        Create Post
                      </p>
                      <p className="text-xs staff-text-secondary">
                        New announcement
                      </p>
                    </div>
                  </Link>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="staff-card p-6">
                <h2 className="text-lg font-semibold staff-text-primary mb-4">
                  Recent Activity
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                    <div className="flex items-center space-x-3">
                      <div className=" bg-green-50 p-2">
                        <svg
                          className="h-5 w-5 text-green-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium staff-text-primary">
                          Painting approved
                        </p>
                        <p className="text-xs staff-text-secondary">
                          &ldquo;Sunset Dreams&rdquo; by Alice Chen
                        </p>
                      </div>
                    </div>
                    <span className="text-xs staff-text-secondary">
                      10 min ago
                    </span>
                  </div>

                  <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                    <div className="flex items-center space-x-3">
                      <div className=" bg-blue-50 p-2">
                        <svg
                          className="h-5 w-5 text-blue-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium staff-text-primary">
                          New contest started
                        </p>
                        <p className="text-xs staff-text-secondary">
                          Spring Art Competition 2025
                        </p>
                      </div>
                    </div>
                    <span className="text-xs staff-text-secondary">
                      2 hours ago
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className=" bg-purple-50 p-2">
                        <svg
                          className="h-5 w-5 text-purple-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium staff-text-primary">
                          New post published
                        </p>
                        <p className="text-xs staff-text-secondary">
                          Contest guidelines update
                        </p>
                      </div>
                    </div>
                    <span className="text-xs staff-text-secondary">
                      5 hours ago
                    </span>
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
