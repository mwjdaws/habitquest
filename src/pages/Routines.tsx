
import { Card, CardContent } from "@/components/ui/card";
import { RoutinesList } from "@/components/routines/RoutinesList";

export default function RoutinesPage() {
  return (
    <div className="container max-w-5xl mx-auto py-6 space-y-8">
      <h1 className="text-3xl font-bold">Routines</h1>
      <p className="text-muted-foreground">
        Create routines to group habits together and complete them all at once.
      </p>
      
      <Card>
        <CardContent className="pt-6">
          <RoutinesList />
        </CardContent>
      </Card>
    </div>
  );
}
