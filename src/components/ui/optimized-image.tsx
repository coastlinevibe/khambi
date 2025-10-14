import React, { useState, useRef, useEffect } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  placeholder?: string;
  onLoad?: () => void;
  onError?: () => void;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className = '',
  width,
  height,
  priority = false,
  placeholder,
  onLoad,
  onError,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const [imageSrc, setImageSrc] = useState<string>('');
  const imgRef = useRef<HTMLImageElement>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '50px',
        threshold: 0.1,
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [priority]);

  // Generate optimized image sources
  useEffect(() => {
    if (!isInView) return;

    // Create multiple size variants for responsive loading
    const createResponsiveSrc = (originalSrc: string) => {
      const extension = originalSrc.match(/\.(jpg|jpeg|png)$/i)?.[1] || 'jpg';
      const baseName = originalSrc.replace(/\.(jpg|jpeg|png)$/i, '');
      
      // Try WebP first, then AVIF, then original
      const formats = ['webp', 'avif', extension.toLowerCase()];
      const sizes = ['400w', '800w', '1200w', '1600w'];
      
      return formats.map(format => 
        sizes.map(size => `${baseName}-${size}.${format} ${size}`)
      ).flat();
    };

    // Check if WebP is supported
    const supportsWebP = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 1;
      canvas.height = 1;
      return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    };

    // Use WebP if supported, otherwise original
    const loadOptimalImage = () => {
      if (supportsWebP()) {
        const webpSrc = src.replace(/\.(jpg|jpeg|png)$/i, '.webp');
        setImageSrc(webpSrc);
      } else {
        setImageSrc(src);
      }
    };

    loadOptimalImage();
  }, [isInView, src]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    // Fallback to original format if WebP fails
    if (imageSrc.includes('.webp')) {
      setImageSrc(src);
    } else {
      onError?.();
    }
  };

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Placeholder while loading */}
      {!isLoaded && placeholder && (
        <div 
          className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center"
          style={{ aspectRatio: width && height ? `${width}/${height}` : undefined }}
        >
          <span className="text-gray-400 text-sm">{placeholder}</span>
        </div>
      )}
      
      {/* Actual image */}
      <img
        ref={imgRef}
        src={isInView ? imageSrc : undefined}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        className={`transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        } ${className}`}
        onLoad={handleLoad}
        onError={handleError}
        style={{
          transform: 'translateZ(0)',
          backfaceVisibility: 'hidden',
          imageRendering: 'auto',
          // Prevent visual artifacts during load
          willChange: 'auto',
          contain: 'layout style paint',
          // Ensure smooth rendering
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
        }}
      />
    </div>
  );
};

export default OptimizedImage;
