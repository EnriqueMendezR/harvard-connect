import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import Landing from "./pages/Landing";
import Activities from "./pages/Activities";
import ActivityDetail from "./pages/ActivityDetail";
import CreateActivity from "./pages/CreateActivity";
import Profile from "./pages/Profile";
import Auth from "./pages/Auth";
import HelpCenter from "./pages/HelpCenter";
import CommunityGuidelines from "./pages/CommunityGuidelines";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AppContent() {
  const location = useLocation();
  const { isAuthenticated, logout } = useAuth();
  
  const isAuthPage = location.pathname === "/auth";
  const isLegalPage = ["/help", "/guidelines", "/privacy", "/terms"].includes(location.pathname);

  return (
    <div className="min-h-screen flex flex-col">
      {!isAuthPage && (
        <Navbar isAuthenticated={isAuthenticated} onLogout={logout} />
      )}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={isAuthenticated ? <Activities /> : <Landing />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/activities/:id" element={<ActivityDetail />} />
          <Route path="/create" element={<CreateActivity />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/help" element={<HelpCenter />} />
          <Route path="/guidelines" element={<CommunityGuidelines />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {!isAuthPage && <Footer />}
    </div>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
