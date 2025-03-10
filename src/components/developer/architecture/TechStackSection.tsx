
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
        <li><span className="font-medium">Layout System:</span> React Grid Layout (responsive, draggable grid)</li>
        <li><span className="font-medium">Animation:</span> Framer Motion</li>
      </ul>

      <h4 className="text-base font-medium mt-4">Dashboard Technologies</h4>
      <ul className="list-disc pl-5 space-y-1 mt-1">
        <li><span className="font-medium">react-grid-layout:</span> Core library for the draggable/resizable dashboard grid</li>
        <li><span className="font-medium">localStorage:</span> For persisting user dashboard customizations</li>
        <li><span className="font-medium">Responsive breakpoints:</span> Custom layouts for different screen sizes</li>
        <li><span className="font-medium">Grid animations:</span> Smooth transitions when moving dashboard widgets</li>
        <li><span className="font-medium">Performance optimization:</span> Memoization with useMemo and useCallback</li>
      </ul>
    </div>
  );
};
