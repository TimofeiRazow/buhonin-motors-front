import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/auth/useAuth';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    phone_number: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Очищаем ошибку при изменении поля
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.phone_number.trim()) {
      newErrors.phone_number = 'Введите номер телефона';
    } else if (!/^\+?[0-9\s\-\(\)]{10,}$/.test(formData.phone_number)) {
      newErrors.phone_number = 'Некорректный номер телефона';
    }

    if (!formData.password) {
      newErrors.password = 'Введите пароль';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Пароль должен содержать минимум 6 символов';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await login(formData);
      navigate(from, { replace: true });
    } catch (error) {
      setErrors({ 
        general: error.response?.data?.message || 'Ошибка входа. Проверьте данные и попробуйте снова.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <div className="relative w-full max-w-md">
        {/* Фоновые декоративные элементы */}
        <div className="absolute -top-8 -left-8 w-16 h-16 border-4 border-orange-600 rotate-45 opacity-30"></div>
        <div className="absolute -top-4 -right-4 w-8 h-8 bg-orange-600 rotate-12 opacity-40"></div>
        <div className="absolute -bottom-6 -left-6 w-6 h-6 bg-white opacity-30"></div>
        <div className="absolute -bottom-8 -right-8 w-12 h-12 border-2 border-white rotate-45 opacity-20"></div>

        {/* Основная форма */}
        <div className="bg-black border-4 border-orange-600 p-8 relative overflow-hidden">
          {/* Геометрические элементы формы */}
          <div className="absolute top-0 left-0 w-full h-2 bg-orange-600"></div>
          <div className="absolute bottom-0 right-0 w-full h-2 bg-white opacity-50"></div>
          <div className="absolute top-4 right-4 w-4 h-4 bg-orange-600 rotate-45"></div>
          <div className="absolute bottom-4 left-4 w-3 h-3 bg-white"></div>

          <div className="relative z-10">
            {/* Заголовок */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-black text-white uppercase tracking-wider mb-4">
                ВХОД В
                <span className="block text-orange-500 text-3xl">СИСТЕМУ</span>
              </h1>
              <div className="w-16 h-1 bg-orange-600 mx-auto"></div>
            </div>

            {/* Общая ошибка */}
            {errors.general && (
              <div className="bg-red-600 border-2 border-black text-white p-4 mb-6 relative">
                <div className="absolute top-1 left-1 w-2 h-2 bg-black"></div>
                <div className="absolute bottom-1 right-1 w-3 h-0.5 bg-black"></div>
                <p className="font-bold uppercase tracking-wide text-sm">
                  ⚠️ {errors.general}
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Поле номера телефона */}
              <div className="group">
                <label className="block mb-3 text-white font-black uppercase tracking-wider text-sm">
                  НОМЕР ТЕЛЕФОНА
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleChange}
                    placeholder="+7 (777) 123-45-67"
                    className={`
                      w-full p-4 bg-gray-900 text-white font-bold border-2 transition-all duration-300
                      focus:outline-none focus:bg-black placeholder-gray-500
                      ${errors.phone_number 
                        ? 'border-red-500 focus:border-red-400' 
                        : 'border-gray-700 focus:border-orange-500 hover:border-gray-600'
                      }
                    `}
                  />
                  {/* Декоративные элементы */}
                  <div className={`
                    absolute top-2 left-2 w-2 h-2 transition-colors duration-300
                    ${errors.phone_number ? 'bg-red-500' : 'bg-orange-600'}
                  `}></div>
                  {/* Иконка телефона */}
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-orange-500">
                    📱
                  </div>
                </div>
                {errors.phone_number && (
                  <div className="mt-2 text-red-400 font-bold uppercase tracking-wide text-xs flex items-center">
                    <div className="w-2 h-2 bg-red-500 mr-2"></div>
                    {errors.phone_number}
                  </div>
                )}
              </div>

              {/* Поле пароля */}
              <div className="group">
                <label className="block mb-3 text-white font-black uppercase tracking-wider text-sm">
                  ПАРОЛЬ
                </label>
                <div className="relative">
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="ВВЕДИТЕ ПАРОЛЬ"
                    className={`
                      w-full p-4 bg-gray-900 text-white font-bold border-2 transition-all duration-300
                      focus:outline-none focus:bg-black placeholder-gray-500
                      ${errors.password 
                        ? 'border-red-500 focus:border-red-400' 
                        : 'border-gray-700 focus:border-orange-500 hover:border-gray-600'
                      }
                    `}
                  />
                  {/* Декоративные элементы */}
                  <div className={`
                    absolute top-2 left-2 w-2 h-2 transition-colors duration-300
                    ${errors.password ? 'bg-red-500' : 'bg-orange-600'}
                  `}></div>
                  {/* Иконка замка */}
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-orange-500">
                    🔒
                  </div>
                </div>
                {errors.password && (
                  <div className="mt-2 text-red-400 font-bold uppercase tracking-wide text-xs flex items-center">
                    <div className="w-2 h-2 bg-red-500 mr-2"></div>
                    {errors.password}
                  </div>
                )}
              </div>

              {/* Кнопка входа */}
              <button
                type="submit"
                disabled={isLoading}
                className={`
                  group relative w-full p-4 font-black uppercase tracking-wider text-lg
                  transition-all duration-300 transform border-2
                  ${isLoading
                    ? 'bg-gray-600 border-gray-500 text-gray-300 cursor-not-allowed'
                    : 'bg-orange-600 hover:bg-white text-black hover:text-black border-black hover:border-orange-600 hover:scale-105'
                  }
                `}
              >
                <span className="relative flex items-center justify-center">
                  {isLoading ? (
                    <>
                      <div className="loading-spinner w-5 h-5 mr-3"></div>
                      ВХОД...
                    </>
                  ) : (
                    <>
                      🚀 ВОЙТИ
                    </>
                  )}
                </span>
                
                {!isLoading && (
                  <>
                    {/* Декоративные элементы кнопки */}
                    <div className="absolute top-1 left-1 w-3 h-3 bg-black group-hover:bg-orange-600 transition-colors"></div>
                    <div className="absolute bottom-1 right-1 w-4 h-0.5 bg-black group-hover:bg-orange-600 transition-colors"></div>
                  </>
                )}
              </button>
            </form>

            {/* Ссылка "Забыли пароль?" */}
            <div className="text-center mt-6">
              <Link 
                to="/reset-password"
                className="group inline-flex items-center text-gray-400 hover:text-orange-500 no-underline font-bold uppercase tracking-wider text-sm transition-all duration-300"
              >
                <div className="w-2 h-2 bg-orange-600 mr-3 group-hover:bg-white transition-colors"></div>
                🔑 ЗАБЫЛИ ПАРОЛЬ?
              </Link>
            </div>

            {/* Разделитель */}
            <div className="relative my-8">
              <div className="h-px bg-gray-800"></div>
              <div className="absolute top-0 left-1/4 w-8 h-px bg-orange-600"></div>
              <div className="absolute top-0 right-1/4 w-12 h-px bg-white opacity-50"></div>
            </div>

            {/* Регистрация */}
            <div className="text-center">
              <p className="text-gray-400 font-bold uppercase tracking-wide text-sm mb-4">
                НЕТ АККАУНТА?
              </p>
              <Link 
                to="/register"
                className="group relative inline-block bg-gray-900 hover:bg-orange-600 text-white hover:text-black font-black px-8 py-3 border-2 border-orange-600 hover:border-black uppercase tracking-wider text-sm transition-all duration-300 transform hover:scale-105 no-underline"
              >
                <span className="relative">ЗАРЕГИСТРИРОВАТЬСЯ</span>
                <div className="absolute top-1 right-1 w-2 h-2 bg-orange-600 group-hover:bg-black transition-colors"></div>
                <div className="absolute bottom-1 left-1 w-3 h-0.5 bg-orange-600 group-hover:bg-black transition-colors"></div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;