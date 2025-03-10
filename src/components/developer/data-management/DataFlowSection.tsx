
import React from "react";

export const DataFlowSection: React.FC = () => {
  return (
    <div>
      <h3 className="text-lg font-medium">Data Flow Architecture</h3>
      <p className="text-sm text-muted-foreground mt-1">
        The application follows a consistent data flow pattern:
      </p>
      
      <div className="mt-3 p-3 border rounded-md bg-muted/30">
        <h4 className="font-medium">Frontend Data Flow</h4>
        <pre className="text-xs whitespace-pre-wrap mt-2">
          UI Components → Custom Hooks → Tanstack Query → API Layer → Supabase Client → Database
        </pre>
        <p className="text-xs mt-3">
          <span className="font-medium">Key features:</span>
        </p>
        <ul className="list-disc pl-5 text-xs mt-1 space-y-1">
          <li>Data fetching with Tanstack Query for caching and stale-time management</li>
          <li>Optimistic updates for improved perceived performance</li>
          <li>Service-based API layer for database interaction</li>
          <li>React context for application-wide state</li>
          <li>LocalStorage for persisting user preferences</li>
        </ul>
      </div>
    </div>
  );
};
