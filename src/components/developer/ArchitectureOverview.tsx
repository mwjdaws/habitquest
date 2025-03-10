
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger 
} from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";

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
        
        <Collapsible className="w-full border rounded-md p-4">
          <CollapsibleTrigger className="flex items-center justify-between w-full">
            <h3 className="text-lg font-medium">Accessibility with Radix UI Primitives</h3>
            <ChevronDown className="h-4 w-4 transition-transform duration-200 ui-open:rotate-180" />
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-4 space-y-4">
            <p className="text-muted-foreground">
              HabitQuest leverages shadcn/ui components built on Radix UI primitives to ensure high accessibility standards throughout the application:
            </p>
            
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li>
                <span className="font-medium">Focus Management:</span> Radix UI primitives handle proper focus trapping within modals, dropdowns, and other interactive elements. Focus moves logically between elements and is maintained when components mount or unmount.
              </li>
              <li>
                <span className="font-medium">Keyboard Navigation:</span> All interactive components support full keyboard control, including arrow keys, Tab/Shift+Tab for navigation, Escape to dismiss, and Enter/Space to activate.
              </li>
              <li>
                <span className="font-medium">ARIA Attributes:</span> Components automatically apply appropriate ARIA roles, states, and properties to ensure screen reader compatibility.
              </li>
              <li>
                <span className="font-medium">Portal Rendering:</span> Dialogs, popovers, and tooltips are rendered in a portal at the root level to avoid z-index and stacking context issues.
              </li>
              <li>
                <span className="font-medium">Proper Labeling:</span> Form components include proper labeling with explicit associations between inputs and their labels.
              </li>
              <li>
                <span className="font-medium">Screen Reader Announcements:</span> Critical UI changes are announced to screen readers using appropriate ARIA live regions.
              </li>
              <li>
                <span className="font-medium">Responsive Behaviors:</span> Components adapt to different viewport sizes while maintaining accessibility.
              </li>
            </ul>
            
            <h4 className="text-base font-medium mt-2">Example: Dialog Implementation</h4>
            <div className="mt-2 p-3 border rounded-md bg-muted/30 text-xs md:text-sm font-mono overflow-x-auto">
              <pre>{`
// Dialog component built on Radix UI DialogPrimitive
// This ensures proper focus management and keyboard navigation
<Dialog>
  <DialogTrigger asChild>
    <Button>Open Dialog</Button>
  </DialogTrigger>
  <DialogContent className="sm:max-w-[425px]">
    <DialogHeader>
      <DialogTitle>Accessible Dialog</DialogTitle>
      <DialogDescription>
        This dialog is keyboard navigable and screen-reader friendly.
      </DialogDescription>
    </DialogHeader>
    <div className="grid gap-4 py-4">
      {/* Form content */}
    </div>
    <DialogFooter>
      <Button type="submit">Save changes</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>

// Alert Dialog with proper ARIA roles and keyboard support
<AlertDialog>
  <AlertDialogTrigger asChild>
    <Button variant="destructive">Delete Item</Button>
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
      <AlertDialogDescription>
        This action cannot be undone.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction>Continue</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
              `}</pre>
            </div>
            
            <h4 className="text-base font-medium mt-4">Accessible Form Elements</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <div className="border rounded-md p-3">
                <h5 className="font-medium mb-2">Select Component</h5>
                <ul className="text-sm space-y-1">
                  <li>• Proper dropdown semantics</li>
                  <li>• Keyboard navigation between options</li>
                  <li>• Screen reader announcements</li>
                  <li>• Visual focus indicators</li>
                </ul>
              </div>
              <div className="border rounded-md p-3">
                <h5 className="font-medium mb-2">Checkbox & Radio</h5>
                <ul className="text-sm space-y-1">
                  <li>• Correctly associated labels</li>
                  <li>• Support for indeterminate state</li>
                  <li>• Custom styling with proper a11y</li>
                  <li>• Keyboard activation</li>
                </ul>
              </div>
              <div className="border rounded-md p-3">
                <h5 className="font-medium mb-2">Slider</h5>
                <ul className="text-sm space-y-1">
                  <li>• ARIA slider role</li>
                  <li>• Fine and coarse control with keys</li>
                  <li>• Value announcements</li>
                  <li>• Touch-friendly targets</li>
                </ul>
              </div>
              <div className="border rounded-md p-3">
                <h5 className="font-medium mb-2">Tooltips & Popovers</h5>
                <ul className="text-sm space-y-1">
                  <li>• Proper positioning</li>
                  <li>• Focus management</li>
                  <li>• Hover and focus activation</li>
                  <li>• Escape to dismiss</li>
                </ul>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
        
        <div>
          <h3 className="text-lg font-medium">React Architecture Patterns</h3>
          <p className="text-muted-foreground mt-1">
            The application implements modern React architecture patterns for maintainability and performance:
          </p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>
              <span className="font-medium">Component Composition:</span> Smaller, focused components that compose into larger features
            </li>
            <li>
              <span className="font-medium">Custom Hooks:</span> Logic extraction into reusable hooks (see <code>src/hooks/</code>)
            </li>
            <li>
              <span className="font-medium">Performance Optimization:</span> Strategic use of <code>React.memo</code>, <code>useCallback</code>, and <code>useMemo</code>
            </li>
            <li>
              <span className="font-medium">Form Abstraction:</span> Reusable form components with validation patterns
            </li>
            <li>
              <span className="font-medium">Context API:</span> State sharing for theme, authentication, and notifications
            </li>
            <li>
              <span className="font-medium">Render Optimization:</span> Component memoization to prevent unnecessary re-renders
            </li>
          </ul>

          <h4 className="text-base font-medium mt-4">Example: Optimized Component Pattern</h4>
          <div className="mt-2 p-3 border rounded-md bg-muted/30 text-xs md:text-sm font-mono overflow-x-auto">
            <pre>{`
// Component memoization
export const TaskItem = memo(function TaskItem({ task, onToggle }) {
  // Component implementation
}, taskPropsAreEqual);

// Custom hooks for logic extraction
function useTaskActions(taskId) {
  const toggleTask = useCallback(() => {
    // Implementation
  }, [taskId]);
  
  return { toggleTask };
}

// Computed values with useMemo
const filteredTasks = useMemo(() => {
  return tasks.filter(task => !task.completed);
}, [tasks]);`}</pre>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium">Tailwind CSS Best Practices</h3>
          <p className="text-muted-foreground mt-1">
            The application follows these Tailwind CSS best practices for maintainable, scalable styling:
          </p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>
              <span className="font-medium">Utility-First Approach:</span> Direct application of utility classes for most styling needs
            </li>
            <li>
              <span className="font-medium">Component Consistency:</span> Reusable class combinations through the <code>cn()</code> utility function
            </li>
            <li>
              <span className="font-medium">Theme Configuration:</span> Centralized theme variables in <code>tailwind.config.ts</code>
            </li>
            <li>
              <span className="font-medium">Custom Extensions:</span> Theme extensions for project-specific needs (custom colors, animations)
            </li>
            <li>
              <span className="font-medium">Design Tokens:</span> CSS variables for theme properties that change with color schemes
            </li>
            <li>
              <span className="font-medium">Responsive Design:</span> Mobile-first responsive utilities throughout the application
            </li>
          </ul>

          <h4 className="text-base font-medium mt-4">Example: Tailwind Usage Patterns</h4>
          <div className="mt-2 p-3 border rounded-md bg-muted/30 text-xs md:text-sm font-mono overflow-x-auto">
            <pre>{`
// Utility function for combining class names
import { cn } from "@/lib/utils";

// Component with conditional classes
<div className={cn(
  "p-4 rounded-lg", // Base styles
  "bg-card border border-border", // Themeable container
  "transition-all duration-200", // Animations
  isActive && "ring-2 ring-primary", // Conditional styles
  className // Allow style extension
)}>
  {children}
</div>

// CSS variables for theming
:root {
  --primary: 260 96% 66%;
  --primary-foreground: 260 0% 100%;
}

// Custom utility extensions
@layer utilities {
  .glass-effect {
    @apply backdrop-blur-sm bg-background/80 border border-border/50;
  }
}`}</pre>
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
