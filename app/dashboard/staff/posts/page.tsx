"use client";

import { Breadcrumb } from "@/components/breadcrumb";
import { SiteHeader } from "@/components/site-header";
import { StaffSidebar } from "@/components/staff-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { PostStatus } from "@/types/dashboard";
import { StatsCards } from "@/components/staff/StatsCards";
import {
  IconEdit,
  IconEye,
  IconFileText,
  IconFilter,
  IconPlus,
  IconSearch,
  IconTrash,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
} from "@tabler/icons-react";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getStaffPosts, deleteStaffPost, updateStaffPost } from "@/apis/staff";
import { toast } from "sonner";
import { Post } from "@/types/staff/post-dto";

export default function PostsPage() {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<PostStatus | "ALL">(
    "ALL"
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const statusOptions: (PostStatus | "ALL")[] = [
    "ALL",
    "DRAFT",
    "PUBLISHED",
    "ARCHIVED",
  ];

  // Fetch posts using React Query
  const { data: postsResponse, isLoading } = useQuery({
    queryKey: [
      "staff-posts",
      currentPage,
      pageSize,
      selectedStatus,
      searchQuery,
    ],
    queryFn: async () => {
      const params: {
        page: number;
        limit: number;
        status?: PostStatus;
        search?: string;
      } = {
        page: currentPage,
        limit: pageSize,
      };

      if (selectedStatus !== "ALL") {
        params.status = selectedStatus;
      }

      if (searchQuery.trim()) {
        params.search = searchQuery;
      }

      const response = await getStaffPosts(params);
      return response;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const posts = postsResponse?.data || [];
  const totalPosts = postsResponse?.meta?.total || 0;
  const totalPages = postsResponse?.meta?.totalPages || 1;

  const filteredPosts = posts;

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedStatus, searchQuery]);

  // Delete post mutation
  const deletePostMutation = useMutation({
    mutationFn: (postId: number) => deleteStaffPost(String(postId)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff-posts"] });
      toast.success("Post deleted successfully!");
    },
    onError: (error) => {
      console.error("Error deleting post:", error);
      toast.error("Failed to delete post. Please try again.");
    },
  });

  // Update post status mutation
  const updatePostStatusMutation = useMutation({
    mutationFn: ({ postId, status }: { postId: number; status: PostStatus }) =>
      updateStaffPost(String(postId), { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff-posts"] });
      toast.success("Post status updated successfully!");
    },
    onError: (error) => {
      console.error("Error updating post status:", error);
      toast.error("Failed to update post status. Please try again.");
    },
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

  const handleDeletePost = async (postId: number) => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    deletePostMutation.mutate(postId);
  };

  const handleToggleStatus = async (postId: number, newStatus: PostStatus) => {
    updatePostStatusMutation.mutate({ postId, status: newStatus });
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
                    All Posts ({totalPosts})
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
                    value: totalPosts,
                    subtitle: "All content",
                    icon: <IconFileText className="h-6 w-6" />,
                    variant: "info",
                  },
                  {
                    title: "Published",
                    value: posts.filter((p: Post) => p.status === "PUBLISHED")
                      .length,
                    subtitle: "Live content",
                    icon: <IconFileText className="h-6 w-6" />,
                    variant: "warning",
                  },
                  {
                    title: "Drafts",
                    value: posts.filter((p: Post) => p.status === "DRAFT")
                      .length,
                    subtitle: "Work in progress",
                    icon: <IconFileText className="h-6 w-6" />,
                    variant: "success",
                  },
                  {
                    title: "Total Tags",
                    value: Array.from(
                      new Set(
                        posts.flatMap((p: Post) =>
                          p.postTags.map((t) => t.tag_id)
                        )
                      )
                    ).length,
                    subtitle: "Unique tags",
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
                    placeholder="Search by title or content..."
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
              </div>

              {/* Posts Table */}
              <div className="staff-card overflow-hidden">
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                      <p className="mt-4 staff-text-secondary">
                        Loading posts...
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium staff-text-secondary uppercase tracking-wider">
                            Post
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium staff-text-secondary uppercase tracking-wider">
                            Tags
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium staff-text-secondary uppercase tracking-wider">
                            Status
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
                              colSpan={5}
                              className="px-6 py-12 text-center staff-text-secondary"
                            >
                              No posts found matching your criteria
                            </td>
                          </tr>
                        ) : (
                          filteredPosts.map((post: Post) => (
                            <tr key={post.post_id} className="hover:bg-gray-50">
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                  {post.image_url && (
                                    <div className="relative w-12 h-12">
                                      <Image
                                        src={post.image_url}
                                        alt={post.title}
                                        fill
                                        className="object-cover rounded"
                                      />
                                    </div>
                                  )}
                                  <div className="flex-1 min-w-0">
                                    <div className="text-sm font-medium staff-text-primary line-clamp-1">
                                      {post.title}
                                    </div>
                                    <div className="text-xs staff-text-secondary">
                                      by {post.creator.fullName}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex flex-wrap gap-1">
                                  {post.postTags.length > 0 ? (
                                    <>
                                      {post.postTags
                                        .slice(0, 3)
                                        .map((postTag) => (
                                          <span
                                            key={postTag.tag_id}
                                            className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded"
                                          >
                                            {postTag.tag.tag_name}
                                          </span>
                                        ))}
                                      {post.postTags.length > 3 && (
                                        <span className="inline-flex px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded">
                                          +{post.postTags.length - 3} more
                                        </span>
                                      )}
                                    </>
                                  ) : (
                                    <span className="text-xs staff-text-secondary">
                                      No tags
                                    </span>
                                  )}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span
                                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded ${getStatusBadgeColor(
                                    post.status
                                  )}`}
                                >
                                  {post.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm staff-text-secondary">
                                <div>
                                  <div>
                                    {new Date(
                                      post.created_at
                                    ).toLocaleDateString()}
                                  </div>
                                  {post.published_at &&
                                    post.status === "PUBLISHED" && (
                                      <div className="text-xs text-green-600">
                                        Published:{" "}
                                        {new Date(
                                          post.published_at
                                        ).toLocaleDateString()}
                                      </div>
                                    )}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <div className="flex items-center justify-end gap-2">
                                  <Link
                                    href={`/dashboard/staff/posts/${post.post_id}`}
                                    className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors"
                                    title="View Details"
                                  >
                                    <IconEye className="h-4 w-4" />
                                  </Link>
                                  <Link
                                    href={`/dashboard/staff/posts/create?id=${post.post_id}`}
                                    className="staff-text-secondary hover:staff-text-primary p-1 rounded hover:bg-gray-50 transition-colors"
                                    title="Edit"
                                  >
                                    <IconEdit className="h-4 w-4" />
                                  </Link>
                                  {post.status === "DRAFT" && (
                                    <button
                                      onClick={() =>
                                        handleToggleStatus(
                                          post.post_id,
                                          "PUBLISHED"
                                        )
                                      }
                                      className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50 transition-colors"
                                      title="Publish"
                                      disabled={
                                        updatePostStatusMutation.isPending
                                      }
                                    >
                                      <IconFileText className="h-4 w-4" />
                                    </button>
                                  )}
                                  {post.status === "PUBLISHED" && (
                                    <button
                                      onClick={() =>
                                        handleToggleStatus(
                                          post.post_id,
                                          "ARCHIVED"
                                        )
                                      }
                                      className="text-orange-600 hover:text-orange-900 p-1 rounded hover:bg-orange-50 transition-colors"
                                      title="Archive"
                                      disabled={
                                        updatePostStatusMutation.isPending
                                      }
                                    >
                                      <IconFileText className="h-4 w-4" />
                                    </button>
                                  )}
                                  <button
                                    onClick={() =>
                                      handleDeletePost(post.post_id)
                                    }
                                    className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors"
                                    title="Delete"
                                    disabled={deletePostMutation.isPending}
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
                )}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm staff-text-secondary">
                        Show per page:
                      </span>
                      <select
                        value={pageSize}
                        onChange={(e) => {
                          setPageSize(Number(e.target.value));
                          setCurrentPage(1); // Reset to first page when changing page size
                        }}
                        className="px-2 py-1 border border-[#e6e2da] focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                      </select>
                    </div>
                    <div className="text-sm staff-text-secondary">
                      Showing{" "}
                      {posts.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}{" "}
                      to {Math.min(currentPage * pageSize, totalPosts)} of{" "}
                      {totalPosts} posts
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
                      Page {currentPage} of {totalPages}
                    </span>

                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                      }
                      disabled={currentPage === totalPages}
                      className="p-1 border border-[#e6e2da] hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Next page"
                    >
                      <IconChevronRight className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setCurrentPage(totalPages)}
                      disabled={currentPage === totalPages}
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
    </SidebarProvider>
  );
}
