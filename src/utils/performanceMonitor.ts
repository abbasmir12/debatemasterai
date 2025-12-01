/**
 * Performance monitoring utility for tracking component render times and FPS
 */

interface PerformanceMetrics {
  fps: number;
  renderTime: number;
  frameCount: number;
}

class PerformanceMonitor {
  private frameCount: number = 0;
  private lastTime: number = performance.now();
  private fps: number = 60;
  private renderTimes: number[] = [];
  private maxSamples: number = 60; // Track last 60 frames
  private enabled: boolean = false;

  constructor() {
    // Only enable in development mode
    this.enabled = process.env.NODE_ENV === 'development';
  }

  /**
   * Mark the start of a render cycle
   */
  public startRender(): number {
    if (!this.enabled) return 0;
    return performance.now();
  }

  /**
   * Mark the end of a render cycle and update metrics
   */
  public endRender(startTime: number): void {
    if (!this.enabled) return;

    const endTime = performance.now();
    const renderTime = endTime - startTime;

    // Track render time
    this.renderTimes.push(renderTime);
    if (this.renderTimes.length > this.maxSamples) {
      this.renderTimes.shift();
    }

    // Update frame count
    this.frameCount++;

    // Calculate FPS every second
    const currentTime = performance.now();
    const elapsed = currentTime - this.lastTime;

    if (elapsed >= 1000) {
      this.fps = Math.round((this.frameCount * 1000) / elapsed);
      this.frameCount = 0;
      this.lastTime = currentTime;
    }
  }

  /**
   * Get current performance metrics
   */
  public getMetrics(): PerformanceMetrics {
    const avgRenderTime =
      this.renderTimes.length > 0
        ? this.renderTimes.reduce((a, b) => a + b, 0) / this.renderTimes.length
        : 0;

    return {
      fps: this.fps,
      renderTime: Math.round(avgRenderTime * 100) / 100,
      frameCount: this.frameCount,
    };
  }

  /**
   * Log performance metrics to console
   */
  public logMetrics(componentName: string): void {
    if (!this.enabled) return;

    const metrics = this.getMetrics();
    console.log(`[Performance] ${componentName}:`, {
      fps: `${metrics.fps} FPS`,
      avgRenderTime: `${metrics.renderTime.toFixed(2)}ms`,
    });
  }

  /**
   * Reset all metrics
   */
  public reset(): void {
    this.frameCount = 0;
    this.lastTime = performance.now();
    this.fps = 60;
    this.renderTimes = [];
  }

  /**
   * Check if performance monitoring is enabled
   */
  public isEnabled(): boolean {
    return this.enabled;
  }
}

// Export singleton instance
export const performanceMonitor = new PerformanceMonitor();

/**
 * React hook for monitoring component render performance
 */
export function usePerformanceMonitor(componentName: string, logInterval: number = 5000) {
  if (process.env.NODE_ENV !== 'development') {
    return { startRender: () => 0, endRender: () => {} };
  }

  const monitor = new PerformanceMonitor();

  // Log metrics periodically
  if (typeof window !== 'undefined') {
    const intervalId = setInterval(() => {
      monitor.logMetrics(componentName);
    }, logInterval);

    // Cleanup on unmount
    setTimeout(() => clearInterval(intervalId), 0);
  }

  return {
    startRender: () => monitor.startRender(),
    endRender: (startTime: number) => monitor.endRender(startTime),
  };
}
