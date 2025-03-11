
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface RetryButtonProps {
  onRetry: () => void;
}

export function RetryButton({ onRetry }: RetryButtonProps) {
  return (
    <div className="mt-4 flex justify-center">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={onRetry}
        className="flex items-center gap-1"
      >
        <RefreshCw className="h-3 w-3" />
        Retry loading habits
      </Button>
    </div>
  );
}
