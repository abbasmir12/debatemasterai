/**
 * Device capability detection utilities
 * Used to optimize 3D scenes and animations for different device capabilities
 */

export interface DeviceCapabilities {
  isLowEnd: boolean;
  isMobile: boolean;
  isTouchDevice: boolean;
  estimatedRAM: number | null;
  hasGPU: boolean;
}

/**
 * Detect if the device is a touch device
 */
export function isTouchDevice(): boolean {
  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    // @ts-expect-error - msMaxTouchPoints is IE specific
    navigator.msMaxTouchPoints > 0
  );
}

/**
 * Detect if the device is mobile based on screen size and user agent
 */
export function isMobileDevice(): boolean {
  // Check screen size
  const isMobileScreen = window.innerWidth < 768;
  
  // Check user agent
  const userAgent = navigator.userAgent.toLowerCase();
  const isMobileUA = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
  
  return isMobileScreen || isMobileUA;
}

/**
 * Estimate device RAM in GB
 * Returns null if not available (only supported in Chrome)
 */
export function getDeviceRAM(): number | null {
  if ('deviceMemory' in navigator) {
    return (navigator as { deviceMemory?: number }).deviceMemory ?? null;
  }
  return null;
}

/**
 * Detect if device has GPU acceleration
 */
export function hasGPUAcceleration(): boolean {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    return !!gl;
  } catch (e) {
    return false;
  }
}

/**
 * Determine if device is low-end based on multiple factors
 */
export function isLowEndDevice(): boolean {
  const ram = getDeviceRAM();
  const hasGPU = hasGPUAcceleration();
  const isMobile = isMobileDevice();
  
  // Device is low-end if:
  // 1. RAM is less than 4GB (if available)
  // 2. No GPU acceleration
  // 3. Mobile device with no GPU
  
  if (ram !== null && ram < 4) {
    return true;
  }
  
  if (!hasGPU) {
    return true;
  }
  
  if (isMobile && !hasGPU) {
    return true;
  }
  
  // Additional heuristic: check for slow connection (might indicate low-end device)
  if ('connection' in navigator) {
    const connection = (navigator as { connection?: {
      saveData?: boolean;
      effectiveType?: string;
    }}).connection;
    
    if (connection?.saveData || connection?.effectiveType === 'slow-2g' || connection?.effectiveType === '2g') {
      return true;
    }
  }
  
  return false;
}

/**
 * Get comprehensive device capabilities
 */
export function getDeviceCapabilities(): DeviceCapabilities {
  return {
    isLowEnd: isLowEndDevice(),
    isMobile: isMobileDevice(),
    isTouchDevice: isTouchDevice(),
    estimatedRAM: getDeviceRAM(),
    hasGPU: hasGPUAcceleration(),
  };
}

/**
 * Check if 3D scenes should be disabled for this device
 */
export function should3DBeDisabled(): boolean {
  const capabilities = getDeviceCapabilities();
  
  // Disable 3D if:
  // 1. Low-end device
  // 2. Mobile device with less than 4GB RAM
  // 3. No GPU acceleration
  
  if (capabilities.isLowEnd) {
    return true;
  }
  
  if (capabilities.isMobile && capabilities.estimatedRAM !== null && capabilities.estimatedRAM < 4) {
    return true;
  }
  
  if (!capabilities.hasGPU) {
    return true;
  }
  
  return false;
}
