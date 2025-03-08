
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Journal = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Journaling</CardTitle>
          <CardDescription>Record your thoughts and reflections</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Connect to Supabase to start journaling
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Journal;
