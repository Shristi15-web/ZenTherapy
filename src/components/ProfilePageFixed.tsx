import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit,
  Save,
  X,
} from "lucide-react";
import { authService } from "@/data/auth.js";
import { bookingService } from "@/data/appointments.js";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userAppointments, setUserAppointments] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
    },
    emergencyContact: {
      name: "",
      phone: "",
      relationship: "",
    },
    medicalHistory: [],
    allergies: [],
    constitution: "",
    goals: [],
    preferences: {
      notifications: {
        email: true,
        sms: true,
        push: true,
      },
      language: "English",
      theme: "light",
      timezone: "America/New_York",
    },
  });

  const { toast } = useToast();

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      setFormData({
        name: currentUser.name || "",
        email: currentUser.email || "",
        phone: currentUser.phone || "",
        dateOfBirth: currentUser.dateOfBirth || "",
        address: currentUser.address || {
          street: "",
          city: "",
          state: "",
          zipCode: "",
          country: "USA",
        },
        emergencyContact: currentUser.emergencyContact || {
          name: "",
          phone: "",
          relationship: "",
        },
        medicalHistory: currentUser.medicalHistory || [],
        allergies: currentUser.allergies || [],
        constitution: currentUser.constitution || "",
        goals: currentUser.goals || [],
        preferences: currentUser.preferences || {
          notifications: {
            email: true,
            sms: true,
            push: true,
          },
          language: "English",
          theme: "light",
          timezone: "America/New_York",
        },
      });

      // Load user appointments
      const appointments = bookingService.getUserAppointments(currentUser.id);
      setUserAppointments(appointments);
    }
  }, []);

  const handleSave = async () => {
    setLoading(true);
    try {
      const result = await authService.updateProfile(formData);
      if (result.success) {
        setUser(result.user);
        setEditing(false);
        toast({
          title: "Profile Updated",
          description: "Your profile has been successfully updated.",
        });
      } else {
        toast({
          title: "Update Failed",
          description: result.error || "Unable to update profile.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        dateOfBirth: user.dateOfBirth || "",
        address: user.address || {
          street: "",
          city: "",
          state: "",
          zipCode: "",
          country: "USA",
        },
        emergencyContact: user.emergencyContact || {
          name: "",
          phone: "",
          relationship: "",
        },
        medicalHistory: user.medicalHistory || [],
        allergies: user.allergies || [],
        constitution: user.constitution || "",
        goals: user.goals || [],
        preferences: user.preferences || {
          notifications: {
            email: true,
            sms: true,
            push: true,
          },
          language: "English",
          theme: "light",
          timezone: "America/New_York",
        },
      });
    }
    setEditing(false);
  };

  const addArrayItem = (field, value) => {
    if (value.trim()) {
      setFormData((prev) => ({
        ...prev,
        [field]: [...prev[field], value.trim()],
      }));
    }
  };

  const removeArrayItem = (field, index) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  if (!user) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-6 text-center">
            <p>Please log in to view your profile.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">My Profile</h1>
          <p className="text-muted-foreground">
            Manage your personal information and preferences
          </p>
        </div>

        {!editing ? (
          <Button onClick={() => setEditing(true)}>
            <Edit className="w-4 h-4 mr-2" />
            Edit Profile
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleCancel}>
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={loading}>
              <Save className="w-4 h-4 mr-2" />
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        )}
      </div>

      <Tabs defaultValue="personal" className="space-y-4">
        <TabsList>
          <TabsTrigger value="personal">Personal Info</TabsTrigger>
          <TabsTrigger value="medical">Medical History</TabsTrigger>
          <TabsTrigger value="appointments">My Appointments</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="space-y-4">
          {/* Profile Overview */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <Avatar className="w-20 h-20">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="text-xl">
                    {user.name
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-2xl">{user.name}</CardTitle>
                  <CardDescription className="text-lg">
                    {user.email}
                  </CardDescription>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="secondary">{user.role}</Badge>
                    {user.constitution && (
                      <Badge variant="outline">
                        {user.constitution} Constitution
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    disabled={!editing}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    disabled={!editing}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        phone: e.target.value,
                      }))
                    }
                    disabled={!editing}
                  />
                </div>
                <div>
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        dateOfBirth: e.target.value,
                      }))
                    }
                    disabled={!editing}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="constitution">Ayurvedic Constitution</Label>
                <Select
                  value={formData.constitution}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, constitution: value }))
                  }
                  disabled={!editing}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your constitution" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Vata">Vata</SelectItem>
                    <SelectItem value="Pitta">Pitta</SelectItem>
                    <SelectItem value="Kapha">Kapha</SelectItem>
                    <SelectItem value="Vata-Pitta">Vata-Pitta</SelectItem>
                    <SelectItem value="Pitta-Kapha">Pitta-Kapha</SelectItem>
                    <SelectItem value="Vata-Kapha">Vata-Kapha</SelectItem>
                    <SelectItem value="Tridoshic">Tridoshic</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="medical" className="space-y-4">
          {/* Medical History */}
          <Card>
            <CardHeader>
              <CardTitle>Medical History</CardTitle>
              <CardDescription>
                Please list any relevant medical conditions or treatments
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {formData.medicalHistory.map((condition, index) => (
                  <Badge key={index} variant="outline" className="text-sm">
                    {condition}
                    {editing && (
                      <button
                        onClick={() => removeArrayItem("medicalHistory", index)}
                        className="ml-2 text-red-500 hover:text-red-700"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </Badge>
                ))}
              </div>

              {editing && (
                <div className="flex gap-2">
                  <Input
                    placeholder="Add medical condition"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        addArrayItem("medicalHistory", e.target.value);
                        e.target.value = "";
                      }
                    }}
                  />
                  <Button
                    type="button"
                    onClick={(e) => {
                      const input =
                        e.target.parentElement.querySelector("input");
                      addArrayItem("medicalHistory", input.value);
                      input.value = "";
                    }}
                  >
                    Add
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Allergies */}
          <Card>
            <CardHeader>
              <CardTitle>Allergies</CardTitle>
              <CardDescription>
                List any known allergies to medications, foods, or other
                substances
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {formData.allergies.map((allergy, index) => (
                  <Badge key={index} variant="destructive" className="text-sm">
                    {allergy}
                    {editing && (
                      <button
                        onClick={() => removeArrayItem("allergies", index)}
                        className="ml-2 text-white hover:text-gray-200"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </Badge>
                ))}
              </div>

              {editing && (
                <div className="flex gap-2">
                  <Input
                    placeholder="Add allergy"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        addArrayItem("allergies", e.target.value);
                        e.target.value = "";
                      }
                    }}
                  />
                  <Button
                    type="button"
                    onClick={(e) => {
                      const input =
                        e.target.parentElement.querySelector("input");
                      addArrayItem("allergies", input.value);
                      input.value = "";
                    }}
                  >
                    Add
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appointments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>My Appointments</CardTitle>
              <CardDescription>
                View and manage your upcoming and past appointments
              </CardDescription>
            </CardHeader>
            <CardContent>
              {userAppointments.length > 0 ? (
                <div className="space-y-4">
                  {userAppointments.map((appointment) => (
                    <div key={appointment.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">
                            {appointment.serviceName}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            with {appointment.therapistName}
                          </p>
                          <div className="flex items-center gap-4 mt-2 text-sm">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {format(new Date(appointment.date), "PPP")}
                            </span>
                            <span>{appointment.time}</span>
                            <span>${appointment.price}</span>
                          </div>
                        </div>
                        <Badge
                          variant={
                            appointment.status === "completed"
                              ? "default"
                              : appointment.status === "confirmed"
                              ? "secondary"
                              : appointment.status === "pending"
                              ? "outline"
                              : "destructive"
                          }
                        >
                          {appointment.status}
                        </Badge>
                      </div>
                      {appointment.notes && (
                        <p className="text-sm text-muted-foreground mt-2">
                          Notes: {appointment.notes}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    No appointments found.
                  </p>
                  <Button className="mt-4">Book Your First Appointment</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-4">
          {/* Notification Preferences */}
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="email-notifications">
                    Email Notifications
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Receive appointment reminders and updates via email
                  </p>
                </div>
                <Switch
                  id="email-notifications"
                  checked={formData.preferences.notifications.email}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({
                      ...prev,
                      preferences: {
                        ...prev.preferences,
                        notifications: {
                          ...prev.preferences.notifications,
                          email: checked,
                        },
                      },
                    }))
                  }
                  disabled={!editing}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="sms-notifications">SMS Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive text message reminders and alerts
                  </p>
                </div>
                <Switch
                  id="sms-notifications"
                  checked={formData.preferences.notifications.sms}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({
                      ...prev,
                      preferences: {
                        ...prev.preferences,
                        notifications: {
                          ...prev.preferences.notifications,
                          sms: checked,
                        },
                      },
                    }))
                  }
                  disabled={!editing}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="push-notifications">Push Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive in-app notifications and alerts
                  </p>
                </div>
                <Switch
                  id="push-notifications"
                  checked={formData.preferences.notifications.push}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({
                      ...prev,
                      preferences: {
                        ...prev.preferences,
                        notifications: {
                          ...prev.preferences.notifications,
                          push: checked,
                        },
                      },
                    }))
                  }
                  disabled={!editing}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfilePage;
