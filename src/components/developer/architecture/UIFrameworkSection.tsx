
import React from "react";

export const UIFrameworkSection: React.FC = () => {
  return (
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
  );
};
