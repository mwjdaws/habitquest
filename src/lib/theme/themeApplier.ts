
import { extractHSL } from './colorUtils';
import { ColorTheme } from './colorThemes';
import { toast } from "sonner";

export const applyTheme = (themeName: string, themes: ColorTheme[]): void => {
  const theme = themes.find(t => t.name === themeName);
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
};
