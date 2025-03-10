
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const ArchitectureOverview: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>System Architecture</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
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
        </div>
        
        <div>
          <h3 className="text-lg font-medium">UI Framework & Design System</h3>
          <p className="text-muted-foreground mt-1">
            The application uses a carefully selected stack of UI technologies:
          </p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li><span className="font-medium">Component Library:</span> shadcn/ui - Headless UI components built on Radix UI primitives</li>
            <li><span className="font-medium">Styling:</span> Tailwind CSS - Utility-first CSS framework</li>
            <li><span className="font-medium">Icons:</span> Lucide React - Consistent, accessible icon set</li>
            <li><span className="font-medium">Data Visualization:</span> Recharts - Composable chart library</li>
            <li><span className="font-medium">Layout System:</span> Responsive grid + React Grid Layout for dashboard</li>
            <li><span className="font-medium">Notifications:</span> Sonner - Toast notification system</li>
          </ul>

          <h4 className="text-base font-medium mt-4">UI Component Structure</h4>
          <div className="mt-2 p-3 border rounded-md bg-muted/30 text-xs md:text-sm font-mono overflow-x-auto">
            <pre>{`
├── UI Primitives (src/components/ui/)
│   ├── Core components (button, card, dialog, etc.)
│   ├── Composites (sidebar, form elements, etc.)
│   └── Layout components (containers, grids)
│
├── Feature Components
│   ├── Habit tracking (HabitTracker, HabitList, etc.)
│   ├── Goals (GoalsList, GoalItem, etc.)
│   ├── Tasks (TaskList, TaskItem, etc.)
│   ├── Routines (RoutinesList, RoutineCard, etc.)
│   ├── Journal (JournalEntryForm, JournalEntryList, etc.)
│   └── Sleep (SleepEntryList, SleepForm, etc.)
│
├── Layout Components
│   ├── AppSidebar - Main navigation
│   ├── AppHeader - Top app bar
│   └── Layout - Overall page structure
│
└── Dashboard Components
    ├── DashboardGrid - Responsive grid layout
    ├── Widget components (HabitTrends, TaskStats, etc.)
    └── Chart components (ProgressChart, etc.)
            `}</pre>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium">Tech Stack</h3>
          <ul className="list-disc pl-5 space-y-1 mt-1">
            <li><span className="font-medium">Frontend:</span> React, TypeScript, Tailwind CSS, shadcn/ui</li>
            <li><span className="font-medium">State Management:</span> React Context, Tanstack Query</li>
            <li><span className="font-medium">Backend:</span> Supabase (PostgreSQL, Auth, Storage)</li>
            <li><span className="font-medium">Routing:</span> React Router</li>
            <li><span className="font-medium">Data Visualization:</span> Recharts</li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-medium">Directory Structure</h3>
          <p className="text-muted-foreground mt-1">
            The codebase follows a feature-based organization pattern:
          </p>
          
          <div className="mt-2 p-3 border rounded-md bg-muted/30 text-xs md:text-sm font-mono">
            <div>src/</div>
            <div className="pl-4">components/ - UI components organized by feature</div>
            <div className="pl-4">hooks/ - Custom React hooks</div>
            <div className="pl-4">lib/ - Utilities and type definitions</div>
            <div className="pl-8">api/ - API service modules</div>
            <div className="pl-4">contexts/ - React context providers</div>
            <div className="pl-4">pages/ - Top-level route components</div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium">Design System</h3>
          <p className="text-muted-foreground mt-1">
            The application implements a consistent design system:
          </p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li><span className="font-medium">Colors:</span> Custom theme with primary, secondary, accent colors</li>
            <li><span className="font-medium">Typography:</span> Hierarchical text system with consistent sizing</li>
            <li><span className="font-medium">Spacing:</span> Consistent spacing using Tailwind's spacing scale</li>
            <li><span className="font-medium">Components:</span> Card-based UI with consistent styling</li>
            <li><span className="font-medium">Theming:</span> Light/dark mode support via CSS variables</li>
            <li><span className="font-medium">Accessibility:</span> ARIA-compliant components from Radix UI</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
