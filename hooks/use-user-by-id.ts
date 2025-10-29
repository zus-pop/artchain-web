import myAxios from "@/lib/custom-axios";
import { WhoAmI } from "@/types";
import { useQuery } from "@tanstack/react-query";

export function useUserById(userId: string | null) {
  return useQuery({
    queryKey: ["user", userId],
    queryFn: async () => {
      const response = await myAxios.get<WhoAmI>(`/users/${userId}`);
      return response.data;
    },
  });
}
