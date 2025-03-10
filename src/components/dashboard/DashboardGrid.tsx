
import React, { ReactNode, useState, useEffect, useMemo } from "react";
import { Responsive, WidthProvider } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import { Button } from "@/components/ui/button";
import { Save, RotateCcw, Lock, Unlock, LayoutDashboard } from "lucide-react";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";

const ResponsiveGridLayout = WidthProvider(Responsive);

// Enhanced default layouts with improved mobile breakpoints
const DEFAULT_LAYOUTS = {
  lg: [
    { i: "habit-tracker", x: 0, y: 0, w: 3, h: 5, minW: 2, minH: 4 },
    { i: "task-stats", x: 0, y: 5, w: 1, h: 4, minW: 1, minH: 3 },
    { i: "goals-progress", x: 1, y: 5, w: 1, h: 4, minW: 1, minH: 3 },
    { i: "streak-stats", x: 2, y: 5, w: 1, h: 4, minW: 1, minH: 3 },
    { i: "upcoming-tasks", x: 0, y: 9, w: 3, h: 4, minW: 2, minH: 3 },
    { i: "habit-trends", x: 0, y: 13, w: 3, h: 5, minW: 2, minH: 4 },
    { i: "journal-stats", x: 0, y: 18, w: 3, h: 6, minW: 3, minH: 5 },
  ],
  md: [
    { i: "habit-tracker", x: 0, y: 0, w: 2, h: 5, minW: 2, minH: 4 },
    { i: "task-stats", x: 0, y: 5, w: 1, h: 4, minW: 1, minH: 3 },
    { i: "upcoming-tasks", x: 1, y: 5, w: 1, h: 4, minW: 1, minH: 3 },
    { i: "streak-stats", x: 0, y: 9, w: 1, h: 4, minW: 1, minH: 3 },
    { i: "goals-progress", x: 1, y: 9, w: 1, h: 4, minW: 1, minH: 3 },
    { i: "habit-trends", x: 0, y: 13, w: 2, h: 5, minW: 2, minH: 4 },
    { i: "journal-stats", x: 0, y: 18, w: 2, h: 6, minW: 2, minH: 5 },
  ],
  sm: [
    { i: "habit-tracker", x: 0, y: 0, w: 1, h: 4, minW: 1, minH: 3 },
    { i: "task-stats", x: 0, y: 4, w: 1, h: 3, minW: 1, minH: 2 },
    { i: "upcoming-tasks", x: 0, y: 7, w: 1, h: 3, minW: 1, minH: 2 },
    { i: "streak-stats", x: 0, y: 10, w: 1, h: 3, minW: 1, minH: 2 },
    { i: "goals-progress", x: 0, y: 13, w: 1, h: 3, minW: 1, minH: 2 },
    { i: "habit-trends", x: 0, y: 16, w: 1, h: 4, minW: 1, minH: 3 },
    { i: "journal-stats", x: 0, y: 20, w: 1, h: 5, minW: 1, minH: 4 },
  ],
  xs: [
    { i: "habit-tracker", x: 0, y: 0, w: 1, h: 4, minW: 1, minH: 3 },
    { i: "task-stats", x: 0, y: 4, w: 1, h: 3, minW: 1, minH: 2 },
    { i: "upcoming-tasks", x: 0, y: 7, w: 1, h: 3, minW: 1, minH: 2 },
    { i: "streak-stats", x: 0, y: 10, w: 1, h: 3, minW: 1, minH: 2 },
    { i: "goals-progress", x: 0, y: 13, w: 1, h: 3, minW: 1, minH: 2 },
    { i: "habit-trends", x: 0, y: 16, w: 1, h: 4, minW: 1, minH: 3 },
    { i: "journal-stats", x: 0, y: 20, w: 1, h: 5, minW: 1, minH: 4 },
  ],
};

// Widget IDs that correspond to the dashboard items
const WIDGET_IDS = [
  "habit-tracker",
  "task-stats", 
  "streak-stats", 
  "upcoming-tasks", 
  "goals-progress",
  "habit-trends",
  "journal-stats"
];

interface DashboardGridProps {
  children: ReactNode[];
}

export function DashboardGrid({ children }: DashboardGridProps) {
  const isMobile = useIsMobile();
  
  // Load layouts from localStorage or use defaults
  const [layouts, setLayouts] = useState(() => {
    const savedLayouts = localStorage.getItem("dashboard-layouts");
    return savedLayouts ? JSON.parse(savedLayouts) : DEFAULT_LAYOUTS;
  });
  
  const [isDraggable, setIsDraggable] = useState(!isMobile);
  const [isResizable, setIsResizable] = useState(!isMobile);
  const [layoutChanged, setLayoutChanged] = useState(false);
  const [isLocked, setIsLocked] = useState(isMobile);

  // Update lock state when mobile state changes
  useEffect(() => {
    if (isMobile) {
      setIsDraggable(false);
      setIsResizable(false);
      setIsLocked(true);
    }
  }, [isMobile]);

  // Update localStorage when layouts change
  useEffect(() => {
    if (layoutChanged) {
      localStorage.setItem("dashboard-layouts", JSON.stringify(layouts));
    }
  }, [layouts, layoutChanged]);

  // Handle layout changes and enforce no collision
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

  const toggleLock = () => {
    if (!isMobile) {
      setIsDraggable(!isDraggable);
      setIsResizable(!isResizable);
      setIsLocked(!isLocked);
      toast.info(isDraggable ? "Dashboard locked" : "Dashboard unlocked");
    } else {
      toast.info("Layout editing is disabled on mobile devices");
    }
  };

  // Memoize grid items for better performance
  const gridItems = useMemo(() => {
    return React.Children.map(children, (child, index) => {
      if (index < WIDGET_IDS.length) {
        return (
          <div key={WIDGET_IDS[index]} className="dashboard-item">
            {child}
          </div>
        );
      }
      return null;
    });
  }, [children]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4 gap-2">
        <div className="flex items-center gap-2">
          <LayoutDashboard className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Dashboard</h2>
        </div>
        
        <div className="flex flex-wrap justify-end gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={toggleLock}
            className="flex items-center gap-1"
            disabled={isMobile}
          >
            {isLocked ? (
              <>
                <Unlock className="h-4 w-4" />
                <span className="hidden sm:inline">Unlock Layout</span>
              </>
            ) : (
              <>
                <Lock className="h-4 w-4" />
                <span className="hidden sm:inline">Lock Layout</span>
              </>
            )}
          </Button>
          {layoutChanged && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleSaveLayout}
              className="flex items-center gap-1"
            >
              <Save className="h-4 w-4" />
              <span className="hidden sm:inline">Save Layout</span>
            </Button>
          )}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleResetLayout}
            className="flex items-center gap-1"
          >
            <RotateCcw className="h-4 w-4" />
            <span className="hidden sm:inline">Reset Layout</span>
          </Button>
        </div>
      </div>

      <div className="dashboard-grid-container">
        <ResponsiveGridLayout
          className="layout"
          layouts={layouts}
          breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
          cols={{ lg: 3, md: 2, sm: 1, xs: 1, xxs: 1 }}
          rowHeight={isMobile ? 70 : 80}
          isDraggable={isDraggable}
          isResizable={isResizable}
          onLayoutChange={handleLayoutChange}
          margin={[12, 12]}
          containerPadding={[16, 16]}
          preventCollision={true}
          compactType="vertical"
          useCSSTransforms={true}
          verticalCompact={false}
          draggableHandle=".dashboard-item-header"
        >
          {gridItems}
        </ResponsiveGridLayout>
      </div>
    </div>
  );
}
