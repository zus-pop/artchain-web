"use client";

import { useState } from "react";
import { AdminSidebar } from "@/components/admin-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Breadcrumb } from "@/components/breadcrumb";
import { CreateUserDialog } from "@/components/admin/create-user-dialog";
import { EditUserDialog } from "@/components/admin/edit-user-dialog";
import { DeleteUserDialog } from "@/components/admin/delete-user-dialog";
import { User, UserRole, UserStatus } from "@/types/dashboard";
import {
  IconPlus,
  IconPencil,
  IconTrash,
  IconUserPause,
  IconUserCheck,
  IconSearch,
} from "@tabler/icons-react";

export default function AccountsManagementPage() {
  // State for users list
  const [users, setUsers] = useState<User[]>([
    {
      id: "1",
      username: "johndoe",
      fullName: "John Doe",
      email: "john.doe@example.com",
      role: "COMPETITOR",
      status: "ACTIVE",
      createdAt: "2025-01-15",
    },
    {
      id: "2",
      username: "janesmith",
      fullName: "Jane Smith",
      email: "jane.smith@example.com",
      role: "GUARDIAN",
      status: "ACTIVE",
      createdAt: "2025-02-20",
    },
    {
      id: "3",
      username: "bobstaff",
      fullName: "Bob Johnson",
      email: "bob.johnson@example.com",
      role: "STAFF",
      status: "ACTIVE",
      createdAt: "2025-03-10",
    },
    {
      id: "4",
      username: "aliceadmin",
      fullName: "Alice Williams",
      email: "alice.williams@example.com",
      role: "ADMIN",
      status: "ACTIVE",
      createdAt: "2024-12-01",
    },
    {
      id: "5",
      username: "charliecomp",
      fullName: "Charlie Brown",
      email: "charlie.brown@example.com",
      role: "COMPETITOR",
      status: "SUSPENDED",
      createdAt: "2025-04-05",
    },
  ]);

  // State for filters and search
  const [selectedRole, setSelectedRole] = useState<UserRole | "ALL">("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // State for dialogs
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Filter users
  const filteredUsers = users.filter((user) => {
    const matchesRole = selectedRole === "ALL" || user.role === selectedRole;
    const matchesSearch =
      user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.username.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRole && matchesSearch;
  });

  // CRUD Operations
  const handleCreateUser = (data: {
    username: string;
    fullName: string;
    email: string;
    role: UserRole;
    status: UserStatus;
  }) => {
    const newUser: User = {
      id: Date.now().toString(),
      username: data.username,
      fullName: data.fullName,
      email: data.email,
      role: data.role,
      status: data.status,
      createdAt: new Date().toISOString().split("T")[0],
    };
    setUsers([...users, newUser]);
    setIsCreateDialogOpen(false);
  };

  const handleEditUser = (
    userId: string,
    data: {
      username: string;
      fullName: string;
      email: string;
      role: UserRole;
      status: UserStatus;
    }
  ) => {
    setUsers(
      users.map((user) =>
        user.id === userId
          ? {
              ...user,
              username: data.username,
              fullName: data.fullName,
              email: data.email,
              role: data.role,
              status: data.status,
            }
          : user
      )
    );
    setIsEditDialogOpen(false);
    setSelectedUser(null);
  };

  const handleDeleteUser = (userId: string) => {
    setUsers(users.filter((user) => user.id !== userId));
    setIsDeleteDialogOpen(false);
    setSelectedUser(null);
  };

  const handleToggleStatus = (user: User) => {
    setUsers(
      users.map((u) =>
        u.id === user.id
          ? {
              ...u,
              status: u.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE",
            }
          : u
      )
    );
  };

  const openEditDialog = (user: User) => {
    setSelectedUser(user);
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (user: User) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  const getRoleBadgeColor = (role: UserRole) => {
    const colors = {
      COMPETITOR: "bg-blue-100 text-blue-800",
      GUARDIAN: "bg-green-100 text-green-800",
      STAFF: "bg-purple-100 text-purple-800",
      ADMIN: "bg-red-100 text-red-800",
    };
    return colors[role];
  };

  const getStatusBadgeColor = (status: UserStatus) => {
    const colors = {
      ACTIVE: "bg-green-100 text-green-800",
      SUSPENDED: "bg-red-100 text-red-800",
      PENDING: "bg-yellow-100 text-yellow-800",
    };
    return colors[status];
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
                    All Users ({filteredUsers.length})
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
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedRole("ALL")}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                    selectedRole === "ALL"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  All Users
                </button>
                <button
                  onClick={() => setSelectedRole("COMPETITOR")}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                    selectedRole === "COMPETITOR"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Competitors
                </button>
                <button
                  onClick={() => setSelectedRole("GUARDIAN")}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                    selectedRole === "GUARDIAN"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Guardians
                </button>
                <button
                  onClick={() => setSelectedRole("STAFF")}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                    selectedRole === "STAFF"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Staff
                </button>
                <button
                  onClick={() => setSelectedRole("ADMIN")}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                    selectedRole === "ADMIN"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Admins
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
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Created
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredUsers.length === 0 ? (
                        <tr>
                          <td
                            colSpan={6}
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
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`inline-flex rounded-sm px-2 py-1 text-xs font-semibold ${getStatusBadgeColor(
                                  user.status
                                )}`}
                              >
                                {user.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {user.createdAt}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => openEditDialog(user)}
                                  className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors"
                                  title="Edit"
                                >
                                  <IconPencil className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => handleToggleStatus(user)}
                                  className={`p-1 rounded transition-colors ${
                                    user.status === "ACTIVE"
                                      ? "text-orange-600 hover:text-orange-900 hover:bg-orange-50"
                                      : "text-green-600 hover:text-green-900 hover:bg-green-50"
                                  }`}
                                  title={
                                    user.status === "ACTIVE"
                                      ? "Suspend"
                                      : "Activate"
                                  }
                                >
                                  {user.status === "ACTIVE" ? (
                                    <IconUserPause className="h-4 w-4" />
                                  ) : (
                                    <IconUserCheck className="h-4 w-4" />
                                  )}
                                </button>
                                <button
                                  onClick={() => openDeleteDialog(user)}
                                  className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors"
                                  title="Delete"
                                >
                                  <IconTrash className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
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

      {/* Edit User Dialog */}
      <EditUserDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        user={selectedUser}
        onSubmit={handleEditUser}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteUserDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        user={selectedUser}
        onConfirm={handleDeleteUser}
      />
    </SidebarProvider>
  );
}
