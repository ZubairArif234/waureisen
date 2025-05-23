// src/hooks/useIntersectionLoader.js
import { useRef, useEffect, useCallback, useState } from 'react';

/**
 * Custom hook for loading content based on intersection with viewport
 * Perfect for implementing infinite scroll or lazy loading
 * 
 * @param {Object} options - Configuration options
 * @param {Function} options.onIntersect - Callback function to run when element intersects
 * @param {boolean} options.enabled - Whether the observer should be active
 * @param {Object} options.observerOptions - IntersectionObserver options
 * @param {number} options.threshold - Visibility threshold to trigger intersection (0-1)
 * @param {string} options.rootMargin - Margin around root element
 * @returns {Object} Object containing ref to attach to the element and loading state
 */
const useIntersectionLoader = ({
  onIntersect,
  enabled = true,
  observerOptions = {},
  threshold = 0.1,
  rootMargin = '100px'
}) => {
  const elementRef = useRef(null);
  const observerRef = useRef(null);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Memoize the intersection handler to avoid recreating the observer unnecessarily
  const handleIntersection = useCallback(async (entries) => {
    const [entry] = entries;
    
    // Update intersection state
    setIsIntersecting(entry.isIntersecting);
    
    // Only trigger onIntersect when entering the viewport
    if (entry.isIntersecting && enabled && onIntersect && !isLoading) {
      try {
        setIsLoading(true);
        await onIntersect();
      } finally {
        setIsLoading(false);
      }
    }
  }, [onIntersect, enabled, isLoading]);
  
  // Set up and clean up the IntersectionObserver
  useEffect(() => {
    const options = {
      root: null, // Use viewport
      rootMargin,
      threshold,
      ...observerOptions
    };
    
    const observer = new IntersectionObserver(handleIntersection, options);
    observerRef.current = observer;
    
    const currentElement = elementRef.current;
    if (currentElement && enabled) {
      observer.observe(currentElement);
    }
    
    return () => {
      if (currentElement && observer) {
        observer.unobserve(currentElement);
      }
    };
  }, [handleIntersection, enabled, rootMargin, threshold, observerOptions]);
  
  // Manually trigger intersection check when conditions change
  const checkIntersection = useCallback(() => {
    if (elementRef.current && observerRef.current) {
      observerRef.current.unobserve(elementRef.current);
      observerRef.current.observe(elementRef.current);
    }
  }, []);
  
  return {
    ref: elementRef,
    isIntersecting,
    isLoading,
    checkIntersection
  };
};

export default useIntersectionLoader;