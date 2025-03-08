
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { HabitList } from "@/components/HabitList";

const Habits = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Habit Tracking</CardTitle>
          <CardDescription>Track your daily habits</CardDescription>
        </CardHeader>
        <CardContent>
          <HabitList />
        </CardContent>
      </Card>
    </div>
  );
};

export default Habits;
