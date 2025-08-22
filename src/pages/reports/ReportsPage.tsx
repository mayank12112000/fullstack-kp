import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Download, FileText, BarChart3, Users, Calendar, Filter, TrendingUp } from "lucide-react";
import Navbar from "../../components/layout/Navbar";
import Sidebar from "../../components/layout/Sidebar";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Badge } from "../../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Progress } from "../../components/ui/progress";
import { useAuth } from "../../hooks/useAuth";
import { coursesAPI, usersAPI } from "../../lib/api";
import LoadingSpinner from "../../components/common/LoadingSpinner";

export default function ReportsPage() {
  const { user } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState("semester");
  const [selectedCourse, setSelectedCourse] = useState("all");
  const [reportType, setReportType] = useState("overview");

  // Fetch courses based on user role
  const { data: courses = [], isLoading: coursesLoading } = useQuery({
    queryKey: user?.role === 'teacher' 
      ? ['/api/courses/teacher', user.id]
      : ['/api/courses'],
    enabled: !!user && (user.role === 'teacher' || user.role === 'admin' || user.role === 'institute_admin'),
  });

  // Fetch users for admin reports
  const { data: teachers = [] } = useQuery({
    queryKey: ['/api/users/role/teacher'],
    enabled: !!user && (user.role === 'admin' || user.role === 'institute_admin'),
  });

  const { data: students = [] } = useQuery({
    queryKey: ['/api/users/role/student'],
    enabled: !!user && (user.role === 'admin' || user.role === 'institute_admin'),
  });

  const isLoading = coursesLoading;

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
                  You don't have permission to view reports.
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
            <LoadingSpinner size="lg" text="Loading reports..." />
          </main>
        </div>
      </div>
    );
  }

  // Mock report data - in real app, this would come from API
  const generateMockData = () => ({
    overview: {
      totalStudents: students.length || 127,
      totalTeachers: teachers.length || 15,
      activeCourses: courses.filter(c => c.isActive).length || 8,
      completionRate: 87,
    },
    performance: {
      averageGrade: 85,
      attendanceRate: 92,
      assignmentCompletion: 89,
      trends: [
        { month: 'Jan', grade: 82, attendance: 90 },
        { month: 'Feb', grade: 84, attendance: 91 },
        { month: 'Mar', grade: 85, attendance: 92 },
        { month: 'Apr', grade: 87, attendance: 94 },
      ],
    },
    courses: courses.map(course => ({
      ...course,
      enrollment: Math.floor(Math.random() * 30) + 10,
      averageGrade: Math.floor(Math.random() * 20) + 75,
      completionRate: Math.floor(Math.random() * 30) + 70,
    })),
  });

  const reportData = generateMockData();

  const handleExportReport = (type: string) => {
    // In a real application, this would trigger a report export
    console.log(`Exporting ${type} report`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-foreground" data-testid="reports-title">
                Reports & Analytics
              </h2>
              <p className="text-muted-foreground mt-2">
                Comprehensive reporting tools for academic performance and institutional insights.
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-40" data-testid="period-select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="semester">This Semester</SelectItem>
                  <SelectItem value="year">This Year</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
              <Button 
                variant="outline" 
                onClick={() => handleExportReport('summary')}
                data-testid="export-summary"
              >
                <Download className="mr-2 h-4 w-4" />
                Export Summary
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Students</p>
                    <p className="text-3xl font-bold text-foreground" data-testid="total-students">
                      {reportData.overview.totalStudents}
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
                      {reportData.overview.activeCourses}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                    <FileText className="h-6 w-6 text-success" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Avg. Performance</p>
                    <p className="text-3xl font-bold text-foreground" data-testid="avg-performance">
                      {reportData.performance.averageGrade}%
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-accent" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Completion Rate</p>
                    <p className="text-3xl font-bold text-foreground" data-testid="completion-rate">
                      {reportData.overview.completionRate}%
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
                    <BarChart3 className="h-6 w-6 text-secondary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Report Tabs */}
          <Tabs defaultValue="academic" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="academic" data-testid="tab-academic">Academic Performance</TabsTrigger>
              <TabsTrigger value="attendance" data-testid="tab-attendance">Attendance</TabsTrigger>
              <TabsTrigger value="courses" data-testid="tab-courses">Course Analytics</TabsTrigger>
              <TabsTrigger value="custom" data-testid="tab-custom">Custom Reports</TabsTrigger>
            </TabsList>

            <TabsContent value="academic" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Grade Distribution</CardTitle>
                    <CardDescription>Overall grade distribution across all courses</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { grade: 'A (90-100%)', count: 45, percentage: 35 },
                        { grade: 'B (80-89%)', count: 52, percentage: 41 },
                        { grade: 'C (70-79%)', count: 25, percentage: 20 },
                        { grade: 'D (60-69%)', count: 4, percentage: 3 },
                        { grade: 'F (0-59%)', count: 1, percentage: 1 },
                      ].map((item, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>{item.grade}</span>
                            <span>{item.count} students ({item.percentage}%)</span>
                          </div>
                          <Progress value={item.percentage} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Performance Trends</CardTitle>
                    <CardDescription>Monthly performance overview</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {reportData.performance.trends.map((trend, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-sm font-medium">{trend.month}</span>
                          <div className="flex items-center space-x-4">
                            <div className="text-sm">
                              Grade: <Badge variant="outline">{trend.grade}%</Badge>
                            </div>
                            <div className="text-sm">
                              Attendance: <Badge variant="outline">{trend.attendance}%</Badge>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Course Performance Summary</CardTitle>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleExportReport('academic')}
                      data-testid="export-academic"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Export
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {reportData.courses.slice(0, 5).map((course, index) => (
                      <div key={course.id} className="flex items-center justify-between p-4 border rounded-lg" data-testid={`course-report-${index}`}>
                        <div className="flex-1">
                          <h4 className="font-medium">{course.name}</h4>
                          <p className="text-sm text-muted-foreground">{course.code} • {course.gradeLevel}</p>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div className="text-center">
                            <div className="font-medium">{course.enrollment}</div>
                            <div className="text-muted-foreground">Students</div>
                          </div>
                          <div className="text-center">
                            <div className="font-medium">{course.averageGrade}%</div>
                            <div className="text-muted-foreground">Avg Grade</div>
                          </div>
                          <div className="text-center">
                            <div className="font-medium">{course.completionRate}%</div>
                            <div className="text-muted-foreground">Completion</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="attendance" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Attendance Analytics</CardTitle>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleExportReport('attendance')}
                      data-testid="export-attendance"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Export
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-success">92%</div>
                      <div className="text-sm text-muted-foreground">Overall Attendance</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-warning">5%</div>
                      <div className="text-sm text-muted-foreground">Late Arrivals</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-destructive">3%</div>
                      <div className="text-sm text-muted-foreground">Absences</div>
                    </div>
                  </div>
                  
                  <div className="mt-6 space-y-4">
                    <h4 className="font-medium">Course Attendance Breakdown</h4>
                    {reportData.courses.slice(0, 4).map((course, index) => (
                      <div key={course.id} className="flex items-center justify-between">
                        <span className="text-sm">{course.name}</span>
                        <div className="flex items-center space-x-2">
                          <Progress value={Math.floor(Math.random() * 20) + 80} className="w-32 h-2" />
                          <span className="text-sm font-medium">{Math.floor(Math.random() * 20) + 80}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="courses" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Course Analytics Dashboard</CardTitle>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleExportReport('courses')}
                      data-testid="export-courses"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Export
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-4">Course Enrollment Trends</h4>
                      <div className="space-y-3">
                        {reportData.courses.map((course, index) => (
                          <div key={course.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                            <div>
                              <div className="font-medium">{course.name}</div>
                              <div className="text-sm text-muted-foreground">{course.code}</div>
                            </div>
                            <Badge variant="outline">{course.enrollment} students</Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-4">Resource Utilization</h4>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Assignment Submissions</span>
                            <span>87%</span>
                          </div>
                          <Progress value={87} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Forum Participation</span>
                            <span>73%</span>
                          </div>
                          <Progress value={73} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Material Downloads</span>
                            <span>95%</span>
                          </div>
                          <Progress value={95} className="h-2" />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="custom" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Custom Report Builder</CardTitle>
                  <CardDescription>Create custom reports with specific parameters</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Report Type</label>
                      <Select value={reportType} onValueChange={setReportType}>
                        <SelectTrigger data-testid="report-type-select">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="overview">Overview</SelectItem>
                          <SelectItem value="detailed">Detailed</SelectItem>
                          <SelectItem value="summary">Summary</SelectItem>
                          <SelectItem value="comparative">Comparative</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-2 block">Course</label>
                      <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                        <SelectTrigger data-testid="report-course-select">
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
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-2 block">Period</label>
                      <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                        <SelectTrigger data-testid="report-period-select">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="week">This Week</SelectItem>
                          <SelectItem value="month">This Month</SelectItem>
                          <SelectItem value="semester">This Semester</SelectItem>
                          <SelectItem value="year">This Year</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex items-end">
                      <Button 
                        className="w-full gradient-primary text-white"
                        onClick={() => handleExportReport('custom')}
                        data-testid="generate-custom-report"
                      >
                        Generate Report
                      </Button>
                    </div>
                  </div>
                  
                  <div className="text-center py-8 border-2 border-dashed border-muted-foreground/20 rounded-lg">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Report Preview</h3>
                    <p className="text-muted-foreground">
                      Select parameters above and click "Generate Report" to preview your custom report.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}
