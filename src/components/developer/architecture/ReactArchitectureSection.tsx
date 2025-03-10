
import React from "react";

export const ReactArchitectureSection: React.FC = () => {
  return (
    <div>
      <h3 className="text-lg font-medium">React Architecture Patterns</h3>
      <p className="text-muted-foreground mt-1">
        The application implements modern React architecture patterns for maintainability and performance:
      </p>
      <ul className="list-disc pl-5 space-y-1 mt-2">
        <li>
          <span className="font-medium">Component Composition:</span> Smaller, focused components that compose into larger features
        </li>
        <li>
          <span className="font-medium">Custom Hooks:</span> Logic extraction into reusable hooks (see <code>src/hooks/</code>)
        </li>
        <li>
          <span className="font-medium">Performance Optimization:</span> Strategic use of <code>React.memo</code>, <code>useCallback</code>, and <code>useMemo</code>
        </li>
        <li>
          <span className="font-medium">Form Abstraction:</span> Reusable form components with validation patterns
        </li>
        <li>
          <span className="font-medium">Context API:</span> State sharing for theme, authentication, and notifications
        </li>
        <li>
          <span className="font-medium">Render Optimization:</span> Component memoization to prevent unnecessary re-renders
        </li>
      </ul>

      <h4 className="text-base font-medium mt-4">Example: Optimized Component Pattern</h4>
      <div className="mt-2 p-3 border rounded-md bg-muted/30 text-xs md:text-sm font-mono overflow-x-auto">
        <pre>{`
// Component memoization
export const TaskItem = memo(function TaskItem({ task, onToggle }) {
  // Component implementation
}, taskPropsAreEqual);

// Custom hooks for logic extraction
function useTaskActions(taskId) {
  const toggleTask = useCallback(() => {
    // Implementation
  }, [taskId]);
  
  return { toggleTask };
}

// Computed values with useMemo
const filteredTasks = useMemo(() => {
  return tasks.filter(task => !task.completed);
}, [tasks]);`}</pre>
      </div>
    </div>
  );
};
