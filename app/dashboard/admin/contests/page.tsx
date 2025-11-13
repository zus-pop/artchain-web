"use client";

import { AdminSidebar } from "@/components/admin-sidebar";
import { CreateUserDialog } from "@/components/admin/create-user-dialog";
import { Breadcrumb } from "@/components/breadcrumb";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { User, UserRole } from "@/types";
import { AdminUser } from "@/types/admin/user";
import { getAllUsers, banUser, activateUser } from "@/apis/admin";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  IconPlus,
  IconSearch,
  IconChevronsLeft,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsRight,
} from "@tabler/icons-react";
import { useState } from "react";
import { useLanguageStore } from "@/store/language-store";
import { useTranslation } from "@/lib/i18n";

// Helper function to convert AdminUser to User type
const convertAdminUserToUser = (adminUser: AdminUser): User => {
  return {
    id: adminUser.userId,
    username: adminUser.username,
    fullName: adminUser.fullName,
    email: adminUser.email,
    role: adminUser.role as UserRole,
    status: adminUser.status === 1 ? "ACTIVE" : "SUSPENDED",
    createdAt: new Date(adminUser.createdAt).toISOString().split("T")[0],
  };
};

export default function AccountsManagementPage() {
  // State for filters and search
  const [selectedRole, setSelectedRole] = useState<UserRole | "ALL">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Translation
  const { currentLanguage } = useLanguageStore();
  const t = useTranslation(currentLanguage);

  // Fetch users from API
  const {
    data: usersResponse,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["admin-users", currentPage, pageSize, selectedRole, searchQuery],
    queryFn: () =>
      getAllUsers({
        page: currentPage,
        limit: pageSize,
        role: selectedRole !== "ALL" ? selectedRole : undefined,
        search: searchQuery || undefined,
      }),
    staleTime: 1 * 60 * 1000, // 1 minute
  });

  // Convert API users to local User type
  const users = usersResponse?.data.map(convertAdminUserToUser) || [];
  const meta = usersResponse?.meta;

  // State for dialogs
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  // Filter users (now done by API, but keep for local display)
  const filteredUsers = users;

  // Ban/Activate user mutations
  const banUserMutation = useMutation({
    mutationFn: banUser,
    onSuccess: () => {
      refetch();
    },
  });

  const activateUserMutation = useMutation({
    mutationFn: activateUser,
    onSuccess: () => {
      refetch();
    },
  });

  // CRUD Operations

  const handleToggleStatus = async (user: User) => {
    if (user.status === "ACTIVE") {
      await banUserMutation.mutateAsync(user.id);
    } else {
      await activateUserMutation.mutateAsync(user.id);
    }
  };

  const getRoleBadgeColor = (role: UserRole) => {
    const colors: Record<UserRole, string> = {
      COMPETITOR: "staff-badge-pending",
      GUARDIAN: "staff-badge-approved",
      STAFF: "staff-badge-active",
      ADMIN: "staff-badge-rejected",
      EXAMINER: "staff-badge-neutral",
    };
    return colors[role];
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AdminSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader title={t.accountManagement} />
        <div className="flex flex-1 flex-col">
          <div className="px-4 lg:px-6 py-2 border-b border-[#e6e2da] bg-linear-to-r from-red-50 to-orange-50">
            <Breadcrumb
              items={[{ label: t.accountManagement }]}
              homeHref="/dashboard/admin"
            />
          </div>
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
              {/* Page Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="staff-heading">
                    {t.allUsers} ({meta?.total || 0})
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    {t.manageAllUserAccounts}
                  </p>
                </div>
                <button
                  onClick={() => setIsCreateDialogOpen(true)}
                  className="staff-btn-primary flex items-center gap-2"
                >
                  <IconPlus className="h-4 w-4" />
                  {t.addNewUser}
                </button>
              </div>

              {/* Search Bar */}
              <div className="relative border-[1.5]">
                <IconSearch className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder={t.searchByNameEmailUsername}
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1); // Reset to first page on search
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      refetch();
                    }
                  }}
                  className="staff-input w-full pl-10 pr-4 py-2"
                />
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => {
                    setSelectedRole("ALL");
                    setCurrentPage(1);
                  }}
                  className={`px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                    selectedRole === "ALL"
                      ? "staff-badge-active"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {t.allUsersFilter}
                </button>
                <button
                  onClick={() => {
                    setSelectedRole("COMPETITOR");
                    setCurrentPage(1);
                  }}
                  className={`px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                    selectedRole === "COMPETITOR"
                      ? "staff-badge-pending"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {t.competitorsFilter}
                </button>
                <button
                  onClick={() => {
                    setSelectedRole("GUARDIAN");
                    setCurrentPage(1);
                  }}
                  className={`px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                    selectedRole === "GUARDIAN"
                      ? "staff-badge-approved"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {t.guardiansFilter}
                </button>
                <button
                  onClick={() => {
                    setSelectedRole("STAFF");
                    setCurrentPage(1);
                  }}
                  className={`px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                    selectedRole === "STAFF"
                      ? "staff-badge-rejected"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {t.staffFilter}
                </button>
                <button
                  onClick={() => {
                    setSelectedRole("ADMIN");
                    setCurrentPage(1);
                  }}
                  className={`px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                    selectedRole === "ADMIN"
                      ? "staff-badge-neutral"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {t.adminsFilter}
                </button>
                <button
                  onClick={() => {
                    setSelectedRole("EXAMINER");
                    setCurrentPage(1);
                  }}
                  className={`px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                    selectedRole === "EXAMINER"
                      ? "staff-badge-active"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {t.examinersFilter}
                </button>
              </div>

              {/* Users Table */}
              <div className="staff-card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-linear-to-r from-red-50 to-orange-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {t.userTable}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {t.emailTable}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {t.roleTable}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {t.createdTable}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {t.activeTableAdmin}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {isLoading ? (
                        <tr>
                          <td
                            colSpan={5}
                            className="px-6 py-12 text-center text-gray-500"
                          >
                            {t.loadingUsers}
                          </td>
                        </tr>
                      ) : error ? (
                        <tr>
                          <td
                            colSpan={5}
                            className="px-6 py-12 text-center text-red-500"
                          >
                            {t.errorLoadingUsers}
                          </td>
                        </tr>
                      ) : filteredUsers.length === 0 ? (
                        <tr>
                          <td
                            colSpan={5}
                            className="px-6 py-12 text-center text-gray-500"
                          >
                            {t.noUsersFound}
                          </td>
                        </tr>
                      ) : (
                        filteredUsers.map((user) => (
                          <tr key={user.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="h-10 w-10 rounded-full bg-[#d9534f] flex items-center justify-center text-white font-semibold">
                                  {getInitials(user.fullName)}
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">
                                    {user.fullName}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    @{user.username}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {user.email}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`inline-flex px-2 py-1 text-xs font-semibold ${getRoleBadgeColor(
                                  user.role
                                )}`}
                              >
                                {user.role}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {user.createdAt}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={user.status === "ACTIVE"}
                                  onChange={() => handleToggleStatus(user)}
                                  disabled={
                                    banUserMutation.isPending ||
                                    activateUserMutation.isPending
                                  }
                                  className="sr-only peer"
                                />
                                <div className="group peer ring-0 bg-rose-400 rounded-full outline-none duration-300 after:duration-300 w-16 h-8 shadow-md peer-checked:bg-emerald-500 peer-focus:outline-none after:content-[''] after:rounded-full after:absolute after:bg-gray-50 after:outline-none after:h-6 after:w-6 after:top-1 after:left-1 after:flex after:justify-center after:items-center peer-checked:after:translate-x-8 peer-hover:after:scale-95 peer-disabled:opacity-50 peer-disabled:cursor-not-allowed">
                                  <svg
                                    className="absolute top-1 left-8 stroke-gray-900 w-6 h-6"
                                    height={100}
                                    preserveAspectRatio="xMidYMid meet"
                                    viewBox="0 0 100 100"
                                    width={100}
                                    x={0}
                                    xmlns="http://www.w3.org/2000/svg"
                                    y={0}
                                  >
                                    <path
                                      d="M30,46V38a20,20,0,0,1,40,0v8a8,8,0,0,1,8,8V74a8,8,0,0,1-8,8H30a8,8,0,0,1-8-8V54A8,8,0,0,1,30,46Zm32-8v8H38V38a12,12,0,0,1,24,0Z"
                                      fillRule="evenodd"
                                    ></path>
                                  </svg>
                                  <svg
                                    className="absolute top-1 left-1 stroke-gray-900 w-6 h-6"
                                    height={100}
                                    preserveAspectRatio="xMidYMid meet"
                                    viewBox="0 0 100 100"
                                    width={100}
                                    x={0}
                                    xmlns="http://www.w3.org/2000/svg"
                                    y={0}
                                  >
                                    <path
                                      className="svg-fill-primary"
                                      d="M50,18A19.9,19.9,0,0,0,30,38v8a8,8,0,0,0-8,8V74a8,8,0,0,0,8,8H70a8,8,0,0,0,8-8V54a8,8,0,0,0-8-8H38V38a12,12,0,0,1,23.6-3,4,4,0,1,0,7.8-2A20.1,20.1,0,0,0,50,18Z"
                                    ></path>
                                  </svg>
                                </div>
                              </label>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Pagination */}
              {meta && meta.totalPages > 1 && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm staff-text-secondary">
                        {t.show} {t.perPage}:
                      </span>
                      <select
                        value={pageSize}
                        onChange={(e) => {
                          setPageSize(Number(e.target.value));
                          setCurrentPage(1); // Reset to first page when changing page size
                        }}
                        className="px-2 py-1 border border-[#e6e2da] focus:outline-none focus:ring-2 focus:ring-[#d9534f] text-sm"
                      >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                      </select>
                    </div>
                    <div className="text-sm staff-text-secondary">
                      {t.showing}{" "}
                      {users.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}{" "}
                      {t.to} {Math.min(currentPage * pageSize, meta.total)}{" "}
                      {t.of} {meta.total} {t.entries.toLowerCase()}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPage(1)}
                      disabled={currentPage === 1}
                      className="p-1 border border-[#e6e2da] hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      title="First page"
                    >
                      <IconChevronsLeft className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(1, prev - 1))
                      }
                      disabled={currentPage === 1}
                      className="p-1 border border-[#e6e2da] hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Previous page"
                    >
                      <IconChevronLeft className="h-4 w-4" />
                    </button>

                    <span className="px-3 py-1 text-sm staff-text-primary">
                      {t.pageText} {currentPage} {t.ofText} {meta.totalPages}
                    </span>

                    <button
                      onClick={() =>
                        setCurrentPage((prev) =>
                          Math.min(meta.totalPages, prev + 1)
                        )
                      }
                      disabled={currentPage === meta.totalPages}
                      className="p-1 border border-[#e6e2da] hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Next page"
                    >
                      <IconChevronRight className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setCurrentPage(meta.totalPages)}
                      disabled={currentPage === meta.totalPages}
                      className="p-1 border border-[#e6e2da] hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Last page"
                    >
                      <IconChevronsRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </SidebarInset>

      {/* Create User Dialog */}
      <CreateUserDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      />
    </SidebarProvider>
  );
}
