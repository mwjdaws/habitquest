
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function LoadingState() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Today's Habits</CardTitle>
        <CardDescription>Your habit progress for today</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">Loading habits...</p>
      </CardContent>
    </Card>
  );
}
