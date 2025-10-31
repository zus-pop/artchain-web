export interface CampaignAPIResponse {
  campaignId: number;
  title: string;
  description: string;
  goalAmount: string;
  currentAmount: string;
  deadline: string;
  status: "DRAFT" | "ACTIVE" | "CLOSED" | "COMPLETED" | "CANCELLED";
  staffId: string;
  createdAt: string;
  updatedAt: string;
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