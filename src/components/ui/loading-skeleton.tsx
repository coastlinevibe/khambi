import React from 'react';

interface LoadingSkeletonProps {
  className?: string;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ className = '' }) => {
  return (
    <div className={`animate-pulse ${className}`}>
      <div className="hero-loading">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h1 className="text-2xl font-bold mb-2">Gift AI</h1>
          <p className="text-lg opacity-80">Loading your compassionate experience...</p>
        </div>
      </div>
    </div>
  );
};

export const HeroSkeleton: React.FC = () => {
  return (
    <div className="min-h-[60vh] sm:min-h-[75vh] bg-gray-200 animate-pulse rounded-3xl flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-32 h-8 bg-gray-300 rounded mx-auto"></div>
        <div className="w-48 h-12 bg-gray-300 rounded mx-auto"></div>
        <div className="w-40 h-6 bg-gray-300 rounded mx-auto"></div>
      </div>
    </div>
  );
};

export default LoadingSkeleton;
