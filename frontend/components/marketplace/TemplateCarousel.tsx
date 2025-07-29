'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '../ui/button'
import { TemplateCard } from './TemplateCard'

interface Template {
  id: string
  title: string
  description: string
  price: number
  previewImages: string[]
  tags: string[]
  rating: number
  reviewCount: number
  downloads: number
  ownerId: {
    username: string
  }
}

interface TemplateCarouselProps {
  templates: Template[]
  title?: string
  subtitle?: string
}

export function TemplateCarousel({ templates, title, subtitle }: TemplateCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % templates.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + templates.length) % templates.length)
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      nextSlide()
    }, 5000)

    return () => clearInterval(interval)
  }, [currentIndex, isAutoPlaying])

  if (!templates.length) return null

  return (
    <div className="relative w-full">
      {title && (
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">{title}</h2>
          {subtitle && (
            <p className="text-lg text-muted-foreground">{subtitle}</p>
          )}
        </div>
      )}

      <div className="relative overflow-hidden rounded-lg">
        {/* Main carousel */}
        <div className="relative h-[400px] md:h-[500px]">
          <div className="absolute inset-0">
            <div 
              className="h-full w-full transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(-${currentIndex * 100}%)`,
              }}
            >
              <div className="flex h-full">
                {templates.map((template, index) => (
                  <div key={template.id} className="w-full flex-shrink-0">
                    <div className="relative h-full">
                      <img 
                        src={template.previewImages[0]} 
                        alt={template.title}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                      
                      {/* Content overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                        <div className="max-w-2xl">
                          <h3 className="text-2xl md:text-3xl font-bold mb-2">
                            {template.title}
                          </h3>
                          <p className="text-lg mb-4 opacity-90 line-clamp-2">
                            {template.description}
                          </p>
                          <div className="flex items-center gap-4">
                            <div className="text-2xl font-bold text-primary">
                              ${template.price}
                            </div>
                            <Button 
                              size="lg"
                              className="bg-primary hover:bg-primary/90"
                            >
                              View Template
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Navigation buttons */}
          <Button
            variant="ghost"
            size="sm"
            className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 p-0 bg-white/20 hover:bg-white/30 text-white"
            onClick={prevSlide}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 p-0 bg-white/20 hover:bg-white/30 text-white"
            onClick={nextSlide}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>

          {/* Pause/Play button */}
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-4 right-4 h-8 w-8 p-0 bg-white/20 hover:bg-white/30 text-white"
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
          >
            {isAutoPlaying ? '⏸️' : '▶️'}
          </Button>
        </div>

        {/* Dots indicator */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {templates.map((_, index) => (
            <button
              key={index}
              className={`h-2 w-2 rounded-full transition-colors ${
                index === currentIndex ? 'bg-white' : 'bg-white/50'
              }`}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>
      </div>

      {/* Thumbnail previews */}
      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
        {templates.map((template, index) => (
          <button
            key={template.id}
            className={`relative aspect-video overflow-hidden rounded-md transition-all ${
              index === currentIndex 
                ? 'ring-2 ring-primary scale-105' 
                : 'hover:scale-105'
            }`}
            onClick={() => goToSlide(index)}
          >
            <img
              src={template.previewImages[0]}
              alt={template.title}
              className="w-full h-full object-cover"
            />
            {index === currentIndex && (
              <div className="absolute inset-0 bg-primary/20" />
            )}
          </button>
        ))}
      </div>
    </div>
  )
} 