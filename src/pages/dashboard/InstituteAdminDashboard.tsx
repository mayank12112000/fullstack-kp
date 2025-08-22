import { useQuery } from "@tanstack/react-query";
import { Users, BookOpen, Building, Settings } from "lucide-react";
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
import { Progress } from "../../components/ui/progress";
import { Link } from "wouter";

export default function InstituteAdminDashboard() {
  const { user } = useAuth();

  // Fetch institution data
  const { data: institutions = [], isLoading: institutionsLoading } = useQuery({
    queryKey: ['/api/institutions'],
  });

  // For demo purposes, assume user is admin of first institution
  const userInstitution = institutions[0];

  // Fetch users for this institution
  const { data: teachers = [], isLoading: teachersLoading } = useQuery({
    queryKey: ['/api/users/role/teacher'],
  });

  const { data: students = [], isLoading: studentsLoading } = useQuery({
    queryKey: ['/api/users/role/student'],
  });

  // Fetch courses for this institution
  const { data: allCourses = [], isLoading: coursesLoading } = useQuery({
    queryKey: ['/api/courses'],
  });

  // Filter courses for this institution
  const institutionCourses = allCourses.filter(course => course.institutionId === userInstitution?.id);

  const isLoading = institutionsLoading || teachersLoading || studentsLoading || coursesLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-6">
            <LoadingSpinner size="lg" text="Loading institute dashboard..." />
          </main>
        </div>
      </div>
    );
  }

  const totalTeachers = teachers.length;
  const totalStudents = students.length;
  const activeCourses = institutionCourses.filter(course => course.isActive).length;
  const totalDepartments = 8; // This would come from actual data

  const stats = [
    {
      title: "Faculty Members",
      value: totalTeachers.toString(),
      icon: Users,
      trend: "+3 new this month",
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Students Enrolled",
      value: totalStudents.toString(),
      icon: Users,
      trend: "+127 this semester",
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      title: "Active Courses",
      value: activeCourses.toString(),
      icon: BookOpen,
      trend: `${institutionCourses.length} total`,
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      title: "Departments",
      value: totalDepartments.toString(),
      icon: Building,
      trend: "All operational",
      color: "text-secondary",
      bgColor: "bg-secondary/10",
    },
  ];

  const departments = [
    { name: "Computer Science", students: 1200, courses: 45, completion: 87 },
    { name: "Mathematics", students: 890, courses: 32, completion: 92 },
    { name: "Engineering", students: 1560, courses: 67, completion: 78 },
    { name: "Business", students: 780, courses: 28, completion: 85 },
    { name: "Arts & Sciences", students: 650, courses: 41, completion: 91 },
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
              Institute Dashboard
            </h2>
            <p className="text-muted-foreground mt-2">
              {userInstitution?.name} - Administrative overview for {user?.firstName}
            </p>
          </div>

          {/* Institution Info Card */}
          <Card className="dashboard-card mb-8">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {userInstitution?.name || "Institution Name"}
                <Link href="/settings">
                  <Button variant="outline" size="sm" data-testid="manage-institution">
                    <Settings className="mr-2 h-4 w-4" />
                    Manage
                  </Button>
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Code</p>
                  <p className="font-medium">{userInstitution?.code || "INST001"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Contact</p>
                  <p className="font-medium">{userInstitution?.email || "admin@institution.edu"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Phone</p>
                  <p className="font-medium">{userInstitution?.phone || "+1-555-0123"}</p>
                </div>
              </div>
            </CardContent>
          </Card>

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
            <RecentActivity userRole="institute_admin" />
          </div>

          {/* Department Overview */}
          <Card className="dashboard-card mb-8">
            <CardHeader>
              <CardTitle>Department Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {departments.map((dept, index) => (
                  <div key={index} className="space-y-2" data-testid={`department-${index}`}>
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{dept.name}</h4>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span>{dept.students} students</span>
                        <span>{dept.courses} courses</span>
                        <span>{dept.completion}% completion</span>
                      </div>
                    </div>
                    <Progress value={dept.completion} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="dashboard-card">
            <CardHeader>
              <CardTitle>Institute Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Link href="/users">
                  <Button className="w-full justify-start" variant="outline" data-testid="manage-faculty">
                    <Users className="mr-2 h-4 w-4" />
                    Manage Faculty
                  </Button>
                </Link>
                <Link href="/courses">
                  <Button className="w-full justify-start" variant="outline" data-testid="course-catalog">
                    <BookOpen className="mr-2 h-4 w-4" />
                    Course Catalog
                  </Button>
                </Link>
                <Link href="/reports">
                  <Button className="w-full justify-start" variant="outline" data-testid="analytics-reports">
                    <Building className="mr-2 h-4 w-4" />
                    Analytics & Reports
                  </Button>
                </Link>
                <Link href="/settings">
                  <Button className="w-full justify-start" variant="outline" data-testid="institute-settings">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
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
