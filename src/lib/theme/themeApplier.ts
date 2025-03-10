
import { extractHSL } from './colorUtils';
import { ColorTheme } from './colorThemes';
import { toast } from "sonner";

/**
 * Applies the selected theme to the application
 * 
 * @param themeName - Name of the theme to apply
 * @param themes - Array of available themes
 */
export const applyTheme = (themeName: string, themes: ColorTheme[]): void => {
  const theme = themes.find(t => t.name === themeName);
  if (!theme) {
    console.error(`Theme '${themeName}' not found`);
    return;
  }
  
  try {
    // Convert colors to HSL values - do this once outside the loop
    const primaryHSL = extractHSL(theme.primaryColor);
    const accentHSL = extractHSL(theme.accentColor);
    const backgroundHSL = extractHSL(theme.backgroundColor);
    const foregroundHSL = extractHSL(theme.foregroundColor);
    const cardHSL = extractHSL(theme.cardColor);
    const cardForegroundHSL = extractHSL(theme.cardForegroundColor);
    
    // Pre-calculate derived colors to avoid repeated operations
    const mutedHSL = backgroundHSL.replace(/\d+%$/, match => `${Math.max(parseInt(match) - 3, 0)}%`);
    const mutedForegroundHSL = foregroundHSL.replace(/\d+%$/, match => `${Math.min(parseInt(match) + 45, 100)}%`);
    const borderHSL = backgroundHSL.replace(/\d+%$/, match => `${Math.max(parseInt(match) - 7, 0)}%`);
    const secondaryHSL = primaryHSL.replace(/\d+%$/, match => `${Math.max(parseInt(match) - 16, 0)}%`);
    
    // Using a single CSS update with CSS variables for better performance
    const root = document.documentElement;
    
    // Batch operations by modifying the style object only once
    const cssVars = {
      // Primary and derived colors
      '--primary': primaryHSL,
      '--accent': accentHSL,
      '--secondary': secondaryHSL,
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
      '--muted': mutedHSL,
      '--muted-foreground': mutedForegroundHSL,
      '--border': borderHSL,
      
      // Format habit colors properly for direct application
      '--habit-purple': theme.primaryColor.startsWith('#') ? theme.primaryColor : `hsl(${primaryHSL})`,
      
      // Sidebar variables
      '--sidebar-background': backgroundHSL,
      '--sidebar-foreground': foregroundHSL,
      '--sidebar-primary': theme.primaryColor.startsWith('#') ? theme.primaryColor : `hsl(${primaryHSL})`,
      '--sidebar-primary-foreground': '0 0% 100%',
      '--sidebar-accent': accentHSL,
      '--sidebar-accent-foreground': foregroundHSL,
      '--sidebar-border': borderHSL,
      '--sidebar-ring': primaryHSL
    };
    
    // Apply all CSS variables in a batch using fewer DOM operations
    const rootStyle = root.style;
    for (const [property, value] of Object.entries(cssVars)) {
      rootStyle.setProperty(property, value);
    }
    
    // Console log only in development environments
    if (process.env.NODE_ENV !== 'production') {
      console.log(`Theme applied: ${themeName}`);
    }
    
    toast.success(`Theme changed to ${themeName}`);
  } catch (error) {
    console.error('Error applying theme:', error);
    toast.error('Failed to apply theme');
  }
};
