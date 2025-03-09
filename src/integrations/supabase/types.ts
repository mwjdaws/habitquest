export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      goals: {
        Row: {
          created_at: string
          end_date: string
          id: string
          name: string
          objective: string
          progress: number
          start_date: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          end_date: string
          id?: string
          name: string
          objective: string
          progress?: number
          start_date: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          end_date?: string
          id?: string
          name?: string
          objective?: string
          progress?: number
          start_date?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      habit_completions: {
        Row: {
          completed_date: string
          created_at: string
          habit_id: string
          id: string
          user_id: string
        }
        Insert: {
          completed_date: string
          created_at?: string
          habit_id: string
          id?: string
          user_id: string
        }
        Update: {
          completed_date?: string
          created_at?: string
          habit_id?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "habit_completions_habit_id_fkey"
            columns: ["habit_id"]
            isOneToOne: false
            referencedRelation: "habits"
            referencedColumns: ["id"]
          },
        ]
      }
      habit_failures: {
        Row: {
          created_at: string
          failure_date: string
          habit_id: string
          id: string
          reason: string
          user_id: string
        }
        Insert: {
          created_at?: string
          failure_date: string
          habit_id: string
          id?: string
          reason: string
          user_id: string
        }
        Update: {
          created_at?: string
          failure_date?: string
          habit_id?: string
          id?: string
          reason?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "habit_failures_habit_id_fkey"
            columns: ["habit_id"]
            isOneToOne: false
            referencedRelation: "habits"
            referencedColumns: ["id"]
          },
        ]
      }
      habits: {
        Row: {
          archived: boolean | null
          category: string
          color: string
          created_at: string
          current_streak: number | null
          description: string | null
          frequency: string[]
          id: string
          longest_streak: number | null
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          archived?: boolean | null
          category?: string
          color?: string
          created_at?: string
          current_streak?: number | null
          description?: string | null
          frequency?: string[]
          id?: string
          longest_streak?: number | null
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          archived?: boolean | null
          category?: string
          color?: string
          created_at?: string
          current_streak?: number | null
          description?: string | null
          frequency?: string[]
          id?: string
          longest_streak?: number | null
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      journal_entries: {
        Row: {
          content: string
          created_at: string
          id: string
          sentiment_score: number | null
          tag: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          sentiment_score?: number | null
          tag?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          sentiment_score?: number | null
          tag?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      journal_prompts: {
        Row: {
          created_at: string
          id: string
          tag: string
          text: string
        }
        Insert: {
          created_at?: string
          id?: string
          tag: string
          text: string
        }
        Update: {
          created_at?: string
          id?: string
          tag?: string
          text?: string
        }
        Relationships: []
      }
      key_results: {
        Row: {
          created_at: string
          current_value: number
          description: string
          goal_id: string
          habit_id: string | null
          id: string
          target_value: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          current_value?: number
          description: string
          goal_id: string
          habit_id?: string | null
          id?: string
          target_value: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          current_value?: number
          description?: string
          goal_id?: string
          habit_id?: string | null
          id?: string
          target_value?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "key_results_goal_id_fkey"
            columns: ["goal_id"]
            isOneToOne: false
            referencedRelation: "goals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "key_results_habit_id_fkey"
            columns: ["habit_id"]
            isOneToOne: false
            referencedRelation: "habits"
            referencedColumns: ["id"]
          },
        ]
      }
      sleep_entries: {
        Row: {
          bedtime: string
          breath_rate: number | null
          created_at: string | null
          heart_rate: number | null
          hrv: number | null
          id: string
          quality_score: number | null
          routine_score: number | null
          sleep_date: string
          sleep_latency_minutes: number | null
          snoring_percentage: number | null
          time_slept_minutes: number
          user_id: string | null
          wake_time: string
        }
        Insert: {
          bedtime: string
          breath_rate?: number | null
          created_at?: string | null
          heart_rate?: number | null
          hrv?: number | null
          id?: string
          quality_score?: number | null
          routine_score?: number | null
          sleep_date: string
          sleep_latency_minutes?: number | null
          snoring_percentage?: number | null
          time_slept_minutes: number
          user_id?: string | null
          wake_time: string
        }
        Update: {
          bedtime?: string
          breath_rate?: number | null
          created_at?: string | null
          heart_rate?: number | null
          hrv?: number | null
          id?: string
          quality_score?: number | null
          routine_score?: number | null
          sleep_date?: string
          sleep_latency_minutes?: number | null
          snoring_percentage?: number | null
          time_slept_minutes?: number
          user_id?: string | null
          wake_time?: string
        }
        Relationships: []
      }
      tasks: {
        Row: {
          created_at: string
          description: string | null
          due_date: string | null
          habit_id: string | null
          id: string
          name: string
          status: string
          tag: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          due_date?: string | null
          habit_id?: string | null
          id?: string
          name: string
          status?: string
          tag?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          due_date?: string | null
          habit_id?: string | null
          id?: string
          name?: string
          status?: string
          tag?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_habit_id_fkey"
            columns: ["habit_id"]
            isOneToOne: false
            referencedRelation: "habits"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
