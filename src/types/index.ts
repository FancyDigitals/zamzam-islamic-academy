export type UserRole =
  | "super_admin"
  | "academy_admin"
  | "teacher"
  | "student"
  | "guardian";

export type Gender = "male" | "female";

export type AdmissionStatus =
  | "submitted"
  | "under_review"
  | "accepted"
  | "rejected"
  | "waitlisted";

export type ResultStatus =
  | "draft"
  | "submitted"
  | "approved"
  | "published";

export type AssessmentType =
  | "continuous_assessment"
  | "assignment"
  | "quiz"
  | "test"
  | "examination"
  | "oral"
  | "practical"
  | "participation";

export type SessionStatus =
  | "upcoming"
  | "active"
  | "completed"
  | "archived";

export type ResourceType =
  | "pdf"
  | "audio"
  | "video"
  | "image"
  | "link"
  | "text";

export interface ApiResponse<T = undefined> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface StudentWithUser {
  id: string;
  studentId: string;
  firstName: string;
  lastName: string;
  arabicName: string | null;
  email: string | null;
  phone: string | null;
  profilePhoto: string | null;
  gender: Gender | null;
  dateOfBirth: string | null;
  admissionDate: string;
  programme: string | null;
  level: string | null;
  class: string | null;
  session: string | null;
  isActive: boolean;
}

export interface ResultWithDetails {
  id: string;
  courseName: string;
  arabicCourseName: string | null;
  courseCode: string;
  caScore: number | null;
  examScore: number | null;
  totalScore: number | null;
  grade: string | null;
  gradePoint: number | null;
  teacherRemarks: string | null;
  status: ResultStatus;
  term: string;
  session: string;
  publishedAt: string | null;
}

export interface DashboardStats {
  totalStudents: number;
  activeStudents: number;
  totalTeachers: number;
  totalProgrammes: number;
  totalCourses: number;
  pendingAdmissions: number;
  pendingResults: number;
  publishedResults: number;
}