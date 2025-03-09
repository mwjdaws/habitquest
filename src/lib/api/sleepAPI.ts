
import { supabase } from "../supabase";
import { SleepEntry, SleepFormData } from "../sleepTypes";
import { getTodayFormattedInToronto } from "../dateUtils";

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
  const { data, error } = await supabase
    .from('sleep_entries')
    .select('*')
    .order('sleep_date', { ascending: false });

  if (error) {
    throw new Error(`Error fetching sleep entries: ${error.message}`);
  }

  return data || [];
};

export const fetchSleepEntry = async (id: string): Promise<SleepEntry> => {
  const { data, error } = await supabase
    .from('sleep_entries')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    throw new Error(`Error fetching sleep entry: ${error.message}`);
  }

  return data;
};

export const createSleepEntry = async (entryData: SleepFormData): Promise<SleepEntry> => {
  // Calculate time slept based on bedtime and wake time
  const time_slept_minutes = calculateTimeSleptMinutes(entryData.bedtime, entryData.wake_time);
  
  const { data, error } = await supabase
    .from('sleep_entries')
    .insert([{ ...entryData, time_slept_minutes }])
    .select()
    .single();

  if (error) {
    throw new Error(`Error creating sleep entry: ${error.message}`);
  }

  return data;
};

export const updateSleepEntry = async (id: string, entryData: SleepFormData): Promise<SleepEntry> => {
  // Calculate time slept based on bedtime and wake time
  const time_slept_minutes = calculateTimeSleptMinutes(entryData.bedtime, entryData.wake_time);
  
  const { data, error } = await supabase
    .from('sleep_entries')
    .update({ ...entryData, time_slept_minutes })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(`Error updating sleep entry: ${error.message}`);
  }

  return data;
};

export const deleteSleepEntry = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('sleep_entries')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(`Error deleting sleep entry: ${error.message}`);
  }
};
