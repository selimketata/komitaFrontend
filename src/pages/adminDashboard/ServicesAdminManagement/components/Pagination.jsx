import React from 'react';

const Pagination = ({ 
  currentPage, 
  totalPages, 
  itemsPerPage, 
  totalItems, 
  handlePreviousPage, 
  handleNextPage,
  setCurrentPage 
}) => {
  // Generate page numbers to display
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5; // Show at most 5 page numbers
    
    if (totalPages <= maxPagesToShow) {
      // If we have 5 or fewer pages, show all of them
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always include first page
      pageNumbers.push(1);
      
      // Calculate start and end of page numbers to show
      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);
      
      // Adjust if we're at the beginning
      if (currentPage <= 2) {
        end = Math.min(totalPages - 1, 4);
      }
      
      // Adjust if we're at the end
      if (currentPage >= totalPages - 1) {
        start = Math.max(2, totalPages - 3);
      }
      
      // Add ellipsis if needed before middle pages
      if (start > 2) {
        pageNumbers.push('...');
      }
      
      // Add middle pages
      for (let i = start; i <= end; i++) {
        pageNumbers.push(i);
      }
      
      // Add ellipsis if needed after middle pages
      if (end < totalPages - 1) {
        pageNumbers.push('...');
      }
      
      // Always include last page
      pageNumbers.push(totalPages);
    }
    
    return pageNumbers;
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-center px-6 py-4 border-t">
      <div className="text-sm text-gray-600 mb-4 md:mb-0">
        Showing {Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} services
      </div>
      
      <div className="flex items-center space-x-1">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className={`px-3 py-1 rounded-md ${
            currentPage === 1
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          Previous
        </button>
        
        {getPageNumbers().map((page, index) => (
          <button
            key={index}
            onClick={() => typeof page === 'number' && setCurrentPage(page)}
            className={`px-3 py-1 rounded-md ${
              page === currentPage
                ? 'bg-[#142237] text-white'
                : page === '...'
                ? 'text-gray-500 cursor-default'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
            disabled={page === '...'}
          >
            {page}
          </button>
        ))}
        
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className={`px-3 py-1 rounded-md ${
            currentPage === totalPages
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;