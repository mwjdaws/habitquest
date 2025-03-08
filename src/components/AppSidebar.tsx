
import { Calendar, CheckSquare, BarChart, Flame, BookOpen, Heart, Home } from "lucide-react";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel, 
  SidebarHeader, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem 
} from "@/components/ui/sidebar";
import { useLocation, Link } from "react-router-dom";

export function AppSidebar() {
  const location = useLocation();
  
  // Navigation items
  const menuItems = [
    {
      title: "Dashboard",
      path: "/dashboard",
      icon: Home,
    },
    {
      title: "Habits",
      path: "/habits",
      icon: Flame,
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
      title: "Analytics",
      path: "/analytics",
      icon: BarChart,
    },
  ];

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <Link to="/dashboard" className="flex items-center space-x-2">
          <Flame className="h-6 w-6 text-habit-purple" />
          <span className="text-xl font-bold">HabitQuest</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton asChild className={
                    location.pathname === item.path 
                      ? "bg-sidebar-accent text-sidebar-accent-foreground" 
                      : ""
                  }>
                    <Link to={item.path}>
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
