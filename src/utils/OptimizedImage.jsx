// src/components/utils/OptimizedImage.jsx
import React, { useState, useEffect, useRef } from 'react';

/**
 * Optimized image component with progressive loading and lazy loading
 * 
 * @param {Object} props - Component props
 * @param {string} props.src - Image source URL
 * @param {string} props.alt - Alt text for accessibility
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.lazy - Whether to use lazy loading (default: true)
 * @param {string} props.placeholderColor - Background color while loading
 * @param {Function} props.onLoad - Callback when image loads
 */
const OptimizedImage = ({
  src,
  alt = '',
  className = '',
  lazy = true,
  placeholderColor = '#f3f4f6',
  onLoad,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);
  const imgRef = useRef(null);
  const observerRef = useRef(null);
  
  // Use IntersectionObserver for lazy loading
  useEffect(() => {
    if (!lazy) {
      // If not lazy loading, skip observer setup
      return;
    }
    
    // Handle image intersection with viewport
    const handleIntersection = (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Start loading the image
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
          }
          
          // Stop observing once loaded
          observer.unobserve(img);
        }
      });
    };
    
    // Set up observer
    const options = {
      root: null, // Use viewport as root
      rootMargin: '200px', // Start loading when within 200px of viewport
      threshold: 0.01 // Trigger when 1% visible
    };
    
    const observer = new IntersectionObserver(handleIntersection, options);
    observerRef.current = observer;
    
    // Start observing the image
    if (imgRef.current) {
      observer.observe(imgRef.current);
    }
    
    // Clean up
    return () => {
      if (observerRef.current && imgRef.current) {
        observerRef.current.unobserve(imgRef.current);
      }
    };
  }, [lazy]);
  
  // Handle image load
  const handleLoad = (e) => {
    setIsLoaded(true);
    if (onLoad) {
      onLoad(e);
    }
  };
  
  // Handle image error
  const handleError = () => {
    setError(true);
    setIsLoaded(true); // Consider it "loaded" to remove loading state
  };
  
  return (
    <div 
      className={`relative overflow-hidden ${className}`}
      style={{
        backgroundColor: placeholderColor,
        transition: 'background-color 0.3s ease'
      }}
    >
      <img
        ref={imgRef}
        src={lazy ? undefined : src}
        data-src={lazy ? src : undefined}
        alt={alt}
        onLoad={handleLoad}
        onError={handleError}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        {...props}
      />
      
      {/* Show fallback for error state */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
          <span className="text-gray-500 text-sm">Image not available</span>
        </div>
      )}
      
      {/* Loading placeholder */}
      {!isLoaded && !error && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
    </div>
  );
};

export default React.memo(OptimizedImage);