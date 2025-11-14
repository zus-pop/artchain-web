export type ApiListResponse<T> = {
  success: boolean;
  data: T[];
};

export interface TopCompetitorItem {
  competitorId: string;
  fullName: string;
  email?: string;
  totalSubmissions: number;
  awardsWon?: number;
}

export interface TopExaminerItem {
  examinerId: string;
  fullName: string;
  email?: string;
  totalEvaluations: number;
}

export interface TopPaintingItem {
  paintingId: string;
  title: string;
  competitorName?: string;
  voteCount: number;
  contestId?: number;
}
