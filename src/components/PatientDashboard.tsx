import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calendar, Clock, TrendingUp, Heart, Droplets } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const PatientDashboard = () => {
  const navigate = useNavigate();
  
  const upcomingSessions = [
    {
      id: 1,
      therapy: "Abhyanga (Oil Massage)",
      date: "Today",
      time: "2:00 PM",
      practitioner: "Dr. Meera Sharma",
      status: "confirmed"
    },
    {
      id: 2,
      therapy: "Shirodhara",
      date: "Tomorrow",
      time: "10:00 AM", 
      practitioner: "Dr. Raj Patel",
      status: "confirmed"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-healing/10 to-wellness/10 rounded-lg p-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">Welcome back, John!</h2>
        <p className="text-muted-foreground">Your healing journey continues. You have 2 sessions scheduled this week.</p>
        <div className="mt-4">
          <Badge variant="secondary" className="bg-healing/20 text-healing">Free Plan: 2/3 Sessions Used</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Progress Overview */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recovery Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-healing" />
                <span>Recovery Progress</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Overall Wellness</span>
                  <span className="text-sm font-medium">72%</span>
                </div>
                <Progress value={72} className="h-3" />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Stress Reduction</span>
                  <span className="text-sm font-medium">85%</span>
                </div>
                <Progress value={85} className="h-3" />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Energy Levels</span>
                  <span className="text-sm font-medium">68%</span>
                </div>
                <Progress value={68} className="h-3" />
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Sessions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-healing" />
                  <span>Upcoming Sessions</span>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate('/schedule')}
                >
                  View All
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingSessions.map((session) => (
                  <div key={session.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium text-foreground">{session.therapy}</h4>
                      <div className="flex items-center space-x-4 mt-1 text-sm text-muted-foreground">
                        <span className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3" />
                          <span>{session.date}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>{session.time}</span>
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">with {session.practitioner}</p>
                    </div>
                    <Button size="sm" className="bg-wellness hover:bg-wellness/90">
                      View Details
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Side Panel */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle>This Week</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Heart className="h-4 w-4 text-earth" />
                  <span className="text-sm">Sessions Completed</span>
                </div>
                <span className="font-medium">3/5</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Droplets className="h-4 w-4 text-healing" />
                  <span className="text-sm">Wellness Score</span>
                </div>
                <span className="font-medium">8.2/10</span>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                className="w-full bg-healing hover:bg-healing/90"
                onClick={() => navigate('/schedule')}
              >
                Book New Session
              </Button>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => navigate('/progress')}
              >
                View Progress Report
              </Button>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => navigate('/feedback')}
              >
                Contact Practitioner
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};