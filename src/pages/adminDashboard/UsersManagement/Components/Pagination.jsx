import React from 'react';

const Pagination = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPreviousPage,
  onNextPage,
  onPageChange
}) => {
  return (
    <>
      {/* Desktop Pagination */}
      <div className="hidden md:flex items-center justify-between px-6 py-4 bg-gray-50 border-t border-gray-200">
        <div className="flex items-center text-sm text-gray-700">
          <span>
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} entries
          </span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onPreviousPage}
            disabled={currentPage === 1}
            className={`px-4 py-2 border rounded-lg ${
              currentPage === 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white text-[#142237] hover:bg-gray-50'
            } transition-colors duration-200`}
          >
            Previous
          </button>
          <div className="flex gap-1">
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index + 1}
                onClick={() => onPageChange(index + 1)}
                className={`px-4 py-2 border rounded-lg ${
                  currentPage === index + 1
                    ? 'bg-[#142237] text-white'
                    : 'bg-white text-[#142237] hover:bg-gray-50'
                } transition-colors duration-200`}
              >
                {index + 1}
              </button>
            ))}
          </div>
          <button
            onClick={onNextPage}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 border rounded-lg ${
              currentPage === totalPages
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white text-[#142237] hover:bg-gray-50'
            } transition-colors duration-200`}
          >
            Next
          </button>
        </div>
      </div>

      {/* Mobile Pagination */}
      <div className="md:hidden flex flex-col items-center gap-4 px-4 py-4 bg-gray-50 border-t border-gray-200">
        <div className="text-sm text-gray-700 text-center">
          Page {currentPage} of {totalPages}
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={onPreviousPage}
            disabled={currentPage === 1}
            className={`px-4 py-2 border rounded-lg text-sm ${
              currentPage === 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white text-[#142237] hover:bg-gray-50'
            } transition-colors duration-200`}
          >
            Previous
          </button>
          <button
            onClick={onNextPage}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 border rounded-lg text-sm ${
              currentPage === totalPages
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white text-[#142237] hover:bg-gray-50'
            } transition-colors duration-200`}
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
};

export default Pagination; 