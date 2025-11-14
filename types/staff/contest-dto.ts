// contest-dto.ts

import { PaintingStatus } from "../dashboard";

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
  ruleUrl: string;
  isScheduleEnforcement: boolean;
  numOfAward: number;
  round2Quantity: number;
  numberOfTablesRound2: number;
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

/**
 * DTO cho table trong ROUND_2
 */
export interface RoundTableDTO {
  roundId: number;
  table: string;
  startDate: string;
  endDate: string;
  submissionDeadline: string;
  resultAnnounceDate: string;
  sendOriginalDeadline: string;
  status: string;
  competitors: {
    competitorId: string;
    birthday: string;
    schoolName: string;
    ward: string;
    grade: string;
    guardianId: string;
    username: string;
    email: string;
    fullName: string;
    paintings: {
      paintingId: number;
      title: string;
      imageUrl: string;
      status: PaintingStatus;
    }[];
  }[];
}

/**
 * DTO cho item trong response của getStaffRounds
 */
export interface RoundResponseItem {
  roundId?: number;
  name: string;
  isRound2: boolean;
  startDate?: string;
  endDate?: string;
  submissionDeadline?: string;
  resultAnnounceDate?: string;
  sendOriginalDeadline?: string;
  status: string;
  table?: string;
  tables?: RoundTableDTO[];
  totalTables?: number;
}

export interface RoundDetail {
  roundInfo: {
    roundId: string;
    contestId: string;
    table: string;
    name: string;
    startDate: string;
    endDate: string;
    submissionDeadline: string;
    resultAnnounceDate: string;
    sendOriginalDeadline: string;
    status: string;
    createdAt: string;
    updatedAt: string;
  };
  isRound2: boolean;
  tables: RoundTableDTO[];
}

/**
 * Meta cho response của getStaffRounds
 */
export interface RoundsMetaDTO {
  contestId: number;
  totalRounds: number;
  roundTypes: string[];
}

/**
 * Response DTO cho getStaffRounds
 */
export interface GetStaffRoundsResponse {
  success: boolean;
  data: RoundResponseItem[];
  meta: RoundsMetaDTO;
}

export interface CreateContestRequest {
  title: string;
  description: string;
  round2Quantity: number;
  numberOfTablesRound2: number;
  startDate: string;
  endDate: string;
  banner: File;
  rule: File;
  roundStartDate: string;
  roundEndDate: string;
  roundSubmissionDeadline: string;
  roundResultAnnounceDate: string;
  roundSendOriginalDeadline: string;
}

export interface UpdateContestRequest {
  contestId: string;
  title?: string;
  description?: string;
  round2Quantity?: number;
  startDate?: string;
  endDate?: string;
  banner?: File;
  rule?: File;
  roundStartDate?: string;
  roundEndDate?: string;
  roundSubmissionDeadline?: string;
  roundResultAnnounceDate?: string;
  roundSendOriginalDeadline?: string;
}
