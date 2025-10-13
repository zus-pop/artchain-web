import myAxios from "@/lib/custom-axios";
import { useQuery } from "@tanstack/react-query";
import { Contest, ContestStatus } from "@/types";


// Get all contests with optional status filter
export function useGetContests(status?: ContestStatus) {
  return useQuery({
    queryKey: ["contests", status],
    queryFn: async () => {
      try {
        const params = status ? { status } : {};
        const response = await myAxios.get("/contests", { params });
        // API /contests trả về array trực tiếp
        return response.data as Contest[] || [];
      } catch (error) {
        console.error("Error fetching contests:", error);
        return [];
      }
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchOnWindowFocus: false,
  });
}

// Get contest by ID
export function useGetContestById(id: number) {
  return useQuery({
    queryKey: ["contest", id],
    queryFn: async () => {
      try {
        const response = await myAxios.get(`/contests/${id}`);
        return response.data.data as Contest;
      } catch (error) {
        console.error("Error fetching contest by ID:", error);
        throw error;
      }
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
}