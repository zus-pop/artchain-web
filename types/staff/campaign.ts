export interface CampaignAPIResponse {
  campaignId: number;
  title: string;
  description: string;
  image: string | null;
  goalAmount: string;
  currentAmount: string;
  deadline: string;
  status: "DRAFT" | "ACTIVE" | "CLOSED" | "COMPLETED" | "CANCELLED";
  staffId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCampaignRequest {
  title: string;
  description: string;
  goalAmount: number;
  deadline: string;
  status: "DRAFT" | "ACTIVE" | "PAUSED" | "COMPLETED";
  image: File;
}

export interface CampaignsAPIResponse {
  data: CampaignAPIResponse[];
  meta: {
    total: number;
    page: string;
    limit: string;
    totalPages: number;
  };
}
