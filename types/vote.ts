export interface VotedPaining {
  award: {
    awardId: string;
    name: string;
    description: string;
    rank: number;
    prize: string;
    quantity: number;
  };
  paintings: {
    paintingId: string;
    title: string;
    description: string;
    imageUrl: string;
    competitorId: string;
    competitorName: string;
    email: string;
    submissionDate: string | null;
    voteCount: number;
    hasVoted: boolean;
    averageScore: number;
  }[];
  statistics: {
    totalEligiblePaintings: number;
    totalVotesForThisAward: number;
  };
}

export interface VotedAward {
  contestId: string;
  contestTitle: string;
  awards: {
    awardId: string;
    name: string;
    description: string;
    rank: number;
    prize: string;
    quantity: number;
    totalVotes: number;
  }[];
}
