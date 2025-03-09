
import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Palette } from "lucide-react";
import { toast } from "sonner";

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

// Optimized hex to HSL conversion
function hexToHSL(hex: string): string {
  // Remove the # if present
  hex = hex.replace(/^#/, '');
  
  // Parse the hex values more efficiently
  const r = parseInt(hex.slice(0, 2), 16) / 255;
  const g = parseInt(hex.slice(2, 4), 16) / 255;
  const b = parseInt(hex.slice(4, 6), 16) / 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  
  let h = 0;
  let s = 0;
  
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    
    h /= 6;
  }
  
  // Convert to degrees and percentages
  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

// Check if a color is in HSL format - optimized
function isHSL(color: string): boolean {
  return /^hsl\(|^hsl\s/.test(color);
}

// Optimized HSL extraction function
function extractHSL(color: string): string {
  if (isHSL(color)) {
    // Extract h, s, l from various HSL formats
    const hslRegex = /hsl\(\s*(\d+)(?:\s*,\s*|\s+)(\d+)%(?:\s*,\s*|\s+)(\d+)%\s*\)/;
    const match = color.match(hslRegex);
    
    if (match) {
      return `${match[1]} ${match[2]}% ${match[3]}%`;
    }
    
    // Already in "260 96% 66%" format
    const plainHSLMatch = /(\d+)\s+(\d+)%\s+(\d+)%/.exec(color);
    if (plainHSLMatch) {
      return color;
    }
  }
  
  // Convert hex to HSL
  return hexToHSL(color);
}

export function ThemeSwitcher() {
  const [currentTheme, setCurrentTheme] = useState<string>("Default Purple");

  // Memoize the theme application function to avoid recreating it on every render
  const applyTheme = useCallback((themeName: string) => {
    const theme = colorThemes.find(t => t.name === themeName);
    if (!theme) return;
    
    try {
      // Convert colors to HSL values
      const primaryHSL = extractHSL(theme.primaryColor);
      const accentHSL = extractHSL(theme.accentColor);
      
      // Create a single batch of CSS variable updates for better performance
      const cssVars = {
        '--primary': primaryHSL,
        '--accent': accentHSL,
        '--secondary': primaryHSL.replace(/\d+%$/, match => `${Math.max(parseInt(match) - 16, 0)}%`),
        '--ring': primaryHSL
      };
      
      // Apply all CSS variables at once to minimize repaints
      Object.entries(cssVars).forEach(([prop, value]) => {
        document.documentElement.style.setProperty(prop, value);
      });
      
      // Handle habit colors and sidebar primary color
      const formattedPrimaryColor = theme.primaryColor.startsWith('#') 
        ? theme.primaryColor 
        : `hsl(${primaryHSL})`;
        
      document.documentElement.style.setProperty('--habit-purple', formattedPrimaryColor);
      document.documentElement.style.setProperty('--sidebar-primary', formattedPrimaryColor);
      
      // Log for debugging
      console.log(`Theme applied: ${themeName}`);
      
      toast.success(`Theme changed to ${themeName}`);
    } catch (error) {
      console.error('Error applying theme:', error);
      toast.error('Failed to apply theme');
    }
  }, []);

  // Apply theme when it changes
  useEffect(() => {
    applyTheme(currentTheme);
  }, [currentTheme, applyTheme]);

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
