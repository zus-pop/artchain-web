import myAxios from "@/lib/custom-axios";
import { ContestStatus } from "@/types/contest";
import { ContestResponseDTO } from "@/types/staff/contest-dto";

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
  rounds?: Array<{
    name: string;
    table: string;
    startDate: string;
    endDate: string;
    submissionDeadline?: string;
    status?: "DRAFT" | "ACTIVE" | "COMPLETED" | "CANCELLED";
  }>;
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

/**
 * Staff Submissions Management APIs
 */

// GET /api/staff/contests/submissions - Get all submissions
export const getStaffSubmissions = async (params?: {
  page?: number;
  limit?: number;
  contestId?: number;
  roundId?: number;
  status?: "PENDING" | "ACCEPTED" | "REJECTED";
}) => {
  const response = await myAxios.get("/staff/contests/submissions", { params });
  return response.data;
};

// GET /api/staff/contests/submissions/pending - Get pending submissions
export const getStaffPendingSubmissions = async (params?: {
  page?: number;
  limit?: number;
  contestId?: number;
  roundId?: number;
}) => {
  const response = await myAxios.get("/staff/contests/submissions/pending", { params });
  return response.data;
};

// GET /api/staff/contests/submissions/{paintingId} - Get submission by ID
export const getStaffSubmissionById = async (paintingId: string) => {
  const response = await myAxios.get(`/staff/contests/submissions/${paintingId}`);
  return response.data;
};

// PATCH /api/staff/contests/submissions/{paintingId}/accept - Accept a submission
export const acceptStaffSubmission = async (paintingId: string) => {
  const response = await myAxios.patch(`/staff/contests/submissions/${paintingId}/accept`);
  return response.data;
};

// PATCH /api/staff/contests/submissions/{paintingId}/reject - Reject a submission
export const rejectStaffSubmission = async (
  paintingId: string,
  data?: {
    reason?: string;
  }
) => {
  const response = await myAxios.patch(`/staff/contests/submissions/${paintingId}/reject`, data);
  return response.data;
};

/**
 * Staff Posts Management APIs
 */

// GET /api/staff/posts - Get all posts
export const getStaffPosts = async (params?: {
  page?: number;
  limit?: number;
  status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  category?: string;
  search?: string;
}) => {
  const response = await myAxios.get("/staff/posts", { params });
  return response.data;
};

// POST /api/staff/posts - Create a new post
export const createStaffPost = async (data: {
  title: string;
  content: string;
  image_url?: string;
  status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  tag_ids: number[];
}) => {
  const response = await myAxios.post("/staff/posts", data);
  return response.data;
};

// GET /api/staff/posts/{id} - Get post by ID
export const getStaffPostById = async (id: string) => {
  const response = await myAxios.get(`/staff/posts/${id}`);
  return response.data;
};

// PUT /api/staff/posts/{id} - Update a post
export const updateStaffPost = async (
  id: string,
  data: {
    title?: string;
    content?: string;
    image_url?: string;
    status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";
    tag_ids?: number[];
  }
) => {
  const response = await myAxios.put(`/staff/posts/${id}`, data);
  return response.data;
};

// DELETE /api/staff/posts/{id} - Delete a post
export const deleteStaffPost = async (id: string) => {
  const response = await myAxios.delete(`/staff/posts/${id}`);
  return response.data;
};

// POST /api/staff/posts/{id}/publish - Publish a post
export const publishStaffPost = async (id: string) => {
  const response = await myAxios.post(`/staff/posts/${id}/publish`);
  return response.data;
};

// POST /api/staff/posts/{id}/restore - Restore an archived post
export const restoreStaffPost = async (id: string) => {
  const response = await myAxios.post(`/staff/posts/${id}/restore`);
  return response.data;
};

/**
 * Staff Tags Management APIs
 */

// GET /api/staff/tags - Get all tags (with search support)
export const getStaffTags = async (params?: {
  search?: string;
  page?: number;
  limit?: number;
}) => {
  const response = await myAxios.get("/staff/tags", { params });
  return response.data;
};

// POST /api/staff/tags - Create a new tag
export const createStaffTag = async (data: {
  tag_name: string;
}) => {
  const response = await myAxios.post("/staff/tags", data);
  return response.data;
};

/**
 * Staff Contest Examiners Management APIs
 */

// GET /api/staff/contests/{contestId}/examiners - Get examiners for a contest
export const getStaffContestExaminers = async (contestId: number) => {
  const response = await myAxios.get(`/staff/contests/${contestId}/examiners`);
  return response.data;
};

// GET /api/staff/examiners - Get all available examiners
export const getAllStaffExaminers = async (params?: {
  search?: string;
  page?: number;
  limit?: number;
}) => {
  const response = await myAxios.get("/staff/examiners", { params });
  return response.data;
};

// POST /api/staff/contests/{contestId}/examiners - Add examiner to contest
export const addStaffContestExaminer = async (contestId: number, data: {
  examinerId: string;
  role: string;
}) => {
  const requestBody = {
    examiner_id: data.examinerId,
    role: data.role
  };
  const response = await myAxios.post(`/staff/contests/${contestId}/examiners`, requestBody);
  return response.data;
};

// DELETE /api/staff/contests/{contestId}/examiners/{examinerId} - Remove examiner from contest
export const deleteStaffContestExaminer = async (contestId: number, examinerId: string) => {
  const response = await myAxios.delete(`/staff/contests/${contestId}/examiners/${examinerId}`);
  return response.data;
};

/**
 * Schedule Management APIs
 */

// POST /api/staff/schedules - Create a new schedule
export const createStaffSchedule = async (data: {
  contestId: number;
  examinerId: string;
  task: string;
  date: string;
  status: string;
}) => {
  const response = await myAxios.post("/staff/schedules", data);
  return response.data;
};

// GET /api/staff/schedules/examiner/{examinerId} - Get schedules for an examiner
export const getStaffSchedulesByExaminer = async (examinerId: string) => {
  const response = await myAxios.get(`/staff/schedules/examiner/${examinerId}`);
  return response.data;
};

// PUT /api/staff/schedules/{scheduleId} - Update a schedule
export const updateStaffSchedule = async (scheduleId: number, data: {
  contestId: number;
  examinerId: string;
  task: string;
  date: string;
  status: string;
}) => {
  const response = await myAxios.put(`/staff/schedules/${scheduleId}`, data);
  return response.data;
};

// DELETE /api/staff/schedules/{scheduleId} - Delete a schedule
export const deleteStaffSchedule = async (scheduleId: number) => {
  const response = await myAxios.delete(`/staff/schedules/${scheduleId}`);
  return response.data;
};

/**
 * Staff Campaigns Management APIs
 */

// POST /api/staff/campaign - Create a new campaign
export const createStaffCampaign = async (data: {
  title: string;
  description: string;
  goalAmount: number;
  deadline: string;
  status: "DRAFT" | "ACTIVE" | "PAUSED" | "COMPLETED";
}) => {
  const response = await myAxios.post("/staff/campaign", data);
  return response.data;
};

// GET /api/campaigns - Get all campaigns with pagination and filtering
export const getStaffCampaigns = async (params?: {
  page?: number;
  limit?: number;
  status?: "ACTIVE" | "CLOSED" | "COMPLETED" | "DRAFT" | "CANCELLED";
}) => {
  const response = await myAxios.get("/campaigns", { params });
  return response.data;
};

// GET /api/campaigns/{id}/sponsors - Get sponsors for a specific campaign
export const getCampaignSponsors = async (
  campaignId: number,
  params?: {
    page?: number;
    limit?: number;
    status?: "PENDING" | "PAID";
  }
) => {
  const response = await myAxios.get(`/campaigns/${campaignId}/sponsors`, { params });
  return response.data;
};