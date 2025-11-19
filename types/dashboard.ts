// Dashboard Types - Centralized interface definitions for staff and admin dashboards

import { StringValidation } from "zod/v3";
import { UserRole } from "./auth";

// =============================================================================
// STAFF DASHBOARD TYPES
// =============================================================================

// Post Management Types
export type PostStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  status: PostStatus;
  createdAt: string;
  publishedAt?: string;
  views: number;
  category: string;
  tags?: string[];
  excerpt?: string;
}

// Sponsor Management Types
export type SponsorStatus = "ACTIVE" | "INACTIVE" | "PENDING";

export interface Sponsor {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  status: SponsorStatus;
  joinedDate: string;
  totalSponsored: number;
  activeCampaigns: number;
  lastActivity: string;
  logo?: string;
}

// Campaign Management Types
export type CampaignStatus =
  | "ACTIVE"
  | "COMPLETED"
  | "PAUSED"
  | "DRAFT"
  | "CLOSED"
  | "CANCELLED";

export interface Campaign {
  id: string;
  title: string;
  description: string;
  sponsor: string;
  sponsorCompany: string;
  goalAmount: number;
  raisedAmount: number;
  status: CampaignStatus;
  startDate: string;
  endDate: string;
  participants: number;
  category: string;
  progress: number;
}

export interface CampaignFormData {
  title: string;
  description: string;
  sponsorId: string;
  goalAmount: number;
  startDate: string;
  endDate: string;
  category: string;
  status: CampaignStatus;
  targetParticipants: number;
  requirements: string;
  benefits: string;
}

// Competitor Management Types
export type CompetitorStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED";

export interface Competitor {
  id: string;
  fullName: string;
  username: string;
  email: string;
  phone?: string;
  age: number;
  school?: string;
  location?: string;
  status: CompetitorStatus;
  joinedDate: string;
  lastActive: string;
  totalPaintings: number;
  approvedPaintings: number;
  pendingPaintings: number;
  rejectedPaintings: number;
  competitionsEntered: number;
  awardsWon: number;
  guardianName?: string;
  guardianEmail?: string;
}

// Painting Management Types
export type PaintingStatus =
  | "PENDING"
  | "ACCEPTED"
  | "REJECTED"
  | "ORIGINAL_SUBMITTED"
  | "NOT_SUBMITTED_ORIGINAL"
  | "";

export interface Painting {
  id: string;
  title: string;
  competitorName: string;
  competitorAge: number;
  submittedDate: string;
  imageUrl: string;
  competitionName: string;
  category: string;
  status: PaintingStatus;
  description?: string;
  approvedDate?: string;
  approvedBy?: string;
  rejectedDate?: string;
  rejectedBy?: string;
  rejectionReason?: string;
}

// Contest Management Types
export type ContestStatus = "DRAFT" | "ACTIVE" | "COMPLETED" | "CANCELLED";

export interface Contest {
  contestId: string;
  title: string;
  description: string;
  status: ContestStatus;
  startDate: string;
  endDate: string;
  createdAt: string;
  createdBy: string;
  isScheduleEnforced: boolean;
  bannerUrl?: string;
  ruleUrl: string | null;
  numOfAward: number;
  round2Quantity: number;
  numberOfTablesRound2: number;
  rounds?: Array<{
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
  }>;
  examiners?: [];
  awards?: {
    awardId: string;
    contestId: string;
    name: string;
    description: string;
    rank: number;
    quantity: number;
    prize: string;
    createdAt: string;
    updatedAt: string;
    winners: {
      paintingId: string;
      title: string;
      imageUrl: string;
      competitorId: string;
      competitorName: string;
      competitorEmail: string;
      competitorSchool: string;
      competitorGrade: string;
    }[];
    winnerCount: number;
  }[];
}

// Form Data Types
export interface PostFormData {
  title: string;
  content: string;
  category: string;
  tags: string[];
  status: PostStatus;
  excerpt?: string;
}

// =============================================================================
// ADMIN DASHBOARD TYPES
// =============================================================================

// User Management Types
export type UserStatus = "ACTIVE" | "SUSPENDED" | "PENDING";

export interface User {
  id: string;
  username: string;
  fullName: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  avatar?: string;
  createdAt: string;
}

export interface CreateUserFormData {
  username: string;
  password: string;
  fullName: string;
  email: string;
  role: UserRole;
}

export interface EditUserFormData {
  username: string;
  fullName: string;
  email: string;
  role: UserRole;
  status: UserStatus;
}
