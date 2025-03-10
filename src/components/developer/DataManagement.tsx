
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const DataManagement: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Data Management</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="text-lg font-medium">Database Architecture</h3>
          <p className="text-sm text-muted-foreground mt-1">
            The application uses Supabase (PostgreSQL) for data persistence with the following schema:
          </p>
          
          <Accordion type="single" collapsible className="w-full mt-3">
            <AccordionItem value="habits-schema">
              <AccordionTrigger>Habits Schema</AccordionTrigger>
              <AccordionContent className="space-y-2">
                <div className="p-3 border rounded-md">
                  <h4 className="font-medium">habits</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Core table for habit records.
                  </p>
                  <div className="mt-2 text-xs font-mono bg-muted p-2 rounded overflow-x-auto">
                    <pre>{`
id: uuid PRIMARY KEY
user_id: uuid NOT NULL
name: text NOT NULL
description: text
category: text NOT NULL DEFAULT 'General'
color: text NOT NULL DEFAULT 'habit-purple'
frequency: text[] NOT NULL
current_streak: integer DEFAULT 0
longest_streak: integer DEFAULT 0
archived: boolean DEFAULT false
created_at: timestamp with time zone NOT NULL DEFAULT now()
updated_at: timestamp with time zone NOT NULL DEFAULT now()
                    `}</pre>
                  </div>
                </div>
                
                <div className="p-3 border rounded-md">
                  <h4 className="font-medium">habit_completions</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Records of completed habits.
                  </p>
                  <div className="mt-2 text-xs font-mono bg-muted p-2 rounded overflow-x-auto">
                    <pre>{`
id: uuid PRIMARY KEY
habit_id: uuid NOT NULL
user_id: uuid NOT NULL
completed_date: date NOT NULL
created_at: timestamp with time zone NOT NULL DEFAULT now()
                    `}</pre>
                  </div>
                </div>
                
                <div className="p-3 border rounded-md">
                  <h4 className="font-medium">habit_failures</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Records of habits marked as failed.
                  </p>
                  <div className="mt-2 text-xs font-mono bg-muted p-2 rounded overflow-x-auto">
                    <pre>{`
id: uuid PRIMARY KEY
habit_id: uuid NOT NULL
user_id: uuid NOT NULL
reason: text NOT NULL
failure_date: date NOT NULL
created_at: timestamp with time zone NOT NULL DEFAULT now()
                    `}</pre>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="goals-schema">
              <AccordionTrigger>Goals Schema</AccordionTrigger>
              <AccordionContent className="space-y-2">
                <div className="p-3 border rounded-md">
                  <h4 className="font-medium">goals</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Table for storing user goals.
                  </p>
                  <div className="mt-2 text-xs font-mono bg-muted p-2 rounded overflow-x-auto">
                    <pre>{`
id: uuid PRIMARY KEY
user_id: uuid NOT NULL
name: text NOT NULL
objective: text NOT NULL
start_date: date NOT NULL
end_date: date NOT NULL
progress: numeric NOT NULL DEFAULT 0
created_at: timestamp with time zone NOT NULL DEFAULT now()
updated_at: timestamp with time zone NOT NULL DEFAULT now()
                    `}</pre>
                  </div>
                </div>
                
                <div className="p-3 border rounded-md">
                  <h4 className="font-medium">key_results</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Measurable outcomes for goals (OKR model).
                  </p>
                  <div className="mt-2 text-xs font-mono bg-muted p-2 rounded overflow-x-auto">
                    <pre>{`
id: uuid PRIMARY KEY
goal_id: uuid NOT NULL
description: text NOT NULL
target_value: numeric NOT NULL
current_value: numeric NOT NULL DEFAULT 0
habit_id: uuid
created_at: timestamp with time zone NOT NULL DEFAULT now()
updated_at: timestamp with time zone NOT NULL DEFAULT now()
                    `}</pre>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="journal-schema">
              <AccordionTrigger>Journal Schema</AccordionTrigger>
              <AccordionContent className="space-y-2">
                <div className="p-3 border rounded-md">
                  <h4 className="font-medium">journal_entries</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    User journal entries with optional sentiment analysis.
                  </p>
                  <div className="mt-2 text-xs font-mono bg-muted p-2 rounded overflow-x-auto">
                    <pre>{`
id: uuid PRIMARY KEY
user_id: uuid NOT NULL
content: text NOT NULL
tag: text
sentiment_score: numeric
created_at: timestamp with time zone NOT NULL DEFAULT now()
updated_at: timestamp with time zone NOT NULL DEFAULT now()
                    `}</pre>
                  </div>
                </div>
                
                <div className="p-3 border rounded-md">
                  <h4 className="font-medium">journal_prompts</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Predefined journaling prompts.
                  </p>
                  <div className="mt-2 text-xs font-mono bg-muted p-2 rounded overflow-x-auto">
                    <pre>{`
id: uuid PRIMARY KEY
text: text NOT NULL
tag: text NOT NULL
created_at: timestamp with time zone NOT NULL DEFAULT now()
                    `}</pre>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="sleep-schema">
              <AccordionTrigger>Sleep Tracking Schema</AccordionTrigger>
              <AccordionContent>
                <div className="p-3 border rounded-md">
                  <h4 className="font-medium">sleep_entries</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Sleep tracking data with quality metrics.
                  </p>
                  <div className="mt-2 text-xs font-mono bg-muted p-2 rounded overflow-x-auto">
                    <pre>{`
id: uuid PRIMARY KEY
user_id: uuid
sleep_date: date NOT NULL
bedtime: time NOT NULL
wake_time: time NOT NULL
time_slept_minutes: integer NOT NULL
quality_score: double precision
routine_score: double precision
sleep_latency_minutes: integer
heart_rate: double precision
hrv: double precision
breath_rate: double precision
snoring_percentage: double precision
created_at: timestamp with time zone DEFAULT now()
                    `}</pre>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="routines-schema">
              <AccordionTrigger>Routines Schema</AccordionTrigger>
              <AccordionContent className="space-y-2">
                <div className="p-3 border rounded-md">
                  <h4 className="font-medium">routines</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Group of habits that can be completed together.
                  </p>
                  <div className="mt-2 text-xs font-mono bg-muted p-2 rounded overflow-x-auto">
                    <pre>{`
id: uuid PRIMARY KEY
user_id: uuid NOT NULL
name: text NOT NULL
description: text
time_of_day: text
created_at: timestamp with time zone NOT NULL DEFAULT now()
updated_at: timestamp with time zone NOT NULL DEFAULT now()
                    `}</pre>
                  </div>
                </div>
                
                <div className="p-3 border rounded-md">
                  <h4 className="font-medium">routine_habits</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Junction table linking routines and habits.
                  </p>
                  <div className="mt-2 text-xs font-mono bg-muted p-2 rounded overflow-x-auto">
                    <pre>{`
id: uuid PRIMARY KEY
routine_id: uuid NOT NULL
habit_id: uuid NOT NULL
position: integer DEFAULT 0
created_at: timestamp with time zone NOT NULL DEFAULT now()
                    `}</pre>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="tasks-schema">
              <AccordionTrigger>Tasks Schema</AccordionTrigger>
              <AccordionContent>
                <div className="p-3 border rounded-md">
                  <h4 className="font-medium">tasks</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    To-do items that can be linked to habits.
                  </p>
                  <div className="mt-2 text-xs font-mono bg-muted p-2 rounded overflow-x-auto">
                    <pre>{`
id: uuid PRIMARY KEY
user_id: uuid NOT NULL
name: text NOT NULL
description: text
tag: text
status: text NOT NULL DEFAULT 'pending'
due_date: date
habit_id: uuid
created_at: timestamp with time zone NOT NULL DEFAULT now()
                    `}</pre>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
        
        <div>
          <h3 className="text-lg font-medium">Data Flow Architecture</h3>
          <p className="text-sm text-muted-foreground mt-1">
            The application follows a consistent data flow pattern:
          </p>
          
          <div className="mt-3 p-3 border rounded-md bg-muted/30">
            <h4 className="font-medium">Frontend Data Flow</h4>
            <pre className="text-xs whitespace-pre-wrap mt-2">
              UI Components → Custom Hooks → Tanstack Query → API Layer → Supabase Client → Database
            </pre>
            <p className="text-xs mt-3">
              <span className="font-medium">Key features:</span>
            </p>
            <ul className="list-disc pl-5 text-xs mt-1 space-y-1">
              <li>Data fetching with Tanstack Query for caching and stale-time management</li>
              <li>Optimistic updates for improved perceived performance</li>
              <li>Service-based API layer for database interaction</li>
              <li>React context for application-wide state</li>
              <li>LocalStorage for persisting user preferences</li>
            </ul>
          </div>
        </div>
        
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
        
        <div>
          <h3 className="text-lg font-medium">Product Features</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Core functionality implemented in the application:
          </p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li><span className="font-medium">Habit Tracking:</span> Create, complete, and track habits with streak counting</li>
            <li><span className="font-medium">Goal Management:</span> Set and track goals using the OKR (Objectives and Key Results) framework</li>
            <li><span className="font-medium">Journaling:</span> Daily journaling with sentiment analysis and prompts</li>
            <li><span className="font-medium">Sleep Tracking:</span> Log and analyze sleep patterns and quality</li>
            <li><span className="font-medium">Dashboard:</span> Customizable, drag-and-drop dashboard with analytics widgets</li>
            <li><span className="font-medium">Routines:</span> Group habits into routines for batch completion</li>
            <li><span className="font-medium">Task Management:</span> To-do list functionality that can be linked to habits</li>
            <li><span className="font-medium">Theming:</span> Customizable UI themes with persistent preferences</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
