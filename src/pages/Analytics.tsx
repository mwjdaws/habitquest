
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Analytics = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Analytics Dashboard</CardTitle>
          <CardDescription>Visualize your habits, mood, and progress</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Connect to Supabase to view your analytics
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Analytics;
