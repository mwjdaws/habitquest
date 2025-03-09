
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
    const backgroundHSL = extractHSL(theme.backgroundColor);
    const foregroundHSL = extractHSL(theme.foregroundColor);
    const cardHSL = extractHSL(theme.cardColor);
    const cardForegroundHSL = extractHSL(theme.cardForegroundColor);
    
    // Create a single batch of CSS variable updates for better performance
    const cssVars = {
      // Primary theme colors
      '--primary': primaryHSL,
      '--accent': accentHSL,
      '--secondary': primaryHSL.replace(/\d+%$/, match => `${Math.max(parseInt(match) - 16, 0)}%`),
      '--ring': primaryHSL,
      
      // Background and text colors
      '--background': backgroundHSL,
      '--foreground': foregroundHSL,
      
      // Card colors
      '--card': cardHSL,
      '--card-foreground': cardForegroundHSL,
      '--popover': cardHSL,
      '--popover-foreground': cardForegroundHSL,
      
      // Derived colors
      '--muted': backgroundHSL.replace(/\d+%$/, match => `${Math.max(parseInt(match) - 3, 0)}%`),
      '--muted-foreground': foregroundHSL.replace(/\d+%$/, match => `${Math.min(parseInt(match) + 45, 100)}%`),
      '--border': backgroundHSL.replace(/\d+%$/, match => `${Math.max(parseInt(match) - 7, 0)}%`)
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
    
    // Apply background-based sidebar variables
    document.documentElement.style.setProperty('--sidebar-background', backgroundHSL);
    document.documentElement.style.setProperty('--sidebar-foreground', foregroundHSL);
    document.documentElement.style.setProperty('--sidebar-border', cssVars['--border']);
    
    // Log for debugging
    console.log(`Theme applied: ${themeName}`);
    
    toast.success(`Theme changed to ${themeName}`);
  } catch (error) {
    console.error('Error applying theme:', error);
    toast.error('Failed to apply theme');
  }
};
