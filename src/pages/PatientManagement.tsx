import { Header } from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Eye, Edit, Calendar, Phone, Mail } from "lucide-react";

const PatientManagement = () => {
  const patients = [
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      phone: "+91 9876543210",
      status: "Active",
      plan: "Premium",
      nextSession: "Today, 2:00 PM",
      progress: 72
    },
    {
      id: 2,
      name: "Sarah Williams",
      email: "sarah@example.com",
      phone: "+91 9876543211",
      status: "Active",
      plan: "Basic",
      nextSession: "Tomorrow, 10:00 AM",
      progress: 85
    },
    {
      id: 3,
      name: "Mike Johnson",
      email: "mike@example.com",
      phone: "+91 9876543212",
      status: "Inactive",
      plan: "Premium",
      nextSession: "Not scheduled",
      progress: 45
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header userType="practitioner" userName="Dr. Meera Sharma" />
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Header Section */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Patient Management</h1>
              <p className="text-muted-foreground">Manage your patients and their treatment plans</p>
            </div>
            <Button className="bg-healing hover:bg-healing/90">
              <Plus className="h-4 w-4 mr-2" />
              Add Patient
            </Button>
          </div>

          {/* Search and Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search patients..." 
                    className="pl-10"
                  />
                </div>
                <Button variant="outline">Filter</Button>
              </div>
            </CardContent>
          </Card>

          {/* Patients List */}
          <div className="grid gap-4">
            {patients.map((patient) => (
              <Card key={patient.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4">
                        <div>
                          <h3 className="font-semibold text-foreground">{patient.name}</h3>
                          <div className="flex items-center space-x-4 mt-1 text-sm text-muted-foreground">
                            <span className="flex items-center space-x-1">
                              <Mail className="h-3 w-3" />
                              <span>{patient.email}</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <Phone className="h-3 w-3" />
                              <span>{patient.phone}</span>
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 mt-3">
                        <Badge 
                          variant={patient.status === 'Active' ? 'default' : 'secondary'}
                          className={patient.status === 'Active' ? 'bg-healing text-white' : ''}
                        >
                          {patient.status}
                        </Badge>
                        <Badge variant="outline">
                          {patient.plan}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          Progress: {patient.progress}%
                        </span>
                      </div>
                      <div className="mt-2 text-sm text-muted-foreground">
                        <span className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3" />
                          <span>Next session: {patient.nextSession}</span>
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button size="sm" className="bg-wellness hover:bg-wellness/90">
                        <Calendar className="h-4 w-4 mr-1" />
                        Schedule
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default PatientManagement;