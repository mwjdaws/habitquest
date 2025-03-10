
import { Outlet } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { AppHeader } from "./AppHeader";
import { ThemeSelector } from "./ThemeSwitcher";

export function Layout() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 overflow-auto">
          <div className="container py-6">
            <AppHeader />
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
