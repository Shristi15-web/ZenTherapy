import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress as ProgressBar } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  TrendingUp,
  Target,
  Calendar,
  Star,
  Activity,
  BarChart3,
  LineChart,
  Trophy,
  User,
  CheckCircle,
  Clock,
  Heart,
  Brain,
  Zap,
  Moon,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import {
  progressService,
  feedbackService,
  sessionService,
  therapyTypeService,
} from "@/lib/storage";
import { format, subDays, parseISO } from "date-fns";

const Progress = () => {
  const [loading, setLoading] = useState(true);
  const [progressData, setProgressData] = useState<any>({});
  const [currentUser] = useState({
    id: "p1",
    name: "Sarah Johnson",
    type: "patient",
  });

  useEffect(() => {
    loadProgressData();
  }, [currentUser.id]);

  const loadProgressData = () => {
    try {
      // Get milestones and progress stats
      const milestones = progressService.getMilestones(currentUser.id);
      const progressStats = progressService.getProgressStats(currentUser.id);

      // Get feedback data for charts
      const feedback = feedbackService.getByPatient(currentUser.id);
      const sessions = sessionService.getByPatient(currentUser.id);

      // Process data for charts
      const progressChartData = generateProgressChartData(feedback);
      const wellnessMetrics = generateWellnessMetrics(feedback);
      const sessionStats = generateSessionStats(sessions);
      const achievementStats = generateAchievementStats(milestones);

      setProgressData({
        milestones,
        progressStats,
        feedback,
        sessions,
        progressChartData,
        wellnessMetrics,
        sessionStats,
        achievementStats,
      });

      setLoading(false);
    } catch (error) {
      console.error("Error loading progress data:", error);
      setLoading(false);
    }
  };

  const generateProgressChartData = (feedback: any[]) => {
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = subDays(new Date(), i);
      return format(date, "yyyy-MM-dd");
    }).reverse();

    return last30Days
      .map((date) => {
        const dayFeedback = feedback.filter(
          (f) => format(parseISO(f.timestamp), "yyyy-MM-dd") === date
        );

        if (dayFeedback.length === 0) {
          return {
            date: format(parseISO(date), "MMM dd"),
            rating: null,
            mood: null,
            energy: null,
          };
        }

        const avgRating =
          dayFeedback.reduce((sum, f) => sum + f.rating, 0) /
          dayFeedback.length;
        const avgEnergy =
          dayFeedback.reduce((sum, f) => sum + f.energyLevel, 0) /
          dayFeedback.length;
        const latestMood = dayFeedback[dayFeedback.length - 1].mood;

        return {
          date: format(parseISO(date), "MMM dd"),
          rating: Math.round(avgRating * 10) / 10,
          energy: Math.round(avgEnergy * 10) / 10,
          mood: latestMood,
          sleep: dayFeedback[dayFeedback.length - 1].sleepQuality,
          digestion: dayFeedback[dayFeedback.length - 1].digestion,
        };
      })
      .filter((data) => data.rating !== null);
  };

  const generateWellnessMetrics = (feedback: any[]) => {
    if (feedback.length === 0) return [];

    const latest = feedback[feedback.length - 1];

    return [
      {
        subject: "Overall Rating",
        current: latest.rating * 2, // Scale to 10
        target: 10,
        fullMark: 10,
      },
      {
        subject: "Energy Level",
        current: latest.energyLevel,
        target: 10,
        fullMark: 10,
      },
      {
        subject: "Sleep Quality",
        current: latest.sleepQuality,
        target: 10,
        fullMark: 10,
      },
      {
        subject: "Digestion",
        current: latest.digestion,
        target: 10,
        fullMark: 10,
      },
      {
        subject: "Comfort Level",
        current: latest.comfort * 2, // Scale to 10
        target: 10,
        fullMark: 10,
      },
      {
        subject: "Effectiveness",
        current: latest.effectiveness * 2, // Scale to 10
        target: 10,
        fullMark: 10,
      },
    ];
  };

  const generateSessionStats = (sessions: any[]) => {
    const completed = sessions.filter((s) => s.status === "Completed").length;
    const scheduled = sessions.filter((s) => s.status === "Scheduled").length;
    const cancelled = sessions.filter((s) => s.status === "Cancelled").length;

    return [
      { name: "Completed", value: completed, color: "#22c55e" },
      { name: "Scheduled", value: scheduled, color: "#3b82f6" },
      { name: "Cancelled", value: cancelled, color: "#ef4444" },
    ];
  };

  const generateAchievementStats = (milestones: any[]) => {
    const achieved = milestones.filter((m) => m.status === "Achieved").length;
    const inProgress = milestones.filter(
      (m) => m.status === "In Progress"
    ).length;
    const pending = milestones.filter((m) => m.status === "Pending").length;

    return {
      total: milestones.length,
      achieved,
      inProgress,
      pending,
      completionRate:
        milestones.length > 0 ? (achieved / milestones.length) * 100 : 0,
    };
  };

  const getMoodColor = (mood: string) => {
    switch (mood) {
      case "Excellent":
        return "text-green-600";
      case "Good":
        return "text-blue-600";
      case "Fair":
        return "text-yellow-600";
      case "Poor":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Achieved":
        return <Trophy className="h-4 w-4 text-yellow-500" />;
      case "In Progress":
        return <Activity className="h-4 w-4 text-blue-500" />;
      case "Pending":
        return <Clock className="h-4 w-4 text-gray-500" />;
      default:
        return <Target className="h-4 w-4 text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Activity className="h-8 w-8 animate-spin text-healing mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your progress...</p>
        </div>
      </div>
    );
  }

  const {
    milestones = [],
    progressStats = {},
    progressChartData = [],
    wellnessMetrics = [],
    sessionStats = [],
    achievementStats = {},
  } = progressData;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/dashboard" className="flex items-center space-x-2">
                <Activity className="h-6 w-6 text-healing" />
                <span className="font-semibold text-lg">PanchakarmaPlus</span>
              </Link>
              <Badge className="bg-healing/10 text-healing">
                Progress Tracking
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-healing/10 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-healing" />
                </div>
                <span className="font-medium">{currentUser.name}</span>
              </div>
              <Link to="/dashboard">
                <Button variant="outline" size="sm">
                  Back to Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Wellness Progress
          </h1>
          <p className="text-muted-foreground">
            Track your healing journey and milestones
          </p>
        </div>

        {/* Progress Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-healing/10 rounded-lg">
                  <Trophy className="h-6 w-6 text-healing" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Achievements</p>
                  <p className="text-2xl font-bold">
                    {achievementStats.achieved || 0}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    of {achievementStats.total || 0} milestones
                  </p>
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
                    Completion Rate
                  </p>
                  <p className="text-2xl font-bold">
                    {Math.round(achievementStats.completionRate || 0)}%
                  </p>
                  <p className="text-xs text-muted-foreground">
                    overall progress
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
                  <p className="text-xs text-muted-foreground">
                    session feedback
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-healing/10 rounded-lg">
                  <Calendar className="h-6 w-6 text-healing" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Sessions Completed
                  </p>
                  <p className="text-2xl font-bold">
                    {progressStats.completedSessions || 0}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    total sessions
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="milestones">Milestones</TabsTrigger>
            <TabsTrigger value="wellness">Wellness Metrics</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Progress Trend Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <LineChart className="h-5 w-5 text-healing" />
                    <span>Progress Trends</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsLineChart data={progressChartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis domain={[0, 10]} />
                        <Tooltip />
                        <Line
                          type="monotone"
                          dataKey="rating"
                          stroke="#8b5cf6"
                          strokeWidth={2}
                          name="Session Rating"
                        />
                        <Line
                          type="monotone"
                          dataKey="energy"
                          stroke="#06b6d4"
                          strokeWidth={2}
                          name="Energy Level"
                        />
                      </RechartsLineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Session Statistics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="h-5 w-5 text-healing" />
                    <span>Session Statistics</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={sessionStats}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, value }) => `${name}: ${value}`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {sessionStats.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Progress Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Progress Summary</CardTitle>
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
                          <Badge variant="outline" className="text-xs">
                            {milestone.category}
                          </Badge>
                        </div>
                        {milestone.metrics.map((metric, index) => (
                          <div key={index} className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>{metric.name}</span>
                              <span>
                                {metric.current}/{metric.target} {metric.unit}
                              </span>
                            </div>
                            <ProgressBar
                              value={(metric.current / metric.target) * 100}
                              className="h-2"
                            />
                          </div>
                        ))}
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="milestones">
            <div className="space-y-6">
              {["Achieved", "In Progress", "Pending"].map((status) => {
                const statusMilestones = milestones.filter(
                  (m) => m.status === status
                );
                if (statusMilestones.length === 0) return null;

                return (
                  <Card key={status}>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        {getStatusIcon(status)}
                        <span>
                          {status} Milestones ({statusMilestones.length})
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {statusMilestones.map((milestone) => (
                          <div
                            key={milestone.id}
                            className="p-4 border rounded-lg space-y-4"
                          >
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="font-medium">
                                  {milestone.title}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                  {milestone.description}
                                </p>
                              </div>
                              <Badge variant="outline" className="ml-2">
                                {milestone.category}
                              </Badge>
                            </div>

                            <div className="space-y-3">
                              {milestone.metrics.map((metric, index) => (
                                <div key={index} className="space-y-1">
                                  <div className="flex justify-between text-sm">
                                    <span>{metric.name}</span>
                                    <span>
                                      {metric.current}/{metric.target}{" "}
                                      {metric.unit}
                                    </span>
                                  </div>
                                  <ProgressBar
                                    value={
                                      (metric.current / metric.target) * 100
                                    }
                                    className="h-2"
                                  />
                                </div>
                              ))}
                            </div>

                            <div className="flex justify-between text-xs text-muted-foreground">
                              <span>
                                Target:{" "}
                                {format(
                                  parseISO(milestone.targetDate),
                                  "MMM dd, yyyy"
                                )}
                              </span>
                              {milestone.achievedDate && (
                                <span>
                                  Achieved:{" "}
                                  {format(
                                    parseISO(milestone.achievedDate),
                                    "MMM dd, yyyy"
                                  )}
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="wellness">
            <div className="space-y-8">
              {/* Wellness Radar Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Heart className="h-5 w-5 text-healing" />
                    <span>Wellness Overview</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-96">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={wellnessMetrics}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="subject" />
                        <PolarRadiusAxis angle={30} domain={[0, 10]} />
                        <Radar
                          name="Current"
                          dataKey="current"
                          stroke="#8b5cf6"
                          fill="#8b5cf6"
                          fillOpacity={0.3}
                        />
                        <Radar
                          name="Target"
                          dataKey="target"
                          stroke="#06b6d4"
                          fill="#06b6d4"
                          fillOpacity={0.1}
                        />
                        <Tooltip />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Detailed Wellness Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  {
                    name: "Energy Level",
                    icon: Zap,
                    color: "text-yellow-500",
                    data:
                      progressChartData[progressChartData.length - 1]?.energy ||
                      0,
                  },
                  {
                    name: "Sleep Quality",
                    icon: Moon,
                    color: "text-blue-500",
                    data:
                      progressChartData[progressChartData.length - 1]?.sleep ||
                      0,
                  },
                  {
                    name: "Mental Clarity",
                    icon: Brain,
                    color: "text-purple-500",
                    data:
                      progressChartData[progressChartData.length - 1]?.rating *
                        2 || 0,
                  },
                  {
                    name: "Overall Well-being",
                    icon: Heart,
                    color: "text-red-500",
                    data:
                      progressChartData[progressChartData.length - 1]
                        ?.digestion || 0,
                  },
                ].map((metric, index) => (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-3 mb-4">
                        <metric.icon className={`h-6 w-6 ${metric.color}`} />
                        <h3 className="font-medium">{metric.name}</h3>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Current</span>
                          <span>{metric.data.toFixed(1)}/10</span>
                        </div>
                        <ProgressBar
                          value={(metric.data / 10) * 100}
                          className="h-3"
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="insights">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Progress Insights & Recommendations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Positive Trends */}
                  <div>
                    <h3 className="font-medium text-green-600 mb-3 flex items-center">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Positive Trends
                    </h3>
                    <div className="space-y-2 text-sm">
                      <p>
                        ✅ Your session ratings have improved by 15% over the
                        last month
                      </p>
                      <p>✅ Energy levels show consistent upward trend</p>
                      <p>✅ Sleep quality has stabilized above target levels</p>
                    </div>
                  </div>

                  {/* Areas for Improvement */}
                  <div>
                    <h3 className="font-medium text-yellow-600 mb-3 flex items-center">
                      <Target className="h-4 w-4 mr-2" />
                      Areas for Focus
                    </h3>
                    <div className="space-y-2 text-sm">
                      <p>
                        ⚠️ Consider increasing meditation practice for stress
                        management
                      </p>
                      <p>
                        ⚠️ Digestive health metrics could benefit from dietary
                        adjustments
                      </p>
                      <p>
                        ⚠️ Schedule more frequent follow-up sessions for optimal
                        progress
                      </p>
                    </div>
                  </div>

                  {/* Recommendations */}
                  <div>
                    <h3 className="font-medium text-blue-600 mb-3 flex items-center">
                      <Activity className="h-4 w-4 mr-2" />
                      Personalized Recommendations
                    </h3>
                    <div className="space-y-2 text-sm">
                      <p>
                        💡 Your body responds well to morning sessions -
                        consider scheduling more
                      </p>
                      <p>
                        💡 Abhyanga therapy shows the best results for your
                        constitution
                      </p>
                      <p>
                        💡 Continue current treatment plan with minor
                        adjustments to timing
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <Link to="/feedback">
                      <Button>Provide Session Feedback</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Progress;
