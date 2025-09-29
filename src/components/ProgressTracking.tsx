import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Heart, Brain, Droplets, Target, Award, Calendar } from "lucide-react";

export const ProgressTracking = () => {
  const wellnessMetrics = [
    { name: "Overall Wellness", value: 72, change: "+12%", icon: Heart },
    { name: "Stress Reduction", value: 85, change: "+18%", icon: Brain },
    { name: "Energy Levels", value: 68, change: "+25%", icon: Droplets },
    { name: "Sleep Quality", value: 79, change: "+15%", icon: Target }
  ];

  const milestones = [
    { 
      title: "Stress Level Reduction", 
      description: "Achieved 80%+ stress reduction", 
      date: "3 days ago",
      completed: true 
    },
    {
      title: "Energy Boost Milestone",
      description: "Reached 70% energy improvement",
      date: "In progress",
      completed: false
    },
    {
      title: "Sleep Pattern Optimization",
      description: "Maintain 8+ hours quality sleep",
      date: "Target: Next week",
      completed: false
    }
  ];

  const sessionsData = [
    { session: "Session 1", date: "Jan 15", wellness: 45, energy: 40, stress: 85 },
    { session: "Session 3", date: "Jan 22", wellness: 52, energy: 48, stress: 78 },
    { session: "Session 5", date: "Jan 29", wellness: 61, energy: 58, stress: 65 },
    { session: "Session 7", date: "Feb 5", wellness: 68, energy: 63, stress: 52 },
    { session: "Current", date: "Feb 12", wellness: 72, energy: 68, stress: 45 }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">Your Healing Journey</h2>
        <p className="text-muted-foreground">Track your progress and celebrate milestones</p>
      </div>

      {/* Wellness Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {wellnessMetrics.map((metric) => {
          const IconComponent = metric.icon;
          return (
            <Card key={metric.name}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <IconComponent className="h-8 w-8 text-healing" />
                  <Badge variant="secondary" className="bg-wellness/20 text-wellness">
                    {metric.change}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">{metric.name}</span>
                    <span className="text-sm font-medium">{metric.value}%</span>
                  </div>
                  <Progress value={metric.value} className="h-3" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Progress Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-healing" />
              <span>Recovery Timeline</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {sessionsData.map((session, index) => (
                <div key={session.session} className="relative">
                  {index !== sessionsData.length - 1 && (
                    <div className="absolute left-6 top-12 h-12 w-0.5 bg-border"></div>
                  )}
                  <div className="flex items-start space-x-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      index === sessionsData.length - 1 
                        ? 'bg-healing text-healing-foreground' 
                        : 'bg-wellness text-wellness-foreground'
                    }`}>
                      <Calendar className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-foreground">{session.session}</h4>
                        <span className="text-sm text-muted-foreground">{session.date}</span>
                      </div>
                      <div className="mt-2 space-y-2">
                        <div className="flex items-center space-x-4 text-sm">
                          <span className="text-muted-foreground w-16">Wellness:</span>
                          <Progress value={session.wellness} className="flex-1 h-2" />
                          <span className="w-10 text-right font-medium">{session.wellness}%</span>
                        </div>
                        <div className="flex items-center space-x-4 text-sm">
                          <span className="text-muted-foreground w-16">Energy:</span>
                          <Progress value={session.energy} className="flex-1 h-2" />
                          <span className="w-10 text-right font-medium">{session.energy}%</span>
                        </div>
                        <div className="flex items-center space-x-4 text-sm">
                          <span className="text-muted-foreground w-16">Stress:</span>
                          <Progress value={100 - session.stress} className="flex-1 h-2" />
                          <span className="w-10 text-right font-medium">{session.stress}% reduced</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Milestones */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Award className="h-5 w-5 text-earth" />
              <span>Milestones</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {milestones.map((milestone, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  milestone.completed 
                    ? 'bg-wellness text-wellness-foreground' 
                    : 'bg-muted text-muted-foreground'
                }`}>
                  <Award className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-foreground text-sm">{milestone.title}</h4>
                  <p className="text-xs text-muted-foreground mt-1">{milestone.description}</p>
                  <p className="text-xs text-muted-foreground mt-1">{milestone.date}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};