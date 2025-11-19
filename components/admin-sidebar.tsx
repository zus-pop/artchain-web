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
} from "@/components/ui/sidebar";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../hooks";

const data = {
  user: {
    name: "Admin User",
    email: "admin@artchain.com",
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
    // {
    //   title: "Quản lý báo cáo",
    //   url: "/dashboard/admin/reports",
    //   icon: IconReport,
    //   items: [
    //     {
    //       title: "Báo cáo người dùng",
    //       url: "/dashboard/admin/reports",
    //     },
    //     {
    //       title: "Báo cáo đang chờ",
    //       url: "/dashboard/admin/reports/pending",
    //     },
    //     {
    //       title: "Báo cáo đã giải quyết",
    //       url: "/dashboard/admin/reports/resolved",
    //     },
    //   ],
    // },
  ],
  navSecondary: [],
};

export function AdminSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();

  React.useEffect(() => {
    if (!isAuthenticated) {
      // Redirect to auth page if not authenticated
      router.push("/auth");
      return;
    }
  }, [isAuthenticated, user, router]);

  if (user) {
    data.user.name = user.fullName;
    data.user.email = user.email;
  }

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <Link href="/">
                <IconShield className="size-5! text-blue-600" />
                <span className="text-base font-semibold">ArtChain Quản trị</span>
              </Link>
            </SidebarMenuButton>
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
