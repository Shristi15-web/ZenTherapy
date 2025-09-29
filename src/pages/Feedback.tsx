import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Star,
  Heart,
  Activity,
  User,
  MessageSquare,
  TrendingUp,
  Smile,
  Zap,
  Moon,
  Apple,
  ThumbsUp,
  ThumbsDown,
  AlertCircle,
  CheckCircle,
  Plus,
  Calendar,
} from "lucide-react";
import { Link } from "react-router-dom";
import { format, parseISO } from "date-fns";
import {
  feedbackService,
  sessionService,
  therapyTypeService,
  practitionerService,
  notificationService,
} from "@/lib/storage";
import { Feedback as FeedbackType } from "@/lib/data";
import { toast } from "sonner";

const Feedback = () => {
  const [loading, setLoading] = useState(true);
  const [feedbackList, setFeedbackList] = useState<FeedbackType[]>([]);
  const [sessions, setSessions] = useState<any[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<string>("");

  const [currentUser] = useState({
    id: "p1",
    name: "Sarah Johnson",
    type: "patient",
  });

  const [newFeedback, setNewFeedback] = useState({
    sessionId: "",
    rating: 5,
    comfort: 5,
    effectiveness: 5,
    mood: "Good" as "Excellent" | "Good" | "Fair" | "Poor",
    energyLevel: 8,
    sleepQuality: 8,
    digestion: 8,
    symptoms: {
      before: [] as string[],
      after: [] as string[],
    },
    sideEffects: [] as string[],
    comments: "",
    recommendations: [] as string[],
  });

  const moodOptions = [
    { value: "Excellent", icon: "😄", color: "text-green-600" },
    { value: "Good", icon: "😊", color: "text-blue-600" },
    { value: "Fair", icon: "😐", color: "text-yellow-600" },
    { value: "Poor", icon: "😔", color: "text-red-600" },
  ];

  const commonSymptoms = [
    "Stress",
    "Anxiety",
    "Fatigue",
    "Headache",
    "Joint Pain",
    "Insomnia",
    "Digestive Issues",
    "Muscle Tension",
    "Depression",
  ];

  const commonSideEffects = [
    "Mild drowsiness",
    "Temporary dizziness",
    "Skin sensitivity",
    "Slight nausea",
    "Increased urination",
    "Emotional release",
  ];

  const commonRecommendations = [
    "Continue current treatment",
    "Increase session frequency",
    "Add meditation practice",
    "Dietary adjustments",
    "More rest",
    "Include yoga practice",
    "Herbal supplements",
  ];

  useEffect(() => {
    loadData();
  }, [currentUser.id]);

  const loadData = () => {
    try {
      const userFeedback = feedbackService.getByPatient(currentUser.id);
      const userSessions = sessionService.getByPatient(currentUser.id);

      setFeedbackList(userFeedback);
      setSessions(userSessions);
      setLoading(false);
    } catch (error) {
      console.error("Error loading feedback data:", error);
      toast.error("Failed to load feedback data");
      setLoading(false);
    }
  };

  const handleSubmitFeedback = () => {
    if (!newFeedback.sessionId) {
      toast.error("Please select a session");
      return;
    }

    try {
      const feedbackData = {
        sessionId: newFeedback.sessionId,
        patientId: currentUser.id,
        rating: newFeedback.rating,
        comfort: newFeedback.comfort,
        effectiveness: newFeedback.effectiveness,
        mood: newFeedback.mood,
        energyLevel: newFeedback.energyLevel,
        sleepQuality: newFeedback.sleepQuality,
        digestion: newFeedback.digestion,
        symptoms: newFeedback.symptoms,
        sideEffects: newFeedback.sideEffects,
        comments: newFeedback.comments,
        recommendations: newFeedback.recommendations,
      };

      feedbackService.create(feedbackData);

      // Create success notification
      notificationService.create({
        type: "Progress",
        title: "Feedback Submitted Successfully",
        message: "Thank you for your feedback! Your progress has been updated.",
        read: false,
        patientId: currentUser.id,
        sessionId: newFeedback.sessionId,
        channels: { inApp: true, email: false, sms: false },
        priority: "Low",
      });

      // Generate automatic recommendations based on feedback
      generateAutomaticRecommendations(feedbackData);

      loadData();
      setIsCreateDialogOpen(false);
      resetFeedbackForm();

      toast.success("Feedback submitted successfully!");
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast.error("Failed to submit feedback");
    }
  };

  const generateAutomaticRecommendations = (feedback: any) => {
    let recommendations = [];

    if (feedback.rating < 3) {
      recommendations.push("Consider adjusting treatment approach");
      notificationService.create({
        type: "Alert",
        title: "Low Session Rating Alert",
        message:
          "Your recent session received a low rating. A practitioner will contact you soon.",
        read: false,
        patientId: currentUser.id,
        channels: { inApp: true, email: true, sms: false },
        priority: "High",
      });
    }

    if (feedback.energyLevel < 5) {
      recommendations.push("Focus on restorative therapies and adequate rest");
    }

    if (feedback.sleepQuality < 6) {
      recommendations.push("Consider adding evening relaxation practices");
    }

    if (feedback.sideEffects.length > 0) {
      recommendations.push(
        "Monitor side effects and adjust treatment intensity"
      );
    }

    if (feedback.rating >= 4 && feedback.energyLevel >= 7) {
      recommendations.push(
        "Excellent progress! Continue current treatment plan"
      );
    }

    if (recommendations.length > 0) {
      notificationService.create({
        type: "Progress",
        title: "Personalized Recommendations",
        message: `Based on your feedback: ${recommendations[0]}`,
        read: false,
        patientId: currentUser.id,
        channels: { inApp: true, email: true, sms: false },
        priority: "Medium",
      });
    }
  };

  const resetFeedbackForm = () => {
    setNewFeedback({
      sessionId: "",
      rating: 5,
      comfort: 5,
      effectiveness: 5,
      mood: "Good",
      energyLevel: 8,
      sleepQuality: 8,
      digestion: 8,
      symptoms: { before: [], after: [] },
      sideEffects: [],
      comments: "",
      recommendations: [],
    });
  };

  const getCompletedSessions = () => {
    return sessions.filter(
      (session) =>
        session.status === "Completed" &&
        !feedbackList.some((feedback) => feedback.sessionId === session.id)
    );
  };

  const toggleArrayItem = (array: string[], item: string) => {
    return array.includes(item)
      ? array.filter((i) => i !== item)
      : [...array, item];
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return "text-green-600";
    if (rating >= 3) return "text-yellow-600";
    return "text-red-600";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Activity className="h-8 w-8 animate-spin text-healing mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your feedback...</p>
        </div>
      </div>
    );
  }

  const completedSessions = getCompletedSessions();

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
                Feedback System
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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Session Feedback
            </h1>
            <p className="text-muted-foreground">
              Share your experience and track your wellness journey
            </p>
          </div>

          {completedSessions.length > 0 && (
            <Dialog
              open={isCreateDialogOpen}
              onOpenChange={setIsCreateDialogOpen}
            >
              <DialogTrigger asChild>
                <Button className="bg-healing hover:bg-healing/90">
                  <Plus className="h-4 w-4 mr-2" />
                  Submit Feedback
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Submit Session Feedback</DialogTitle>
                </DialogHeader>
                <div className="space-y-6">
                  {/* Session Selection */}
                  <div>
                    <Label htmlFor="session">Select Session *</Label>
                    <Select
                      value={newFeedback.sessionId}
                      onValueChange={(value) =>
                        setNewFeedback((prev) => ({
                          ...prev,
                          sessionId: value,
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a completed session" />
                      </SelectTrigger>
                      <SelectContent>
                        {completedSessions.map((session) => {
                          const therapyType = therapyTypeService.getById(
                            session.therapyTypeId
                          );
                          return (
                            <SelectItem key={session.id} value={session.id}>
                              {therapyType?.name} -{" "}
                              {format(parseISO(session.date), "MMM dd, yyyy")}{" "}
                              at {session.time}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Ratings */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <Label>Overall Rating</Label>
                      <div className="flex items-center space-x-2 mt-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-6 w-6 cursor-pointer ${
                              star <= newFeedback.rating
                                ? "text-yellow-500 fill-yellow-500"
                                : "text-gray-300"
                            }`}
                            onClick={() =>
                              setNewFeedback((prev) => ({
                                ...prev,
                                rating: star,
                              }))
                            }
                          />
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {newFeedback.rating}/5 stars
                      </p>
                    </div>

                    <div>
                      <Label>Comfort Level</Label>
                      <div className="flex items-center space-x-2 mt-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Heart
                            key={star}
                            className={`h-6 w-6 cursor-pointer ${
                              star <= newFeedback.comfort
                                ? "text-red-500 fill-red-500"
                                : "text-gray-300"
                            }`}
                            onClick={() =>
                              setNewFeedback((prev) => ({
                                ...prev,
                                comfort: star,
                              }))
                            }
                          />
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label>Effectiveness</Label>
                      <div className="flex items-center space-x-2 mt-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <ThumbsUp
                            key={star}
                            className={`h-6 w-6 cursor-pointer ${
                              star <= newFeedback.effectiveness
                                ? "text-green-500 fill-green-500"
                                : "text-gray-300"
                            }`}
                            onClick={() =>
                              setNewFeedback((prev) => ({
                                ...prev,
                                effectiveness: star,
                              }))
                            }
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Mood Selection */}
                  <div>
                    <Label>Current Mood</Label>
                    <div className="grid grid-cols-4 gap-3 mt-2">
                      {moodOptions.map((mood) => (
                        <div
                          key={mood.value}
                          className={`p-3 border rounded-lg cursor-pointer text-center transition-colors ${
                            newFeedback.mood === mood.value
                              ? "border-healing bg-healing/10"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                          onClick={() =>
                            setNewFeedback((prev) => ({
                              ...prev,
                              mood: mood.value as any,
                            }))
                          }
                        >
                          <div className="text-2xl mb-1">{mood.icon}</div>
                          <div className={`text-sm font-medium ${mood.color}`}>
                            {mood.value}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Wellness Metrics */}
                  <div className="space-y-4">
                    <div>
                      <Label className="flex items-center space-x-2">
                        <Zap className="h-4 w-4" />
                        <span>Energy Level: {newFeedback.energyLevel}/10</span>
                      </Label>
                      <Slider
                        value={[newFeedback.energyLevel]}
                        onValueChange={(value) =>
                          setNewFeedback((prev) => ({
                            ...prev,
                            energyLevel: value[0],
                          }))
                        }
                        max={10}
                        min={1}
                        step={1}
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label className="flex items-center space-x-2">
                        <Moon className="h-4 w-4" />
                        <span>
                          Sleep Quality: {newFeedback.sleepQuality}/10
                        </span>
                      </Label>
                      <Slider
                        value={[newFeedback.sleepQuality]}
                        onValueChange={(value) =>
                          setNewFeedback((prev) => ({
                            ...prev,
                            sleepQuality: value[0],
                          }))
                        }
                        max={10}
                        min={1}
                        step={1}
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label className="flex items-center space-x-2">
                        <Apple className="h-4 w-4" />
                        <span>Digestion: {newFeedback.digestion}/10</span>
                      </Label>
                      <Slider
                        value={[newFeedback.digestion]}
                        onValueChange={(value) =>
                          setNewFeedback((prev) => ({
                            ...prev,
                            digestion: value[0],
                          }))
                        }
                        max={10}
                        min={1}
                        step={1}
                        className="mt-2"
                      />
                    </div>
                  </div>

                  {/* Symptoms */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label>Symptoms Before Session</Label>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        {commonSymptoms.map((symptom) => (
                          <div
                            key={symptom}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox
                              checked={newFeedback.symptoms.before.includes(
                                symptom
                              )}
                              onCheckedChange={() =>
                                setNewFeedback((prev) => ({
                                  ...prev,
                                  symptoms: {
                                    ...prev.symptoms,
                                    before: toggleArrayItem(
                                      prev.symptoms.before,
                                      symptom
                                    ),
                                  },
                                }))
                              }
                            />
                            <Label className="text-sm">{symptom}</Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label>Symptoms After Session</Label>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        {commonSymptoms.map((symptom) => (
                          <div
                            key={symptom}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox
                              checked={newFeedback.symptoms.after.includes(
                                symptom
                              )}
                              onCheckedChange={() =>
                                setNewFeedback((prev) => ({
                                  ...prev,
                                  symptoms: {
                                    ...prev.symptoms,
                                    after: toggleArrayItem(
                                      prev.symptoms.after,
                                      symptom
                                    ),
                                  },
                                }))
                              }
                            />
                            <Label className="text-sm">{symptom}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Side Effects */}
                  <div>
                    <Label>Any Side Effects?</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {commonSideEffects.map((effect) => (
                        <div
                          key={effect}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            checked={newFeedback.sideEffects.includes(effect)}
                            onCheckedChange={() =>
                              setNewFeedback((prev) => ({
                                ...prev,
                                sideEffects: toggleArrayItem(
                                  prev.sideEffects,
                                  effect
                                ),
                              }))
                            }
                          />
                          <Label className="text-sm">{effect}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Comments */}
                  <div>
                    <Label htmlFor="comments">Additional Comments</Label>
                    <Textarea
                      placeholder="Share any additional thoughts about your session..."
                      value={newFeedback.comments}
                      onChange={(e) =>
                        setNewFeedback((prev) => ({
                          ...prev,
                          comments: e.target.value,
                        }))
                      }
                      className="mt-2"
                    />
                  </div>

                  {/* Submit */}
                  <div className="flex space-x-2">
                    <Button onClick={handleSubmitFeedback} className="flex-1">
                      Submit Feedback
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setIsCreateDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>

        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="history">Feedback History</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            {completedSessions.length > 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MessageSquare className="h-5 w-5 text-healing" />
                    <span>Pending Feedback</span>
                    <Badge className="ml-2">
                      {completedSessions.length} session
                      {completedSessions.length !== 1 ? "s" : ""}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {completedSessions.slice(0, 5).map((session) => {
                      const therapyType = therapyTypeService.getById(
                        session.therapyTypeId
                      );
                      const practitioner = practitionerService.getById(
                        session.practitionerId
                      );

                      return (
                        <div
                          key={session.id}
                          className="p-4 border rounded-lg flex items-center justify-between"
                        >
                          <div>
                            <h3 className="font-medium">{therapyType?.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {format(parseISO(session.date), "MMM dd, yyyy")}{" "}
                              at {session.time} • {practitioner?.name}
                            </p>
                          </div>
                          <Button
                            variant="outline"
                            onClick={() => {
                              setNewFeedback((prev) => ({
                                ...prev,
                                sessionId: session.id,
                              }));
                              setIsCreateDialogOpen(true);
                            }}
                          >
                            Provide Feedback
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">All Caught Up!</h3>
                  <p className="text-muted-foreground">
                    You've provided feedback for all your completed sessions.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Your Feedback History</CardTitle>
              </CardHeader>
              <CardContent>
                {feedbackList.length > 0 ? (
                  <div className="space-y-6">
                    {feedbackList.reverse().map((feedback) => {
                      const session = sessions.find(
                        (s) => s.id === feedback.sessionId
                      );
                      const therapyType = session
                        ? therapyTypeService.getById(session.therapyTypeId)
                        : null;

                      return (
                        <div
                          key={feedback.id}
                          className="p-4 border rounded-lg space-y-3"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-medium">
                                {therapyType?.name || "Unknown Session"}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {format(
                                  parseISO(feedback.timestamp),
                                  "MMM dd, yyyy"
                                )}
                              </p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="flex items-center space-x-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-4 w-4 ${
                                      i < feedback.rating
                                        ? "text-yellow-500 fill-yellow-500"
                                        : "text-gray-300"
                                    }`}
                                  />
                                ))}
                              </div>
                              <Badge
                                className={getRatingColor(feedback.rating)}
                              >
                                {feedback.mood}
                              </Badge>
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div className="flex items-center space-x-2">
                              <Zap className="h-4 w-4 text-yellow-500" />
                              <span>Energy: {feedback.energyLevel}/10</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Moon className="h-4 w-4 text-blue-500" />
                              <span>Sleep: {feedback.sleepQuality}/10</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Apple className="h-4 w-4 text-green-500" />
                              <span>Digestion: {feedback.digestion}/10</span>
                            </div>
                          </div>

                          {feedback.comments && (
                            <div className="bg-muted/30 p-3 rounded">
                              <p className="text-sm">{feedback.comments}</p>
                            </div>
                          )}

                          {feedback.sideEffects.length > 0 && (
                            <div className="flex items-center space-x-2">
                              <AlertCircle className="h-4 w-4 text-yellow-500" />
                              <span className="text-sm">
                                Side effects: {feedback.sideEffects.join(", ")}
                              </span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <MessageSquare className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">
                      No Feedback Yet
                    </h3>
                    <p className="text-muted-foreground">
                      Complete a session and provide feedback to start tracking
                      your progress.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="insights">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5 text-healing" />
                    <span>Feedback Insights</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-healing">
                        {feedbackList.length > 0
                          ? (
                              feedbackList.reduce(
                                (sum, f) => sum + f.rating,
                                0
                              ) / feedbackList.length
                            ).toFixed(1)
                          : "0.0"}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Average Rating
                      </div>
                    </div>

                    <div className="text-center">
                      <div className="text-2xl font-bold text-wellness">
                        {feedbackList.length > 0
                          ? (
                              feedbackList.reduce(
                                (sum, f) => sum + f.energyLevel,
                                0
                              ) / feedbackList.length
                            ).toFixed(1)
                          : "0.0"}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Avg Energy Level
                      </div>
                    </div>

                    <div className="text-center">
                      <div className="text-2xl font-bold text-earth">
                        {
                          feedbackList.filter(
                            (f) => f.mood === "Excellent" || f.mood === "Good"
                          ).length
                        }
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Positive Sessions
                      </div>
                    </div>

                    <div className="text-center">
                      <div className="text-2xl font-bold text-healing">
                        {
                          feedbackList.filter((f) => f.sideEffects.length === 0)
                            .length
                        }
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Sessions Without Side Effects
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 space-y-4">
                    <h4 className="font-medium">Your Progress Highlights</h4>
                    <div className="space-y-2 text-sm">
                      <p className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>
                          Consistent improvement in energy levels over time
                        </span>
                      </p>
                      <p className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>
                          High satisfaction with Abhyanga therapy sessions
                        </span>
                      </p>
                      <p className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>Sleep quality showing steady improvement</span>
                      </p>
                    </div>
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

export default Feedback;
