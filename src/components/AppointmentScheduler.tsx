import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, User } from "lucide-react";
import { SubscriptionPrompt } from "./SubscriptionPrompt";

export const AppointmentScheduler = () => {
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [selectedTherapy, setSelectedTherapy] = useState<string>("");
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [sessionCount, setSessionCount] = useState(2); // Simulating 2 out of 3 free sessions used
  
  const therapyTypes = [
    { id: 1, name: "Abhyanga", duration: "60 min", description: "Full body oil massage" },
    { id: 2, name: "Shirodhara", duration: "45 min", description: "Oil pouring therapy" },
    { id: 3, name: "Panchakarma", duration: "90 min", description: "Complete detox program" },
    { id: 4, name: "Nasya", duration: "30 min", description: "Nasal therapy" }
  ];

  const timeSlots = [
    { time: "9:00 AM", available: true, practitioner: "Dr. Meera Sharma" },
    { time: "10:00 AM", available: false, practitioner: "Dr. Raj Patel" },
    { time: "11:00 AM", available: true, practitioner: "Dr. Meera Sharma" },
    { time: "2:00 PM", available: true, practitioner: "Dr. Raj Patel" },
    { time: "3:00 PM", available: true, practitioner: "Dr. Meera Sharma" },
    { time: "4:00 PM", available: false, practitioner: "Dr. Raj Patel" }
  ];

  const handleBooking = () => {
    if (!selectedDate || !selectedTime || !selectedTherapy) {
      alert("Please select all fields");
      return;
    }
    
    if (sessionCount >= 3) {
      setShowUpgrade(true);
      return;
    }
    
    setSessionCount(prev => prev + 1);
    alert(`Appointment booked for ${selectedTherapy} on ${selectedDate} at ${selectedTime}`);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {showUpgrade && <SubscriptionPrompt onClose={() => setShowUpgrade(false)} />}
      
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">Book Your Session</h2>
        <p className="text-muted-foreground">Schedule your next healing appointment</p>
        <div className="mt-4">
          <Badge variant={sessionCount >= 3 ? "destructive" : "secondary"}>
            {sessionCount}/3 Free Sessions Used
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Therapy Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Select Therapy Type</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {therapyTypes.map((therapy) => (
              <div 
                key={therapy.id} 
                className="p-4 border border-border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-foreground">{therapy.name}</h4>
                    <p className="text-sm text-muted-foreground">{therapy.description}</p>
                  </div>
                  <Badge variant="outline" className="text-healing border-healing">
                    {therapy.duration}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Date & Time Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-healing" />
              <span>Available Times - Today</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {timeSlots.map((slot, index) => (
                <Button
                  key={index}
                  variant={slot.available ? "outline" : "secondary"}
                  disabled={!slot.available}
                  className={`h-20 flex flex-col items-center justify-center space-y-1 ${
                    slot.available 
                      ? 'hover:bg-healing/10 hover:border-healing hover:text-healing' 
                      : 'opacity-50'
                  }`}
                >
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span className="font-medium">{slot.time}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <User className="h-3 w-3" />
                    <span className="text-xs">{slot.practitioner.split(' ')[1]}</span>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Selected Appointment Summary */}
      <Card className="bg-gradient-to-r from-healing/10 to-wellness/10">
        <CardHeader>
          <CardTitle>Appointment Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-healing" />
              <div>
                <p className="text-sm text-muted-foreground">Duration</p>
                <p className="font-medium">60 minutes</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5 text-healing" />
              <div>
                <p className="text-sm text-muted-foreground">Practitioner</p>
                <p className="font-medium">Dr. Meera Sharma</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="h-5 w-5 text-healing" />
              <div>
                <p className="text-sm text-muted-foreground">Location</p>
                <p className="font-medium">Wellness Center A</p>
              </div>
            </div>
          </div>
          
          <div className="flex justify-between items-center pt-4 border-t border-border">
            <div>
              <p className="text-sm text-muted-foreground">Selected:</p>
              <p className="font-medium">Abhyanga - Today at 9:00 AM</p>
            </div>
            <Button className="bg-wellness hover:bg-wellness/90" onClick={handleBooking}>
              Confirm Booking
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};