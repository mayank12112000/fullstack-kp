import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Calendar, Clock, MapPin, Users, Plus, Filter, ChevronLeft, ChevronRight } from "lucide-react";
// import Navbar from "../../components/layout/Navbar";
import Navbar from "../../components/layout/Navbar";
import Sidebar from "../../components/layout/Sidebar";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { useAuth } from "../../hooks/useAuth";
import { schedulesAPI, coursesAPI } from "../../lib/api";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorMessage from "../../components/common/ErrorMessage";

const daysOfWeek = [
  "monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"
];

const timeSlots = [
  "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"
];

export default function SchedulePage() {
  const { user } = useAuth();
  const [selectedDay, setSelectedDay] = useState("monday");
  const [viewMode, setViewMode] = useState<"week" | "day">("week");
  const [currentWeek, setCurrentWeek] = useState(new Date());

  // Fetch schedules for the selected day or week
  const { data: schedules = [], isLoading, error, refetch } = useQuery({
    queryKey: ['/api/schedules/day', selectedDay],
    enabled: !!selectedDay,
  });

  // Fetch user's courses for context
  const { data: courses = [] } = useQuery({
    queryKey: user?.role === 'teacher' 
      ? ['/api/courses/teacher', user.id]
      : user?.role === 'student'
      ? ['/api/students', user.id, 'courses']
      : ['/api/courses'],
    enabled: !!user,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-6">
            <LoadingSpinner size="lg" text="Loading schedule..." />
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
              title="Error loading schedule"
              message="Unable to load your schedule. Please try again."
              onRetry={() => refetch()}
            />
          </main>
        </div>
      </div>
    );
  }

  const getScheduleForTimeSlot = (day: string, time: string) => {
    return schedules.find(schedule => 
      schedule.dayOfWeek === day && 
      schedule.startTime === time
    );
  };

  const getCourseForSchedule = (schedule: any) => {
    return courses.find(course => course.id === schedule.courseId);
  };

  const canManageSchedule = user?.role === 'teacher' || user?.role === 'admin' || user?.role === 'institute_admin';

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-foreground" data-testid="schedule-title">
                Class Schedule
              </h2>
              <p className="text-muted-foreground mt-2">
                {user?.role === 'teacher' ? 'Manage your teaching schedule' : 'View your class timetable'}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Select value={viewMode} onValueChange={(value: "week" | "day") => setViewMode(value)}>
                <SelectTrigger className="w-32" data-testid="view-mode-select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">Week View</SelectItem>
                  <SelectItem value="day">Day View</SelectItem>
                </SelectContent>
              </Select>
              {canManageSchedule && (
                <Button className="gradient-primary text-white" data-testid="add-schedule">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Schedule
                </Button>
              )}
            </div>
          </div>

          {/* Week Navigation */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <Calendar className="mr-2 h-5 w-5" />
                  Week Navigation
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" data-testid="prev-week">
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="font-medium px-4">
                    {currentWeek.toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </span>
                  <Button variant="outline" size="sm" data-testid="next-week">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>

          {viewMode === "week" ? (
            // Weekly View
            <Card className="overflow-x-auto">
              <CardHeader>
                <CardTitle>Weekly Schedule</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="min-w-full">
                  <div className="grid grid-cols-8 gap-2 mb-4">
                    <div className="p-2 font-medium text-sm">Time</div>
                    {daysOfWeek.map(day => (
                      <div key={day} className="p-2 font-medium text-sm text-center capitalize" data-testid={`day-${day}`}>
                        {day}
                      </div>
                    ))}
                  </div>
                  
                  {timeSlots.map(time => (
                    <div key={time} className="grid grid-cols-8 gap-2 mb-2">
                      <div className="p-2 text-sm text-muted-foreground">
                        {time}
                      </div>
                      {daysOfWeek.map(day => {
                        const schedule = getScheduleForTimeSlot(day, time);
                        const course = schedule ? getCourseForSchedule(schedule) : null;
                        
                        return (
                          <div 
                            key={`${day}-${time}`} 
                            className="p-2 min-h-[80px] border rounded-lg"
                            data-testid={`slot-${day}-${time}`}
                          >
                            {schedule && course ? (
                              <div className="bg-primary/10 p-2 rounded h-full">
                                <div className="text-sm font-medium text-primary mb-1">
                                  {course.name}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {schedule.room && (
                                    <div className="flex items-center">
                                      <MapPin className="h-3 w-3 mr-1" />
                                      {schedule.room}
                                    </div>
                                  )}
                                  <div>{schedule.startTime} - {schedule.endTime}</div>
                                  <Badge variant="secondary" className="text-xs mt-1">
                                    {schedule.type}
                                  </Badge>
                                </div>
                              </div>
                            ) : null}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            // Daily View
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Select Day</CardTitle>
                    <Select value={selectedDay} onValueChange={setSelectedDay}>
                      <SelectTrigger className="w-48" data-testid="day-select">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {daysOfWeek.map(day => (
                          <SelectItem key={day} value={day} className="capitalize">
                            {day}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {schedules.length === 0 ? (
                  <Card className="col-span-full">
                    <CardContent className="text-center py-12">
                      <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No classes scheduled</h3>
                      <p className="text-muted-foreground">
                        No classes are scheduled for {selectedDay}.
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  schedules.map(schedule => {
                    const course = getCourseForSchedule(schedule);
                    return (
                      <Card key={schedule.id} className="card-hover" data-testid={`schedule-${schedule.id}`}>
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div>
                              <CardTitle className="text-lg">
                                {course?.name || 'Unknown Course'}
                              </CardTitle>
                              <p className="text-sm text-muted-foreground">
                                {course?.code}
                              </p>
                            </div>
                            <Badge variant={schedule.type === 'lecture' ? 'default' : 'secondary'}>
                              {schedule.type}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Clock className="h-4 w-4 mr-2" />
                            {schedule.startTime} - {schedule.endTime}
                          </div>
                          
                          {schedule.room && (
                            <div className="flex items-center text-sm text-muted-foreground">
                              <MapPin className="h-4 w-4 mr-2" />
                              {schedule.room}
                            </div>
                          )}

                          {course && (
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Users className="h-4 w-4 mr-2" />
                              {course.gradeLevel}
                            </div>
                          )}

                          {canManageSchedule && (
                            <div className="flex space-x-2 pt-2">
                              <Button size="sm" variant="outline" data-testid={`edit-schedule-${schedule.id}`}>
                                Edit
                              </Button>
                              <Button size="sm" variant="outline" data-testid={`delete-schedule-${schedule.id}`}>
                                Delete
                              </Button>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
