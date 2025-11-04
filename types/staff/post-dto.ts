import { PostStatus } from "../dashboard";

export interface PostTag {
  post_id: number;
  tag_id: number;
  tag: {
    tag_id: number;
    tag_name: string;
    created_at: string;
  };
}

export interface CreatePostRequest {
  title: string;
  content: string;
  status: PostStatus;
  tag_ids: number[];
  file?: File;
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
  creator: {
    userId: string;
    username: string;
    fullName: string;
    email: string;
    role: string;
  };
  postTags: PostTag[];
}
