import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Star,
  MapPin,
  Phone,
  Mail,
  Clock,
  Award,
  BookOpen,
  Calendar as CalendarIcon,
  Users,
  CheckCircle,
} from "lucide-react";
import { therapists, generateTimeSlots } from "@/data/therapists.js";
import { therapyServices } from "@/data/services.js";
import { getTestimonialsByTherapist } from "@/data/testimonials.js";
import { format, addDays, isBefore, startOfDay } from "date-fns";

const TherapistProfiles = ({ onBookAppointment }) => {
  const [selectedTherapist, setSelectedTherapist] = useState(null);
  const [selectedDate, setSelectedDate] = useState();
  const [availableSlots, setAvailableSlots] = useState([]);

  // Get available time slots when date is selected
  const handleDateSelect = (date) => {
    setSelectedDate(date);
    if (selectedTherapist && date) {
      const dateStr = format(date, "yyyy-MM-dd");
      const slots = generateTimeSlots(selectedTherapist.id, dateStr);
      setAvailableSlots(slots);
    }
  };

  // Disable past dates and days when therapist is not available
  const disabledDays = (date) => {
    if (isBefore(date, startOfDay(new Date()))) return true;

    if (selectedTherapist) {
      const dayName = format(date, "EEEE").toLowerCase();
      return !selectedTherapist.workingHours[dayName]?.available;
    }

    return false;
  };

  const TherapistCard = ({ therapist }) => {
    const testimonials = getTestimonialsByTherapist(therapist.id);
    const services = therapist.services
      .map((id) => therapyServices.find((service) => service.id === id))
      .filter(Boolean);

    return (
      <Card className="h-full hover:shadow-lg transition-shadow">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Avatar className="w-24 h-24">
              <AvatarImage src={therapist.image} alt={therapist.name} />
              <AvatarFallback className="text-lg">
                {therapist.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
          </div>

          <CardTitle className="text-xl">{therapist.name}</CardTitle>
          <CardDescription>{therapist.title}</CardDescription>

          <div className="flex items-center justify-center gap-2 mt-2">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="font-semibold">{therapist.rating}</span>
            </div>
            <span className="text-muted-foreground">
              ({testimonials.length} reviews)
            </span>
          </div>

          <Badge
            variant={
              therapist.availability === "high"
                ? "default"
                : therapist.availability === "medium"
                ? "secondary"
                : "outline"
            }
            className="mt-2"
          >
            {therapist.availability === "high"
              ? "Available"
              : therapist.availability === "medium"
              ? "Limited Availability"
              : "Busy"}
          </Badge>
        </CardHeader>

        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold text-sm mb-2">Specializations</h4>
            <div className="flex flex-wrap gap-1">
              {therapist.specializations.slice(0, 4).map((spec) => (
                <Badge key={spec} variant="outline" className="text-xs">
                  {spec}
                </Badge>
              ))}
              {therapist.specializations.length > 4 && (
                <Badge variant="outline" className="text-xs">
                  +{therapist.specializations.length - 4} more
                </Badge>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary">
                {therapist.experience}
              </div>
              <div className="text-xs text-muted-foreground">
                Years Experience
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">
                ${therapist.consultationFee}
              </div>
              <div className="text-xs text-muted-foreground">
                Consultation Fee
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-2">Services Offered</h4>
            <div className="space-y-1">
              {services.slice(0, 3).map((service) => (
                <div key={service.id} className="flex justify-between text-sm">
                  <span>{service.name}</span>
                  <span className="text-muted-foreground">
                    ${service.price}
                  </span>
                </div>
              ))}
              {services.length > 3 && (
                <div className="text-xs text-muted-foreground">
                  +{services.length - 3} more services
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setSelectedTherapist(therapist)}
                >
                  View Profile
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
                <DialogHeader>
                  <DialogTitle className="sr-only">
                    Therapist Profile
                  </DialogTitle>
                </DialogHeader>
                <TherapistDetailView therapist={therapist} />
              </DialogContent>
            </Dialog>

            <Button
              className="flex-1"
              onClick={() => onBookAppointment?.(therapist)}
            >
              Book Now
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  const TherapistDetailView = ({ therapist }) => {
    const testimonials = getTestimonialsByTherapist(therapist.id);
    const services = therapist.services
      .map((id) => therapyServices.find((service) => service.id === id))
      .filter(Boolean);

    return (
      <div className="grid md:grid-cols-3 gap-6 max-h-[80vh] overflow-hidden">
        {/* Left Column - Basic Info */}
        <div className="space-y-4">
          <div className="text-center">
            <Avatar className="w-32 h-32 mx-auto mb-4">
              <AvatarImage src={therapist.image} alt={therapist.name} />
              <AvatarFallback className="text-2xl">
                {therapist.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>

            <h2 className="text-2xl font-bold">{therapist.name}</h2>
            <p className="text-muted-foreground">{therapist.title}</p>

            <div className="flex items-center justify-center gap-2 mt-2">
              <div className="flex items-center gap-1">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold text-lg">
                  {therapist.rating}
                </span>
              </div>
              <span className="text-muted-foreground">
                ({testimonials.length} reviews)
              </span>
            </div>
          </div>

          <Card>
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">
                  {therapist.experience} years experience
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">
                  ${therapist.consultationFee} consultation
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">{therapist.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">{therapist.email}</span>
              </div>
            </CardContent>
          </Card>

          <div>
            <h4 className="font-semibold mb-2">Languages</h4>
            <div className="flex flex-wrap gap-1">
              {therapist.languages.map((lang) => (
                <Badge key={lang} variant="secondary">
                  {lang}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Middle Column - Details */}
        <div className="space-y-4 overflow-hidden">
          <ScrollArea className="h-[70vh]">
            <Tabs defaultValue="about" className="space-y-4">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="about">About</TabsTrigger>
                <TabsTrigger value="services">Services</TabsTrigger>
                <TabsTrigger value="education">Education</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>

              <TabsContent value="about" className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Biography</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {therapist.bio}
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Specializations</h3>
                  <div className="grid grid-cols-2 gap-1">
                    {therapist.specializations.map((spec) => (
                      <Badge key={spec} variant="outline" className="text-xs">
                        {spec}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Achievements</h3>
                  <ul className="space-y-1">
                    {therapist.achievements?.map((achievement, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-2 text-sm"
                      >
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        {achievement}
                      </li>
                    ))}
                  </ul>
                </div>
              </TabsContent>

              <TabsContent value="services" className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-3">Services Offered</h3>
                  <div className="space-y-3">
                    {services.map((service) => (
                      <Card key={service.id} className="p-3">
                        <div className="flex justify-between items-start gap-3">
                          <div className="flex-1">
                            <h4 className="font-medium">{service.name}</h4>
                            <p className="text-sm text-muted-foreground mt-1">
                              {service.shortDescription}
                            </p>
                            <div className="flex items-center gap-4 mt-2 text-sm">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {service.duration} min
                              </span>
                              <span className="flex items-center gap-1 font-semibold">
                                ${service.price}
                              </span>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="education" className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-3">Education</h3>
                  <div className="space-y-3">
                    {therapist.education?.map((edu, index) => (
                      <div
                        key={index}
                        className="border-l-2 border-primary pl-3"
                      >
                        <h4 className="font-medium">{edu.degree}</h4>
                        <p className="text-sm text-muted-foreground">
                          {edu.institution}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {edu.year}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Qualifications</h3>
                  <div className="space-y-1">
                    {therapist.qualifications.map((qual, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <BookOpen className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{qual}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="reviews" className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-3">Patient Reviews</h3>
                  <div className="space-y-3">
                    {testimonials.slice(0, 5).map((testimonial) => (
                      <Card key={testimonial.id} className="p-3">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium">
                              {testimonial.patientInitials}
                            </span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-3 h-3 ${
                                      i < testimonial.rating
                                        ? "fill-yellow-400 text-yellow-400"
                                        : "text-gray-300"
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-xs text-muted-foreground">
                                {testimonial.date}
                              </span>
                            </div>
                            <h4 className="text-sm font-medium">
                              {testimonial.title}
                            </h4>
                            <p className="text-sm text-muted-foreground mt-1">
                              {testimonial.review}
                            </p>
                            <Badge variant="outline" className="text-xs mt-2">
                              {testimonial.serviceName}
                            </Badge>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </ScrollArea>
        </div>

        {/* Right Column - Booking */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Schedule Appointment</CardTitle>
              <CardDescription>
                Select a date to view available time slots
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                disabled={disabledDays}
                fromDate={new Date()}
                toDate={addDays(new Date(), 60)}
                className="rounded-md border"
              />

              {selectedDate && (
                <div>
                  <h4 className="font-medium mb-2">
                    Available Times - {format(selectedDate, "PPP")}
                  </h4>
                  {availableSlots.length > 0 ? (
                    <div className="grid grid-cols-2 gap-2">
                      {availableSlots.map((slot) => (
                        <Button
                          key={slot.time}
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            onBookAppointment?.(
                              therapist,
                              selectedDate,
                              slot.time
                            )
                          }
                          disabled={!slot.available}
                        >
                          {slot.time}
                        </Button>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No available slots for this date
                    </p>
                  )}
                </div>
              )}

              <Button
                className="w-full"
                onClick={() => onBookAppointment?.(therapist)}
              >
                Book Appointment
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Working Hours</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {Object.entries(therapist.workingHours).map(([day, schedule]) => (
                <div key={day} className="flex justify-between text-sm">
                  <span className="capitalize">{day}</span>
                  <span
                    className={
                      schedule.available ? "" : "text-muted-foreground"
                    }
                  >
                    {schedule.available
                      ? `${schedule.start} - ${schedule.end}`
                      : "Closed"}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Our Expert Therapists</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Meet our experienced Ayurvedic practitioners dedicated to your healing
          journey. Each therapist brings unique expertise and a compassionate
          approach to traditional wellness.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {therapists.map((therapist) => (
          <TherapistCard key={therapist.id} therapist={therapist} />
        ))}
      </div>
    </div>
  );
};

export default TherapistProfiles;
