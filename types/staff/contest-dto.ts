// contest-dto.ts

/**
 * DTO cho một vòng (round) trong contest
 */
export interface RoundDTO {
  roundId: number;
  contestId: number;
  table: string | null;
  name: string;
  startDate: string | null;
  endDate: string | null;
  submissionDeadline: string | null;
  resultAnnounceDate: string | null;
  sendOriginalDeadline: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * DTO cho examiner trong contest
 */
export interface ExaminerDTO {
  contestId: number;
  examinerId: string;
  assignmentDate: string;
  status: string | null;
  role: string;
  examiner: {
    examinerId: string;
    specialization: string | null;
    assignedScheduleId: string | null;
  };
  examinerName: string;
  examinerEmail: string;
}

/**
 * DTO cho một contest
 */
export interface ContestDTO {
  contestId: number;
  title: string;
  description: string;
  bannerUrl: string;
  numOfAward: number;
  startDate: string;
  endDate: string;
  status: string;
  createdBy: string;
  rounds: RoundDTO[];
  examiners: ExaminerDTO[];
}

/**
 * Meta object trả về kèm response (đã có `total` trong ví dụ của bạn).
 * Để linh hoạt, cho phép các trường khác (ví dụ: page, perPage, totalPages) nếu cần.
 */
export interface MetaDTO {
  total: number;
  page?: number;
  perPage?: number;
  totalPages?: number;
}

/**
 * Response DTO đầy đủ (success + data + meta)
 */
export interface ContestResponseDTO {
  success: boolean;
  data: ContestDTO[];
  meta: MetaDTO;
}
