import myAxios from "@/lib/custom-axios";
import { ApiResponse, VotedAward, VotedPaining, VoteRequest } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function getVotedAward(contestId: string) {
  return useQuery({
    queryKey: ["votes", "awards", contestId],
    queryFn: async () => {
      const response = await myAxios.get<ApiResponse<VotedAward>>(
        `/votes/contest/${contestId}/awards`
      );
      return response.data;
    },
  });
}

export async function getVotedPaintings({
  contestId,
  awardId,
  accountId,
}: {
  contestId: string;
  awardId: string;
  accountId: string;
}) {
  const response = await myAxios.get<ApiResponse<VotedPaining>>(
    `/votes/contest/${contestId}/award/${awardId}/paintings?accountId=${accountId}`
  );
  return response.data;
}

export function useSubmitVote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: VoteRequest) => {
      const response = await myAxios.post(`/votes/submit`, {
        accountId: params.accountId,
        paintingId: params.paintingId,
        awardId: Number(params.awardId),
        contestId: Number(params.contestId),
      });
      return response.data;
    },
    onSuccess: (data) => {
      const voteCount = data.data?.currentVoteCount ?? 0;
      toast.success("Bình chọn thành công!");
      // Invalidate queries to refetch data
      queryClient.invalidateQueries({ queryKey: ["votes"] });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || error.message || "Có lỗi xảy ra khi bình chọn";
      toast.error(message);
    },
  });
}

export function useRemoveVote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: VoteRequest) => {
      const response = await myAxios.delete(`/votes/remove`, {
        data: {
          accountId: params.accountId,
          paintingId: params.paintingId,
          awardId: Number(params.awardId),
          contestId: Number(params.contestId),
        },
      });
      return response.data;
    },
    onSuccess: () => {
      toast.success("Đã xóa bình chọn!");
      queryClient.invalidateQueries({ queryKey: ["votes"] });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || error.message || "Có lỗi xảy ra khi xóa bình chọn";
      toast.error(message);
    },
  });
}
