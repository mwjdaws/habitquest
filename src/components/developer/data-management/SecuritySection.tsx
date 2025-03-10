
import React from "react";

export const SecuritySection: React.FC = () => {
  return (
    <div>
      <h3 className="text-lg font-medium">Data Security</h3>
      <p className="text-sm text-muted-foreground mt-1">
        Security measures implemented in the data layer:
      </p>
      <ul className="list-disc pl-5 space-y-1 mt-2">
        <li><span className="font-medium">Row-Level Security (RLS):</span> All tables are protected with RLS policies ensuring users can only access their own data</li>
        <li><span className="font-medium">JWT Authentication:</span> All API requests authenticated with JWTs from Supabase Auth</li>
        <li><span className="font-medium">Input Validation:</span> All user inputs validated on both client and server</li>
        <li><span className="font-medium">Error Handling:</span> Comprehensive error handling with user-friendly messages</li>
      </ul>
    </div>
  );
};
