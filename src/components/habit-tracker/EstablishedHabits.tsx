
import { useMemo } from "react";
import { Habit } from "@/lib/habitTypes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Trophy, Calendar } from "lucide-react";
import { ESTABLISHED_HABIT_DAYS } from "@/lib/habitTypes";

type EstablishedHabitsProps = {
  habits: Habit[];
  loading: boolean;
};

export function EstablishedHabits({ habits, loading }: EstablishedHabitsProps) {
  const establishedHabits = useMemo(() => {
    return habits.filter(habit => habit.current_streak >= ESTABLISHED_HABIT_DAYS);
  }, [habits]);

  const inProgressHabits = useMemo(() => {
    return habits
      .filter(habit => habit.current_streak > 0 && habit.current_streak < ESTABLISHED_HABIT_DAYS)
      .sort((a, b) => b.current_streak - a.current_streak)
      .slice(0, 3); // Top 3 closest to established
  }, [habits]);

  if (loading) {
    return (
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            Established Habits
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="py-8 text-center text-muted-foreground">Loading habits...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-6">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          Established Habits
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {establishedHabits.length === 0 && inProgressHabits.length === 0 ? (
          <div className="py-6 text-center text-muted-foreground">
            <p>No established habits yet</p>
            <p className="text-sm mt-1">
              Complete habits for {ESTABLISHED_HABIT_DAYS} consecutive days to establish them
            </p>
          </div>
        ) : (
          <>
            {establishedHabits.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-semibold text-sm flex items-center gap-1.5">
                  <Trophy className="h-4 w-4" /> Established ({establishedHabits.length})
                </h3>
                <div className="space-y-2">
                  {establishedHabits.map(habit => (
                    <div key={habit.id} className="flex items-center gap-3 p-3 rounded-md border">
                      <div 
                        className="w-1 h-10 rounded-full" 
                        style={{ backgroundColor: habit.color ? `var(--${habit.color})` : 'var(--primary)' }}
                      />
                      <div className="flex-1">
                        <div className="font-medium">{habit.name}</div>
                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {habit.current_streak} day streak
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {inProgressHabits.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-semibold text-sm flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" /> In Progress
                </h3>
                <div className="space-y-3">
                  {inProgressHabits.map(habit => (
                    <div key={habit.id} className="space-y-1.5">
                      <div className="flex justify-between items-center">
                        <div className="font-medium text-sm">{habit.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {habit.current_streak}/{ESTABLISHED_HABIT_DAYS} days
                        </div>
                      </div>
                      <Progress 
                        value={(habit.current_streak / ESTABLISHED_HABIT_DAYS) * 100}
                        indicatorClassName={`bg-${habit.color || 'primary'}`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
