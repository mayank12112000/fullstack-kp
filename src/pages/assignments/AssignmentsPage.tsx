import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Plus, Search, Filter, FileText, Calendar, Clock, CheckCircle } from "lucide-react";
import Navbar from "../../components/layout/Navbar";
import Sidebar from "../../components/layout/Sidebar";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { useAuth } from "../../hooks/useAuth";
import { coursesAPI, assignmentsAPI, submissionsAPI } from "../../lib/api";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorMessage from "../../components/common/ErrorMessage";

export default function AssignmentsPage() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [courseFilter, setCourseFilter] = useState("all");

  // Fetch user's courses
  const { data: courses = [], isLoading: coursesLoading } = useQuery({
    queryKey: user?.role === 'teacher' 
      ? ['/api/courses/teacher', user.id]
      : user?.role === 'student'
      ? ['/api/students', user.id, 'courses']
      : ['/api/courses'],
    enabled: !!user,
  });

  // Fetch assignments based on user role
  const { data: assignments = [], isLoading: assignmentsLoading, error, refetch } = useQuery({
    queryKey: ['/api/assignments', user?.role, user?.id],
    enabled: !!user && courses.length > 0,
    queryFn: async () => {
      if (user?.role === 'student') {
        // For students, fetch assignments from their enrolled courses
        const allAssignments = [];
        for (const course of courses) {
          const courseAssignments = await assignmentsAPI.getAssignmentsByCourse(course.id);
          allAssignments.push(...courseAssignments);
        }
        return allAssignments;
      } else {
        // For teachers/admins, fetch assignments from their courses
        const allAssignments = [];
        for (const course of courses) {
          const courseAssignments = await assignmentsAPI.getAssignmentsByCourse(course.id);
          allAssignments.push(...courseAssignments);
        }
        return allAssignments;
      }
    },
  });

  // Fetch student submissions if user is a student
  const { data: submissions = [] } = useQuery({
    queryKey: ['/api/submissions/student', user?.id],
    enabled: !!user && user.role === 'student',
  });

  const isLoading = coursesLoading || assignmentsLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-6">
            <LoadingSpinner size="lg" text="Loading assignments..." />
          </main>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-6">
            <ErrorMessage
              title="Error loading assignments"
              message="Unable to load assignments. Please try again."
              onRetry={() => refetch()}
            />
          </main>
        </div>
      </div>
    );
  }

  // Filter assignments
  const filteredAssignments = assignments.filter(assignment => {
    const matchesSearch = assignment.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCourse = courseFilter === "all" || assignment.courseId === courseFilter;
    
    let matchesStatus = true;
    if (user?.role === 'student') {
      const submission = submissions.find(s => s.assignmentId === assignment.id);
      if (statusFilter === "submitted") {
        matchesStatus = !!submission && submission.status === 'submitted';
      } else if (statusFilter === "graded") {
        matchesStatus = !!submission && submission.status === 'graded';
      } else if (statusFilter === "pending") {
        matchesStatus = !submission || submission.status === 'draft';
      }
    } else {
      if (statusFilter === "active") {
        matchesStatus = assignment.isActive;
      } else if (statusFilter === "inactive") {
        matchesStatus = !assignment.isActive;
      }
    }
    
    return matchesSearch && matchesCourse && matchesStatus;
  });

  const getAssignmentStatus = (assignment: any) => {
    if (user?.role === 'student') {
      const submission = submissions.find(s => s.assignmentId === assignment.id);
      if (!submission) return 'pending';
      return submission.status;
    }
    return assignment.isActive ? 'active' : 'inactive';
  };

  const getCourseForAssignment = (assignmentId: string) => {
    const assignment = assignments.find(a => a.id === assignmentId);
    return courses.find(c => c.id === assignment?.courseId);
  };

  const canCreateAssignments = user?.role === 'teacher' || user?.role === 'admin' || user?.role === 'institute_admin';

  // Categorize assignments for student view
  const pendingAssignments = user?.role === 'student' 
    ? filteredAssignments.filter(a => !submissions.find(s => s.assignmentId === a.id))
    : [];
  
  const submittedAssignments = user?.role === 'student'
    ? filteredAssignments.filter(a => {
        const submission = submissions.find(s => s.assignmentId === a.id);
        return submission && (submission.status === 'submitted' || submission.status === 'graded');
      })
    : [];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-foreground" data-testid="assignments-title">
                {user?.role === 'student' ? 'My Assignments' : 'Assignment Management'}
              </h2>
              <p className="text-muted-foreground mt-2">
                {user?.role === 'student' 
                  ? 'View and submit your course assignments'
                  : 'Create and manage assignments for your courses'}
              </p>
            </div>
            {canCreateAssignments && (
              <Button className="gradient-primary text-white" data-testid="create-assignment">
                <Plus className="mr-2 h-4 w-4" />
                Create Assignment
              </Button>
            )}
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Search & Filter</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search assignments..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                      data-testid="search-input"
                    />
                  </div>
                </div>
                <Select value={courseFilter} onValueChange={setCourseFilter}>
                  <SelectTrigger className="w-full md:w-48" data-testid="course-filter">
                    <SelectValue placeholder="All Courses" />
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
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full md:w-48" data-testid="status-filter">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    {user?.role === 'student' ? (
                      <>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="submitted">Submitted</SelectItem>
                        <SelectItem value="graded">Graded</SelectItem>
                      </>
                    ) : (
                      <>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Assignment Lists */}
          {user?.role === 'student' ? (
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="all" data-testid="tab-all">All Assignments</TabsTrigger>
                <TabsTrigger value="pending" data-testid="tab-pending">
                  Pending ({pendingAssignments.length})
                </TabsTrigger>
                <TabsTrigger value="submitted" data-testid="tab-submitted">
                  Submitted ({submittedAssignments.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="mt-6">
                <AssignmentGrid 
                  assignments={filteredAssignments} 
                  courses={courses} 
                  submissions={submissions}
                  userRole={user.role}
                />
              </TabsContent>

              <TabsContent value="pending" className="mt-6">
                <AssignmentGrid 
                  assignments={pendingAssignments} 
                  courses={courses} 
                  submissions={submissions}
                  userRole={user.role}
                />
              </TabsContent>

              <TabsContent value="submitted" className="mt-6">
                <AssignmentGrid 
                  assignments={submittedAssignments} 
                  courses={courses} 
                  submissions={submissions}
                  userRole={user.role}
                />
              </TabsContent>
            </Tabs>
          ) : (
            <AssignmentGrid 
              assignments={filteredAssignments} 
              courses={courses} 
              submissions={[]}
              userRole={user.role}
            />
          )}
        </main>
      </div>
    </div>
  );
}

// Component for displaying assignment grid
function AssignmentGrid({ 
  assignments, 
  courses, 
  submissions, 
  userRole 
}: { 
  assignments: any[], 
  courses: any[], 
  submissions: any[], 
  userRole: string 
}) {
  if (assignments.length === 0) {
    return (
      <Card className="dashboard-card text-center py-12">
        <CardContent>
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No assignments found</h3>
          <p className="text-muted-foreground">
            {userRole === 'student' 
              ? "No assignments match your current filters."
              : "Create your first assignment to get started."}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {assignments.map((assignment) => {
        const course = courses.find(c => c.id === assignment.courseId);
        const submission = userRole === 'student' 
          ? submissions.find(s => s.assignmentId === assignment.id)
          : null;
        
        const status = userRole === 'student' 
          ? (submission ? submission.status : 'pending')
          : (assignment.isActive ? 'active' : 'inactive');

        const isOverdue = assignment.dueDate && new Date(assignment.dueDate) < new Date();

        return (
          <Card key={assignment.id} className="card-hover dashboard-card" data-testid={`assignment-${assignment.id}`}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-1">{assignment.title}</CardTitle>
                  <CardDescription>
                    {course?.name} ({course?.code})
                  </CardDescription>
                </div>
                <Badge 
                  variant={
                    status === 'graded' ? 'default' :
                    status === 'submitted' ? 'secondary' :
                    status === 'pending' ? 'outline' :
                    status === 'active' ? 'default' : 'secondary'
                  }
                  className={`status-${status}`}
                >
                  {status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {assignment.description && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {assignment.description}
                </p>
              )}
              
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center">
                  <FileText className="h-4 w-4 mr-1" />
                  <span>{assignment.type}</span>
                </div>
                <div className="flex items-center">
                  <span>{assignment.maxScore} points</span>
                </div>
              </div>

              {assignment.dueDate && (
                <div className={`flex items-center text-sm ${isOverdue ? 'text-destructive' : 'text-muted-foreground'}`}>
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                  {isOverdue && <Clock className="h-4 w-4 ml-2" />}
                </div>
              )}

              {userRole === 'student' && submission && submission.score !== null && (
                <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                  <span className="text-sm font-medium">Score:</span>
                  <Badge variant="default">
                    {submission.score}/{assignment.maxScore}
                  </Badge>
                </div>
              )}

              <div className="flex space-x-2 pt-2">
                <Button size="sm" variant="outline" className="flex-1" data-testid={`view-assignment-${assignment.id}`}>
                  View Details
                </Button>
                {userRole === 'student' && !submission && (
                  <Button size="sm" className="flex-1" data-testid={`submit-assignment-${assignment.id}`}>
                    Submit
                  </Button>
                )}
                {userRole !== 'student' && (
                  <Button size="sm" variant="outline" data-testid={`edit-assignment-${assignment.id}`}>
                    Edit
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
