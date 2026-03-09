export type AuctionStatus = 'UPCOMING' | 'ACTIVE' | 'ENDED' | 'CANCELLED';

export interface AuctionPainting {
  auctionPaintingId: string;
  auctionId: string;
  paintingId: string;
  startingPrice: number;
  currentPrice: number;
  painting: {
    paintingId: string;
    title: string;
    imageUrl: string;
    description?: string;
    competitorId: string;
    competitorName?: string;
  };
}

export interface Auction {
  auctionId: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  status: AuctionStatus;
  createdAt: string;
  updatedAt: string;
  paintings?: AuctionPainting[];
  participantCount?: number;
  bidCount?: number;
}

export interface CreateAuctionRequest {
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
}

export interface AddPaintingToAuctionRequest {
  paintingId: string;
  startingPrice: number;
}

export interface PlaceBidRequest {
  auctionId: string;
  auctionPaintingId: string;
  amount: number;
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
