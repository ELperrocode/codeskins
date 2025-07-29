import { Card, CardContent } from './card';

interface TemplateSkeletonProps {
  count?: number;
  viewMode?: 'grid' | 'list';
}

export function TemplateSkeleton({ count = 8, viewMode = 'grid' }: TemplateSkeletonProps) {
  const skeletons = Array.from({ length: count }, (_, i) => i);

  if (viewMode === 'list') {
    return (
      <div className="space-y-4">
        {skeletons.map((i) => (
          <Card key={i} className="bg-white border-gray-200">
            <CardContent className="p-6">
              <div className="flex gap-6">
                {/* Image skeleton */}
                <div className="w-48 h-32 bg-gray-200 rounded-lg animate-pulse flex-shrink-0" />
                
                {/* Content skeleton */}
                <div className="flex-1 space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="h-6 bg-gray-200 rounded w-48 animate-pulse" />
                    <div className="h-6 bg-gray-200 rounded w-16 animate-pulse" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
                    <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
                  </div>
                  <div className="flex gap-4">
                    <div className="h-4 bg-gray-200 rounded w-20 animate-pulse" />
                    <div className="h-4 bg-gray-200 rounded w-24 animate-pulse" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      <div className="h-6 bg-gray-200 rounded w-16 animate-pulse" />
                      <div className="h-6 bg-gray-200 rounded w-12 animate-pulse" />
                    </div>
                    <div className="h-9 bg-gray-200 rounded w-24 animate-pulse" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {skeletons.map((i) => (
        <Card key={i} className="bg-white border-gray-200 overflow-hidden">
          <CardContent className="p-0">
            {/* Image skeleton */}
            <div className="w-full h-48 bg-gray-200 animate-pulse" />
            
            {/* Content skeleton */}
            <div className="p-4 space-y-3">
              <div className="h-5 bg-gray-200 rounded w-3/4 animate-pulse" />
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded w-full animate-pulse" />
                <div className="h-3 bg-gray-200 rounded w-2/3 animate-pulse" />
              </div>
              <div className="flex items-center justify-between">
                <div className="h-4 bg-gray-200 rounded w-16 animate-pulse" />
                <div className="h-4 bg-gray-200 rounded w-12 animate-pulse" />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex gap-1">
                  <div className="h-5 bg-gray-200 rounded w-8 animate-pulse" />
                  <div className="h-5 bg-gray-200 rounded w-8 animate-pulse" />
                </div>
                <div className="h-8 bg-gray-200 rounded w-20 animate-pulse" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
} 