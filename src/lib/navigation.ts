import {
  LayoutDashboard,
  CheckCircle,
  ListChecks,
  CheckSquare,
  Target,
  Book,
  Moon,
  BarChart2,
} from "lucide-react";

export type NavItem = {
  title: string;
  href: string;
  icon: keyof typeof Icons;
};

const Icons = {
  "layout-dashboard": LayoutDashboard,
  "check-circle": CheckCircle,
  "list-checks": ListChecks,
  "check-square": CheckSquare,
  target: Target,
  book: Book,
  moon: Moon,
  "bar-chart-2": BarChart2,
};

// Update the navigation items to include Routines
export const navItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: "layout-dashboard",
  },
  {
    title: "Habits",
    href: "/habits",
    icon: "check-circle",
  },
  {
    title: "Routines", // New item
    href: "/routines",
    icon: "list-checks",
  },
  {
    title: "Tasks",
    href: "/tasks",
    icon: "check-square",
  },
  {
    title: "Goals",
    href: "/goals",
    icon: "target",
  },
  {
    title: "Journal",
    href: "/journal",
    icon: "book",
  },
  {
    title: "Sleep",
    href: "/sleep",
    icon: "moon",
  },
  {
    title: "Analytics",
    href: "/analytics",
    icon: "bar-chart-2",
  },
];
