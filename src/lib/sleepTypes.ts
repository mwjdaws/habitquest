
export interface SleepEntry {
  id: string;
  sleep_date: string;
  bedtime: string;
  wake_time: string;
  time_slept_minutes: number;
  quality_score: number;
  routine_score: number;
  heart_rate?: number;
  hrv?: number;
  breath_rate?: number;
  snoring_percentage?: number;
  sleep_latency_minutes?: number;
  created_at: string;
}

export interface SleepFormData {
  sleep_date: string;
  bedtime: string;
  wake_time: string;
  quality_score: number;
  routine_score: number;
  heart_rate?: number;
  hrv?: number;
  breath_rate?: number;
  snoring_percentage?: number;
  sleep_latency_minutes?: number;
}
