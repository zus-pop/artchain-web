export type AuctionStatus = "PENDING" | "UPCOMING" | "ACTIVE" | "ONGOING" | "ENDED" | "CANCELLED";

export interface AuctionPainting {
  auctionPaintingId: string | number;
  auctionId: string | number;
  paintingId: string;
  basePrice: number;
  ceilPrice?: number;
  bidStep?: number;
  currentBid: number;
  currentBidderId?: string | null;
  isSold?: boolean;
  revoked?: number;
  createdAt?: string;
  updatedAt?: string;
  painting: {
    paintingId: string;
    roundId?: number;
    contestId?: number;
    competitorId: string;
    description?: string;
    title: string;
    imageUrl: string | null;
    submissionDate?: string | null;
    isPassed?: boolean | null;
    status?: string | "ACCEPTED";
    awardId?: number;
    createdAt?: string;
    updatedAt?: string;
  };
  currentBidder?: any;
}

export interface Auction {
  auctionId: string | number;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  status: AuctionStatus;
  auctioneerId?: string;
  createdAt: string;
  updatedAt: string;
  auctioneer?: any;
  auctionPaintings?: AuctionPainting[];
  auctionParticipants?: any[];
  participantCount?: number;
  bidCount?: number;
}

export interface CreateAuctionRequest {
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  auctioneerId?: string;
}

export interface AddPaintingToAuctionRequest {
  paintingId: string;
  basePrice: number;
  ceilPrice?: number;
  bidStep?: number;
}

export interface PlaceBidRequest {
  auctionPaintingId: string | number;
  bidAmount: number;
}

export interface Bid {
  bidId: string;
  auctionId: string;
  auctionPaintingId: string;
  userId: string;
  userName?: string;
  amount: number;
  createdAt: string;
}

// WebSocket event payloads
export interface BidPlacedEvent {
  bidId: string;
  auctionId: string;
  auctionPaintingId: string;
  userId: string;
  userName?: string;
  amount: number;
  createdAt: string;
}

export interface AuctionStatusChangedEvent {
  auctionId: string;
  status: AuctionStatus;
}
