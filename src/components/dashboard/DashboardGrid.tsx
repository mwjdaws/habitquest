
import { ReactNode, useState, useEffect } from "react";
import { Responsive, WidthProvider } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-grid-layout/css/resizable.css";
import { Button } from "@/components/ui/button";
import { Save, RotateCcw } from "lucide-react";
import { toast } from "sonner";

const ResponsiveGridLayout = WidthProvider(Responsive);

// Default layouts for different screen sizes
const DEFAULT_LAYOUTS = {
  lg: [
    { i: "habit-tracker", x: 0, y: 0, w: 2, h: 2, minW: 1, minH: 1 },
    { i: "task-stats", x: 2, y: 0, w: 1, h: 1, minW: 1, minH: 1 },
    { i: "streak-stats", x: 0, y: 2, w: 1, h: 1, minW: 1, minH: 1 },
    { i: "upcoming-tasks", x: 1, y: 2, w: 1, h: 1, minW: 1, minH: 1 },
    { i: "goals-progress", x: 2, y: 1, w: 1, h: 2, minW: 1, minH: 1 },
  ],
  md: [
    { i: "habit-tracker", x: 0, y: 0, w: 1, h: 2, minW: 1, minH: 1 },
    { i: "task-stats", x: 1, y: 0, w: 1, h: 1, minW: 1, minH: 1 },
    { i: "streak-stats", x: 0, y: 2, w: 1, h: 1, minW: 1, minH: 1 },
    { i: "upcoming-tasks", x: 1, y: 1, w: 1, h: 1, minW: 1, minH: 1 },
    { i: "goals-progress", x: 0, y: 3, w: 2, h: 1, minW: 1, minH: 1 },
  ],
  sm: [
    { i: "habit-tracker", x: 0, y: 0, w: 1, h: 2, minW: 1, minH: 1 },
    { i: "task-stats", x: 0, y: 2, w: 1, h: 1, minW: 1, minH: 1 },
    { i: "streak-stats", x: 0, y: 3, w: 1, h: 1, minW: 1, minH: 1 },
    { i: "upcoming-tasks", x: 0, y: 4, w: 1, h: 1, minW: 1, minH: 1 },
    { i: "goals-progress", x: 0, y: 5, w: 1, h: 1, minW: 1, minH: 1 },
  ],
};

// Widget IDs that correspond to the dashboard items
const WIDGET_IDS = [
  "habit-tracker",
  "task-stats", 
  "streak-stats", 
  "upcoming-tasks", 
  "goals-progress"
];

interface DashboardGridProps {
  children: ReactNode[];
}

export function DashboardGrid({ children }: DashboardGridProps) {
  // Load layouts from localStorage or use defaults
  const [layouts, setLayouts] = useState(() => {
    const savedLayouts = localStorage.getItem("dashboard-layouts");
    return savedLayouts ? JSON.parse(savedLayouts) : DEFAULT_LAYOUTS;
  });
  
  const [isDraggable, setIsDraggable] = useState(true);
  const [isResizable, setIsResizable] = useState(true);
  const [layoutChanged, setLayoutChanged] = useState(false);

  // Update localStorage when layouts change
  useEffect(() => {
    if (layoutChanged) {
      localStorage.setItem("dashboard-layouts", JSON.stringify(layouts));
    }
  }, [layouts, layoutChanged]);

  const handleLayoutChange = (_, allLayouts) => {
    setLayouts(allLayouts);
    setLayoutChanged(true);
  };

  const handleResetLayout = () => {
    setLayouts(DEFAULT_LAYOUTS);
    localStorage.setItem("dashboard-layouts", JSON.stringify(DEFAULT_LAYOUTS));
    toast.success("Dashboard layout has been reset to default");
    setLayoutChanged(false);
  };

  const handleSaveLayout = () => {
    localStorage.setItem("dashboard-layouts", JSON.stringify(layouts));
    toast.success("Dashboard layout saved successfully");
    setLayoutChanged(false);
  };

  // Map children to their respective grid items
  const gridItems = React.Children.map(children, (child, index) => {
    if (index < WIDGET_IDS.length) {
      return (
        <div key={WIDGET_IDS[index]} className="dashboard-item">
          {child}
        </div>
      );
    }
    return null;
  });

  // Add any remaining children that don't fit in the grid
  const remainingChildren = React.Children.toArray(children).slice(WIDGET_IDS.length);

  return (
    <div className="space-y-6">
      <div className="flex justify-end space-x-2 mb-4">
        {layoutChanged && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleSaveLayout}
            className="flex items-center gap-1"
          >
            <Save className="h-4 w-4" />
            Save Layout
          </Button>
        )}
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleResetLayout}
          className="flex items-center gap-1"
        >
          <RotateCcw className="h-4 w-4" />
          Reset Layout
        </Button>
      </div>

      <ResponsiveGridLayout
        className="layout"
        layouts={layouts}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 3, md: 2, sm: 1, xs: 1, xxs: 1 }}
        rowHeight={150}
        isDraggable={isDraggable}
        isResizable={isResizable}
        onLayoutChange={handleLayoutChange}
        margin={[16, 16]}
      >
        {gridItems}
      </ResponsiveGridLayout>
      
      {/* Render any remaining children that don't fit in the grid layout */}
      {remainingChildren.length > 0 && (
        <div className="mt-8 space-y-6">
          {remainingChildren}
        </div>
      )}
    </div>
  );
}
