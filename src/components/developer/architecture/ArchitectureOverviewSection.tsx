
import React from "react";

export const ArchitectureOverviewSection: React.FC = () => {
  return (
    <div>
      <h3 className="text-lg font-medium">Architecture Overview</h3>
      <p className="text-muted-foreground mt-1">
        HabitQuest follows a modern React frontend with Supabase backend architecture:
      </p>
      
      <div className="mt-4 p-4 border rounded-md bg-muted/30">
        <pre className="text-xs md:text-sm whitespace-pre-wrap">
          Client (React/TypeScript) ←→ Tanstack Query ←→ API Layer ←→ Supabase Services
        </pre>
      </div>

      <h4 className="text-base font-medium mt-6">Key Architectural Features</h4>
      <ul className="list-disc pl-5 space-y-1 mt-1">
        <li><span className="font-medium">Responsive Design:</span> Adaptive layouts across all device sizes</li>
        <li><span className="font-medium">Component-Based Structure:</span> Modular, reusable UI components</li>
        <li><span className="font-medium">Persisted User Preferences:</span> Layouts and settings stored in localStorage</li>
        <li><span className="font-medium">Reactive Data Flow:</span> Real-time UI updates using React hooks and context</li>
        <li><span className="font-medium">Dynamic Dashboard:</span> Using React Grid Layout for draggable, resizable widgets</li>
      </ul>

      <h4 className="text-base font-medium mt-6">Dashboard Grid System</h4>
      <p className="text-muted-foreground mt-1">
        The Dashboard uses React Grid Layout to provide a responsive, interactive grid system:
      </p>
      <ul className="list-disc pl-5 space-y-1 mt-1">
        <li><span className="font-medium">Responsive Breakpoints:</span> Layouts adapt to lg, md, sm, and xs viewport sizes</li>
        <li><span className="font-medium">Draggable & Resizable:</span> Interactive widgets (desktop only)</li>
        <li><span className="font-medium">Layout Persistence:</span> User customizations stored in localStorage</li>
        <li><span className="font-medium">Mobile Optimization:</span> Auto-locked layouts on mobile for better UX</li>
        <li><span className="font-medium">Performance Optimized:</span> Memoized components to prevent unnecessary re-renders</li>
      </ul>
    </div>
  );
};
