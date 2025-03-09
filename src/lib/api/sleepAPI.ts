
import { supabase } from "../supabase";
import { SleepEntry, SleepFormData } from "../sleepTypes";
import { getTodayFormattedInToronto } from "../dateUtils";
import { getAuthenticatedUser, handleApiError } from "./apiUtils";

// Calculate time slept in minutes based on bedtime and wake time
export const calculateTimeSleptMinutes = (bedtime: string, wake_time: string): number => {
  const [bedHours, bedMinutes] = bedtime.split(':').map(Number);
  const [wakeHours, wakeMinutes] = wake_time.split(':').map(Number);
  
  let minutesSlept = (wakeHours * 60 + wakeMinutes) - (bedHours * 60 + bedMinutes);
  
  // If wake time is before bedtime (next day), add 24 hours worth of minutes
  if (minutesSlept < 0) {
    minutesSlept += 24 * 60;
  }
  
  return minutesSlept;
};

export const fetchSleepEntries = async (): Promise<SleepEntry[]> => {
  try {
    const userId = await getAuthenticatedUser();
    
    const { data, error } = await supabase
      .from('sleep_entries')
      .select('*')
      .eq('user_id', userId)
      .order('sleep_date', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    return handleApiError(error, "fetching sleep entries", []);
  }
};

export const fetchSleepEntry = async (id: string): Promise<SleepEntry> => {
  try {
    const userId = await getAuthenticatedUser();
    
    const { data, error } = await supabase
      .from('sleep_entries')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    return handleApiError(error, "fetching sleep entry");
  }
};

export const createSleepEntry = async (entryData: SleepFormData): Promise<SleepEntry> => {
  try {
    const userId = await getAuthenticatedUser();
    
    // Calculate time slept based on bedtime and wake time
    const time_slept_minutes = calculateTimeSleptMinutes(entryData.bedtime, entryData.wake_time);
    
    const { data, error } = await supabase
      .from('sleep_entries')
      .insert([{ 
        ...entryData, 
        time_slept_minutes,
        user_id: userId
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    return handleApiError(error, "creating sleep entry");
  }
};

export const updateSleepEntry = async (id: string, entryData: SleepFormData): Promise<SleepEntry> => {
  try {
    const userId = await getAuthenticatedUser();
    
    // Calculate time slept based on bedtime and wake time
    const time_slept_minutes = calculateTimeSleptMinutes(entryData.bedtime, entryData.wake_time);
    
    const { data, error } = await supabase
      .from('sleep_entries')
      .update({ 
        ...entryData, 
        time_slept_minutes,
        user_id: userId
      })
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    return handleApiError(error, "updating sleep entry");
  }
};

export const deleteSleepEntry = async (id: string): Promise<void> => {
  try {
    const userId = await getAuthenticatedUser();
    
    const { error } = await supabase
      .from('sleep_entries')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) throw error;
  } catch (error) {
    handleApiError(error, "deleting sleep entry");
  }
};
