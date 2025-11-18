/**
 * Performance monitoring utilities
 */

// Measure and log performance metrics
export const measurePerformance = (name: string, fn: () => void) => {
  const start = performance.now();
  fn();
  const end = performance.now();
  const duration = end - start;
  
  if (duration > 16) { // Longer than one frame (60fps)
    console.warn(`⚠️ Performance: ${name} took ${duration.toFixed(2)}ms`);
  }
};

// Debounce function for performance
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Throttle function for performance
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  let lastResult: ReturnType<T>;

  return function (this: any, ...args: Parameters<T>): ReturnType<T> {
    if (!inThrottle) {
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
      lastResult = func.apply(this, args);
    }
    return lastResult;
  };
};

// Lazy load images
export const lazyLoadImage = (src: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(src);
    img.onerror = reject;
    img.src = src;
  });
};

// Preload critical resources
export const preloadImage = (src: string) => {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'image';
  link.href = src;
  document.head.appendChild(link);
};

// Get optimal image size based on viewport
export const getOptimalImageSize = (
  originalWidth: number,
  originalHeight: number,
  maxWidth: number = window.innerWidth
): { width: number; height: number } => {
  if (originalWidth <= maxWidth) {
    return { width: originalWidth, height: originalHeight };
  }

  const ratio = originalHeight / originalWidth;
  return {
    width: maxWidth,
    height: Math.round(maxWidth * ratio),
  };
};

// Web Vitals monitoring
export const reportWebVitals = () => {
  if ('web-vital' in window) {
    // This would integrate with web-vitals package
    // import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';
    console.log('Web Vitals monitoring enabled');
  }
};

// Memory usage monitoring (for development)
export const logMemoryUsage = () => {
  if ('memory' in performance) {
    const memory = (performance as any).memory;
    console.log('Memory Usage:', {
      used: `${(memory.usedJSHeapSize / 1048576).toFixed(2)} MB`,
      total: `${(memory.jsHeapSizeLimit / 1048576).toFixed(2)} MB`,
      percentage: `${((memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100).toFixed(2)}%`,
    });
  }
};

// Detect slow network
export const isSlowNetwork = (): boolean => {
  const connection = (navigator as any).connection;
  if (!connection) return false;

  return (
    connection.effectiveType === 'slow-2g' ||
    connection.effectiveType === '2g' ||
    connection.saveData
  );
};

// Virtual scrolling helper
export const calculateVisibleItems = (
  scrollTop: number,
  containerHeight: number,
  itemHeight: number,
  totalItems: number,
  overscan: number = 3
): { startIndex: number; endIndex: number } => {
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const visibleItems = Math.ceil(containerHeight / itemHeight);
  const endIndex = Math.min(totalItems - 1, startIndex + visibleItems + overscan * 2);

  return { startIndex, endIndex };
};

