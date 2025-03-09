
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export const VersionInfo: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Current Version</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="font-medium">Version:</span>
            <span>1.0.0</span>
          </div>
          <Separator />
          <div className="flex justify-between">
            <span className="font-medium">Last Updated:</span>
            <span>{new Date().toLocaleDateString()}</span>
          </div>
          <Separator />
          <div className="flex justify-between">
            <span className="font-medium">Build:</span>
            <span>2023.10.1</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
