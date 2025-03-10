
import { useEffect, useState, useCallback, createContext, useContext, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Palette } from "lucide-react";
import { colorThemes } from "@/lib/theme/colorThemes";
import { applyTheme } from "@/lib/theme/themeApplier";

// Create a context for theme state
type ThemeContextType = {
  theme: string;
  setTheme: (theme: string) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Local storage key for theme persistence
const THEME_STORAGE_KEY = 'app-color-theme';

// Theme provider component
export function ThemeSwitcher({ children }: { children: ReactNode }) {
  // Initialize with stored theme or default
  const [currentTheme, setCurrentTheme] = useState<string>(() => {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    return savedTheme || "Default Purple";
  });

  // Memoize the theme application function to avoid recreating it on every render
  const handleThemeChange = useCallback((themeName: string) => {
    applyTheme(themeName, colorThemes);
    setCurrentTheme(themeName);
    // Save theme preference to localStorage for persistence
    localStorage.setItem(THEME_STORAGE_KEY, themeName);
  }, []);

  // Apply theme when component mounts
  useEffect(() => {
    handleThemeChange(currentTheme);
  }, [currentTheme, handleThemeChange]);

  return (
    <ThemeContext.Provider value={{ theme: currentTheme, setTheme: handleThemeChange }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Theme selector component
export function ThemeSelector() {
  const context = useContext(ThemeContext);
  
  if (!context) {
    throw new Error("ThemeSelector must be used within a ThemeSwitcher");
  }
  
  const { theme: currentTheme, setTheme: handleThemeChange } = context;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-9 w-9" 
          aria-label="Change theme"
        >
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
                aria-pressed={currentTheme === theme.name}
                aria-label={`Select ${theme.name} theme`}
              >
                <div className="flex flex-col w-full h-full">
                  <div 
                    className="w-full h-6" 
                    style={{ backgroundColor: theme.primaryColor }}
                    aria-hidden="true"
                  ></div>
                  <div 
                    className="w-full h-3" 
                    style={{ backgroundColor: theme.accentColor }}
                    aria-hidden="true"
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

// Hook for accessing theme context
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeSwitcher');
  }
  return context;
}
