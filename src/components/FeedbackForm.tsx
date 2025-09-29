import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Star, Heart, AlertTriangle, Smile } from "lucide-react";
import { useState } from "react";

export const FeedbackForm = () => {
  const [rating, setRating] = useState(0);
  const [selectedEffects, setSelectedEffects] = useState<string[]>([]);

  const sideEffects = [
    { id: "relaxation", label: "Deep Relaxation", icon: Heart, type: "positive" },
    { id: "energy", label: "Increased Energy", icon: Smile, type: "positive" },
    { id: "drowsiness", label: "Mild Drowsiness", icon: AlertTriangle, type: "mild" },
    { id: "headache", label: "Headache", icon: AlertTriangle, type: "negative" },
    { id: "nausea", label: "Nausea", icon: AlertTriangle, type: "negative" }
  ];

  const toggleEffect = (effectId: string) => {
    setSelectedEffects(prev => 
      prev.includes(effectId) 
        ? prev.filter(id => id !== effectId)
        : [...prev, effectId]
    );
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Session Feedback</CardTitle>
          <p className="text-muted-foreground">Help us improve your healing experience</p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Session Info */}
          <div className="bg-muted/50 p-4 rounded-lg">
            <h3 className="font-medium text-foreground mb-2">Session Completed</h3>
            <div className="text-sm text-muted-foreground space-y-1">
              <p><span className="font-medium">Therapy:</span> Abhyanga (Oil Massage)</p>
              <p><span className="font-medium">Practitioner:</span> Dr. Meera Sharma</p>
              <p><span className="font-medium">Duration:</span> 60 minutes</p>
              <p><span className="font-medium">Date:</span> Today, 2:00 PM</p>
            </div>
          </div>

          {/* Overall Rating */}
          <div>
            <h4 className="font-medium text-foreground mb-3">Overall Experience Rating</h4>
            <div className="flex justify-center space-x-2 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className="focus:outline-none transition-colors"
                >
                  <Star 
                    className={`h-8 w-8 ${
                      star <= rating 
                        ? 'text-earth fill-earth' 
                        : 'text-muted-foreground hover:text-earth'
                    }`}
                  />
                </button>
              ))}
            </div>
            <p className="text-center text-sm text-muted-foreground">
              {rating === 0 && "Click to rate your experience"}
              {rating === 1 && "Poor - Needs improvement"}
              {rating === 2 && "Fair - Below expectations"}
              {rating === 3 && "Good - Satisfactory"}
              {rating === 4 && "Very Good - Exceeded expectations"}
              {rating === 5 && "Excellent - Outstanding experience"}
            </p>
          </div>

          {/* Effects Experienced */}
          <div>
            <h4 className="font-medium text-foreground mb-3">Effects Experienced</h4>
            <div className="grid grid-cols-2 gap-3">
              {sideEffects.map((effect) => {
                const IconComponent = effect.icon;
                const isSelected = selectedEffects.includes(effect.id);
                return (
                  <button
                    key={effect.id}
                    onClick={() => toggleEffect(effect.id)}
                    className={`p-3 border rounded-lg text-left transition-colors ${
                      isSelected 
                        ? 'border-healing bg-healing/10' 
                        : 'border-border hover:bg-muted/50'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <IconComponent className={`h-4 w-4 ${
                        effect.type === 'positive' ? 'text-wellness' :
                        effect.type === 'mild' ? 'text-earth' :
                        'text-destructive'
                      }`} />
                      <span className="text-sm font-medium">{effect.label}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Wellness Metrics */}
          <div>
            <h4 className="font-medium text-foreground mb-3">How do you feel right now?</h4>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">Energy Level</p>
                <div className="flex justify-center space-x-1">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <div
                      key={level}
                      className={`w-3 h-8 rounded-sm ${
                        level <= 4 ? 'bg-wellness' : 'bg-muted'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-1">High</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">Stress Level</p>
                <div className="flex justify-center space-x-1">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <div
                      key={level}
                      className={`w-3 h-8 rounded-sm ${
                        level <= 2 ? 'bg-earth' : 'bg-muted'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Low</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">Pain Level</p>
                <div className="flex justify-center space-x-1">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <div
                      key={level}
                      className={`w-3 h-8 rounded-sm ${
                        level <= 1 ? 'bg-destructive/60' : 'bg-muted'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Minimal</p>
              </div>
            </div>
          </div>

          {/* Additional Comments */}
          <div>
            <h4 className="font-medium text-foreground mb-3">Additional Comments</h4>
            <Textarea
              placeholder="Share any specific observations, suggestions, or concerns about your session..."
              className="min-h-[100px]"
            />
          </div>

          {/* Submit Actions */}
          <div className="flex justify-between pt-4 border-t border-border">
            <Button variant="outline">
              Save as Draft
            </Button>
            <Button className="bg-healing hover:bg-healing/90">
              Submit Feedback
            </Button>
          </div>

          {/* Next Session Reminder */}
          <div className="bg-gradient-to-r from-wellness/10 to-healing/10 p-4 rounded-lg text-center">
            <h4 className="font-medium text-foreground mb-2">Next Session Scheduled</h4>
            <p className="text-sm text-muted-foreground">
              Shirodhara with Dr. Raj Patel<br />
              Tomorrow at 10:00 AM
            </p>
            <Button variant="outline" size="sm" className="mt-3">
              View Details
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};