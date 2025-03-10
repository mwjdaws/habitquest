
import React from "react";
import { AlertTriangle, Lightbulb, ThumbsUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export const AuthImprovementsSection: React.FC = () => {
  return (
    <div>
      <h3 className="text-lg font-medium">Improvement Opportunities</h3>
      <p className="text-sm text-muted-foreground mt-1 mb-3">
        Several enhancements could improve security, user experience, and code quality.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div className="bg-yellow-50 dark:bg-yellow-950/30 p-3 rounded-md border border-yellow-200 dark:border-yellow-800">
          <h4 className="font-medium flex items-center text-yellow-800 dark:text-yellow-400">
            <AlertTriangle className="h-4 w-4 mr-2" />
            Security Enhancements
          </h4>
          <ul className="list-disc pl-5 mt-2 text-sm space-y-1 text-muted-foreground">
            <li>Add multi-factor authentication (MFA) support</li>
            <li>Implement password complexity requirements</li>
            <li>Add rate limiting for authentication attempts</li>
            <li>Enable email verification workflows</li>
          </ul>
        </div>
        
        <div className="bg-blue-50 dark:bg-blue-950/30 p-3 rounded-md border border-blue-200 dark:border-blue-800">
          <h4 className="font-medium flex items-center text-blue-800 dark:text-blue-400">
            <Lightbulb className="h-4 w-4 mr-2" />
            Feature Additions
          </h4>
          <ul className="list-disc pl-5 mt-2 text-sm space-y-1 text-muted-foreground">
            <li>Social login providers (Google, GitHub, etc.)</li>
            <li>Password reset workflow</li>
            <li>User profile management</li>
            <li>Role-based access control (RBAC)</li>
          </ul>
        </div>
        
        <div className="col-span-1 md:col-span-2 bg-green-50 dark:bg-green-950/30 p-3 rounded-md border border-green-200 dark:border-green-800">
          <h4 className="font-medium flex items-center text-green-800 dark:text-green-400">
            <ThumbsUp className="h-4 w-4 mr-2" />
            Code Structure Improvements
          </h4>
          <ul className="list-disc pl-5 mt-2 text-sm space-y-1 text-muted-foreground">
            <li>Separate authentication into dedicated module with cleaner API surface</li>
            <li>Implement hooks for specific auth operations (useLogin, useSignup, etc.)</li>
            <li>Add comprehensive TypeScript interfaces for auth state and operations</li>
            <li>Better error handling with specific error types and recovery paths</li>
          </ul>
          
          <div className="mt-4 flex justify-end">
            <Button size="sm" variant="outline" className="text-xs">
              Ask Lovable to improve auth system
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
