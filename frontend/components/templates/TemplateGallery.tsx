'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IconEye, IconZoomIn, IconChevronLeft, IconChevronRight, IconExternalLink } from '@tabler/icons-react';
import { Button } from '../ui/button';

interface TemplateGalleryProps {
  images: string[];
  title: string;
  previewUrl?: string;
}

export function TemplateGallery({ images, title, previewUrl }: TemplateGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + images.length) % images.length);
  };

  if (!images || images.length === 0) {
    return (
      <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 border border-gray-300 rounded-xl flex items-center justify-center">
        <div className="text-center text-gray-500">
          <IconEye className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium">No preview images available</p>
          <p className="text-sm">This template doesn't have preview images yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative group">
        <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 border border-gray-300 rounded-xl overflow-hidden">
          <motion.img
            key={selectedImage}
            src={images[selectedImage]}
            alt={`${title} preview ${selectedImage + 1}`}
            className="w-full h-full object-cover"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          />
          
          {/* Overlay with zoom and preview buttons */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsFullscreen(true)}
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 hover:bg-white text-gray-800"
            >
              <IconZoomIn className="w-4 h-4 mr-2" />
              Zoom
            </Button>
            
            {previewUrl && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.open(previewUrl, '_blank')}
                className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 hover:bg-white text-gray-800"
              >
                <IconExternalLink className="w-4 h-4 mr-2" />
                Live Preview
              </Button>
            )}
          </div>

          {/* Navigation arrows */}
          {images.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={prevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 hover:bg-white text-gray-800"
              >
                <IconChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={nextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 hover:bg-white text-gray-800"
              >
                <IconChevronRight className="w-4 h-4" />
              </Button>
            </>
          )}
        </div>

        {/* Image counter */}
        {images.length > 1 && (
          <div className="absolute bottom-3 right-3 bg-black/70 text-white px-2 py-1 rounded-md text-sm">
            {selectedImage + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnail Gallery */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-3">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`aspect-video bg-gradient-to-br from-gray-100 to-gray-200 border-2 rounded-lg overflow-hidden transition-all duration-200 hover:scale-105 ${
                selectedImage === index
                  ? 'border-primary-500 shadow-lg'
                  : 'border-gray-300 hover:border-primary-300'
              }`}
            >
              <img
                src={image}
                alt={`${title} thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen Modal */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setIsFullscreen(false)}
          >
            <div className="relative max-w-7xl max-h-full">
              <img
                src={images[selectedImage]}
                alt={`${title} fullscreen ${selectedImage + 1}`}
                className="max-w-full max-h-full object-contain"
                onClick={(e) => e.stopPropagation()}
              />
              
              {/* Close button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsFullscreen(false)}
                className="absolute top-4 right-4 bg-white/90 hover:bg-white text-gray-800"
              >
                ✕
              </Button>

              {/* Navigation in fullscreen */}
              {images.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      prevImage();
                    }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800"
                  >
                    <IconChevronLeft className="w-6 h-6" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      nextImage();
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800"
                  >
                    <IconChevronRight className="w-6 h-6" />
                  </Button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 