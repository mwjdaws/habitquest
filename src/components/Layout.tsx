
import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { UserMenu } from "./UserMenu";

export function Layout() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 overflow-auto">
          <div className="container py-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <SidebarTrigger />
                <h1 className="text-2xl font-bold ml-4">HabitQuest</h1>
              </div>
              <UserMenu />
            </div>
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
