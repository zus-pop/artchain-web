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
  IconSend,
  IconTag,
} from "@tabler/icons-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface PostFormData {
  title: string;
  content: string;
  category: string;
  status: PostStatus;
  publishedAt: string;
  tags: string[];
}

export default function CreatePostPage() {
  const searchParams = useSearchParams();
  const postId = searchParams.get("id");
  const isEditing = !!postId;

  const [formData, setFormData] = useState<PostFormData>({
    title: "",
    content: "",
    category: "",
    status: "DRAFT" as PostStatus,
    publishedAt: "",
    tags: [] as string[],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [loading, setLoading] = useState(isEditing);

  const categories = [
    "Announcement",
    "News",
    "Guidelines",
    "Results",
    "Community",
    "Tips",
    "Events",
  ];

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
          category: existingPost.category,
          status: existingPost.status,
          publishedAt: existingPost.publishedAt || "",
          tags: [],
        });

        setLoading(false);
      };

      loadPost();
    }
  }, [isEditing, postId]);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    console.log(`${isEditing ? "Updating" : "Creating"} post:`, formData);
    // Here you would typically make an API call to create/update the post

    setIsSubmitting(false);
    // Redirect to posts list or show success message
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
        <SiteHeader title={isEditing ? "Edit Post" : "Create Post"} />
        <div className="flex flex-1 flex-col">
          <div className="px-4 lg:px-6 py-2 border-b border-gray-200 bg-white">
            <Breadcrumb
              items={[
                { label: "Posts Management", href: "/dashboard/staff/posts" },
                { label: isEditing ? "Edit Post" : "Create Post" },
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
                    className="rounded-lg border border-gray-200 p-2 hover:bg-gray-50 transition-colors"
                  >
                    <IconArrowLeft className="h-5 w-5 text-gray-600" />
                  </Link>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {isEditing ? "Edit Post" : "Create New Post"}
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                      {isEditing
                        ? "Update and modify your existing post content"
                        : "Write and publish announcements, news, and content for the ArtChain community"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPreviewMode(!previewMode)}
                    disabled={loading}
                    className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2 disabled:opacity-50"
                  >
                    <IconEye className="h-4 w-4" />
                    {previewMode ? "Edit" : "Preview"}
                  </button>
                </div>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading post data...</p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                      {/* Title */}
                      <div className="rounded-lg border border-gray-200 bg-white p-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Post Title *
                        </label>
                        <input
                          type="text"
                          value={formData.title}
                          onChange={(e) =>
                            handleInputChange("title", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg font-medium"
                          placeholder="Enter an engaging title for your post"
                          required
                        />
                      </div>

                      {/* Content */}
                      <div className="rounded-lg border border-gray-200 bg-white p-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Content *
                        </label>
                        {previewMode ? (
                          <div className="prose max-w-none">
                            <div className="min-h-[400px] p-4 border border-gray-200 rounded-lg bg-gray-50 whitespace-pre-wrap">
                              {formData.content ||
                                "Your content will appear here..."}
                            </div>
                          </div>
                        ) : (
                          <textarea
                            value={formData.content}
                            onChange={(e) =>
                              handleInputChange("content", e.target.value)
                            }
                            rows={15}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                            placeholder="Write your post content here... You can use basic formatting."
                            required
                          />
                        )}
                        <p className="text-xs text-gray-500 mt-2">
                          Supports basic text formatting. HTML tags are not
                          allowed.
                        </p>
                      </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                      {/* Publishing Settings */}
                      <div className="rounded-lg border border-gray-200 bg-white p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <IconSend className="h-5 w-5 text-blue-600" />
                          Publishing
                        </h3>

                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Status
                            </label>
                            <select
                              value={formData.status}
                              onChange={(e) =>
                                handleInputChange(
                                  "status",
                                  e.target.value as PostStatus
                                )
                              }
                              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="DRAFT">Draft</option>
                              <option value="PUBLISHED">Published</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Publish Date
                            </label>
                            <input
                              type="datetime-local"
                              value={formData.publishedAt}
                              onChange={(e) =>
                                handleInputChange("publishedAt", e.target.value)
                              }
                              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                              Leave empty to publish immediately
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Category */}
                      <div className="rounded-lg border border-gray-200 bg-white p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <IconTag className="h-5 w-5 text-green-600" />
                          Category
                        </h3>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Select Category *
                          </label>
                          <select
                            value={formData.category}
                            onChange={(e) =>
                              handleInputChange("category", e.target.value)
                            }
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                          >
                            <option value="">Choose a category</option>
                            {categories.map((category) => (
                              <option key={category} value={category}>
                                {category}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Post Stats Preview */}
                      <div className="rounded-lg border border-gray-200 bg-white p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <IconEye className="h-5 w-5 text-purple-600" />
                          Preview Stats
                        </h3>

                        <div className="space-y-3 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Word Count:</span>
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
                            <span className="text-gray-600">
                              Character Count:
                            </span>
                            <span className="font-medium">
                              {formData.content.length}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Reading Time:</span>
                            <span className="font-medium">
                              ~
                              {Math.ceil(
                                formData.content
                                  .trim()
                                  .split(/\s+/)
                                  .filter((word) => word.length > 0).length /
                                  200
                              )}{" "}
                              min
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Form Actions */}
                  <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
                    <Link
                      href="/dashboard/staff/posts"
                      className="px-6 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </Link>
                    <button
                      type="button"
                      onClick={handleSaveDraft}
                      disabled={isSubmitting}
                      className="px-6 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      <IconDeviceFloppy className="h-4 w-4" />
                      Save Draft
                    </button>
                    <button
                      type="button"
                      onClick={handlePublish}
                      disabled={
                        isSubmitting ||
                        !formData.title.trim() ||
                        !formData.content.trim() ||
                        !formData.category
                      }
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Publishing...
                        </>
                      ) : (
                        <>
                          <IconSend className="h-4 w-4" />
                          {isEditing ? "Update Post" : "Publish Post"}
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
