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
} from "@tabler/icons-react";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { getStaffPosts, deleteStaffPost, updateStaffPost } from "@/apis/staff";
import { toast } from "sonner";
import { Post } from "@/types/staff/post-dto";


export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<PostStatus | "ALL">("ALL");
  const [loading, setLoading] = useState(true);
  const [page] = useState(1);

  const statusOptions: (PostStatus | "ALL")[] = [
    "ALL",
    "DRAFT",
    "PUBLISHED",
    "ARCHIVED",
  ];

  // Fetch posts from API
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const params: {
          page: number;
          limit: number;
          status?: PostStatus;
          search?: string;
        } = {
          page,
          limit: 10,
        };
        
        if (selectedStatus !== "ALL") {
          params.status = selectedStatus;
        }
        
        if (searchQuery.trim()) {
          params.search = searchQuery;
        }

        const response = await getStaffPosts(params);
        setPosts(response.data || []);
      } catch (error) {
        console.error("Error fetching posts:", error);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchPosts, 300);
    return () => clearTimeout(debounceTimer);
  }, [page, selectedStatus, searchQuery]);

  const filteredPosts = posts;

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
    
    try {
      await deleteStaffPost(String(postId));
      setPosts(posts.filter((post) => post.post_id !== postId));
      toast.success("Post deleted successfully!");
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("Failed to delete post. Please try again.");
    }
  };

  const handleToggleStatus = async (postId: number, newStatus: PostStatus) => {
    try {
      await updateStaffPost(String(postId), { status: newStatus });
      setPosts(
        posts.map((post) =>
          post.post_id === postId ? { ...post, status: newStatus } : post
        )
      );
      toast.success(`Post ${newStatus.toLowerCase()} successfully!`);
    } catch (error) {
      console.error("Error updating post status:", error);
      toast.error("Failed to update post status. Please try again.");
    }
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
                    title: "Total Tags",
                    value: Array.from(
                      new Set(
                        posts.flatMap((p) => p.postTags.map((t) => t.tag_id))
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
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                      <p className="mt-4 staff-text-secondary">Loading posts...</p>
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
                        filteredPosts.map((post) => (
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
                                  post.postTags.map((postTag) => (
                                    <span
                                      key={postTag.tag_id}
                                      className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded"
                                    >
                                      {postTag.tag.tag_name}
                                    </span>
                                  ))
                                ) : (
                                  <span className="text-xs staff-text-secondary">No tags</span>
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
                                <div>{new Date(post.created_at).toLocaleDateString()}</div>
                                {post.published_at &&
                                  post.status === "PUBLISHED" && (
                                    <div className="text-xs text-green-600">
                                      Published: {new Date(post.published_at).toLocaleDateString()}
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
                                      handleToggleStatus(post.post_id, "PUBLISHED")
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
                                      handleToggleStatus(post.post_id, "ARCHIVED")
                                    }
                                    className="text-orange-600 hover:text-orange-900 p-1 rounded hover:bg-orange-50 transition-colors"
                                    title="Archive"
                                  >
                                    <IconFileText className="h-4 w-4" />
                                  </button>
                                )}
                                <button
                                  onClick={() => handleDeletePost(post.post_id)}
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
                )}
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
