'use client';

import { Badge } from '../ui/badge';

interface TemplateResultsSummaryProps {
  totalTemplates: number;
  searchTerm: string;
  hasActiveFilters: boolean;
  selectedCategory: string;
  selectedTags: string[];
}

export function TemplateResultsSummary({
  totalTemplates,
  searchTerm,
  hasActiveFilters,
  selectedCategory,
  selectedTags
}: TemplateResultsSummaryProps) {
  return (
    <section className="px-4 pb-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">
              {totalTemplates} Templates Found
            </h2>
            <p className="text-gray-600">
              {searchTerm && `Search results for "${searchTerm}"`}
              {hasActiveFilters && !searchTerm && 'Filtered results'}
              {!hasActiveFilters && !searchTerm && 'All available templates'}
            </p>
          </div>
          
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2">
              {searchTerm && (
                <Badge variant="secondary" className="bg-primary-100 text-primary-800">
                  Search: {searchTerm}
                </Badge>
              )}
              {selectedCategory !== 'all' && (
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  Category: {selectedCategory}
                </Badge>
              )}
              {selectedTags.map(tag => (
                <Badge key={tag} variant="secondary" className="bg-green-100 text-green-800">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
} 