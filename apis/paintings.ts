import myAxios from "@/lib/custom-axios";
import { Painting } from "@/types/painting";
import { useQuery } from "@tanstack/react-query";

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
