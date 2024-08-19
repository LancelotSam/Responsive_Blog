// frontend/src/components/Pagination.js
import React from 'react';

const Pagination = ({ totalPages, currentPage, onPageChange }) => {
  return (
    <div>
      {[...Array(totalPages)].map((_, index) => (
        <button
          key={index}
          disabled={currentPage === index + 1}
          onClick={() => onPageChange(index + 1)}
        >
          {index + 1}
        </button>
      ))}
    </div>
  );
};

export default Pagination;
