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
    <div className="bg-black py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Заголовок секции */}
        <div className="text-center mb-8">
          <h3 className="text-2xl md:text-3xl font-black uppercase tracking-wider text-white mb-2">
            НАВИГАЦИЯ
          </h3>
          <div className="w-16 h-1 bg-orange-500 mx-auto"></div>
        </div>

        {/* Пагинация */}
        <div className="flex flex-wrap justify-center items-center gap-2 md:gap-4">
          {/* Кнопка "Назад" */}
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`
              group relative px-4 md:px-6 py-3 font-black text-sm md:text-base uppercase tracking-wider
              border-4 transition-all duration-300 transform hover:scale-105
              ${currentPage === 1 
                ? 'bg-gray-800 border-gray-600 text-gray-500 cursor-not-allowed' 
                : 'bg-white border-black text-black hover:bg-orange-500 hover:border-orange-500 hover:text-black'
              }
            `}
          >
            <div className="absolute top-1 right-1 w-2 h-2 bg-current opacity-50"></div>
            <span className="relative">← НАЗАД</span>
          </button>

          {/* Номера страниц */}
          <div className="flex flex-wrap justify-center items-center gap-1 md:gap-2">
            {visiblePages.map((page, index) => (
              <React.Fragment key={index}>
                {page === '...' ? (
                  <div className="px-2 py-3 text-orange-500 font-black text-xl">
                    ●●●
                  </div>
                ) : (
                  <button
                    onClick={() => onPageChange(page)}
                    className={`
                      group relative min-w-[48px] md:min-w-[56px] h-12 md:h-14 font-black text-sm md:text-lg
                      border-4 transition-all duration-300 transform hover:scale-110 uppercase tracking-wider
                      ${currentPage === page 
                        ? 'bg-orange-500 border-black text-black shadow-lg' 
                        : 'bg-black border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-black'
                      }
                    `}
                  >
                    {/* Декоративный элемент для активной страницы */}
                    {currentPage === page && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-black"></div>
                    )}
                    
                    {/* Декоративный элемент для неактивных страниц */}
                    {currentPage !== page && (
                      <div className="absolute top-1 right-1 w-2 h-2 bg-orange-500 opacity-50 group-hover:bg-black"></div>
                    )}
                    
                    <span className="relative">{page}</span>
                  </button>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Кнопка "Вперед" */}
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`
              group relative px-4 md:px-6 py-3 font-black text-sm md:text-base uppercase tracking-wider
              border-4 transition-all duration-300 transform hover:scale-105
              ${currentPage === totalPages 
                ? 'bg-gray-800 border-gray-600 text-gray-500 cursor-not-allowed' 
                : 'bg-white border-black text-black hover:bg-orange-500 hover:border-orange-500 hover:text-black'
              }
            `}
          >
            <div className="absolute top-1 left-1 w-2 h-2 bg-current opacity-50"></div>
            <span className="relative">ВПЕРЕД →</span>
          </button>
        </div>

        {/* Информация о текущей позиции */}
        <div className="text-center mt-8">
          <div className="inline-block bg-gray-900 border-4 border-orange-500 px-6 py-3">
            <span className="text-white font-black text-sm md:text-base uppercase tracking-wider">
              СТРАНИЦА{' '}
              <span className="text-orange-500">{currentPage}</span>
              {' '}ИЗ{' '}
              <span className="text-orange-500">{totalPages}</span>
            </span>
          </div>
        </div>

        {/* Декоративные элементы */}
        <div className="flex justify-center items-center gap-4 mt-8 opacity-30">
          <div className="w-8 h-1 bg-orange-500"></div>
          <div className="w-4 h-4 border-2 border-orange-500 rotate-45"></div>
          <div className="w-8 h-1 bg-orange-500"></div>
        </div>
      </div>
    </div>
  );
};

// Пример использования
const PaginationDemo = () => {
  const [currentPage, setCurrentPage] = React.useState(5);
  const totalPages = 20;

  return (
    <div className="bg-gray-900 min-h-screen">
      {/* Демо контент */}
      <div className="bg-black py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-black text-white mb-4 uppercase tracking-wider">
            <span className="text-orange-500">РЕЗУЛЬТАТЫ</span> ПОИСКА
          </h1>
          <p className="text-xl text-gray-300 font-bold uppercase">
            НАЙДЕНО 1,247 АВТОМОБИЛЕЙ
          </p>
        </div>
      </div>

      {/* Здесь был бы контент страницы */}
      <div className="bg-gray-900 py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item} className="bg-black border-4 border-orange-500 p-6">
                <div className="h-32 bg-gray-800 mb-4"></div>
                <h3 className="text-white font-black text-lg uppercase">
                  АВТОМОБИЛЬ #{item + (currentPage - 1) * 6}
                </h3>
                <p className="text-orange-500 font-bold">1,500,000 ₸</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Пагинация */}
      <Pagination 
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default PaginationDemo;