"use client";
import { Breadcrumb } from "@/components/breadcrumb";
import { SiteHeader } from "@/components/site-header";
import { StaffSidebar } from "@/components/staff-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useTranslation } from "@/lib/i18n";
import { useLanguageStore } from "@/store/language-store";
import Link from "next/link";
export default function StaffDashboardPage() {
  const { currentLanguage } = useLanguageStore();
  const t = useTranslation(currentLanguage);

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
        <SiteHeader title={t.staffDashboard} />
        <div className="flex flex-1 flex-col">
          <div className="px-4 lg:px-6 py-2 border-b border-[#e6e2da] bg-white">
            <Breadcrumb items={[]} homeHref="/dashboard/staff" />
          </div>
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
              {/* Staff Dashboard Content */}

              {/* Quick Actions */}
              <div className="staff-card p-6">
                <h2 className="staff-heading mb-6">{t.quickActions}</h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <Link
                    href="/dashboard/staff/exhibitions/create"
                    className="flex items-center space-x-3  border-2 border-[#e6e2da] p-4 hover:bg-linear-to-br hover:from-blue-50 hover:to-indigo-50 hover:border-blue-200 transition-all duration-300 group"
                  >
                    <div className=" bg-linear-to-br from-blue-500 to-indigo-500 p-2.5 shadow-md group-hover:scale-110 transition-transform">
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
                          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-bold staff-text-primary">
                        {t.createExhibition}
                      </p>
                      <p className="text-xs staff-text-secondary">
                        {t.setupNewExhibition}
                      </p>
                    </div>
                  </Link>

                  <Link
                    href="/dashboard/staff/campaigns/create"
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
                          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-bold staff-text-primary">
                        {t.createCampaign}
                      </p>
                      <p className="text-xs staff-text-secondary">
                        {t.setupNewCampaign}
                      </p>
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
                        {t.createContest}
                      </p>
                      <p className="text-xs staff-text-secondary">
                        {t.setupNewArtCompetition}
                      </p>
                    </div>
                  </Link>

                  <Link
                    href="/dashboard/staff/posts/create"
                    className="flex items-center space-x-3  border-2 border-[#e6e2da] p-4 hover:bg-linear-to-br hover:from-purple-50 hover:to-violet-50 hover:border-purple-200 transition-all duration-300 group"
                  >
                    <div className="bg-linear-to-br from-purple-500 to-violet-500 p-2.5 shadow-md group-hover:scale-110 transition-transform">
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
                        {t.createPost}
                      </p>
                      <p className="text-xs staff-text-secondary">
                        {t.writePublishContent}
                      </p>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
