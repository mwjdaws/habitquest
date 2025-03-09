
// Optimized hex to HSL conversion
export function hexToHSL(hex: string): string {
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
export function isHSL(color: string): boolean {
  return /^hsl\(|^hsl\s/.test(color);
}

// Optimized HSL extraction function
export function extractHSL(color: string): string {
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
