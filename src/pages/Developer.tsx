
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Code, FileText, Info, Database, Server, Zap } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { ApiDocumentation } from "@/components/developer/ApiDocumentation";
import { ArchitectureOverview } from "@/components/developer/ArchitectureOverview";
import { BusinessLogicDocs } from "@/components/developer/BusinessLogicDocs";
import { DocumentationResources } from "@/components/developer/DocumentationResources";

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
          <ArchitectureOverview />
        </TabsContent>
        
        <TabsContent value="api" className="mt-6">
          <ApiDocumentation />
        </TabsContent>
        
        <TabsContent value="business" className="mt-6">
          <BusinessLogicDocs />
        </TabsContent>
        
        <TabsContent value="docs" className="mt-6">
          <DocumentationResources />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Developer;
