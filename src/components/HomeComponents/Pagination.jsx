import React from "react";

const Pagination = ({type, currentPage, totalPages, onPageChange }) => {
  const MAX_VISIBLE_PAGES = 5;

  const getPageNumbers = () => {
    let pages = [];

    if (totalPages <= MAX_VISIBLE_PAGES) {
      // show all
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages = [1, 2, 3, 4, "...", totalPages];
      } else if (currentPage >= totalPages - 2) {
        pages = [1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
      } else {
        pages = [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages];
      }
    }

    return pages;
  };
  

  return (
    <div className="flex items-center space-x-2 mt-4">
      <button
        onClick={() => onPageChange(currentPage - 1,type)}
        disabled={currentPage === 1}
        className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50"
      >
        Prev
      </button>

      {getPageNumbers().map((page, index) =>
        page === "..." ? (
          <span key={index} className="px-3 py-1 text-gray-400 select-none">...</span>
        ) : (
          <button
            key={index}
            onClick={() => onPageChange(page,type)}
            className={`px-3 py-1 rounded ${
              page === currentPage ? "bg-brand text-white" : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            {page}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(currentPage + 1,type)}
        disabled={currentPage === totalPages}
        className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
