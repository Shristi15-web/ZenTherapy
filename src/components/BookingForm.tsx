import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  CalendarIcon,
  Clock,
  DollarSign,
  User,
  Phone,
  Mail,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { format, addDays, isWeekend, isBefore, startOfDay } from "date-fns";
import { cn } from "@/lib/utils";
import { therapyServices } from "@/data/services.js";
import { therapists, generateTimeSlots } from "@/data/therapists.js";
import { bookingService, generateAvailableSlots } from "@/data/appointments.js";
import { authService } from "@/data/auth.js";
import { useToast } from "@/hooks/use-toast";

const BookingForm = ({ selectedService, onBookingComplete, onCancel }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState();
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedTherapist, setSelectedTherapist] = useState("");
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [bookingData, setBookingData] = useState({
    patientName: "",
    email: "",
    phone: "",
    notes: "",
    emergencyContact: "",
  });

  const { toast } = useToast();
  const currentUser = authService.getCurrentUser();

  // Auto-fill user data if logged in
  useEffect(() => {
    if (currentUser) {
      setBookingData((prev) => ({
        ...prev,
        patientName: currentUser.name || "",
        email: currentUser.email || "",
        phone: currentUser.phone || "",
      }));
    }
  }, [currentUser]);

  // Get available therapists for selected service
  const availableTherapists = therapists.filter((therapist) =>
    therapist.services.includes(selectedService?.id)
  );

  // Generate available time slots when date and therapist are selected
  useEffect(() => {
    if (selectedDate && selectedTherapist) {
      const dateStr = format(selectedDate, "yyyy-MM-dd");
      const slots = generateAvailableSlots(selectedTherapist, dateStr);
      setAvailableSlots(slots);
      setSelectedTime(""); // Reset selected time when date/therapist changes
    }
  }, [selectedDate, selectedTherapist]);

  // Disable past dates and weekends for some therapists
  const disabledDays = (date) => {
    if (isBefore(date, startOfDay(new Date()))) return true;

    if (selectedTherapist) {
      const therapist = therapists.find((t) => t.id === selectedTherapist);
      if (therapist) {
        const dayName = format(date, "EEEE").toLowerCase();
        return !therapist.workingHours[dayName]?.available;
      }
    }

    return false;
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (
        !selectedService ||
        !selectedDate ||
        !selectedTime ||
        !selectedTherapist
      ) {
        toast({
          title: "Missing Information",
          description: "Please select service, date, time, and therapist.",
          variant: "destructive",
        });
        return;
      }
    }

    if (currentStep === 2) {
      if (
        !bookingData.patientName ||
        !bookingData.email ||
        !bookingData.phone
      ) {
        toast({
          title: "Missing Information",
          description: "Please fill in all required fields.",
          variant: "destructive",
        });
        return;
      }

      // Validate email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(bookingData.email)) {
        toast({
          title: "Invalid Email",
          description: "Please enter a valid email address.",
          variant: "destructive",
        });
        return;
      }

      // Validate phone
      const phoneRegex = /^[+]?[1-9][\d]{0,15}$/;
      if (!phoneRegex.test(bookingData.phone.replace(/[\s\-()]/g, ""))) {
        toast({
          title: "Invalid Phone",
          description: "Please enter a valid phone number.",
          variant: "destructive",
        });
        return;
      }
    }

    setCurrentStep((prev) => prev + 1);
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleBooking = async () => {
    setLoading(true);

    try {
      const therapist = therapists.find((t) => t.id === selectedTherapist);
      const appointmentData = {
        patientId: currentUser?.id || "guest",
        patientName: bookingData.patientName,
        therapistId: selectedTherapist,
        therapistName: therapist?.name,
        serviceId: selectedService.id,
        serviceName: selectedService.name,
        date: format(selectedDate, "yyyy-MM-dd"),
        time: selectedTime,
        notes: bookingData.notes,
        patientEmail: bookingData.email,
        patientPhone: bookingData.phone,
        emergencyContact: bookingData.emergencyContact,
      };

      const result = await bookingService.createAppointment(appointmentData);

      if (result.success) {
        toast({
          title: "Booking Confirmed!",
          description: `Your appointment has been scheduled for ${format(
            selectedDate,
            "PPP"
          )} at ${selectedTime}.`,
        });
        onBookingComplete?.(result.appointment);
      } else {
        toast({
          title: "Booking Failed",
          description:
            result.error || "Unable to create appointment. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const selectedTherapistData = therapists.find(
    (t) => t.id === selectedTherapist
  );

  // Step 1: Service Selection & Date/Time
  const Step1 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-3">Selected Service</h3>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-start gap-4">
              <img
                src={selectedService?.image}
                alt={selectedService?.name}
                className="w-16 h-16 rounded-lg object-cover"
              />
              <div className="flex-1">
                <h4 className="font-medium">{selectedService?.name}</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  {selectedService?.shortDescription}
                </p>
                <div className="flex gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {selectedService?.duration} min
                  </div>
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-4 h-4" />${selectedService?.price}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <Label className="text-base font-semibold">Select Therapist</Label>
        <Select value={selectedTherapist} onValueChange={setSelectedTherapist}>
          <SelectTrigger className="mt-2">
            <SelectValue placeholder="Choose your preferred therapist" />
          </SelectTrigger>
          <SelectContent>
            {availableTherapists.map((therapist) => (
              <SelectItem key={therapist.id} value={therapist.id}>
                <div className="flex items-center gap-3">
                  <div>
                    <div className="font-medium">{therapist.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {therapist.experience} years exp • $
                      {therapist.consultationFee}
                    </div>
                  </div>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {selectedTherapistData && (
          <Card className="mt-3">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">{selectedTherapistData.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {selectedTherapistData.title}
                  </p>
                  <div className="flex gap-2 mt-2">
                    {selectedTherapistData.specializations
                      .slice(0, 3)
                      .map((spec) => (
                        <Badge
                          key={spec}
                          variant="secondary"
                          className="text-xs"
                        >
                          {spec}
                        </Badge>
                      ))}
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-sm">
                    <span>⭐ {selectedTherapistData.rating}</span>
                    <span>{selectedTherapistData.reviewCount} reviews</span>
                    <Badge
                      variant={
                        selectedTherapistData.availability === "high"
                          ? "default"
                          : "secondary"
                      }
                    >
                      {selectedTherapistData.availability === "high"
                        ? "Available"
                        : "Limited availability"}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <Label className="text-base font-semibold">Select Date</Label>
          <div className="mt-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !selectedDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={disabledDays}
                  fromDate={new Date()}
                  toDate={addDays(new Date(), 60)} // Allow booking up to 60 days in advance
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div>
          <Label className="text-base font-semibold">Select Time</Label>
          <Select
            value={selectedTime}
            onValueChange={setSelectedTime}
            disabled={!selectedDate || !selectedTherapist}
          >
            <SelectTrigger className="mt-2">
              <SelectValue
                placeholder={
                  !selectedDate || !selectedTherapist
                    ? "Select date and therapist first"
                    : "Choose time"
                }
              />
            </SelectTrigger>
            <SelectContent>
              {availableSlots.map((slot) => (
                <SelectItem key={slot.time} value={slot.time}>
                  {slot.time}
                </SelectItem>
              ))}
              {availableSlots.length === 0 &&
                selectedDate &&
                selectedTherapist && (
                  <div className="p-2 text-sm text-muted-foreground text-center">
                    No available slots for this date
                  </div>
                )}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );

  // Step 2: Contact Information
  const Step2 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Contact Information</h3>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="patientName">Full Name *</Label>
          <Input
            id="patientName"
            value={bookingData.patientName}
            onChange={(e) =>
              setBookingData((prev) => ({
                ...prev,
                patientName: e.target.value,
              }))
            }
            placeholder="Enter your full name"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="email">Email Address *</Label>
          <Input
            id="email"
            type="email"
            value={bookingData.email}
            onChange={(e) =>
              setBookingData((prev) => ({ ...prev, email: e.target.value }))
            }
            placeholder="your.email@example.com"
            className="mt-1"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="phone">Phone Number *</Label>
          <Input
            id="phone"
            type="tel"
            value={bookingData.phone}
            onChange={(e) =>
              setBookingData((prev) => ({ ...prev, phone: e.target.value }))
            }
            placeholder="+1 (555) 123-4567"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="emergencyContact">Emergency Contact</Label>
          <Input
            id="emergencyContact"
            value={bookingData.emergencyContact}
            onChange={(e) =>
              setBookingData((prev) => ({
                ...prev,
                emergencyContact: e.target.value,
              }))
            }
            placeholder="Emergency contact number"
            className="mt-1"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="notes">Additional Notes</Label>
        <Textarea
          id="notes"
          value={bookingData.notes}
          onChange={(e) =>
            setBookingData((prev) => ({ ...prev, notes: e.target.value }))
          }
          placeholder="Any specific requirements, health conditions, or preferences..."
          className="mt-1"
          rows={3}
        />
      </div>
    </div>
  );

  // Step 3: Confirmation
  const Step3 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Booking Confirmation</h3>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            Appointment Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm text-muted-foreground">Service</Label>
              <p className="font-medium">{selectedService?.name}</p>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">Therapist</Label>
              <p className="font-medium">{selectedTherapistData?.name}</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm text-muted-foreground">Date</Label>
              <p className="font-medium">
                {selectedDate ? format(selectedDate, "PPP") : ""}
              </p>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">Time</Label>
              <p className="font-medium">{selectedTime}</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm text-muted-foreground">Duration</Label>
              <p className="font-medium">{selectedService?.duration} minutes</p>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">Price</Label>
              <p className="font-medium text-lg">${selectedService?.price}</p>
            </div>
          </div>

          <Separator />

          <div>
            <Label className="text-sm text-muted-foreground">
              Patient Details
            </Label>
            <div className="mt-1 space-y-1">
              <p className="font-medium">{bookingData.patientName}</p>
              <p className="text-sm flex items-center gap-2">
                <Mail className="w-4 h-4" />
                {bookingData.email}
              </p>
              <p className="text-sm flex items-center gap-2">
                <Phone className="w-4 h-4" />
                {bookingData.phone}
              </p>
            </div>
          </div>

          {bookingData.notes && (
            <div>
              <Label className="text-sm text-muted-foreground">Notes</Label>
              <p className="text-sm bg-muted p-2 rounded">
                {bookingData.notes}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="bg-blue-50 p-4 rounded-lg">
        <div className="flex gap-2">
          <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-blue-900">Important Notes:</p>
            <ul className="text-blue-800 mt-1 space-y-1">
              <li>• Please arrive 15 minutes before your appointment</li>
              <li>• Bring comfortable clothing for the treatment</li>
              <li>• Avoid heavy meals 2 hours before the session</li>
              <li>• A confirmation email will be sent to you</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Book Your Appointment</CardTitle>
        <CardDescription>
          Step {currentStep} of 3:{" "}
          {currentStep === 1
            ? "Service & Schedule"
            : currentStep === 2
            ? "Contact Details"
            : "Confirmation"}
        </CardDescription>

        {/* Progress indicator */}
        <div className="flex gap-2">
          {[1, 2, 3].map((step) => (
            <div
              key={step}
              className={cn(
                "h-2 flex-1 rounded",
                step <= currentStep ? "bg-primary" : "bg-muted"
              )}
            />
          ))}
        </div>
      </CardHeader>

      <CardContent>
        {currentStep === 1 && <Step1 />}
        {currentStep === 2 && <Step2 />}
        {currentStep === 3 && <Step3 />}
      </CardContent>

      <CardFooter className="flex justify-between">
        <div className="flex gap-2">
          {onCancel && (
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          {currentStep > 1 && (
            <Button variant="outline" onClick={handlePrevious}>
              Previous
            </Button>
          )}
        </div>

        <div>
          {currentStep < 3 ? (
            <Button onClick={handleNext}>Next</Button>
          ) : (
            <Button onClick={handleBooking} disabled={loading}>
              {loading
                ? "Processing..."
                : `Confirm Booking - $${selectedService?.price}`}
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default BookingForm;
