// UI components for notifications and tooltips
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

// React Query for server state management
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// React Router for navigation
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

// Authentication context
import { AuthProvider, useAuth } from "@/contexts/AuthContext";

// Layout components
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

// Page components
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

// Initialize React Query client for data fetching and caching
const queryClient = new QueryClient();

/**
 * Main application content component
 * Handles routing and conditional rendering of navbar/footer
 */
function AppContent() {
  const location = useLocation();
  const { isAuthenticated, logout } = useAuth();

  // Determine if we're on the auth page to conditionally hide navbar/footer
  const isAuthPage = location.pathname === "/auth";
  const isLegalPage = ["/help", "/guidelines", "/privacy", "/terms"].includes(location.pathname);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hide navbar on auth page */}
      {!isAuthPage && (
        <Navbar isAuthenticated={isAuthenticated} onLogout={logout} />
      )}

      {/* Main content area */}
      <main className="flex-1">
        <Routes>
          {/* Root route: show Activities if authenticated, Landing if not */}
          <Route path="/" element={isAuthenticated ? <Activities /> : <Landing />} />

          {/* Activity routes */}
          <Route path="/activities" element={<Activities />} />
          <Route path="/activities/:id" element={<ActivityDetail />} />
          <Route path="/create" element={<CreateActivity />} />

          {/* User profile */}
          <Route path="/profile" element={<Profile />} />

          {/* Authentication */}
          <Route path="/auth" element={<Auth />} />

          {/* Legal and help pages */}
          <Route path="/help" element={<HelpCenter />} />
          <Route path="/guidelines" element={<CommunityGuidelines />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />

          {/* 404 fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {/* Hide footer on auth page */}
      {!isAuthPage && <Footer />}
    </div>
  );
}

/**
 * Root App component
 * Wraps the application with necessary providers:
 * - QueryClientProvider: for React Query data management
 * - TooltipProvider: for UI tooltips
 * - BrowserRouter: for routing
 * - AuthProvider: for authentication state
 */
const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      {/* Toast notification components */}
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
