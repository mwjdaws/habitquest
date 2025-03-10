
import React from "react";

export const TechStackSection: React.FC = () => {
  return (
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
  );
};
