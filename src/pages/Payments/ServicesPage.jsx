import React from 'react';
import { usePayments } from '../../hooks/api/usePayments';

const ServicesPage = () => {
  const { services, promoteListing } = usePayments();

  // Mock data для демонстрации
  const mockServices = [
    {
      service_id: 1,
      service_name: 'VIP РАЗМЕЩЕНИЕ',
      description: 'Ваше объявление будет показано в топе результатов поиска',
      price: 2000,
      currency_code: '₸',
      duration_days: 30,
      features: {
        'Показ в топе': 'Первые позиции в поиске',
        'Выделение цветом': 'Оранжевая рамка',
        'Приоритет в рекомендациях': 'Больше просмотров'
      },
      icon: '👑',
      popular: true
    },
    {
      service_id: 2,
      service_name: 'ВЫДЕЛЕННОЕ ОБЪЯВЛЕНИЕ',
      description: 'Выделение цветом в списке результатов поиска',
      price: 1000,
      currency_code: '₸',
      duration_days: 15,
      features: {
        'Цветная рамка': 'Привлекает внимание',
        'Увеличенный размер': '+20% к размеру карточки'
      },
      icon: '🌟',
      popular: false
    },
    {
      service_id: 3,
      service_name: 'ПОДНЯТИЕ В ПОИСКЕ',
      description: 'Обновление даты публикации - объявление поднимается в топ',
      price: 500,
      currency_code: '₸',
      duration_days: 7,
      features: {
        'Обновление даты': 'Как новое объявление',
        'Повышение в выдаче': 'Выше других объявлений'
      },
      icon: '📈',
      popular: false
    },
    {
      service_id: 4,
      service_name: 'СРОЧНАЯ ПРОДАЖА',
      description: 'Отметка "Срочно" привлекает больше покупателей',
      price: 300,
      currency_code: '₸',
      duration_days: 7,
      features: {
        'Красная метка "СРОЧНО"': 'Привлекает внимание',
        'Приоритет в мобильном': 'Показ в специальном разделе'
      },
      icon: '🚨',
      popular: false
    }
  ];

  const handlePurchaseService = async (serviceId, listingId) => {
    try {
      // Mock purchase
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('Услуга успешно приобретена!');
    } catch (error) {
      console.error('Error purchasing service:', error);
      alert('Ошибка при покупке услуги');
    }
  };

  const formatPrice = (price, currency = "₸") => {
    return `${price.toLocaleString()} ${currency}`;
  };

  const handleBuyService = (service) => {
    const listingId = prompt('Введите ID объявления для продвижения:');
    if (listingId && !isNaN(listingId)) {
      handlePurchaseService(service.service_id, parseInt(listingId));
    } else if (listingId) {
      alert('Введите корректный номер ID объявления');
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        {/* Заголовок */}
        <div className="mb-12">
          <div className="bg-black border-4 border-orange-500 p-8 relative">
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-wider text-white text-center mb-4">
              <span className="text-orange-500">УСЛУГИ</span> ПРОДВИЖЕНИЯ
            </h1>
            <div className="w-full h-2 bg-orange-500 mb-4"></div>
            <p className="text-gray-300 font-bold text-center text-lg uppercase tracking-wide">
              УВЕЛИЧЬТЕ КОЛИЧЕСТВО ПРОСМОТРОВ ВАШИХ ОБЪЯВЛЕНИЙ
            </p>
            
            {/* Декоративные элементы */}
            <div className="absolute top-2 left-2 w-6 h-6 border-2 border-orange-500"></div>
            <div className="absolute bottom-2 right-2 w-6 h-6 bg-orange-500"></div>
          </div>
        </div>

        {/* Статистика эффективности */}
        <div className="mb-12 bg-black border-4 border-white p-6">
          <h2 className="text-white font-black text-2xl uppercase tracking-wider mb-6 text-center">
            📊 ЭФФЕКТИВНОСТЬ ПРОДВИЖЕНИЯ
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-green-900 border-2 border-green-500 p-4 text-center">
              <div className="text-green-400 font-black text-3xl mb-2">+150%</div>
              <div className="text-white font-bold uppercase text-sm">БОЛЬШЕ ПРОСМОТРОВ</div>
            </div>
            <div className="bg-blue-900 border-2 border-blue-500 p-4 text-center">
              <div className="text-blue-400 font-black text-3xl mb-2">+80%</div>
              <div className="text-white font-bold uppercase text-sm">БЫСТРЕЕ ПРОДАЖА</div>
            </div>
            <div className="bg-purple-900 border-2 border-purple-500 p-4 text-center">
              <div className="text-purple-400 font-black text-3xl mb-2">+200%</div>
              <div className="text-white font-bold uppercase text-sm">БОЛЬШЕ ЗВОНКОВ</div>
            </div>
          </div>
        </div>

        {/* Сетка услуг */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 mb-12">
          {mockServices.map((service) => (
            <div key={service.service_id} className="bg-black border-4 border-white p-6 relative hover:border-orange-500 transition-colors duration-300 group">
              {/* Популярная метка */}
              {service.popular && (
                <div className="absolute -top-2 -right-2 bg-red-600 border-2 border-black px-3 py-1 transform rotate-12">
                  <span className="text-white font-black text-xs uppercase">ХИТ</span>
                </div>
              )}

              {/* Заголовок услуги */}
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">{service.icon}</span>
                <h3 className="text-white font-black text-xl uppercase tracking-wider">
                  {service.service_name}
                </h3>
              </div>

              {/* Описание */}
              <p className="text-gray-300 font-bold mb-6 text-sm leading-relaxed">
                {service.description}
              </p>

              {/* Цена */}
              <div className="bg-orange-500 border-4 border-black p-4 mb-6 text-center">
                <div className="text-black font-black text-3xl mb-1">
                  {formatPrice(service.price, service.currency_code)}
                </div>
                {service.duration_days && (
                  <div className="text-black font-bold text-sm uppercase">
                    НА {service.duration_days} ДНЕЙ
                  </div>
                )}
              </div>

              {/* Возможности */}
              {service.features && Object.keys(service.features).length > 0 && (
                <div className="mb-6 bg-gray-900 border-2 border-gray-600 p-4">
                  <h4 className="text-orange-500 font-black text-sm uppercase tracking-wider mb-3">
                    ⚡ ВОЗМОЖНОСТИ:
                  </h4>
                  <ul className="space-y-2">
                    {Object.entries(service.features).map(([key, value], index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <span className="text-orange-500 font-black">●</span>
                        <div>
                          <span className="text-white font-bold">{key}:</span>
                          <span className="text-gray-400 ml-1">{value}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Кнопка покупки */}
              <button
                onClick={() => handleBuyService(service)}
                disabled={promoteListing?.isLoading}
                className={`w-full py-4 font-black text-lg uppercase tracking-wider border-4 transition-all duration-300 transform hover:scale-105 active:scale-95
                  ${promoteListing?.isLoading
                    ? 'bg-gray-800 border-gray-600 text-gray-400 cursor-not-allowed'
                    : 'bg-white border-black text-black hover:bg-orange-400 hover:border-orange-500'
                  }`}
              >
                {promoteListing?.isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                    ОБРАБОТКА...
                  </div>
                ) : (
                  <>💎 ПРИОБРЕСТИ</>
                )}
              </button>

              {/* Декоративные элементы */}
              <div className="absolute top-2 right-2 w-3 h-3 bg-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute bottom-2 left-2 w-6 h-1 bg-orange-500"></div>
            </div>
          ))}
        </div>

        {/* Как это работает */}
        <div className="mb-12 bg-black border-4 border-blue-500 p-6">
          <h2 className="text-white font-black text-2xl uppercase tracking-wider mb-6 text-center">
            🔧 КАК ЭТО РАБОТАЕТ
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-black">
                <span className="text-white font-black text-2xl">1</span>
              </div>
              <h4 className="text-blue-400 font-black text-sm uppercase mb-2">ВЫБЕРИТЕ УСЛУГУ</h4>
              <p className="text-gray-400 text-xs">Подберите подходящий тариф продвижения</p>
            </div>
            <div className="text-center">
              <div className="bg-green-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-black">
                <span className="text-white font-black text-2xl">2</span>
              </div>
              <h4 className="text-green-400 font-black text-sm uppercase mb-2">УКАЖИТЕ ID</h4>
              <p className="text-gray-400 text-xs">Введите номер объявления для продвижения</p>
            </div>
            <div className="text-center">
              <div className="bg-yellow-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-black">
                <span className="text-white font-black text-2xl">3</span>
              </div>
              <h4 className="text-yellow-400 font-black text-sm uppercase mb-2">ОПЛАТИТЕ</h4>
              <p className="text-gray-400 text-xs">Безопасная оплата любым способом</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-black">
                <span className="text-white font-black text-2xl">4</span>
              </div>
              <h4 className="text-purple-400 font-black text-sm uppercase mb-2">ПОЛУЧИТЕ РЕЗУЛЬТАТ</h4>
              <p className="text-gray-400 text-xs">Услуга активируется автоматически</p>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="bg-black border-4 border-gray-600 p-6">
          <h2 className="text-white font-black text-2xl uppercase tracking-wider mb-6 text-center">
            ❓ ЧАСТЫЕ ВОПРОСЫ
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-900 border-2 border-gray-600 p-4">
              <h4 className="text-orange-500 font-black text-sm uppercase mb-2">
                Как быстро активируется услуга?
              </h4>
              <p className="text-gray-300 text-xs">
                Услуга активируется автоматически в течение 5 минут после успешной оплаты.
              </p>
            </div>
            <div className="bg-gray-900 border-2 border-gray-600 p-4">
              <h4 className="text-orange-500 font-black text-sm uppercase mb-2">
                Можно ли продлить услугу?
              </h4>
              <p className="text-gray-300 text-xs">
                Да, вы можете продлить или купить дополнительные услуги в любое время.
              </p>
            </div>
            <div className="bg-gray-900 border-2 border-gray-600 p-4">
              <h4 className="text-orange-500 font-black text-sm uppercase mb-2">
                Где найти ID объявления?
              </h4>
              <p className="text-gray-300 text-xs">
                ID объявления указан в адресной строке браузера и в личном кабинете.
              </p>
            </div>
            <div className="bg-gray-900 border-2 border-gray-600 p-4">
              <h4 className="text-orange-500 font-black text-sm uppercase mb-2">
                Возможен ли возврат средств?
              </h4>
              <p className="text-gray-300 text-xs">
                Возврат возможен в течение 24 часов при технических проблемах.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;