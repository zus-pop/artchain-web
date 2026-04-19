"use client";

import {
  IconDashboard,
  IconFileText,
  IconMoneybag,
  IconPalette,
  IconTrophy,
} from "@tabler/icons-react";
import * as React from "react";

import { NavMain } from "@/components/nav-main";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IconLogout } from "@tabler/icons-react";
import { useAuthStore } from "@/store";
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
import { useClientAuth } from "@/hooks";
import { useTranslation } from "@/lib/i18n";
import { useLanguageStore } from "@/store/language-store";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function StaffSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const { isAuthenticated, user, isHydrated, isLoading } = useClientAuth();
  const { currentLanguage } = useLanguageStore();
  const t = useTranslation(currentLanguage);

  const data = React.useMemo(() => ({
    user: {
      name: user?.fullName || "Staff User",
      email: user?.email || "staff@artchain.com",
      avatar: "/avatars/staff.jpg",
    },
    navMain: [
      {
        title: t.dashboard,
        url: "/dashboard/staff",
        icon: IconDashboard,
      },
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
      {
        title: t.auctionManagement,
        url: "/dashboard/staff/auctions",
        icon: IconTrophy,
        items: [
          {
            title: t.allAuctions,
            url: "/dashboard/staff/auctions",
          },
          {
            title: t.createAuction,
            url: "/dashboard/staff/auctions/create",
          },
        ],
      },
      {
        title: t.financeManagement,
        url: "/dashboard/staff/finance",
        icon: IconMoneybag,
      },
    ],
    navSecondary: [],
  }), [t, user]);

  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);
  const [showLogoutConfirm, setShowLogoutConfirm] = React.useState(false);

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    logout();
    router.replace("/auth");
  };

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
              size="lg"
              className="data-[slot=sidebar-menu-button]:p-1.5! hover:bg-transparent! active:bg-transparent! hover:text-inherit! active:text-inherit! hover:opacity-100! opacity-100! group-data-[state=collapsed]:hidden"
            >
              <Link href="/dashboard/staff">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={data.user.avatar} alt={data.user.name} />
                  <AvatarFallback className="rounded-lg bg-transparent! hover:bg-transparent!">ST</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold text-blue-600">
                    {t.artChainStaff}
                  </span>
                  <span className="text-muted-foreground truncate text-xs">
                    {data.user.name}
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
            <SidebarTrigger className="-mr-1 border-0 hover:bg-transparent group-data-[state=collapsed]:mr-0" />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              onClick={handleLogout}
              className="text-red-600 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950/30"
            >
              <IconLogout className="size-5" />
              <span className="font-medium group-data-[state=collapsed]:hidden">Log out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <ConfirmDialog
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={confirmLogout}
        title="Đăng xuất"
        description="Bạn có chắc chắn muốn đăng xuất khỏi hệ thống?"
        confirmText="Đăng xuất"
        variant="destructive"
      />
    </Sidebar>
  );
}
