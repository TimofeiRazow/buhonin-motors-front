import React, { useState } from 'react';
import { useQuery } from 'react-query';
import api from '../../services/api';

const FAQPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedItems, setExpandedItems] = useState(new Set());
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Mock FAQ data для демонстрации
  const mockFAQ = [
    {
      faq_id: 1,
      question: 'Как разместить объявление?',
      answer: '<p>Для размещения объявления:</p><ul><li>Зарегистрируйтесь на сайте</li><li>Нажмите кнопку "Подать объявление"</li><li>Заполните все обязательные поля</li><li>Загрузите фотографии</li><li>Опубликуйте объявление</li></ul>',
      category: 'Объявления',
      views: 1250
    },
    {
      faq_id: 2,
      question: 'Почему мое объявление не публикуется?',
      answer: '<p>Объявление может не публиковаться по следующим причинам:</p><ul><li>Не заполнены обязательные поля</li><li>Нарушены правила размещения</li><li>Объявление находится на модерации</li><li>Технические проблемы</li></ul><p>Обратитесь в поддержку для решения проблемы.</p>',
      category: 'Объявления',
      views: 950
    },
    {
      faq_id: 3,
      question: 'Как оплатить услуги продвижения?',
      answer: '<p>Доступные способы оплаты:</p><ul><li>Банковская карта (Visa, MasterCard, МИР)</li><li>Kaspi Pay</li><li>QIWI кошелек</li><li>Банковский перевод</li></ul><p>Оплата происходит через защищенные платежные системы.</p>',
      category: 'Платежи',
      views: 800
    },
    {
      faq_id: 4,
      question: 'Как изменить пароль?',
      answer: '<p>Для смены пароля:</p><ol><li>Войдите в личный кабинет</li><li>Перейдите в раздел "Настройки"</li><li>Выберите "Безопасность"</li><li>Нажмите "Изменить пароль"</li><li>Введите старый и новый пароль</li></ol>',
      category: 'Аккаунт',
      views: 600
    },
    {
      faq_id: 5,
      question: 'Как связаться с продавцом?',
      answer: '<p>Способы связи с продавцом:</p><ul><li>Позвонить по указанному телефону</li><li>Написать сообщение через сайт</li><li>Отправить запрос на просмотр</li></ul><p>Будьте осторожны с мошенниками!</p>',
      category: 'Безопасность',
      views: 1100
    },
    {
      faq_id: 6,
      question: 'Что делать если столкнулся с мошенничеством?',
      answer: '<p>При обнаружении мошенничества:</p><ol><li>Не переводите деньги</li><li>Сохраните переписку</li><li>Пожалуйтесь на объявление</li><li>Обратитесь в поддержку</li><li>Сообщите в полицию при необходимости</li></ol>',
      category: 'Безопасность',
      views: 750
    }
  ];

  const { data: faqData, isLoading } = useQuery('faq', () => 
    Promise.resolve({ data: mockFAQ })
  );

  const faqItems = faqData?.data || [];

  // Получаем уникальные категории
  const categories = ['all', ...new Set(faqItems.map(item => item.category))];

  const filteredFAQ = faqItems
    .filter(item => selectedCategory === 'all' || item.category === selectedCategory)
    .filter(item =>
      item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => b.views - a.views); // Сортировка по популярности

  const toggleExpanded = (itemId) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'Объявления': '📋',
      'Платежи': '💳',
      'Аккаунт': '👤',
      'Безопасность': '🛡️',
      'Техподдержка': '🔧'
    };
    return icons[category] || '❓';
  };

  if (isLoading) {
    return (
      <div className="bg-gray-900 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-4 mx-auto"></div>
          <p className="text-white font-black text-xl uppercase tracking-wider">
            ЗАГРУЗКА FAQ...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        {/* Заголовок */}
        <div className="mb-8">
          <div className="bg-black border-4 border-orange-500 p-6 relative">
            <h1 className="text-3xl md:text-5xl font-black uppercase tracking-wider text-white text-center mb-4">
              <span className="text-orange-500">ЧАСТО ЗАДАВАЕМЫЕ</span> ВОПРОСЫ
            </h1>
            <div className="w-full h-1 bg-orange-500"></div>
            
            {/* Декоративные элементы */}
            <div className="absolute top-2 left-2 w-4 h-4 border-2 border-orange-500"></div>
            <div className="absolute bottom-2 right-2 w-4 h-4 bg-orange-500"></div>
          </div>
        </div>

        {/* Статистика */}
        <div className="mb-8 bg-black border-4 border-white p-6">
          <h2 className="text-white font-black text-xl uppercase tracking-wider mb-6 text-center">
            📊 СТАТИСТИКА FAQ
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-900 border-2 border-blue-500 p-4 text-center">
              <div className="text-blue-400 font-black text-2xl mb-2">{faqItems.length}</div>
              <div className="text-white font-bold uppercase text-sm">ВСЕГО ВОПРОСОВ</div>
            </div>
            <div className="bg-green-900 border-2 border-green-500 p-4 text-center">
              <div className="text-green-400 font-black text-2xl mb-2">{categories.length - 1}</div>
              <div className="text-white font-bold uppercase text-sm">КАТЕГОРИЙ</div>
            </div>
            <div className="bg-purple-900 border-2 border-purple-500 p-4 text-center">
              <div className="text-purple-400 font-black text-2xl mb-2">
                {Math.round(faqItems.reduce((sum, item) => sum + item.views, 0) / faqItems.length)}
              </div>
              <div className="text-white font-bold uppercase text-sm">СРЕДНИХ ПРОСМОТРОВ</div>
            </div>
          </div>
        </div>

        {/* Поиск */}
        <div className="mb-8">
          <div className="bg-black border-4 border-white p-6">
            <label className="block text-white font-black text-sm uppercase tracking-wider mb-4">
              <span className="text-orange-500">🔍</span> ПОИСК ПО ВОПРОСАМ:
            </label>
            
            <div className="relative group">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Введите ключевые слова..."
                className="w-full bg-white border-4 border-black px-4 py-4 font-black text-black
                           focus:outline-none focus:border-orange-500 focus:bg-orange-100
                           hover:bg-gray-100 transition-all duration-300
                           placeholder:text-gray-500 placeholder:font-normal"
              />
              
              {/* Иконка поиска */}
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <span className="text-black text-xl">🔍</span>
              </div>
              
              {/* Декоративный элемент */}
              <div className="absolute top-2 right-12 w-3 h-3 bg-orange-500 opacity-50 group-focus-within:opacity-100 transition-opacity"></div>
            </div>
          </div>
        </div>

        {/* Фильтр по категориям */}
        <div className="mb-8">
          <div className="bg-black border-4 border-white p-6">
            <label className="block text-white font-black text-sm uppercase tracking-wider mb-4">
              <span className="text-orange-500">📂</span> КАТЕГОРИИ:
            </label>
            
            <div className="flex flex-wrap gap-3">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 font-black text-sm uppercase tracking-wider border-4 transition-all duration-300 transform hover:scale-105
                    ${selectedCategory === category
                      ? 'bg-orange-500 border-black text-black'
                      : 'bg-gray-900 border-gray-600 text-white hover:border-orange-500'
                    }`}
                >
                  {category === 'all' ? '📋 ВСЕ' : `${getCategoryIcon(category)} ${category.toUpperCase()}`}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Список FAQ */}
        {filteredFAQ.length === 0 ? (
          <div className="bg-black border-4 border-gray-600 p-12 text-center">
            <div className="text-6xl mb-6">🤔</div>
            <h3 className="text-white font-black text-2xl uppercase tracking-wider mb-4">
              {searchTerm ? 'НИЧЕГО НЕ НАЙДЕНО' : 'FAQ ПОКА НЕ ЗАПОЛНЕН'}
            </h3>
            <p className="text-gray-400 font-bold uppercase">
              {searchTerm ? 'ПОПРОБУЙТЕ ИЗМЕНИТЬ ЗАПРОС' : 'СКОРО ЗДЕСЬ ПОЯВЯТСЯ ОТВЕТЫ'}
            </p>
          </div>
        ) : (
          <div className="space-y-4 mb-8">
            {filteredFAQ.map((item, index) => (
              <div key={item.faq_id} className="bg-black border-4 border-white hover:border-orange-500 transition-colors duration-300 relative group">
                {/* Заголовок вопроса */}
                <div
                  onClick={() => toggleExpanded(item.faq_id)}
                  className={`p-6 cursor-pointer transition-all duration-300 ${
                    expandedItems.has(item.faq_id) ? 'bg-gray-900' : 'bg-black hover:bg-gray-900'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      {/* Номер вопроса */}
                      <div className="bg-orange-500 border-2 border-black w-12 h-12 flex items-center justify-center">
                        <span className="text-black font-black text-lg">{index + 1}</span>
                      </div>
                      
                      <div className="flex-1">
                        <h4 className="text-white font-black text-lg uppercase tracking-wide mb-2">
                          {item.question}
                        </h4>
                        
                        {/* Метаинформация */}
                        <div className="flex items-center gap-4 text-sm">
                          <span className="text-orange-500 font-bold">
                            {getCategoryIcon(item.category)} {item.category}
                          </span>
                          <span className="text-gray-400 font-bold">
                            👁️ {item.views} просмотров
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Кнопка раскрытия */}
                    <div className={`w-12 h-12 border-4 border-orange-500 flex items-center justify-center transition-transform duration-300 ${
                      expandedItems.has(item.faq_id) ? 'rotate-180' : ''
                    }`}>
                      <span className="text-orange-500 font-black text-2xl">
                        {expandedItems.has(item.faq_id) ? '−' : '+'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Ответ */}
                {expandedItems.has(item.faq_id) && (
                  <div className="border-t-4 border-orange-500 bg-gray-900 p-6">
                    <div className="bg-black border-2 border-gray-600 p-4">
                      <div 
                        className="text-gray-300 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: item.answer }}
                        style={{
                          fontSize: '14px',
                          lineHeight: '1.6'
                        }}
                      />
                    </div>
                    
                    {/* Была ли информация полезной */}
                    <div className="mt-4 flex items-center justify-between bg-gray-800 border-2 border-gray-600 p-3">
                      <span className="text-gray-400 font-bold text-sm uppercase">
                        Была ли информация полезной?
                      </span>
                      <div className="flex gap-2">
                        <button className="px-3 py-1 bg-green-600 hover:bg-green-500 text-white font-black text-xs uppercase border-2 border-black transition-colors">
                          👍 ДА
                        </button>
                        <button className="px-3 py-1 bg-red-600 hover:bg-red-500 text-white font-black text-xs uppercase border-2 border-black transition-colors">
                          👎 НЕТ
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Декоративные элементы */}
                <div className="absolute top-2 right-2 w-3 h-3 bg-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            ))}
          </div>
        )}

        {/* Блок "Не нашли ответ" */}
        <div className="bg-black border-4 border-orange-500 p-8">
          <div className="text-center">
            <div className="text-4xl mb-4">🤷‍♂️</div>
            <h3 className="text-white font-black text-2xl uppercase tracking-wider mb-4">
              НЕ НАШЛИ ОТВЕТ НА СВОЙ ВОПРОС?
            </h3>
            <p className="text-gray-300 font-bold mb-6 text-lg">
              Обратитесь в нашу службу поддержки, и мы поможем вам решить любую проблему.
            </p>
            
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <button
                onClick={() => window.location.href = '/support/create-ticket'}
                className="bg-orange-500 border-4 border-black text-black font-black px-8 py-4 text-lg uppercase tracking-wider
                         hover:bg-orange-400 transition-all duration-300 transform hover:scale-105"
              >
                ✉️ СОЗДАТЬ ОБРАЩЕНИЕ
              </button>
              
              <button
                onClick={() => window.location.href = '/support'}
                className="bg-white border-4 border-black text-black font-black px-8 py-4 text-lg uppercase tracking-wider
                         hover:bg-gray-100 transition-all duration-300 transform hover:scale-105"
              >
                📞 ДРУГИЕ СПОСОБЫ СВЯЗИ
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;