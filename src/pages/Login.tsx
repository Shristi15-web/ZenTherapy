import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Activity, User, Users, Shield } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const [selectedRole, setSelectedRole] = useState<'patient' | 'practitioner' | 'admin' | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const roles = [
    {
      id: 'patient',
      title: 'Patient Portal',
      description: 'Access your therapy sessions and progress',
      icon: User,
      color: 'healing',
      route: '/dashboard'
    },
    {
      id: 'practitioner',
      title: 'Practitioner Portal',
      description: 'Manage patients and sessions',
      icon: Users,
      color: 'wellness',
      route: '/practitioner'
    },
    {
      id: 'admin',
      title: 'Admin Portal',
      description: 'System administration and user management',
      icon: Shield,
      color: 'earth',
      route: '/admin'
    }
  ];

  const handleLogin = () => {
    if (!selectedRole) {
      toast({
        title: "Please select a role",
        description: "Choose whether you're a patient, practitioner, or admin.",
        variant: "destructive"
      });
      return;
    }

    if (!email || !password) {
      toast({
        title: "Please fill in all fields",
        description: "Email and password are required.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Login successful",
      description: `Welcome to ${selectedRole} portal!`,
    });

    const selectedRoleData = roles.find(role => role.id === selectedRole);
    navigate(selectedRoleData?.route || '/dashboard');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <Activity className="h-8 w-8 text-healing" />
              <h1 className="text-2xl font-bold text-foreground">PanchakarmaPlus</h1>
            </Link>
            <Link to="/">
              <Button variant="ghost">Back to Home</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-4">Sign In to Your Account</h2>
            <p className="text-muted-foreground">Choose your role and enter your credentials</p>
          </div>

          {!selectedRole ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {roles.map((role) => {
                const IconComponent = role.icon;
                return (
                  <Card 
                    key={role.id}
                    className="cursor-pointer hover:shadow-lg transition-all hover:scale-105 border-border"
                    onClick={() => setSelectedRole(role.id as any)}
                  >
                    <CardHeader className="text-center">
                      <div className={`w-16 h-16 rounded-lg bg-${role.color}/10 flex items-center justify-center mx-auto mb-4`}>
                        <IconComponent className={`h-8 w-8 text-${role.color}`} />
                      </div>
                      <CardTitle className="text-xl">{role.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground text-sm text-center">{role.description}</p>
                      <Button className="w-full mt-4" variant="outline">
                        Select Role
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="max-w-md mx-auto">
              <Card>
                <CardHeader className="text-center">
                  <div className="flex items-center justify-center space-x-2 mb-4">
                    {(() => {
                      const selectedRoleData = roles.find(role => role.id === selectedRole);
                      const IconComponent = selectedRoleData?.icon || User;
                      return (
                        <>
                          <div className={`w-12 h-12 rounded-lg bg-${selectedRoleData?.color}/10 flex items-center justify-center`}>
                            <IconComponent className={`h-6 w-6 text-${selectedRoleData?.color}`} />
                          </div>
                          <div>
                            <CardTitle className="text-left">{selectedRoleData?.title}</CardTitle>
                            <p className="text-sm text-muted-foreground text-left">{selectedRoleData?.description}</p>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      onClick={() => setSelectedRole(null)} 
                      variant="outline" 
                      className="flex-1"
                    >
                      Back
                    </Button>
                    <Button onClick={handleLogin} className="flex-1">
                      Sign In
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Login;