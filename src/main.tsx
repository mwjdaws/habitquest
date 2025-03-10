
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Habits from "./pages/Habits";
import Routines from "./pages/Routines";
import Tasks from "./pages/Tasks";
import Goals from "./pages/Goals";
import Journal from "./pages/Journal";
import Sleep from "./pages/Sleep";
import Analytics from "./pages/Analytics";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import { Layout } from "./components/Layout";
import AuthLayout from "./components/auth/AuthLayout";
import { AuthProvider } from "./contexts/AuthContext";
import { Toaster } from "./components/ui/sonner";
import { ThemeSwitcher } from "./components/ThemeSwitcher";
import Developer from "./pages/Developer";
import Mood from "./pages/Mood";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Create a client
const queryClient = new QueryClient();

// Create a router with all routes
const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthWrapper><Layout /></AuthWrapper>,
    children: [
      {
        index: true,
        element: <Index />,
      },
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "habits",
        element: <Habits />,
      },
      {
        path: "routines",
        element: <Routines />,
      },
      {
        path: "tasks",
        element: <Tasks />,
      },
      {
        path: "goals",
        element: <Goals />,
      },
      {
        path: "journal",
        element: <Journal />,
      },
      {
        path: "sleep",
        element: <Sleep />,
      },
      {
        path: "analytics",
        element: <Analytics />,
      },
      {
        path: "mood",
        element: <Mood />,
      },
      {
        path: "developer",
        element: <Developer />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
  {
    path: "/login",
    element: (
      <AuthProvider>
        <AuthLayout>
          <Login />
          <Toaster />
        </AuthLayout>
      </AuthProvider>
    ),
  },
]);

// Wrapper component that provides both Auth and Query contexts
function AuthWrapper({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        {children}
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeSwitcher>
      <RouterProvider router={router} />
    </ThemeSwitcher>
  </React.StrictMode>
);
