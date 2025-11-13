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
  };
  paintings: {
    total: number;
    approved: number;
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
    completed: number;
  };
  campaigns: {
    total: number;
    active: number;
    completed: number;
  };
}

export interface SystemStatisticsResponse {
  success: boolean;
  data: SystemStatistics;
}