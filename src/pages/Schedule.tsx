import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar as CalendarIcon,
  Clock,
  Plus,
  Edit,
  Trash2,
  User,
  MapPin,
  AlertCircle,
  CheckCircle,
  Activity,
  Filter,
  Search,
} from "lucide-react";
import { Link } from "react-router-dom";
import { format, addDays, startOfWeek, addWeeks } from "date-fns";
import {
  sessionService,
  therapyTypeService,
  practitionerService,
  notificationService,
} from "@/lib/storage";
import { TherapySession } from "@/lib/data";
import { toast } from "sonner";

const Schedule = () => {
  const [sessions, setSessions] = useState<TherapySession[]>([]);
  const [filteredSessions, setFilteredSessions] = useState<TherapySession[]>(
    []
  );
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingSession, setEditingSession] = useState<TherapySession | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"calendar" | "list">("calendar");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  const [currentUser] = useState({
    id: "p1",
    name: "Sarah Johnson",
    type: "patient",
  });
  const [newSession, setNewSession] = useState({
    therapyTypeId: "",
    practitionerId: "",
    date: "",
    time: "",
    notes: "",
    room: "Room A",
  });

  const therapyTypes = therapyTypeService.getAll();
  const practitioners = practitionerService.getAll();

  const timeSlots = [
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "12:00",
    "12:30",
    "13:00",
    "13:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
    "17:30",
    "18:00",
  ];

  const rooms = ["Room A", "Room B", "Room C", "VIP Suite"];

  useEffect(() => {
    loadSessions();
  }, [currentUser.id]);

  useEffect(() => {
    filterAndSearchSessions();
  }, [sessions, filterStatus, searchTerm]);

  const loadSessions = () => {
    try {
      const userSessions = sessionService.getByPatient(currentUser.id);
      setSessions(userSessions);
      setLoading(false);
    } catch (error) {
      console.error("Error loading sessions:", error);
      toast.error("Failed to load sessions");
      setLoading(false);
    }
  };

  const filterAndSearchSessions = () => {
    let filtered = sessions;

    // Filter by status
    if (filterStatus !== "all") {
      filtered = filtered.filter((session) => session.status === filterStatus);
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter((session) => {
        const therapyType = therapyTypeService.getById(session.therapyTypeId);
        const practitioner = practitionerService.getById(
          session.practitionerId
        );
        return (
          therapyType?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          practitioner?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          session.notes.toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
    }

    setFilteredSessions(filtered);
  };

  const handleCreateSession = () => {
    if (!newSession.therapyTypeId || !newSession.date || !newSession.time) {
      toast.error("Please fill in all required fields");
      return;
    }

    const therapyType = therapyTypeService.getById(newSession.therapyTypeId);
    if (!therapyType) {
      toast.error("Invalid therapy type selected");
      return;
    }

    // Check for conflicts
    const existingSessions = sessionService.getByDateRange(
      newSession.date,
      newSession.date
    );
    const hasConflict = existingSessions.some(
      (session) =>
        session.time === newSession.time &&
        session.patientId === currentUser.id &&
        session.status !== "Cancelled"
    );

    if (hasConflict) {
      toast.error("You already have a session scheduled at this time");
      return;
    }

    try {
      const sessionData = {
        patientId: currentUser.id,
        therapyTypeId: newSession.therapyTypeId,
        practitionerId: newSession.practitionerId || practitioners[0].id,
        date: newSession.date,
        time: newSession.time,
        status: "Scheduled" as const,
        notes: newSession.notes,
        preSessionChecklist: therapyType.preparations.map((prep) => ({
          item: prep,
          completed: false,
        })),
        postSessionNotes: "",
        duration: therapyType.duration,
        room: newSession.room,
      };

      const createdSession = sessionService.create(sessionData);

      // Create success notification
      notificationService.create({
        type: "Reminder",
        title: "Session Scheduled Successfully",
        message: `Your ${therapyType.name} session has been scheduled for ${newSession.date} at ${newSession.time}`,
        read: false,
        patientId: currentUser.id,
        sessionId: createdSession.id,
        channels: { inApp: true, email: true, sms: false },
        priority: "Medium",
      });

      loadSessions();
      setIsCreateDialogOpen(false);
      setNewSession({
        therapyTypeId: "",
        practitionerId: "",
        date: "",
        time: "",
        notes: "",
        room: "Room A",
      });

      toast.success("Session scheduled successfully!");
    } catch (error) {
      console.error("Error creating session:", error);
      toast.error("Failed to schedule session");
    }
  };

  const handleUpdateSession = (
    sessionId: string,
    updates: Partial<TherapySession>
  ) => {
    try {
      sessionService.update(sessionId, updates);
      loadSessions();
      setEditingSession(null);
      toast.success("Session updated successfully!");
    } catch (error) {
      console.error("Error updating session:", error);
      toast.error("Failed to update session");
    }
  };

  const handleCancelSession = (sessionId: string) => {
    try {
      sessionService.update(sessionId, { status: "Cancelled" });
      loadSessions();
      toast.success("Session cancelled successfully");
    } catch (error) {
      console.error("Error cancelling session:", error);
      toast.error("Failed to cancel session");
    }
  };

  const getSessionsForDate = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    return filteredSessions.filter((session) => session.date === dateStr);
  };

  const getWeekDates = (startDate: Date) => {
    const weekStart = startOfWeek(startDate, { weekStartsOn: 1 });
    return Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Scheduled":
        return "bg-blue-100 text-blue-800";
      case "In Progress":
        return "bg-yellow-100 text-yellow-800";
      case "Completed":
        return "bg-green-100 text-green-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Activity className="h-8 w-8 animate-spin text-healing mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your schedule...</p>
        </div>
      </div>
    );
  }

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
                Schedule Management
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
              Session Schedule
            </h1>
            <p className="text-muted-foreground">
              Manage your therapy sessions and appointments
            </p>
          </div>

          <Dialog
            open={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
          >
            <DialogTrigger asChild>
              <Button className="bg-healing hover:bg-healing/90">
                <Plus className="h-4 w-4 mr-2" />
                Schedule Session
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Schedule New Session</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="therapy-type">Therapy Type *</Label>
                  <Select
                    value={newSession.therapyTypeId}
                    onValueChange={(value) =>
                      setNewSession((prev) => ({
                        ...prev,
                        therapyTypeId: value,
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select therapy type" />
                    </SelectTrigger>
                    <SelectContent>
                      {therapyTypes.map((therapy) => (
                        <SelectItem key={therapy.id} value={therapy.id}>
                          {therapy.name} ({therapy.duration} min)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="practitioner">Practitioner</Label>
                  <Select
                    value={newSession.practitionerId}
                    onValueChange={(value) =>
                      setNewSession((prev) => ({
                        ...prev,
                        practitionerId: value,
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select practitioner (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      {practitioners.map((practitioner) => (
                        <SelectItem
                          key={practitioner.id}
                          value={practitioner.id}
                        >
                          {practitioner.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="date">Date *</Label>
                  <Input
                    type="date"
                    value={newSession.date}
                    min={format(new Date(), "yyyy-MM-dd")}
                    onChange={(e) =>
                      setNewSession((prev) => ({
                        ...prev,
                        date: e.target.value,
                      }))
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="time">Time *</Label>
                  <Select
                    value={newSession.time}
                    onValueChange={(value) =>
                      setNewSession((prev) => ({ ...prev, time: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select time slot" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="room">Room</Label>
                  <Select
                    value={newSession.room}
                    onValueChange={(value) =>
                      setNewSession((prev) => ({ ...prev, room: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {rooms.map((room) => (
                        <SelectItem key={room} value={room}>
                          {room}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    placeholder="Any special requirements or notes..."
                    value={newSession.notes}
                    onChange={(e) =>
                      setNewSession((prev) => ({
                        ...prev,
                        notes: e.target.value,
                      }))
                    }
                  />
                </div>

                <div className="flex space-x-2">
                  <Button onClick={handleCreateSession} className="flex-1">
                    Schedule Session
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
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="flex items-center space-x-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search sessions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-48"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="Scheduled">Scheduled</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex-1" />

              <Tabs
                value={viewMode}
                onValueChange={(value) =>
                  setViewMode(value as "calendar" | "list")
                }
              >
                <TabsList>
                  <TabsTrigger value="calendar">Calendar</TabsTrigger>
                  <TabsTrigger value="list">List</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardContent>
        </Card>

        {viewMode === "calendar" ? (
          <div className="space-y-6">
            {/* Week Navigation */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>
                    Week of{" "}
                    {format(
                      startOfWeek(selectedDate, { weekStartsOn: 1 }),
                      "MMM dd, yyyy"
                    )}
                  </CardTitle>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setSelectedDate((prev) => addWeeks(prev, -1))
                      }
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedDate(new Date())}
                    >
                      Today
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setSelectedDate((prev) => addWeeks(prev, 1))
                      }
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-4">
                  {getWeekDates(selectedDate).map((date, index) => (
                    <div key={index} className="space-y-2">
                      <div className="text-center">
                        <p className="text-sm font-medium">
                          {format(date, "EEE")}
                        </p>
                        <p
                          className={`text-lg ${
                            format(date, "yyyy-MM-dd") ===
                            format(new Date(), "yyyy-MM-dd")
                              ? "text-healing font-bold"
                              : "text-foreground"
                          }`}
                        >
                          {format(date, "d")}
                        </p>
                      </div>

                      <div className="space-y-1 min-h-[200px]">
                        {getSessionsForDate(date).map((session) => {
                          const therapyType = therapyTypeService.getById(
                            session.therapyTypeId
                          );
                          const practitioner = practitionerService.getById(
                            session.practitionerId
                          );

                          return (
                            <div
                              key={session.id}
                              className="p-2 bg-healing/10 border border-healing/20 rounded text-xs cursor-pointer hover:bg-healing/20 transition-colors"
                              onClick={() => setEditingSession(session)}
                            >
                              <p className="font-medium">{session.time}</p>
                              <p className="text-healing">
                                {therapyType?.name}
                              </p>
                              <p className="text-muted-foreground">
                                {practitioner?.name}
                              </p>
                              <Badge
                                className={`text-xs ${getStatusColor(
                                  session.status
                                )}`}
                              >
                                {session.status}
                              </Badge>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>All Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              {filteredSessions.length > 0 ? (
                <div className="space-y-4">
                  {filteredSessions.map((session) => {
                    const therapyType = therapyTypeService.getById(
                      session.therapyTypeId
                    );
                    const practitioner = practitionerService.getById(
                      session.practitionerId
                    );

                    return (
                      <div
                        key={session.id}
                        className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => setEditingSession(session)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="font-semibold text-lg">
                                {therapyType?.name}
                              </h3>
                              <Badge className={getStatusColor(session.status)}>
                                {session.status}
                              </Badge>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center space-x-1">
                                <CalendarIcon className="h-4 w-4" />
                                <span>
                                  {format(
                                    new Date(session.date),
                                    "MMM dd, yyyy"
                                  )}
                                </span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Clock className="h-4 w-4" />
                                <span>
                                  {session.time} ({session.duration} min)
                                </span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <User className="h-4 w-4" />
                                <span>{practitioner?.name}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <MapPin className="h-4 w-4" />
                                <span>{session.room}</span>
                              </div>
                            </div>

                            {session.notes && (
                              <p className="text-sm text-muted-foreground mt-2">
                                {session.notes}
                              </p>
                            )}
                          </div>

                          <div className="flex space-x-2">
                            {session.status === "Scheduled" && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCancelSession(session.id);
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingSession(session);
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <CalendarIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">
                    No sessions found
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    {searchTerm || filterStatus !== "all"
                      ? "Try adjusting your filters or search terms"
                      : "Schedule your first therapy session to get started"}
                  </p>
                  <Button onClick={() => setIsCreateDialogOpen(true)}>
                    Schedule Session
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Edit Session Dialog */}
        {editingSession && (
          <Dialog
            open={!!editingSession}
            onOpenChange={() => setEditingSession(null)}
          >
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Session Details</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                {(() => {
                  const therapyType = therapyTypeService.getById(
                    editingSession.therapyTypeId
                  );
                  const practitioner = practitionerService.getById(
                    editingSession.practitionerId
                  );

                  return (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Therapy Type</Label>
                          <p className="font-medium">{therapyType?.name}</p>
                        </div>
                        <div>
                          <Label>Practitioner</Label>
                          <p className="font-medium">{practitioner?.name}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label>Date</Label>
                          <p className="font-medium">
                            {format(
                              new Date(editingSession.date),
                              "MMM dd, yyyy"
                            )}
                          </p>
                        </div>
                        <div>
                          <Label>Time</Label>
                          <p className="font-medium">{editingSession.time}</p>
                        </div>
                        <div>
                          <Label>Duration</Label>
                          <p className="font-medium">
                            {editingSession.duration} min
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Room</Label>
                          <p className="font-medium">{editingSession.room}</p>
                        </div>
                        <div>
                          <Label>Status</Label>
                          <Badge
                            className={getStatusColor(editingSession.status)}
                          >
                            {editingSession.status}
                          </Badge>
                        </div>
                      </div>

                      {editingSession.notes && (
                        <div>
                          <Label>Notes</Label>
                          <p className="text-sm text-muted-foreground">
                            {editingSession.notes}
                          </p>
                        </div>
                      )}

                      {therapyType && (
                        <div className="space-y-3">
                          <Label>Pre-Session Checklist</Label>
                          <div className="space-y-2">
                            {editingSession.preSessionChecklist.map(
                              (item, index) => (
                                <div
                                  key={index}
                                  className="flex items-center space-x-2"
                                >
                                  <CheckCircle
                                    className={`h-4 w-4 ${
                                      item.completed
                                        ? "text-green-500"
                                        : "text-muted-foreground"
                                    }`}
                                  />
                                  <span
                                    className={`text-sm ${
                                      item.completed
                                        ? "line-through text-muted-foreground"
                                        : ""
                                    }`}
                                  >
                                    {item.item}
                                  </span>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      )}

                      <div className="flex space-x-2">
                        {editingSession.status === "Scheduled" && (
                          <Button
                            variant="destructive"
                            onClick={() => {
                              handleCancelSession(editingSession.id);
                              setEditingSession(null);
                            }}
                          >
                            Cancel Session
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          onClick={() => setEditingSession(null)}
                        >
                          Close
                        </Button>
                      </div>
                    </>
                  );
                })()}
              </div>
            </DialogContent>
          </Dialog>
        )}
      </main>
    </div>
  );
};

export default Schedule;
