"use client";

import {
  IconBriefcase,
  IconDashboard,
  IconFileText,
  IconMoneybag,
  IconSettings,
  IconTrophy,
  IconUsers,
} from "@tabler/icons-react";
import * as React from "react";

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
    name: "Staff User",
    email: "staff@artchain.com",
    avatar: "/avatars/staff.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard/staff",
      icon: IconDashboard,
    },
    {
      title: "Competitor Management",
      url: "/dashboard/staff/competitors",
      icon: IconUsers,
      items: [
        {
          title: "All Competitors",
          url: "/dashboard/staff/competitors",
        },
        {
          title: "Search & Filter",
          url: "/dashboard/staff/competitors/search",
        },
        {
          title: "Paintings - Pending Review",
          url: "/dashboard/staff/competitors/paintings/pending",
        },
        {
          title: "Paintings - Approved",
          url: "/dashboard/staff/competitors/paintings/approved",
        },
        {
          title: "Paintings - Rejected",
          url: "/dashboard/staff/competitors/paintings/rejected",
        },
      ],
    },
    {
      title: "Contest Management",
      url: "/dashboard/staff/contests",
      icon: IconTrophy,
      items: [
        {
          title: "All Contests",
          url: "/dashboard/staff/contests",
        },
        {
          title: "Create Contest",
          url: "/dashboard/staff/contests/create",
        },
        {
          title: "Active Contests",
          url: "/dashboard/staff/contests/active",
        },
        {
          title: "All Examiners",
          url: "/dashboard/staff/contests/examiners",
        },
        {
          title: "Invite Examiner",
          url: "/dashboard/staff/contests/examiners/invite",
        },
        {
          title: "All Awards",
          url: "/dashboard/staff/contests/awards",
        },
        {
          title: "Award Collections",
          url: "/dashboard/staff/contests/awards/collections",
        },
        {
          title: "Announce Results",
          url: "/dashboard/staff/contests/awards/announce",
        },
      ],
    },
    {
      title: "Posts Management",
      url: "/dashboard/staff/posts",
      icon: IconFileText,
      items: [
        {
          title: "All Posts",
          url: "/dashboard/staff/posts",
        },
        {
          title: "Create Post",
          url: "/dashboard/staff/posts/create",
        },
      ],
    },
    {
      title: "Sponsors Management",
      url: "/dashboard/staff/sponsors",
      icon: IconMoneybag,
      items: [
        {
          title: "All Sponsors",
          url: "/dashboard/staff/sponsors",
        },
        {
          title: "Sponsorship Campaigns",
          url: "/dashboard/staff/sponsors/campaigns",
        },
        {
          title: "Create Campaign",
          url: "/dashboard/staff/sponsors/campaigns/create",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "/dashboard/staff/settings",
      icon: IconSettings,
    },
  ],
};

export function StaffSidebar({
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
                <IconBriefcase className="!size-5 text-blue-600" />
                <span className="text-base font-semibold">ArtChain Staff</span>
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
