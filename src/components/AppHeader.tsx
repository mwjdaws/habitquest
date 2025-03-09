
import { SidebarTrigger } from "@/components/ui/sidebar";
import { UserMenu } from "./UserMenu";
import { ThemeSwitcher } from "./ThemeSwitcher";

export function AppHeader() {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center">
        <SidebarTrigger />
        <h1 className="text-2xl font-bold ml-4">Perfectio</h1>
      </div>
      <div className="flex items-center gap-2">
        <ThemeSwitcher />
        <UserMenu />
      </div>
    </div>
  );
}
