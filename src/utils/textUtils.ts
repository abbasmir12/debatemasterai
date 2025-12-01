/**
 * Truncates text to fit within a specified width using canvas measureText
 * for accurate width calculation. Uses binary search for optimal truncation point.
 * 
 * @param text - The text to truncate
 * @param maxWidth - Maximum width in pixels
 * @param fontSize - Font size in pixels
 * @param fontFamily - Font family (defaults to 'Inter, sans-serif')
 * @returns Truncated text with ellipsis if needed, or original text if it fits
 */
export function truncateText(
  text: string,
  maxWidth: number,
  fontSize: number,
  fontFamily: string = 'Inter, sans-serif'
): string {
  // Create a canvas for text measurement
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  if (!ctx) {
    // Fallback: simple character-based truncation if canvas unavailable
    const estimatedCharsPerPixel = 0.15; // Rough estimate
    const maxChars = Math.floor(maxWidth * estimatedCharsPerPixel);
    if (text.length > maxChars) {
      return text.slice(0, maxChars - 3) + '...';
    }
    return text;
  }
  
  // Set font for accurate measurement
  ctx.font = `${fontSize}px ${fontFamily}`;
  
  // Check if text fits without truncation
  const fullWidth = ctx.measureText(text).width;
  if (fullWidth <= maxWidth) {
    return text;
  }
  
  // Binary search for optimal truncation point
  let left = 0;
  let right = text.length;
  let result = text;
  
  while (left < right) {
    const mid = Math.floor((left + right + 1) / 2);
    const truncated = text.slice(0, mid) + '...';
    const width = ctx.measureText(truncated).width;
    
    if (width <= maxWidth) {
      result = truncated;
      left = mid;
    } else {
      right = mid - 1;
    }
  }
  
  return result;
}
