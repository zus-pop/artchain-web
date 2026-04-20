"use client";

import { useGetAuctionById } from "@/apis/auction";
import {
  createStaffPost,
  createStaffTag,
  getStaffTags,
} from "@/apis/staff";
import { Breadcrumb } from "@/components/breadcrumb";
import { SiteHeader } from "@/components/site-header";
import { StaffSidebar } from "@/components/staff-sidebar";
import { MDXEditorWrapper } from "@/components/staff/MDXEditorWrapper";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useTranslation } from "@/lib/i18n";
import { useLanguageStore } from "@/store/language-store";
import {
  IconArrowLeft,
  IconCheck,
  IconFileText,
  IconPlus,
  IconSearch,
  IconSend,
  IconTag,
  IconPhoto,
  IconX,
} from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { z } from "zod";
import type { MDXEditorMethods } from "@mdxeditor/editor";

const formatCurrency = (value: number) => {
  return value.toLocaleString("vi-VN");
};

const promotionSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title must be less than 200 characters"),
  image: z.instanceof(File).optional(),
  tag_ids: z.array(z.number()),
});

type PromotionFormData = z.infer<typeof promotionSchema>;

interface Tag {
  tag_id: number;
  tag_name: string;
}

function AuctionPromotionPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const auctionId = searchParams.get("id") as string;

  const editorRef = useRef<MDXEditorMethods>(null);
  const { currentLanguage } = useLanguageStore();
  const t = useTranslation(currentLanguage);

  const form = useForm<PromotionFormData>({
    resolver: zodResolver(promotionSchema),
    defaultValues: {
      title: "",
      tag_ids: [],
    },
  });

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);
  
  // Tags state
  const [tagSearch, setTagSearch] = useState("");
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [showTagDropdown, setShowTagDropdown] = useState(false);
  const [isLoadingTags, setIsLoadingTags] = useState(false);
  const [isCreatingTag, setIsCreatingTag] = useState(false);
  const tagInputRef = useRef<HTMLInputElement>(null);

  // Fetch auction details
  const { data: auction, isLoading: auctionLoading } = useGetAuctionById(auctionId);

  // Create post mutation
  const createPostMutation = createStaffPost();

  // Generate predefined content based on auction paintings
  const generatePromotionContent = useCallback(() => {
    if (!auction) return "";

    const paintings = auction.auctionPaintings || [];
    let content = `🎉 **${t.upcomingAuctionAnnounced}** 🎉\n\n`;
    content += `${t.thrilledToAnnounceAuction}\n\n`;
    content += `## 🎨 ${t.featuredArtworksLabel}\n\n`;

    paintings.forEach((ap, index) => {
      const p = ap.painting;
      content += `### ${index + 1}. ${p.title}\n`;
      if (p.imageUrl) {
        content += `![${p.title}](${p.imageUrl})\n\n`;
      }
      // content += `- **${t.artistLabel}:** ${p.competitorName || p.competitorId || "Unknown"}\n`;
      content += `- **${t.startingPrice}:** ${formatCurrency(ap.basePrice)} ₫\n\n`;
      if (p.description) {
        content += `> ${p.description}\n\n`;
      }
      content += `---\n\n`;
    });

    content += `## ⏰ ${t.auctionTime}\n`;
    content += `- **${t.startAdmin}:** ${new Date(auction.startTime).toLocaleString()}\n`;
    content += `- **${t.endAdmin}:** ${new Date(auction.endTime).toLocaleString()}\n\n`;

    content += `${t.congratulationsMessage}\n\n`;
    content += `#ArtAuction #ArtChain #${auction.title.replace(/\s+/g, "")}`;
    return content;
  }, [auction, t]);

  // Handle tag selection
  const handleSelectTag = (tag: Tag) => {
    if (!selectedTags.find((t) => t.tag_id === tag.tag_id)) {
      setSelectedTags([...selectedTags, tag]);
    }
    setTagSearch("");
    setShowTagDropdown(false);
  };

  const handleRemoveTag = (tagId: number) => {
    setSelectedTags(selectedTags.filter((t) => t.tag_id !== tagId));
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
      toast.error("Không thể tạo thẻ");
    } finally {
      setIsCreatingTag(false);
    }
  };

  // Sync selected tags with form
  useEffect(() => {
    form.setValue("tag_ids", selectedTags.map((tag) => tag.tag_id));
  }, [selectedTags, form]);

  // Auto-generate content
  useEffect(() => {
    if (auction) {
      const generatedTitle = `${t.auctionPromotionTitleLabel}: ${auction.title}`;
      const generatedContent = generatePromotionContent();
      form.setValue("title", generatedTitle);
      editorRef.current?.setMarkdown(generatedContent);
    }
  }, [auction, generatePromotionContent, form, t]);

  // Fetch tags
  useEffect(() => {
    const fetchTags = async () => {
      setIsLoadingTags(true);
      try {
        const response = await getStaffTags({ search: tagSearch });
        const tags = response.data || response;
        setAvailableTags(Array.isArray(tags) ? tags : []);
      } catch (error) {
        setAvailableTags([]);
      } finally {
        setIsLoadingTags(false);
      }
    };
    const debounceTimer = setTimeout(fetchTags, 300);
    return () => clearTimeout(debounceTimer);
  }, [tagSearch]);

  const handlePublish = form.handleSubmit(async (data) => {
    const currentContent = editorRef.current?.getMarkdown() || "";
    setIsPublishing(true);
    createPostMutation.mutate(
      {
        title: data.title,
        content: currentContent,
        file: selectedImage || undefined,
        status: "PUBLISHED",
        tag_ids: data.tag_ids,
      },
      {
        onSuccess: (v) => {
          toast.success(t.auctionPromotionSuccess);
          setIsPublishing(false);
          router.push(`/dashboard/staff/posts/${v.data.post_id}`);
        },
        onError: () => {
          setIsPublishing(false);
        },
      }
    );
  });

  if (auctionLoading) {
    return (
      <div className="flex flex-1 items-center justify-center h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!auction) {
    return (
      <div className="flex flex-1 items-center justify-center h-[400px]">
        <p className="text-gray-500">{t.noDataAvailable}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href={`/dashboard/staff/auctions/detail?id=${auctionId}`}
            className="border border-[var(--staff-border)] p-2 hover:bg-gray-50 transition-colors"
          >
            <IconArrowLeft className="h-5 w-5 staff-text-secondary" />
          </Link>
          <div>
            <h2 className="staff-type-page-title staff-text-primary">
              {t.createPromotionPost}
            </h2>
            <p className="text-sm staff-text-secondary mt-1">
              {t.auctionPromotionDesc}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Image Upload */}
          <div className="staff-card p-6">
            <label className="staff-type-label staff-text-primary mb-2 block">
              {t.featuredImageOptional}
            </label>
            <div
              className="border-2 border-dashed border-gray-300 rounded-sm p-6 text-center hover:border-blue-500 transition-colors cursor-pointer"
              onClick={() => document.getElementById("image-upload")?.click()}
            >
              {selectedImage ? (
                <div className="space-y-4">
                  <div className="relative w-full h-48">
                    <Image
                      src={URL.createObjectURL(selectedImage)}
                      alt="Preview"
                      fill
                      className="object-cover rounded-sm"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setSelectedImage(null); }}
                    className="text-red-600 text-sm font-medium"
                  >
                    {t.removeImageAnnounce}
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                    <IconPhoto className="h-6 w-6 text-gray-400" />
                  </div>
                  <p className="text-sm font-medium">{t.clickToUploadImageAnnounce}</p>
                </div>
              )}
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) setSelectedImage(file);
                }}
                className="hidden"
              />
            </div>
          </div>

          {/* Form */}
          <div className="staff-card p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">{t.postTitleRequired}</label>
              <input
                type="text"
                {...form.register("title")}
                className="w-full px-3 py-2 border border-[var(--staff-border)] rounded-sm focus:ring-2 focus:ring-[var(--staff-primary)] outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">{t.postContentRequired}</label>
              <MDXEditorWrapper ref={editorRef} />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Tags */}
          <div className="staff-card p-6 space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <IconTag className="h-5 w-5" />
              {t.tagsLabel}
            </h3>
            <div className="flex flex-wrap gap-2">
              {selectedTags.map((tag) => (
                <span key={tag.tag_id} className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs flex items-center gap-1">
                  {tag.tag_name}
                  <button onClick={() => handleRemoveTag(tag.tag_id)}><IconX className="h-3 w-3" /></button>
                </span>
              ))}
            </div>
            <div className="relative">
              <input
                type="text"
                value={tagSearch}
                onChange={(e) => { setTagSearch(e.target.value); setShowTagDropdown(true); }}
                placeholder={t.searchOrCreateTags}
                className="w-full pl-8 pr-3 py-2 border border-[var(--staff-border)] rounded-sm text-sm outline-none"
              />
              <IconSearch className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
              {showTagDropdown && availableTags.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-[var(--staff-border)] rounded-sm shadow-lg max-h-48 overflow-y-auto">
                  {availableTags.map((tag) => (
                    <button
                      key={tag.tag_id}
                      onClick={() => handleSelectTag(tag)}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm"
                    >
                      {tag.tag_name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Auction Summary */}
          {/* <div className="staff-card p-6 space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <IconCheck className="h-5 w-5 text-green-500" />
              {t.auctionSummary || "Auction Summary"}
            </h3>
            <div className="text-sm space-y-2">
              <p className="flex justify-between">
                <span className="text-gray-500">{t.totalPaintings}:</span>
                <span className="font-bold">{auction.auctionPaintings?.length || 0}</span>
              </p>
              <p className="flex justify-between">
                <span className="text-gray-500">{t.participants}:</span>
                <span className="font-bold">{auction.participantCount || 0}</span>
              </p>
            </div>
          </div> */}
        </div>
      </div>

      <div className="flex justify-end gap-4 pt-6 border-t border-[var(--staff-border)]">
        <button
          onClick={handlePublish}
          disabled={isPublishing || createPostMutation.isPending}
          className="staff-btn-primary px-8 py-2 flex items-center gap-2"
        >
          {isPublishing ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          ) : (
            <IconSend className="h-4 w-4" />
          )}
          {t.publishAnnouncement}
        </button>
      </div>
    </div>
  );
}

export default function AuctionPromotionSuspense() {
  return (
    <SidebarProvider
      style={{
        "--sidebar-width": "calc(var(--spacing) * 72)",
        "--header-height": "calc(var(--spacing) * 12)",
      } as React.CSSProperties}
    >
      <StaffSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader title="Promote Auction" />
        <Suspense fallback={<div>Loading...</div>}>
          <AuctionPromotionPage />
        </Suspense>
      </SidebarInset>
    </SidebarProvider>
  );
}
