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
  submissionDate: string;
  status: string;
  createdAt: string;
  updatedAt: string;
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
  image?: File;
  title?: string;
  description?: string;
}

export interface Submission {
  paintingId: string;
  roundId: string;
  awardId: string | null;
  contestId: number;
  competitorId: string;
  description: string;
  title: string;
  imageUrl: string;
  submissionDate: string;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
  createdAt: string;
  updatedAt: string;
  competitor: {
    competitorId: string;
    fullName: string;
    email: string;
    phone: string | null;
    username: string;
  };
}
