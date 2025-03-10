
import React from "react";

export const TailwindSection: React.FC = () => {
  return (
    <div>
      <h3 className="text-lg font-medium">Tailwind CSS Best Practices</h3>
      <p className="text-muted-foreground mt-1">
        The application follows these Tailwind CSS best practices for maintainable, scalable styling:
      </p>
      <ul className="list-disc pl-5 space-y-1 mt-2">
        <li>
          <span className="font-medium">Utility-First Approach:</span> Direct application of utility classes for most styling needs
        </li>
        <li>
          <span className="font-medium">Component Consistency:</span> Reusable class combinations through the <code>cn()</code> utility function
        </li>
        <li>
          <span className="font-medium">Theme Configuration:</span> Centralized theme variables in <code>tailwind.config.ts</code>
        </li>
        <li>
          <span className="font-medium">Custom Extensions:</span> Theme extensions for project-specific needs (custom colors, animations)
        </li>
        <li>
          <span className="font-medium">Design Tokens:</span> CSS variables for theme properties that change with color schemes
        </li>
        <li>
          <span className="font-medium">Responsive Design:</span> Mobile-first responsive utilities throughout the application
        </li>
      </ul>

      <h4 className="text-base font-medium mt-4">Example: Tailwind Usage Patterns</h4>
      <div className="mt-2 p-3 border rounded-md bg-muted/30 text-xs md:text-sm font-mono overflow-x-auto">
        <pre>{`
// Utility function for combining class names
import { cn } from "@/lib/utils";

// Component with conditional classes
<div className={cn(
  "p-4 rounded-lg", // Base styles
  "bg-card border border-border", // Themeable container
  "transition-all duration-200", // Animations
  isActive && "ring-2 ring-primary", // Conditional styles
  className // Allow style extension
)}>
  {children}
</div>

// CSS variables for theming
:root {
  --primary: 260 96% 66%;
  --primary-foreground: 260 0% 100%;
}

// Custom utility extensions
@layer utilities {
  .glass-effect {
    @apply backdrop-blur-sm bg-background/80 border border-border/50;
  }
}`}</pre>
      </div>
    </div>
  );
};
