import myAxios from "@/lib/custom-axios";
import { useQuery } from "@tanstack/react-query";
import { Contest, ContestStatus } from "@/types/contest";


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

/**
 * Staff Contest Management APIs
 */

// POST /api/staff/contests - Create a new contest
export const createStaffContest = async (data: {
  title: string;
  description: string;
  bannerUrl?: string;
  numOfAward: number;
  startDate: string;
  endDate: string;
  status?: ContestStatus;
}) => {
  const response = await myAxios.post("/staff/contests", data);
  return response.data;
};

// GET /api/staff/contests - Get all contests (staff view)
export const getStaffContests = async (params?: {
  page?: number;
  limit?: number;
  status?: ContestStatus;
  search?: string;
}) => {
  const response = await myAxios.get("/staff/contests", { params });
  return response.data;
};

// PUT /api/staff/contests/{id} - Update a contest
export const updateStaffContest = async (
  id: number,
  data: {
    title?: string;
    description?: string;
    bannerUrl?: string;
    numOfAward?: number;
    startDate?: string;
    endDate?: string;
    status?: ContestStatus;
  }
) => {
  const response = await myAxios.put(`/staff/contests/${id}`, data);
  return response.data;
};

// GET /api/staff/contests/{id} - Get contest by ID (staff view)
export const getStaffContestById = async (id: number) => {
  const response = await myAxios.get(`/staff/contests/${id}`);
  return response.data;
};

// PATCH /api/staff/contests/{id}/publish - Publish a contest
export const publishStaffContest = async (id: number) => {
  const response = await myAxios.patch(`/staff/contests/${id}/publish`);
  return response.data;
};

/**
 * Staff Rounds Management APIs
 */

// POST /api/staff/contests/{contestId}/rounds - Create a new round
export const createStaffRound = async (
  contestId: number,
  data: {
    roundNumber: number;
    title: string;
    description?: string;
    startDate: string;
    endDate: string;
    maxSubmissions?: number;
  }
) => {
  const response = await myAxios.post(`/staff/contests/${contestId}/rounds`, data);
  return response.data;
};

// GET /api/staff/contests/{contestId}/rounds - Get all rounds for a contest
export const getStaffRounds = async (contestId: number) => {
  const response = await myAxios.get(`/staff/contests/${contestId}/rounds`);
  return response.data;
};

// GET /api/staff/contests/{contestId}/rounds/{roundId} - Get round by ID
export const getStaffRoundById = async (contestId: number, roundId: string) => {
  const response = await myAxios.get(`/staff/contests/${contestId}/rounds/${roundId}`);
  return response.data;
};

// PATCH /api/staff/contests/{contestId}/rounds/{roundId} - Update a round
export const updateStaffRound = async (
  contestId: number,
  roundId: string,
  data: {
    title?: string;
    description?: string;
    startDate?: string;
    endDate?: string;
    maxSubmissions?: number;
  }
) => {
  const response = await myAxios.patch(`/staff/contests/${contestId}/rounds/${roundId}`, data);
  return response.data;
};

// DELETE /api/staff/contests/{contestId}/rounds/{roundId} - Delete a round
export const deleteStaffRound = async (contestId: number, roundId: string) => {
  const response = await myAxios.delete(`/staff/contests/${contestId}/rounds/${roundId}`);
  return response.data;
};