import myAxios from "@/lib/custom-axios";
import { PostsResponseDTO, GetPostsParams, Post } from "@/types/post";

/**
 * Public Posts APIs
 */

// GET /api/posts - Get all published posts
export const getPosts = async (params?: GetPostsParams): Promise<PostsResponseDTO> => {
  const response = await myAxios.get("/posts", { params });
  return response.data;
};

// GET /api/posts/{postId} - Get a single post by ID
export const getPost = async (postId: number | string): Promise<Post> => {
  const response = await myAxios.get(`/posts/${postId}`);
  return response.data;
};