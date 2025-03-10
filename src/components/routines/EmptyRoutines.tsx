
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface EmptyRoutinesProps {
  onCreateRoutine: () => void;
}

export function EmptyRoutines({ onCreateRoutine }: EmptyRoutinesProps) {
  return (
    <Card>
      <CardContent className="py-10 flex flex-col items-center text-center">
        <p className="text-muted-foreground mb-4">You haven't created any routines yet.</p>
        <Button onClick={onCreateRoutine} variant="outline">
          Create Your First Routine
        </Button>
      </CardContent>
    </Card>
  );
}
