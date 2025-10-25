import myAxios from "@/lib/custom-axios";
import { ContestStatus } from "@/types/contest";
import { ContestResponseDTO } from "@/types/contest-dto";

/**
 * Staff Contest Management APIs
 */

// GET /api/staff/contests - Get all contests (staff view)
export const getAllStaffContests = async (params?: {
  page?: number;
  limit?: number;
  status?: ContestStatus;
  search?: string;
}): Promise<ContestResponseDTO> => {
  const response = await myAxios.get("/staff/contests", { params });
  return response.data;
};

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

// GET /api/staff/contests - Get all contests (staff view) - Legacy
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
    name: string;
    table?: string | null;
    startDate: string;
    endDate: string;
    submissionDeadline?: string;
    resultAnnounceDate?: string;
    sendOriginalDeadline?: string;
    status?: string;
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
    name?: string;
    table?: string | null;
    startDate?: string;
    endDate?: string;
    submissionDeadline?: string;
    resultAnnounceDate?: string;
    sendOriginalDeadline?: string;
    status?: string;
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