import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Calendar, Users, CheckCircle, XCircle, Clock, Filter } from "lucide-react";
import Navbar from "../../components/layout/Navbar";
import Sidebar from "../../components/layout/Sidebar";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Checkbox } from "../../components/ui/checkbox";
import { useAuth } from "../../hooks/useAuth";
import { coursesAPI, attendanceAPI } from "../../lib/api";
import { useToast } from "../../hooks/use-toast";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorMessage from "../../components/common/ErrorMessage";

export default function AttendancePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceData, setAttendanceData] = useState<Record<string, string>>({});

  // Fetch user's courses
  const { data: courses = [], isLoading: coursesLoading } = useQuery({
    queryKey: user?.role === 'teacher' 
      ? ['/api/courses/teacher', user.id]
      : ['/api/courses'],
    enabled: !!user && (user.role === 'teacher' || user.role === 'admin' || user.role === 'institute_admin'),
  });

  // Fetch students for selected course
  const { data: students = [], isLoading: studentsLoading } = useQuery({
    queryKey: ['/api/courses', selectedCourse, 'students'],
    enabled: !!selectedCourse,
  });

  // Fetch existing attendance for selected course and date
  const { data: existingAttendance = [], isLoading: attendanceLoading } = useQuery({
    queryKey: ['/api/attendance/course', selectedCourse, selectedDate],
    enabled: !!selectedCourse && !!selectedDate,
  });

  // Mark attendance mutation
  const markAttendanceMutation = useMutation({
    mutationFn: attendanceAPI.markAttendance,
    onSuccess: () => {
      toast({
        title: "Attendance marked successfully",
        description: "Student attendance has been recorded.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/attendance/course', selectedCourse, selectedDate] });
    },
    onError: (error: any) => {
      toast({
        title: "Error marking attendance",
        message: error.message || "Failed to mark attendance. Please try again.",
        variant: "destructive",
      });
    },
  });

  const isLoading = coursesLoading || studentsLoading || attendanceLoading;

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
                  You don't have permission to manage attendance.
                </p>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    );
  }

  const handleAttendanceChange = (studentId: string, status: string) => {
    setAttendanceData(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const handleMarkAttendance = (studentId: string, status: string) => {
    if (!selectedCourse || !selectedDate) return;

    markAttendanceMutation.mutate({
      studentId,
      courseId: selectedCourse,
      date: new Date(selectedDate),
      status,
      markedBy: user.id,
    });
  };

  const getAttendanceStatus = (studentId: string) => {
    const existing = existingAttendance.find(a => a.studentId === studentId);
    return existing?.status || attendanceData[studentId] || 'present';
  };

  const getAttendanceStats = () => {
    const total = students.length;
    const present = students.filter(s => getAttendanceStatus(s.id) === 'present').length;
    const absent = students.filter(s => getAttendanceStatus(s.id) === 'absent').length;
    const late = students.filter(s => getAttendanceStatus(s.id) === 'late').length;
    const excused = students.filter(s => getAttendanceStatus(s.id) === 'excused').length;

    return { total, present, absent, late, excused };
  };

  const stats = getAttendanceStats();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-foreground" data-testid="attendance-title">
              Attendance Management
            </h2>
            <p className="text-muted-foreground mt-2">
              Track and manage student attendance for your courses.
            </p>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Filter className="mr-2 h-5 w-5" />
                Select Course & Date
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Course</label>
                  <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                    <SelectTrigger data-testid="course-select">
                      <SelectValue placeholder="Select a course" />
                    </SelectTrigger>
                    <SelectContent>
                      {courses.map(course => (
                        <SelectItem key={course.id} value={course.id}>
                          {course.name} ({course.code})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Date</label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full p-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    data-testid="date-input"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {selectedCourse && (
            <>
              {/* Attendance Stats */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-foreground">{stats.total}</div>
                    <div className="text-sm text-muted-foreground">Total Students</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-success">{stats.present}</div>
                    <div className="text-sm text-muted-foreground">Present</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-destructive">{stats.absent}</div>
                    <div className="text-sm text-muted-foreground">Absent</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-warning">{stats.late}</div>
                    <div className="text-sm text-muted-foreground">Late</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-info">{stats.excused}</div>
                    <div className="text-sm text-muted-foreground">Excused</div>
                  </CardContent>
                </Card>
              </div>

              {/* Attendance Table */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>
                      Attendance for {courses.find(c => c.id === selectedCourse)?.name}
                    </CardTitle>
                    <div className="text-sm text-muted-foreground">
                      {new Date(selectedDate).toLocaleDateString()}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <LoadingSpinner text="Loading attendance data..." />
                  ) : students.length === 0 ? (
                    <div className="text-center py-8">
                      <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No students enrolled</h3>
                      <p className="text-muted-foreground">
                        No students are enrolled in this course.
                      </p>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Student Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {students.map(student => {
                          const currentStatus = getAttendanceStatus(student.id);
                          const hasExistingRecord = existingAttendance.some(a => a.studentId === student.id);
                          
                          return (
                            <TableRow key={student.id} data-testid={`student-${student.id}`}>
                              <TableCell className="font-medium">
                                {student.firstName} {student.lastName}
                              </TableCell>
                              <TableCell className="text-muted-foreground">
                                {student.email}
                              </TableCell>
                              <TableCell>
                                <Badge 
                                  variant={
                                    currentStatus === 'present' ? 'default' :
                                    currentStatus === 'absent' ? 'destructive' :
                                    currentStatus === 'late' ? 'secondary' : 'outline'
                                  }
                                  className={`status-${currentStatus}`}
                                >
                                  {currentStatus}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex space-x-2">
                                  <Button
                                    size="sm"
                                    variant={currentStatus === 'present' ? 'default' : 'outline'}
                                    onClick={() => handleMarkAttendance(student.id, 'present')}
                                    disabled={markAttendanceMutation.isPending}
                                    data-testid={`mark-present-${student.id}`}
                                  >
                                    <CheckCircle className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant={currentStatus === 'absent' ? 'destructive' : 'outline'}
                                    onClick={() => handleMarkAttendance(student.id, 'absent')}
                                    disabled={markAttendanceMutation.isPending}
                                    data-testid={`mark-absent-${student.id}`}
                                  >
                                    <XCircle className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant={currentStatus === 'late' ? 'secondary' : 'outline'}
                                    onClick={() => handleMarkAttendance(student.id, 'late')}
                                    disabled={markAttendanceMutation.isPending}
                                    data-testid={`mark-late-${student.id}`}
                                  >
                                    <Clock className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </>
          )}

          {!selectedCourse && (
            <Card>
              <CardContent className="text-center py-12">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Select a Course</h3>
                <p className="text-muted-foreground">
                  Choose a course from the dropdown above to start taking attendance.
                </p>
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </div>
  );
}
