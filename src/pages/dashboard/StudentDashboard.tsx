import { useQuery } from "@tanstack/react-query";
import { Calendar, BookOpen, Clock, TrendingUp } from "lucide-react";
import Navbar from "../../components/layout/Navbar";
import Sidebar from "../../components/layout/Sidebar";
import StatsCard from "../../components/dashboard/StatsCard";
import ScheduleCard from "../../components/dashboard/ScheduleCard";
import RecentActivity from "../../components/dashboard/RecentActivity";
import { useAuth } from "../../hooks/useAuth";
import { coursesAPI, attendanceAPI, assignmentsAPI, submissionsAPI } from "../../lib/api";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorMessage from "../../components/common/ErrorMessage";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Progress } from "../../components/ui/progress";
import { Badge } from "../../components/ui/badge";

export default function StudentDashboard() {
  const { user } = useAuth();

  // Fetch student courses
  const { data: courses = [], isLoading: coursesLoading } = useQuery({
    queryKey: ['/api/students', user?.id, 'courses'],
    enabled: !!user?.id,
  });

  // Fetch attendance data
  const { data: attendance = [], isLoading: attendanceLoading } = useQuery({
    queryKey: ['/api/attendance/student', user?.id],
    enabled: !!user?.id,
  });

  // Fetch submissions
  const { data: submissions = [], isLoading: submissionsLoading } = useQuery({
    queryKey: ['/api/submissions/student', user?.id],
    enabled: !!user?.id,
  });

  const isLoading = coursesLoading || attendanceLoading || submissionsLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-6">
            <LoadingSpinner size="lg" text="Loading your dashboard..." />
          </main>
        </div>
      </div>
    );
  }

  // Calculate stats
  const totalCourses = courses.length;
  const totalAttendance = attendance.length;
  const presentAttendance = attendance.filter(a => a.status === 'present').length;
  const attendanceRate = totalAttendance > 0 ? Math.round((presentAttendance / totalAttendance) * 100) : 0;
  const gradedSubmissions = submissions.filter(s => s.status === 'graded');
  const averageGrade = gradedSubmissions.length > 0 
    ? Math.round(gradedSubmissions.reduce((sum, s) => sum + (s.score || 0), 0) / gradedSubmissions.length)
    : 0;
  const pendingAssignments = submissions.filter(s => s.status === 'submitted' || s.status === 'draft').length;

  const stats = [
    {
      title: "Enrolled Courses",
      value: totalCourses.toString(),
      icon: BookOpen,
      trend: "+2 this semester",
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Attendance Rate",
      value: `${attendanceRate}%`,
      icon: Calendar,
      trend: attendanceRate >= 90 ? "Excellent!" : "Keep improving",
      color: attendanceRate >= 90 ? "text-success" : "text-warning",
      bgColor: attendanceRate >= 90 ? "bg-success/10" : "bg-warning/10",
    },
    {
      title: "Average Grade",
      value: averageGrade > 0 ? `${averageGrade}%` : "N/A",
      icon: TrendingUp,
      trend: averageGrade >= 80 ? "Great work!" : "Room for improvement",
      color: averageGrade >= 80 ? "text-success" : "text-warning",
      bgColor: averageGrade >= 80 ? "bg-success/10" : "bg-warning/10",
    },
    {
      title: "Pending Work",
      value: pendingAssignments.toString(),
      icon: Clock,
      trend: pendingAssignments === 0 ? "All caught up!" : "Due soon",
      color: pendingAssignments === 0 ? "text-success" : "text-warning",
      bgColor: pendingAssignments === 0 ? "bg-success/10" : "bg-warning/10",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          {/* Dashboard Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-foreground" data-testid="dashboard-title">
              Welcome back, {user?.firstName}!
            </h2>
            <p className="text-muted-foreground mt-2">
              Here's an overview of your academic progress and upcoming activities.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="dashboard-grid mb-8">
            {stats.map((stat, index) => (
              <StatsCard
                key={index}
                title={stat.title}
                value={stat.value}
                icon={stat.icon}
                trend={stat.trend}
                color={stat.color}
                bgColor={stat.bgColor}
                data-testid={`stat-${index}`}
              />
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Schedule Card */}
            <div className="lg:col-span-2">
              <ScheduleCard userRole="student" />
            </div>

            {/* Course Progress */}
            <Card className="dashboard-card">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Course Progress
                  <Badge variant="secondary">{courses.length} courses</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {courses.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">
                    No courses enrolled yet.
                  </p>
                ) : (
                  courses.slice(0, 4).map((course) => {
                    // Calculate progress based on submissions for this course
                    const courseSubmissions = submissions.filter(s => s.assignmentId); // This would need course association
                    const progress = Math.floor(Math.random() * 100); // Placeholder calculation
                    
                    return (
                      <div key={course.id} className="space-y-2" data-testid={`course-progress-${course.id}`}>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{course.name}</span>
                          <span className="text-sm text-muted-foreground">{progress}%</span>
                        </div>
                        <Progress value={progress} className="h-2" />
                      </div>
                    );
                  })
                )}
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Activity */}
            <RecentActivity userRole="student" />

            {/* Upcoming Deadlines */}
            <Card className="dashboard-card">
              <CardHeader>
                <CardTitle>Upcoming Deadlines</CardTitle>
              </CardHeader>
              <CardContent>
                {pendingAssignments === 0 ? (
                  <p className="text-muted-foreground text-center py-4">
                    No upcoming deadlines. Great job staying on top of your work!
                  </p>
                ) : (
                  <div className="space-y-4">
                    {submissions
                      .filter(s => s.status === 'submitted' || s.status === 'draft')
                      .slice(0, 3)
                      .map((submission, index) => (
                        <div key={submission.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg" data-testid={`deadline-${index}`}>
                          <div>
                            <h4 className="text-sm font-medium">Assignment {submission.id.slice(-4)}</h4>
                            <p className="text-xs text-muted-foreground">Status: {submission.status}</p>
                          </div>
                          <Badge variant={submission.status === 'draft' ? 'destructive' : 'warning'}>
                            {submission.status === 'draft' ? 'Draft' : 'Submitted'}
                          </Badge>
                        </div>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
