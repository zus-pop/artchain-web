"use client";

import * as React from "react";
import {
  IconChartBar,
  IconDashboard,
  IconReport,
  IconSettings,
  IconUsers,
  IconShield,
} from "@tabler/icons-react";

import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
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

const data = {
  user: {
    name: "Admin User",
    email: "admin@artchain.com",
    avatar: "/avatars/admin.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard/admin",
      icon: IconDashboard,
    },
    {
      title: "Account Management",
      url: "/dashboard/admin/accounts",
      icon: IconUsers,
      items: [
        {
          title: "All Users",
          url: "/dashboard/admin/accounts",
        },
        {
          title: "Competitors",
          url: "/dashboard/admin/accounts/competitors",
        },
        {
          title: "Guardians",
          url: "/dashboard/admin/accounts/guardians",
        },
        {
          title: "Staff",
          url: "/dashboard/admin/accounts/staff",
        },
      ],
    },
    {
      title: "Reports Management",
      url: "/dashboard/admin/reports",
      icon: IconReport,
      items: [
        {
          title: "User Reports",
          url: "/dashboard/admin/reports",
        },
        {
          title: "Pending Reports",
          url: "/dashboard/admin/reports/pending",
        },
        {
          title: "Resolved Reports",
          url: "/dashboard/admin/reports/resolved",
        },
      ],
    },
    {
      title: "Statistics",
      url: "/dashboard/admin/statistics",
      icon: IconChartBar,
      items: [
        {
          title: "Overview",
          url: "/dashboard/admin/statistics",
        },
        {
          title: "Users Analytics",
          url: "/dashboard/admin/statistics/users",
        },
        {
          title: "Contests Analytics",
          url: "/dashboard/admin/statistics/contests",
        },
        {
          title: "Reports Analytics",
          url: "/dashboard/admin/statistics/reports",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "/dashboard/admin/settings",
      icon: IconSettings,
    },
  ],
};

export function AdminSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="/">
                <IconShield className="!size-5 text-blue-600" />
                <span className="text-base font-semibold">ArtChain Admin</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
