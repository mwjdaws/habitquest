
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

// Wrap the Layout component with AuthProvider, QueryClientProvider and Toaster
const LayoutWithAuth = () => (
  <AuthProvider>
    <QueryClientProvider client={queryClient}>
      <Layout />
      <Toaster />
    </QueryClientProvider>
  </AuthProvider>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <LayoutWithAuth />,
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
      <AuthLayout>
        <Login />
      </AuthLayout>
    ),
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeSwitcher>
      <RouterProvider router={router} />
    </ThemeSwitcher>
  </React.StrictMode>
);
