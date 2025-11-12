export interface Award {
  awardId: number | string;
  name: string;
  description?: string;
  rank?: number;
  prize?: number | string;
}

export interface ContestSummary {
  contestId: number | string;
  title: string;
  startDate?: string;
  endDate?: string;
}

export interface AchievementItem {
  paintingId: string;
  paintingTitle: string;
  paintingImage?: string;
  award: Award | null;
  contest?: ContestSummary | null;
  achievedDate?: string;
}

export interface UserAchievementsResponse {
  user: {
    userId: string;
    fullName?: string;
  };
  achievements: AchievementItem[];
  totalAchievements: number;
}

// exports via interfaces above
