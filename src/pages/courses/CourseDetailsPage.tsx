import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "wouter";
import { ArrowLeft, Users, Calendar, BookOpen, Edit, Settings } from "lucide-react";
import Navbar from "../../components/layout/Navbar";
import Sidebar from "../../components/layout/Sidebar";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { useAuth } from "../../hooks/useAuth";
import { coursesAPI, usersAPI, assignmentsAPI, materialsAPI, forumsAPI } from "../../lib/api";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorMessage from "../../components/common/ErrorMessage";

export default function CourseDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();

  // Fetch course details
  const { data: course, isLoading: courseLoading, error } = useQuery({
    queryKey: ['/api/courses', id],
    enabled: !!id,
  });

  // Fetch course teacher
  const { data: teacher, isLoading: teacherLoading } = useQuery({
    queryKey: ['/api/users', course?.teacherId],
    enabled: !!course?.teacherId,
  });

  // Fetch course students
  const { data: students = [], isLoading: studentsLoading } = useQuery({
    queryKey: ['/api/courses', id, 'students'],
    enabled: !!id,
  });

  // Fetch course assignments
  const { data: assignments = [], isLoading: assignmentsLoading } = useQuery({
    queryKey: ['/api/assignments/course', id],
    enabled: !!id,
  });

  // Fetch course materials
  const { data: materials = [], isLoading: materialsLoading } = useQuery({
    queryKey: ['/api/materials/course', id],
    enabled: !!id,
  });

  // Fetch course forums
  const { data: forums = [], isLoading: forumsLoading } = useQuery({
    queryKey: ['/api/forums/course', id],
    enabled: !!id,
  });

  const isLoading = courseLoading || teacherLoading || studentsLoading || assignmentsLoading || materialsLoading || forumsLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-6">
            <LoadingSpinner size="lg" text="Loading course details..." />
          </main>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-6">
            <ErrorMessage
              title="Course not found"
              message="The requested course could not be found or you don't have access to it."
            />
          </main>
        </div>
      </div>
    );
  }

  const isTeacher = user?.role === 'teacher' && course.teacherId === user.id;
  const isAdmin = user?.role === 'admin' || user?.role === 'institute_admin';
  const canEdit = isTeacher || isAdmin;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <Link href="/courses">
                <Button variant="ghost" size="sm" className="mr-4" data-testid="back-button">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Courses
                </Button>
              </Link>
              <div>
                <h2 className="text-3xl font-bold text-foreground" data-testid="course-title">
                  {course.name}
                </h2>
                <p className="text-muted-foreground mt-2 font-mono">
                  {course.code} • {course.gradeLevel} • {course.semester}
                </p>
              </div>
            </div>
            {canEdit && (
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" data-testid="edit-course">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Course
                </Button>
                <Button variant="outline" size="sm" data-testid="course-settings">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
              </div>
            )}
          </div>

          {/* Course Overview */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="flex items-center space-x-2">
                    <span>{course.name}</span>
                    <Badge variant={course.isActive ? "default" : "secondary"}>
                      {course.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </CardTitle>
                  <CardDescription className="mt-2">
                    {course.description || "No description available."}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Students</p>
                    <p className="text-lg font-semibold" data-testid="student-count">
                      {students.length}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                    <BookOpen className="h-6 w-6 text-success" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Credits</p>
                    <p className="text-lg font-semibold">{course.credits}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                    <Calendar className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Semester</p>
                    <p className="text-lg font-semibold">{course.semester}</p>
                  </div>
                </div>

                {teacher && (
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage src={teacher.avatar || undefined} />
                      <AvatarFallback>
                        {teacher.firstName[0]}{teacher.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm text-muted-foreground">Teacher</p>
                      <p className="text-lg font-semibold">
                        {teacher.firstName} {teacher.lastName}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Course Content Tabs */}
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview" data-testid="tab-overview">Overview</TabsTrigger>
              <TabsTrigger value="students" data-testid="tab-students">Students</TabsTrigger>
              <TabsTrigger value="assignments" data-testid="tab-assignments">Assignments</TabsTrigger>
              <TabsTrigger value="materials" data-testid="tab-materials">Materials</TabsTrigger>
              <TabsTrigger value="forums" data-testid="tab-forums">Discussions</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-muted-foreground text-center py-4">
                        No recent activity to display.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Course Statistics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Assignments</span>
                      <span className="font-medium">{assignments.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Course Materials</span>
                      <span className="font-medium">{materials.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Discussion Forums</span>
                      <span className="font-medium">{forums.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Enrolled Students</span>
                      <span className="font-medium">{students.length}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="students" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Enrolled Students ({students.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  {students.length === 0 ? (
                    <p className="text-muted-foreground text-center py-4">
                      No students enrolled in this course yet.
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {students.map((student) => (
                        <div key={student.id} className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg" data-testid={`student-${student.id}`}>
                          <Avatar>
                            <AvatarImage src={student.avatar || undefined} />
                            <AvatarFallback>
                              {student.firstName[0]}{student.lastName[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{student.firstName} {student.lastName}</p>
                            <p className="text-sm text-muted-foreground">{student.email}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="assignments" className="mt-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Assignments ({assignments.length})</CardTitle>
                    {canEdit && (
                      <Button size="sm" data-testid="create-assignment">
                        Create Assignment
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {assignments.length === 0 ? (
                    <p className="text-muted-foreground text-center py-4">
                      No assignments created for this course yet.
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {assignments.map((assignment) => (
                        <div key={assignment.id} className="flex items-center justify-between p-4 border rounded-lg" data-testid={`assignment-${assignment.id}`}>
                          <div>
                            <h4 className="font-medium">{assignment.title}</h4>
                            <p className="text-sm text-muted-foreground">
                              {assignment.type} • {assignment.maxScore} points
                            </p>
                          </div>
                          <Badge variant="outline">
                            {assignment.dueDate 
                              ? new Date(assignment.dueDate).toLocaleDateString()
                              : "No due date"}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="materials" className="mt-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Course Materials ({materials.length})</CardTitle>
                    {canEdit && (
                      <Button size="sm" data-testid="upload-material">
                        Upload Material
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {materials.length === 0 ? (
                    <p className="text-muted-foreground text-center py-4">
                      No course materials uploaded yet.
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {materials.map((material) => (
                        <div key={material.id} className="flex items-center justify-between p-4 border rounded-lg" data-testid={`material-${material.id}`}>
                          <div>
                            <h4 className="font-medium">{material.title}</h4>
                            <p className="text-sm text-muted-foreground">
                              {material.type} • {material.fileSize ? `${Math.round(material.fileSize / 1024)} KB` : 'Size unknown'}
                            </p>
                          </div>
                          <Button variant="outline" size="sm">
                            Download
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="forums" className="mt-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Discussion Forums ({forums.length})</CardTitle>
                    {canEdit && (
                      <Button size="sm" data-testid="create-forum">
                        Create Forum
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {forums.length === 0 ? (
                    <p className="text-muted-foreground text-center py-4">
                      No discussion forums created yet.
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {forums.map((forum) => (
                        <div key={forum.id} className="p-4 border rounded-lg" data-testid={`forum-${forum.id}`}>
                          <h4 className="font-medium mb-2">{forum.title}</h4>
                          <p className="text-sm text-muted-foreground mb-2">
                            {forum.description}
                          </p>
                          <Button variant="outline" size="sm">
                            View Discussions
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}
