import myAxios from "@/lib/custom-axios";
import { ApiResponse, UserAchievementsResponse } from "@/types";
import { useQuery } from "@tanstack/react-query";

export async function getUserAchievements(userId: string) {
  const res = await myAxios.get<ApiResponse<UserAchievementsResponse>>(
    `/users/${userId}/achievements`
  );
  return res.data;
}

export function useGetUserAchievements(userId?: string, enabled = true) {
  return useQuery({
    queryKey: ["achievements", userId],
    queryFn: async () => {
      if (!userId) throw new Error("userId is required");
      return getUserAchievements(userId);
    },
    enabled: Boolean(userId) && Boolean(enabled),
  });
}
