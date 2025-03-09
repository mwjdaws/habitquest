
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const ApiDocumentation: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>API Services Documentation</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          The application uses a service-based approach with Supabase as the backend. 
          All API calls are organized by domain and follow consistent patterns.
        </p>
        
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="habits-api">
            <AccordionTrigger>Habits API</AccordionTrigger>
            <AccordionContent className="space-y-2">
              <div className="p-3 border rounded-md">
                <h4 className="font-medium">fetchHabits(includeArchived?: boolean)</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Fetches all habits for the authenticated user. Can optionally include archived habits.
                </p>
                <div className="mt-2 text-xs font-mono bg-muted p-2 rounded">
                  Returns: Promise&lt;Habit[]&gt;
                </div>
              </div>
              
              <div className="p-3 border rounded-md">
                <h4 className="font-medium">createHabit(habit: HabitData)</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Creates a new habit for the authenticated user.
                </p>
                <div className="mt-2 text-xs font-mono bg-muted p-2 rounded">
                  Returns: Promise&lt;Habit&gt;
                </div>
              </div>
              
              <div className="p-3 border rounded-md">
                <h4 className="font-medium">updateHabit(id: string, habit: Partial&lt;Habit&gt;)</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Updates an existing habit by ID.
                </p>
                <div className="mt-2 text-xs font-mono bg-muted p-2 rounded">
                  Returns: Promise&lt;Habit&gt;
                </div>
              </div>
              
              <div className="p-3 border rounded-md">
                <h4 className="font-medium">deleteHabit(id: string)</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Deletes a habit and all related data (completions, failures, key results).
                </p>
                <div className="mt-2 text-xs font-mono bg-muted p-2 rounded">
                  Returns: Promise&lt;boolean&gt;
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="goals-api">
            <AccordionTrigger>Goals API</AccordionTrigger>
            <AccordionContent className="space-y-2">
              <div className="p-3 border rounded-md">
                <h4 className="font-medium">fetchGoals()</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Fetches all goals with their key results.
                </p>
                <div className="mt-2 text-xs font-mono bg-muted p-2 rounded">
                  Returns: Promise&lt;Goal[]&gt;
                </div>
              </div>
              
              <div className="p-3 border rounded-md">
                <h4 className="font-medium">createGoal(goalData: CreateGoalData)</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Creates a new goal with key results.
                </p>
                <div className="mt-2 text-xs font-mono bg-muted p-2 rounded">
                  Returns: Promise&lt;&#123; success: boolean; goalId?: string &#125;&gt;
                </div>
              </div>
              
              <div className="p-3 border rounded-md">
                <h4 className="font-medium">updateGoalProgress(goalId: string, progress: number)</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Updates a goal's progress percentage.
                </p>
                <div className="mt-2 text-xs font-mono bg-muted p-2 rounded">
                  Returns: Promise&lt;&#123; success: boolean; message?: string &#125;&gt;
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="sleep-api">
            <AccordionTrigger>Sleep API</AccordionTrigger>
            <AccordionContent className="space-y-2">
              <div className="p-3 border rounded-md">
                <h4 className="font-medium">fetchSleepEntries()</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Fetches all sleep entries for the current user.
                </p>
                <div className="mt-2 text-xs font-mono bg-muted p-2 rounded">
                  Returns: Promise&lt;SleepEntry[]&gt;
                </div>
              </div>
              
              <div className="p-3 border rounded-md">
                <h4 className="font-medium">fetchSleepEntry(id: string)</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Fetches a specific sleep entry by ID.
                </p>
                <div className="mt-2 text-xs font-mono bg-muted p-2 rounded">
                  Returns: Promise&lt;SleepEntry&gt;
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="journal-api">
            <AccordionTrigger>Journal API</AccordionTrigger>
            <AccordionContent className="space-y-2">
              <div className="p-3 border rounded-md">
                <h4 className="font-medium">fetchJournalEntries()</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Fetches all journal entries for the current user.
                </p>
              </div>
              
              <div className="p-3 border rounded-md">
                <h4 className="font-medium">createJournalEntry(data: CreateJournalEntryData)</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Creates a new journal entry with optional sentiment analysis.
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
};
