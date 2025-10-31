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
 * DTO cho examiner có sẵn (không gắn với contest nào)
 */
export interface AvailableExaminerDTO {
  examinerId: string;
  fullName: string;
  email: string;
  phone: string | null;
  status: number;
  specialization: string | null;
  assignedScheduleId: string | null;
}

/**
 * Response DTO cho danh sách examiners trong contest
 */
export interface ExaminersResponseDTO {
  success: boolean;
  data: ExaminerDTO[];
  meta?: {
    total: number;
    page?: number;
    perPage?: number;
    totalPages?: number;
  };
}

/**
 * Response DTO cho danh sách examiners có sẵn
 */
export interface AvailableExaminersResponseDTO {
  success: boolean;
  data: AvailableExaminerDTO[];
  meta?: {
    total: number;
    page?: number;
    perPage?: number;
    totalPages?: number;
  };
}