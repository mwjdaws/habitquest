
import React from "react";
import { ArrowRight } from "lucide-react";

export const AuthFlowSection: React.FC = () => {
  return (
    <div>
      <h3 className="text-lg font-medium">Authentication Flow</h3>
      <p className="text-sm text-muted-foreground mt-1 mb-3">
        The application implements a standard authentication flow with session persistence.
      </p>
      
      <div className="bg-muted/30 p-3 rounded-md border">
        <div className="text-sm space-y-2">
          <div className="flex items-center">
            <div className="bg-primary/10 p-2 rounded-md text-primary font-medium w-32 mr-3">User Login</div>
            <ArrowRight className="h-4 w-4 text-muted-foreground mx-2" />
            <div className="flex-1">Email/password validation, Supabase auth request</div>
          </div>
          
          <div className="flex items-center">
            <div className="bg-primary/10 p-2 rounded-md text-primary font-medium w-32 mr-3">Auth Context</div>
            <ArrowRight className="h-4 w-4 text-muted-foreground mx-2" />
            <div className="flex-1">Updates global user state, stores session data</div>
          </div>
          
          <div className="flex items-center">
            <div className="bg-primary/10 p-2 rounded-md text-primary font-medium w-32 mr-3">Session Handling</div>
            <ArrowRight className="h-4 w-4 text-muted-foreground mx-2" />
            <div className="flex-1">Auto-reconnection via onAuthStateChange listener</div>
          </div>
          
          <div className="flex items-center">
            <div className="bg-primary/10 p-2 rounded-md text-primary font-medium w-32 mr-3">Protected Routes</div>
            <ArrowRight className="h-4 w-4 text-muted-foreground mx-2" />
            <div className="flex-1">useAuth hook used for access control in components</div>
          </div>
        </div>
      </div>
    </div>
  );
};
