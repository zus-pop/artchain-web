import myAxios from "@/lib/custom-axios";
import { ApiResponse } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AssignAwardRequest,
  Award,
  CreateBatchAwardRequest,
  UpdateAwardRequest,
} from "@/types/award";
import { AxiosError } from "axios";
import { toast } from "sonner";

export function useCreateBatchAward() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (createBatchAwardRequest: CreateBatchAwardRequest) => {
      const response = await myAxios.post<ApiResponse<Award[]>>(
        `/awards/batch`,
        createBatchAwardRequest
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success("Tạo giải thưởng thành công");
      queryClient.invalidateQueries({ queryKey: ["awards"] });
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

export function useUpdateAward(awardId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updateAwardRequest: UpdateAwardRequest) => {
      const response = await myAxios.patch(
        `/awards/${awardId}`,
        updateAwardRequest
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success("Cập nhật giải thưởng thành công");
      queryClient.invalidateQueries({ queryKey: ["awards"] });
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

export function useDeleteAward() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (awardId: string) => {
      const response = await myAxios.delete(`/awards/${awardId}`);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Xoá giải thưởng thành công");
      queryClient.invalidateQueries({ queryKey: ["awards"] });
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

export function useGetAwardsByContestId(contestId: string) {
  return useQuery({
    queryKey: ["awards", contestId],
    queryFn: async () => {
      const response = await myAxios.get<ApiResponse<Award[]>>(
        `/awards/contest/${contestId}`
      );
      return response.data;
    },
    enabled: !!contestId,
  });
}

export function useAssignAward(paintingId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (assignAwardRequest: AssignAwardRequest) => {
      const response = await myAxios.post(
        `/staff/paintings/${paintingId}/award`,
        assignAwardRequest
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success("Gán giải thưởng thành công");
      queryClient.invalidateQueries({ queryKey: ["/paintings/tops"] });
      queryClient.invalidateQueries({ queryKey: ["awards"] });
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
export function useRemoveAward(paintingId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await myAxios.delete(
        `/staff/paintings/${paintingId}/award`
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success("Gỡ giải thưởng thành công");
      queryClient.invalidateQueries({ queryKey: ["/paintings/tops"] });
      queryClient.invalidateQueries({ queryKey: ["awards"] });
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
