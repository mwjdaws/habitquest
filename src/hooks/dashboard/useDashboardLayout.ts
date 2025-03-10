
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { DEFAULT_LAYOUTS } from "@/components/dashboard/constants/dashboardLayouts";
import { useIsMobile } from "@/hooks/use-mobile";

export function useDashboardLayout() {
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

  // Handle layout changes
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

  return {
    layouts,
    isDraggable,
    isResizable,
    layoutChanged,
    isLocked,
    isMobile,
    handleLayoutChange,
    handleResetLayout,
    handleSaveLayout,
    toggleLock
  };
}
