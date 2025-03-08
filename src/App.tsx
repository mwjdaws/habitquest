
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "./components/Layout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Habits from "./pages/Habits";
import Tasks from "./pages/Tasks";
import Goals from "./pages/Goals";
import Journal from "./pages/Journal";
import Mood from "./pages/Mood";
import Analytics from "./pages/Analytics";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  // This will be replaced with actual Supabase auth check
  const isAuthenticated = true; // Set to true temporarily for development

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route 
              path="/login" 
              element={
                isAuthenticated ? <Navigate to="/dashboard" /> : <Login />
              } 
            />

            {/* Protected routes */}
            <Route
              path="/"
              element={
                isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />
              }
            />

            {/* Layout wrapper for protected routes */}
            <Route element={<Layout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/habits" element={<Habits />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/goals" element={<Goals />} />
              <Route path="/journal" element={<Journal />} />
              <Route path="/mood" element={<Mood />} />
              <Route path="/analytics" element={<Analytics />} />
            </Route>

            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
