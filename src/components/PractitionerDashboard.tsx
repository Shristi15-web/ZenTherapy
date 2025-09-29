import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Clock, CheckCircle, AlertCircle, Calendar, TrendingUp } from "lucide-react";

export const PractitionerDashboard = () => {
  const todaysPatients = [
    {
      id: 1,
      name: "John Doe",
      therapy: "Abhyanga",
      time: "2:00 PM",
      status: "confirmed",
      notes: "Follow-up on stress levels"
    },
    {
      id: 2,
      name: "Sarah Johnson", 
      therapy: "Shirodhara",
      time: "3:30 PM",
      status: "pending",
      notes: "First session - anxiety management"
    },
    {
      id: 3,
      name: "Michael Chen",
      therapy: "Nasya",
      time: "4:00 PM", 
      status: "completed",
      notes: "Respiratory issues improving"
    }
  ];

  const recentFeedback = [
    {
      patient: "Emma Wilson",
      session: "Panchakarma Day 3",
      rating: 5,
      comment: "Feeling much more relaxed and energized",
      date: "2 hours ago"
    },
    {
      patient: "David Kumar",
      session: "Abhyanga Session",
      rating: 4,
      comment: "Good progress, minor side effects noted",
      date: "1 day ago"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Today's Patients</p>
                <p className="text-2xl font-bold text-foreground">8</p>
              </div>
              <Users className="h-8 w-8 text-healing" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Sessions</p>
                <p className="text-2xl font-bold text-foreground">3</p>
              </div>
              <Clock className="h-8 w-8 text-earth" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed Today</p>
                <p className="text-2xl font-bold text-foreground">5</p>
              </div>
              <CheckCircle className="h-8 w-8 text-wellness" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Alerts</p>
                <p className="text-2xl font-bold text-foreground">2</p>
              </div>
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Schedule */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-healing" />
              <span>Today's Schedule</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {todaysPatients.map((patient) => (
                <div key={patient.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h4 className="font-medium text-foreground">{patient.name}</h4>
                      <Badge 
                        variant={
                          patient.status === 'completed' ? 'default' : 
                          patient.status === 'confirmed' ? 'secondary' : 
                          'outline'
                        }
                        className={
                          patient.status === 'completed' ? 'bg-wellness text-wellness-foreground' :
                          patient.status === 'confirmed' ? 'bg-healing text-healing-foreground' :
                          ''
                        }
                      >
                        {patient.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{patient.therapy} • {patient.time}</p>
                    <p className="text-xs text-muted-foreground mt-1">{patient.notes}</p>
                  </div>
                  <div className="flex space-x-2">
                    {patient.status !== 'completed' && (
                      <Button size="sm" variant="outline">
                        Start Session
                      </Button>
                    )}
                    <Button size="sm" variant="ghost">
                      View
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Feedback */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-healing" />
              <span>Recent Patient Feedback</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentFeedback.map((feedback, index) => (
                <div key={index} className="p-4 border border-border rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-medium text-foreground">{feedback.patient}</h4>
                      <p className="text-sm text-muted-foreground">{feedback.session}</p>
                    </div>
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <span 
                          key={i} 
                          className={`text-sm ${i < feedback.rating ? 'text-earth' : 'text-muted'}`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-foreground mb-2">"{feedback.comment}"</p>
                  <p className="text-xs text-muted-foreground">{feedback.date}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};