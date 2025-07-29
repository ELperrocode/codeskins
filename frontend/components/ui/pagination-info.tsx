'use client';

interface PaginationInfoProps {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  currentItemsCount: number;
  className?: string;
}

export function PaginationInfo({ 
  currentPage, 
  itemsPerPage, 
  totalItems, 
  currentItemsCount,
  className = '' 
}: PaginationInfoProps) {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className={`text-center text-sm text-gray-500 ${className}`}>
      Showing {startItem} to {endItem} of {totalItems} templates
      {totalItems > itemsPerPage && (
        <span className="ml-2 text-gray-400">
          (Page {currentPage} of {Math.ceil(totalItems / itemsPerPage)})
        </span>
      )}
    </div>
  );
} 