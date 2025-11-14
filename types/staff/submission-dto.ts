/**
 * DTO for bulk submission acceptance response
 */

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
