import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { UserPlus, Check, MessageSquare, AlertCircle, Upload } from "lucide-react";

interface RecentActivityProps {
  userRole: string;
}

export default function RecentActivity({ userRole }: RecentActivityProps) {
  // Generate activity data based on user role
  const getActivityData = () => {
    switch (userRole) {
      case 'teacher':
        return [
          {
            id: '1',
            type: 'assignment-submit',
            icon: Check,
            iconColor: 'text-success',
            iconBg: 'bg-success/10',
            message: 'Michael Chen submitted Assignment 3',
            time: '15 minutes ago',
          },
          {
            id: '2',
            type: 'forum-post',
            icon: MessageSquare,
            iconColor: 'text-accent',
            iconBg: 'bg-accent/10',
            message: 'New discussion post in Statistics Forum',
            time: '1 hour ago',
          },
          {
            id: '3',
            type: 'attendance-mark',
            icon: AlertCircle,
            iconColor: 'text-destructive',
            iconBg: 'bg-destructive/10',
            message: '3 students marked absent in morning session',
            time: '2 hours ago',
          },
          {
            id: '4',
            type: 'material-upload',
            icon: Upload,
            iconColor: 'text-purple-500',
            iconBg: 'bg-purple-100',
            message: 'Course material uploaded to Calculus Workshop',
            time: '3 hours ago',
          },
        ];

      case 'student':
        return [
          {
            id: '1',
            type: 'assignment-graded',
            icon: Check,
            iconColor: 'text-success',
            iconBg: 'bg-success/10',
            message: 'Your Assignment 2 has been graded: 92/100',
            time: '30 minutes ago',
          },
          {
            id: '2',
            type: 'announcement',
            icon: MessageSquare,
            iconColor: 'text-primary',
            iconBg: 'bg-primary/10',
            message: 'New announcement in Advanced Mathematics',
            time: '2 hours ago',
          },
          {
            id: '3',
            type: 'material-upload',
            icon: Upload,
            iconColor: 'text-accent',
            iconBg: 'bg-accent/10',
            message: 'New study materials available in Chemistry',
            time: '4 hours ago',
          },
          {
            id: '4',
            type: 'forum-reply',
            icon: MessageSquare,
            iconColor: 'text-secondary',
            iconBg: 'bg-secondary/10',
            message: 'Teacher replied to your question in Physics Forum',
            time: '6 hours ago',
          },
        ];

      case 'admin':
      case 'institute_admin':
        return [
          {
            id: '1',
            type: 'user-register',
            icon: UserPlus,
            iconColor: 'text-primary',
            iconBg: 'bg-primary/10',
            message: '5 new students registered today',
            time: '1 hour ago',
          },
          {
            id: '2',
            type: 'course-create',
            icon: Check,
            iconColor: 'text-success',
            iconBg: 'bg-success/10',
            message: 'New course "Data Science 101" created by Dr. Smith',
            time: '3 hours ago',
          },
          {
            id: '3',
            type: 'system-alert',
            icon: AlertCircle,
            iconColor: 'text-warning',
            iconBg: 'bg-warning/10',
            message: 'Server maintenance scheduled for tomorrow',
            time: '5 hours ago',
          },
          {
            id: '4',
            type: 'report-generate',
            icon: Upload,
            iconColor: 'text-accent',
            iconBg: 'bg-accent/10',
            message: 'Monthly performance report generated',
            time: '8 hours ago',
          },
        ];

      default:
        return [];
    }
  };

  const activities = getActivityData();

  return (
    <Card className="dashboard-card" data-testid="recent-activity">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Recent Activity</CardTitle>
          <Button variant="ghost" size="sm" data-testid="view-all-activity">
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">No recent activity</p>
            </div>
          ) : (
            activities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3" data-testid={`activity-${activity.id}`}>
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${activity.iconBg}`}>
                  <activity.icon className={`text-sm h-4 w-4 ${activity.iconColor}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground">
                    {activity.message}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {activity.time}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
