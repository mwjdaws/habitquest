
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Code, FileText, Info, Database, Server, Zap } from "lucide-react";
import { ApiDocumentation } from "@/components/developer/ApiDocumentation";
import { ArchitectureOverview } from "@/components/developer/ArchitectureOverview";
import { BusinessLogicDocs } from "@/components/developer/BusinessLogicDocs";
import { DocumentationResources } from "@/components/developer/DocumentationResources";
import { VersionInfo } from "@/components/developer/VersionInfo";

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
          <VersionInfo />
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
