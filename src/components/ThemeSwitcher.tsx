
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Palette, Circle } from "lucide-react";

type ColorTheme = {
  name: string;
  primaryColor: string;
  accentColor: string;
};

const colorThemes: ColorTheme[] = [
  {
    name: "Default Purple",
    primaryColor: "hsl(260, 96%, 66%)",
    accentColor: "hsl(260, 80%, 96%)",
  },
  {
    name: "Lavender & Amber",
    primaryColor: "#B8A9E3",
    accentColor: "#FFB347",
  },
  {
    name: "Sage & Terracotta",
    primaryColor: "#9CAF88",
    accentColor: "#E07A5F",
  },
  {
    name: "Dusty Blue & Peach",
    primaryColor: "#8DA9C4",
    accentColor: "#FFC5A1",
  },
  {
    name: "Deep Teal & Coral",
    primaryColor: "#00696F",
    accentColor: "#FA8072",
  },
  {
    name: "Aubergine & Gold",
    primaryColor: "#5F4B66",
    accentColor: "#D4B483",
  },
  {
    name: "Olive & Rust",
    primaryColor: "#7D8C65",
    accentColor: "#B7410E",
  },
];

export function ThemeSwitcher() {
  const [currentTheme, setCurrentTheme] = useState<string>("Default Purple");

  // Apply the theme when it changes
  useEffect(() => {
    const theme = colorThemes.find(theme => theme.name === currentTheme);
    if (theme) {
      // Update CSS variables for the theme
      document.documentElement.style.setProperty('--primary', theme.primaryColor);
      document.documentElement.style.setProperty('--accent', theme.accentColor);
      
      // Update habit colors based on the primary color
      document.documentElement.style.setProperty('--habit-purple', theme.primaryColor);
      document.documentElement.style.setProperty('--sidebar-primary', theme.primaryColor);
    }
  }, [currentTheme]);

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
                style={{ backgroundColor: theme.primaryColor }}
                onClick={() => setCurrentTheme(theme.name)}
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
