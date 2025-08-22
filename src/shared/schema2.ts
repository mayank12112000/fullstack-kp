// client/src/types/schema.ts
// ✅ Pure frontend types (no DB / no server dependencies)

// ==================== USER ====================
export interface User {
  id: string;
  username: string;
  email: string;
  password?: string; // optional on frontend
  firstName: string;
  lastName: string;
  role: "student" | "teacher" | "admin" | "institute_admin";
  avatar?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  role?: "student" | "teacher" | "admin" | "institute_admin";
  avatar?: string;
}

// ==================== INSTITUTION ====================
export interface Institution {
  id: string;
  name: string;
  code: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  logo?: string;
  createdAt?: string;
}

// ==================== COURSE ====================
export interface Course {
  id: string;
  name: string;
  code: string;
  description?: string;
  gradeLevel: string;
  semester: string;
  credits?: number;
  teacherId?: string;
  institutionId?: string;
  thumbnail?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// ==================== COURSE ENROLLMENTS ====================
export interface CourseEnrollment {
  id: string;
  studentId: string;
  courseId: string;
  enrolledAt?: string;
  status?: "active" | "completed" | "dropped";
}

// ==================== SCHEDULE ====================
export interface Schedule {
  id: string;
  courseId: string;
  dayOfWeek: string; // monday, tuesday, etc.
  startTime: string;
  endTime: string;
  room?: string;
  type?: "lecture" | "lab" | "workshop";
  isRecurring?: boolean;
}

// ==================== ATTENDANCE ====================
export interface Attendance {
  id: string;
  studentId: string;
  courseId: string;
  date: string;
  status: "present" | "absent" | "late" | "excused";
  markedBy?: string;
  markedAt?: string;
}

// ==================== ASSIGNMENT ====================
export interface Assignment {
  id: string;
  courseId: string;
  title: string;
  description?: string;
  type?: "homework" | "quiz" | "exam" | "project";
  maxScore?: number;
  dueDate?: string;
  createdBy?: string;
  createdAt?: string;
  isActive?: boolean;
}

// ==================== SUBMISSION ====================
export interface Submission {
  id: string;
  assignmentId: string;
  studentId: string;
  content?: string;
  attachments?: any[];
  score?: number;
  feedback?: string;
  status?: "draft" | "submitted" | "graded";
  submittedAt?: string;
  gradedAt?: string;
  gradedBy?: string;
}

// ==================== FORUM ====================
export interface Forum {
  id: string;
  courseId: string;
  title: string;
  description?: string;
  createdBy: string;
  createdAt?: string;
  isActive?: boolean;
}

// ==================== FORUM POSTS ====================
export interface ForumPost {
  id: string;
  forumId: string;
  parentId?: string;
  content: string;
  authorId: string;
  createdAt?: string;
  updatedAt?: string;
}

// ==================== NOTIFICATION ====================
export interface Notification {
  id: string;
  userId: string;
  title: string;
  content?: string;
  type?: "info" | "warning" | "success" | "error";
  isRead?: boolean;
  createdAt?: string;
}

// ==================== COURSE MATERIALS ====================
export interface CourseMaterial {
  id: string;
  courseId: string;
  title: string;
  description?: string;
  type: "document" | "video" | "link" | "image";
  url?: string;
  fileSize?: number;
  uploadedBy?: string;
  uploadedAt?: string;
  isActive?: boolean;
}

import { z } from "zod";

// Frontend-only schema for creating a course
export const insertCourseSchema = z.object({
  name: z.string().min(1, "Course name is required"),
  code: z.string().min(1, "Course code is required"),
  description: z.string().optional(),
  gradeLevel: z.string().min(1, "Grade level is required"),
  semester: z.string().min(1, "Semester is required"),
  credits: z.number().min(1).max(6).default(3),
  teacherId: z.string().optional(),        // optional since user is filled from auth
  institutionId: z.string().optional(),    // optional for now, default could be set
  isActive: z.boolean().default(true),
});

export type InsertCourse = z.infer<typeof insertCourseSchema>;

// ==================== INSERT TYPES ====================
// For creating new records (frontend forms)
export type InsertUser = Omit<User, "id" | "createdAt" | "updatedAt">;
export type InsertInstitution = Omit<Institution, "id" | "createdAt">;
// export type InsertCourse = Omit<Course, "id" | "createdAt" | "updatedAt">;
export type InsertCourseEnrollment = Omit<CourseEnrollment, "id" | "enrolledAt">;
export type InsertSchedule = Omit<Schedule, "id">;
export type InsertAttendance = Omit<Attendance, "id" | "markedAt">;
export type InsertAssignment = Omit<Assignment, "id" | "createdAt">;
export type InsertSubmission = Omit<Submission, "id" | "submittedAt" | "gradedAt">;
export type InsertForum = Omit<Forum, "id" | "createdAt">;
export type InsertForumPost = Omit<ForumPost, "id" | "createdAt" | "updatedAt">;
export type InsertNotification = Omit<Notification, "id" | "createdAt">;
export type InsertCourseMaterial = Omit<CourseMaterial, "id" | "uploadedAt">;
