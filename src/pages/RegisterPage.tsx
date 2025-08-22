import { useState, useEffect } from "react";
import { Calendar, Users, CheckCircle, XCircle, Clock, Filter } from "lucide-react";
import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../hooks/use-toast";

// Temporary mock data until backend is ready
const mockCourses = [
  { id: "c1", name: "Mathematics", code: "MATH101" },
  { id: "c2", name: "Physics", code: "PHYS201" },
];

const mockStudents = [
  { id: "s1", firstName: "Alice", lastName: "Johnson", email: "alice@example.com" },
  { id: "s2", firstName: "Bob", lastName: "Smith", email: "bob@example.com" },
  { id: "s3", firstName: "Charlie", lastName: "Brown", email: "charlie@example.com" },
];

type AttendanceStatus = "present" | "absent" | "late" | "excused";

export default function AttendancePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [attendanceData, setAttendanceData] = useState<Record<string, AttendanceStatus>>({});

  // Reset attendance when course changes
  useEffect(() => {
    setAttendanceData({});
  }, [selectedCourse, selectedDate]);

  if (!user || !["teacher", "admin", "institute_admin"].includes(user.role || "")) {
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

  const handleMarkAttendance = (studentId: string, status: AttendanceStatus) => {
    setAttendanceData((prev) => ({
      ...prev,
      [studentId]: status,
    }));
    toast({
      title: "Attendance Updated",
      description: `Marked ${status} for student.`,
    });
  };

  const getAttendanceStatus = (studentId: string): AttendanceStatus => {
    return attendanceData[studentId] || "absent"; // safer default
  };

  const getAttendanceStats = () => {
    const total = mockStudents.length;
    const present = mockStudents.filter((s) => getAttendanceStatus(s.id) === "present").length;
    const absent = mockStudents.filter((s) => getAttendanceStatus(s.id) === "absent").length;
    const late = mockStudents.filter((s) => getAttendanceStatus(s.id) === "late").length;
    const excused = mockStudents.filter((s) => getAttendanceStatus(s.id) === "excused").length;

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
                      {mockCourses.map((course) => (
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

          {selectedCourse ? (
            <>
              {/* Attendance Stats */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                <Card><CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold">{stats.total}</div>
                  <div className="text-sm text-muted-foreground">Total Students</div>
                </CardContent></Card>
                <Card><CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">{stats.present}</div>
                  <div className="text-sm text-muted-foreground">Present</div>
                </CardContent></Card>
                <Card><CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-red-600">{stats.absent}</div>
                  <div className="text-sm text-muted-foreground">Absent</div>
                </CardContent></Card>
                <Card><CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-yellow-600">{stats.late}</div>
                  <div className="text-sm text-muted-foreground">Late</div>
                </CardContent></Card>
                <Card><CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">{stats.excused}</div>
                  <div className="text-sm text-muted-foreground">Excused</div>
                </CardContent></Card>
              </div>

              {/* Attendance Table */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>
                      Attendance for {mockCourses.find((c) => c.id === selectedCourse)?.name}
                    </CardTitle>
                    <div className="text-sm text-muted-foreground">
                      {new Date(selectedDate).toLocaleDateString()}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {mockStudents.length === 0 ? (
                    <div className="text-center py-8">
                      <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No students enrolled</h3>
                      <p className="text-muted-foreground">No students are enrolled in this course.</p>
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
                        {mockStudents.map((student) => {
                          const currentStatus = getAttendanceStatus(student.id);

                          return (
                            <TableRow key={student.id}>
                              <TableCell>{student.firstName} {student.lastName}</TableCell>
                              <TableCell className="text-muted-foreground">{student.email}</TableCell>
                              <TableCell>
                                <Badge variant="outline">{currentStatus}</Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex space-x-2">
                                  <Button
                                    size="sm"
                                    variant={currentStatus === "present" ? "default" : "outline"}
                                    onClick={() => handleMarkAttendance(student.id, "present")}
                                  ><CheckCircle className="h-4 w-4" /></Button>
                                  <Button
                                    size="sm"
                                    variant={currentStatus === "absent" ? "default" : "outline"}
                                    onClick={() => handleMarkAttendance(student.id, "absent")}
                                  ><XCircle className="h-4 w-4" /></Button>
                                  <Button
                                    size="sm"
                                    variant={currentStatus === "late" ? "default" : "outline"}
                                    onClick={() => handleMarkAttendance(student.id, "late")}
                                  ><Clock className="h-4 w-4" /></Button>
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
          ) : (
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
