
import { AlertCircle, Info, CheckCircle } from "lucide-react";

type StatusMessageProps = {
  errorMessage: string;
  infoMessage: string;
  successMessage: string;
};

const StatusMessage = ({ errorMessage, infoMessage, successMessage }: StatusMessageProps) => {
  return (
    <>
      {errorMessage && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-start gap-2 text-red-800">
          <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}
      
      {infoMessage && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md flex items-start gap-2 text-blue-800">
          <Info className="h-5 w-5 shrink-0 mt-0.5" />
          <span>{infoMessage}</span>
        </div>
      )}
      
      {successMessage && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md flex items-start gap-2 text-green-800">
          <CheckCircle className="h-5 w-5 shrink-0 mt-0.5" />
          <span>{successMessage}</span>
        </div>
      )}
    </>
  );
};

export default StatusMessage;
