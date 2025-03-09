
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw, WifiOff, ServerCrash, Clock } from "lucide-react";
import { isNetworkError, getUserFriendlyErrorMessage } from "@/lib/error-utils";

type ErrorStateProps = {
  error: string | Error;
  onRetry?: () => void;
  compact?: boolean;
};

export function ErrorState({ error, onRetry, compact = false }: ErrorStateProps) {
  const errorMessage = typeof error === 'string' ? error : error.message;
  const isConnectionError = isNetworkError(error);
  const userFriendlyMessage = getUserFriendlyErrorMessage(error);
  
  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      window.location.reload();
    }
  };
  
  let Icon = AlertCircle;
  if (isConnectionError) {
    Icon = WifiOff;
  } else if (errorMessage.includes('timeout')) {
    Icon = Clock;
  } else if (errorMessage.includes('server') || errorMessage.includes('500')) {
    Icon = ServerCrash;
  }
  
  if (compact) {
    return (
      <div className="p-3 border border-red-300 bg-red-50 text-red-900 rounded-md flex items-center justify-between">
        <div className="flex items-center">
          <Icon className="h-4 w-4 mr-2 flex-shrink-0" />
          <p className="text-sm">{userFriendlyMessage}</p>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          className="ml-2 flex-shrink-0" 
          onClick={handleRetry}
        >
          <RefreshCw className="h-3 w-3 mr-1" />
          Retry
        </Button>
      </div>
    );
  }
  
  return (
    <Card className="border-red-200">
      <CardContent className="pt-6 text-center">
        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="bg-red-100 p-3 rounded-full">
            <Icon className="h-6 w-6 text-red-700" />
          </div>
          <h3 className="font-medium text-lg text-red-900">Something went wrong</h3>
          <p className="text-sm text-red-800 mb-2">{userFriendlyMessage}</p>
          
          {isConnectionError ? (
            <p className="text-xs text-red-700 max-w-md">
              Looks like you might be offline. Check your internet connection and try again.
            </p>
          ) : (
            <p className="text-xs text-red-700 max-w-md">
              We're having trouble loading your data. Please try refreshing the page.
            </p>
          )}
        </div>
      </CardContent>
      <CardFooter className="justify-center pb-6">
        <Button 
          variant="outline" 
          className="border-red-300 text-red-700 hover:bg-red-50" 
          onClick={handleRetry}
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Try again
        </Button>
      </CardFooter>
    </Card>
  );
}
