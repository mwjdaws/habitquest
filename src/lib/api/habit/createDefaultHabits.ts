
import { supabase } from "../../supabase";
import { getAuthenticatedUser, handleApiError } from "../apiUtils";
import { Habit } from "@/lib/habitTypes";

/**
 * Creates a set of default habits for new users
 * @returns {Promise<Habit[]>} Created default habits
 */
export const createDefaultHabits = async (): Promise<Habit[]> => {
  try {
    const userId = await getAuthenticatedUser();
    
    // Define default habits that all new users should start with
    const defaultHabits = [
      {
        name: "Drink water",
        description: "Drink at least 8 glasses of water",
        frequency: { type: "daily" },
        color: "#3498db",
        icon: "droplet",
        category: "health",
        reminder_time: null,
        user_id: userId,
        current_streak: 0,
        longest_streak: 0,
        archived: false
      },
      {
        name: "Exercise",
        description: "At least 30 minutes of physical activity",
        frequency: { type: "weekdays", days: ["monday", "wednesday", "friday"] },
        color: "#e74c3c",
        icon: "dumbbell",
        category: "health",
        reminder_time: null,
        user_id: userId,
        current_streak: 0,
        longest_streak: 0,
        archived: false
      },
      {
        name: "Read",
        description: "Read for at least 20 minutes",
        frequency: { type: "daily" },
        color: "#9b59b6",
        icon: "book-open",
        category: "personal",
        reminder_time: null,
        user_id: userId,
        current_streak: 0,
        longest_streak: 0,
        archived: false
      }
    ];
    
    // Insert the default habits into the database
    const { data, error } = await supabase
      .from("habits")
      .insert(defaultHabits)
      .select();
    
    if (error) throw error;
    return data || [];
    
  } catch (error) {
    return handleApiError(error, "creating default habits");
  }
};
