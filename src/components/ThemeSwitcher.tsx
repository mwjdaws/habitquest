
import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Palette } from "lucide-react";
import { colorThemes } from "@/lib/theme/colorThemes";
import { applyTheme } from "@/lib/theme/themeApplier";

export function ThemeSwitcher() {
  const [currentTheme, setCurrentTheme] = useState<string>("Default Purple");

  // Memoize the theme application function to avoid recreating it on every render
  const handleThemeChange = useCallback((themeName: string) => {
    applyTheme(themeName, colorThemes);
    setCurrentTheme(themeName);
  }, []);

  // Apply theme when component mounts
  useEffect(() => {
    handleThemeChange(currentTheme);
  }, [currentTheme, handleThemeChange]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9" aria-label="Change theme">
          <Palette className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-3" align="end">
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Theme</h4>
          <div className="grid grid-cols-3 gap-2">
            {colorThemes.map((theme) => (
              <Button
                key={theme.name}
                variant="outline"
                size="sm"
                className={`h-8 p-0 border ${
                  currentTheme === theme.name ? "ring-2 ring-primary ring-offset-2" : ""
                }`}
                style={{ 
                  backgroundColor: theme.primaryColor,
                  transition: "all 0.2s ease" 
                }}
                onClick={() => handleThemeChange(theme.name)}
                title={theme.name}
              >
                <span className="sr-only">{theme.name}</span>
              </Button>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
