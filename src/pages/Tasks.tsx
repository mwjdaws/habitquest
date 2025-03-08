
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Tasks = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Task Management</CardTitle>
          <CardDescription>Organize and manage your tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Connect to Supabase to manage your tasks
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Tasks;
