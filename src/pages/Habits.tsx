
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Habits = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Habit Tracking</CardTitle>
          <CardDescription>Track your daily habits</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Connect to Supabase to start tracking your habits
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Habits;
