export interface SystemStatistics {
  users: {
    total: number;
    active: number;
    inactive: number;
    byRole: {
      competitors: number;
      examiners: number;
      guardians: number;
      staffs: number;
      admins: number;
    };
  };
  contests: {
    total: number;
    active: number;
    upcoming: number;
    ended: number;
    completed: number;
    draft: number;
  };
  paintings: {
    total: number;
    accepted: number;
    pending: number;
    rejected: number;
  };
  evaluations: {
    total: number;
  };
  votes: {
    total: number;
  };
  awards: {
    total: number;
  };
  exhibitions: {
    total: number;
    active: number;
    draft: number;
  };
  campaigns: {
    total: number;
    active: number;
    draft: number;
  };
  topSchools: {
    schoolName: string;
    awardCount: number;
  }[];
  topCompetitorsInRecentContests: {
    contests: {
      contestId: number;
      title: string;
    }[];
    competitors: {
      competitorId: string;
      competitorName: string;
      email: string;
      schoolName: string;
      awardCount: number;
    }[];
  };
}

export interface SystemStatisticsResponse {
  success: boolean;
  data: SystemStatistics;
}

export interface ContestStatistics {
  contest: {
    contestId: number;
    title: string;
    status: string;
    startDate: string;
    endDate: string;
  };
  submissions: {
    total: number;
    accepted: number;
    pending: number;
    rejected: number;
    approved?: number;
    byRound: Record<string, number | { total: number }>;
  };
  participants: {
    total: number;
    active: number;
    totalCompetitors?: number;
  };
  evaluations: {
    total: number;
    completed: number;
    pending: number;
  };
  votes: {
    total: number;
  };
  awards: {
    total: number;
    distributed: number;
    awarded?: number;
  };
}

export interface ContestStatisticsResponse {
  success: boolean;
  data: ContestStatistics;
}

export interface UserGrowthItem {
  period: string;
  totalUsers: number;
  newUsers: number;
  activeUsers: number;
  competitors: number;
  examiners: number;
  guardians: number;
  staffs: number;
  admins: number;
  cumulativeTotal: number;
}

export interface UserGrowthSummary {
  totalUsers: number;
  totalNewUsers: number;
  totalActiveUsers: number;
  growthRate: number;
}

export interface UserGrowthResponse {
  success: boolean;
  data: {
    summary: UserGrowthSummary;
    growth: UserGrowthItem[];
  };
}