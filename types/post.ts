/**
 * Post DTOs for public posts API
 */

import { PostStatus } from "./dashboard";

export interface PostTag {
  post_id: number;
  tag_id: number;
  tag: {
    tag_id: number;
    tag_name: string;
    created_at: string;
  };
}

export interface PostCreator {
  userId: string;
  username: string;
  fullName: string;
  email: string;
  phone: string | null;
  role: string;
  status: number;
  createdAt: string;
  positionLevel: string | null;
}

export interface Post {
  post_id: number;
  account_id: string;
  title: string;
  content: string;
  image_url: string | null;
  status: PostStatus;
  published_at: string;
  created_at: string;
  updated_at: string;
  creator: PostCreator;
  postTags: PostTag[];
}

export interface PostsResponseDTO {
  success: boolean;
  data: Post[];
  meta: {
    total: number;
    page: string;
    limit: string;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export interface GetPostsParams {
  page?: number;
  limit?: number;
  search?: string;
  tag_id?: number;
  account_id?: number;
}
