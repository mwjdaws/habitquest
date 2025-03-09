
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Code, FileText, Info, Database, Server, GitBranch, Hammer, Zap } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const Developer = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Developer Documentation</h1>
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Developer Portal</AlertTitle>
        <AlertDescription>
          This page contains technical information about the application for developers.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="version" className="w-full">
        <TabsList className="w-full md:w-auto">
          <TabsTrigger value="version"><Code className="mr-2 h-4 w-4" /> Version</TabsTrigger>
          <TabsTrigger value="architecture"><Server className="mr-2 h-4 w-4" /> Architecture</TabsTrigger>
          <TabsTrigger value="api"><Database className="mr-2 h-4 w-4" /> API Services</TabsTrigger>
          <TabsTrigger value="business"><Zap className="mr-2 h-4 w-4" /> Business Logic</TabsTrigger>
          <TabsTrigger value="docs"><FileText className="mr-2 h-4 w-4" /> Documentation</TabsTrigger>
        </TabsList>
        
        <TabsContent value="version" className="space-y-4 mt-6">
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
        </TabsContent>
        
        <TabsContent value="architecture" className="mt-6 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Architecture</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-medium">Architecture Overview</h3>
                <p className="text-muted-foreground mt-1">
                  HabitQuest follows a modern React frontend with Supabase backend architecture:
                </p>
                
                <div className="mt-4 p-4 border rounded-md bg-muted/30">
                  <pre className="text-xs md:text-sm whitespace-pre-wrap">
                    Client (React/TypeScript) ←→ Tanstack Query ←→ API Layer ←→ Supabase Services
                  </pre>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium">Tech Stack</h3>
                <ul className="list-disc pl-5 space-y-1 mt-1">
                  <li><span className="font-medium">Frontend:</span> React, TypeScript, Tailwind CSS, shadcn/ui</li>
                  <li><span className="font-medium">State Management:</span> React Context, Tanstack Query</li>
                  <li><span className="font-medium">Backend:</span> Supabase (PostgreSQL, Auth, Storage)</li>
                  <li><span className="font-medium">Routing:</span> React Router</li>
                  <li><span className="font-medium">Data Visualization:</span> Recharts</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium">Directory Structure</h3>
                <p className="text-muted-foreground mt-1">
                  The codebase follows a feature-based organization pattern:
                </p>
                
                <div className="mt-2 p-3 border rounded-md bg-muted/30 text-xs md:text-sm font-mono">
                  <div>src/</div>
                  <div className="pl-4">components/ - UI components organized by feature</div>
                  <div className="pl-4">hooks/ - Custom React hooks</div>
                  <div className="pl-4">lib/ - Utilities and type definitions</div>
                  <div className="pl-8">api/ - API service modules</div>
                  <div className="pl-4">contexts/ - React context providers</div>
                  <div className="pl-4">pages/ - Top-level route components</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="api" className="mt-6">
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
        </TabsContent>
        
        <TabsContent value="business" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Business Logic Documentation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium">Habit Tracking System</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    The habit tracking system uses several key concepts:
                  </p>
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li><span className="font-medium">Streaks:</span> Consecutive days of habit completion</li>
                    <li><span className="font-medium">Frequency:</span> Days of the week when habits should be completed</li>
                    <li><span className="font-medium">Completion:</span> Recorded when a habit is marked as done</li>
                    <li><span className="font-medium">Failure:</span> Recorded when a habit is explicitly skipped</li>
                  </ul>
                  
                  <div className="mt-3 p-3 border rounded-md bg-muted/30">
                    <h4 className="font-medium">Streak Calculation Logic</h4>
                    <p className="text-xs md:text-sm mt-1">
                      Streaks are calculated based on consecutive completion dates, taking frequency into account.
                      A streak is only broken if a habit is explicitly marked as failed on a required day.
                      Habits are automatically reset to 0 streak when marked as failed.
                    </p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium">Goals and Key Results</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    The OKR (Objectives and Key Results) system operates on two levels:
                  </p>
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li><span className="font-medium">Goals:</span> Main objectives with start/end dates</li>
                    <li><span className="font-medium">Key Results:</span> Measurable outcomes that track progress</li>
                    <li><span className="font-medium">Progress Calculation:</span> Based on key result completion percentage</li>
                    <li><span className="font-medium">Habit Integration:</span> Key results can be linked to habits</li>
                  </ul>
                  
                  <div className="mt-3 p-3 border rounded-md bg-muted/30">
                    <h4 className="font-medium">Progress Calculation</h4>
                    <p className="text-xs md:text-sm mt-1">
                      Goal progress is calculated as: (sum of current key result values) / (sum of target key result values) * 100
                    </p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium">Sleep Tracking</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Sleep tracking includes multiple metrics:
                  </p>
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li><span className="font-medium">Quality Score:</span> Subjective quality rating (1-10)</li>
                    <li><span className="font-medium">Routine Score:</span> Consistency with normal sleep routine (1-10)</li>
                    <li><span className="font-medium">Biometrics:</span> Optional heart rate, HRV, and breathing metrics</li>
                    <li><span className="font-medium">Duration:</span> Total sleep time in minutes</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="docs" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Documentation Resources</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-medium">Component Documentation</h3>
                <p className="text-muted-foreground mt-1">
                  The application uses shadcn/ui components with custom extensions. Key components include:
                </p>
                <ul className="list-disc pl-5 space-y-1 mt-2">
                  <li><span className="font-medium">HabitTracker</span> - Core habit tracking functionality</li>
                  <li><span className="font-medium">GoalsList</span> - OKR management interface</li>
                  <li><span className="font-medium">Analytics</span> - Data visualization components</li>
                  <li><span className="font-medium">JournalEntryForm</span> - Journal entry creation with sentiment analysis</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-medium">Custom Hooks</h3>
                <ul className="list-disc pl-5 space-y-1 mt-1">
                  <li><span className="font-medium">useHabitData</span> - Manages habit data fetching and caching</li>
                  <li><span className="font-medium">useTrendData</span> - Provides analytics data with time filtering</li>
                  <li><span className="font-medium">useGoals</span> - Handles goal CRUD operations</li>
                  <li><span className="font-medium">useSleepEntries</span> - Sleep tracking data management</li>
                  <li><span className="font-medium">useJournalEntries</span> - Journal entry management with sentiment analysis</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-medium">API Integration Guide</h3>
                <p className="text-muted-foreground mt-1">
                  All API interactions use a consistent pattern with proper error handling:
                </p>
                <div className="mt-2 p-3 border rounded-md bg-muted/30 font-mono text-xs overflow-x-auto">
                  <pre>{`// Example API pattern
export const fetchData = async () => {
  try {
    const userId = await getAuthenticatedUser();
    
    const { data, error } = await supabase
      .from("table_name")
      .select("*")
      .eq("user_id", userId);
      
    if (error) throw error;
    return data || [];
  } catch (error) {
    return handleApiError(error, "fetching data");
  }
};`}</pre>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium">Contribution Guidelines</h3>
                <p className="text-muted-foreground mt-1">
                  When contributing code to the project, follow these guidelines:
                </p>
                <ul className="list-disc pl-5 space-y-1 mt-2">
                  <li>Use TypeScript for all new code with proper type definitions</li>
                  <li>Follow the existing pattern for API services</li>
                  <li>Create custom hooks for complex state management</li>
                  <li>Use Tanstack Query for all data fetching operations</li>
                  <li>Implement proper error handling with user-friendly messages</li>
                  <li>Add JSDoc comments to exported functions and components</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Developer;
