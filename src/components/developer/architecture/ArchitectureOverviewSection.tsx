
import React from "react";

export const ArchitectureOverviewSection: React.FC = () => {
  return (
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
  );
};
