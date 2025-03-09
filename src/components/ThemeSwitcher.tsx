
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
      <PopoverContent className="w-64 p-3" align="end">
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Theme</h4>
          <div className="grid grid-cols-3 gap-2">
            {colorThemes.map((theme) => (
              <Button
                key={theme.name}
                variant="outline"
                size="sm"
                className={`h-10 p-0 border overflow-hidden ${
                  currentTheme === theme.name ? "ring-2 ring-primary ring-offset-2" : ""
                }`}
                style={{ 
                  transition: "all 0.2s ease" 
                }}
                onClick={() => handleThemeChange(theme.name)}
                title={theme.name}
              >
                <div className="flex flex-col w-full h-full">
                  <div 
                    className="w-full h-6" 
                    style={{ backgroundColor: theme.primaryColor }}
                  ></div>
                  <div 
                    className="w-full h-3" 
                    style={{ backgroundColor: theme.accentColor }}
                  ></div>
                </div>
                <span className="sr-only">{theme.name}</span>
              </Button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Current: {currentTheme}
          </p>
        </div>
      </PopoverContent>
    </Popover>
  );
}
