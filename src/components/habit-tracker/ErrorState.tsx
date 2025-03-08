
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";
import { isNetworkError } from "@/lib/error-utils";

type ErrorStateProps = {
  error: string;
  onRetry?: () => void;
};

export function ErrorState({ error, onRetry }: ErrorStateProps) {
  const isConnectionError = isNetworkError(new Error(error));
  
  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      window.location.reload();
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Today's Habits</CardTitle>
        <CardDescription>Your habit progress for today</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="p-4 border border-red-300 bg-red-50 text-red-900 rounded-md flex flex-col items-center">
          <AlertCircle className="h-6 w-6 mb-2" />
          <p className="text-sm font-medium text-center mb-3">{error}</p>
          
          {isConnectionError ? (
            <p className="text-xs text-center mb-3">
              Looks like you might be offline. Check your internet connection and try again.
            </p>
          ) : null}
          
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1" 
            onClick={handleRetry}
          >
            <RefreshCw className="h-3 w-3" />
            Try again
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
