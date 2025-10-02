import myAxios from "@/lib/custom-axios";
import { useQuery } from "@tanstack/react-query";

export type ContestStatus = "UPCOMING" | "DRAFT" | "ENDED" | "COMPLETED" | "ACTIVE";

export interface Contest {
  contestId: number;
  title: string;
  description: string;
  bannerUrl: string | null;
  numOfAward: number;
  startDate: string;
  endDate: string;
  status: ContestStatus;
  createdBy: string;
}

// Get all contests with optional status filter
export function useGetContests(status?: ContestStatus) {
  return useQuery({
    queryKey: ["contests", status],
    queryFn: async () => {
      const params = status ? { status } : {};
      const response = await myAxios.get("/contests", { params });
      return response.data.data as Contest[];
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
      const response = await myAxios.get(`/contests/${id}`);
      return response.data.data as Contest;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
}