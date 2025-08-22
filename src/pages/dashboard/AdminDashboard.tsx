import { useQuery } from "@tanstack/react-query";
import { Users, BookOpen, Building, TrendingUp } from "lucide-react";
import Navbar from "../../components/layout/Navbar";
import Sidebar from "../../components/layout/Sidebar";
import StatsCard from "../../components/dashboard/StatsCard";
import PerformanceChart from "../../components/dashboard/PerformanceChart";
import RecentActivity from "../../components/dashboard/RecentActivity";
import { useAuth } from "../../hooks/useAuth";
import { usersAPI, coursesAPI, institutionsAPI } from "../../lib/api";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Link } from "wouter";

export default function AdminDashboard() {
  const { user } = useAuth();

  // Fetch all users
  const { data: teachers = [], isLoading: teachersLoading } = useQuery({
    queryKey: ['/api/users/role/teacher'],
  });

  const { data: students = [], isLoading: studentsLoading } = useQuery({
    queryKey: ['/api/users/role/student'],
  });

  // Fetch all courses
  const { data: courses = [], isLoading: coursesLoading } = useQuery({
    queryKey: ['/api/courses'],
  });

  // Fetch institutions
  const { data: institutions = [], isLoading: institutionsLoading } = useQuery({
    queryKey: ['/api/institutions'],
  });

  const isLoading = teachersLoading || studentsLoading || coursesLoading || institutionsLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-6">
            <LoadingSpinner size="lg" text="Loading admin dashboard..." />
          </main>
        </div>
      </div>
    );
  }

  const totalUsers = teachers.length + students.length;
  const activeCourses = courses.filter(course => course.isActive).length;
  const totalInstitutions = institutions.length;
  const growthRate = 12.5; // This would be calculated from actual data

  const stats = [
    {
      title: "Total Users",
      value: totalUsers.toString(),
      icon: Users,
      trend: "+12% this month",
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Active Courses",
      value: activeCourses.toString(),
      icon: BookOpen,
      trend: `${courses.length} total courses`,
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      title: "Institutions",
      value: totalInstitutions.toString(),
      icon: Building,
      trend: "All regions covered",
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      title: "Growth Rate",
      value: `${growthRate}%`,
      icon: TrendingUp,
      trend: "Monthly growth",
      color: "text-success",
      bgColor: "bg-success/10",
    },
  ];

  const recentRegistrations = [...teachers, ...students]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const topCourses = courses
    .sort((a, b) => Math.random() - 0.5) // Random sort for demo
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          {/* Dashboard Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-foreground" data-testid="dashboard-title">
              Admin Dashboard
            </h2>
            <p className="text-muted-foreground mt-2">
              System-wide overview and management tools for {user?.firstName}.
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Performance Chart */}
            <PerformanceChart />

            {/* Recent Activity */}
            <RecentActivity userRole="admin" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Recent Registrations */}
            <Card className="dashboard-card">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Recent Registrations
                  <Badge variant="secondary">{recentRegistrations.length}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentRegistrations.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg" data-testid={`registration-${user.id}`}>
                      <div>
                        <h4 className="text-sm font-medium">{user.firstName} {user.lastName}</h4>
                        <p className="text-xs text-muted-foreground capitalize">{user.role} • {user.email}</p>
                      </div>
                      <Badge variant={user.role === 'teacher' ? 'default' : 'secondary'}>
                        {user.role}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Top Courses */}
            <Card className="dashboard-card">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Popular Courses
                  <Link href="/courses">
                    <Button variant="outline" size="sm">
                      View All
                    </Button>
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topCourses.map((course) => (
                    <div key={course.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg" data-testid={`course-${course.id}`}>
                      <div>
                        <h4 className="text-sm font-medium">{course.name}</h4>
                        <p className="text-xs text-muted-foreground">{course.code} • {course.gradeLevel}</p>
                      </div>
                      <Badge variant={course.isActive ? 'default' : 'secondary'}>
                        {course.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card className="dashboard-card">
            <CardHeader>
              <CardTitle>System Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link href="/users">
                  <Button className="w-full justify-start" variant="outline" data-testid="manage-users">
                    <Users className="mr-2 h-4 w-4" />
                    Manage Users
                  </Button>
                </Link>
                <Link href="/courses">
                  <Button className="w-full justify-start" variant="outline" data-testid="manage-courses">
                    <BookOpen className="mr-2 h-4 w-4" />
                    Manage Courses
                  </Button>
                </Link>
                <Link href="/reports">
                  <Button className="w-full justify-start" variant="outline" data-testid="view-reports">
                    <TrendingUp className="mr-2 h-4 w-4" />
                    View Reports
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
