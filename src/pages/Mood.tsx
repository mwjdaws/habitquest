
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Mood = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Mood Tracking</CardTitle>
          <CardDescription>Track your daily mood and emotions</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Connect to Supabase to track your mood
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Mood;
