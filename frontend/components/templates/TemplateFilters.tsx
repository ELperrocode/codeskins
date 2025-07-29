'use client';

import { useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { useTranslation } from '../../lib/hooks/useTranslation';
import { 
  IconSearch, 
  IconFilter, 
  IconX,
  IconAdjustments,
  IconSortAscending
} from '@tabler/icons-react';

interface TemplateFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  selectedTags: string[];
  handleTagToggle: (tag: string) => void;
  priceRange: { min: number; max: number };
  setPriceRange: (range: { min: number; max: number }) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  categories: string[];
  tags: string[];
  clearFilters: () => void;
  hasActiveFilters: boolean;
}

export function TemplateFilters({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  selectedTags,
  handleTagToggle,
  priceRange,
  setPriceRange,
  sortBy,
  setSortBy,
  categories,
  tags,
  clearFilters,
  hasActiveFilters
}: TemplateFiltersProps) {
  const { t } = useTranslation();
  const [showFilters, setShowFilters] = useState(false);

  return (
    <section className="px-4 pb-6">
      <div className="max-w-7xl mx-auto">
        <Card className="bg-white border-gray-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search Bar */}
              <div className="flex-1">
                <div className="relative">
                  <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type="text"
                    placeholder={t('filters.searchPlaceholder')}
                    value={searchTerm}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-gray-50 border-gray-200 focus:bg-white focus:border-primary-500"
                  />
                </div>
              </div>

              {/* Filter Toggle */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2"
                >
                  <IconFilter className="w-4 h-4" />
                  {t('filters.filters')}
                  {hasActiveFilters && (
                    <Badge variant="secondary" className="ml-1">
                      {selectedTags.length + (selectedCategory !== 'all' ? 1 : 0) + (priceRange.min > 0 || priceRange.max < 1000 ? 1 : 0)}
                    </Badge>
                  )}
                </Button>
                
                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    onClick={clearFilters}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
                  >
                    <IconX className="w-4 h-4" />
                    {t('filters.clear')}
                  </Button>
                )}
              </div>
            </div>

            {/* Expanded Filters */}
            {showFilters && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="space-y-6">
                  {/* First row: Sort, Category, Price Range */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Sort */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                        <IconSortAscending className="w-4 h-4" />
                        {t('filters.sortByLabel')}
                      </label>
                      <select
                        value={sortBy}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSortBy(e.target.value)}
                        className="w-full p-2 bg-white border border-gray-300 rounded-md text-gray-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                      >
                        <option value="newest">{t('filters.newestFirst')}</option>
                        <option value="oldest">{t('filters.oldestFirst')}</option>
                        <option value="price-low">{t('filters.priceLowToHigh')}</option>
                        <option value="price-high">{t('filters.priceHighToLow')}</option>
                        <option value="rating">{t('filters.highestRated')}</option>
                        <option value="downloads">{t('filters.mostDownloaded')}</option>
                      </select>
                    </div>

                    {/* Category Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">{t('filters.categoryLabel')}</label>
                      <select
                        value={selectedCategory}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedCategory(e.target.value)}
                        className="w-full p-2 bg-white border border-gray-300 rounded-md text-gray-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                      >
                        <option value="all">{t('filters.allCategories')}</option>
                        {categories.map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Price Range */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">{t('filters.priceRangeLabel')}</label>
                      <div className="flex gap-2">
                                                  <Input
                            type="number"
                            placeholder={t('filters.min')}
                            value={priceRange.min}
                            onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) })}
                            className="w-full p-2 bg-white border border-gray-300 rounded-md text-gray-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                          />
                          <Input
                            type="number"
                            placeholder={t('filters.max')}
                            value={priceRange.max}
                            onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
                            className="w-full p-2 bg-white border border-gray-300 rounded-md text-gray-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                          />
                      </div>
                    </div>
                  </div>

                  {/* Second row: Tags - Full width */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">{t('filters.tagsLabel')}</label>
                    <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-2 border border-gray-200 rounded-md bg-gray-50">
                      {tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant={selectedTags.includes(tag) ? "default" : "outline"}
                          className={`cursor-pointer transition-colors ${
                            selectedTags.includes(tag)
                              ? 'bg-primary-500 text-white hover:bg-primary-600'
                              : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'
                          }`}
                          onClick={() => handleTagToggle(tag)}
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
} 