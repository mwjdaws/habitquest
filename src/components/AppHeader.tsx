
import { UserMenu } from "./UserMenu";
import { ThemeSelector } from "./ThemeSwitcher";

export function AppHeader() {
  return (
    <header className="flex justify-between items-center mb-8">
      <div className="flex-1">
        {/* Left side content if needed */}
      </div>
      <div className="flex items-center space-x-2">
        <ThemeSelector />
        <UserMenu />
      </div>
    </header>
  );
}
