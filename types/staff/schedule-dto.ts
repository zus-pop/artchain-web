/**
 * Schedule DTOs for staff management
 */

export interface ScheduleDTO {
  scheduleId: number;
  contestId: number;
  examinerId: string;
  task: string;
  date: string;
  status: string;
  round2Table?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateScheduleRequest {
  contestId: number;
  examinerId: string;
  task: string;
  date: string;
  status: string;
  round2Table?: string;
}

export interface UpdateScheduleRequest {
  contestId: number;
  examinerId: string;
  task: string;
  date: string;
  status: string;
  round2Table?: string;
}

export interface ScheduleResponseDTO {
  success: boolean;
  data?: ScheduleDTO | ScheduleDTO[];
  message?: string;
  meta?: {
    total: number;
  };
}
