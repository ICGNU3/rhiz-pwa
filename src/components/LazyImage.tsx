import React, { useState, useEffect, memo } from 'react';

interface LazyImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  placeholderColor?: string;
}

/**
 * LazyImage component that loads images only when they enter the viewport
 */
const LazyImage: React.FC<LazyImageProps> = memo(({
  src,
  alt,
  width,
  height,
  className = '',
  placeholderColor = '#f3f4f6'
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [imgSrc, setImgSrc] = useState<string>('');

  useEffect(() => {
    // Use Intersection Observer to detect when image is in viewport
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' } // Start loading when image is 200px from viewport
    );

    // Get current element to observe
    const element = document.getElementById(`lazy-image-${src.replace(/[^a-zA-Z0-9]/g, '-')}`);
    if (element) {
      observer.observe(element);
    }

    // Cleanup observer on component unmount
    return () => {
      observer.disconnect();
    };
  }, [src]);

  useEffect(() => {
    // Load image when it comes into view
    if (isInView) {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        setImgSrc(src);
        setIsLoaded(true);
      };
      img.onerror = () => {
        console.error(`Failed to load image: ${src}`);
        // Could set a fallback image here
      };
    }
  }, [isInView, src]);

  // Generate a unique ID for the image
  const imageId = `lazy-image-${src.replace(/[^a-zA-Z0-9]/g, '-')}`;

  return (
    <div 
      id={imageId}
      className={`relative overflow-hidden ${className}`}
      style={{ 
        width: width ? `${width}px` : '100%',
        height: height ? `${height}px` : 'auto',
        backgroundColor: placeholderColor,
        transition: 'opacity 0.3s ease-in-out'
      }}
    >
      {isLoaded ? (
        <img
          src={imgSrc}
          alt={alt}
          width={width}
          height={height}
          className={`w-full h-full object-cover transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          loading="lazy"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800 animate-pulse">
          <span className="sr-only">Loading image: {alt}</span>
        </div>
      )}
    </div>
  );
});

LazyImage.displayName = 'LazyImage';

export default LazyImage;