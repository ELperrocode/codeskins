'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { TemplateCard } from '../marketplace/TemplateCard';
import { 
  IconLayoutGrid, 
  IconList, 
  IconDownload,
  IconStar,
  IconShoppingCart
} from '@tabler/icons-react';

interface Template {
  _id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  tags: string[];
  previewImages?: string[];
  previewUrl?: string;
  features: string[];
  downloads: number;
  sales: number;
  rating: number;
  reviewCount: number;
  createdAt: string;
  ownerId: {
    _id: string;
    username: string;
  };
}

interface TemplateViewProps {
  templates: Template[];
  viewMode: 'grid' | 'list';
  setViewMode: (mode: 'grid' | 'list') => void;
  loading: boolean;
}

export function TemplateView({
  templates,
  viewMode,
  setViewMode,
  loading
}: TemplateViewProps) {
  if (loading) {
    return (
      <section className="px-4 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 12 }).map((_, index) => (
              <div key={index} className="rounded-lg border text-card-foreground shadow-sm bg-white border-gray-200 overflow-hidden">
                <div className="p-0">
                  <div className="w-full h-48 bg-gray-200 animate-pulse"></div>
                  <div className="p-4 space-y-3">
                    <div className="h-5 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                    <div className="space-y-2">
                      <div className="h-3 bg-gray-200 rounded w-full animate-pulse"></div>
                      <div className="h-3 bg-gray-200 rounded w-2/3 animate-pulse"></div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                      <div className="h-4 bg-gray-200 rounded w-12 animate-pulse"></div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex gap-1">
                        <div className="h-5 bg-gray-200 rounded w-8 animate-pulse"></div>
                        <div className="h-5 bg-gray-200 rounded w-8 animate-pulse"></div>
                      </div>
                      <div className="h-8 bg-gray-200 rounded w-20 animate-pulse"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="px-4 pb-12">
      <div className="max-w-7xl mx-auto">
        {/* View Mode Toggle */}
        <div className="flex justify-end mb-6">
          <div className="flex border border-gray-300 rounded-lg overflow-hidden">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="rounded-none border-0"
            >
              <IconLayoutGrid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="rounded-none border-0"
            >
              <IconList className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {viewMode === 'grid' ? (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {templates.map((template) => (
                <motion.div
                  key={template._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <TemplateCard template={template} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              {templates.map((template) => (
                <motion.div
                  key={template._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card className="bg-white border-gray-200 hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex gap-6">
                        {/* Image */}
                        <div className="w-48 h-32 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex-shrink-0 overflow-hidden">
                          {template.previewImages && template.previewImages.length > 0 ? (
                            <img
                              src={template.previewImages[0]}
                              alt={template.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-white">
                              <IconDownload className="w-8 h-8" />
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="text-xl font-semibold text-gray-900">{template.title}</h3>
                            <div className="text-2xl font-bold text-primary-600">${template.price}</div>
                          </div>
                          
                          <p className="text-gray-600 mb-4 line-clamp-2">{template.description}</p>
                          
                          <div className="flex items-center gap-4 mb-4">
                            <div className="flex items-center gap-1">
                              <IconStar className="w-4 h-4 text-yellow-400 fill-current" />
                              <span className="text-sm text-gray-600">{template.rating}</span>
                              <span className="text-sm text-gray-500">({template.reviewCount})</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <IconDownload className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-gray-600">{template.downloads}</span>
                            </div>
                            <div className="text-sm text-gray-500">{template.category}</div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex gap-2">
                              {template.tags.slice(0, 3).map((tag) => (
                                <span
                                  key={tag}
                                  className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                            <Button className="bg-primary-500 hover:bg-primary-600">
                              <IconShoppingCart className="w-4 h-4 mr-2" />
                              Add to Cart
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {templates.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <IconDownload className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No templates found</h3>
            <p className="text-gray-600">Try adjusting your search or filters to find what you're looking for.</p>
          </div>
        )}
      </div>
    </section>
  );
} 