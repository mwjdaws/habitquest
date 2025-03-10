
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArchitectureOverviewSection,
  UIFrameworkSection,
  RadixAccessibilitySection,
  ReactArchitectureSection,
  TailwindSection,
  TechStackSection,
  DirectoryStructureSection,
  DesignSystemSection
} from "./architecture/ArchitectureSections";

export const ArchitectureOverview: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>System Architecture</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <ArchitectureOverviewSection />
        <UIFrameworkSection />
        <RadixAccessibilitySection />
        <ReactArchitectureSection />
        <TailwindSection />
        <TechStackSection />
        <DirectoryStructureSection />
        <DesignSystemSection />
      </CardContent>
    </Card>
  );
};
