
// Types used across habit tracking hooks
import { Habit, HabitCompletion, HabitFailure } from "@/lib/habitTypes";

/**
 * Core state interface for habit tracking
 * Contains all data needed for tracking habits including habits, completions, and UI state
 */
export interface HabitTrackingState {
  habits: Habit[];
  filteredHabits: Habit[];
  completions: HabitCompletion[];
  failures: HabitFailure[];
  loading: boolean;
  error: string | null;
  isInitialized: boolean;
}

/**
 * Interface representing the complete public API of the habit tracking system
 * Provides data, actions, and metadata for habit tracking components
 */
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
  isAuthenticated: boolean;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  isToday: boolean;
}

/**
 * Interface for the state manager object that includes state setter
 * This is used internally to provide a self-referencing state object
 */
export interface StateManagerType extends HabitTrackingState {
  setState: React.Dispatch<React.SetStateAction<HabitTrackingState>>;
}
