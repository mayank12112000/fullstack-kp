import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { BookOpen, Download, Filter, Plus, Edit, Eye } from "lucide-react";
import Navbar from "../../components/layout/Navbar";
import Sidebar from "../../components/layout/Sidebar";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import { useAuth } from "../../hooks/useAuth";
import { coursesAPI, assignmentsAPI, submissionsAPI } from "../../lib/api";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorMessage from "../../components/common/ErrorMessage";

export default function GradebookPage() {
  const { user } = useAuth();
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [viewMode, setViewMode] = useState<"overview" | "detailed">("overview");

  // Fetch teacher's courses
  const { data: courses = [], isLoading: coursesLoading } = useQuery({
    queryKey: ['/api/courses/teacher', user?.id],
    enabled: !!user && user.role === 'teacher',
  });

  // Fetch students for selected course
  const { data: students = [], isLoading: studentsLoading } = useQuery({
    queryKey: ['/api/courses', selectedCourse, 'students'],
    enabled: !!selectedCourse,
  });

  // Fetch assignments for selected course
  const { data: assignments = [], isLoading: assignmentsLoading } = useQuery({
    queryKey: ['/api/assignments/course', selectedCourse],
    enabled: !!selectedCourse,
  });

  // Fetch all submissions for the course
  const { data: allSubmissions = [], isLoading: submissionsLoading } = useQuery({
    queryKey: ['/api/submissions/course', selectedCourse],
    enabled: !!selectedCourse && assignments.length > 0,
    queryFn: async () => {
      const submissions = [];
      for (const assignment of assignments) {
        const assignmentSubmissions = await submissionsAPI.getSubmissionsByAssignment(assignment.id);
        submissions.push(...assignmentSubmissions);
      }
      return submissions;
    },
  });

  const isLoading = coursesLoading || studentsLoading || assignmentsLoading || submissionsLoading;

  if (!user || user.role !== 'teacher') {
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
                  Only teachers can access the gradebook.
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
            <LoadingSpinner size="lg" text="Loading gradebook..." />
          </main>
        </div>
      </div>
    );
  }

  const getStudentGrade = (studentId: string, assignmentId: string) => {
    const submission = allSubmissions.find(
      s => s.studentId === studentId && s.assignmentId === assignmentId
    );
    return submission?.score ?? null;
  };

  const getStudentAverage = (studentId: string) => {
    const studentSubmissions = allSubmissions.filter(s => s.studentId === studentId && s.score !== null);
    if (studentSubmissions.length === 0) return null;
    
    const total = studentSubmissions.reduce((sum, s) => sum + (s.score || 0), 0);
    return Math.round(total / studentSubmissions.length);
  };

  const getAssignmentAverage = (assignmentId: string) => {
    const assignmentSubmissions = allSubmissions.filter(s => s.assignmentId === assignmentId && s.score !== null);
    if (assignmentSubmissions.length === 0) return null;
    
    const total = assignmentSubmissions.reduce((sum, s) => sum + (s.score || 0), 0);
    return Math.round(total / assignmentSubmissions.length);
  };

  const calculateLetterGrade = (percentage: number) => {
    if (percentage >= 90) return 'A';
    if (percentage >= 80) return 'B';
    if (percentage >= 70) return 'C';
    if (percentage >= 60) return 'D';
    return 'F';
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
              <h2 className="text-3xl font-bold text-foreground" data-testid="gradebook-title">
                Gradebook
              </h2>
              <p className="text-muted-foreground mt-2">
                Manage grades and track student performance across your courses.
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Select value={viewMode} onValueChange={(value: "overview" | "detailed") => setViewMode(value)}>
                <SelectTrigger className="w-40" data-testid="view-mode-select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="overview">Overview</SelectItem>
                  <SelectItem value="detailed">Detailed</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" data-testid="export-grades">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
              <Button className="gradient-primary text-white" data-testid="add-assignment">
                <Plus className="mr-2 h-4 w-4" />
                Add Assignment
              </Button>
            </div>
          </div>

          {/* Course Selection */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Filter className="mr-2 h-5 w-5" />
                Select Course
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                <SelectTrigger className="w-full md:w-96" data-testid="course-select">
                  <SelectValue placeholder="Choose a course to view grades" />
                </SelectTrigger>
                <SelectContent>
                  {courses.map(course => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.name} ({course.code}) - {course.gradeLevel}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {selectedCourse ? (
            <>
              {/* Course Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-foreground">{students.length}</div>
                    <div className="text-sm text-muted-foreground">Students</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-foreground">{assignments.length}</div>
                    <div className="text-sm text-muted-foreground">Assignments</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-foreground">
                      {allSubmissions.filter(s => s.status === 'graded').length}
                    </div>
                    <div className="text-sm text-muted-foreground">Graded</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-foreground">
                      {allSubmissions.filter(s => s.status === 'submitted').length}
                    </div>
                    <div className="text-sm text-muted-foreground">Pending</div>
                  </CardContent>
                </Card>
              </div>

              {/* Gradebook Table */}
              <Card>
                <CardHeader>
                  <CardTitle>
                    {courses.find(c => c.id === selectedCourse)?.name} - Grade Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {students.length === 0 ? (
                    <div className="text-center py-8">
                      <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No students enrolled</h3>
                      <p className="text-muted-foreground">
                        This course doesn't have any enrolled students yet.
                      </p>
                    </div>
                  ) : assignments.length === 0 ? (
                    <div className="text-center py-8">
                      <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No assignments created</h3>
                      <p className="text-muted-foreground">
                        Create assignments to start tracking student grades.
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-48">Student</TableHead>
                            {viewMode === "detailed" && assignments.map(assignment => (
                              <TableHead key={assignment.id} className="text-center min-w-24">
                                <div className="space-y-1">
                                  <div className="font-medium">{assignment.title}</div>
                                  <div className="text-xs text-muted-foreground">
                                    {assignment.maxScore} pts
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    Avg: {getAssignmentAverage(assignment.id) ?? 'N/A'}
                                  </div>
                                </div>
                              </TableHead>
                            ))}
                            <TableHead className="text-center">Average</TableHead>
                            <TableHead className="text-center">Letter Grade</TableHead>
                            <TableHead className="text-center">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {students.map(student => {
                            const average = getStudentAverage(student.id);
                            const letterGrade = average ? calculateLetterGrade(average) : 'N/A';
                            
                            return (
                              <TableRow key={student.id} data-testid={`student-${student.id}`}>
                                <TableCell className="font-medium">
                                  <div>
                                    <div>{student.firstName} {student.lastName}</div>
                                    <div className="text-sm text-muted-foreground">{student.email}</div>
                                  </div>
                                </TableCell>
                                {viewMode === "detailed" && assignments.map(assignment => {
                                  const grade = getStudentGrade(student.id, assignment.id);
                                  return (
                                    <TableCell key={assignment.id} className="text-center">
                                      {grade !== null ? (
                                        <div className="space-y-1">
                                          <div className="font-medium">{grade}</div>
                                          <div className="text-xs text-muted-foreground">
                                            {Math.round((grade / assignment.maxScore) * 100)}%
                                          </div>
                                        </div>
                                      ) : (
                                        <Badge variant="outline">Not graded</Badge>
                                      )}
                                    </TableCell>
                                  );
                                })}
                                <TableCell className="text-center">
                                  <div className="font-medium text-lg">
                                    {average ? `${average}%` : 'N/A'}
                                  </div>
                                </TableCell>
                                <TableCell className="text-center">
                                  <Badge 
                                    variant={
                                      letterGrade === 'A' || letterGrade === 'B' ? 'default' :
                                      letterGrade === 'C' ? 'secondary' :
                                      letterGrade === 'D' || letterGrade === 'F' ? 'destructive' : 'outline'
                                    }
                                  >
                                    {letterGrade}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-center">
                                  <div className="flex justify-center space-x-1">
                                    <Button size="sm" variant="outline" data-testid={`view-student-${student.id}`}>
                                      <Eye className="h-4 w-4" />
                                    </Button>
                                    <Button size="sm" variant="outline" data-testid={`edit-grades-${student.id}`}>
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Assignment Quick Stats */}
              {assignments.length > 0 && (
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Assignment Statistics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {assignments.map(assignment => {
                        const submissions = allSubmissions.filter(s => s.assignmentId === assignment.id);
                        const gradedSubmissions = submissions.filter(s => s.status === 'graded');
                        const average = getAssignmentAverage(assignment.id);
                        
                        return (
                          <Card key={assignment.id} className="p-4" data-testid={`assignment-stats-${assignment.id}`}>
                            <div className="space-y-2">
                              <h4 className="font-medium">{assignment.title}</h4>
                              <div className="grid grid-cols-2 gap-2 text-sm">
                                <div>
                                  <span className="text-muted-foreground">Submitted:</span>
                                  <span className="ml-1 font-medium">{submissions.length}/{students.length}</span>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Graded:</span>
                                  <span className="ml-1 font-medium">{gradedSubmissions.length}/{submissions.length}</span>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Average:</span>
                                  <span className="ml-1 font-medium">{average ?? 'N/A'}</span>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Max Points:</span>
                                  <span className="ml-1 font-medium">{assignment.maxScore}</span>
                                </div>
                              </div>
                            </div>
                          </Card>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Select a Course</h3>
                <p className="text-muted-foreground">
                  Choose a course from the dropdown above to view and manage grades.
                </p>
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </div>
  );
}
