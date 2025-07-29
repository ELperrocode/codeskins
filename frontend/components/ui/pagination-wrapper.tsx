'use client';

import { motion } from 'framer-motion';
import { Pagination } from './pagination';
import { PaginationInfo } from './pagination-info';

interface PaginationWrapperProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  currentItemsCount: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function PaginationWrapper({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  currentItemsCount,
  onPageChange,
  className = ''
}: PaginationWrapperProps) {
  if (totalPages <= 1) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className={`mt-12 ${className}`}
      >
        <PaginationInfo
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          totalItems={totalItems}
          currentItemsCount={currentItemsCount}
          className="mb-4"
        />
        <div className="text-center text-sm text-gray-500">
          {totalItems === 0 ? 'No templates found' : 'All templates shown on this page'}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className={`mt-12 ${className}`}
    >
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
        className="mb-4"
      />
      
      <PaginationInfo
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        totalItems={totalItems}
        currentItemsCount={currentItemsCount}
      />
    </motion.div>
  );
} 