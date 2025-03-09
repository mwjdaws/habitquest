
import { useEffect, useState } from "react";
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

// Helper to convert hex to hsl
function hexToHSL(hex: string): string {
  // Remove the # if present
  hex = hex.replace(/^#/, '');
  
  // Parse the hex values
  let r = parseInt(hex.substring(0, 2), 16) / 255;
  let g = parseInt(hex.substring(2, 4), 16) / 255;
  let b = parseInt(hex.substring(4, 6), 16) / 255;
  
  // Find min and max values
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  
  // Calculate lightness
  let l = (max + min) / 2;
  
  let h = 0;
  let s = 0;
  
  if (max !== min) {
    // Calculate saturation
    s = l > 0.5 ? (max - min) / (2 - max - min) : (max - min) / (max + min);
    
    // Calculate hue
    if (max === r) {
      h = (g - b) / (max - min) + (g < b ? 6 : 0);
    } else if (max === g) {
      h = (b - r) / (max - min) + 2;
    } else {
      h = (r - g) / (max - min) + 4;
    }
    h /= 6;
  }
  
  // Convert to degrees and percentages
  h = Math.round(h * 360);
  s = Math.round(s * 100);
  l = Math.round(l * 100);
  
  return `${h} ${s}% ${l}%`;
}

// Check if a color is in HSL format
function isHSL(color: string): boolean {
  return color.startsWith('hsl(') || color.startsWith('hsl ');
}

// Extract HSL values from a hsl() string or return converted hex
function extractHSL(color: string): string {
  if (isHSL(color)) {
    // Extract h, s, l values from hsl format
    const hslMatch = color.match(/hsl\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%\s*\)/);
    if (hslMatch) {
      return `${hslMatch[1]} ${hslMatch[2]}% ${hslMatch[3]}%`;
    }
    
    // For format like "hsl(260 96% 66%)"
    const hslSpaceMatch = color.match(/hsl\(\s*(\d+)\s+(\d+)%\s+(\d+)%\s*\)/);
    if (hslSpaceMatch) {
      return `${hslSpaceMatch[1]} ${hslSpaceMatch[2]}% ${hslSpaceMatch[3]}%`;
    }
    
    // Already in "260 96% 66%" format
    const plainHSLMatch = color.match(/(\d+)\s+(\d+)%\s+(\d+)%/);
    if (plainHSLMatch) {
      return color;
    }
  }
  
  // Convert hex to HSL
  return hexToHSL(color);
}

export function ThemeSwitcher() {
  const [currentTheme, setCurrentTheme] = useState<string>("Default Purple");

  // Apply the theme when it changes
  useEffect(() => {
    const theme = colorThemes.find(theme => theme.name === currentTheme);
    if (theme) {
      try {
        // Convert colors to HSL values for CSS variables
        const primaryHSL = extractHSL(theme.primaryColor);
        const accentHSL = extractHSL(theme.accentColor);
        
        // Update CSS variables for the theme
        document.documentElement.style.setProperty('--primary', primaryHSL);
        document.documentElement.style.setProperty('--accent', accentHSL);
        
        // Set secondary based on primary (slightly darker)
        const secondaryHSL = primaryHSL.replace(/\d+%$/, match => `${Math.max(parseInt(match) - 16, 0)}%`);
        document.documentElement.style.setProperty('--secondary', secondaryHSL);
        
        // Update other dependent variables
        document.documentElement.style.setProperty('--ring', primaryHSL);
        
        // Update habit colors and sidebar
        if (theme.primaryColor.startsWith('#')) {
          // For hex colors, set the CSS property with the hsl() function format
          document.documentElement.style.setProperty('--habit-purple', theme.primaryColor);
          document.documentElement.style.setProperty('--sidebar-primary', theme.primaryColor);
        } else {
          // If it's already HSL, format properly
          document.documentElement.style.setProperty('--habit-purple', `hsl(${primaryHSL})`);
          document.documentElement.style.setProperty('--sidebar-primary', `hsl(${primaryHSL})`);
        }
        
        console.log(`Theme changed to ${currentTheme}`);
        console.log(`Primary HSL: ${primaryHSL}`);
        console.log(`Accent HSL: ${accentHSL}`);
        console.log(`Secondary HSL: ${secondaryHSL}`);

        toast.success(`Theme changed to ${currentTheme}`);
      } catch (error) {
        console.error('Error applying theme:', error);
        toast.error('Failed to apply theme');
      }
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
