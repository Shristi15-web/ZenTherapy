// Demo page showcasing all Panchakarma Management features
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Activity,
  Calendar,
  TrendingUp,
  Heart,
  Bell,
  CheckCircle,
  Star,
  Users,
  Clock,
  Target,
  Zap,
  Moon,
  Apple,
  AlertCircle,
  Settings,
  Play,
  RotateCcw,
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import {
  sessionService,
  feedbackService,
  notificationService,
  progressService,
  patientService,
  therapyTypeService,
  practitionerService,
} from "@/lib/storage";

const Demo = () => {
  const [isDemo, setIsDemo] = useState(true);
  const [demoStep, setDemoStep] = useState(0);
  const [demoData, setDemoData] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const demoSteps = [
    "Welcome to PanchakarmaPlus Demo",
    "Automated Session Scheduling",
    "Smart Notification System",
    "Real-time Progress Tracking",
    "Integrated Feedback Loop",
    "Complete Workflow Demo",
  ];

  useEffect(() => {
    loadDemoData();
  }, []);

  const loadDemoData = () => {
    try {
      const patients = patientService.getAll();
      const sessions = sessionService.getAll();
      const feedback = feedbackService.getAll();
      const notifications = notificationService.getAll();
      const milestones = progressService.getMilestones();
      const therapyTypes = therapyTypeService.getAll();
      const practitioners = practitionerService.getAll();

      setDemoData({
        patients,
        sessions,
        feedback,
        notifications,
        milestones,
        therapyTypes,
        practitioners,
      });
    } catch (error) {
      console.error("Error loading demo data:", error);
      toast.error("Failed to load demo data");
    }
  };

  const simulateScheduling = () => {
    setLoading(true);

    // Simulate scheduling a new session
    setTimeout(() => {
      const newSession = {
        patientId: "p1",
        therapyTypeId: "t1", // Abhyanga
        practitionerId: "pr1",
        date: new Date(Date.now() + 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0], // Tomorrow
        time: "14:00",
        status: "Scheduled" as const,
        notes: "Demo session - automated scheduling",
        preSessionChecklist: [
          { item: "Light meal 2 hours before", completed: false },
          { item: "Comfortable loose clothing", completed: false },
        ],
        postSessionNotes: "",
        duration: 60,
        room: "Room A",
      };

      sessionService.create(newSession);
      loadDemoData();
      setLoading(false);
      toast.success(
        "Session scheduled automatically! Pre-care notifications sent."
      );
    }, 2000);
  };

  const simulateNotifications = () => {
    setLoading(true);

    setTimeout(() => {
      // Create different types of notifications
      notificationService.create({
        type: "Reminder",
        title: "Session Reminder",
        message: "Your Abhyanga session is scheduled for tomorrow at 2:00 PM",
        read: false,
        patientId: "p1",
        channels: { inApp: true, email: true, sms: true },
        priority: "Medium",
      });

      notificationService.create({
        type: "Pre-Care",
        title: "Pre-Treatment Preparation",
        message:
          "Please follow pre-session guidelines: light meal 2 hours before, comfortable clothing",
        read: false,
        patientId: "p1",
        channels: { inApp: true, email: true, sms: false },
        priority: "High",
      });

      notificationService.create({
        type: "Progress",
        title: "Milestone Progress",
        message: "You are 75% complete with your stress reduction milestone!",
        read: false,
        patientId: "p1",
        channels: { inApp: true, email: false, sms: false },
        priority: "Low",
      });

      loadDemoData();
      setLoading(false);
      toast.success("Smart notifications generated across multiple channels!");
    }, 1500);
  };

  const simulateProgress = () => {
    setLoading(true);

    setTimeout(() => {
      // Update milestone progress
      const milestones = progressService.getMilestones("p1");
      const inProgressMilestone = milestones.find(
        (m) => m.status === "In Progress"
      );

      if (inProgressMilestone) {
        inProgressMilestone.metrics.forEach((metric) => {
          metric.current = Math.min(
            metric.target,
            metric.current + metric.target * 0.15
          );
        });

        progressService.updateMilestone(
          inProgressMilestone.id,
          inProgressMilestone
        );
      }

      loadDemoData();
      setLoading(false);
      toast.success("Progress updated! Visual tracking shows improvement.");
    }, 1500);
  };

  const simulateFeedback = () => {
    setLoading(true);

    setTimeout(() => {
      const completedSessions =
        demoData.sessions?.filter((s) => s.status === "Completed") || [];

      if (completedSessions.length > 0) {
        const session = completedSessions[0];

        const feedback = {
          sessionId: session.id,
          patientId: "p1",
          rating: 5,
          comfort: 5,
          effectiveness: 4,
          mood: "Excellent" as const,
          energyLevel: 9,
          sleepQuality: 8,
          digestion: 8,
          symptoms: {
            before: ["Stress", "Fatigue"],
            after: ["Relaxed", "Energized"],
          },
          sideEffects: [],
          comments: "Amazing session! Feeling much better and energized.",
          recommendations: ["Continue current treatment"],
        };

        feedbackService.create(feedback);

        // This will automatically trigger progress updates
        loadDemoData();
        setLoading(false);
        toast.success(
          "Feedback submitted! Progress automatically updated based on response."
        );
      }
    }, 1500);
  };

  const simulateCompleteWorkflow = () => {
    setLoading(true);

    let step = 0;
    const steps = [
      { action: "Scheduling session...", delay: 1000 },
      { action: "Sending pre-care notifications...", delay: 1000 },
      { action: "Conducting therapy session...", delay: 1500 },
      { action: "Collecting feedback...", delay: 1000 },
      { action: "Updating progress metrics...", delay: 1000 },
      { action: "Generating recommendations...", delay: 1000 },
      { action: "Sending post-care instructions...", delay: 500 },
    ];

    const executeStep = () => {
      if (step < steps.length) {
        toast.info(steps[step].action);
        setTimeout(() => {
          step++;
          executeStep();
        }, steps[step - 1]?.delay || 1000);
      } else {
        // Complete workflow
        simulateScheduling();
        setTimeout(() => {
          simulateNotifications();
          setTimeout(() => {
            simulateFeedback();
            setTimeout(() => {
              simulateProgress();
              setLoading(false);
              toast.success("Complete workflow demonstrated! 🎉");
            }, 1000);
          }, 1000);
        }, 1000);
      }
    };

    executeStep();
  };

  const resetDemo = () => {
    setLoading(true);
    // Reset would reinitialize data in a real scenario
    setTimeout(() => {
      loadDemoData();
      setLoading(false);
      toast.info("Demo reset to initial state");
    }, 1000);
  };

  const {
    patients = [],
    sessions = [],
    feedback = [],
    notifications = [],
    milestones = [],
    therapyTypes = [],
    practitioners = [],
  } = demoData;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex items-center space-x-2">
                <Activity className="h-6 w-6 text-healing" />
                <span className="font-semibold text-lg">PanchakarmaPlus</span>
              </Link>
              <Badge className="bg-healing/10 text-healing">
                Interactive Demo
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={resetDemo} disabled={loading}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset Demo
              </Button>
              <Link to="/dashboard">
                <Button>Go to Dashboard</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Demo Introduction */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Panchakarma Management Software Demo
          </h1>
          <p className="text-xl text-muted-foreground mb-6 max-w-3xl mx-auto">
            Experience automated therapy scheduling, intelligent notifications,
            real-time progress tracking, and integrated feedback loops in
            action.
          </p>
          <div className="flex justify-center space-x-4">
            <Badge variant="outline" className="text-sm">
              70% Functional Prototype
            </Badge>
            <Badge variant="outline" className="text-sm">
              No Database Required
            </Badge>
            <Badge variant="outline" className="text-sm">
              Local State Management
            </Badge>
          </div>
        </div>

        {/* Demo Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card>
            <CardContent className="p-6 text-center">
              <Users className="h-8 w-8 text-healing mx-auto mb-2" />
              <div className="text-2xl font-bold">{patients.length}</div>
              <div className="text-sm text-muted-foreground">Patients</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Calendar className="h-8 w-8 text-wellness mx-auto mb-2" />
              <div className="text-2xl font-bold">{sessions.length}</div>
              <div className="text-sm text-muted-foreground">Sessions</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Bell className="h-8 w-8 text-earth mx-auto mb-2" />
              <div className="text-2xl font-bold">{notifications.length}</div>
              <div className="text-sm text-muted-foreground">Notifications</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Target className="h-8 w-8 text-healing mx-auto mb-2" />
              <div className="text-2xl font-bold">
                {milestones.filter((m) => m.status === "Achieved").length}
              </div>
              <div className="text-sm text-muted-foreground">Milestones</div>
            </CardContent>
          </Card>
        </div>

        {/* Interactive Demo Features */}
        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="scheduling">Scheduling</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
            <TabsTrigger value="feedback">Feedback</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Complete Workflow Demo</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <p className="text-muted-foreground">
                    Experience the complete Panchakarma management workflow from
                    scheduling to progress tracking.
                  </p>

                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className="text-sm">
                        Automated session scheduling with conflict detection
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className="text-sm">
                        Multi-channel notification system (in-app, email, SMS)
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className="text-sm">
                        Real-time progress visualization with charts
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className="text-sm">
                        Intelligent feedback loop with automatic adjustments
                      </span>
                    </div>
                  </div>

                  <Button
                    onClick={simulateCompleteWorkflow}
                    disabled={loading}
                    className="w-full bg-healing hover:bg-healing/90"
                  >
                    {loading ? (
                      <Activity className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Play className="h-4 w-4 mr-2" />
                    )}
                    Run Complete Demo
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Key Features</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-medium mb-2 flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-healing" />
                        Smart Scheduling
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Automated therapy planning with practitioner
                        availability and patient preferences.
                      </p>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2 flex items-center">
                        <Bell className="h-4 w-4 mr-2 text-healing" />
                        Intelligent Notifications
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Contextual alerts for pre-care, post-care, and progress
                        updates across multiple channels.
                      </p>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2 flex items-center">
                        <TrendingUp className="h-4 w-4 mr-2 text-healing" />
                        Progress Tracking
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Visual milestone tracking with automated progress
                        calculations and insights.
                      </p>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2 flex items-center">
                        <Heart className="h-4 w-4 mr-2 text-healing" />
                        Feedback Integration
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Dynamic treatment adjustments based on patient feedback
                        and wellness metrics.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="scheduling">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-healing" />
                  <span>Automated Therapy Scheduling</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-healing">
                      {sessions.filter((s) => s.status === "Scheduled").length}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Scheduled Sessions
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-wellness">
                      {practitioners.length}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Available Practitioners
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-earth">
                      {therapyTypes.length}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Therapy Types
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Demo Features:</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Automatic conflict detection</li>
                    <li>• Practitioner availability matching</li>
                    <li>• Pre-session checklist generation</li>
                    <li>• Room assignment optimization</li>
                    <li>• Immediate notification triggers</li>
                  </ul>
                </div>

                <Button
                  onClick={simulateScheduling}
                  disabled={loading}
                  className="w-full"
                >
                  {loading && (
                    <Activity className="h-4 w-4 mr-2 animate-spin" />
                  )}
                  Simulate Automated Scheduling
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bell className="h-5 w-5 text-healing" />
                  <span>Smart Notification System</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-healing">
                      {notifications.filter((n) => !n.read).length}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Unread Notifications
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-wellness">
                      {notifications.filter((n) => n.channels.email).length}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Email Alerts
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-earth">
                      {notifications.filter((n) => n.channels.sms).length}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      SMS Notifications
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Notification Types:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-3 border rounded-lg">
                      <h5 className="font-medium text-blue-600">
                        Session Reminders
                      </h5>
                      <p className="text-sm text-muted-foreground">
                        24h and 2h advance notifications
                      </p>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <h5 className="font-medium text-orange-600">
                        Pre-Care Instructions
                      </h5>
                      <p className="text-sm text-muted-foreground">
                        Preparation guidelines and checklists
                      </p>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <h5 className="font-medium text-green-600">
                        Progress Updates
                      </h5>
                      <p className="text-sm text-muted-foreground">
                        Milestone achievements and improvements
                      </p>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <h5 className="font-medium text-red-600">
                        Health Alerts
                      </h5>
                      <p className="text-sm text-muted-foreground">
                        Important health-related notifications
                      </p>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={simulateNotifications}
                  disabled={loading}
                  className="w-full"
                >
                  {loading && (
                    <Activity className="h-4 w-4 mr-2 animate-spin" />
                  )}
                  Generate Smart Notifications
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="progress">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-healing" />
                  <span>Real-time Progress Tracking</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-healing">
                      {milestones.filter((m) => m.status === "Achieved").length}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Achieved
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-wellness">
                      {
                        milestones.filter((m) => m.status === "In Progress")
                          .length
                      }
                    </div>
                    <div className="text-sm text-muted-foreground">
                      In Progress
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-earth">
                      {milestones.filter((m) => m.status === "Pending").length}
                    </div>
                    <div className="text-sm text-muted-foreground">Pending</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-healing">
                      {milestones.length > 0
                        ? Math.round(
                            (milestones.filter((m) => m.status === "Achieved")
                              .length /
                              milestones.length) *
                              100
                          )
                        : 0}
                      %
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Complete
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Sample Progress Metrics:</h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Stress Reduction</span>
                        <span>75%</span>
                      </div>
                      <Progress value={75} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Sleep Quality</span>
                        <span>85%</span>
                      </div>
                      <Progress value={85} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Energy Levels</span>
                        <span>90%</span>
                      </div>
                      <Progress value={90} className="h-2" />
                    </div>
                  </div>
                </div>

                <Button
                  onClick={simulateProgress}
                  disabled={loading}
                  className="w-full"
                >
                  {loading && (
                    <Activity className="h-4 w-4 mr-2 animate-spin" />
                  )}
                  Update Progress Metrics
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="feedback">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Heart className="h-5 w-5 text-healing" />
                  <span>Integrated Feedback Loop</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-healing">
                      {feedback.length}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Total Feedback
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-wellness">
                      {feedback.length > 0
                        ? (
                            feedback.reduce((sum, f) => sum + f.rating, 0) /
                            feedback.length
                          ).toFixed(1)
                        : "0.0"}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Average Rating
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-earth">
                      {
                        feedback.filter(
                          (f) => f.mood === "Excellent" || f.mood === "Good"
                        ).length
                      }
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Positive Sessions
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">
                    Feedback Integration Features:
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <div>
                        <h5 className="font-medium">
                          Automatic Progress Updates
                        </h5>
                        <p className="text-sm text-muted-foreground">
                          Progress metrics updated based on feedback scores
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <div>
                        <h5 className="font-medium">Smart Recommendations</h5>
                        <p className="text-sm text-muted-foreground">
                          AI-generated treatment adjustments
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <div>
                        <h5 className="font-medium">Alert Generation</h5>
                        <p className="text-sm text-muted-foreground">
                          Automatic alerts for concerning feedback
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <div>
                        <h5 className="font-medium">Milestone Tracking</h5>
                        <p className="text-sm text-muted-foreground">
                          Progress milestones updated in real-time
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={simulateFeedback}
                  disabled={loading}
                  className="w-full"
                >
                  {loading && (
                    <Activity className="h-4 w-4 mr-2 animate-spin" />
                  )}
                  Submit Demo Feedback
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Call to Action */}
        <div className="text-center mt-12 p-8 bg-gradient-to-r from-healing/10 to-wellness/10 rounded-lg">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Ready to Experience the Full System?
          </h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            This demo showcases 70% of the functionality. The complete system
            includes database integration, real-time notifications, advanced
            analytics, and mobile app support.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/dashboard">
              <Button size="lg" className="bg-healing hover:bg-healing/90">
                Explore Patient Dashboard
              </Button>
            </Link>
            <Link to="/schedule">
              <Button size="lg" variant="outline">
                Try Session Scheduling
              </Button>
            </Link>
            <Link to="/progress">
              <Button size="lg" variant="outline">
                View Progress Tracking
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Demo;
