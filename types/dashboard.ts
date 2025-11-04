// Dashboard Types - Centralized interface definitions for staff and admin dashboards

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
export type CampaignStatus = "ACTIVE" | "COMPLETED" | "PAUSED" | "DRAFT";

// Competitor Management Types
export type CompetitorStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED";

// Painting Management Types
export type PaintingStatus = "PENDING" | "APPROVED" | "REJECTED";

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
  bannerUrl?: string;
  numOfAward?: number;
  round2Quantity: number;
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
