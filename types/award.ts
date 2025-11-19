import { PaintingStatus } from "./dashboard";

export interface Award {
  awardId: string;
  contestId: string;
  name: string;
  description: string;
  rank: number;
  quantity: number;
  prize: string;
  createdAt: string;
  updatedAt: string;
  paintings: {
    paintingId: string;
    roundId: string;
    contestId: string;
    competitorId: string;
    competitorName: string;
    competitorEmail: string;
    averageScore: number;
    description: string;
    title: string;
    imageUrl: string;
    submissionDate: string | null;
    isPassed: boolean | null;
    status: PaintingStatus;
    awardId: string;
    createdAt: string;
    updatedAt: string;
  }[];
}

export interface AssignAwardRequest {
  paintingId: string;
  awardId: string;
}

export interface CreateBatchAwardRequest {
  awards: {
    contestId: string;
    name: string;
    description: string;
    rank: number;
    quantity: number;
    prize: number;
  }[];
}

export interface UpdateAwardRequest {
  contestId: string;
  name: string;
  description: string;
  rank: number;
  quantity: number;
  prize: number;
}
