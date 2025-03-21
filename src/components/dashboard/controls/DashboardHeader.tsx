
import React from "react";
import { Button } from "@/components/ui/button";
import { Save, RotateCcw, Lock, Unlock, LayoutDashboard } from "lucide-react";
import { toast } from "sonner";

interface DashboardHeaderProps {
  layoutChanged: boolean;
  isLocked: boolean;
  isMobile: boolean;
  onToggleLock: () => void;
  onSaveLayout: () => void;
  onResetLayout: () => void;
}

export function DashboardHeader({
  layoutChanged,
  isLocked,
  isMobile,
  onToggleLock,
  onSaveLayout,
  onResetLayout
}: DashboardHeaderProps) {
  return (
    <header className="flex justify-between items-center mb-4 gap-2" aria-labelledby="dashboard-heading">
      <div className="flex items-center gap-2">
        <LayoutDashboard className="h-5 w-5 text-primary" aria-hidden="true" />
        <h2 id="dashboard-heading" className="text-xl font-semibold">Dashboard</h2>
      </div>
      
      <div className="flex flex-wrap justify-end gap-2" role="toolbar" aria-label="Dashboard controls">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onToggleLock}
          className="flex items-center gap-1"
          disabled={isMobile}
          aria-pressed={!isLocked}
          aria-label={isLocked ? "Unlock Layout" : "Lock Layout"}
        >
          {isLocked ? (
            <>
              <Unlock className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline">Unlock Layout</span>
            </>
          ) : (
            <>
              <Lock className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline">Lock Layout</span>
            </>
          )}
        </Button>
        {layoutChanged && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onSaveLayout}
            className="flex items-center gap-1"
            aria-label="Save Layout"
            data-testid="save-layout-button" 
          >
            <Save className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline">Save Layout</span>
          </Button>
        )}
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onResetLayout}
          className="flex items-center gap-1"
          aria-label="Reset Layout"
        >
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          <span className="hidden sm:inline">Reset Layout</span>
        </Button>
      </div>
    </header>
  );
}
