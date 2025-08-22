import { useQuery } from "@tanstack/react-query";
import { Clock, MapPin, Users, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { useAuth } from "../../hooks/useAuth";
import { schedulesAPI, coursesAPI } from "../../lib/api";
import LoadingSpinner from "../../components/common/LoadingSpinner";

interface ScheduleCardProps {
  userRole: string;
}

export default function ScheduleCard({ userRole }: ScheduleCardProps) {
  const { user } = useAuth();
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();

  // Fetch today's schedule
  const { data: schedules = [], isLoading } = useQuery({
    queryKey: ['/api/schedules/day', today],
    enabled: !!user,
  });

  // Fetch courses for context
  const { data: courses = [] } = useQuery({
    queryKey: user?.role === 'teacher' 
      ? ['/api/courses/teacher', user.id]
      : user?.role === 'student'
      ? ['/api/students', user.id, 'courses']
      : ['/api/courses'],
    enabled: !!user,
  });

  // Filter schedules for user's courses and sort by time
  const todaySchedules = schedules
    .filter(schedule => {
      const course = courses.find(c => c.id === schedule.courseId);
      return course;
    })
    .sort((a, b) => a.startTime.localeCompare(b.startTime))
    .slice(0, 3); // Show max 3 upcoming classes

  const getScheduleStatus = (schedule: any) => {
    const now = new Date();
    const currentTime = now.toTimeString().slice(0, 5); // HH:MM format
    
    if (currentTime >= schedule.startTime && currentTime <= schedule.endTime) {
      return 'in-progress';
    } else if (currentTime < schedule.startTime) {
      return 'upcoming';
    } else {
      return 'completed';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in-progress':
        return 'bg-success text-success-foreground';
      case 'upcoming':
        return 'bg-primary text-primary-foreground';
      case 'completed':
        return 'bg-muted text-muted-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'in-progress':
        return 'In Progress';
      case 'upcoming':
        return 'Upcoming';
      case 'completed':
        return 'Completed';
      default:
        return 'Scheduled';
    }
  };

  if (isLoading) {
    return (
      <Card className="dashboard-card">
        <CardHeader>
          <CardTitle>Today's Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <LoadingSpinner text="Loading schedule..." />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="dashboard-card" data-testid="schedule-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Today's Schedule</CardTitle>
          <Button variant="ghost" size="sm" data-testid="view-all-schedule">
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {todaySchedules.length === 0 ? (
            <div className="text-center py-8">
              <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">No classes scheduled for today</p>
            </div>
          ) : (
            todaySchedules.map((schedule) => {
              const course = courses.find(c => c.id === schedule.courseId);
              const status = getScheduleStatus(schedule);
              
              if (!course) return null;
              
              return (
                <div key={schedule.id} className="flex items-center p-4 bg-muted/20 rounded-lg" data-testid={`schedule-item-${schedule.id}`}>
                  <div className="flex-shrink-0 w-16 text-center">
                    <p className="text-sm font-semibold text-foreground">
                      {schedule.startTime}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {schedule.startTime.includes(':') ? schedule.startTime.split(':')[1] >= '12' ? 'PM' : 'AM' : ''}
                    </p>
                  </div>
                  
                  <div className="ml-4 flex-1">
                    <h4 className="text-sm font-semibold text-foreground">
                      {course.name}
                    </h4>
                    <div className="flex items-center space-x-3 mt-1 text-xs text-muted-foreground">
                      {schedule.room && (
                        <div className="flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {schedule.room}
                        </div>
                      )}
                      <div className="flex items-center">
                        <Users className="h-3 w-3 mr-1" />
                        {course.gradeLevel}
                      </div>
                      <div className="text-xs">
                        {schedule.startTime} - {schedule.endTime}
                      </div>
                    </div>
                    <div className="mt-2">
                      <Badge 
                        variant="secondary" 
                        className={`text-xs ${getStatusColor(status)}`}
                      >
                        <div className="w-2 h-2 rounded-full bg-current mr-1" />
                        {getStatusText(status)}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex-shrink-0">
                    <Button variant="ghost" size="sm" data-testid={`join-class-${schedule.id}`}>
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}
