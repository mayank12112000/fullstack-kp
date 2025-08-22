import { Progress } from "../../components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Link } from "wouter";
import type { Course } from "../../types";

interface CourseOverviewProps {
  courses: Course[];
}

export default function CourseOverview({ courses }: CourseOverviewProps) {
  // Generate mock data for course progress and performance
  const getCourseMockData = (course: Course) => ({
    enrollmentCount: Math.floor(Math.random() * 25) + 10,
    averageScore: Math.floor(Math.random() * 20) + 75,
    completionRate: Math.floor(Math.random() * 30) + 65,
    thumbnail: `https://images.unsplash.com/photo-${
      course.name.includes('Math') ? '1509228468518-180dd4864904' :
      course.name.includes('Statistics') ? '1551288049-bebda4e38f71' :
      course.name.includes('Calculus') ? '1434030216411-0b793f4b4173' :
      '1516321318423-f06f85e504b3'
    }?ixlib=rb-4.0.3&auto=format&fit=crop&w=48&h=48`,
  });

  if (courses.length === 0) {
    return (
      <Card className="dashboard-card">
        <CardHeader>
          <CardTitle>Course Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">No courses to display</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="dashboard-card" data-testid="course-overview">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Course Overview</CardTitle>
          <Link href="/courses">
            <Button variant="ghost" size="sm" data-testid="view-all-courses">
              View All
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {courses.slice(0, 4).map((course) => {
            const mockData = getCourseMockData(course);
            
            return (
              <div 
                key={course.id} 
                className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/20 transition-colors"
                data-testid={`course-overview-${course.id}`}
              >
                <div className="flex items-center space-x-3">
                  <img
                    src={mockData.thumbnail}
                    alt={`${course.name} thumbnail`}
                    className="w-12 h-12 rounded-lg object-cover"
                    onError={(e) => {
                      // Fallback to a simple colored div if image fails
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const fallback = target.nextElementSibling as HTMLDivElement;
                      if (fallback) fallback.style.display = 'flex';
                    }}
                  />
                  <div 
                    className="w-12 h-12 rounded-lg bg-primary/10 items-center justify-center text-primary font-semibold text-sm hidden"
                    style={{ display: 'none' }}
                  >
                    {course.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-foreground">
                      {course.name}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {mockData.enrollmentCount} students • {course.gradeLevel}
                    </p>
                    <div className="flex items-center mt-1">
                      <div className="w-24 bg-muted rounded-full h-1.5">
                        <div 
                          className="bg-primary h-1.5 rounded-full transition-all duration-300" 
                          style={{ width: `${mockData.completionRate}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground ml-2">
                        {mockData.completionRate}% complete
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm font-semibold text-foreground">
                      {mockData.averageScore}%
                    </p>
                    <p className="text-xs text-muted-foreground">Avg. Score</p>
                  </div>
                  
                  <Badge 
                    variant={course.isActive ? "default" : "secondary"}
                    className="ml-2"
                  >
                    {course.isActive ? "Active" : "Inactive"}
                  </Badge>
                  
                  <Link href={`/courses/${course.id}`}>
                    <Button 
                      variant="outline" 
                      size="sm"
                      data-testid={`view-course-${course.id}`}
                    >
                      View
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
