"use client";

import { Breadcrumb } from "@/components/breadcrumb";
import { SiteHeader } from "@/components/site-header";
import { StaffSidebar } from "@/components/staff-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Post, PostStatus } from "@/types/dashboard";
import {
  IconArrowLeft,
  IconDeviceFloppy,
  IconEye,
  IconPlus,
  IconSearch,
  IconSend,
  IconTag,
  IconX,
} from "@tabler/icons-react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState, useRef } from "react";
import { getStaffTags, createStaffTag, updateStaffPost } from "@/apis/staff";
import myAxios from "@/lib/custom-axios";
import { toast } from "sonner";
import dynamic from "next/dynamic";
import { useLanguageStore } from "@/store/language-store";
import { useTranslation } from "@/lib/i18n";

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

interface PostFormData {
  title: string;
  content: string;
  status: PostStatus;
  publishedAt: string;
  tags: string[];
  imageFile?: File;
  tag_ids: number[];
}

interface Tag {
  tag_id: number;
  tag_name: string;
  created_at?: string;
}

export default function CreatePostSuspense() {
  return (
    <Suspense>
      <CreatePostPage />
    </Suspense>
  );
}

export function CreatePostPage() {
  const searchParams = useSearchParams();
  const postId = searchParams.get("id");
  const isEditing = !!postId;

  const { currentLanguage } = useLanguageStore();
  const t = useTranslation(currentLanguage);

  const [formData, setFormData] = useState<PostFormData>({
    title: "",
    content: "",
    status: "DRAFT" as PostStatus,
    publishedAt: "",
    tags: [] as string[],
    imageFile: undefined,
    tag_ids: [],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [loading, setLoading] = useState(isEditing);

  // Tags state
  const [tagSearch, setTagSearch] = useState("");
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [showTagDropdown, setShowTagDropdown] = useState(false);
  const [isLoadingTags, setIsLoadingTags] = useState(false);
  const [isCreatingTag, setIsCreatingTag] = useState(false);
  const tagInputRef = useRef<HTMLInputElement>(null);

  // Fetch tags based on search query
  useEffect(() => {
    const fetchTags = async () => {
      if (tagSearch.length >= 0) {
        setIsLoadingTags(true);
        try {
          const response = await getStaffTags({ search: tagSearch });
          // Handle response structure: { success: true, data: [...] }
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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        tagInputRef.current &&
        !tagInputRef.current.parentElement?.parentElement?.contains(
          event.target as Node
        )
      ) {
        setShowTagDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle tag selection
  const handleSelectTag = (tag: Tag) => {
    if (!selectedTags.find((t) => t.tag_id === tag.tag_id)) {
      const newSelectedTags = [...selectedTags, tag];
      setSelectedTags(newSelectedTags);
      setFormData((prev) => ({
        ...prev,
        tag_ids: newSelectedTags.map((t) => t.tag_id),
      }));
    }
    setTagSearch("");
    setShowTagDropdown(false);
  };

  // Handle tag removal
  const handleRemoveTag = (tagId: number) => {
    const newSelectedTags = selectedTags.filter((t) => t.tag_id !== tagId);
    setSelectedTags(newSelectedTags);
    setFormData((prev) => ({
      ...prev,
      tag_ids: newSelectedTags.map((t) => t.tag_id),
    }));
  };

  // Handle creating a new tag
  const handleCreateTag = async () => {
    if (!tagSearch.trim()) return;

    setIsCreatingTag(true);
    try {
      const response = await createStaffTag({ tag_name: tagSearch.trim() });
      // Handle response structure: { success: true, data: { tag_id, tag_name, ... } }
      const newTag = response.data || response;

      // Add the new tag to available tags and select it
      setAvailableTags((prev) => [...prev, newTag]);
      handleSelectTag(newTag);
      toast.success(t.tagCreatedSuccess);
    } catch (error) {
      console.error("Error creating tag:", error);
      toast.error(t.failedCreateTag);
    } finally {
      setIsCreatingTag(false);
    }
  };

  // Load existing post data if editing
  useEffect(() => {
    if (isEditing && postId) {
      // Simulate loading existing post data
      const loadPost = async () => {
        setLoading(true);
        // In a real app, you'd fetch the post data from an API
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Mock data for demonstration
        const existingPost: Post = {
          id: postId,
          title: "Welcome to ArtChain 2025",
          content: `# Welcome to ArtChain 2025

We're excited to announce the launch of ArtChain 2025, our most ambitious platform yet for connecting artists, collectors, and art enthusiasts worldwide.

## What's New This Year

### Enhanced Artist Tools
- **Advanced Portfolio Builder**: Create stunning portfolios with our new drag-and-drop interface
- **Real-time Analytics**: Track your artwork's performance with detailed insights
- **Collaborative Features**: Work with other artists on joint projects

### Improved Marketplace
- **Smart Recommendations**: AI-powered suggestions based on your preferences
- **Instant Transactions**: Faster, more secure payment processing
- **Global Shipping**: Expanded shipping options to more countries

## Get Started

Ready to join the revolution? Create your free account today and start exploring the endless possibilities of ArtChain 2025.`,
          category: "Announcement",
          status: "PUBLISHED",
          publishedAt: "2025-09-15T10:00",
          author: "Staff User",
          createdAt: "2025-09-15",
          views: 1250,
        };

        setFormData({
          title: existingPost.title,
          content: existingPost.content,
          status: existingPost.status,
          publishedAt: existingPost.publishedAt || "",
          tags: [],
          imageFile: undefined,
          tag_ids: [],
        });

        setLoading(false);
      };

      loadPost();
    }
  }, [isEditing, postId]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Create FormData for file upload
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("content", formData.content);
      formDataToSend.append("status", formData.status);
      formDataToSend.append("tag_ids", JSON.stringify(formData.tag_ids));

      // Add image file if exists
      if (formData.imageFile) {
        formDataToSend.append("file", formData.imageFile);
      }

      if (isEditing && postId) {
        // For update, convert FormData to regular object since update API might not support FormData
        const updateData = {
          title: formData.title,
          content: formData.content,
          status: formData.status,
          tag_ids: formData.tag_ids,
        };
        await updateStaffPost(postId, updateData);
        toast.success(t.postUpdatedSuccess);
      } else {
        // Create new post with FormData
        await myAxios.post("/staff/posts", formDataToSend, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        toast.success(t.postCreatedSuccess);
      }

      // Redirect to posts list
      window.location.href = "/dashboard/staff/posts";
    } catch (error) {
      console.error("Error saving post:", error);
      toast.error(t.savePostError);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePublish = async () => {
    setFormData((prev) => ({ ...prev, status: "PUBLISHED" }));
    // Trigger form submission
    const form = document.querySelector("form") as HTMLFormElement;
    form?.requestSubmit();
  };

  const handleSaveDraft = async () => {
    setFormData((prev) => ({ ...prev, status: "DRAFT" }));
    // Trigger form submission
    const form = document.querySelector("form") as HTMLFormElement;
    form?.requestSubmit();
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
        <SiteHeader title={isEditing ? t.editPost : t.createPost} />
        <div className="flex flex-1 flex-col">
          <div className="px-4 lg:px-6 py-2 border-b border-[#e6e2da] bg-white">
            <Breadcrumb
              items={[
                { label: t.postsManagement, href: "/dashboard/staff/posts" },
                { label: isEditing ? t.editPost : t.createPost },
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
                    className="border border-[#e6e2da] p-2 hover:bg-gray-50 transition-colors"
                  >
                    <IconArrowLeft className="h-5 w-5 staff-text-secondary" />
                  </Link>
                  <div>
                    <h2 className="text-2xl font-bold staff-text-primary">
                      {isEditing ? t.editPost : t.createNewPost}
                    </h2>
                    <p className="text-sm staff-text-secondary mt-1">
                      {isEditing ? t.updateModifyPost : t.writePublishContent}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPreviewMode(!previewMode)}
                    disabled={loading}
                    className=" border border-[#e6e2da] px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2 disabled:opacity-50"
                  >
                    <IconEye className="h-4 w-4" />
                    {previewMode ? t.editMode : t.previewMode}
                  </button>
                </div>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
                    <p className="mt-4 staff-text-secondary">
                      Loading post data...
                    </p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                      {/* Title */}
                      <div className="staff-card p-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t.postTitleLabel} *
                        </label>
                        <input
                          type="text"
                          value={formData.title}
                          onChange={(e) =>
                            handleInputChange("title", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-[#e6e2da]  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg font-medium"
                          placeholder={t.enterEngagingTitle}
                          required
                        />
                      </div>

                      {/* Image Upload */}
                      <div className="staff-card p-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t.featuredImage}
                        </label>

                        {/* Upload Area */}
                        <div className="space-y-4">
                          <div
                            className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-red-400 transition-colors cursor-pointer"
                            onClick={() =>
                              document.getElementById("image-upload")?.click()
                            }
                          >
                            {formData.imageFile ? (
                              <div className="space-y-4">
                                <div className="relative w-32 h-32 mx-auto">
                                  <Image
                                    src={URL.createObjectURL(
                                      formData.imageFile
                                    )}
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
                                    {formData.imageFile.name}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {(
                                      formData.imageFile.size /
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
                                    setFormData((prev) => ({
                                      ...prev,
                                      imageFile: undefined,
                                    }));
                                  }}
                                  className="text-red-600 hover:text-red-800 text-sm font-medium"
                                >
                                  {t.removeImage}
                                </button>
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
                            id="image-upload"
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
                                setFormData((prev) => ({
                                  ...prev,
                                  imageFile: file,
                                }));
                              }
                            }}
                            className="hidden"
                          />

                          <p className="text-xs staff-text-secondary">
                            {t.uploadImageOptional}
                          </p>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="staff-card p-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t.contentLabel} *
                        </label>
                        {previewMode ? (
                          <div className="prose max-w-none">
                            <div
                              className="min-h-[400px] p-4 border border-[#e6e2da] bg-gray-50"
                              dangerouslySetInnerHTML={{
                                __html:
                                  formData.content ||
                                  "Your content will appear here...",
                              }}
                            />
                          </div>
                        ) : (
                          <MDXEditorWrapper
                            markdown={formData.content}
                            onChange={(value) =>
                              handleInputChange("content", value)
                            }
                            placeholder={t.writeContentHere}
                          />
                        )}
                        <p className="text-xs staff-text-secondary mt-2">
                          {t.useToolbarFormat}
                        </p>
                      </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                      {/* Publishing Settings */}
                      <div className="staff-card p-6">
                        <h3 className="text-lg font-semibold staff-text-primary mb-4 flex items-center gap-2">
                          <IconSend className="h-5 w-5 " />
                          {t.statusLabel}
                        </h3>

                        <div className="space-y-4">
                          <div>
                            <select
                              value={formData.status}
                              onChange={(e) =>
                                handleInputChange(
                                  "status",
                                  e.target.value as PostStatus
                                )
                              }
                              className="w-full px-3 py-2 border border-[#e6e2da]  focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="DRAFT">{t.draftStatusPost}</option>
                              <option value="PUBLISHED">
                                {t.publishedStatusPost}
                              </option>
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* Tags */}
                      <div className="staff-card p-6">
                        <h3 className="text-lg font-semibold staff-text-primary mb-4 flex items-center gap-2">
                          <IconTag className="h-5 w-5 " />
                          {t.tagsLabel}
                        </h3>

                        <div className="space-y-3">
                          {/* Selected Tags */}
                          {selectedTags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {selectedTags.map((tag) => (
                                <span
                                  key={tag.tag_id}
                                  className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium  border border-blue-200"
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

                          {/* Tag Search Input */}
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
                                className="w-full pl-10 pr-4 py-2 border border-[#e6e2da]  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                              />
                            </div>

                            {/* Tag Dropdown */}
                            {showTagDropdown && (
                              <div className="absolute z-10 w-full mt-1 bg-white border border-[#e6e2da]  shadow-lg max-h-60 overflow-y-auto">
                                {isLoadingTags ? (
                                  <div className="px-4 py-3 text-sm text-gray-500 text-center">
                                    {t.loadingTags}
                                  </div>
                                ) : (
                                  <>
                                    {/* Existing Tags */}
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
                                            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors flex items-center justify-between"
                                          >
                                            <span>{tag.tag_name}</span>
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

                                    {/* Create New Tag Button */}
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
                                            ? t.creatingTag
                                            : t.createTagText}
                                        </button>
                                      )}
                                  </>
                                )}
                              </div>
                            )}
                          </div>

                          <p className="text-xs staff-text-secondary">
                            {t.searchExistingTags}
                          </p>
                        </div>
                      </div>

                      {/* Post Stats Preview */}
                      <div className="staff-card p-6">
                        <h3 className="text-lg font-semibold staff-text-primary mb-4 flex items-center gap-2">
                          <IconEye className="h-5 w-5 " />
                          {t.previewStats}
                        </h3>

                        <div className="space-y-3 text-sm">
                          <div className="flex justify-between">
                            <span className="staff-text-secondary">
                              {t.wordCount}
                            </span>
                            <span className="font-medium">
                              {
                                formData.content
                                  .trim()
                                  .split(/\s+/)
                                  .filter((word) => word.length > 0).length
                              }
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="staff-text-secondary">
                              {t.characterCount}
                            </span>
                            <span className="font-medium">
                              {formData.content.length}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="staff-text-secondary">
                              {t.readingTime}
                            </span>
                            <span className="font-medium">
                              ~
                              {Math.ceil(
                                formData.content
                                  .trim()
                                  .split(/\s+/)
                                  .filter((word) => word.length > 0).length /
                                  200
                              )}{" "}
                              {t.min}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Form Actions */}
                  <div className="flex justify-end gap-4 pt-6 border-t border-[#e6e2da]">
                    <Link
                      href="/dashboard/staff/posts"
                      className="px-6 py-2 border border-[#e6e2da]  text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      {t.cancelBtn}
                    </Link>
                    <button
                      type="button"
                      onClick={handleSaveDraft}
                      disabled={isSubmitting}
                      className="px-6 py-2 border border-[#e6e2da]  text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      <IconDeviceFloppy className="h-4 w-4" />
                      {t.saveDraftBtn}
                    </button>
                    <button
                      type="button"
                      onClick={handlePublish}
                      disabled={
                        isSubmitting ||
                        !formData.title.trim() ||
                        !formData.content.trim()
                      }
                      className="px-6 py-2 staff-btn-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          {t.publishing}
                        </>
                      ) : (
                        <>
                          <IconSend className="h-4 w-4" />
                          {isEditing ? t.updatePost : t.publishPost}
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
