import myAxios from "@/lib/custom-axios";
import { Painting, Round2ImageRequest, TopPainting } from "@/types/painting";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ApiResponse } from "../types";
import { toast } from "sonner";
import { AxiosError } from "axios";

/**
 * Get all submissions of the current user
 */
export function useGetMySubmissions() {
  return useQuery({
    queryKey: ["my-submissions"],
    queryFn: async () => {
      try {
        const response = await myAxios.get("/users/me/submissions");
        return response.data as Painting[];
      } catch (error) {
        console.error("Error fetching my submissions:", error);
        throw error;
      }
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchOnWindowFocus: false,
  });
}

/**
 * Staff Submission Review APIs
 */

// GET /api/staff/contests/submissions - Get all submissions
export const getStaffSubmissions = async (params?: {
  page?: number;
  limit?: number;
  status?: string;
  contestId?: number;
  search?: string;
}) => {
  const response = await myAxios.get("/staff/contests/submissions", { params });
  return response.data;
};

// GET /api/staff/contests/submissions/pending - Get all pending submissions
export const getStaffPendingSubmissions = async (params?: {
  page?: number;
  limit?: number;
  contestId?: number;
}) => {
  const response = await myAxios.get("/staff/contests/submissions/pending", {
    params,
  });
  return response.data;
};

// GET /api/staff/contests/submissions/{paintingId} - Get submission by ID
export const getStaffSubmissionById = async (paintingId: string) => {
  const response = await myAxios.get(
    `/staff/contests/submissions/${paintingId}`
  );
  return response.data;
};

// PATCH /api/staff/contests/submissions/{paintingId}/review - Review a submission
export const reviewStaffSubmission = async (
  paintingId: string,
  data: {
    reviewNote?: string;
    score?: number;
    feedback?: string;
  }
) => {
  const response = await myAxios.patch(
    `/staff/contests/submissions/${paintingId}/review`,
    data
  );
  return response.data;
};

// PATCH /api/staff/contests/submissions/{paintingId}/accept - Accept a submission
export const acceptStaffSubmission = async (
  paintingId: string,
  data?: {
    acceptNote?: string;
  }
) => {
  const response = await myAxios.patch(
    `/staff/contests/submissions/${paintingId}/accept`,
    data
  );
  return response.data;
};

// PATCH /api/staff/contests/submissions/{paintingId}/reject - Reject a submission
export const rejectStaffSubmission = async (
  paintingId: string,
  data: {
    rejectReason: string;
    rejectNote?: string;
  }
) => {
  const response = await myAxios.patch(
    `/staff/contests/submissions/${paintingId}/reject`,
    data
  );
  return response.data;
};

export function useGetRound2TopByContestId(contestId: string) {
  return useQuery({
    queryKey: ["/paintings/tops", contestId],
    queryFn: async () => {
      const response = await myAxios.get<ApiResponse<TopPainting[]>>(
        `/paintings/round2/rankings`,
        {
          params: {
            contestId: contestId,
          },
        }
      );
      return response.data;
    },
  });
}

export function useUploadRound2Image() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (round2ImageRequest: Round2ImageRequest) => {
      const formData = new FormData();
      formData.append("image", round2ImageRequest.image);

      const response = await myAxios.post(
        `/staff/paintings/${round2ImageRequest.paintingId}/upload-round2-image`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success("Cập nhật ảnh vòng 2 thành công");
      queryClient.invalidateQueries({ queryKey: ["round-submissions"] });
      queryClient.invalidateQueries({ queryKey: ["submission-detail"] });
    },
    onError: (error) => {
      let message = error.message;
      if (error instanceof AxiosError) {
        message = error.response?.data.message;
      }
      toast.error(message);
    },
  });
}
