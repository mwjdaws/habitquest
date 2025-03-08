
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Code, FileText, Info } from "lucide-react";
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
        <TabsList>
          <TabsTrigger value="version"><Code className="mr-2 h-4 w-4" /> Current Version</TabsTrigger>
          <TabsTrigger value="features"><Info className="mr-2 h-4 w-4" /> Product Features</TabsTrigger>
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
        
        <TabsContent value="features" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Product Features</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-2">
                <li>Habit tracking with streak monitoring</li>
                <li>Task management with priorities and due dates</li>
                <li>Goal setting with progress tracking</li>
                <li>Journal entries with mood tracking</li>
                <li>Mood analysis and pattern recognition</li>
                <li>Analytics dashboard with personal insights</li>
                <li>User authentication and profile management</li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="docs" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Developer Documentation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-medium">Architecture Overview</h3>
                <p className="text-muted-foreground mt-1">
                  HabitQuest is built using React with TypeScript, leveraging React Router for navigation,
                  Tanstack Query for data fetching, and Supabase for backend services.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium">Key Components</h3>
                <ul className="list-disc pl-5 space-y-1 mt-1">
                  <li><span className="font-medium">AuthContext</span> - Handles user authentication state</li>
                  <li><span className="font-medium">AppSidebar</span> - Main navigation component</li>
                  <li><span className="font-medium">HabitTracker</span> - Core habit tracking functionality</li>
                  <li><span className="font-medium">Analytics</span> - Data visualization components</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-medium">API Integration</h3>
                <p className="text-muted-foreground mt-1">
                  The application connects to Supabase for data storage, authentication, and real-time updates.
                  API calls are managed through custom hooks with automatic error handling and retry logic.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Developer;
