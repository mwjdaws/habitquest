
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/dashboard");
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to HabitQuest</h1>
        <p className="text-xl text-gray-600">Redirecting to dashboard...</p>
      </div>
    </div>
  );
};

export default Index;
