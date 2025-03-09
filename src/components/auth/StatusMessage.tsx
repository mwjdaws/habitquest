
import { AlertCircle, Info, CheckCircle } from "lucide-react";
import { getUserFriendlyErrorMessage } from "@/lib/error-utils";

type StatusMessageProps = {
  errorMessage?: string | Error;
  infoMessage?: string;
  successMessage?: string;
  className?: string;
};

const StatusMessage = ({ 
  errorMessage, 
  infoMessage, 
  successMessage,
  className = ""
}: StatusMessageProps) => {
  // Return null if no messages to display
  if (!errorMessage && !infoMessage && !successMessage) {
    return null;
  }
  
  // Convert error object to user-friendly message if needed
  const friendlyErrorMessage = errorMessage 
    ? getUserFriendlyErrorMessage(errorMessage)
    : undefined;
  
  return (
    <div className={`space-y-2 ${className}`}>
      {friendlyErrorMessage && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md flex items-start gap-2 text-red-800">
          <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
          <span>{friendlyErrorMessage}</span>
        </div>
      )}
      
      {infoMessage && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-md flex items-start gap-2 text-blue-800">
          <Info className="h-5 w-5 shrink-0 mt-0.5" />
          <span>{infoMessage}</span>
        </div>
      )}
      
      {successMessage && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-md flex items-start gap-2 text-green-800">
          <CheckCircle className="h-5 w-5 shrink-0 mt-0.5" />
          <span>{successMessage}</span>
        </div>
      )}
    </div>
  );
};

export default StatusMessage;
