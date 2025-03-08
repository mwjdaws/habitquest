
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function GoalsProgress() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Goals Progress</CardTitle>
        <CardDescription>Track your progress towards your goals</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Connect to Supabase to track your goals progress
        </p>
      </CardContent>
    </Card>
  );
}
