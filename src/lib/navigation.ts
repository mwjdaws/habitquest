
import { Calendar, CheckSquare, BarChart, Diamond, BookOpen, Heart, Home, Code, Moon } from "lucide-react";
import { LucideIcon } from "lucide-react";

export interface NavigationItem {
  title: string;
  path: string;
  icon: LucideIcon;
}

export const navigationItems: NavigationItem[] = [
  {
    title: "Dashboard",
    path: "/dashboard",
    icon: Home,
  },
  {
    title: "Habits",
    path: "/habits",
    icon: Diamond,
  },
  {
    title: "Tasks",
    path: "/tasks",
    icon: CheckSquare,
  },
  {
    title: "Goals",
    path: "/goals",
    icon: Calendar,
  },
  {
    title: "Journal",
    path: "/journal",
    icon: BookOpen,
  },
  {
    title: "Mood",
    path: "/mood",
    icon: Heart,
  },
  {
    title: "Sleep",
    path: "/sleep",
    icon: Moon,
  },
  {
    title: "Analytics",
    path: "/analytics",
    icon: BarChart,
  },
  {
    title: "Developer",
    path: "/developer",
    icon: Code,
  },
];
