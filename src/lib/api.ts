import { apiRequest } from './queryClient';
import type {
  User,
  Course,
  Assignment,
  Attendance,
  Schedule,
  Submission,
  Forum,
  ForumPost,
  Notification,
  CourseMaterial,
  Institution,
  LoginCredentials,
  RegisterData,
  InsertCourse,
  InsertAssignment,
  InsertAttendance,
  InsertSchedule,
  InsertSubmission,
  InsertForum,
  InsertForumPost,
  InsertNotification,
  InsertCourseMaterial,
} from '@shared/schema';

// Auth API
export const authAPI = {
  login: async (credentials: LoginCredentials): Promise<{ user: User }> => {
    const response = await apiRequest('POST', '/api/auth/login', credentials);
    return await response.json();
  },

  register: async (data: RegisterData): Promise<{ user: User }> => {
    const response = await apiRequest('POST', '/api/auth/register', data);
    return await response.json();
  },
};

// Users API
export const usersAPI = {
  getUser: async (id: string): Promise<User> => {
    const response = await apiRequest('GET', `/api/users/${id}`);
    return await response.json();
  },

  getUsersByRole: async (role: string): Promise<User[]> => {
    const response = await apiRequest('GET', `/api/users/role/${role}`);
    return await response.json();
  },
};

// Courses API
export const coursesAPI = {
  getAllCourses: async (): Promise<Course[]> => {
    const response = await apiRequest('GET', '/api/courses');
    return await response.json();
  },

  getCourse: async (id: string): Promise<Course> => {
    const response = await apiRequest('GET', `/api/courses/${id}`);
    return await response.json();
  },

  createCourse: async (course: InsertCourse): Promise<Course> => {
    const response = await apiRequest('POST', '/api/courses', course);
    return await response.json();
  },

  getCoursesByTeacher: async (teacherId: string): Promise<Course[]> => {
    const response = await apiRequest('GET', `/api/courses/teacher/${teacherId}`);
    return await response.json();
  },

  getCourseStudents: async (courseId: string): Promise<User[]> => {
    const response = await apiRequest('GET', `/api/courses/${courseId}/students`);
    return await response.json();
  },

  getStudentCourses: async (studentId: string): Promise<Course[]> => {
    const response = await apiRequest('GET', `/api/students/${studentId}/courses`);
    return await response.json();
  },
};

// Schedules API
export const schedulesAPI = {
  getSchedulesByCourse: async (courseId: string): Promise<Schedule[]> => {
    const response = await apiRequest('GET', `/api/schedules/course/${courseId}`);
    return await response.json();
  },

  getSchedulesByDay: async (dayOfWeek: string): Promise<Schedule[]> => {
    const response = await apiRequest('GET', `/api/schedules/day/${dayOfWeek}`);
    return await response.json();
  },

  createSchedule: async (schedule: InsertSchedule): Promise<Schedule> => {
    const response = await apiRequest('POST', '/api/schedules', schedule);
    return await response.json();
  },
};

// Attendance API
export const attendanceAPI = {
  markAttendance: async (attendance: InsertAttendance): Promise<Attendance> => {
    const response = await apiRequest('POST', '/api/attendance', attendance);
    return await response.json();
  },

  getAttendanceByStudent: async (studentId: string, courseId?: string): Promise<Attendance[]> => {
    const url = courseId 
      ? `/api/attendance/student/${studentId}?courseId=${courseId}`
      : `/api/attendance/student/${studentId}`;
    const response = await apiRequest('GET', url);
    return await response.json();
  },

  getAttendanceByCourse: async (courseId: string, date?: string): Promise<Attendance[]> => {
    const url = date 
      ? `/api/attendance/course/${courseId}?date=${date}`
      : `/api/attendance/course/${courseId}`;
    const response = await apiRequest('GET', url);
    return await response.json();
  },
};

// Assignments API
export const assignmentsAPI = {
  getAssignmentsByCourse: async (courseId: string): Promise<Assignment[]> => {
    const response = await apiRequest('GET', `/api/assignments/course/${courseId}`);
    return await response.json();
  },

  getAssignment: async (id: string): Promise<Assignment> => {
    const response = await apiRequest('GET', `/api/assignments/${id}`);
    return await response.json();
  },

  createAssignment: async (assignment: InsertAssignment): Promise<Assignment> => {
    const response = await apiRequest('POST', '/api/assignments', assignment);
    return await response.json();
  },
};

// Submissions API
export const submissionsAPI = {
  getSubmissionsByAssignment: async (assignmentId: string): Promise<Submission[]> => {
    const response = await apiRequest('GET', `/api/submissions/assignment/${assignmentId}`);
    return await response.json();
  },

  getSubmissionsByStudent: async (studentId: string): Promise<Submission[]> => {
    const response = await apiRequest('GET', `/api/submissions/student/${studentId}`);
    return await response.json();
  },

  createSubmission: async (submission: InsertSubmission): Promise<Submission> => {
    const response = await apiRequest('POST', '/api/submissions', submission);
    return await response.json();
  },

  gradeSubmission: async (id: string, score: number, feedback: string, gradedBy: string): Promise<Submission> => {
    const response = await apiRequest('PATCH', `/api/submissions/${id}/grade`, {
      score,
      feedback,
      gradedBy,
    });
    return await response.json();
  },
};

// Forums API
export const forumsAPI = {
  getForumsByCourse: async (courseId: string): Promise<Forum[]> => {
    const response = await apiRequest('GET', `/api/forums/course/${courseId}`);
    return await response.json();
  },

  createForum: async (forum: InsertForum): Promise<Forum> => {
    const response = await apiRequest('POST', '/api/forums', forum);
    return await response.json();
  },

  getForumPosts: async (forumId: string): Promise<ForumPost[]> => {
    const response = await apiRequest('GET', `/api/forums/${forumId}/posts`);
    return await response.json();
  },

  createForumPost: async (post: InsertForumPost): Promise<ForumPost> => {
    const response = await apiRequest('POST', '/api/forum-posts', post);
    return await response.json();
  },
};

// Notifications API
export const notificationsAPI = {
  getUserNotifications: async (userId: string): Promise<Notification[]> => {
    const response = await apiRequest('GET', `/api/notifications/${userId}`);
    return await response.json();
  },

  createNotification: async (notification: InsertNotification): Promise<Notification> => {
    const response = await apiRequest('POST', '/api/notifications', notification);
    return await response.json();
  },

  markNotificationRead: async (id: string): Promise<void> => {
    await apiRequest('PATCH', `/api/notifications/${id}/read`);
  },
};

// Course Materials API
export const materialsAPI = {
  getMaterialsByCourse: async (courseId: string): Promise<CourseMaterial[]> => {
    const response = await apiRequest('GET', `/api/materials/course/${courseId}`);
    return await response.json();
  },

  createMaterial: async (material: InsertCourseMaterial): Promise<CourseMaterial> => {
    const response = await apiRequest('POST', '/api/materials', material);
    return await response.json();
  },

  deleteMaterial: async (id: string): Promise<void> => {
    await apiRequest('DELETE', `/api/materials/${id}`);
  },
};

// Institutions API
export const institutionsAPI = {
  getAllInstitutions: async (): Promise<Institution[]> => {
    const response = await apiRequest('GET', '/api/institutions');
    return await response.json();
  },

  createInstitution: async (institution: any): Promise<Institution> => {
    const response = await apiRequest('POST', '/api/institutions', institution);
    return await response.json();
  },
};
