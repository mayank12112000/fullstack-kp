import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Loader2 } from "lucide-react";
import Navbar from "../../components/layout/Navbar";
import Sidebar from "../../components/layout/Sidebar";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../../components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { useAuth } from "../../hooks/useAuth";
import { insertCourseSchema } from "../../shared/schema2";
import type { InsertCourse } from "../../shared/schema2";
import { coursesAPI } from "../../lib/api";
import { useToast } from "../../hooks/use-toast";
import { Link } from "wouter";

export default function CreateCoursePage() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<InsertCourse>({
    resolver: zodResolver(insertCourseSchema),
    defaultValues: {
      name: "",
      code: "",
      description: "",
      gradeLevel: "",
      semester: "",
      credits: 3,
      teacherId: user?.id,
      institutionId: "inst-1", // Default institution
      isActive: true,
    },
  });

  const createCourseMutation = useMutation({
    mutationFn: coursesAPI.createCourse,
    onSuccess: (newCourse) => {
      toast({
        title: "Course created successfully!",
        description: `${newCourse.name} has been created and is now active.`,
      });
      
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['/api/courses'] });
      if (user?.role === 'teacher') {
        queryClient.invalidateQueries({ queryKey: ['/api/courses/teacher', user.id] });
      }
      
      setLocation(`/courses/${newCourse.id}`);
    },
    onError: (error: any) => {
      toast({
        title: "Error creating course",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertCourse) => {
    createCourseMutation.mutate(data);
  };

  // Only allow teachers, admins, and institute admins to create courses
  if (!user || !['teacher', 'admin', 'institute_admin'].includes(user.role || '')) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-6">
            <Card className="max-w-2xl mx-auto">
              <CardContent className="pt-6 text-center">
                <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
                <p className="text-muted-foreground mb-4">
                  You don't have permission to create courses.
                </p>
                <Link href="/courses">
                  <Button>Back to Courses</Button>
                </Link>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          {/* Header */}
          <div className="flex items-center mb-8">
            <Link href="/courses">
              <Button variant="ghost" size="sm" className="mr-4" data-testid="back-button">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Courses
              </Button>
            </Link>
            <div>
              <h2 className="text-3xl font-bold text-foreground" data-testid="create-course-title">
                Create New Course
              </h2>
              <p className="text-muted-foreground mt-2">
                Set up a new course with all the necessary details.
              </p>
            </div>
          </div>

          {/* Form */}
          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle>Course Information</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" data-testid="create-course-form">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Course Name *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., Advanced Mathematics"
                              {...field}
                              data-testid="input-name"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="code"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Course Code *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., MATH401"
                              {...field}
                              data-testid="input-code"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Provide a detailed description of the course content and objectives..."
                            rows={4}
                            {...field}
                            data-testid="input-description"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FormField
                      control={form.control}
                      name="gradeLevel"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Grade Level *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-grade-level">
                                <SelectValue placeholder="Select grade level" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Grade 9">Grade 9</SelectItem>
                              <SelectItem value="Grade 10">Grade 10</SelectItem>
                              <SelectItem value="Grade 11">Grade 11</SelectItem>
                              <SelectItem value="Grade 12">Grade 12</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="semester"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Semester *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-semester">
                                <SelectValue placeholder="Select semester" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Fall 2024">Fall 2024</SelectItem>
                              <SelectItem value="Spring 2025">Spring 2025</SelectItem>
                              <SelectItem value="Summer 2025">Summer 2025</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="credits"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Credits</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="1"
                              max="6"
                              {...field}
                              onChange={(e) => field.onChange(Number(e.target.value))}
                              data-testid="input-credits"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex justify-end space-x-4 pt-6">
                    <Link href="/courses">
                      <Button variant="outline" data-testid="cancel-button">
                        Cancel
                      </Button>
                    </Link>
                    <Button
                      type="submit"
                      className="gradient-primary text-white"
                      disabled={createCourseMutation.isPending}
                      data-testid="submit-button"
                    >
                      {createCourseMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating Course...
                        </>
                      ) : (
                        "Create Course"
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
