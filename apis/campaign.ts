import myAxios from "@/lib/custom-axios";
import { CampaignAPIResponse, CampaignsAPIResponse } from "@/types/campaign";
import { ApiResponse } from "../types";

/**
 * Public Campaign APIs
 */

// GET /api/campaigns - Get all published campaigns with pagination and filtering
export const getCampaigns = async (params?: {
  page?: number;
  limit?: number;
  status?: "ACTIVE" | "CLOSED" | "COMPLETED";
}): Promise<CampaignsAPIResponse> => {
  const response = await myAxios.get("/campaigns", { params });
  return response.data;
};

// GET /api/campaigns/{campaignId} - Get a single campaign by ID
export const getCampaign = async (campaignId: number | string) => {
  const response = await myAxios.get<ApiResponse<CampaignAPIResponse>>(
    `/campaigns/${campaignId}`
  );
  return response.data;
};
