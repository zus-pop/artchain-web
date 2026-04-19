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
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useClientAuth } from "@/hooks";
import { useTranslation } from "@/lib/i18n";
import { useLanguageStore } from "@/store/language-store";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function AdminSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const { isAuthenticated, user, isHydrated, isLoading } = useClientAuth();
  const { currentLanguage } = useLanguageStore();
  const t = useTranslation(currentLanguage);

  const data = React.useMemo(() => ({
    user: {
      name: user?.fullName || "Admin User",
      email: user?.email || "admin@artchain.com",
      avatar: "/avatars/admin.jpg",
    },
    navMain: [
      {
        title: t.dashboard,
        url: "/dashboard/admin",
        icon: IconDashboard,
      },
      {
        title: t.accountManagement,
        url: "/dashboard/admin/accounts",
        icon: IconUsers,
        items: [
          {
            title: t.allUsers,
            url: "/dashboard/admin/accounts",
          },
          {
            title: t.competitors,
            url: "/dashboard/admin/accounts/competitors",
          },
          {
            title: t.guardians,
            url: "/dashboard/admin/accounts/guardians",
          },
          {
            title: t.staffs,
            url: "/dashboard/admin/accounts/staff",
          },
        ],
      },
      {
        title: t.contestAnalysis,
        url: "/dashboard/admin/contests",
        icon: IconChartBar,
        items: [
          {
            title: t.overview,
            url: "/dashboard/admin/statistics",
          },
          {
            title: t.userAnalysis,
            url: "/dashboard/admin/statistics/users",
          },
          {
            title: t.contestAnalysis,
            url: "/dashboard/admin/statistics/contests",
          },
          {
            title: t.reportAnalysis,
            url: "/dashboard/admin/statistics/reports",
          },
        ],
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
              <Link href="/dashboard/admin">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={data.user.avatar} alt={data.user.name} />
                  <AvatarFallback className="rounded-lg bg-transparent! hover:bg-transparent!">AD</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold text-blue-600">
                    {t.artChainAdmin}
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
              <span className="font-medium group-data-[state=collapsed]:hidden">Đăng xuất</span>
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
