"use client";

import { Breadcrumb } from "@/components/breadcrumb";
import { SiteHeader } from "@/components/site-header";
import { StaffSidebar } from "@/components/staff-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { PostStatus } from "@/types/dashboard";
import {
  IconArrowLeft,
  IconCalendar,
  IconEdit,
  IconShare,
  IconTrash,
  IconUser,
  IconDeviceFloppy,
  IconX,
  IconTag,
  IconPlus,
  IconSearch,
} from "@tabler/icons-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, useEffect, Suspense, useRef } from "react";
import { getStaffPostById, updateStaffPost, deleteStaffPost, getStaffTags, createStaffTag } from "@/apis/staff";
import { toast } from "sonner";

import Image from "next/image";
import dynamic from "next/dynamic";

const MDXEditorWrapper = dynamic(
  () =>
    import("@/components/staff/MDXEditorWrapper").then(
      (mod) => mod.MDXEditorWrapper
    ),
  {
    ssr: false,
    loading: () => (
      <div className="h-[400px] border border-[#e6e2da] animate-pulse bg-gray-50" />
    ),
  }
);

interface Tag {
  tag_id: number;
  tag_name: string;
  created_at: string;
}

interface PostTag {
  post_id: number;
  tag_id: number;
  tag: Tag;
}

interface Post {
  post_id: number;
  account_id: string;
  title: string;
  content: string;
  image_url: string | null;
  status: PostStatus;
  published_at: string;
  created_at: string;
  updated_at: string;
  creator: {
    userId: string;
    username: string;
    fullName: string;
    email: string;
    role: string;
  };
  postTags: PostTag[];
}

function ViewPostContent() {
  const params = useParams();
  const postId = params.id as string;

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Edit form state
  const [editedTitle, setEditedTitle] = useState("");
  const [editedContent, setEditedContent] = useState("");
  const [editedImageUrl, setEditedImageUrl] = useState("");
  const [editedStatus, setEditedStatus] = useState<PostStatus>("DRAFT");
  const [editedTagIds, setEditedTagIds] = useState<number[]>([]);
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);

  // Tag search state
  const [tagSearch, setTagSearch] = useState("");
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [showTagDropdown, setShowTagDropdown] = useState(false);
  const [isLoadingTags, setIsLoadingTags] = useState(false);
  const [isCreatingTag, setIsCreatingTag] = useState(false);
  const tagInputRef = useRef<HTMLInputElement>(null);

  // Fetch post data
  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      try {
        const response = await getStaffPostById(postId);
        const postData = response.data;
        setPost(postData);

        // Initialize edit form
        setEditedTitle(postData.title);
        setEditedContent(postData.content);
        setEditedImageUrl(postData.image_url || "");
        setEditedStatus(postData.status);
        setEditedTagIds(postData.postTags.map((pt: PostTag) => pt.tag_id));
        setSelectedTags(postData.postTags.map((pt: PostTag) => pt.tag));
      } catch (error) {
        console.error("Error fetching post:", error);
      } finally {
        setLoading(false);
      }
    };

    if (postId) {
      fetchPost();
    }
  }, [postId]);

  // Fetch tags for search
  useEffect(() => {
    const fetchTags = async () => {
      if (tagSearch.length >= 0) {
        setIsLoadingTags(true);
        try {
          const response = await getStaffTags({ search: tagSearch });
          const tags = response.data || response;
          setAvailableTags(Array.isArray(tags) ? tags : []);
        } catch (error) {
          console.error("Error fetching tags:", error);
          setAvailableTags([]);
        } finally {
          setIsLoadingTags(false);
        }
      }
    };

    const debounceTimer = setTimeout(fetchTags, 300);
    return () => clearTimeout(debounceTimer);
  }, [tagSearch]);

  const handleSelectTag = (tag: Tag) => {
    if (!selectedTags.find((t) => t.tag_id === tag.tag_id)) {
      const newTags = [...selectedTags, tag];
      setSelectedTags(newTags);
      setEditedTagIds(newTags.map((t) => t.tag_id));
    }
    setTagSearch("");
    setShowTagDropdown(false);
  };

  const handleRemoveTag = (tagId: number) => {
    const newTags = selectedTags.filter((t) => t.tag_id !== tagId);
    setSelectedTags(newTags);
    setEditedTagIds(newTags.map((t) => t.tag_id));
  };

  const handleCreateTag = async () => {
    if (!tagSearch.trim()) return;

    setIsCreatingTag(true);
    try {
      const response = await createStaffTag({ tag_name: tagSearch.trim() });
      const newTag = response.data || response;

      setAvailableTags((prev) => [...prev, newTag]);
      handleSelectTag(newTag);
    } catch (error) {
      console.error("Error creating tag:", error);
      toast.error("Failed to create tag. Please try again.");
    } finally {
      setIsCreatingTag(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateStaffPost(postId, {
        title: editedTitle,
        content: editedContent,
        image_url: editedImageUrl || undefined,
        status: editedStatus,
        tag_ids: editedTagIds,
      });

      // Refresh post data
      const response = await getStaffPostById(postId);
      setPost(response.data);
      setIsEditing(false);
      toast.success("Post updated successfully!");
    } catch (error) {
      console.error("Error updating post:", error);
      toast.error("Failed to update post. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    if (post) {
      setEditedTitle(post.title);
      setEditedContent(post.content);
      setEditedImageUrl(post.image_url || "");
      setEditedStatus(post.status);
      setEditedTagIds(post.postTags.map((pt) => pt.tag_id));
      setSelectedTags(post.postTags.map((pt) => pt.tag));
    }
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this post?")) {
      try {
        await deleteStaffPost(postId);
        toast.success("Post deleted successfully!");
        window.location.href = "/dashboard/staff/posts";
      } catch (error) {
        console.error("Error deleting post:", error);
        toast.error("Failed to delete post. Please try again.");
      }
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Post URL copied to clipboard!");
  };

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
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
          <SiteHeader title="Post Detail" />
          <div className="flex flex-1 items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#d9534f] mx-auto"></div>
              <p className="mt-4 staff-text-secondary">Loading post...</p>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  if (!post) {
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
          <SiteHeader title="Post Detail" />
          <div className="flex flex-1 items-center justify-center">
            <div className="text-gray-500">Post not found</div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

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
        <SiteHeader title="Post Detail" />
        <div className="flex flex-1 flex-col">
          <div className="px-4 lg:px-6 py-2 border-b border-[#e6e2da] bg-white">
            <Breadcrumb
              items={[
                { label: "Posts Management", href: "/dashboard/staff/posts" },
                { label: post.title },
              ]}
              homeHref="/dashboard/staff"
            />
          </div>
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
              {/* Page Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Link
                    href="/dashboard/staff/posts"
                    className="border-2 border-[#e6e2da] p-2 hover:bg-[#f9f7f4] transition-colors"
                  >
                    <IconArrowLeft className="h-5 w-5 staff-text-secondary" />
                  </Link>
                  <div>
                    <div className="flex items-center gap-3">
                      <h2 className="text-2xl font-bold staff-text-primary">
                        {post.title}
                      </h2>
                      <span className={getStatusBadgeColor(post.status)}>
                        {post.status}
                      </span>
                    </div>
                    <p className="text-sm staff-text-secondary mt-1">
                      Post ID: {post.post_id}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {!isEditing ? (
                    <>
                      <button
                        onClick={handleShare}
                        className="border-2 border-[#e6e2da] px-4 py-2 text-sm font-medium text-gray-700 hover:bg-[#f9f7f4] transition-colors flex items-center gap-2"
                      >
                        <IconShare className="h-4 w-4" />
                        Share
                      </button>
                      <button
                        onClick={() => setIsEditing(true)}
                        className="bg-linear-to-r from-[#d9534f] to-[#e67e73] text-white px-4 py-2.5 font-bold shadow-md flex items-center gap-2 hover:shadow-lg transition-shadow"
                      >
                        <IconEdit className="h-4 w-4" />
                        Edit Post
                      </button>
                      <button
                        onClick={handleDelete}
                        className="border-2 border-red-300 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50 transition-colors flex items-center gap-2"
                      >
                        <IconTrash className="h-4 w-4" />
                        Delete
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={handleCancelEdit}
                        disabled={isSaving}
                        className="border-2 border-[#e6e2da] px-4 py-2 text-sm font-medium text-gray-700 hover:bg-[#f9f7f4] transition-colors flex items-center gap-2 disabled:opacity-50"
                      >
                        <IconX className="h-4 w-4" />
                        Cancel
                      </button>
                      <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="bg-linear-to-r from-[#d9534f] to-[#e67e73] text-white px-4 py-2.5 font-bold shadow-md flex items-center gap-2 hover:shadow-lg transition-shadow disabled:opacity-50"
                      >
                        <IconDeviceFloppy className="h-4 w-4" />
                        {isSaving ? "Saving..." : "Save Changes"}
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Banner Image */}
              {post.image_url && !isEditing && (
                <div className="staff-card p-0 overflow-hidden">
                  <div className="relative w-full h-64">
                    <Image
                      src={post.image_url}
                      alt={post.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              )}

              {/* Content Section */}
              <div className="grid gap-6 lg:grid-cols-3">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                  {isEditing ? (
                    <>
                      {/* Edit Title */}
                      <div className="staff-card p-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Title
                        </label>
                        <input
                          type="text"
                          value={editedTitle}
                          onChange={(e) => setEditedTitle(e.target.value)}
                          className="w-full px-3 py-2 border border-[#e6e2da] focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg font-medium"
                        />
                      </div>

                      {/* Edit Image URL */}
                      <div className="staff-card p-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Image URL
                        </label>
                        <input
                          type="url"
                          value={editedImageUrl}
                          onChange={(e) => setEditedImageUrl(e.target.value)}
                          className="w-full px-3 py-2 border border-[#e6e2da] focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="https://example.com/image.jpg"
                        />
                        {editedImageUrl && (
                          <div className="mt-3 relative w-full h-48">
                            <Image
                              src={editedImageUrl}
                              alt="Preview"
                              fill
                              className="object-cover border border-[#e6e2da]"
                            />
                          </div>
                        )}
                      </div>

                      {/* Edit Content */}
                      <div className="staff-card p-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Content
                        </label>
                        <MDXEditorWrapper
                          markdown={editedContent}
                          onChange={setEditedContent}
                          placeholder="Write your post content..."
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      {/* View Content */}
                      <div className="staff-card p-6">
                        <h3 className="text-lg font-bold staff-text-primary mb-4">
                          Content
                        </h3>
                        <div
                          className="prose max-w-none"
                          dangerouslySetInnerHTML={{ __html: post.content }}
                        />
                      </div>
                    </>
                  )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Post Information */}
                  <div className="staff-card p-6">
                    <h3 className="text-lg font-bold staff-text-primary mb-4">
                      Post Information
                    </h3>

                    {isEditing ? (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Status
                          </label>
                          <select
                            value={editedStatus}
                            onChange={(e) =>
                              setEditedStatus(e.target.value as PostStatus)
                            }
                            className="w-full px-3 py-2 border border-[#e6e2da] focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="DRAFT">Draft</option>
                            <option value="PUBLISHED">Published</option>
                            <option value="ARCHIVED">Archived</option>
                          </select>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="flex items-start gap-3 pb-3 border-b border-[#e6e2da]">
                          <IconUser className="h-5 w-5 staff-text-secondary mt-0.5" />
                          <div className="flex-1">
                            <p className="text-sm font-medium staff-text-secondary">
                              Author
                            </p>
                            <p className="text-sm staff-text-primary font-semibold">
                              {post.creator.fullName}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3 pb-3 border-b border-[#e6e2da]">
                          <IconCalendar className="h-5 w-5 staff-text-secondary mt-0.5" />
                          <div className="flex-1">
                            <p className="text-sm font-medium staff-text-secondary">
                              Created
                            </p>
                            <p className="text-sm staff-text-primary font-semibold">
                              {formatDate(post.created_at)}
                            </p>
                          </div>
                        </div>

                        {post.published_at && (
                          <div className="flex items-start gap-3 pb-3 border-b border-[#e6e2da]">
                            <IconCalendar className="h-5 w-5 staff-text-secondary mt-0.5" />
                            <div className="flex-1">
                              <p className="text-sm font-medium staff-text-secondary">
                                Published
                              </p>
                              <p className="text-sm staff-text-primary font-semibold">
                                {formatDate(post.published_at)}
                              </p>
                            </div>
                          </div>
                        )}

                        <div className="flex items-start gap-3">
                          <div className="flex-1">
                            <p className="text-sm font-medium staff-text-secondary mb-2">
                              Status
                            </p>
                            <span
                              className={`${getStatusBadgeColor(
                                post.status
                              )} mt-1`}
                            >
                              {post.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Tags */}
                  <div className="staff-card p-6">
                    <h3 className="text-lg font-bold staff-text-primary mb-4 flex items-center gap-2">
                      <IconTag className="h-5 w-5" />
                      Tags
                    </h3>

                    {isEditing ? (
                      <div className="space-y-3">
                        {selectedTags.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {selectedTags.map((tag) => (
                              <span
                                key={tag.tag_id}
                                className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded border border-blue-200"
                              >
                                {tag.tag_name}
                                <button
                                  type="button"
                                  onClick={() => handleRemoveTag(tag.tag_id)}
                                  className="hover:text-blue-900"
                                >
                                  <IconX className="h-3 w-3" />
                                </button>
                              </span>
                            ))}
                          </div>
                        )}

                        <div className="relative">
                          <div className="relative">
                            <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                              ref={tagInputRef}
                              type="text"
                              value={tagSearch}
                              onChange={(e) => {
                                setTagSearch(e.target.value);
                                setShowTagDropdown(true);
                              }}
                              onFocus={() => setShowTagDropdown(true)}
                              placeholder="Search or create tags..."
                              className="w-full pl-10 pr-4 py-2 border border-[#e6e2da] focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            />
                          </div>

                          {showTagDropdown && (
                            <div className="absolute z-10 w-full mt-1 bg-white border border-[#e6e2da] shadow-lg max-h-60 overflow-y-auto">
                              {isLoadingTags ? (
                                <div className="px-4 py-3 text-sm text-gray-500 text-center">
                                  Loading tags...
                                </div>
                              ) : (
                                <>
                                  {availableTags.length > 0 ? (
                                    availableTags
                                      .filter(
                                        (tag) =>
                                          !selectedTags.find(
                                            (t) => t.tag_id === tag.tag_id
                                          )
                                      )
                                      .map((tag) => (
                                        <button
                                          key={tag.tag_id}
                                          type="button"
                                          onClick={() => handleSelectTag(tag)}
                                          className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors"
                                        >
                                          {tag.tag_name}
                                        </button>
                                      ))
                                  ) : tagSearch.trim() ? (
                                    <div className="px-4 py-2 text-sm text-gray-500">
                                      No tags found
                                    </div>
                                  ) : (
                                    <div className="px-4 py-2 text-sm text-gray-500">
                                      Start typing to search tags
                                    </div>
                                  )}

                                  {tagSearch.trim() &&
                                    !availableTags.find(
                                      (tag) =>
                                        tag.tag_name.toLowerCase() ===
                                        tagSearch.toLowerCase()
                                    ) && (
                                      <button
                                        type="button"
                                        onClick={handleCreateTag}
                                        disabled={isCreatingTag}
                                        className="w-full px-4 py-2 text-left text-sm bg-blue-50 hover:bg-blue-100 transition-colors flex items-center gap-2 border-t border-[#e6e2da] text-blue-700 font-medium disabled:opacity-50"
                                      >
                                        <IconPlus className="h-4 w-4" />
                                        {isCreatingTag
                                          ? "Creating..."
                                          : `Create "${tagSearch}"`}
                                      </button>
                                    )}
                                </>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {post.postTags.length > 0 ? (
                          post.postTags.map((postTag) => (
                            <span
                              key={postTag.tag_id}
                              className="inline-flex px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded"
                            >
                              {postTag.tag.tag_name}
                            </span>
                          ))
                        ) : (
                          <span className="text-sm staff-text-secondary">
                            No tags
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default function ViewPostPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#d9534f]"></div>
        </div>
      }
    >
      <ViewPostContent />
    </Suspense>
  );
}
