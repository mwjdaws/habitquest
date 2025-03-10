
// Default layout configurations for different screen sizes
export const DEFAULT_LAYOUTS = {
  lg: [
    { i: "habit-tracker", x: 0, y: 0, w: 3, h: 5, minW: 2, minH: 4 },
    { i: "task-stats", x: 0, y: 5, w: 1, h: 4, minW: 1, minH: 3 },
    { i: "goals-progress", x: 1, y: 5, w: 1, h: 4, minW: 1, minH: 3 },
    { i: "streak-stats", x: 2, y: 5, w: 1, h: 4, minW: 1, minH: 3 },
    { i: "upcoming-tasks", x: 0, y: 9, w: 3, h: 4, minW: 2, minH: 3 },
    { i: "habit-trends", x: 0, y: 13, w: 3, h: 5, minW: 2, minH: 4 },
    { i: "journal-stats", x: 0, y: 18, w: 3, h: 6, minW: 3, minH: 5 },
  ],
  md: [
    { i: "habit-tracker", x: 0, y: 0, w: 2, h: 5, minW: 2, minH: 4 },
    { i: "task-stats", x: 0, y: 5, w: 1, h: 4, minW: 1, minH: 3 },
    { i: "upcoming-tasks", x: 1, y: 5, w: 1, h: 4, minW: 1, minH: 3 },
    { i: "streak-stats", x: 0, y: 9, w: 1, h: 4, minW: 1, minH: 3 },
    { i: "goals-progress", x: 1, y: 9, w: 1, h: 4, minW: 1, minH: 3 },
    { i: "habit-trends", x: 0, y: 13, w: 2, h: 5, minW: 2, minH: 4 },
    { i: "journal-stats", x: 0, y: 18, w: 2, h: 6, minW: 2, minH: 5 },
  ],
  sm: [
    { i: "habit-tracker", x: 0, y: 0, w: 1, h: 4, minW: 1, minH: 3 },
    { i: "task-stats", x: 0, y: 4, w: 1, h: 3, minW: 1, minH: 2 },
    { i: "upcoming-tasks", x: 0, y: 7, w: 1, h: 3, minW: 1, minH: 2 },
    { i: "streak-stats", x: 0, y: 10, w: 1, h: 3, minW: 1, minH: 2 },
    { i: "goals-progress", x: 0, y: 13, w: 1, h: 3, minW: 1, minH: 2 },
    { i: "habit-trends", x: 0, y: 16, w: 1, h: 4, minW: 1, minH: 3 },
    { i: "journal-stats", x: 0, y: 20, w: 1, h: 5, minW: 1, minH: 4 },
  ],
  xs: [
    { i: "habit-tracker", x: 0, y: 0, w: 1, h: 4, minW: 1, minH: 3 },
    { i: "task-stats", x: 0, y: 4, w: 1, h: 3, minW: 1, minH: 2 },
    { i: "upcoming-tasks", x: 0, y: 7, w: 1, h: 3, minW: 1, minH: 2 },
    { i: "streak-stats", x: 0, y: 10, w: 1, h: 3, minW: 1, minH: 2 },
    { i: "goals-progress", x: 0, y: 13, w: 1, h: 3, minW: 1, minH: 2 },
    { i: "habit-trends", x: 0, y: 16, w: 1, h: 4, minW: 1, minH: 3 },
    { i: "journal-stats", x: 0, y: 20, w: 1, h: 5, minW: 1, minH: 4 },
  ],
};

// Widget IDs that correspond to the dashboard items
export const WIDGET_IDS = [
  "habit-tracker",
  "task-stats", 
  "streak-stats", 
  "upcoming-tasks", 
  "goals-progress",
  "habit-trends",
  "journal-stats"
];

// Grid layout configuration
export const GRID_CONFIG = {
  breakpoints: { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 },
  cols: { lg: 3, md: 2, sm: 1, xs: 1, xxs: 1 },
  defaultRowHeight: 80,
  mobileRowHeight: 70,
  margin: [12, 12],
  containerPadding: [16, 16],
};
