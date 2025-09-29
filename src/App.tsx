import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { initializeData } from "@/lib/storage";
import Index from "./pages/Index";
import Login from "./pages/Login";
import AdminPortal from "./pages/AdminPortal";
import Dashboard from "./pages/Dashboard";
import PractitionerView from "./pages/PractitionerView";
import Schedule from "./pages/Schedule";
import Progress from "./pages/Progress";
import Feedback from "./pages/Feedback";
import Demo from "./pages/Demo";
import PatientManagement from "./pages/PatientManagement";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    // Initialize mock data on app start
    initializeData();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/demo" element={<Demo />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<AdminPortal />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/practitioner" element={<PractitionerView />} />
            <Route path="/schedule" element={<Schedule />} />
            <Route path="/progress" element={<Progress />} />
            <Route path="/feedback" element={<Feedback />} />
            <Route path="/patients" element={<PatientManagement />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
