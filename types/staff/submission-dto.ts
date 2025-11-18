/**
 * DTO for bulk submission acceptance response
 */

import { PaintingStatus } from "../dashboard";

export interface AcceptedSubmissionResult {
  paintingId: string;
  status: "ACCEPTED";
}

export interface FailedSubmissionResult {
  paintingId: string;
  error: string;
}

export interface BulkAcceptSubmissionsResponse {
  success: boolean;
  message: string;
  data: {
    successful: AcceptedSubmissionResult[];
    failed: FailedSubmissionResult[];
  };
  meta: {
    total: number;
    successCount: number;
    failureCount: number;
  };
}

export interface QualifiedPainting {
  contestId: string;
  contestTitle: string;
  round2Quantity: number;
  qualified: {
    competitorId: string;
    competitorName: string;
    competitorEmail: string;
    avgScore: number;
    evaluationCount: number;
    painting: {
      paintingId: string;
      title: string;
      imageUrl: string;
      status: PaintingStatus;
      avgScore: number;
      submissionDate: string;
    };
    status: PaintingStatus;
    hasSubmittedOriginal: boolean;
  }[];
  summary: {
    totalQualified: number;
    submitted: number;
    notSubmitted: number;
  };
}

export interface UpdateOriginalSubmissionStatusRequest {
  contestId: string;
  paintingId: string;
  hasSubmittedOriginal: boolean;
}
