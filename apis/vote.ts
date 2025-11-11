import myAxios from "@/lib/custom-axios";
import { ApiResponse, VotedAward, VotedPaining } from "@/types";
import { useQuery } from "@tanstack/react-query";

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
}: {
  contestId: string;
  awardId: string;
}) {
  const response = await myAxios.get<ApiResponse<VotedPaining[]>>(
    `/votes/contest/${contestId}/award/${awardId}/paintings`
  );
  return response.data;
}
