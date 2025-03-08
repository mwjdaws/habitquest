
// Types used across habit tracking hooks
import { Habit, HabitCompletion, HabitFailure } from "@/lib/habitTypes";

export interface HabitTrackingState {
  habits: Habit[];
  filteredHabits: Habit[];
  completions: HabitCompletion[];
  failures: HabitFailure[];
  loading: boolean;
  error: string | null;
  isInitialized: boolean;
}

export interface HabitTrackingResult {
  habits: Habit[];
  completions: HabitCompletion[];
  failures: HabitFailure[];
  loading: boolean;
  error: string | null;
  progress: number;
  completedCount: number;
  totalCount: number;
  handleToggleCompletion: (habitId: string) => Promise<void>;
  handleLogFailure: (habitId: string, reason: string) => Promise<void>;
  handleUndoFailure: (habitId: string) => Promise<void>;
  refreshData: (showLoading?: boolean) => void;
  isInitialized: boolean;
}
