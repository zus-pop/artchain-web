"use client";

import { Breadcrumb } from "@/components/breadcrumb";
import { SiteHeader } from "@/components/site-header";
import { StaffSidebar } from "@/components/staff-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Post, PostStatus } from "@/types/dashboard";
import {
  IconArrowLeft,
  IconCalendar,
  IconEdit,
  IconEye,
  IconShare,
  IconTrash,
  IconUser,
} from "@tabler/icons-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function ViewPostPage() {
  // In a real app, you'd get the post ID from the URL params
  // For demo purposes, we'll use a sample post
  const [post, setPost] = useState<Post | null>(null);

  useEffect(() => {
    // Simulate fetching post data
    const samplePost: Post = {
      id: "1",
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

### Community Features
- **Live Events**: Join virtual art exhibitions and workshops
- **Discussion Forums**: Connect with fellow artists and collectors
- **Mentorship Program**: Learn from established artists in your field

## Our Vision

ArtChain exists to democratize the art world, making it easier for artists to share their work and for collectors to discover new talent. We're committed to supporting creativity and building a vibrant, inclusive art community.

## Get Started

Ready to join the revolution? Create your free account today and start exploring the endless possibilities of ArtChain 2025.

*Happy creating!* 🎨`,
      author: "Staff User",
      status: "PUBLISHED",
      createdAt: "2025-09-15",
      publishedAt: "2025-09-15",
      views: 1250,
      category: "Announcement",
      tags: ["announcement", "platform", "new-features"],
      excerpt:
        "We're excited to announce the launch of ArtChain 2025, our most ambitious platform yet for connecting artists, collectors, and art enthusiasts worldwide.",
    };

    setPost(samplePost);
  }, []);

  const getStatusBadgeColor = (status: PostStatus) => {
    switch (status) {
      case "PUBLISHED":
        return "bg-green-100 text-green-800";
      case "DRAFT":
        return "bg-yellow-100 text-yellow-800";
      case "ARCHIVED":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleEdit = () => {
    // Navigate to edit page
    window.location.href = "/dashboard/staff/posts/create";
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this post?")) {
      // Handle delete
      console.log("Deleting post:", post?.id);
      window.location.href = "/dashboard/staff/posts";
    }
  };

  const handleShare = () => {
    // Handle share functionality
    navigator.clipboard.writeText(window.location.href);
    alert("Post URL copied to clipboard!");
  };

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
          <SiteHeader title="View Post" />
          <div className="flex flex-1 items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading post...</p>
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
        <SiteHeader title="View Post" />
        <div className="flex flex-1 flex-col">
          <div className="px-4 lg:px-6 py-2 border-b border-gray-200 bg-white">
            <Breadcrumb
              items={[
                { label: "Posts", href: "/dashboard/staff/posts" },
                { label: "View Post" },
              ]}
              homeHref="/dashboard/staff"
            />
          </div>
          <div className="flex flex-1 flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link
                  href="/dashboard/staff/posts"
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <IconArrowLeft className="h-5 w-5" />
                  Back to Posts
                </Link>
                <h2 className="text-2xl font-bold text-gray-900">
                  Post Details
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleShare}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
                >
                  <IconShare className="h-4 w-4" />
                  Share
                </button>
                <button
                  onClick={handleEdit}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
                >
                  <IconEdit className="h-4 w-4" />
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  className="rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50 transition-colors flex items-center gap-2"
                >
                  <IconTrash className="h-4 w-4" />
                  Delete
                </button>
              </div>
            </div>

            {/* Post Content */}
            <div className="max-w-4xl mx-auto">
              {/* Post Header */}
              <div className="bg-white rounded-lg border border-gray-200 p-8 mb-6">
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-4">
                    <span
                      className={`inline-flex rounded-lg px-3 py-1 text-sm font-semibold ${getStatusBadgeColor(
                        post.status
                      )}`}
                    >
                      {post.status}
                    </span>
                    <span className="inline-flex rounded-lg px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800">
                      {post.category}
                    </span>
                  </div>

                  <h1 className="text-3xl font-bold text-gray-900 mb-4">
                    {post.title}
                  </h1>

                  {post.excerpt && (
                    <p className="text-lg text-gray-600 mb-6">{post.excerpt}</p>
                  )}

                  <div className="flex items-center gap-6 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <IconUser className="h-4 w-4" />
                      <span>By {post.author}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <IconCalendar className="h-4 w-4" />
                      <span>Created: {post.createdAt}</span>
                    </div>
                    {post.publishedAt && (
                      <div className="flex items-center gap-2">
                        <IconCalendar className="h-4 w-4" />
                        <span>Published: {post.publishedAt}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <IconEye className="h-4 w-4" />
                      <span>{post.views.toLocaleString()} views</span>
                    </div>
                  </div>

                  {post.tags && post.tags.length > 0 && (
                    <div className="flex items-center gap-2 mt-4">
                      <span className="text-sm text-gray-500">Tags:</span>
                      <div className="flex gap-2">
                        {post.tags.map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex rounded-full px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Post Content */}
              <div className="bg-white rounded-lg border border-gray-200 p-8">
                <div className="prose max-w-none">
                  {/* Simple markdown-like rendering */}
                  {post.content.split("\n").map((line, index) => {
                    if (line.startsWith("# ")) {
                      return (
                        <h1
                          key={index}
                          className="text-2xl font-bold text-gray-900 mb-4 mt-8 first:mt-0"
                        >
                          {line.substring(2)}
                        </h1>
                      );
                    } else if (line.startsWith("## ")) {
                      return (
                        <h2
                          key={index}
                          className="text-xl font-semibold text-gray-900 mb-3 mt-6"
                        >
                          {line.substring(3)}
                        </h2>
                      );
                    } else if (line.startsWith("### ")) {
                      return (
                        <h3
                          key={index}
                          className="text-lg font-medium text-gray-900 mb-2 mt-4"
                        >
                          {line.substring(4)}
                        </h3>
                      );
                    } else if (line.startsWith("- ")) {
                      return (
                        <li key={index} className="ml-4">
                          {line.substring(2)}
                        </li>
                      );
                    } else if (line.startsWith("*")) {
                      return (
                        <p key={index} className="italic text-gray-600 my-2">
                          {line}
                        </p>
                      );
                    } else if (line.trim() === "") {
                      return <br key={index} />;
                    } else {
                      return (
                        <p
                          key={index}
                          className="text-gray-700 mb-4 leading-relaxed"
                        >
                          {line}
                        </p>
                      );
                    }
                  })}
                </div>
              </div>

              {/* Post Statistics */}
              <div className="max-w-4xl mx-auto mt-6">
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Post Statistics
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">
                        {post.views.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-500">Total Views</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">
                        {Math.floor(post.views * 0.15)}
                      </div>
                      <div className="text-sm text-gray-500">
                        Unique Visitors
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">
                        {Math.floor(post.views * 0.08)}
                      </div>
                      <div className="text-sm text-gray-500">Engagements</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">
                        {(((post.views * 0.02) / post.views) * 100).toFixed(1)}%
                      </div>
                      <div className="text-sm text-gray-500">
                        Conversion Rate
                      </div>
                    </div>
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
