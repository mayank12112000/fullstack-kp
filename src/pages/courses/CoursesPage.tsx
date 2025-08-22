import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Plus, Search, Filter, BookOpen, Users, Calendar } from "lucide-react";
import Navbar from "../../components/layout/Navbar";
import Sidebar from "../../components/layout/Sidebar";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { useAuth } from "../../hooks/useAuth";
import { coursesAPI } from "../../lib/api";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorMessage from "../../components/common/ErrorMessage";

export default function CoursesPage() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [gradeFilter, setGradeFilter] = useState("all");
  const [semesterFilter, setSemesterFilter] = useState("all");

  // Fetch courses based on user role
  const queryKey = user?.role === 'teacher' 
    ? ['/api/courses/teacher', user.id]
    : user?.role === 'student'
    ? ['/api/students', user.id, 'courses']
    : ['/api/courses'];

  const { data: courses = [], isLoading, error, refetch } = useQuery({
    queryKey,
    enabled: !!user,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-6">
            <LoadingSpinner size="lg" text="Loading courses..." />
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
              title="Error loading courses"
              message="Unable to load courses. Please try again."
              onRetry={() => refetch()}
            />
          </main>
        </div>
      </div>
    );
  }

  // Filter courses based on search and filters
  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGrade = gradeFilter === "all" || course.gradeLevel === gradeFilter;
    const matchesSemester = semesterFilter === "all" || course.semester === semesterFilter;
    
    return matchesSearch && matchesGrade && matchesSemester;
  });

  const canCreateCourses = user?.role === 'teacher' || user?.role === 'admin' || user?.role === 'institute_admin';

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-foreground" data-testid="courses-title">
                {user?.role === 'teacher' ? 'My Courses' : 
                 user?.role === 'student' ? 'Enrolled Courses' : 'All Courses'}
              </h2>
              <p className="text-muted-foreground mt-2">
                {user?.role === 'teacher' ? 'Manage and track your teaching courses' :
                 user?.role === 'student' ? 'Access your enrolled courses and materials' :
                 'Manage all courses in the system'}
              </p>
            </div>
            {canCreateCourses && (
              <Link href="/courses/create">
                <Button className="gradient-primary text-white" data-testid="create-course-button">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Course
                </Button>
              </Link>
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
                      placeholder="Search courses by name or code..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                      data-testid="search-input"
                    />
                  </div>
                </div>
                <Select value={gradeFilter} onValueChange={setGradeFilter}>
                  <SelectTrigger className="w-full md:w-48" data-testid="grade-filter">
                    <SelectValue placeholder="Grade Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Grades</SelectItem>
                    <SelectItem value="Grade 9">Grade 9</SelectItem>
                    <SelectItem value="Grade 10">Grade 10</SelectItem>
                    <SelectItem value="Grade 11">Grade 11</SelectItem>
                    <SelectItem value="Grade 12">Grade 12</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={semesterFilter} onValueChange={setSemesterFilter}>
                  <SelectTrigger className="w-full md:w-48" data-testid="semester-filter">
                    <SelectValue placeholder="Semester" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Semesters</SelectItem>
                    <SelectItem value="Fall 2024">Fall 2024</SelectItem>
                    <SelectItem value="Spring 2024">Spring 2024</SelectItem>
                    <SelectItem value="Summer 2024">Summer 2024</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Course Grid */}
          {filteredCourses.length === 0 ? (
            <Card className="dashboard-card text-center py-12">
              <CardContent>
                <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  {searchTerm || gradeFilter !== "all" || semesterFilter !== "all" 
                    ? "No courses found" 
                    : "No courses available"}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm || gradeFilter !== "all" || semesterFilter !== "all"
                    ? "Try adjusting your search criteria or filters."
                    : user?.role === 'teacher' 
                      ? "Create your first course to get started."
                      : "Check back later for available courses."}
                </p>
                {canCreateCourses && (
                  <Link href="/courses/create">
                    <Button className="gradient-primary text-white">
                      <Plus className="mr-2 h-4 w-4" />
                      Create Course
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <Card key={course.id} className="card-hover dashboard-card" data-testid={`course-${course.id}`}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-1">{course.name}</CardTitle>
                        <CardDescription className="font-mono text-sm">
                          {course.code}
                        </CardDescription>
                      </div>
                      <Badge variant={course.isActive ? "default" : "secondary"}>
                        {course.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {course.description || "No description available."}
                    </p>
                    
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>{course.semester}</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        <span>{course.gradeLevel}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <Badge variant="outline">{course.credits} credits</Badge>
                      <Link href={`/courses/${course.id}`}>
                        <Button size="sm" data-testid={`view-course-${course.id}`}>
                          View Course
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
