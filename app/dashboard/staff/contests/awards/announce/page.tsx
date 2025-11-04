"use client";

import { Breadcrumb } from "@/components/breadcrumb";
import { SiteHeader } from "@/components/site-header";
import { StaffSidebar } from "@/components/staff-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import {
  getStaffContestById,
  getStaffTags,
  createStaffTag,
  createStaffPost,
} from "@/apis/staff";
import { useGetRound2TopByContestId } from "@/apis/paintings";
import myAxios from "@/lib/custom-axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { TopPainting } from "@/types/painting";
import {
  IconArrowLeft,
  IconCheck,
  IconDeviceFloppy,
  IconEye,
  IconFileText,
  IconPlus,
  IconSearch,
  IconSend,
  IconTag,
  IconTrophy,
  IconUsers,
  IconX,
} from "@tabler/icons-react";
import { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
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

const formatCurrency = (value: number) => {
  return value.toLocaleString("vi-VN");
};

interface Tag {
  tag_id: number;
  tag_name: string;
  created_at?: string;
}

export default function AnnounceResultsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const contestId = searchParams.get("id") as string;

  const [postTitle, setPostTitle] = useState("");
  const [postContent, setPostContent] = useState(
    "Loading announcement content..."
  );
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isPublished, setIsPublished] = useState(false);

  // Tags state
  const [tagSearch, setTagSearch] = useState("");
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [showTagDropdown, setShowTagDropdown] = useState(false);
  const [isLoadingTags, setIsLoadingTags] = useState(false);
  const [isCreatingTag, setIsCreatingTag] = useState(false);
  const tagInputRef = useRef<HTMLInputElement>(null);

  const { data: contestData } = useQuery({
    queryKey: ["staff-contest", contestId],
    queryFn: () => getStaffContestById(Number(contestId)),
    enabled: !!contestId,
  });

  const { data: paintingsData, isLoading: paintingsLoading } =
    useGetRound2TopByContestId(contestId);

  const contest = contestData?.data;
  const paintings = (paintingsData?.data as TopPainting[]) || [];

  // Create announcement post mutation
  const createPostMutation = createStaffPost();

  // Generate predefined content based on awarded paintings
  const generateAnnouncementContent = () => {
    if (!contest || paintings.length === 0) return "";

    let content = `🎉 **Contest Results Announced!** 🎉\n\n`;
    content += `We're thrilled to announce the winners of **${contest.title}**!\n\n`;
    content += `## 🏆 Winners\n\n`;

    // Sort by award rank
    const sortedWinners = [...paintings].sort((a, b) => {
      if (!a.award || !b.award) return 0;
      return a.award.rank - b.award.rank;
    });

    sortedWinners.forEach((painting, index) => {
      if (painting.award) {
        content += `**${index + 1}. ${painting.award.name}**\n`;
        content += `- **Artwork:** "${painting.title}"\n`;
        content += `- **Artist:** ${painting.competitorName}\n`;
        content += `- **Prize:** ${formatCurrency(
          parseFloat(painting.award.prize)
        )} ₫\n`;
        content += `- **Score:** ${painting.avgScoreRound2.toFixed(2)}\n\n`;
      }
    });

    content += `## 📊 Contest Summary\n`;
    content += `- **Total Participants:** ${paintings.length}\n`;
    content += `- **Winners Announced:** ${paintings.length}\n\n`;

    content += `Congratulations to all the winners! Your talent and creativity have truly shone through. `;
    content += `Thank you to everyone who participated in this amazing contest.\n\n`;
    content += `#ContestResults #${contest.title.replace(
      /\s+/g,
      ""
    )} #ArtCompetition`;

    return content;
  };

  // Handle tag selection
  const handleSelectTag = (tag: Tag) => {
    if (!selectedTags.find((t) => t.tag_id === tag.tag_id)) {
      setSelectedTags([...selectedTags, tag]);
    }
    setTagSearch("");
    setShowTagDropdown(false);
  };

  // Handle tag removal
  const handleRemoveTag = (tagId: number) => {
    setSelectedTags(selectedTags.filter((t) => t.tag_id !== tagId));
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
    } catch (error) {
      console.error("Error creating tag:", error);
      toast.error("Failed to create tag. Please try again.");
    } finally {
      setIsCreatingTag(false);
    }
  };

  // Auto-generate content when contest and paintings data is loaded
  useEffect(() => {
    if (contest && paintings.length > 0) {
      const generatedTitle = `${contest.title} - Results Announced!`;
      const generatedContent = generateAnnouncementContent();

      setPostTitle(generatedTitle);
      setPostContent(generatedContent);
    }
  }, [contest, paintings]);

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

  const handlePublish = async () => {
    if (!postTitle.trim() || !postContent.trim()) {
      toast.error("Please fill in both title and content");
      return;
    }

    setIsPublishing(true);
    createPostMutation.mutate(
      {
        title: postTitle,
        content: postContent,
        file: selectedImage || undefined,
        status: "PUBLISHED",
        tag_ids: selectedTags.map((tag) => tag.tag_id),
      },
      {
        onSuccess: (v) => {
          toast.success("Thông báo kết quả cuộc thi thành công");
          setIsPublishing(false);
          router.push(`/dashboard/staff/posts/${v.data.post_id}`);
        },
      }
    );
  };

  const handleSaveDraft = async () => {
    if (!postTitle.trim() || !postContent.trim()) {
      toast.error("Please fill in both title and content");
      return;
    }

    createPostMutation.mutate(
      {
        title: postTitle,
        content: postContent,
        file: selectedImage || undefined,
        status: "DRAFT",
        tag_ids: selectedTags.map((tag) => tag.tag_id),
      },
      {
        onSuccess: (v) => {},
      }
    );
  };

  if (isPublished) {
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
          <SiteHeader title="Announce Results" />
          <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
              <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
                {/* Success Message */}
                <div className="max-w-2xl mx-auto">
                  <div className="border border-green-200 bg-green-50 p-8 text-center">
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                      <IconCheck className="h-6 w-6 text-green-600" />
                    </div>
                    <h3 className="text-lg font-medium text-green-900 mb-2">
                      Results Announced Successfully!
                    </h3>
                    <p className="text-green-700 mb-6">
                      The contest results for <strong>{contest?.title}</strong>{" "}
                      have been published as an announcement post. All
                      participants will be notified.
                    </p>
                    <div className="flex gap-4 justify-center">
                      <Link
                        href="/dashboard/staff/posts"
                        className="staff-btn-secondary transition-colors"
                      >
                        View All Posts
                      </Link>
                      <button
                        onClick={() => {
                          setIsPublished(false);
                          setPostTitle("");
                          setPostContent("");
                          setSelectedImage(null);
                          setSelectedTags([]);
                        }}
                        className="border border-green-300 text-green-700 px-4 py-2 hover:bg-green-50 transition-colors"
                      >
                        Create Another Announcement
                      </button>
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
        <SiteHeader title="Announce Results" />
        <div className="flex flex-1 flex-col">
          <div className="px-4 lg:px-6 py-2 border-b border-[#e6e2da] bg-white">
            <Breadcrumb
              items={[
                {
                  label: "Contest Management",
                  href: "/dashboard/staff/contests",
                },
                {
                  label: contest?.title || "Contest Detail",
                  href: `/dashboard/staff/contests/detail?id=${contestId}`,
                },
                {
                  label: "Awards",
                  href: `/dashboard/staff/contests/awards?id=${contestId}`,
                },
                { label: "Announce Results" },
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
                    href={`/dashboard/staff/contests/awards?id=${contestId}`}
                    className="border border-[#e6e2da] p-2 hover:bg-gray-50 transition-colors"
                  >
                    <IconArrowLeft className="h-5 w-5 staff-text-secondary" />
                  </Link>
                  <div>
                    <h2 className="text-2xl font-bold staff-text-primary">
                      Create Contest Results Announcement
                    </h2>
                    <p className="text-sm staff-text-secondary mt-1">
                      Announce winners and create a public post about contest
                      results
                    </p>
                  </div>
                </div>
              </div>

              <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content - Post Creation */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Image Upload - Moved to top */}
                  <div className="staff-card p-6">
                    <label className="block text-sm font-medium staff-text-primary mb-2">
                      Featured Image (Optional)
                    </label>

                    {/* Upload Area */}
                    <div className="space-y-4">
                      <div
                        className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-red-400 transition-colors cursor-pointer"
                        onClick={() =>
                          document.getElementById("image-upload")?.click()
                        }
                      >
                        {selectedImage ? (
                          <div className="space-y-4">
                            <div className="relative w-full h-48 mx-auto">
                              <Image
                                src={URL.createObjectURL(selectedImage)}
                                alt="Preview"
                                fill
                                className="object-cover rounded-lg border border-gray-200"
                                onError={() => {
                                  // Handle error silently
                                }}
                              />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {selectedImage.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {(selectedImage.size / 1024 / 1024).toFixed(2)}{" "}
                                MB
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedImage(null);
                              }}
                              className="text-red-600 hover:text-red-800 text-sm font-medium"
                            >
                              Remove image
                            </button>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
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
                                Click to upload image
                              </p>
                              <p className="text-xs text-gray-500">
                                PNG, JPG, GIF up to 10MB
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
                              toast.error("File size must be less than 10MB");
                              return;
                            }
                            // Validate file type
                            if (!file.type.startsWith("image/")) {
                              toast.error("Please select a valid image file");
                              return;
                            }
                            setSelectedImage(file);
                          }
                        }}
                        className="hidden"
                      />

                      <p className="text-xs staff-text-secondary">
                        Upload an image file to display with your announcement
                        post (optional)
                      </p>
                    </div>
                  </div>

                  {/* Post Creation Form */}
                  <div className="staff-card p-6">
                    <h3 className="text-lg font-semibold staff-text-primary mb-4 flex items-center gap-2">
                      <IconFileText className="h-5 w-5" />
                      Announcement Post
                    </h3>

                    <div className="space-y-4">
                      {/* Title */}
                      <div>
                        <label className="block text-sm font-medium staff-text-primary mb-2">
                          Post Title *
                        </label>
                        <input
                          type="text"
                          value={postTitle}
                          onChange={(e) => setPostTitle(e.target.value)}
                          className="w-full px-3 py-2 border border-[#e6e2da] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter announcement title..."
                        />
                      </div>

                      {/* Content */}
                      <div>
                        <label className="block text-sm font-medium staff-text-primary mb-2">
                          Post Content *
                        </label>
                        <MDXEditorWrapper
                          markdown={postContent}
                          onChange={(value) => setPostContent(value)}
                          placeholder="Announcement content will be auto-generated..."
                        />
                        <p className="text-xs staff-text-secondary mt-2">
                          Use the toolbar to format your content with Markdown
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sidebar - Tags and Winners Preview */}
                <div className="space-y-6">
                  {/* Tags - Moved to sidebar */}
                  <div className="staff-card p-6">
                    <h3 className="text-lg font-semibold staff-text-primary mb-4 flex items-center gap-2">
                      <IconTag className="h-5 w-5" />
                      Tags
                    </h3>

                    <div className="space-y-3">
                      {/* Selected Tags */}
                      {selectedTags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {selectedTags.map((tag) => (
                            <span
                              key={tag.tag_id}
                              className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium border border-blue-200 rounded-full"
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
                            placeholder="Search or create tags..."
                            className="w-full pl-10 pr-4 py-2 border border-[#e6e2da] rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                          />
                        </div>

                        {/* Tag Dropdown */}
                        {showTagDropdown && (
                          <div className="absolute z-10 w-full mt-1 bg-white border border-[#e6e2da] shadow-lg max-h-60 overflow-y-auto rounded-lg">
                            {isLoadingTags ? (
                              <div className="px-4 py-3 text-sm text-gray-500 text-center">
                                Loading tags...
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
                                    No tags found
                                  </div>
                                ) : (
                                  <div className="px-4 py-2 text-sm text-gray-500">
                                    Start typing to search tags
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
                                        ? "Creating..."
                                        : `Create "${tagSearch}"`}
                                    </button>
                                  )}
                              </>
                            )}
                          </div>
                        )}
                      </div>

                      <p className="text-xs staff-text-secondary">
                        Search for existing tags or create new ones to
                        categorize your announcement
                      </p>
                    </div>
                  </div>

                  {/* Winners List */}
                  <div className="staff-card p-4">
                    <h3 className="text-lg font-semibold staff-text-primary mb-4 flex items-center gap-2">
                      <IconUsers className="h-5 w-5" />
                      Winners ({paintings.length})
                    </h3>

                    {paintingsLoading ? (
                      <div className="text-center py-8 staff-text-secondary">
                        Loading winners...
                      </div>
                    ) : paintings.length > 0 ? (
                      <div className="space-y-3">
                        {paintings
                          .sort(
                            (a, b) =>
                              (a.award?.rank || 0) - (b.award?.rank || 0)
                          )
                          .map((painting, index) => (
                            <div
                              key={painting.paintingId}
                              className="border border-[#e6e2da] rounded-lg p-3"
                            >
                              <div className="flex items-start gap-3">
                                <div className="shrink-0 w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                                  <span className="text-sm font-bold text-yellow-800">
                                    #{index + 1}
                                  </span>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="font-medium staff-text-primary text-sm">
                                    {painting.award?.name}
                                  </div>
                                  <div className="text-xs staff-text-secondary truncate">
                                    "{painting.title}"
                                  </div>
                                  <div className="text-xs text-green-600">
                                    {painting.competitorName}
                                  </div>
                                  <div className="text-xs staff-text-secondary">
                                    Prize:{" "}
                                    {painting.award
                                      ? formatCurrency(
                                          parseFloat(painting.award.prize)
                                        )
                                      : 0}{" "}
                                    ₫
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 staff-text-secondary">
                        No winners yet
                      </div>
                    )}
                  </div>

                  {/* Preview Info */}
                  <div className="staff-card p-4">
                    <h4 className="font-semibold staff-text-primary mb-3">
                      What happens when you publish:
                    </h4>
                    <ul className="text-sm staff-text-secondary space-y-2">
                      <li className="flex items-start gap-2">
                        <IconCheck className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                        <span>Public announcement post is created</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <IconCheck className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                        <span>Winners are publicly celebrated</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <IconCheck className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                        <span>Contest results are officially announced</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <IconCheck className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                        <span>Community engagement increases</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Action Buttons - Moved outside grid */}
              <div className="flex justify-end gap-4 pt-6 border-t border-[#e6e2da]">
                <button
                  onClick={handleSaveDraft}
                  disabled={createPostMutation.isPending}
                  className="px-6 py-2 border border-[#e6e2da] staff-text-primary hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Save as Draft
                </button>
                <button
                  onClick={handlePublish}
                  disabled={isPublishing || createPostMutation.isPending}
                  className="px-6 py-2 staff-btn-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isPublishing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Publishing...
                    </>
                  ) : (
                    <>
                      <IconSend className="h-4 w-4" />
                      Publish Announcement
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
