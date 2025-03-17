import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

const ImageGalleryModal = ({ images, isOpen, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!isOpen) return null;

  const handlePrevious = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setCurrentImageIndex((prev) => 
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-90 z-50"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-white hover:bg-white/10 rounded-full transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Previous button */}
        <button
          onClick={handlePrevious}
          className="absolute left-4 p-2 text-white hover:bg-white/10 rounded-full transition-colors"
        >
          <ChevronLeft className="w-8 h-8" />
        </button>

        {/* Image */}
        <img
          src={images[currentImageIndex]}
          alt={`Gallery image ${currentImageIndex + 1}`}
          className="max-h-[90vh] max-w-[90vw] object-contain"
        />

        {/* Next button */}
        <button
          onClick={handleNext}
          className="absolute right-4 p-2 text-white hover:bg-white/10 rounded-full transition-colors"
        >
          <ChevronRight className="w-8 h-8" />
        </button>

        {/* Image counter */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 px-4 py-2 rounded-full text-white text-sm">
          {currentImageIndex + 1} / {images.length}
        </div>
      </div>
    </>
  );
};

export default ImageGalleryModal;