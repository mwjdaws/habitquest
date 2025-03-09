
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Toaster } from './components/ui/toaster';
import Index from './pages/Index';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Habits from './pages/Habits';
import Tasks from './pages/Tasks';
import Goals from './pages/Goals';
import Journal from './pages/Journal';
import Mood from './pages/Mood';
import Analytics from './pages/Analytics';
import Developer from './pages/Developer';
import NotFound from './pages/NotFound';
import { Layout } from './components/Layout';
import Sleep from "./pages/Sleep";

export default function App() {
  return (
    <>
      <Toaster />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route element={<Layout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/habits" element={<Habits />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/goals" element={<Goals />} />
              <Route path="/journal" element={<Journal />} />
              <Route path="/mood" element={<Mood />} />
              <Route path="/sleep" element={<Sleep />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/developer" element={<Developer />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </>
  );
}
