import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar,
  Clock,
  TrendingUp,
  Heart,
  Bell,
  CheckCircle,
  Activity,
  Star,
  User,
  Settings,
  BarChart3,
  Target,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import {
  sessionService,
  notificationService,
  feedbackService,
  progressService,
  patientService,
  therapyTypeService,
  practitionerService,
} from "@/lib/storage";
import { toast } from "sonner";

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<any>({});
  const [currentUser] = useState({
    id: "p1",
    name: "Sarah Johnson",
    type: "patient",
  });

  useEffect(() => {
    const loadDashboardData = () => {
      try {
        // Get patient sessions
        const sessions = sessionService.getByPatient(currentUser.id);
        const upcomingSessions = sessionService.getUpcoming(5);
        const todaySessions = sessions.filter(
          (s) => s.date === new Date().toISOString().split("T")[0]
        );

        // Get notifications
        const notifications = notificationService.getByPatient(currentUser.id);
        const unreadNotifications = notifications.filter((n) => !n.read);

        // Get feedback and progress
        const feedback = feedbackService.getByPatient(currentUser.id);
        const milestones = progressService.getMilestones(currentUser.id);
        const progressStats = progressService.getProgressStats(currentUser.id);

        // Get patient details
        const patient = patientService.getById(currentUser.id);

        setDashboardData({
          sessions,
          upcomingSessions,
          todaySessions,
          notifications,
          unreadNotifications,
          feedback,
          milestones,
          progressStats,
          patient,
        });

        setLoading(false);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
        toast.error("Failed to load dashboard data");
        setLoading(false);
      }
    };

    loadDashboardData();

    // Refresh data every 30 seconds
    const interval = setInterval(loadDashboardData, 30000);
    return () => clearInterval(interval);
  }, [currentUser.id]);

  const markNotificationAsRead = (notificationId: string) => {
    notificationService.markAsRead(notificationId);
    // Refresh notifications
    const notifications = notificationService.getByPatient(currentUser.id);
    setDashboardData((prev) => ({
      ...prev,
      notifications,
      unreadNotifications: notifications.filter((n) => !n.read),
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Activity className="h-8 w-8 animate-spin text-healing mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const {
    sessions = [],
    upcomingSessions = [],
    todaySessions = [],
    notifications = [],
    unreadNotifications = [],
    feedback = [],
    milestones = [],
    progressStats = {},
    patient = {},
  } = dashboardData;

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
              <Badge variant="secondary" className="bg-healing/10 text-healing">
                Patient Portal
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Bell className="h-5 w-5 text-muted-foreground cursor-pointer hover:text-foreground" />
                {unreadNotifications.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {unreadNotifications.length}
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-healing/10 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-healing" />
                </div>
                <span className="font-medium">{currentUser.name}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/login")}
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome back, {currentUser.name}! 👋
          </h1>
          <p className="text-muted-foreground">
            Here's your wellness journey overview and upcoming sessions.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-healing/10 rounded-lg">
                  <Calendar className="h-6 w-6 text-healing" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Today's Sessions
                  </p>
                  <p className="text-2xl font-bold">{todaySessions.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-wellness/10 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-wellness" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Completed Sessions
                  </p>
                  <p className="text-2xl font-bold">
                    {progressStats.completedSessions || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-earth/10 rounded-lg">
                  <Star className="h-6 w-6 text-earth" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Average Rating
                  </p>
                  <p className="text-2xl font-bold">
                    {progressStats.averageRating
                      ? progressStats.averageRating.toFixed(1)
                      : "0.0"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-healing/10 rounded-lg">
                  <Target className="h-6 w-6 text-healing" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Progress</p>
                  <p className="text-2xl font-bold">
                    {Math.round(progressStats.milestoneProgress || 0)}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="sessions">Sessions</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Upcoming Sessions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-healing" />
                    <span>Upcoming Sessions</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {upcomingSessions.length > 0 ? (
                    <div className="space-y-4">
                      {upcomingSessions.slice(0, 3).map((session) => {
                        const therapyType = therapyTypeService.getById(
                          session.therapyTypeId
                        );
                        const practitioner = practitionerService.getById(
                          session.practitionerId
                        );
                        return (
                          <div
                            key={session.id}
                            className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                          >
                            <div>
                              <p className="font-medium">
                                {therapyType?.name || "Unknown Therapy"}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {session.date} at {session.time} •{" "}
                                {practitioner?.name || "TBD"}
                              </p>
                            </div>
                            <Badge variant="outline">{session.status}</Badge>
                          </div>
                        );
                      })}
                      <Link to="/schedule">
                        <Button variant="outline" className="w-full">
                          View All Sessions
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground mb-4">
                        No upcoming sessions
                      </p>
                      <Link to="/schedule">
                        <Button>Schedule a Session</Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Recent Feedback */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Heart className="h-5 w-5 text-healing" />
                    <span>Recent Feedback</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {feedback.length > 0 ? (
                    <div className="space-y-4">
                      {feedback
                        .slice(-3)
                        .reverse()
                        .map((fb) => (
                          <div
                            key={fb.id}
                            className="p-3 bg-muted/30 rounded-lg"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center space-x-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-4 w-4 ${
                                      i < fb.rating
                                        ? "text-earth fill-earth"
                                        : "text-muted-foreground"
                                    }`}
                                  />
                                ))}
                              </div>
                              <Badge variant="secondary">{fb.mood}</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {fb.comments}
                            </p>
                          </div>
                        ))}
                      <Link to="/feedback">
                        <Button variant="outline" className="w-full">
                          View All Feedback
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground mb-4">
                        No feedback yet
                      </p>
                      <Link to="/feedback">
                        <Button>Submit Feedback</Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Progress Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-healing" />
                  <span>Progress Overview</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {milestones
                    .filter((m) => m.status === "In Progress")
                    .slice(0, 3)
                    .map((milestone) => (
                      <div key={milestone.id} className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{milestone.title}</h4>
                          <Badge variant="outline">{milestone.status}</Badge>
                        </div>
                        {milestone.metrics.map((metric, index) => (
                          <div key={index} className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>{metric.name}</span>
                              <span>
                                {metric.current}/{metric.target} {metric.unit}
                              </span>
                            </div>
                            <Progress
                              value={(metric.current / metric.target) * 100}
                              className="h-2"
                            />
                          </div>
                        ))}
                      </div>
                    ))}
                </div>
                <div className="mt-6">
                  <Link to="/progress">
                    <Button variant="outline" className="w-full">
                      View Detailed Progress
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sessions">
            <Card>
              <CardHeader>
                <CardTitle>Session Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">
                    Manage Your Sessions
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Schedule, reschedule, or view details of your therapy
                    sessions
                  </p>
                  <Link to="/schedule">
                    <Button size="lg">Go to Schedule</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="progress">
            <Card>
              <CardHeader>
                <CardTitle>Progress Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <BarChart3 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">
                    Track Your Wellness Journey
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    View detailed progress reports, milestones, and wellness
                    metrics
                  </p>
                  <Link to="/progress">
                    <Button size="lg">View Progress</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Notifications</span>
                  {unreadNotifications.length > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        notificationService.markAllAsRead();
                        setDashboardData((prev) => ({
                          ...prev,
                          unreadNotifications: [],
                        }));
                      }}
                    >
                      Mark All Read
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {notifications.length > 0 ? (
                  <div className="space-y-4">
                    {notifications.slice(0, 10).map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          notification.read
                            ? "bg-muted/30 border-muted"
                            : "bg-card border-healing/20 shadow-sm"
                        }`}
                        onClick={() => markNotificationAsRead(notification.id)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h4 className="font-medium">
                                {notification.title}
                              </h4>
                              <Badge
                                variant={
                                  notification.priority === "High"
                                    ? "destructive"
                                    : "secondary"
                                }
                                className="text-xs"
                              >
                                {notification.priority}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              {notification.message}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(
                                notification.timestamp
                              ).toLocaleString()}
                            </p>
                          </div>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-healing rounded-full flex-shrink-0 mt-2"></div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No notifications</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;
