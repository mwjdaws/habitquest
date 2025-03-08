
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { HabitList } from "@/components/HabitList";
import { useAuth } from "@/contexts/AuthContext";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

const Habits = () => {
  const { user, isLoading } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const handleErrorOccurred = (errorMessage: string) => {
    setError(errorMessage);
  };

  const handleReload = () => {
    setError(null);
    window.location.reload();
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Habit Tracking</CardTitle>
            <CardDescription>Loading your habits...</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="py-8 text-center">Loading...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Habit Tracking</CardTitle>
            <CardDescription>Track your daily habits</CardDescription>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                You need to be logged in to manage your habits
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Habit Tracking</CardTitle>
            <CardDescription>Track your daily habits</CardDescription>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {error}
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="ml-4"
                  onClick={handleReload}
                >
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Retry
                </Button>
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Habit Tracking</CardTitle>
          <CardDescription>Track your daily habits</CardDescription>
        </CardHeader>
        <CardContent>
          <HabitList onError={handleErrorOccurred} />
        </CardContent>
      </Card>
    </div>
  );
};

export default Habits;
