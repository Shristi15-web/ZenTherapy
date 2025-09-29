import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Crown, Check, X } from "lucide-react";

interface SubscriptionPromptProps {
  onClose?: () => void;
}

export const SubscriptionPrompt = ({ onClose }: SubscriptionPromptProps) => {
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-healing/10 flex items-center justify-center">
              <Crown className="h-8 w-8 text-healing" />
            </div>
          </div>
          <CardTitle className="text-2xl">Upgrade to Premium</CardTitle>
          <p className="text-muted-foreground">You've reached your free session limit</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <Badge variant="secondary" className="mb-4">Free Plan Limit Reached</Badge>
            <p className="text-sm text-muted-foreground">
              You've used all 3 free sessions. Upgrade to premium to continue your healing journey.
            </p>
          </div>

          <div className="space-y-4">
            <div className="border rounded-lg p-4 bg-healing/5">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Premium Plan</span>
                <Badge className="bg-healing text-white">Recommended</Badge>
              </div>
              <div className="text-2xl font-bold mb-4">$49.99<span className="text-sm font-normal text-muted-foreground">/month</span></div>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-wellness" />
                  <span className="text-sm">Unlimited therapy sessions</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-wellness" />
                  <span className="text-sm">Advanced progress tracking</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-wellness" />
                  <span className="text-sm">Priority practitioner support</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-wellness" />
                  <span className="text-sm">Personalized therapy plans</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex space-x-3">
            <Button variant="outline" className="flex-1" onClick={onClose}>
              Maybe Later
            </Button>
            <Button className="flex-1 bg-healing hover:bg-healing/90">
              Upgrade Now
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};