import { Button } from "@/components/ui/button";
import { Bell, Calendar, User, Activity, LogOut, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { NotificationSystem } from "@/components/NotificationSystem";
import { ThemeToggle } from "@/components/ThemeProvider";

interface HeaderProps {
  userType?: "patient" | "practitioner" | "admin";
  userName?: string;
}

export const Header = ({
  userType = "patient",
  userName = "John Doe",
}: HeaderProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const handleSignOut = () => {
    toast({
      title: "Signed out successfully",
      description: "You have been logged out of your account.",
    });
    navigate("/");
  };

  return (
    <header className="bg-card border-b border-border shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Activity className="h-8 w-8 text-healing" />
              <h1 className="text-2xl font-bold text-foreground">
                PanchakarmaPlus
              </h1>
            </div>
            <div className="hidden md:flex items-center space-x-6 ml-8">
              <Button
                variant="ghost"
                className="text-muted-foreground hover:text-healing"
                onClick={() => handleNavigation("/dashboard")}
              >
                Dashboard
              </Button>
              <Button
                variant="ghost"
                className="text-muted-foreground hover:text-healing"
                onClick={() => handleNavigation("/schedule")}
              >
                Sessions
              </Button>
              <Button
                variant="ghost"
                className="text-muted-foreground hover:text-healing"
                onClick={() => handleNavigation("/progress")}
              >
                Progress
              </Button>
              <Button
                variant="ghost"
                className="text-muted-foreground hover:text-healing"
                onClick={() => handleNavigation("/blog")}
              >
                <BookOpen className="h-4 w-4 mr-2" />
                Blog
              </Button>
              {userType === "practitioner" && (
                <Button
                  variant="ghost"
                  className="text-muted-foreground hover:text-healing"
                  onClick={() => handleNavigation("/patients")}
                >
                  Patients
                </Button>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-healing"
            >
              <Calendar className="h-5 w-5" />
            </Button>

            {/* Notification System */}
            <NotificationSystem userId={userName} />

            {/* Theme Toggle */}
            <ThemeToggle />

            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-red-500"
              onClick={handleSignOut}
              title="Sign Out"
            >
              <LogOut className="h-5 w-5" />
            </Button>
            <div className="flex items-center space-x-2 ml-4">
              <User className="h-8 w-8 text-muted-foreground" />
              <div className="hidden md:block">
                <p className="text-sm font-medium text-foreground">
                  {userName}
                </p>
                <p className="text-xs text-muted-foreground capitalize">
                  {userType}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
