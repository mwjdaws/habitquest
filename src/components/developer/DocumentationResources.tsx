
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const DocumentationResources: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Documentation Resources</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="text-lg font-medium">Component Documentation</h3>
          <p className="text-muted-foreground mt-1">
            The application uses shadcn/ui components with custom extensions. Key components include:
          </p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li><span className="font-medium">HabitTracker</span> - Core habit tracking functionality</li>
            <li><span className="font-medium">GoalsList</span> - OKR management interface</li>
            <li><span className="font-medium">Analytics</span> - Data visualization components</li>
            <li><span className="font-medium">JournalEntryForm</span> - Journal entry creation with sentiment analysis</li>
          </ul>
        </div>
        
        <div>
          <h3 className="text-lg font-medium">Custom Hooks</h3>
          <ul className="list-disc pl-5 space-y-1 mt-1">
            <li><span className="font-medium">useHabitData</span> - Manages habit data fetching and caching</li>
            <li><span className="font-medium">useTrendData</span> - Provides analytics data with time filtering</li>
            <li><span className="font-medium">useGoals</span> - Handles goal CRUD operations</li>
            <li><span className="font-medium">useSleepEntries</span> - Sleep tracking data management</li>
            <li><span className="font-medium">useJournalEntries</span> - Journal entry management with sentiment analysis</li>
          </ul>
        </div>
        
        <div>
          <h3 className="text-lg font-medium">API Integration Guide</h3>
          <p className="text-muted-foreground mt-1">
            All API interactions use a consistent pattern with proper error handling:
          </p>
          <div className="mt-2 p-3 border rounded-md bg-muted/30 font-mono text-xs overflow-x-auto">
            <pre>{`// Example API pattern
export const fetchData = async () => {
  try {
    const userId = await getAuthenticatedUser();
    
    const { data, error } = await supabase
      .from("table_name")
      .select("*")
      .eq("user_id", userId);
      
    if (error) throw error;
    return data || [];
  } catch (error) {
    return handleApiError(error, "fetching data");
  }
};`}</pre>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium">Contribution Guidelines</h3>
          <p className="text-muted-foreground mt-1">
            When contributing code to the project, follow these guidelines:
          </p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>Use TypeScript for all new code with proper type definitions</li>
            <li>Follow the existing pattern for API services</li>
            <li>Create custom hooks for complex state management</li>
            <li>Use Tanstack Query for all data fetching operations</li>
            <li>Implement proper error handling with user-friendly messages</li>
            <li>Add JSDoc comments to exported functions and components</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
