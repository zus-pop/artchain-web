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
      {
        title: "Quản Lý Tiêu Chí",
        url: "/dashboard/admin/criteria",
        icon: IconReport,
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
    <Sidebar
      collapsible="icon"
      className="[&_[data-sidebar=sidebar-inner]]:relative [&_[data-sidebar=sidebar-inner]]:overflow-hidden [&_[data-sidebar=sidebar-inner]]:border [&_[data-sidebar=sidebar-inner]]:border-[var(--staff-border)] [&_[data-sidebar=sidebar-inner]]:bg-[linear-gradient(165deg,var(--staff-surface)_0%,#fff8f2_45%,#fffdfb_100%)] [&_[data-sidebar=sidebar-inner]]:shadow-[0_24px_64px_rgba(66,49,55,0.12)] [&_[data-sidebar=content]]:px-2 [&_[data-sidebar=menu]]:gap-1.5 [&_[data-sidebar=menu-button]]:h-10 [&_[data-sidebar=menu-button]]:rounded-md [&_[data-sidebar=menu-button]]:px-3 [&_[data-sidebar=menu-button]]:text-[var(--staff-text-primary)] [&_[data-sidebar=menu-button]]:transition-all [&_[data-sidebar=menu-button]]:duration-300 [&_[data-sidebar=menu-button]]:ease-out [&_[data-sidebar=menu-button]>svg]:text-[var(--staff-primary)] [&_[data-sidebar=menu-button]>svg]:transition-transform [&_[data-sidebar=menu-button]:hover]:bg-[var(--staff-primary-soft)] [&_[data-sidebar=menu-button]:hover]:text-[var(--staff-text-primary)] [&_[data-sidebar=menu-button]:hover]:shadow-[0_8px_20px_rgba(255,110,26,0.14)] [&_[data-sidebar=menu-button]:hover>svg]:scale-110 [&_[data-sidebar=menu-button][data-active=true]]:bg-[linear-gradient(90deg,var(--staff-primary)_0%,var(--staff-primary-hover)_100%)] [&_[data-sidebar=menu-button][data-active=true]]:text-white [&_[data-sidebar=menu-button][data-active=true]]:shadow-[0_10px_24px_rgba(255,110,26,0.35)] [&_[data-sidebar=menu-button][data-active=true]>svg]:text-white"
      {...props}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0"
      >
        <div className="absolute -left-16 -top-14 h-44 w-44 rounded-full bg-[radial-gradient(circle,rgba(255,110,26,0.24)_0%,transparent_72%)] blur-2xl" />
        <div className="absolute -right-20 bottom-24 h-52 w-52 rounded-full bg-[radial-gradient(circle,rgba(66,49,55,0.14)_0%,transparent_72%)] blur-3xl" />
      </div>
      <SidebarHeader className="relative z-10 border-b border-[var(--staff-border)] bg-white/45 backdrop-blur-sm">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center justify-between gap-1 group-data-[state=collapsed]:justify-center">
            <SidebarMenuButton
              asChild
              size="lg"
              className="data-[slot=sidebar-menu-button]:p-1.5! hover:bg-transparent! active:bg-transparent! hover:text-inherit! active:text-inherit! hover:opacity-100! opacity-100! group-data-[state=collapsed]:hidden"
            >
              <Link href="/dashboard/admin">
                <Avatar className="h-8 w-8 rounded-sm border border-[var(--staff-border)] shadow-sm">
                  <AvatarImage src={data.user.avatar} alt={data.user.name} />
                  <AvatarFallback className="rounded-sm bg-[var(--staff-primary-soft)] text-[var(--staff-primary)]">AD</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold text-[var(--staff-primary)]">
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
      <SidebarContent className="relative z-10">
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter className="relative z-10 border-t border-[var(--staff-border)] bg-white/40 backdrop-blur-sm">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              onClick={handleLogout}
              className="text-[var(--staff-primary)] hover:bg-[var(--staff-primary-soft)] hover:text-[var(--staff-primary-hover)]"
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
        variant="primary"
      />
    </Sidebar>
  );
}
