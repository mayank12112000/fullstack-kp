import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Plus, Search, MessageCircle, Users, Clock, Pin } from "lucide-react";
import Navbar from "../../components/layout/Navbar";
import Sidebar from "../../components/layout/Sidebar";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { useAuth } from "../../hooks/useAuth";
import { coursesAPI, forumsAPI } from "../../lib/api";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorMessage from "../../components/common/ErrorMessage";

export default function ForumsPage() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
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

  // Fetch forums from all user's courses
  const { data: allForums = [], isLoading: forumsLoading, error, refetch } = useQuery({
    queryKey: ['/api/forums', user?.role, user?.id],
    enabled: !!user && courses.length > 0,
    queryFn: async () => {
      const forums = [];
      for (const course of courses) {
        const courseForums = await forumsAPI.getForumsByCourse(course.id);
        forums.push(...courseForums.map(forum => ({ ...forum, course })));
      }
      return forums;
    },
  });

  const isLoading = coursesLoading || forumsLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-6">
            <LoadingSpinner size="lg" text="Loading forums..." />
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
              title="Error loading forums"
              message="Unable to load discussion forums. Please try again."
              onRetry={() => refetch()}
            />
          </main>
        </div>
      </div>
    );
  }

  // Filter forums
  const filteredForums = allForums.filter(forum => {
    const matchesSearch = forum.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         forum.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCourse = courseFilter === "all" || forum.courseId === courseFilter;
    
    return matchesSearch && matchesCourse;
  });

  const canCreateForums = user?.role === 'teacher' || user?.role === 'admin' || user?.role === 'institute_admin';

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-foreground" data-testid="forums-title">
                Discussion Forums
              </h2>
              <p className="text-muted-foreground mt-2">
                Engage in course discussions and collaborate with classmates and instructors.
              </p>
            </div>
            {canCreateForums && (
              <Button className="gradient-primary text-white" data-testid="create-forum">
                <Plus className="mr-2 h-4 w-4" />
                Create Forum
              </Button>
            )}
          </div>

          {/* Search and Filters */}
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
                      placeholder="Search forums and discussions..."
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
              </div>
            </CardContent>
          </Card>

          {/* Forums List */}
          {filteredForums.length === 0 ? (
            <Card className="dashboard-card text-center py-12">
              <CardContent>
                <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  {searchTerm || courseFilter !== "all" 
                    ? "No forums found" 
                    : "No discussion forums"}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm || courseFilter !== "all"
                    ? "Try adjusting your search criteria or filters."
                    : canCreateForums 
                      ? "Create your first discussion forum to encourage student engagement."
                      : "No discussion forums are available for your courses yet."}
                </p>
                {canCreateForums && (
                  <Button className="gradient-primary text-white">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Forum
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredForums.map((forum) => (
                <ForumCard key={forum.id} forum={forum} userRole={user?.role || ''} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

// Forum Card Component
function ForumCard({ forum, userRole }: { forum: any, userRole: string }) {
  // Mock data for demonstration - in real app, this would come from API
  const mockStats = {
    posts: Math.floor(Math.random() * 50) + 5,
    participants: Math.floor(Math.random() * 20) + 3,
    lastActivity: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)),
    isPinned: Math.random() > 0.8,
  };

  const canModerate = userRole === 'teacher' || userRole === 'admin' || userRole === 'institute_admin';

  return (
    <Card className="card-hover dashboard-card" data-testid={`forum-${forum.id}`}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              {mockStats.isPinned && (
                <Pin className="h-4 w-4 text-accent" />
              )}
              <CardTitle className="text-lg">
                <Link href={`/forums/${forum.id}`} className="hover:text-primary transition-colors">
                  {forum.title}
                </Link>
              </CardTitle>
            </div>
            <CardDescription className="mb-2">
              {forum.description || "No description available."}
            </CardDescription>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <Badge variant="outline">
                {forum.course?.name || 'Unknown Course'}
              </Badge>
              <span className="flex items-center">
                <MessageCircle className="h-4 w-4 mr-1" />
                {mockStats.posts} posts
              </span>
              <span className="flex items-center">
                <Users className="h-4 w-4 mr-1" />
                {mockStats.participants} participants
              </span>
            </div>
          </div>
          {canModerate && (
            <div className="flex space-x-2">
              <Button size="sm" variant="outline" data-testid={`edit-forum-${forum.id}`}>
                Edit
              </Button>
              <Button size="sm" variant="outline" data-testid={`moderate-forum-${forum.id}`}>
                Moderate
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>Last activity: {mockStats.lastActivity.toLocaleDateString()}</span>
          </div>
          <div className="flex items-center space-x-3">
            {/* Mock recent participants avatars */}
            <div className="flex -space-x-2">
              {[1, 2, 3].map(i => (
                <Avatar key={i} className="w-6 h-6 border-2 border-background">
                  <AvatarFallback className="text-xs">
                    U{i}
                  </AvatarFallback>
                </Avatar>
              ))}
            </div>
            <Link href={`/forums/${forum.id}`}>
              <Button size="sm" data-testid={`view-forum-${forum.id}`}>
                View Discussions
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
