
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const ArchitectureOverview: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>System Architecture</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
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
      </CardContent>
    </Card>
  );
};
