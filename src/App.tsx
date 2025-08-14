import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { TicketProvider } from "@/contexts/TicketContext";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { LoginPage } from "@/pages/LoginPage";
import { Dashboard } from "@/pages/Dashboard";
import { CreateTicket } from "@/pages/CreateTicket";
import { TicketDetail } from "@/pages/TicketDetail";
import { UsersPage } from "@/pages/UsersPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <TicketProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Redirect root to dashboard */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              
              {/* Authentication */}
              <Route path="/login" element={<LoginPage />} />
              
              {/* Dashboard routes - all protected */}
              <Route path="/" element={<DashboardLayout />}>
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="create-ticket" element={<CreateTicket />} />
                <Route path="ticket/:id" element={<TicketDetail />} />
                <Route path="tickets" element={<Dashboard />} />
                <Route path="users" element={<UsersPage />} />
                <Route path="settings" element={<div className="p-6">Settings page coming soon...</div>} />
              </Route>
              
              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TicketProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
