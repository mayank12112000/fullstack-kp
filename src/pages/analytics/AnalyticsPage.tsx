import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { BarChart3, TrendingUp, Users, BookOpen, Calendar, Download } from "lucide-react";
import Navbar from "../../components/layout/Navbar";
import Sidebar from "../../components/layout/Sidebar";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Progress } from "../../components/ui/progress";
import { Badge } from "../../components/ui/badge";
import { useAuth } from "../../hooks/useAuth";
import { coursesAPI, attendanceAPI, submissionsAPI } from "../../lib/api";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import PerformanceChart from "../../components/dashboard/PerformanceChart";

export default function AnalyticsPage() {
  const { user } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState("30");
  const [selectedCourse, setSelectedCourse] = useState<string>("all");

  // Fetch user's courses
  const { data: courses = [], isLoading: coursesLoading } = useQuery({
    queryKey: user?.role === 'teacher' 
      ? ['/api/courses/teacher', user.id]
      : ['/api/courses'],
    enabled: !!user && (user.role === 'teacher' || user.role === 'admin' || user.role === 'institute_admin'),
  });

  // Fetch analytics data based on user role and selected filters
  const { data: analyticsData, isLoading: analyticsLoading } = useQuery({
    queryKey: ['/api/analytics', user?.role, selectedPeriod, selectedCourse],
    enabled: !!user,
    queryFn: async () => {
      // In a real application, this would fetch comprehensive analytics data
      // For now, we'll return mock data structure
      return {
        overview: {
          totalStudents: 127,
          activeCourses: 8,
          averageAttendance: 94,
          averageGrade: 87,
        },
        attendance: {
          trend: [
            { date: '2024-01-01', rate: 92 },
            { date: '2024-01-08', rate: 94 },
            { date: '2024-01-15', rate: 91 },
            { date: '2024-01-22', rate: 96 },
          ],
          byClass: courses.map(course => ({
            courseId: course.id,
            courseName: course.name,
            rate: Math.floor(Math.random() * 20) + 80,
          })),
        },
        performance: {
          gradeDistribution: [
            { grade: 'A', count: 25 },
            { grade: 'B', count: 45 },
            { grade: 'C', count: 35 },
            { grade: 'D', count: 15 },
            { grade: 'F', count: 7 },
          ],
          coursePerformance: courses.map(course => ({
            courseId: course.id,
            courseName: course.name,
            averageGrade: Math.floor(Math.random() * 20) + 75,
            completionRate: Math.floor(Math.random() * 30) + 70,
          })),
        },
      };
    },
  });

  const isLoading = coursesLoading || analyticsLoading;

  if (!user || !['teacher', 'admin', 'institute_admin'].includes(user.role)) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-6">
            <Card className="max-w-2xl mx-auto">
              <CardContent className="pt-6 text-center">
                <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
                <p className="text-muted-foreground">
                  You don't have permission to view analytics.
                </p>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-6">
            <LoadingSpinner size="lg" text="Loading analytics..." />
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-foreground" data-testid="analytics-title">
                Analytics Dashboard
              </h2>
              <p className="text-muted-foreground mt-2">
                Comprehensive insights into student performance and course effectiveness.
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-40" data-testid="period-select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">Last 7 days</SelectItem>
                  <SelectItem value="30">Last 30 days</SelectItem>
                  <SelectItem value="90">Last 3 months</SelectItem>
                  <SelectItem value="365">Last year</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                <SelectTrigger className="w-48" data-testid="course-filter">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Courses</SelectItem>
                  {courses.map(course => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline" data-testid="export-data">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>

          {/* Overview Stats */}
          {analyticsData && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Students</p>
                      <p className="text-3xl font-bold text-foreground" data-testid="total-students">
                        {analyticsData.overview.totalStudents}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Active Courses</p>
                      <p className="text-3xl font-bold text-foreground" data-testid="active-courses">
                        {analyticsData.overview.activeCourses}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                      <BookOpen className="h-6 w-6 text-success" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Avg. Attendance</p>
                      <p className="text-3xl font-bold text-foreground" data-testid="avg-attendance">
                        {analyticsData.overview.averageAttendance}%
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                      <Calendar className="h-6 w-6 text-accent" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Avg. Grade</p>
                      <p className="text-3xl font-bold text-foreground" data-testid="avg-grade">
                        {analyticsData.overview.averageGrade}%
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
                      <TrendingUp className="h-6 w-6 text-secondary" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Analytics Tabs */}
          <Tabs defaultValue="performance" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="performance" data-testid="tab-performance">Performance</TabsTrigger>
              <TabsTrigger value="attendance" data-testid="tab-attendance">Attendance</TabsTrigger>
              <TabsTrigger value="engagement" data-testid="tab-engagement">Engagement</TabsTrigger>
            </TabsList>

            <TabsContent value="performance" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <PerformanceChart />
                
                <Card>
                  <CardHeader>
                    <CardTitle>Grade Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {analyticsData?.performance.gradeDistribution.map(grade => (
                      <div key={grade.grade} className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className={`w-4 h-4 rounded-full ${
                            grade.grade === 'A' ? 'bg-success' :
                            grade.grade === 'B' ? 'bg-primary' :
                            grade.grade === 'C' ? 'bg-accent' :
                            grade.grade === 'D' ? 'bg-warning' : 'bg-destructive'
                          }`} />
                          <span className="font-medium">Grade {grade.grade}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-muted-foreground">{grade.count} students</span>
                          <Badge variant="outline">
                            {Math.round((grade.count / analyticsData.overview.totalStudents) * 100)}%
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Course Performance Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {analyticsData?.performance.coursePerformance.map(course => (
                      <div key={course.courseId} className="space-y-2" data-testid={`course-performance-${course.courseId}`}>
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{course.courseName}</h4>
                          <div className="flex items-center space-x-4 text-sm">
                            <span className="text-muted-foreground">
                              Avg: {course.averageGrade}%
                            </span>
                            <span className="text-muted-foreground">
                              Completion: {course.completionRate}%
                            </span>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="text-xs text-muted-foreground mb-1">Average Grade</div>
                            <Progress value={course.averageGrade} className="h-2" />
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground mb-1">Completion Rate</div>
                            <Progress value={course.completionRate} className="h-2" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="attendance" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Attendance Trends</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {analyticsData?.attendance.trend.map((data, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-sm">{new Date(data.date).toLocaleDateString()}</span>
                          <div className="flex items-center space-x-2">
                            <Progress value={data.rate} className="w-24 h-2" />
                            <span className="text-sm font-medium">{data.rate}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Attendance by Course</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {analyticsData?.attendance.byClass.map(course => (
                        <div key={course.courseId} className="flex items-center justify-between" data-testid={`attendance-${course.courseId}`}>
                          <span className="text-sm font-medium">{course.courseName}</span>
                          <div className="flex items-center space-x-2">
                            <Progress value={course.rate} className="w-24 h-2" />
                            <Badge variant={course.rate >= 90 ? 'default' : course.rate >= 80 ? 'secondary' : 'destructive'}>
                              {course.rate}%
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="engagement" className="space-y-6 mt-6">
              <Card>
                <CardContent className="text-center py-12">
                  <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Engagement Analytics</h3>
                  <p className="text-muted-foreground">
                    Detailed engagement metrics will be available soon.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}
