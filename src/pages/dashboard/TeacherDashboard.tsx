import { useQuery } from "@tanstack/react-query";
import { Users, BookOpen, ClipboardCheck, Clock } from "lucide-react";
import Navbar from "../../components/layout/Navbar";
import Sidebar from "../../components/layout/Sidebar";
import StatsCard from "../../components/dashboard/StatsCard";
import ScheduleCard from "../../components/dashboard/ScheduleCard";
import QuickActions from "../../components/dashboard/QuickActions";
import PerformanceChart from "../../components/dashboard/PerformanceChart";
import RecentActivity from "../../components/dashboard/RecentActivity";
import CourseOverview from "../../components/dashboard/CourseOverview";
import { useAuth } from "../../hooks/useAuth";
import { coursesAPI, attendanceAPI, submissionsAPI } from "../../lib/api";
import LoadingSpinner from "../../components/common/LoadingSpinner";

export default function TeacherDashboard() {
  const { user } = useAuth();

  // Fetch teacher courses
  const { data: courses = [], isLoading: coursesLoading } = useQuery({
    queryKey: ['/api/courses/teacher', user?.id],
    enabled: !!user?.id,
  });

  // Fetch all submissions for teacher's courses
  const { data: allSubmissions = [], isLoading: submissionsLoading } = useQuery({
    queryKey: ['/api/submissions/teacher', user?.id],
    enabled: !!user?.id && courses.length > 0,
    queryFn: async () => {
      // This would need to be implemented in the API to get submissions for teacher's courses
      return [];
    },
  });

  const isLoading = coursesLoading || submissionsLoading;

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

  // Calculate stats for teacher dashboard
  const totalStudents = courses.reduce((sum, course) => {
    // This would be calculated from enrollment data
    return sum + Math.floor(Math.random() * 30) + 10; // Placeholder
  }, 0);

  const activeCourses = courses.filter(course => course.isActive).length;
  const averageAttendance = 94; // This would be calculated from actual attendance data
  const pendingReviews = Math.floor(Math.random() * 25) + 10; // Placeholder

  const stats = [
    {
      title: "Total Students",
      value: totalStudents.toString(),
      icon: Users,
      trend: "+5.2% from last month",
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Active Courses",
      value: activeCourses.toString(),
      icon: BookOpen,
      trend: "+2 new this semester",
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      title: "Avg. Attendance",
      value: `${averageAttendance}%`,
      icon: ClipboardCheck,
      trend: "+2.1% from last week",
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      title: "Pending Reviews",
      value: pendingReviews.toString(),
      icon: Clock,
      trend: "+5 assignments due",
      color: "text-warning",
      bgColor: "bg-warning/10",
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
              Teacher Dashboard
            </h2>
            <p className="text-muted-foreground mt-2">
              Welcome back, {user?.firstName}. Here's what's happening with your classes today.
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
              <ScheduleCard userRole="teacher" />
            </div>

            {/* Quick Actions */}
            <QuickActions userRole="teacher" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Performance Chart */}
            <PerformanceChart />

            {/* Recent Activity */}
            <RecentActivity userRole="teacher" />
          </div>

          {/* Course Overview */}
          <CourseOverview courses={courses} />
        </main>
      </div>
    </div>
  );
}
