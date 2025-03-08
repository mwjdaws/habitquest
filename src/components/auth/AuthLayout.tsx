
import { Flame } from "lucide-react";
import { ReactNode } from "react";

type AuthLayoutProps = {
  children: ReactNode;
};

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-habit-soft-purple to-habit-soft-blue p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-2">
            <Flame className="h-12 w-12 text-habit-purple" />
          </div>
          <h1 className="text-3xl font-bold">HabitQuest</h1>
          <p className="text-muted-foreground">Track habits, achieve goals</p>
        </div>
        
        {children}
        
        <div className="text-center mt-6 text-sm text-muted-foreground">
          <p className="mb-2">For quick testing, use these credentials:</p>
          <div className="p-3 bg-gray-100 rounded-md">
            <p><strong>Email:</strong> test@example.com</p>
            <p><strong>Password:</strong> password123</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
