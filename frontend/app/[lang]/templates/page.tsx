'use client';

import { useEffect, useState, Suspense } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { PaginationWrapper } from '../../../components/ui';
import { getTemplateCategories, getTemplateTags } from '../../../lib/api';
import { TemplateHeader } from '../../../components/templates/TemplateHeader';
import { TemplateFilters } from '../../../components/templates/TemplateFilters';
import { TemplateResultsSummary } from '../../../components/templates/TemplateResultsSummary';
import { TemplateView } from '../../../components/templates/TemplateView';

type Template = {
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
};

const ITEMS_PER_PAGE = 12;

function TemplatesPageContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const lang = params.lang as string;
  
  const [templates, setTemplates] = useState<Template[]>([]);
  const [totalTemplates, setTotalTemplates] = useState(0);
  const [categories, setCategories] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [selectedTags, setSelectedTags] = useState<string[]>(searchParams.get('tags')?.split(',') || []);
  const [priceRange, setPriceRange] = useState({ 
    min: Number(searchParams.get('minPrice')) || 0, 
    max: Number(searchParams.get('maxPrice')) || 1000 
  });
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>((searchParams.get('view') as 'grid' | 'list') || 'grid');

  // Pagination
  const [currentPage, setCurrentPage] = useState(Number(searchParams.get('page')) || 1);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, selectedTags, priceRange, sortBy]);

  // Fetch templates when page or filters change
  useEffect(() => {
    const fetchTemplates = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        params.append('page', currentPage.toString());
        params.append('limit', ITEMS_PER_PAGE.toString());
        
        if (searchTerm) params.append('search', searchTerm);
        if (selectedCategory !== 'all') params.append('category', selectedCategory);
        if (selectedTags.length > 0) params.append('tags', selectedTags.join(','));
        if (priceRange.min > 0) params.append('minPrice', priceRange.min.toString());
        if (priceRange.max < 1000) params.append('maxPrice', priceRange.max.toString());
        if (sortBy !== 'newest') params.append('sort', sortBy);

        const response = await fetch(`/api/templates?${params.toString()}`);
        const data = await response.json();
        
        if (data.success && data.data?.templates) {
          const mappedTemplates: Template[] = data.data.templates.map((template: any) => ({
            _id: template._id,
            title: template.title || 'Untitled Template',
            description: template.description || 'No description available',
            price: template.price || 0,
            category: template.category || 'Uncategorized',
            tags: Array.isArray(template.tags) ? template.tags : [],
            previewImages: Array.isArray(template.previewImages) ? template.previewImages : [],
            previewUrl: template.previewUrl,
            features: Array.isArray(template.features) ? template.features : [],
            downloads: template.downloads || 0,
            sales: template.sales || 0,
            rating: template.rating || 0,
            reviewCount: template.reviewCount || 0,
            createdAt: template.createdAt || new Date().toISOString(),
            ownerId: template.ownerId || { _id: '', username: 'Unknown' }
          }));
          setTemplates(mappedTemplates);
          setTotalTemplates(data.data.pagination?.total || 0);
        }
      } catch (error) {
        console.error('Error fetching templates:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, [currentPage, searchTerm, selectedCategory, selectedTags, priceRange, sortBy]);

  // Fetch categories and tags on component mount
  useEffect(() => {
    const fetchCategoriesAndTags = async () => {
      try {
        const [categoriesRes, tagsRes] = await Promise.all([
          getTemplateCategories(),
          getTemplateTags()
        ]);

        if (categoriesRes.success && categoriesRes.data?.categories) {
          setCategories(categoriesRes.data.categories);
        }

        if (tagsRes.success && tagsRes.data?.tags) {
          setTags(tagsRes.data.tags);
        }
      } catch (error) {
        console.error('Error fetching categories and tags:', error);
      }
    };

    fetchCategoriesAndTags();
  }, []);

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedTags([]);
    setPriceRange({ min: 0, max: 1000 });
    setSortBy('newest');
    setCurrentPage(1);
  };

  const hasActiveFilters = Boolean(searchTerm) || selectedCategory !== 'all' || selectedTags.length > 0 || 
                          priceRange.min > 0 || priceRange.max < 1000 || sortBy !== 'newest';

  // Use templates directly since pagination is now server-side
  const paginatedTemplates = templates;

  const totalPages = Math.ceil(totalTemplates / ITEMS_PER_PAGE);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="relative z-10">
          <TemplateHeader lang={lang} />
          <div className="px-4 pb-20 mt-8">
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
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="relative z-10">
        {/* Header */}
        <TemplateHeader lang={lang} />

        {/* Filters */}
        <TemplateFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedTags={selectedTags}
          handleTagToggle={handleTagToggle}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          sortBy={sortBy}
          setSortBy={setSortBy}
          categories={categories}
          tags={tags}
          clearFilters={clearFilters}
          hasActiveFilters={hasActiveFilters}
        />

        {/* Results Summary */}
        <TemplateResultsSummary
          totalTemplates={totalTemplates}
          searchTerm={searchTerm}
          hasActiveFilters={hasActiveFilters}
          selectedCategory={selectedCategory}
          selectedTags={selectedTags}
        />

        {/* Templates View */}
        <TemplateView
          templates={paginatedTemplates}
          viewMode={viewMode}
          setViewMode={setViewMode}
          loading={loading}
        />

        {/* Pagination */}
        <section className="px-4 pb-12">
          <div className="max-w-7xl mx-auto">
            <PaginationWrapper
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalTemplates}
              itemsPerPage={ITEMS_PER_PAGE}
              currentItemsCount={paginatedTemplates.length}
              onPageChange={setCurrentPage}
            />
          </div>
        </section>
      </div>
    </div>
  );
}

export default function TemplatesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="relative z-10">
          <div className="px-4 pb-20 pt-32">
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
          </div>
        </div>
      </div>
    }>
      <TemplatesPageContent />
    </Suspense>
  );
} 