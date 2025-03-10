
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DatabaseSection } from "./data-management/DatabaseSection";
import { DataFlowSection } from "./data-management/DataFlowSection";
import { SecuritySection } from "./data-management/SecuritySection";
import { FeaturesSection } from "./data-management/FeaturesSection";
import { 
  habitsSchema, 
  goalsSchema, 
  journalSchema, 
  sleepSchema, 
  routinesSchema, 
  tasksSchema 
} from "./data-management/databaseSchema";

export const DataManagement: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Data Management</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <DatabaseSection 
          title="Database Architecture"
          description="The application uses Supabase (PostgreSQL) for data persistence with the following schema:"
          tables={habitsSchema}
        />
        
        <DatabaseSection 
          title="Goals Schema"
          description="Schema for goal tracking and OKRs:"
          tables={goalsSchema}
        />
        
        <DatabaseSection 
          title="Journal Schema"
          description="Schema for journal entries and prompts:"
          tables={journalSchema}
        />
        
        <DatabaseSection 
          title="Sleep Tracking Schema"
          description="Schema for sleep data tracking:"
          tables={sleepSchema}
        />
        
        <DatabaseSection 
          title="Routines Schema"
          description="Schema for habit routines management:"
          tables={routinesSchema}
        />
        
        <DatabaseSection 
          title="Tasks Schema"
          description="Schema for task management:"
          tables={tasksSchema}
        />
        
        <DataFlowSection />
        
        <SecuritySection />
        
        <FeaturesSection />
      </CardContent>
    </Card>
  );
};
