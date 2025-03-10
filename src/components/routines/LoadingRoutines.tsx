
import { Card, CardContent } from "@/components/ui/card";

export function LoadingRoutines() {
  return (
    <Card>
      <CardContent className="py-10">
        <div className="flex justify-center">
          <div className="animate-pulse h-6 w-32 bg-muted rounded"></div>
        </div>
      </CardContent>
    </Card>
  );
}
