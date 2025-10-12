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
export type PaintingStatus = "PENDING" | "APPROVED" | "REJECTED";

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

export type ContestCategory =
  | "LANDSCAPE"
  | "PORTRAIT"
  | "ABSTRACT"
  | "STILL_LIFE"
  | "FIGURE"
  | "GENRE"
  | "OTHER";

export interface Contest {
  id: string;
  title: string;
  description: string;
  category: string;
  status: ContestStatus;
  startDate: string;
  endDate: string;
  maxParticipants: number;
  currentParticipants: number;
  prizePool: string;
  examinersCount: number;
  submissionsCount: number;
  createdAt: string;
  createdBy: string;
}

export interface ActiveContest {
  id: string;
  title: string;
  description: string;
  category: ContestCategory;
  endDate: string;
  participants: number;
  maxParticipants: number;
  prizePool: number;
  daysLeft: number;
}

// Examiner Management Types
export type ExaminerStatus = "ACTIVE" | "INACTIVE" | "PENDING";

export type Specialization =
  | "LANDSCAPE"
  | "PORTRAIT"
  | "ABSTRACT"
  | "STILL_LIFE"
  | "FIGURE"
  | "GENRE"
  | "TECHNICAL"
  | "COMPOSITION"
  | "COLOR_THEORY";

export interface Examiner {
  id: string;
  name: string;
  email: string;
  specialization: Specialization[];
  status: ExaminerStatus;
  joinedDate: string;
  totalReviews: number;
  averageRating: number;
  bio: string;
  avatar?: string;
}

export interface InviteForm {
  email: string;
  name: string;
  specialization: Specialization[];
  message: string;
}

// Awards Management Types
export type AwardType =
  | "GOLD"
  | "SILVER"
  | "BRONZE"
  | "HONORABLE_MENTION"
  | "SPECIAL";

export type AwardTemplateType =
  | "CERTIFICATE"
  | "TROPHY"
  | "MEDAL"
  | "RIBBON"
  | "PLAQUE"
  | "OTHER";

export interface Award {
  id: string;
  contestId: string;
  contestTitle: string;
  winnerId: string;
  winnerName: string;
  type: AwardType;
  title: string;
  description: string;
  prize: number;
  awardedAt: string;
  certificateUrl?: string;
}

export interface AwardTemplate {
  id: string;
  name: string;
  type: AwardTemplateType;
  description: string;
  templateUrl: string;
  isActive: boolean;
  createdAt: string;
}

export interface Winner {
  id: string;
  name: string;
  email: string;
  paintingId: string;
  paintingTitle: string;
  awardType: AwardType;
  prize: number;
  rank: number;
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
  fullName: string;
  email: string;
  role: UserRole;
  status: UserStatus;
}

export interface EditUserFormData {
  username: string;
  fullName: string;
  email: string;
  role: UserRole;
  status: UserStatus;
}
