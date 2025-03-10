
export const habitsSchema = [
  {
    title: "habits",
    description: "Core table for habit records.",
    value: "habits-table",
    content: `
id: uuid PRIMARY KEY
user_id: uuid NOT NULL
name: text NOT NULL
description: text
category: text NOT NULL DEFAULT 'General'
color: text NOT NULL DEFAULT 'habit-purple'
frequency: text[] NOT NULL
current_streak: integer DEFAULT 0
longest_streak: integer DEFAULT 0
archived: boolean DEFAULT false
created_at: timestamp with time zone NOT NULL DEFAULT now()
updated_at: timestamp with time zone NOT NULL DEFAULT now()
    `
  },
  {
    title: "habit_completions",
    description: "Records of completed habits.",
    value: "habit-completions",
    content: `
id: uuid PRIMARY KEY
habit_id: uuid NOT NULL
user_id: uuid NOT NULL
completed_date: date NOT NULL
created_at: timestamp with time zone NOT NULL DEFAULT now()
    `
  },
  {
    title: "habit_failures",
    description: "Records of habits marked as failed.",
    value: "habit-failures",
    content: `
id: uuid PRIMARY KEY
habit_id: uuid NOT NULL
user_id: uuid NOT NULL
reason: text NOT NULL
failure_date: date NOT NULL
created_at: timestamp with time zone NOT NULL DEFAULT now()
    `
  }
];

export const goalsSchema = [
  {
    title: "goals",
    description: "Table for storing user goals.",
    value: "goals-table",
    content: `
id: uuid PRIMARY KEY
user_id: uuid NOT NULL
name: text NOT NULL
objective: text NOT NULL
start_date: date NOT NULL
end_date: date NOT NULL
progress: numeric NOT NULL DEFAULT 0
created_at: timestamp with time zone NOT NULL DEFAULT now()
updated_at: timestamp with time zone NOT NULL DEFAULT now()
    `
  },
  {
    title: "key_results",
    description: "Measurable outcomes for goals (OKR model).",
    value: "key-results",
    content: `
id: uuid PRIMARY KEY
goal_id: uuid NOT NULL
description: text NOT NULL
target_value: numeric NOT NULL
current_value: numeric NOT NULL DEFAULT 0
habit_id: uuid
created_at: timestamp with time zone NOT NULL DEFAULT now()
updated_at: timestamp with time zone NOT NULL DEFAULT now()
    `
  }
];

export const journalSchema = [
  {
    title: "journal_entries",
    description: "User journal entries with optional sentiment analysis.",
    value: "journal-entries",
    content: `
id: uuid PRIMARY KEY
user_id: uuid NOT NULL
content: text NOT NULL
tag: text
sentiment_score: numeric
created_at: timestamp with time zone NOT NULL DEFAULT now()
updated_at: timestamp with time zone NOT NULL DEFAULT now()
    `
  },
  {
    title: "journal_prompts",
    description: "Predefined journaling prompts.",
    value: "journal-prompts",
    content: `
id: uuid PRIMARY KEY
text: text NOT NULL
tag: text NOT NULL
created_at: timestamp with time zone NOT NULL DEFAULT now()
    `
  }
];

export const sleepSchema = [
  {
    title: "sleep_entries",
    description: "Sleep tracking data with quality metrics.",
    value: "sleep-entries",
    content: `
id: uuid PRIMARY KEY
user_id: uuid
sleep_date: date NOT NULL
bedtime: time NOT NULL
wake_time: time NOT NULL
time_slept_minutes: integer NOT NULL
quality_score: double precision
routine_score: double precision
sleep_latency_minutes: integer
heart_rate: double precision
hrv: double precision
breath_rate: double precision
snoring_percentage: double precision
created_at: timestamp with time zone DEFAULT now()
    `
  }
];

export const routinesSchema = [
  {
    title: "routines",
    description: "Group of habits that can be completed together.",
    value: "routines-table",
    content: `
id: uuid PRIMARY KEY
user_id: uuid NOT NULL
name: text NOT NULL
description: text
time_of_day: text
created_at: timestamp with time zone NOT NULL DEFAULT now()
updated_at: timestamp with time zone NOT NULL DEFAULT now()
    `
  },
  {
    title: "routine_habits",
    description: "Junction table linking routines and habits.",
    value: "routine-habits",
    content: `
id: uuid PRIMARY KEY
routine_id: uuid NOT NULL
habit_id: uuid NOT NULL
position: integer DEFAULT 0
created_at: timestamp with time zone NOT NULL DEFAULT now()
    `
  }
];

export const tasksSchema = [
  {
    title: "tasks",
    description: "To-do items that can be linked to habits.",
    value: "tasks-table",
    content: `
id: uuid PRIMARY KEY
user_id: uuid NOT NULL
name: text NOT NULL
description: text
tag: text
status: text NOT NULL DEFAULT 'pending'
due_date: date
habit_id: uuid
created_at: timestamp with time zone NOT NULL DEFAULT now()
    `
  }
];
