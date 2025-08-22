import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "./components/ui/toaster";
import { TooltipProvider } from "./components/ui/tooltip";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";

// Pages
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import StudentDashboard from "./pages/dashboard/StudentDashboard";
import TeacherDashboard from "./pages/dashboard/TeacherDashboard";
import AdminDashboard from "./pages/dashboard/AdminDashboard";
import InstituteAdminDashboard from "./pages/dashboard/InstituteAdminDashboard";
import CoursesPage from "./pages/courses/CoursesPage";
import CreateCoursePage from "./pages/courses/CreateCoursePage";
import CourseDetailsPage from "./pages/courses/CourseDetailsPage";
import SchedulePage from "./pages/schedule/SchedulePage";
import AttendancePage from "./pages/attendance/AttendancePage";
import AnalyticsPage from "./pages/analytics/AnalyticsPage";
import AssignmentsPage from "./pages/assignments/AssignmentsPage";
import GradebookPage from "./pages/gradebook/GradebookPage";
import ForumsPage from "./pages/forums/ForumsPage";
import ReportsPage from "./pages/reports/ReportsPage";
import ProfilePage from "./pages/profile/ProfilePage";
import NotFound from "./pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/login" component={LoginPage} />
      <Route path="/register" component={RegisterPage} />
      <Route path="/forgot-password" component={ForgotPasswordPage} />
      
      {/* Dashboard Routes */}
      <Route path="/dashboard/student" component={StudentDashboard} />
      <Route path="/dashboard/teacher" component={TeacherDashboard} />
      <Route path="/dashboard/admin" component={AdminDashboard} />
      <Route path="/dashboard/institute-admin" component={InstituteAdminDashboard} />
      
      {/* Course Routes */}
      <Route path="/courses" component={CoursesPage} />
      <Route path="/courses/create" component={CreateCoursePage} />
      <Route path="/courses/:id" component={CourseDetailsPage} />
      
      {/* Feature Routes */}
      <Route path="/schedule" component={SchedulePage} />
      <Route path="/attendance" component={AttendancePage} />
      <Route path="/analytics" component={AnalyticsPage} />
      <Route path="/assignments" component={AssignmentsPage} />
      <Route path="/gradebook" component={GradebookPage} />
      <Route path="/forums" component={ForumsPage} />
      <Route path="/reports" component={ReportsPage} />
      <Route path="/profile" component={ProfilePage} />
      
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
