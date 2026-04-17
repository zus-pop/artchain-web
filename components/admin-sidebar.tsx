"use client";

import {
  IconChartBar,
  IconDashboard,
  IconReport,
  IconShield,
  IconUsers,
} from "@tabler/icons-react";
import * as React from "react";

import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavSettings } from "@/components/nav-settings";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../hooks";

export function AdminSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const router = useRouter();
  const { isAuthenticated, user, isHydrated, isLoading } = useAuth();

  const data = React.useMemo(() => ({
    user: {
      name: user?.fullName || "Admin User",
      email: user?.email || "admin@artchain.com",
      avatar: "/avatars/admin.jpg",
    },
    navMain: [
      {
        title: "Bảng điều khiển",
        url: "/dashboard/admin",
        icon: IconDashboard,
      },
      {
        title: "Quản lý tài khoản",
        url: "/dashboard/admin/accounts",
        icon: IconUsers,
        items: [
          {
            title: "Tất cả người dùng",
            url: "/dashboard/admin/accounts",
          },
          {
            title: "Người tham gia",
            url: "/dashboard/admin/accounts/competitors",
          },
          {
            title: "Người giám hộ",
            url: "/dashboard/admin/accounts/guardians",
          },
          {
            title: "Nhân viên",
            url: "/dashboard/admin/accounts/staff",
          },
        ],
      },
      {
        title: "Phân tích cuộc thi",
        url: "/dashboard/admin/contests",
        icon: IconChartBar,
        items: [
          {
            title: "Tổng quan",
            url: "/dashboard/admin/statistics",
          },
          {
            title: "Phân tích người dùng",
            url: "/dashboard/admin/statistics/users",
          },
          {
            title: "Phân tích cuộc thi",
            url: "/dashboard/admin/statistics/contests",
          },
          {
            title: "Phân tích báo cáo",
            url: "/dashboard/admin/statistics/reports",
          },
        ],
      },
    ],
    navSecondary: [],
  }), [user]);

  React.useEffect(() => {
    if (isHydrated && !isLoading && !isAuthenticated) {
      // Redirect to auth page if not authenticated
      router.push("/auth");
      return;
    }
  }, [isAuthenticated, isHydrated, isLoading, router]);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center justify-between gap-1 group-data-[state=collapsed]:justify-center">
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5! hover:bg-transparent! active:bg-transparent! group-data-[state=collapsed]:hidden"
            >
              <Link href="/">
                <IconShield className="size-5! text-blue-600" />
                <span className="text-base font-semibold">ArtChain Quản trị</span>
              </Link>
            </SidebarMenuButton>
            <SidebarTrigger className="-mr-1 border-0 hover:bg-transparent group-data-[state=collapsed]:mr-0" />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
        <NavSettings />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
