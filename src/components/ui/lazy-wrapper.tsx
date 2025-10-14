import React, { useState, useRef, useEffect, Suspense } from 'react';

interface LazyWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  rootMargin?: string;
  threshold?: number;
  className?: string;
}

const LazyWrapper: React.FC<LazyWrapperProps> = ({
  children,
  fallback = <div className="animate-pulse bg-gray-200 h-32 rounded"></div>,
  rootMargin = '100px',
  threshold = 0.1,
  className = '',
}) => {
  const [isInView, setIsInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin,
        threshold,
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [rootMargin, threshold]);

  return (
    <div ref={ref} className={className}>
      {isInView ? (
        <Suspense fallback={fallback}>
          {children}
        </Suspense>
      ) : (
        fallback
      )}
    </div>
  );
};

export default LazyWrapper;
