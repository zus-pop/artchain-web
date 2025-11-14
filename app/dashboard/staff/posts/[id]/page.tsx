"use client";

import {
  createStaffTag,
  deleteStaffPost,
  getStaffPostById,
  getStaffTags,
  updateStaffPost,
} from "@/apis/staff";
import { Breadcrumb } from "@/components/breadcrumb";
import { SiteHeader } from "@/components/site-header";
import { StaffSidebar } from "@/components/staff-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useTranslation } from "@/lib/i18n";
import { useLanguageStore } from "@/store/language-store";
import { PostStatus } from "@/types/dashboard";
import {
  IconArrowLeft,
  IconCalendar,
  IconDeviceFloppy,
  IconEdit,
  IconPlus,
  IconSearch,
  IconShare,
  IconTag,
  IconTrash,
  IconUser,
  IconX,
} from "@tabler/icons-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { formatDate } from "@/lib/utils";
import { Post } from "@/types/post";
import dynamic from "next/dynamic";
import Image from "next/image";
import ReactMarkdown from "react-markdown";

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

function ViewPostContent() {
  const params = useParams();
  const postId = params.id as string;
  const queryClient = useQueryClient();
  const { currentLanguage } = useLanguageStore();
  const t = useTranslation(currentLanguage);

  const [isEditing, setIsEditing] = useState(false);

  // Edit form state
  const [editedTitle, setEditedTitle] = useState("");
  const [editedContent, setEditedContent] = useState("");
  const [editedImageFile, setEditedImageFile] = useState<File | null>(null);
  const [editedStatus, setEditedStatus] = useState<PostStatus>("DRAFT");
  const [editedTagIds, setEditedTagIds] = useState<number[]>([]);
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);

  // Tag search state
  const [tagSearch, setTagSearch] = useState("");
  const [showTagDropdown, setShowTagDropdown] = useState(false);
  const tagInputRef = useRef<HTMLInputElement>(null);
  const editorRef = useRef<any>(null);

  // Fetch post data
  const {
    data: post,
    isLoading: isLoadingPost,
    error: postError,
  } = useQuery({
    queryKey: ["staff-post", postId],
    queryFn: () => getStaffPostById(postId).then((res) => res.data as Post),
    enabled: !!postId,
  });

  // Fetch tags for search
  const { data: availableTags = [], isLoading: isLoadingTags } = useQuery({
    queryKey: ["staff-tags", tagSearch],
    queryFn: () =>
      getStaffTags({ search: tagSearch }).then((res) => res.data || res),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Update post mutation
  const updatePostMutation = useMutation({
    mutationFn: (data: {
      title: string;
      content: string;
      status: PostStatus;
      tag_ids: number[];
    }) => updateStaffPost(postId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff-post", postId] });
      setIsEditing(false);
      toast.success(t.postUpdatedSuccess);
    },
    onError: (error) => {
      console.error("Error updating post:", error);
      toast.error(t.postUpdatedErrorMessage);
    },
  });

  // Delete post mutation
  const deletePostMutation = useMutation({
    mutationFn: () => deleteStaffPost(postId),
    onSuccess: () => {
      toast.success(t.postDeletedSuccessMessage);
      window.location.href = "/dashboard/staff/posts";
    },
    onError: (error) => {
      console.error("Error deleting post:", error);
      toast.error(t.postDeletedErrorMessage);
    },
  });

  // Create tag mutation
  const createTagMutation = useMutation({
    mutationFn: (data: { tag_name: string }) => createStaffTag(data),
    onSuccess: (newTag) => {
      const tagToAdd = {
        tag_id: newTag.data.tag_id || newTag.id,
        tag_name: newTag.data.tag_name || newTag.name,
        created_at: newTag.data.created_at || new Date().toISOString(),
      };

      if (!selectedTags.find((t) => t.tag_id === tagToAdd.tag_id)) {
        const updatedTags = [...selectedTags, tagToAdd];
        setSelectedTags(updatedTags);
        setEditedTagIds(updatedTags.map((t) => t.tag_id));
      }

      queryClient.setQueryData(["staff-tags", ""], (oldData: Tag[] = []) => {
        if (!oldData.find((t) => t.tag_id === tagToAdd.tag_id)) {
          return [...oldData, tagToAdd];
        }
        return oldData;
      });

      // Clear search and close dropdown
      setTagSearch("");
      setShowTagDropdown(false);

      toast.success(t.tagCreatedSuccess);
    },
    onError: (error) => {
      console.error("Error creating tag:", error);
      toast.error(t.failedCreateTag);
    },
  });

  // Initialize edit form when post data is loaded
  useEffect(() => {
    if (post) {
      setEditedTitle(post.title);
      setEditedContent(post.content);
      setEditedImageFile(null); // Reset file when loading existing post
      setEditedStatus(post.status);
      setEditedTagIds(post.postTags.map((pt: PostTag) => pt.tag_id));
      setSelectedTags(post.postTags.map((pt: PostTag) => pt.tag));
    }
  }, [post]);

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

    createTagMutation.mutate({ tag_name: tagSearch.trim() });
  };

  const handleSave = async () => {
    const content = editorRef.current?.getMarkdown() || editedContent;
    const updateData = {
      title: editedTitle,
      content: content,
      status: editedStatus,
      tag_ids: editedTagIds,
    };

    updatePostMutation.mutate(updateData);
  };

  const handleCancelEdit = () => {
    if (post) {
      setEditedTitle(post.title);
      setEditedContent(post.content);
      setEditedImageFile(null); // Reset file when canceling
      setEditedStatus(post.status);
      setEditedTagIds(post.postTags.map((pt: PostTag) => pt.tag_id));
      setSelectedTags(post.postTags.map((pt: PostTag) => pt.tag));
    }
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (confirm(t.confirmDeletePost)) {
      deletePostMutation.mutate();
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success(t.postUrlCopied);
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

  if (isLoadingPost) {
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
              <p className="mt-4 staff-text-secondary">{t.loadingPost}</p>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  if (postError || !post) {
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
          <SiteHeader title={t.postDetail} />
          <div className="flex flex-1 items-center justify-center">
            <div className="text-gray-500">
              {postError ? t.errorLoadingPost : t.postNotFound}
            </div>
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
        <SiteHeader title={t.postDetail} />
        <div className="flex flex-1 flex-col">
          <div className="px-4 lg:px-6 py-2 border-b border-[#e6e2da] bg-white">
            <Breadcrumb
              items={[
                { label: t.postsManagement, href: "/dashboard/staff/posts" },
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
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-bold staff-text-primary">
                        {post.title}
                      </h2>
                      <span className={getStatusBadgeColor(post.status)}>
                        {post.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons - Spread out for more space */}
                <div className="flex items-center gap-6">
                  {!isEditing ? (
                    <>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={handleShare}
                          className="border-2 border-[#e6e2da] px-4 py-2 text-sm font-medium text-gray-700 hover:bg-[#f9f7f4] transition-colors flex items-center gap-2"
                        >
                          <IconShare className="h-4 w-4" />
                          {t.share}
                        </button>
                        <button
                          onClick={handleDelete}
                          className="border-2 border-red-300 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50 transition-colors flex items-center gap-2"
                        >
                          <IconTrash className="h-4 w-4" />
                          {t.deletePost}
                        </button>
                      </div>
                      <button
                        onClick={() => setIsEditing(true)}
                        className="bg-linear-to-r from-[#d9534f] to-[#e67e73] text-white px-4 py-2 font-bold shadow-md flex items-center gap-2 hover:shadow-lg transition-shadow"
                      >
                        <IconEdit className="h-4 w-4" />
                        {t.editPostBtn}
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={handleCancelEdit}
                        disabled={updatePostMutation.isPending}
                        className="border-2 border-[#e6e2da] px-4 py-2 text-sm font-medium text-gray-700 hover:bg-[#f9f7f4] transition-colors flex items-center gap-2 disabled:opacity-50"
                      >
                        <IconX className="h-4 w-4" />
                        {t.cancelDetail}
                      </button>
                      <button
                        onClick={handleSave}
                        disabled={updatePostMutation.isPending}
                        className="bg-linear-to-r from-[#d9534f] to-[#e67e73] text-white px-6 py-3 font-bold shadow-md flex items-center gap-2 hover:shadow-lg transition-shadow disabled:opacity-50"
                      >
                        <IconDeviceFloppy className="h-4 w-4" />
                        {updatePostMutation.isPending
                          ? t.saving
                          : t.saveChanges}
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
                          {t.postTitleLabel}
                        </label>
                        <input
                          type="text"
                          value={editedTitle}
                          onChange={(e) => setEditedTitle(e.target.value)}
                          className="w-full px-3 py-2 border border-[#e6e2da] focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg font-medium"
                        />
                      </div>

                      {/* Edit Image Upload */}
                      <div className="staff-card p-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t.featuredImage}
                        </label>

                        {/* Upload Area */}
                        <div className="space-y-4">
                          <div
                            className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-red-400 transition-colors cursor-pointer"
                            onClick={() =>
                              document
                                .getElementById("edit-image-upload")
                                ?.click()
                            }
                          >
                            {editedImageFile ? (
                              <div className="space-y-4">
                                <div className="relative w-32 h-32 mx-auto">
                                  <Image
                                    src={URL.createObjectURL(editedImageFile)}
                                    alt="Preview"
                                    fill
                                    className="object-cover rounded-lg border border-gray-200"
                                    onError={(e) => {
                                      (
                                        e.target as HTMLImageElement
                                      ).style.display = "none";
                                    }}
                                  />
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-900">
                                    {editedImageFile.name}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {(
                                      editedImageFile.size /
                                      1024 /
                                      1024
                                    ).toFixed(2)}{" "}
                                    MB
                                  </p>
                                </div>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setEditedImageFile(null);
                                  }}
                                  className="text-red-600 hover:text-red-800 text-sm font-medium"
                                >
                                  {t.removeImage}
                                </button>
                              </div>
                            ) : post?.image_url ? (
                              <div className="space-y-4">
                                <div className="relative w-32 h-32 mx-auto">
                                  <Image
                                    src={post.image_url}
                                    alt="Current image"
                                    fill
                                    className="object-cover rounded-lg border border-gray-200"
                                    onError={(e) => {
                                      (
                                        e.target as HTMLImageElement
                                      ).style.display = "none";
                                    }}
                                  />
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-900">
                                    {t.currentImage}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {t.clickToChangeImageDetail}
                                  </p>
                                </div>
                              </div>
                            ) : (
                              <div className="space-y-2">
                                <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                                  {/* <IconPlus className="h-6 w-6 text-gray-400" /> */}
                                  <svg
                                    className="h-6 w-6 text-gray-400"
                                    strokeLinejoin="round"
                                    strokeLinecap="round"
                                    strokeWidth="2"
                                    stroke="currentColor"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    height="24"
                                    width="24"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2"></path>
                                    <path d="M7 9l5 -5l5 5"></path>
                                    <path d="M12 4l0 12"></path>
                                  </svg>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-900">
                                    {t.clickToUploadImage}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {t.imageRequirementsPosts}
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Hidden File Input */}
                          <input
                            id="edit-image-upload"
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                // Validate file size (10MB limit)
                                if (file.size > 10 * 1024 * 1024) {
                                  toast.error(t.fileSizeTooLarge);
                                  return;
                                }
                                // Validate file type
                                if (!file.type.startsWith("image/")) {
                                  toast.error(t.selectValidImage);
                                  return;
                                }
                                setEditedImageFile(file);
                              }
                            }}
                            className="hidden"
                          />

                          <p className="text-xs staff-text-secondary">
                            {t.uploadNewImage}
                          </p>
                        </div>
                      </div>

                      {/* Edit Content */}
                      <div className="staff-card p-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t.contentLabel}
                        </label>
                        <MDXEditorWrapper
                          ref={editorRef}
                          markdown={editedContent}
                          placeholder={t.writeContentHere}
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      {/* View Content */}
                      <div className="staff-card p-6">
                        <h3 className="text-lg font-bold staff-text-primary mb-4">
                          {t.content}
                        </h3>
                        <div className="prose max-w-none">
                          <ReactMarkdown>{post.content}</ReactMarkdown>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Post Information */}
                  <div className="staff-card p-6">
                    <h3 className="text-lg font-bold staff-text-primary mb-4">
                      {t.postInformation}
                    </h3>

                    {isEditing ? (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {t.statusLabel}
                          </label>
                          <select
                            value={editedStatus}
                            onChange={(e) =>
                              setEditedStatus(e.target.value as PostStatus)
                            }
                            className="w-full px-3 py-2 border border-[#e6e2da] focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="DRAFT">{t.draftStatusPost}</option>
                            <option value="PUBLISHED">
                              {t.publishedStatusPost}
                            </option>
                            <option value="ARCHIVED">
                              {t.archivedStatusPost}
                            </option>
                          </select>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="flex items-start gap-3 pb-3 border-b border-[#e6e2da]">
                          <IconUser className="h-5 w-5 staff-text-secondary mt-0.5" />
                          <div className="flex-1">
                            <p className="text-sm font-medium staff-text-secondary">
                              {t.author}
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
                              {t.created}
                            </p>
                            <p className="text-sm staff-text-primary font-semibold">
                              {formatDate({ dateString: post.created_at })}
                            </p>
                          </div>
                        </div>

                        {post.published_at && (
                          <div className="flex items-start gap-3 pb-3 border-b border-[#e6e2da]">
                            <IconCalendar className="h-5 w-5 staff-text-secondary mt-0.5" />
                            <div className="flex-1">
                              <p className="text-sm font-medium staff-text-secondary">
                                {t.publishedLabel}
                              </p>
                              <p className="text-sm staff-text-primary font-semibold">
                                {formatDate({ dateString: post.published_at })}
                              </p>
                            </div>
                          </div>
                        )}

                        <div className="flex items-start gap-3">
                          <div className="flex-1">
                            <p className="text-sm font-medium staff-text-secondary mb-2">
                              {t.statusLabelDetail}
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
                      {t.tagsLabel}
                    </h3>

                    {isEditing ? (
                      <div className="space-y-3">
                        {selectedTags.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {selectedTags.map((tag: Tag) => (
                              <span
                                key={`selected-tag-${tag.tag_id}`}
                                className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded border border-blue-200"
                              >
                                {tag.tag_name || "Unnamed Tag"}
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
                              placeholder={t.searchOrCreateTags}
                              className="w-full pl-10 pr-4 py-2 border border-[#e6e2da] focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            />
                          </div>

                          {showTagDropdown && (
                            <div className="absolute z-10 w-full mt-1 bg-white border border-[#e6e2da] shadow-lg max-h-60 overflow-y-auto">
                              {isLoadingTags ? (
                                <div className="px-4 py-3 text-sm text-gray-500 text-center">
                                  {t.loadingTags}
                                </div>
                              ) : (
                                <>
                                  {availableTags.length > 0 ? (
                                    availableTags
                                      .filter(
                                        (tag: Tag) =>
                                          !selectedTags.find(
                                            (t) => t.tag_id === tag.tag_id
                                          )
                                      )
                                      .map((tag: Tag) => (
                                        <button
                                          key={`available-tag-${tag.tag_id}`}
                                          type="button"
                                          onClick={() => handleSelectTag(tag)}
                                          className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors"
                                        >
                                          {tag.tag_name}
                                        </button>
                                      ))
                                  ) : tagSearch.trim() ? (
                                    <div className="px-4 py-2 text-sm text-gray-500">
                                      {t.noTagsFound}
                                    </div>
                                  ) : (
                                    <div className="px-4 py-2 text-sm text-gray-500">
                                      {t.startTypingSearch}
                                    </div>
                                  )}

                                  {tagSearch.trim() &&
                                    !availableTags.find(
                                      (tag: Tag) =>
                                        tag.tag_name.toLowerCase() ===
                                        tagSearch.toLowerCase()
                                    ) && (
                                      <button
                                        type="button"
                                        onClick={handleCreateTag}
                                        disabled={createTagMutation.isPending}
                                        className="w-full px-4 py-2 text-left text-sm bg-blue-50 hover:bg-blue-100 transition-colors flex items-center gap-2 border-t border-[#e6e2da] text-blue-700 font-medium disabled:opacity-50"
                                      >
                                        <IconPlus className="h-4 w-4" />
                                        {createTagMutation.isPending
                                          ? "Creating..."
                                          : `${t.createTagWithName} "${tagSearch}"`}
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
                          post.postTags.map((postTag: PostTag) => (
                            <span
                              key={`post-tag-${postTag.tag_id}`}
                              className="inline-flex px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded"
                            >
                              {postTag.tag.tag_name}
                            </span>
                          ))
                        ) : (
                          <span className="text-sm staff-text-secondary">
                            {t.noTagsAssigned}
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
