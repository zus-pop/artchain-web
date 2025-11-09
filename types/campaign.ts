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
  image: string | null;
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

// Sponsor types
export interface SponsorData {
  sponsorId: number;
  name: string;
  logoUrl?: string;
  contactInfo: string;
  sponsorshipAmount: string;
  status: "PENDING" | "PAID" | "CANCELLED";
  campaignId: string;
}

export interface OrderData {
  id: string;
  sponsorId: number;
  orderCode: number;
  amount: string;
  description: string;
  returnUrl: string;
  cancelUrl: string;
  transactionId: string;
  status: "PENDING" | "PAID" | "CANCELLED";
  createdAt: string;
}

export interface SponsorResponse {
  error: boolean;
  data: {
    sponsor: SponsorData;
    checkoutUrl: string;
    qrCode: string;
    order: OrderData;
  };
}

export interface CreateSponsorRequest {
  name: string;
  contactInfo: string;
  sponsorshipAmount: number;
  campaignId: number;
  file?: File; // Logo file (optional)
}
