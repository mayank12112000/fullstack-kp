import { Link, useLocation } from "wouter";
import {
  BookOpen,
  Calendar,
  Users,
  BarChart3,
  ClipboardCheck,
  GraduationCap,
  MessageCircle,
  FileText,
  Home,
  Settings,
  Plus,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { ScrollArea } from "../../components/ui/scroll-area";
import { Separator } from "../../components/ui/separator";
import { Badge } from "../../components/ui/badge";
import { useAuth } from "../../hooks/useAuth";
import { cn } from "../../lib/utils";
import type { NavItem } from "../../types";

interface SidebarProps {
  className?: string;
}

const getNavigationItems = (role: string): NavItem[] => {
  const baseItems: NavItem[] = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: "Home",
      path: `/dashboard/${role}`,
      roles: ["student", "teacher", "admin", "institute_admin"],
    },
    {
      id: "courses",
      label: "My Courses",
      icon: "BookOpen",
      path: "/courses",
      roles: ["student", "teacher", "admin", "institute_admin"],
    },
    {
      id: "schedule",
      label: "Schedule",
      icon: "Calendar",
      path: "/schedule",
      roles: ["student", "teacher", "admin", "institute_admin"],
    },
  ];

  const roleSpecificItems: Record<string, NavItem[]> = {
    student: [
      {
        id: "assignments",
        label: "Assignments",
        icon: "FileText",
        path: "/assignments",
        roles: ["student"],
      },
      {
        id: "forums",
        label: "Forums",
        icon: "MessageCircle",
        path: "/forums",
        roles: ["student"],
      },
    ],
    teacher: [
      {
        id: "students",
        label: "Students",
        icon: "Users",
        path: "/students",
        roles: ["teacher"],
      },
      {
        id: "attendance",
        label: "Attendance",
        icon: "ClipboardCheck",
        path: "/attendance",
        roles: ["teacher"],
      },
      {
        id: "gradebook",
        label: "Grade Book",
        icon: "GraduationCap",
        path: "/gradebook",
        roles: ["teacher"],
      },
      {
        id: "analytics",
        label: "Analytics",
        icon: "BarChart3",
        path: "/analytics",
        roles: ["teacher"],
      },
      {
        id: "forums",
        label: "Forums",
        icon: "MessageCircle",
        path: "/forums",
        roles: ["teacher"],
      },
    ],
    admin: [
      {
        id: "users",
        label: "Users",
        icon: "Users",
        path: "/users",
        roles: ["admin", "institute_admin"],
      },
      {
        id: "analytics",
        label: "Analytics",
        icon: "BarChart3",
        path: "/analytics",
        roles: ["admin", "institute_admin"],
      },
      {
        id: "reports",
        label: "Reports",
        icon: "FileText",
        path: "/reports",
        roles: ["admin", "institute_admin"],
      },
    ],
    institute_admin: [
      {
        id: "users",
        label: "Users",
        icon: "Users",
        path: "/users",
        roles: ["institute_admin"],
      },
      {
        id: "analytics",
        label: "Analytics",
        icon: "BarChart3",
        path: "/analytics",
        roles: ["institute_admin"],
      },
      {
        id: "reports",
        label: "Reports",
        icon: "FileText",
        path: "/reports",
        roles: ["institute_admin"],
      },
      {
        id: "settings",
        label: "Settings",
        icon: "Settings",
        path: "/settings",
        roles: ["institute_admin"],
      },
    ],
  };

  return [...baseItems, ...(roleSpecificItems[role] || [])];
};

const iconMap = {
  Home,
  BookOpen,
  Calendar,
  Users,
  BarChart3,
  ClipboardCheck,
  GraduationCap,
  MessageCircle,
  FileText,
  Settings,
  Plus,
};

export default function Sidebar({ className }: SidebarProps) {
  const [location] = useLocation();
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  const navigationItems = getNavigationItems(user.role);

  return (
    <aside className={cn("w-64 bg-sidebar border-r border-sidebar-border hidden lg:block", className)} data-testid="sidebar">
      <div className="p-6">
        <ScrollArea className="h-[calc(100vh-8rem)] custom-scrollbar">
          <div className="space-y-1">
            {/* Quick Actions */}
            {(user.role === 'teacher' || user.role === 'admin' || user.role === 'institute_admin') && (
              <>
                <div className="pb-2">
                  <h4 className="mb-3 text-sm font-semibold text-sidebar-foreground">Quick Actions</h4>
                  <Link href="/courses/create">
                    <Button
                      className="w-full justify-start gradient-primary text-white hover:opacity-90"
                      size="sm"
                      data-testid="create-course-button"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Create Course
                    </Button>
                  </Link>
                </div>
                <Separator className="my-4" />
              </>
            )}

            {/* Navigation Items */}
            <nav className="space-y-1">
              {navigationItems.map((item) => {
                const isActive = location === item.path || location.startsWith(item.path + '/');
                const Icon = iconMap[item.icon as keyof typeof iconMap];

                return (
                  <Link key={item.id} href={item.path}>
                    <div
                      className={cn(
                        "nav-link w-full",
                        isActive && "nav-link-active"
                      )}
                      data-testid={`sidebar-${item.id}`}
                    >
                      <Icon className="mr-3 h-4 w-4" />
                      <span className="flex-1">{item.label}</span>
                      {item.badge && (
                        <Badge variant="secondary" className="ml-auto">
                          {item.badge}
                        </Badge>
                      )}
                    </div>
                  </Link>
                );
              })}
            </nav>
          </div>
        </ScrollArea>
      </div>
    </aside>
  );
}
