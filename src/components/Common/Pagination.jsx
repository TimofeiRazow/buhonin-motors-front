import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); 
         i <= Math.min(totalPages - 1, currentPage + delta); 
         i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const visiblePages = getVisiblePages();

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '5px',
      padding: '20px'
    }}>
      {/* Предыдущая страница */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        style={{
          padding: '8px 12px',
          border: '1px solid #ddd',
          backgroundColor: currentPage === 1 ? '#f5f5f5' : 'white',
          color: currentPage === 1 ? '#999' : '#333',
          borderRadius: '4px',
          cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
          fontSize: '14px'
        }}
      >
        ← Назад
      </button>

      {/* Номера страниц */}
      {visiblePages.map((page, index) => (
        <React.Fragment key={index}>
          {page === '...' ? (
            <span style={{ padding: '8px 4px', color: '#999' }}>...</span>
          ) : (
            <button
              onClick={() => onPageChange(page)}
              style={{
                padding: '8px 12px',
                border: '1px solid #ddd',
                backgroundColor: currentPage === page ? '#007bff' : 'white',
                color: currentPage === page ? 'white' : '#333',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px',
                minWidth: '40px'
              }}
            >
              {page}
            </button>
          )}
        </React.Fragment>
      ))}

      {/* Следующая страница */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        style={{
          padding: '8px 12px',
          border: '1px solid #ddd',
          backgroundColor: currentPage === totalPages ? '#f5f5f5' : 'white',
          color: currentPage === totalPages ? '#999' : '#333',
          borderRadius: '4px',
          cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
          fontSize: '14px'
        }}
      >
        Вперед →
      </button>

      {/* Информация о страницах */}
      <div style={{
        marginLeft: '20px',
        fontSize: '14px',
        color: '#666'
      }}>
        Страница {currentPage} из {totalPages}
      </div>
    </div>
  );
};

export default Pagination;