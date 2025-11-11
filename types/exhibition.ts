import { StringValidation } from "zod/v3";
import { PaintingStatus } from "./dashboard";

export interface CreateExhibitionRequest {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status: ExhibitionStatus;
}

export interface Exhibition {
  exhibitionId: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  numberOfPaintings: number;
  status: ExhibitionStatus;
  createdAt: string;
  updatedAt: string;
  exhibitionPaintings: ExhibitionPainting[];
}

export interface ExhibitionPainting {
  paintingId: string;
  roundId: string;
  contestId: string;
  competitorId: string;
  description: string;
  title: string;
  imageUrl: string;
  submissionDate: string | null;
  status: PaintingStatus;
  awardId: string;
  createdAt: string;
  updatedAt: string;
  award: {
    awardId: string;
    name: string;
    description: string;
    rank: number;
    prize: string;
  } | null;
  competitor: {
    competitorId: string;
    fullName: string;
    email: string;
    birthday: string;
    schoolName: string;
    grade: string;
  };
  addedAt: string;
}

export interface AddPaintingToExhibitionRequest {
  exhibitionId: string;
  paintingIds: string[];
}

export interface DeletePaintingToExhibitionRequest {
  exhibitionId: string;
  paintingId: string;
}

export type ExhibitionStatus = "DRAFT" | "ACTIVE" | "COMPLETED" | "CANCEL";
