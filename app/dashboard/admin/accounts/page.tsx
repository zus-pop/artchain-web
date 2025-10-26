"use client";

import { AdminSidebar } from "@/components/admin-sidebar";
import { CreateUserDialog } from "@/components/admin/create-user-dialog";
import { Breadcrumb } from "@/components/breadcrumb";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { User, UserRole, UserStatus } from "@/types";
import { getAllUsers, AdminUser, banUser, activateUser } from "@/apis/admin";
import { useQuery, useMutation } from "@tanstack/react-query";
import { IconPlus, IconSearch } from "@tabler/icons-react";
import { useState } from "react";

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
  const [pageLimit] = useState(10);

  // Fetch users from API
  const {
    data: usersResponse,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: [
      "admin-users",
      currentPage,
      pageLimit,
      selectedRole,
      searchQuery,
    ],
    queryFn: () =>
      getAllUsers({
        page: currentPage,
        limit: pageLimit,
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleCreateUser = (data: {
    username: string;
    fullName: string;
    email: string;
    role: UserRole;
    status: UserStatus;
  }) => {
    // TODO: Call API to create user
    // For now, just close dialog and refetch
    setIsCreateDialogOpen(false);
    refetch();
  };

  const handleToggleStatus = async (user: User) => {
    if (user.status === "ACTIVE") {
      await banUserMutation.mutateAsync(user.id);
    } else {
      await activateUserMutation.mutateAsync(user.id);
    }
  };

  const getRoleBadgeColor = (role: UserRole) => {
    const colors: Record<UserRole, string> = {
      COMPETITOR: "bg-blue-100 text-blue-800",
      GUARDIAN: "bg-green-100 text-green-800",
      STAFF: "bg-purple-100 text-purple-800",
      ADMIN: "bg-red-100 text-red-800",
      EXAMINER: "bg-orange-100 text-orange-800",
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
        <SiteHeader title="Account Management" />
        <div className="flex flex-1 flex-col">
          <div className="px-4 lg:px-6 py-2 border-b border-gray-200 bg-white">
            <Breadcrumb
              items={[{ label: "Account Management" }]}
              homeHref="/dashboard/admin"
            />
          </div>
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
              {/* Page Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    All Users ({meta?.total || 0})
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Manage all user accounts in the system
                  </p>
                </div>
                <button
                  onClick={() => setIsCreateDialogOpen(true)}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2"
                >
                  <IconPlus className="h-4 w-4" />
                  Add New User
                </button>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, email, or username..."
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
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => {
                    setSelectedRole("ALL");
                    setCurrentPage(1);
                  }}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                    selectedRole === "ALL"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  All Users
                </button>
                <button
                  onClick={() => {
                    setSelectedRole("COMPETITOR");
                    setCurrentPage(1);
                  }}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                    selectedRole === "COMPETITOR"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Competitors
                </button>
                <button
                  onClick={() => {
                    setSelectedRole("GUARDIAN");
                    setCurrentPage(1);
                  }}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                    selectedRole === "GUARDIAN"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Guardians
                </button>
                <button
                  onClick={() => {
                    setSelectedRole("STAFF");
                    setCurrentPage(1);
                  }}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                    selectedRole === "STAFF"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Staff
                </button>
                <button
                  onClick={() => {
                    setSelectedRole("ADMIN");
                    setCurrentPage(1);
                  }}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                    selectedRole === "ADMIN"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Admins
                </button>
                <button
                  onClick={() => {
                    setSelectedRole("EXAMINER");
                    setCurrentPage(1);
                  }}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                    selectedRole === "EXAMINER"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Examiners
                </button>
              </div>

              {/* Users Table */}
              <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          User
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Role
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Created
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Active
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
                            Loading users...
                          </td>
                        </tr>
                      ) : error ? (
                        <tr>
                          <td
                            colSpan={5}
                            className="px-6 py-12 text-center text-red-500"
                          >
                            Error loading users. Please try again.
                          </td>
                        </tr>
                      ) : filteredUsers.length === 0 ? (
                        <tr>
                          <td
                            colSpan={5}
                            className="px-6 py-12 text-center text-gray-500"
                          >
                            No users found matching your criteria
                          </td>
                        </tr>
                      ) : (
                        filteredUsers.map((user) => (
                          <tr key={user.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
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
                                className={`inline-flex rounded-sm px-2 py-1 text-xs font-semibold ${getRoleBadgeColor(
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
                                <div className="group peer ring-0 bg-rose-400 rounded-full outline-none duration-300 after:duration-300 w-24 h-12 shadow-md peer-checked:bg-emerald-500 peer-focus:outline-none after:content-[''] after:rounded-full after:absolute after:bg-gray-50 after:outline-none after:h-10 after:w-10 after:top-1 after:left-1 after:flex after:justify-center after:items-center peer-checked:after:translate-x-12 peer-hover:after:scale-95 peer-disabled:opacity-50 peer-disabled:cursor-not-allowed">
                                  <svg
                                    className="absolute top-1 left-12 stroke-gray-900 w-10 h-10"
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
                                    className="absolute top-1 left-1 stroke-gray-900 w-10 h-10"
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
                <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 rounded-b-lg">
                  <div className="flex flex-1 justify-between sm:hidden">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={!meta.hasPreviousPage}
                      className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setCurrentPage((p) => p + 1)}
                      disabled={!meta.hasNextPage}
                      className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                  <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Showing page{" "}
                        <span className="font-medium">{meta.page}</span> of{" "}
                        <span className="font-medium">{meta.totalPages}</span> (
                        <span className="font-medium">{meta.total}</span> total
                        users)
                      </p>
                    </div>
                    <div>
                      <nav
                        className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                        aria-label="Pagination"
                      >
                        <button
                          onClick={() =>
                            setCurrentPage((p) => Math.max(1, p - 1))
                          }
                          disabled={!meta.hasPreviousPage}
                          className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <span className="sr-only">Previous</span>‹
                        </button>
                        {Array.from(
                          { length: Math.min(5, meta.totalPages) },
                          (_, i) => {
                            const pageNum = i + 1;
                            return (
                              <button
                                key={pageNum}
                                onClick={() => setCurrentPage(pageNum)}
                                className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                                  currentPage === pageNum
                                    ? "z-10 bg-blue-600 text-white focus:z-20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                                    : "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                                }`}
                              >
                                {pageNum}
                              </button>
                            );
                          }
                        )}
                        <button
                          onClick={() => setCurrentPage((p) => p + 1)}
                          disabled={!meta.hasNextPage}
                          className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <span className="sr-only">Next</span>›
                        </button>
                      </nav>
                    </div>
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
        onSubmit={handleCreateUser}
      />
    </SidebarProvider>
  );
}
