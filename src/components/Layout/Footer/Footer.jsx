import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="relative bg-black border-t-4 border-orange-600 pt-16 pb-8 mt-auto overflow-hidden">
      {/* Геометрические фоновые элементы */}
      <div className="absolute top-0 left-0 w-full h-2 bg-orange-600"></div>
      <div className="absolute top-4 right-10 w-8 h-8 bg-orange-600 rotate-45"></div>
      <div className="absolute top-12 left-20 w-4 h-4 border-2 border-white rotate-45"></div>
      <div className="absolute bottom-20 right-1/4 w-6 h-6 bg-gray-800 rotate-12"></div>
      
      {/* Вертикальные разделители */}
      <div className="absolute top-0 left-1/4 w-px h-full bg-gray-800 opacity-30"></div>
      <div className="absolute top-0 left-2/4 w-px h-full bg-gray-800 opacity-30"></div>
      <div className="absolute top-0 left-3/4 w-px h-full bg-gray-800 opacity-30"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          
          {/* О компании */}
          <div className="relative">
            <div className="mb-6">
              <h3 className="text-3xl font-black text-white uppercase tracking-wider mb-4 relative">
                BUHONIN
                <span className="block text-orange-500 text-2xl">MOTORS</span>
                <div className="absolute -bottom-2 left-0 w-16 h-1 bg-orange-600"></div>
              </h3>
              <p className="text-gray-300 font-bold text-sm leading-relaxed uppercase tracking-wide">
                КРУПНЕЙШИЙ АВТОМОБИЛЬНЫЙ ПОРТАЛ КАЗАХСТАНА. 
                <span className="text-orange-500"> ПОКУПКА И ПРОДАЖА </span>
                АВТОМОБИЛЕЙ, ЗАПЧАСТЕЙ И АКСЕССУАРОВ.
              </p>
            </div>
            {/* Декоративный элемент */}
            <div className="absolute top-2 right-0 w-3 h-3 bg-orange-600"></div>
          </div>

          {/* Покупателям */}
          <div className="relative">
            <h4 className="text-xl font-black text-white uppercase tracking-wider mb-6 relative">
              ПОКУПАТЕЛЯМ
              <div className="absolute -bottom-2 left-0 w-12 h-1 bg-orange-600"></div>
            </h4>
            <ul className="space-y-3">
              <li className="group">
                <Link 
                  to="/search" 
                  className="flex items-center text-gray-400 hover:text-orange-500 no-underline font-bold uppercase tracking-wide text-sm transition-all duration-300 transform hover:translate-x-2"
                >
                  <div className="w-2 h-2 bg-orange-600 mr-3 group-hover:bg-white transition-colors"></div>
                  ПОИСК АВТОМОБИЛЕЙ
                </Link>
              </li>
              <li className="group">
                <Link 
                  to="/favorites" 
                  className="flex items-center text-gray-400 hover:text-orange-500 no-underline font-bold uppercase tracking-wide text-sm transition-all duration-300 transform hover:translate-x-2"
                >
                  <div className="w-2 h-2 bg-orange-600 mr-3 group-hover:bg-white transition-colors"></div>
                  ИЗБРАННОЕ
                </Link>
              </li>
              <li className="group">
                <Link 
                  to="/support" 
                  className="flex items-center text-gray-400 hover:text-orange-500 no-underline font-bold uppercase tracking-wide text-sm transition-all duration-300 transform hover:translate-x-2"
                >
                  <div className="w-2 h-2 bg-orange-600 mr-3 group-hover:bg-white transition-colors"></div>
                  ПОМОЩЬ ПОКУПАТЕЛЯМ
                </Link>
              </li>
            </ul>
            {/* Декоративный элемент */}
            <div className="absolute top-2 right-0 w-2 h-2 bg-white"></div>
          </div>

          {/* Продавцам */}
          <div className="relative">
            <h4 className="text-xl font-black text-white uppercase tracking-wider mb-6 relative">
              ПРОДАВЦАМ
              <div className="absolute -bottom-2 left-0 w-12 h-1 bg-orange-600"></div>
            </h4>
            <ul className="space-y-3">
              <li className="group">
                <Link 
                  to="/create-listing" 
                  className="flex items-center text-gray-400 hover:text-orange-500 no-underline font-bold uppercase tracking-wide text-sm transition-all duration-300 transform hover:translate-x-2"
                >
                  <div className="w-2 h-2 bg-orange-600 mr-3 group-hover:bg-white transition-colors"></div>
                  ПОДАТЬ ОБЪЯВЛЕНИЕ
                </Link>
              </li>
              <li className="group">
                <Link 
                  to="/services" 
                  className="flex items-center text-gray-400 hover:text-orange-500 no-underline font-bold uppercase tracking-wide text-sm transition-all duration-300 transform hover:translate-x-2"
                >
                  <div className="w-2 h-2 bg-orange-600 mr-3 group-hover:bg-white transition-colors"></div>
                  УСЛУГИ ПРОДВИЖЕНИЯ
                </Link>
              </li>
              <li className="group">
                <Link 
                  to="/support" 
                  className="flex items-center text-gray-400 hover:text-orange-500 no-underline font-bold uppercase tracking-wide text-sm transition-all duration-300 transform hover:translate-x-2"
                >
                  <div className="w-2 h-2 bg-orange-600 mr-3 group-hover:bg-white transition-colors"></div>
                  ПОМОЩЬ ПРОДАВЦАМ
                </Link>
              </li>
            </ul>
            {/* Декоративный элемент */}
            <div className="absolute top-2 right-0 w-2 h-2 bg-white"></div>
          </div>

          {/* Поддержка */}
          <div className="relative">
            <h4 className="text-xl font-black text-white uppercase tracking-wider mb-6 relative">
              ПОДДЕРЖКА
              <div className="absolute -bottom-2 left-0 w-12 h-1 bg-orange-600"></div>
            </h4>
            <ul className="space-y-3">
              <li className="group">
                <Link 
                  to="/support" 
                  className="flex items-center text-gray-400 hover:text-orange-500 no-underline font-bold uppercase tracking-wide text-sm transition-all duration-300 transform hover:translate-x-2"
                >
                  <div className="w-2 h-2 bg-orange-600 mr-3 group-hover:bg-white transition-colors"></div>
                  ЦЕНТР ПОДДЕРЖКИ
                </Link>
              </li>
              <li className="group">
                <a 
                  href="tel:+77273000000" 
                  className="flex items-center text-gray-400 hover:text-orange-500 no-underline font-bold uppercase tracking-wide text-sm transition-all duration-300 transform hover:translate-x-2"
                >
                  <div className="w-2 h-2 bg-orange-600 mr-3 group-hover:bg-white transition-colors"></div>
                  <Phone size={16} className="mr-2" /> +7 (727) 300-00-00
                </a>
              </li>
              <li className="group">
                <a 
                  href="mailto:support@buhoninmotors.kz" 
                  className="flex items-center text-gray-400 hover:text-orange-500 no-underline font-bold uppercase tracking-wide text-sm transition-all duration-300 transform hover:translate-x-2"
                >
                  <div className="w-2 h-2 bg-orange-600 mr-3 group-hover:bg-white transition-colors"></div>
                  <Mail size={16} className="mr-2" /> SUPPORT@BUHONINMOTORS.KZ
                </a>
              </li>
            </ul>
            {/* Декоративный элемент */}
            <div className="absolute top-2 right-0 w-2 h-2 bg-white"></div>
          </div>
        </div>

        {/* Нижняя секция с копирайтом */}
        <div className="relative mt-16 pt-8 border-t-2 border-gray-800">
          {/* Геометрические элементы в нижней секции */}
          <div className="absolute top-0 left-1/4 w-8 h-0.5 bg-orange-600"></div>
          <div className="absolute top-0 right-1/4 w-12 h-0.5 bg-white"></div>
          
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-center md:text-left mb-4 md:mb-0">
              <p className="text-gray-400 font-black uppercase tracking-wider text-sm">
                &copy; 2024 
                <span className="text-orange-500 mx-2">BUHONIN MOTORS</span>
                ВСЕ ПРАВА ЗАЩИЩЕНЫ
              </p>
            </div>
            
            {/* Дополнительные ссылки */}
            <div className="flex items-center gap-6">
              <Link 
                to="/privacy" 
                className="text-gray-500 hover:text-orange-500 no-underline font-bold uppercase tracking-wider text-xs transition-colors duration-300"
              >
                КОНФИДЕНЦИАЛЬНОСТЬ
              </Link>
              <Link 
                to="/terms" 
                className="text-gray-500 hover:text-orange-500 no-underline font-bold uppercase tracking-wider text-xs transition-colors duration-300"
              >
                УСЛОВИЯ
              </Link>
              <div className="w-8 h-8 bg-orange-600 border-2 border-black flex items-center justify-center">
                <span className="text-black font-black text-xs">BM</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Дополнительные декоративные элементы внизу */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-orange-600 via-white to-orange-600"></div>
      <div className="absolute bottom-2 left-8 w-6 h-0.5 bg-orange-600"></div>
      <div className="absolute bottom-2 right-12 w-4 h-4 border border-orange-600 rotate-45"></div>
    </footer>
  );
};

export default Footer;