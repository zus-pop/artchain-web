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
  createdAt: string;
  updatedAt: string;
}

export interface CreateScheduleRequest {
  contestId: number;
  examinerId: string;
  task: string;
  date: string;
  status: string;
}

export interface UpdateScheduleRequest {
  contestId: number;
  examinerId: string;
  task: string;
  date: string;
  status: string;
}

export interface ScheduleResponseDTO {
  success: boolean;
  data?: ScheduleDTO | ScheduleDTO[];
  message?: string;
  meta?: {
    total: number;
  };
}