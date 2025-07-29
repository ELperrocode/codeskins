'use client';

import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { IconArrowRight, IconPlayerPlay } from '@tabler/icons-react';

interface Category {
  _id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  templateCount: number;
  isActive?: boolean;
}

interface CategoryHeroParallaxProps {
  categories: Category[];
  onCategoryClick?: (category: Category) => void;
}

export default function CategoryHeroParallax({ categories, onCategoryClick }: CategoryHeroParallaxProps) {
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const { scrollYProgress } = useScroll();
  
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.8, 0.6]);

  // Auto-rotate through categories
  useEffect(() => {
    if (categories.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentCategoryIndex((prev) => (prev + 1) % categories.length);
    }, 5000); // Change every 5 seconds

    return () => clearInterval(interval);
  }, [categories.length]);

  const currentCategory = categories[currentCategoryIndex];
  
  if (!currentCategory) return null;

  // Default images for different categories if no imageUrl is provided
  const getDefaultImage = (categoryName: string) => {
    const categoryLower = categoryName.toLowerCase();
    if (categoryLower.includes('web')) {
      return 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80';
    }
    if (categoryLower.includes('mobile') || categoryLower.includes('app')) {
      return 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80';
    }
    if (categoryLower.includes('ecommerce') || categoryLower.includes('shop')) {
      return 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80';
    }
    if (categoryLower.includes('landing') || categoryLower.includes('marketing')) {
      return 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80';
    }
    if (categoryLower.includes('dashboard') || categoryLower.includes('admin')) {
      return 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80';
    }
    if (categoryLower.includes('blog') || categoryLower.includes('content')) {
      return 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80';
    }
    // Default tech/coding image
    return 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80';
  };

  const backgroundImage = currentCategory.imageUrl || getDefaultImage(currentCategory.name);

  return (
    <div className="relative h-[70vh] min-h-[500px] overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Background Image with Parallax */}
      <motion.div
        style={{ y, opacity, backgroundImage: `url(${backgroundImage})` }}
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50" />
      </motion.div>

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center h-full">
        <div className="text-center text-white px-4 max-w-4xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent"
          >
            {currentCategory.name}
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl text-gray-200 mb-8 max-w-2xl mx-auto"
          >
            {currentCategory.description || `Discover amazing ${currentCategory.name.toLowerCase()} templates`}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <button
              onClick={() => onCategoryClick?.(currentCategory)}
              className="group bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-2"
            >
              <IconPlayerPlay className="w-5 h-5" />
              Explore {currentCategory.name}
              <IconArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            
            <div className="text-center sm:text-left">
              <div className="text-3xl font-bold text-yellow-400">
                {currentCategory.templateCount}
              </div>
              <div className="text-sm text-gray-300">
                Templates Available
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Category Navigation Dots */}
      {categories.length > 1 && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-3">
          {categories.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentCategoryIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentCategoryIndex
                  ? 'bg-yellow-400 scale-125'
                  : 'bg-white/50 hover:bg-white/75'
              }`}
            />
          ))}
        </div>
      )}

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-4 left-1/2 transform -translate-x-1/2"
      >
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1 h-3 bg-white/60 rounded-full mt-2"
          />
        </div>
      </motion.div>
    </div>
  );
} 