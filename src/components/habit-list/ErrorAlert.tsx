
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getUserFriendlyErrorMessage } from "@/lib/error-utils";

type ErrorAlertProps = {
  message: string | Error;
  onRetry?: () => void;
};

export function ErrorAlert({ message, onRetry }: ErrorAlertProps) {
  const errorText = typeof message === 'string' ? message : message.message;
  const userFriendlyMessage = getUserFriendlyErrorMessage(message);
  
  return (
    <Alert variant="destructive" className="mb-4">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription className="flex justify-between items-center">
        <span>{userFriendlyMessage}</span>
        {onRetry && (
          <Button 
            variant="outline" 
            size="sm" 
            className="ml-4 bg-transparent hover:bg-red-100 border-red-300 text-red-700"
            onClick={onRetry}
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            Try Again
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
}
