
import { AlertTriangle, Clock, RefreshCw } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

type HabitWarningStateProps = {
  type: 'inconsistent' | 'lost';
  daysInactive: number;
  onReestablish?: () => Promise<void>;
};

export function HabitWarningState({ type, daysInactive, onReestablish }: HabitWarningStateProps) {
  const isLost = type === 'lost';
  
  return (
    <Alert variant={isLost ? "destructive" : "default"} className="mt-1 py-2 px-3">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          {isLost ? (
            <AlertTriangle className="h-4 w-4" />
          ) : (
            <Clock className="h-4 w-4" />
          )}
          <AlertDescription className="text-xs">
            {isLost ? (
              <>This habit is lost ({daysInactive} days inactive)</>
            ) : (
              <>Becoming inconsistent ({daysInactive} days inactive)</>
            )}
          </AlertDescription>
        </div>
        
        {isLost && onReestablish && (
          <Button 
            variant="outline"
            size="sm"
            className="h-7 text-xs"
            onClick={onReestablish}
          >
            <RefreshCw className="h-3 w-3 mr-1" /> Reestablish
          </Button>
        )}
      </div>
    </Alert>
  );
}
