export type ContestStatus =
  | "ACTIVE"
  | "UPCOMING"
  | "ENDED"
  | "COMPLETED"
  | "DRAFT"
  | "ALL";

export interface Contest {
  contestId: number;
  title: string;
  description: string;
  bannerUrl: string | null;
  numOfAward: number;
  startDate: string;
  endDate: string;
  status: ContestStatus;
  createdBy: string;
}

export interface ContestFilter {
  status?: ContestStatus;
}
