// Re-export types from shared schema
export type {
  User,
  InsertUser,
  Institution,
  InsertInstitution,
  Course,
  InsertCourse,
  CourseEnrollment,
  InsertCourseEnrollment,
  Schedule,
  InsertSchedule,
  Attendance,
  InsertAttendance,
  Assignment,
  InsertAssignment,
  Submission,
  InsertSubmission,
  Forum,
  InsertForum,
  ForumPost,
  InsertForumPost,
  Notification,
  InsertNotification,
  CourseMaterial,
  InsertCourseMaterial,
  LoginCredentials,
  RegisterData,
} from '../shared/schema2';

// Additional frontend-specific types
export interface DashboardStats {
  totalStudents: number;
  activeCourses: number;
  averageAttendance: number;
  pendingReviews: number;
}

export interface ScheduleItem {
  id: string;
  time: string;
  course: string;
  room: string;
  grade: string;
  status: 'in-progress' | 'upcoming' | 'completed';
}

export interface ActivityItem {
  id: string;
  type: 'user-join' | 'assignment-submit' | 'forum-post' | 'attendance-mark' | 'material-upload';
  message: string;
  user: string;
  timestamp: string;
}

export interface CourseProgress {
  courseId: string;
  courseName: string;
  progress: number;
  averageScore: number;
  studentCount: number;
  thumbnail?: string;
}

export interface DeadlineItem {
  id: string;
  title: string;
  course: string;
  dueDate: string;
  priority: 'urgent' | 'medium' | 'low';
  type: 'exam' | 'assignment' | 'meeting' | 'event';
}

export interface ChartDataPoint {
  label: string;
  value: number;
}

export interface PerformanceData {
  classAverage: ChartDataPoint[];
  attendanceRate: ChartDataPoint[];
}

// Form states
export interface FormState<T> {
  data: T;
  errors: Partial<Record<keyof T, string>>;
  isSubmitting: boolean;
}

// Navigation item types
export interface NavItem {
  id: string;
  label: string;
  icon: string;
  path: string;
  roles: string[];
  badge?: number;
}

// Role-based access types
export type UserRole = 'student' | 'teacher' | 'admin' | 'institute_admin';

export interface RolePermissions {
  canCreateCourses: boolean;
  canManageUsers: boolean;
  canViewAnalytics: boolean;
  canManageAttendance: boolean;
  canGradeAssignments: boolean;
  canManageInstitution: boolean;
}
