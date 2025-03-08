
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Goals = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Goal Setting</CardTitle>
          <CardDescription>Set and track your personal goals</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Connect to Supabase to manage your goals
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Goals;
