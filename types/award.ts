import { Painting } from "./dashboard";

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
  paintings: Painting[];
}

export interface AssignAwardRequest {
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
