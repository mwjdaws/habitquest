
import React from "react";

export const DesignSystemSection: React.FC = () => {
  return (
    <div>
      <h3 className="text-lg font-medium">Design System</h3>
      <p className="text-muted-foreground mt-1">
        The application implements a consistent design system:
      </p>
      <ul className="list-disc pl-5 space-y-1 mt-2">
        <li><span className="font-medium">Colors:</span> Custom theme with primary, secondary, accent colors</li>
        <li><span className="font-medium">Typography:</span> Hierarchical text system with consistent sizing</li>
        <li><span className="font-medium">Spacing:</span> Consistent spacing using Tailwind's spacing scale</li>
        <li><span className="font-medium">Components:</span> Card-based UI with consistent styling</li>
        <li><span className="font-medium">Theming:</span> Light/dark mode support via CSS variables</li>
        <li><span className="font-medium">Accessibility:</span> ARIA-compliant components from Radix UI</li>
      </ul>
    </div>
  );
};
