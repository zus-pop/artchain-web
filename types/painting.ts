import { Award } from "./award";
import { Contest } from "./contest";
import { PaintingStatus } from "./dashboard";

export interface PaintingUploadRequest {
  title: string;
  description?: string;
  competitorId: string;
  contestId: string;
  file: {
    uri: string;
    name: string;
    type: string;
  };
  roundId: string;
}

export interface Painting {
  paintingId: string;
  roundId: string;
  awardId: string | null;
  contest: Contest;
  competitorId: string;
  title: string;
  description?: string;
  imageUrl: string;
  submissionDate: Date;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TopPainting {
  paintingId: string;
  title: string;
  imageUrl: string;
  competitorId: string;
  competitorName: string;
  avgScoreRound2: number;
  evaluationCount: number;
  status: PaintingStatus;
  table: string;
  roundId: string;
  createdAt: string;
  award: Award | null;
}

export interface Round2ImageRequest {
  paintingId: string;
  image: File;
}
