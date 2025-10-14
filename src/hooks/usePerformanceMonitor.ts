import { useEffect, useRef } from 'react';

interface PerformanceMetrics {
  fps: number;
  memoryUsage?: number;
  loadTime: number;
  renderTime: number;
}

export const usePerformanceMonitor = (enabled: boolean = false) => {
  const frameCount = useRef(0);
  const lastTime = useRef(performance.now());
  const fpsRef = useRef(0);

  useEffect(() => {
    if (!enabled) return;

    let animationId: number;

    const measureFPS = () => {
      frameCount.current++;
      const currentTime = performance.now();
      
      if (currentTime >= lastTime.current + 1000) {
        fpsRef.current = Math.round((frameCount.current * 1000) / (currentTime - lastTime.current));
        frameCount.current = 0;
        lastTime.current = currentTime;
        
        // Log performance warnings
        if (fpsRef.current < 30) {
          console.warn(`Low FPS detected: ${fpsRef.current} fps`);
        }
      }
      
      animationId = requestAnimationFrame(measureFPS);
    };

    // Start monitoring
    measureFPS();

    // Monitor memory usage if available
    const logMemoryUsage = () => {
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        const usedMB = Math.round(memory.usedJSHeapSize / 1048576);
        const totalMB = Math.round(memory.totalJSHeapSize / 1048576);
        
        if (usedMB > 100) {
          console.warn(`High memory usage: ${usedMB}MB / ${totalMB}MB`);
        }
      }
    };

    const memoryInterval = setInterval(logMemoryUsage, 5000);

    return () => {
      cancelAnimationFrame(animationId);
      clearInterval(memoryInterval);
    };
  }, [enabled]);

  const getMetrics = (): PerformanceMetrics => {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    
    return {
      fps: fpsRef.current,
      memoryUsage: 'memory' in performance ? Math.round(((performance as any).memory.usedJSHeapSize / 1048576)) : undefined,
      loadTime: navigation ? navigation.loadEventEnd - navigation.fetchStart : 0,
      renderTime: navigation ? navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart : 0,
    };
  };

  return { getMetrics };
};

// Hook to detect if device is low-end
export const useDeviceCapabilities = () => {
  const isLowEndDevice = () => {
    // Check for various indicators of low-end devices
    const hardwareConcurrency = navigator.hardwareConcurrency || 1;
    const deviceMemory = (navigator as any).deviceMemory || 1;
    const connection = (navigator as any).connection;
    
    // Consider device low-end if:
    // - Less than 4 CPU cores
    // - Less than 4GB RAM
    // - Slow network connection
    const isSlowCPU = hardwareConcurrency < 4;
    const isLowMemory = deviceMemory < 4;
    const isSlowNetwork = connection && (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g');
    
    return isSlowCPU || isLowMemory || isSlowNetwork;
  };

  const shouldReduceAnimations = () => {
    return isLowEndDevice() || window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  };

  return {
    isLowEndDevice: isLowEndDevice(),
    shouldReduceAnimations: shouldReduceAnimations(),
  };
};
