import { Link } from "wouter";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge"; 
import {
  BookOpen,
  Users,
  Calendar,
  BarChart3,
  CheckCircle,
  Star,
  ArrowRight,
  Play,
  GraduationCap,
  Award,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import Navbar from "../components/layout/Navbar";

const features = [
  {
    icon: BookOpen,
    title: "Course Management",
    description: "Create, organize, and deliver engaging educational content with our comprehensive course management system.",
  },
  {
    icon: Users,
    title: "Student Engagement",
    description: "Foster collaborative learning with discussion forums, group projects, and interactive assignments.",
  },
  {
    icon: Calendar,
    title: "Smart Scheduling",
    description: "Manage classes, assignments, and events with our intelligent scheduling and calendar system.",
  },
  {
    icon: BarChart3,
    title: "Performance Analytics",
    description: "Track student progress and course effectiveness with detailed analytics and reporting tools.",
  },
  {
    icon: CheckCircle,
    title: "Digital Attendance",
    description: "Streamline attendance tracking with digital check-ins and automated reporting.",
  },
  {
    icon: Award,
    title: "Assessment Tools",
    description: "Create and grade assignments with our comprehensive assessment and grading platform.",
  },
];

const institutions = [
  {
    name: "University of Excellence",
    logo: "🎓",
    students: "15,000+",
    courses: "200+",
  },
  {
    name: "Tech Institute",
    logo: "💻",
    students: "8,500+",
    courses: "150+",
  },
  {
    name: "Creative Arts College",
    logo: "🎨",
    students: "3,200+",
    courses: "75+",
  },
  {
    name: "Medical University",
    logo: "🏥",
    students: "12,000+",
    courses: "180+",
  },
];

const testimonials = [
  {
    name: "Dr. Sarah Johnson",
    role: "Professor of Mathematics",
    institution: "University of Excellence",
    content: "EduPlatform has revolutionized how I teach and interact with my students. The analytics help me understand student progress better.",
    rating: 5,
  },
  {
    name: "Michael Chen",
    role: "Computer Science Student",
    institution: "Tech Institute",
    content: "The platform is intuitive and makes it easy to stay organized with assignments and course materials.",
    rating: 5,
  },
  {
    name: "Admin Team",
    role: "Institute Administration",
    institution: "Creative Arts College",
    content: "Managing courses and tracking student performance has never been easier. The reporting features are excellent.",
    rating: 5,
  },
];

export default function HomePage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6" data-testid="hero-title">
              Transform Education with
              <span className="block text-primary">EduPlatform</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto" data-testid="hero-description">
              A comprehensive learning management system that empowers educators, engages students, 
              and streamlines educational administration with cutting-edge technology.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {user ? (
                <Link href={`/dashboard/${user.role}`}>
                  <Button size="lg" className="gradient-primary text-white" data-testid="dashboard-button">
                    Go to Dashboard
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              ) : (
                <>
                  <Link href="/register">
                    <Button size="lg" className="gradient-primary text-white" data-testid="get-started-button">
                      Get Started Free
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/login">
                    <Button variant="outline" size="lg" data-testid="sign-in-button">
                      Sign In
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4" data-testid="features-title">
              Everything You Need for Modern Education
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover powerful features designed to enhance learning experiences and streamline educational workflows.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="card-hover dashboard-card" data-testid={`feature-${index}`}>
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Trusted by Educational Institutions Worldwide
            </h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2" data-testid="stat-institutions">50+</div>
              <div className="text-muted-foreground">Institutions</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2" data-testid="stat-students">100K+</div>
              <div className="text-muted-foreground">Students</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2" data-testid="stat-courses">5K+</div>
              <div className="text-muted-foreground">Courses</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2" data-testid="stat-satisfaction">99%</div>
              <div className="text-muted-foreground">Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* Institutions Showcase */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Our Partner Institutions
            </h2>
            <p className="text-xl text-muted-foreground">
              Leading educational institutions choose EduPlatform for their digital transformation.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {institutions.map((institution, index) => (
              <Card key={index} className="card-hover text-center p-6" data-testid={`institution-${index}`}>
                <div className="text-4xl mb-4">{institution.logo}</div>
                <h3 className="font-semibold text-lg mb-2">{institution.name}</h3>
                <div className="flex justify-center space-x-4 text-sm text-muted-foreground">
                  <span>{institution.students} students</span>
                  <span>{institution.courses} courses</span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              What Our Users Say
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="card-hover" data-testid={`testimonial-${index}`}>
                <CardHeader>
                  <div className="flex items-center space-x-1 mb-2">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                  <CardDescription>
                    {testimonial.role} at {testimonial.institution}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">"{testimonial.content}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary to-secondary">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Educational Experience?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join thousands of educators and students who are already using EduPlatform to enhance learning outcomes.
          </p>
          {!user && (
            <Link href="/register">
              <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90" data-testid="cta-button">
                Start Your Free Trial
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-card border-t border-border">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-lg text-primary mb-4">EduPlatform</h3>
              <p className="text-muted-foreground">
                Empowering education through innovative technology and comprehensive learning management solutions.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link href="/features">Features</Link></li>
                <li><Link href="/pricing">Pricing</Link></li>
                <li><Link href="/integrations">Integrations</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link href="/help">Help Center</Link></li>
                <li><Link href="/documentation">Documentation</Link></li>
                <li><Link href="/contact">Contact Us</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link href="/about">About Us</Link></li>
                <li><Link href="/careers">Careers</Link></li>
                <li><Link href="/privacy">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-border text-center text-muted-foreground">
            <p>&copy; 2024 EduPlatform. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
