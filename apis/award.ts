import myAxios from "@/lib/custom-axios";
import { ApiResponse } from "@/types";
import {
  AssignAwardRequest,
  Award,
  CreateBatchAwardRequest,
  UpdateAwardRequest,
} from "@/types/award";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useCreateBatchAward() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (createBatchAwardRequest: CreateBatchAwardRequest) => {
      const response = await myAxios.post<ApiResponse<Award[]>>(
        `/awards/batch`,
        createBatchAwardRequest,
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success("Tạo giải thưởng thành công");
      queryClient.invalidateQueries({ queryKey: ["awards"] });
    },
    onError: () => {
      toast.error("Tạo giải thưởng thất bại");
    },
  });
}

export function useUpdateAward(awardId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updateAwardRequest: UpdateAwardRequest) => {
      const response = await myAxios.patch(
        `/awards/${awardId}`,
        updateAwardRequest,
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success("Cập nhật giải thưởng thành công");
      queryClient.invalidateQueries({ queryKey: ["awards"] });
    },
    onError: () => {
      toast.error("Cập nhật giải thưởng thất bại");
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
    onError: () => {
      toast.error("Xoá giải thưởng thất bại");
    },
  });
}

export function useGetAwardsByContestId(contestId: string) {
  return useQuery({
    queryKey: ["awards", contestId],
    queryFn: async () => {
      const response = await myAxios.get<ApiResponse<Award[]>>(
        `/awards/contest/${contestId}`,
      );
      return response.data;
    },
    enabled: !!contestId,
  });
}

export function useAssignAward() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (assignAwardRequest: AssignAwardRequest) => {
      const { paintingId, ...rest } = assignAwardRequest;
      const response = await myAxios.post(
        `/staff/paintings/${paintingId}/award`,
        rest,
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success("Trao giải thưởng thành công");
      queryClient.invalidateQueries({ queryKey: ["/paintings/tops"] });
      queryClient.invalidateQueries({ queryKey: ["awards"] });
    },
    onError: () => {
      toast.error("Trao giải thưởng thất bại");
    },
  });
}
export function useRemoveAward() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (paintingId: string) => {
      const response = await myAxios.delete(
        `/staff/paintings/${paintingId}/award`,
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success("Gỡ giải thưởng thành công");
      queryClient.invalidateQueries({ queryKey: ["/paintings/tops"] });
      queryClient.invalidateQueries({ queryKey: ["awards"] });
    },
    onError: () => {
      toast.error("Gỡ giải thưởng thất bại");
    },
  });
}
