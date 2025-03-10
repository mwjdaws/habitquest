
import React from "react";

export const DirectoryStructureSection: React.FC = () => {
  return (
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
  );
};
