import { CampaignStatus } from "../dashboard";

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
  status: CampaignStatus;
  image: File;
  tiers: CampaignTierInput[];
}

export interface CampaignTierInput {
  tierId: number;
  minPrice: number;
}

export interface TierDefinition {
  id: number;
  name: "bronze" | "silver" | "gold" | "diamond";
  display: string;
  priority: number;
  benefits: string;
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
