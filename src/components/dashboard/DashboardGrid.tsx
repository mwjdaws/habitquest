
import React, { ReactNode, useMemo } from "react";
import { Responsive, WidthProvider } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import { DashboardHeader } from "./controls/DashboardHeader";
import { useDashboardLayout } from "@/hooks/dashboard/useDashboardLayout";
import { WIDGET_IDS, GRID_CONFIG } from "./constants/dashboardLayouts";

const ResponsiveGridLayout = WidthProvider(Responsive);

interface DashboardGridProps {
  children: ReactNode[];
}

export function DashboardGrid({ children }: DashboardGridProps) {
  const {
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
  } = useDashboardLayout();

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
      <DashboardHeader
        layoutChanged={layoutChanged}
        isLocked={isLocked}
        isMobile={isMobile}
        onToggleLock={toggleLock}
        onSaveLayout={handleSaveLayout}
        onResetLayout={handleResetLayout}
      />

      <div className="dashboard-grid-container">
        <ResponsiveGridLayout
          className="layout"
          layouts={layouts}
          breakpoints={GRID_CONFIG.breakpoints}
          cols={GRID_CONFIG.cols}
          rowHeight={isMobile ? GRID_CONFIG.mobileRowHeight : GRID_CONFIG.defaultRowHeight}
          isDraggable={isDraggable}
          isResizable={isResizable}
          onLayoutChange={handleLayoutChange}
          margin={GRID_CONFIG.margin}
          containerPadding={GRID_CONFIG.containerPadding}
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
