export interface MultipleEmailsRequest {
  from?: string;
  to: string[];
  subject: string;
  text: string;
}

export interface AnnounceWinnersRequest {
  contestName: string;
  winnerEmails: string[];
}
