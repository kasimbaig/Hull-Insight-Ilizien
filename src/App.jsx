import React from 'react';
// Simple auth check for demo (replace with real auth logic as needed)
const isAuthenticated = () => {
  return localStorage.getItem('isLoggedIn') === 'true';
};

const RequireAuth = ({ children }) => {
  if (!isAuthenticated()) {
    window.location.href = '/login';
    return null;
  }
  return children;
};

const RedirectIfAuth = ({ children }) => {
  if (isAuthenticated()) {
    window.location.href = '/dashboard';
    return null;
  }
  return children;
};
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

import MainLayout from "./components/Layout/MainLayout";
import Dashboard from "./pages/Dashboard";
import GlobalMasters from "./pages/GlobalMasters";
import DockyardPlans from "./pages/DockyardPlans";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Hvac from './pages/Hvac';
import QuartelyHullSurvey from './pages/QuartelyHullSurvey';
import InteractiveDrawing from './pages/InteractiveDrawing.jsx';
import Reports from './pages/Reports';
import ManageUsers from './pages/ManageUsers';
import ManageUserRoles from './pages/ManageUserRoles';
import Landing from './pages/Landing';

const queryClient = new QueryClient();
//demo credentials and dashboard on top duplicate search bars 
const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<RedirectIfAuth><Login /></RedirectIfAuth>} />
          <Route path="/dashboard" element={<RequireAuth><MainLayout><Dashboard /></MainLayout></RequireAuth>} />
          <Route path="/masters" element={<RequireAuth><MainLayout><GlobalMasters /></MainLayout></RequireAuth>} />
          <Route path="/dockyard-plans" element={<RequireAuth><MainLayout><DockyardPlans /></MainLayout></RequireAuth>} />
          <Route path="/hull-surveys" element={<RequireAuth><MainLayout><QuartelyHullSurvey /></MainLayout></RequireAuth>} />
          <Route path="/drawing" element={<RequireAuth><MainLayout><InteractiveDrawing /></MainLayout></RequireAuth>} />
          <Route path="/reports" element={<RequireAuth><MainLayout><Reports /></MainLayout></RequireAuth>} />
          <Route path="/manage-users" element={<RequireAuth><MainLayout><ManageUsers /></MainLayout></RequireAuth>} />
          <Route path="/manage-roles" element={<RequireAuth><MainLayout><ManageUserRoles /></MainLayout></RequireAuth>} />
          <Route path="/audit" element={<RequireAuth><MainLayout><div className="p-8 text-center"><h2 className="text-2xl font-bold text-foreground">Audit & Notifications</h2><p className="text-muted-foreground">Coming Soon</p></div></MainLayout></RequireAuth>} />
          <Route path="/settings" element={<RequireAuth><MainLayout><div className="p-8 text-center"><h2 className="text-2xl font-bold text-foreground">Settings</h2><p className="text-muted-foreground">Coming Soon</p></div></MainLayout></RequireAuth>} />
          <Route path="/hvac" element={<RequireAuth><MainLayout><Hvac/></MainLayout></RequireAuth>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;