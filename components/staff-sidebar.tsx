"use client";

import {
  IconBriefcase,
  IconDashboard,
  IconFileText,
  IconMoneybag,
  IconPalette,
  IconTrophy,
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
import { useClientAuth } from "@/hooks";
import { useTranslation } from "@/lib/i18n";
import { useLanguageStore } from "@/store/language-store";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function StaffSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const { currentLanguage } = useLanguageStore();
  const t = useTranslation(currentLanguage);

  const data = {
    user: {
      name: "Staff User",
      email: "staff@artchain.com",
      avatar: "/avatars/staff.jpg",
    },
    navMain: [
      {
        title: t.dashboard,
        url: "/dashboard/staff",
        icon: IconDashboard,
      },
      // {
      //   title: t.competitorManagement,
      //   url: "/dashboard/staff/competitors",
      //   icon: IconUsers,
      //   items: [
      //     {
      //       title: "All Competitors",
      //       url: "/dashboard/staff/competitors",
      //     },
      //     {
      //       title: "Search & Filter",
      //       url: "/dashboard/staff/competitors/search",
      //     },
      //     {
      //       title: "Paintings - Pending Review",
      //       url: "/dashboard/staff/competitors/paintings/pending",
      //     },
      //     {
      //       title: "Paintings - Approved",
      //       url: "/dashboard/staff/competitors/paintings/approved",
      //     },
      //     {
      //       title: "Paintings - Rejected",
      //       url: "/dashboard/staff/competitors/paintings/rejected",
      //     },
      //   ],
      // },
      {
        title: t.contestManagement,
        url: "/dashboard/staff/contests",
        icon: IconTrophy,
        items: [
          {
            title: t.allContests,
            url: "/dashboard/staff/contests",
          },
          {
            title: t.createContestNav,
            url: "/dashboard/staff/contests/create",
          },
          {
            title: t.activeContestsNav,
            url: "/dashboard/staff/contests/active",
          },
          {
            title: t.allExaminers,
            url: "/dashboard/staff/contests/examiners",
          },
          {
            title: t.inviteExaminerNav,
            url: "/dashboard/staff/contests/examiners/invite",
          },
          {
            title: t.allAwards,
            url: "/dashboard/staff/contests/awards",
          },
          {
            title: t.awardCollections,
            url: "/dashboard/staff/contests/awards/collections",
          },
          {
            title: t.announceResults,
            url: "/dashboard/staff/contests/awards/announce",
          },
        ],
      },
      {
        title: t.postsManagement,
        url: "/dashboard/staff/posts",
        icon: IconFileText,
        items: [
          {
            title: t.allPosts,
            url: "/dashboard/staff/posts",
          },
          {
            title: t.createPostNav,
            url: "/dashboard/staff/posts/create",
          },
        ],
      },

      {
        title: t.campaignManagement,
        url: "/dashboard/staff/campaigns",
        icon: IconMoneybag,
        items: [
          {
            title: t.allCampaigns,
            url: "/dashboard/staff/campaigns",
          },
          {
            title: t.createCampaign,
            url: "/dashboard/staff/campaigns/create",
          },
        ],
      },
      {
        title: t.exhibitionManagement,
        url: "/dashboard/staff/exhibitions",
        icon: IconPalette,
        items: [
          {
            title: t.allExhibitions,
            url: "/dashboard/staff/exhibitions",
          },
          {
            title: t.createExhibition,
            url: "/dashboard/staff/exhibitions/create",
          },
        ],
      },
    ],
    navSecondary: [],
  };

  const router = useRouter();
  const { isAuthenticated, user } = useClientAuth();

  React.useEffect(() => {
    if (!isAuthenticated) {
      // Redirect to auth page if not authenticated
      router.push("/auth");
      return;
    }
  }, [isAuthenticated, user, router]);

  if (user) {
    console.log(user);
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
                <IconBriefcase className="size-5! text-blue-600" />
                <span className="text-base font-semibold">
                  {t.artChainStaff}
                </span>
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
