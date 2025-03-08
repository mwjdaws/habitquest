
import { Card, CardContent } from "@/components/ui/card";

export function EmptyState() {
  return (
    <Card>
      <CardContent className="py-8 text-center">
        <p className="text-muted-foreground">You don't have any habits yet. Create your first one!</p>
      </CardContent>
    </Card>
  );
}
