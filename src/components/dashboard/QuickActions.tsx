import { Plus, ClipboardCheck, GraduationCap, Megaphone, BarChart3 } from "lucide-react";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";

interface QuickActionsProps {
  userRole: string;
}

export default function QuickActions({ userRole }: QuickActionsProps) {
  const getActions = () => {
    switch (userRole) {
      case 'teacher':
        return [
          {
            id: 'create-course',
            label: 'Create New Course',
            icon: Plus,
            href: '/courses/create',
            className: 'gradient-primary text-white hover:opacity-90',
          },
          {
            id: 'take-attendance',
            label: 'Take Attendance',
            icon: ClipboardCheck,
            href: '/attendance',
            className: 'bg-muted/50 text-foreground hover:bg-muted',
          },
          {
            id: 'grade-assignments',
            label: 'Grade Assignments',
            icon: GraduationCap,
            href: '/gradebook',
            className: 'bg-muted/50 text-foreground hover:bg-muted',
          },
          {
            id: 'send-announcement',
            label: 'Send Announcement',
            icon: Megaphone,
            href: '/announcements',
            className: 'bg-muted/50 text-foreground hover:bg-muted',
          },
          {
            id: 'generate-report',
            label: 'Generate Report',
            icon: BarChart3,
            href: '/reports',
            className: 'bg-muted/50 text-foreground hover:bg-muted',
          },
        ];
      
      case 'student':
        return [
          {
            id: 'view-assignments',
            label: 'View Assignments',
            icon: GraduationCap,
            href: '/assignments',
            className: 'gradient-primary text-white hover:opacity-90',
          },
          {
            id: 'check-schedule',
            label: 'Check Schedule',
            icon: ClipboardCheck,
            href: '/schedule',
            className: 'bg-muted/50 text-foreground hover:bg-muted',
          },
          {
            id: 'join-forums',
            label: 'Join Discussions',
            icon: Megaphone,
            href: '/forums',
            className: 'bg-muted/50 text-foreground hover:bg-muted',
          },
        ];

      case 'admin':
      case 'institute_admin':
        return [
          {
            id: 'manage-users',
            label: 'Manage Users',
            icon: Plus,
            href: '/users',
            className: 'gradient-primary text-white hover:opacity-90',
          },
          {
            id: 'view-reports',
            label: 'View Reports',
            icon: BarChart3,
            href: '/reports',
            className: 'bg-muted/50 text-foreground hover:bg-muted',
          },
          {
            id: 'system-analytics',
            label: 'System Analytics',
            icon: ClipboardCheck,
            href: '/analytics',
            className: 'bg-muted/50 text-foreground hover:bg-muted',
          },
        ];

      default:
        return [];
    }
  };

  const actions = getActions();

  if (actions.length === 0) {
    return null;
  }

  return (
    <Card className="dashboard-card" data-testid="quick-actions">
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {actions.map((action) => (
            <Link key={action.id} href={action.href}>
              <Button
                className={`w-full justify-start transition-colors ${action.className}`}
                data-testid={`action-${action.id}`}
              >
                <action.icon className="mr-3 h-4 w-4" />
                {action.label}
              </Button>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
