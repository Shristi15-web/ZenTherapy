import { Header } from "@/components/Header";
import { PractitionerDashboard } from "@/components/PractitionerDashboard";

const PractitionerView = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header userType="practitioner" userName="Dr. Meera Sharma" />
      <main className="container mx-auto px-4 py-8">
        <PractitionerDashboard />
      </main>
    </div>
  );
};

export default PractitionerView;