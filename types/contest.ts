export type ContestStatus =
  | "ACTIVE"
  | "UPCOMING"
  | "ENDED"
  | "COMPLETED"
  | "DRAFT"
  | "CANCELLED"
  | "ALL";

export interface Contest {
  contestId: string;
  title: string;
  bannerUrl?: string;
  description: string;
  numOfAward: number;
  round2Quantity: number;
  numberOfTablesRound2: number;
  ruleUrl: string;
  startDate: string;
  endDate: string;
  status: ContestStatus;
  createdBy: string;
  awards: Award[];
  rounds: Rounds[];
  sendOriginalDeadline?: string;
}

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
}

export interface Rounds {
  roundId: string;
  contestId: string;
  table: string | null;
  name: "ROUND_1" | "ROUND_2";
  startDate: string;
  endDate: string;
  submissionDeadline: string;
  resultAnnounceDate: string;
  sendOriginalDeadline: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface ContestFilter {
  status?: ContestStatus;
}
