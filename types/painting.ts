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

export interface CompetitorSubmission {
  paintingId: string;
  title: string;
  contestId: number;
  contestTitle: string;
  roundId: string;
  submissionDate: string;
  status: string;
  averageScore: number;
}

export interface CompetitorSubmissionsResponse {
  success: boolean;
  data: {
    userId: string;
    fullName: string;
    submissions: CompetitorSubmission[];
  };
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

export interface PaintingEvaluation {
  id: string;
  paintingId: string;
  examinerId: string;
  scoreRound1: number | null;
  scoreRound2: number | null;
  creativityScore: number | null;
  compositionScore: number | null;
  colorScore: number | null;
  technicalScore: number | null;
  aestheticScore: number | null;
  feedback: string | null;
  evaluationDate: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  examiner: {
    examinerId: string;
    specialization: string | null;
    assignedScheduleId: number;
  };
  examinerName: string;
}
