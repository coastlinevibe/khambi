import React, { useEffect, useRef, useState } from 'react';

interface IntersectionObserverWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  rootMargin?: string;
  threshold?: number;
  className?: string;
}

export const IntersectionObserverWrapper: React.FC<IntersectionObserverWrapperProps> = ({
  children,
  fallback = <div className="h-32 bg-gray-100 animate-pulse rounded"></div>,
  rootMargin = '200px',
  threshold = 0.1,
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
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
      {isVisible ? children : fallback}
    </div>
  );
};

export default IntersectionObserverWrapper;
