
import React from "react";
import { Code } from "lucide-react";

export const AuthImplementationSection: React.FC = () => {
  return (
    <div>
      <h3 className="text-lg font-medium">Current Implementation</h3>
      <p className="text-sm text-muted-foreground mt-1 mb-3">
        The application uses Supabase Authentication with a custom React context wrapper.
      </p>
      
      <div className="bg-muted/30 p-3 rounded-md border">
        <h4 className="font-medium flex items-center">
          <Code className="h-4 w-4 mr-2" />
          Core Components
        </h4>
        <ul className="list-disc pl-5 mt-2 text-sm space-y-2">
          <li>
            <span className="font-medium">AuthContext.tsx</span>
            <p className="text-muted-foreground">React context provider that wraps Supabase auth functionality and manages user state</p>
          </li>
          <li>
            <span className="font-medium">authUtils.ts</span>
            <p className="text-muted-foreground">Helper functions for auth operations (signIn, signUp, signOut, etc.)</p>
          </li>
          <li>
            <span className="font-medium">Login.tsx</span>
            <p className="text-muted-foreground">UI components for authentication with tabbed login/signup flow</p>
          </li>
          <li>
            <span className="font-medium">Test Account Support</span>
            <p className="text-muted-foreground">Custom implementation for demo/testing with email: test@example.com</p>
          </li>
        </ul>
      </div>
    </div>
  );
};
