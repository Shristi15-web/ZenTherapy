import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Activity, 
  Calendar, 
  TrendingUp, 
  Heart, 
  Users, 
  Clock, 
  Shield, 
  Smartphone,
  ChevronRight,
  Star,
  CheckCircle
} from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  const features = [
    {
      icon: Users,
      title: "Patient Management", 
      description: "Comprehensive digital health records and therapy plans",
      color: "healing"
    },
    {
      icon: Calendar,
      title: "Smart Scheduling",
      description: "Automated appointment booking with conflict detection",
      color: "wellness"
    },
    {
      icon: TrendingUp,
      title: "Progress Tracking",
      description: "Real-time wellness metrics and recovery milestones",
      color: "earth"
    },
    {
      icon: Heart,
      title: "Feedback System",
      description: "Structured post-session feedback and adjustments",
      color: "healing"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Patient",
      rating: 5,
      comment: "The automated scheduling and progress tracking have made my Panchakarma journey so much smoother."
    },
    {
      name: "Dr. Meera Sharma", 
      role: "Ayurvedic Practitioner",
      rating: 5,
      comment: "This system helps me provide better care with detailed patient feedback and progress visualization."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Activity className="h-8 w-8 text-healing" />
              <h1 className="text-2xl font-bold text-foreground">PanchakarmaPlus</h1>
            </div>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
              <Link to="/login">
                <Button variant="outline" className="w-full sm:w-auto">Sign In</Button>
              </Link>
              <Link to="/admin">
                <Button className="bg-healing hover:bg-healing/90 w-full sm:w-auto">Admin Portal</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-healing/5 via-wellness/5 to-earth/5 py-20">
          <div className="container mx-auto px-4 text-center">
            <Badge variant="secondary" className="mb-6 bg-wellness/20 text-wellness">
              Next-Gen Ayurvedic Care Management
            </Badge>
            <h2 className="text-5xl font-bold text-foreground mb-6">
              Revolutionize Your <br />
              <span className="bg-gradient-to-r from-healing to-wellness bg-clip-text text-transparent">
                Panchakarma Practice
              </span>
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Comprehensive therapy management system with automated scheduling, real-time progress tracking, 
              and intelligent feedback loops for optimal healing outcomes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/schedule">
                <Button size="lg" className="bg-healing hover:bg-healing/90">
                  Book Session
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/progress">
                <Button size="lg" variant="outline">
                  View Progress Demo
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h3 className="text-3xl font-bold text-foreground mb-4">Complete Therapy Management</h3>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                From initial consultation to recovery milestones, every aspect of Panchakarma therapy is seamlessly integrated.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => {
                const IconComponent = feature.icon;
                const getFeatureLink = (title: string) => {
                  switch (title) {
                    case "Patient Management":
                      return "/patients";
                    case "Smart Scheduling":
                      return "/schedule";
                    case "Progress Tracking":
                      return "/progress";
                    case "Feedback System":
                      return "/feedback";
                    default:
                      return "/dashboard";
                  }
                };
                
                return (
                  <Link key={index} to={getFeatureLink(feature.title)}>
                    <Card className="border-border hover:shadow-lg transition-all hover:scale-105 cursor-pointer">
                      <CardHeader>
                        <div className={`w-12 h-12 rounded-lg bg-${feature.color}/10 flex items-center justify-center mb-4`}>
                          <IconComponent className={`h-6 w-6 text-${feature.color}`} />
                        </div>
                        <CardTitle className="text-lg">{feature.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground text-sm">{feature.description}</p>
                        <div className="mt-4">
                          <Button variant="ghost" size="sm" className="text-healing hover:text-healing/80">
                            Explore Feature
                            <ChevronRight className="ml-1 h-3 w-3" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* Demo Showcase */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h3 className="text-3xl font-bold text-foreground mb-4">Experience the System</h3>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Explore different user perspectives and see how PanchakarmaPlus streamlines every aspect of therapy management.
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Patient Experience */}
              <Card className="overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-healing/10 to-wellness/10">
                  <CardTitle className="flex items-center space-x-2">
                    <Heart className="h-5 w-5 text-healing" />
                    <span>Patient Experience</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-wellness" />
                      <span className="text-sm">Track recovery progress in real-time</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-wellness" />
                      <span className="text-sm">Receive automated session reminders</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-wellness" />
                      <span className="text-sm">Submit detailed session feedback</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-wellness" />
                      <span className="text-sm">View wellness metrics & milestones</span>
                    </div>
                  </div>
                  <div className="mt-6 flex space-x-3">
                    <Link to="/dashboard" className="flex-1">
                      <Button variant="outline" className="w-full">Patient Dashboard</Button>
                    </Link>
                    <Link to="/feedback" className="flex-1">
                      <Button variant="outline" className="w-full">Feedback Form</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              {/* Practitioner Experience */}
              <Card className="overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-earth/10 to-healing/10">
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-earth" />
                    <span>Practitioner Tools</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-wellness" />
                      <span className="text-sm">Manage multiple patient schedules</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-wellness" />
                      <span className="text-sm">Review patient feedback & progress</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-wellness" />
                      <span className="text-sm">Automated therapy adjustments</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-wellness" />
                      <span className="text-sm">Digital health record management</span>
                    </div>
                  </div>
                  <div className="mt-6">
                    <Link to="/practitioner" className="block">
                      <Button className="w-full bg-earth hover:bg-earth/90">Practitioner Dashboard</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h3 className="text-3xl font-bold text-foreground mb-4">Trusted by Practitioners & Patients</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {testimonials.map((testimonial, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-earth fill-earth" />
                      ))}
                    </div>
                    <p className="text-foreground mb-4">"{testimonial.comment}"</p>
                    <div>
                      <p className="font-medium text-foreground">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-healing/10 to-wellness/10">
          <div className="container mx-auto px-4 text-center">
            <h3 className="text-3xl font-bold text-foreground mb-4">Ready to Transform Your Practice?</h3>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join the future of Ayurvedic therapy management with automated scheduling, progress tracking, and intelligent feedback systems.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/dashboard">
                <Button size="lg" className="bg-healing hover:bg-healing/90">
                  Start Free Demo
                </Button>
              </Link>
              <Button size="lg" variant="outline">
                Contact Sales
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Activity className="h-6 w-6 text-healing" />
              <span className="font-medium text-foreground">PanchakarmaPlus</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 PanchakarmaPlus. Revolutionizing Ayurvedic care management.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;