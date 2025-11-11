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
    imageUrl: string | null;
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

export interface VoteRequest {
  accountId: string;
  paintingId: string;
  awardId: string;
  contestId: string;
}

export interface VoteSubmitResponse {
  success: boolean;
  message: string;
  data: {
    voteId: number;
    painting: {
      paintingId: string;
      title: string;
    };
    award: {
      awardId: number;
      name: string;
    };
    currentVoteCount: number;
  };
}
