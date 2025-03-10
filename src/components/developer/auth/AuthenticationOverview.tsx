
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AuthImplementationSection } from "./AuthImplementationSection";
import { AuthFlowSection } from "./AuthFlowSection";
import { AuthImprovementsSection } from "./AuthImprovementsSection";

export const AuthenticationOverview: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Authentication System</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <AuthImplementationSection />
        <AuthFlowSection />
        <AuthImprovementsSection />
      </CardContent>
    </Card>
  );
};
