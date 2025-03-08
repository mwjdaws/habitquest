
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type ErrorStateProps = {
  error: string;
};

export function ErrorState({ error }: ErrorStateProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Today's Habits</CardTitle>
        <CardDescription>Your habit progress for today</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="p-3 border border-red-300 bg-red-50 text-red-900 rounded-md">
          <p className="text-sm font-medium">{error}</p>
          <Button variant="outline" size="sm" className="mt-2" onClick={() => window.location.reload()}>
            Try again
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
