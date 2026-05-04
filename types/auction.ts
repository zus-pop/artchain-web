export type AuctionStatus = "DRAFT" | "PENDING" | "UPCOMING" | "ACTIVE" | "ONGOING" | "ENDED" | "CANCELLED" | "LIVE" | "END";

export interface AuctionPainting {
  auctionPaintingId: string | number;
  auctionId: string | number;
  paintingId: string;
  basePrice: number;
  ceilPrice?: number;
  bidStep?: number;
  auctionDurationMinutes?: number;
  currentBid: number;
  currentBidderId?: string | null;
  isSold?: boolean;
  revoked?: number;
  status?: string | "LIVE" | "WAITING" | "ENDED";
  auctionStartTime?: string;
  auctionEndTime?: string;
  createdAt?: string;
  updatedAt?: string;
  painting: {
    paintingId: string;
    roundId?: number;
    contestId?: number;
    competitorId: string;
    competitorName?: string;
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
  auctionDurationMinutes?: number;
}

export interface PlaceBidRequest {
  auctionPaintingId: string | number;
  bidAmount: number;
}

export interface UpdateAuctionPaintingRequest {
  auctionDurationMinutes?: number;
  auctionStartTime?: string;
  auctionEndTime?: string;
  basePrice?: number;
  ceilPrice?: number;
  bidStep?: number;
  status?: string;
  isSold?: boolean;
  revoked?: number;
  currentBidderId?: string;
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

export interface AuctionListQuery {
  status?: AuctionStatus;
  startFrom?: string;
  startTo?: string;
  endFrom?: string;
  endTo?: string;
  page?: number;
  limit?: number;
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
  currentBid?: number | null;
  currentBidderId?: string | null;
  paintingAuctionEndTime?: string | null;
}

export interface AuctionStatusChangedEvent {
  auctionId: string;
  status: AuctionStatus;
}

export interface AuctionRealtimePaintingStatus {
  auctionPaintingId: string | number;
  paintingId?: string;
  status?: string;
  currentBid?: number | null;
  currentBidderId?: string | null;
  auctionStartTime?: string | null;
  auctionEndTime?: string | null;
}

export interface AuctionRealtimeStatus {
  auctionId: string | number;
  status?: AuctionStatus | string;
  serverTime?: string;
  paintings?: AuctionRealtimePaintingStatus[];
}

export interface JoinedAuctionEvent {
  success: boolean;
  auctionId: string | number;
  message?: string;
  participant?: unknown;
  participantCount?: number;
  auctionStatus?: AuctionRealtimeStatus;
}

export interface WonPainting {
  auctionPaintingId: number;
  auctionId: number;
  auctionTitle: string;
  auctionEndTime: string;
  finalBid: number;
  painting: {
    paintingId: string;
    roundId: number;
    contestId: number;
    competitorId: string;
    ownerId: string;
    description: string;
    title: string;
    imageUrl: string;
    submissionDate: string | null;
    isPassed: boolean | null;
    status: string;
    awardId: number;
    createdAt: string;
    updatedAt: string;
  };
}
