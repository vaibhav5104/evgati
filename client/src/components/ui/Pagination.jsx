import React from 'react';
import Button from './Button';

const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  siblingCount = 1,
  className = '' 
}) => {
  const generatePageNumbers = () => {
    // If total pages is less than the page numbers we want to show
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

    const showLeftDots = leftSiblingIndex > 2;
    const showRightDots = rightSiblingIndex < totalPages - 1;

    const pageNumbers = [];

    // Always show first page
    pageNumbers.push(1);

    // Show left dots if needed
    if (showLeftDots) {
      pageNumbers.push('...');
    }

    // Show sibling pages
    for (let page = leftSiblingIndex; page <= rightSiblingIndex; page++) {
      if (page > 1 && page < totalPages) {
        pageNumbers.push(page);
      }
    }

    // Show right dots if needed
    if (showRightDots) {
      pageNumbers.push('...');
    }

    // Always show last page
    if (totalPages > 1) {
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  const pageNumbers = generatePageNumbers();

  return (
    <div className={`flex items-center justify-center space-x-2 ${className}`}>
      <Button
        variant="secondary"
        size="sm"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
        </svg>
      </Button>

      {pageNumbers.map((page, index) => (
        <button
          key={index}
          onClick={() => typeof page === 'number' && onPageChange(page)}
          className={`
            px-3 py-1 rounded-lg transition-colors duration-200
            ${
              page === currentPage 
                ? 'bg-blue-500 text-white' 
                : page === '...'
                  ? 'cursor-default text-gray-500'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }
            ${typeof page === 'number' ? 'cursor-pointer' : 'cursor-default'}
          `}
          disabled={page === '...'}
        >
          {page}
        </button>
      ))}

      <Button
        variant="secondary"
        size="sm"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
        </svg>
      </Button>
    </div>
  );
};

export default Pagination;

