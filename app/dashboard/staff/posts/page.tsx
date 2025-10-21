"use client";

import { Breadcrumb } from "@/components/breadcrumb";
import { SiteHeader } from "@/components/site-header";
import { StaffSidebar } from "@/components/staff-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Post, PostStatus } from "@/types/dashboard";
import { StatsCards } from "@/components/staff/StatsCards";
import {
  IconEdit,
  IconEye,
  IconFileText,
  IconFilter,
  IconPlus,
  IconSearch,
  IconTrash,
  IconUser,
} from "@tabler/icons-react";
import Link from "next/link";
import { useState } from "react";

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([
    {
      id: "1",
      title: "Welcome to ArtChain 2025",
      content: "We're excited to announce the launch of ArtChain 2025...",
      author: "Staff User",
      status: "PUBLISHED",
      createdAt: "2025-09-15",
      publishedAt: "2025-09-15",
      views: 1250,
      category: "Announcement",
    },
    {
      id: "2",
      title: "Contest Guidelines Update",
      content: "Important updates to our contest submission guidelines...",
      author: "Staff User",
      status: "PUBLISHED",
      createdAt: "2025-09-20",
      publishedAt: "2025-09-20",
      views: 890,
      category: "Guidelines",
    },
    {
      id: "3",
      title: "New Art Categories for 2025",
      content:
        "Introducing exciting new art categories for this year's competitions...",
      author: "Staff User",
      status: "DRAFT",
      createdAt: "2025-10-01",
      views: 0,
      category: "News",
    },
    {
      id: "4",
      title: "Winner Announcement - Summer Art Festival",
      content:
        "Congratulations to all the winners of our Summer Art Festival...",
      author: "Staff User",
      status: "PUBLISHED",
      createdAt: "2025-08-30",
      publishedAt: "2025-08-30",
      views: 2100,
      category: "Results",
    },
    {
      id: "5",
      title: "ArtChain Community Spotlight",
      content:
        "Featuring amazing artworks from our talented community members...",
      author: "Staff User",
      status: "ARCHIVED",
      createdAt: "2025-07-15",
      publishedAt: "2025-07-15",
      views: 750,
      category: "Community",
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<PostStatus | "ALL">(
    "ALL"
  );
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");

  const categories = [
    "ALL",
    ...Array.from(new Set(posts.map((post) => post.category))),
  ];

  const statusOptions: (PostStatus | "ALL")[] = [
    "ALL",
    "DRAFT",
    "PUBLISHED",
    "ARCHIVED",
  ];

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      selectedStatus === "ALL" || post.status === selectedStatus;
    const matchesCategory =
      selectedCategory === "ALL" || post.category === selectedCategory;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const getStatusBadgeColor = (status: PostStatus) => {
    switch (status) {
      case "PUBLISHED":
        return "staff-badge-active";
      case "DRAFT":
        return "staff-badge-pending";
      case "ARCHIVED":
        return "staff-badge-neutral";
      default:
        return "staff-badge-neutral";
    }
  };

  const handleDeletePost = (postId: string) => {
    setPosts(posts.filter((post) => post.id !== postId));
  };

  const handleToggleStatus = (postId: string, newStatus: PostStatus) => {
    setPosts(
      posts.map((post) =>
        post.id === postId ? { ...post, status: newStatus } : post
      )
    );
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
      <StaffSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader title="Posts Management" />
        <div className="flex flex-1 flex-col">
          <div className="px-4 lg:px-6 py-2 border-b border-[#e6e2da] bg-white">
            <Breadcrumb
              items={[{ label: "Posts Management" }]}
              homeHref="/dashboard/staff"
            />
          </div>
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
              {/* Page Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold staff-text-primary">
                    All Posts ({filteredPosts.length})
                  </h2>
                  <p className="text-sm staff-text-secondary mt-1">
                    Manage announcements, news, and content for the ArtChain
                    platform
                  </p>
                  <p className="text-xs staff-text-secondary mt-1">
                    💡 <strong>Archive</strong> keeps old content accessible but
                    hidden from main listings for better organization
                  </p>
                </div>
                <Link
                  href="/dashboard/staff/posts/create"
                  className="staff-btn-primary transition-colors duration-200 flex items-center gap-2"
                >
                  <IconPlus className="h-4 w-4" />
                  Create New Post
                </Link>
              </div>

              {/* Statistics Cards */}
              <StatsCards
                stats={[
                  {
                    title: "Total Posts",
                    value: posts.length,
                    subtitle: "All content",
                    icon: <IconFileText className="h-6 w-6" />,
                    variant: "info",
                  },
                  {
                    title: "Published",
                    value: posts.filter((p) => p.status === "PUBLISHED").length,
                    subtitle: "Live content",
                    icon: <IconFileText className="h-6 w-6" />,
                    variant: "warning",
                  },
                  {
                    title: "Drafts",
                    value: posts.filter((p) => p.status === "DRAFT").length,
                    subtitle: "Work in progress",
                    icon: <IconFileText className="h-6 w-6" />,
                    variant: "success",
                  },
                  {
                    title: "Total Views",
                    value: posts
                      .reduce((sum, post) => sum + post.views, 0)
                      .toLocaleString(),
                    subtitle: "All-time views",
                    icon: <IconEye className="h-6 w-6" />,
                    variant: "primary",
                  },
                ]}
              />

              {/* Search and Filters */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by title, content, or author..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-[#e6e2da]  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <IconFilter className="h-5 w-5 text-gray-400" />
                  <select
                    value={selectedStatus}
                    onChange={(e) =>
                      setSelectedStatus(e.target.value as PostStatus | "ALL")
                    }
                    className="px-4 py-2 border border-[#e6e2da]  focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-4 py-2 border border-[#e6e2da]  focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Posts Table */}
              <div className="staff-card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium staff-text-secondary uppercase tracking-wider">
                          Post
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium staff-text-secondary uppercase tracking-wider">
                          Category
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium staff-text-secondary uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium staff-text-secondary uppercase tracking-wider">
                          Views
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium staff-text-secondary uppercase tracking-wider">
                          Created
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium staff-text-secondary uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredPosts.length === 0 ? (
                        <tr>
                          <td
                            colSpan={6}
                            className="px-6 py-12 text-center staff-text-secondary"
                          >
                            No posts found matching your criteria
                          </td>
                        </tr>
                      ) : (
                        filteredPosts.map((post) => (
                          <tr key={post.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-1">
                                  <div className="text-sm font-medium staff-text-primary line-clamp-1">
                                    {post.title}
                                  </div>
                                  <div className="text-sm staff-text-secondary flex items-center gap-2">
                                    <IconUser className="h-3 w-3" />
                                    {post.author}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="inline-flex  px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800">
                                {post.category}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`inline-flex  px-2 py-1 text-xs font-semibold ${getStatusBadgeColor(
                                  post.status
                                )}`}
                              >
                                {post.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm staff-text-secondary">
                              {post.views.toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm staff-text-secondary">
                              <div>
                                <div>{post.createdAt}</div>
                                {post.publishedAt &&
                                  post.status === "PUBLISHED" && (
                                    <div className="text-xs text-green-600">
                                      Published: {post.publishedAt}
                                    </div>
                                  )}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex items-center justify-end gap-2">
                                <a
                                  href={`/dashboard/staff/posts/${post.id}`}
                                  className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors"
                                  title="View Details"
                                >
                                  <IconEye className="h-4 w-4" />
                                </a>
                                <a
                                  href={`/dashboard/staff/posts/create?id=${post.id}`}
                                  className="staff-text-secondary hover:staff-text-primary p-1 rounded hover:bg-gray-50 transition-colors"
                                  title="Edit"
                                >
                                  <IconEdit className="h-4 w-4" />
                                </a>
                                {post.status === "DRAFT" && (
                                  <button
                                    onClick={() =>
                                      handleToggleStatus(post.id, "PUBLISHED")
                                    }
                                    className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50 transition-colors"
                                    title="Publish"
                                  >
                                    <IconFileText className="h-4 w-4" />
                                  </button>
                                )}
                                {post.status === "PUBLISHED" && (
                                  <button
                                    onClick={() =>
                                      handleToggleStatus(post.id, "ARCHIVED")
                                    }
                                    className="text-orange-600 hover:text-orange-900 p-1 rounded hover:bg-orange-50 transition-colors"
                                    title="Archive"
                                  >
                                    <IconFileText className="h-4 w-4" />
                                  </button>
                                )}
                                <button
                                  onClick={() => handleDeletePost(post.id)}
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
    </SidebarProvider>
  );
}
