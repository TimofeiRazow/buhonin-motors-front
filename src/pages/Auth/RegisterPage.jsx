import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  User, 
  Users, 
  Phone, 
  Mail, 
  Lock, 
  ShieldCheck, 
  UserPlus, 
  AlertTriangle, 
  Check, 
  Loader2 
} from 'lucide-react';
import { useAuth } from '../../hooks/auth/useAuth';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    phone_number: '',
    email: '',
    password: '',
    confirm_password: '',
    first_name: '',
    last_name: '',
    agree_terms: false
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
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

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Некорректный email адрес';
    }

    if (!formData.password) {
      newErrors.password = 'Введите пароль';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Пароль должен содержать минимум 6 символов';
    }

    if (formData.password !== formData.confirm_password) {
      newErrors.confirm_password = 'Пароли не совпадают';
    }

    if (!formData.first_name.trim()) {
      newErrors.first_name = 'Введите имя';
    }

    if (!formData.agree_terms) {
      newErrors.agree_terms = 'Необходимо согласиться с условиями';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const { confirm_password, agree_terms, ...userData } = formData;
      await register(userData);
      navigate('/');
    } catch (error) {
      setErrors({ 
        general: error.response?.data?.message || 'Ошибка регистрации. Попробуйте снова.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <div className="relative w-full max-w-2xl">
        {/* Фоновые декоративные элементы */}
        <div className="absolute -top-10 -left-10 w-20 h-20 border-4 border-orange-600 rotate-45 opacity-20"></div>
        <div className="absolute -top-6 -right-6 w-12 h-12 bg-orange-600 rotate-12 opacity-30"></div>
        <div className="absolute -bottom-8 -left-8 w-8 h-8 bg-white opacity-25"></div>
        <div className="absolute -bottom-12 -right-12 w-16 h-16 border-2 border-white rotate-45 opacity-15"></div>

        {/* Основная форма */}
        <div className="bg-black border-4 border-orange-600 p-8 relative overflow-hidden">
          {/* Геометрические элементы формы */}
          <div className="absolute top-0 left-0 w-full h-2 bg-orange-600"></div>
          <div className="absolute bottom-0 right-0 w-full h-2 bg-white opacity-50"></div>
          <div className="absolute top-6 right-6 w-6 h-6 bg-orange-600 rotate-45"></div>
          <div className="absolute bottom-6 left-6 w-4 h-4 bg-white"></div>

          <div className="relative z-10">
            {/* Заголовок */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-black text-white uppercase tracking-wider mb-4">
                ПРИСОЕДИНЯЙСЯ К
                <span className="block text-orange-500 text-3xl">BUHONIN MOTORS</span>
              </h1>
              <div className="w-20 h-1 bg-orange-600 mx-auto"></div>
            </div>

            {/* Общая ошибка */}
            {errors.general && (
              <div className="bg-red-600 border-2 border-black text-white p-4 mb-6 relative">
                <div className="absolute top-1 left-1 w-2 h-2 bg-black"></div>
                <div className="absolute bottom-1 right-1 w-3 h-0.5 bg-black"></div>
                <p className="font-bold uppercase tracking-wide text-sm flex items-center">
                  <AlertTriangle size={16} className="mr-2" />
                  {errors.general}
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Имя и Фамилия */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="group">
                  <label className="block mb-3 text-white font-black uppercase tracking-wider text-sm">
                    ИМЯ *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleChange}
                      placeholder="ВВЕДИТЕ ИМЯ"
                      className={`
                        w-full p-4 bg-gray-900 text-white font-bold border-2 transition-all duration-300
                        focus:outline-none focus:bg-black placeholder-gray-500
                        ${errors.first_name 
                          ? 'border-red-500 focus:border-red-400' 
                          : 'border-gray-700 focus:border-orange-500 hover:border-gray-600'
                        }
                      `}
                    />
                    <div className={`
                      absolute top-2 left-2 w-2 h-2 transition-colors duration-300
                      ${errors.first_name ? 'bg-red-500' : 'bg-orange-600'}
                    `}></div>
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-orange-500">
                      <User size={18} />
                    </div>
                  </div>
                  {errors.first_name && (
                    <div className="mt-2 text-red-400 font-bold uppercase tracking-wide text-xs flex items-center">
                      <div className="w-2 h-2 bg-red-500 mr-2"></div>
                      {errors.first_name}
                    </div>
                  )}
                </div>

                <div className="group">
                  <label className="block mb-3 text-white font-black uppercase tracking-wider text-sm">
                    ФАМИЛИЯ
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleChange}
                      placeholder="ВВЕДИТЕ ФАМИЛИЮ"
                      className="w-full p-4 bg-gray-900 text-white font-bold border-2 border-gray-700 focus:border-orange-500 hover:border-gray-600 focus:outline-none focus:bg-black placeholder-gray-500 transition-all duration-300"
                    />
                    <div className="absolute top-2 left-2 w-2 h-2 bg-orange-600"></div>
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-orange-500">
                      <Users size={18} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Номер телефона */}
              <div className="group">
                <label className="block mb-3 text-white font-black uppercase tracking-wider text-sm">
                  НОМЕР ТЕЛЕФОНА *
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
                  <div className={`
                    absolute top-2 left-2 w-2 h-2 transition-colors duration-300
                    ${errors.phone_number ? 'bg-red-500' : 'bg-orange-600'}
                  `}></div>
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-orange-500">
                    <Phone size={18} />
                  </div>
                </div>
                {errors.phone_number && (
                  <div className="mt-2 text-red-400 font-bold uppercase tracking-wide text-xs flex items-center">
                    <div className="w-2 h-2 bg-red-500 mr-2"></div>
                    {errors.phone_number}
                  </div>
                )}
              </div>

              {/* Email */}
              <div className="group">
                <label className="block mb-3 text-white font-black uppercase tracking-wider text-sm">
                  EMAIL <span className="text-gray-400">(НЕОБЯЗАТЕЛЬНО)</span>
                </label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="EXAMPLE@MAIL.COM"
                    className={`
                      w-full p-4 bg-gray-900 text-white font-bold border-2 transition-all duration-300
                      focus:outline-none focus:bg-black placeholder-gray-500
                      ${errors.email 
                        ? 'border-red-500 focus:border-red-400' 
                        : 'border-gray-700 focus:border-orange-500 hover:border-gray-600'
                      }
                    `}
                  />
                  <div className={`
                    absolute top-2 left-2 w-2 h-2 transition-colors duration-300
                    ${errors.email ? 'bg-red-500' : 'bg-orange-600'}
                  `}></div>
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-orange-500">
                    <Mail size={18} />
                  </div>
                </div>
                {errors.email && (
                  <div className="mt-2 text-red-400 font-bold uppercase tracking-wide text-xs flex items-center">
                    <div className="w-2 h-2 bg-red-500 mr-2"></div>
                    {errors.email}
                  </div>
                )}
              </div>

              {/* Пароли */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="group">
                  <label className="block mb-3 text-white font-black uppercase tracking-wider text-sm">
                    ПАРОЛЬ *
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="МИНИМУМ 6 СИМВОЛОВ"
                      className={`
                        w-full p-4 bg-gray-900 text-white font-bold border-2 transition-all duration-300
                        focus:outline-none focus:bg-black placeholder-gray-500
                        ${errors.password 
                          ? 'border-red-500 focus:border-red-400' 
                          : 'border-gray-700 focus:border-orange-500 hover:border-gray-600'
                        }
                      `}
                    />
                    <div className={`
                      absolute top-2 left-2 w-2 h-2 transition-colors duration-300
                      ${errors.password ? 'bg-red-500' : 'bg-orange-600'}
                    `}></div>
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-orange-500">
                      <Lock size={18} />
                    </div>
                  </div>
                  {errors.password && (
                    <div className="mt-2 text-red-400 font-bold uppercase tracking-wide text-xs flex items-center">
                      <div className="w-2 h-2 bg-red-500 mr-2"></div>
                      {errors.password}
                    </div>
                  )}
                </div>

                <div className="group">
                  <label className="block mb-3 text-white font-black uppercase tracking-wider text-sm">
                    ПОДТВЕРДИТЕ ПАРОЛЬ *
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      name="confirm_password"
                      value={formData.confirm_password}
                      onChange={handleChange}
                      placeholder="ПОВТОРИТЕ ПАРОЛЬ"
                      className={`
                        w-full p-4 bg-gray-900 text-white font-bold border-2 transition-all duration-300
                        focus:outline-none focus:bg-black placeholder-gray-500
                        ${errors.confirm_password 
                          ? 'border-red-500 focus:border-red-400' 
                          : 'border-gray-700 focus:border-orange-500 hover:border-gray-600'
                        }
                      `}
                    />
                    <div className={`
                      absolute top-2 left-2 w-2 h-2 transition-colors duration-300
                      ${errors.confirm_password ? 'bg-red-500' : 'bg-orange-600'}
                    `}></div>
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-orange-500">
                      <ShieldCheck size={18} />
                    </div>
                  </div>
                  {errors.confirm_password && (
                    <div className="mt-2 text-red-400 font-bold uppercase tracking-wide text-xs flex items-center">
                      <div className="w-2 h-2 bg-red-500 mr-2"></div>
                      {errors.confirm_password}
                    </div>
                  )}
                </div>
              </div>

              {/* Согласие с условиями */}
              <div className="group">
                <label className="flex items-start gap-4 cursor-pointer p-4 bg-gray-900 border-2 border-gray-700 hover:border-orange-500 transition-colors duration-300">
                  <div className="relative mt-1">
                    <input
                      type="checkbox"
                      name="agree_terms"
                      checked={formData.agree_terms}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <div className={`w-6 h-6 border-2 flex items-center justify-center transition-colors duration-300 ${
                      formData.agree_terms 
                        ? 'bg-orange-600 border-orange-600' 
                        : 'bg-gray-800 border-gray-600'
                    }`}>
                      {formData.agree_terms && (
                        <Check size={14} className="text-black font-black" />
                      )}
                    </div>
                  </div>
                  <span className="text-gray-300 font-bold text-sm leading-relaxed">
                    Я СОГЛАСЕН С{' '}
                    <a href="/terms" target="_blank" className="text-orange-500 hover:text-orange-400 underline">
                      УСЛОВИЯМИ ИСПОЛЬЗОВАНИЯ
                    </a>
                    {' '}И{' '}
                    <a href="/privacy" target="_blank" className="text-orange-500 hover:text-orange-400 underline">
                      ПОЛИТИКОЙ КОНФИДЕНЦИАЛЬНОСТИ
                    </a>
                  </span>
                </label>
                {errors.agree_terms && (
                  <div className="mt-2 text-red-400 font-bold uppercase tracking-wide text-xs flex items-center">
                    <div className="w-2 h-2 bg-red-500 mr-2"></div>
                    {errors.agree_terms}
                  </div>
                )}
              </div>

              {/* Кнопка регистрации */}
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
                      <Loader2 size={20} className="animate-spin mr-3" />
                      РЕГИСТРАЦИЯ...
                    </>
                  ) : (
                    <>
                      <UserPlus size={20} className="mr-3" />
                      ЗАРЕГИСТРИРОВАТЬСЯ
                    </>
                  )}
                </span>
                
                {!isLoading && (
                  <>
                    <div className="absolute top-1 left-1 w-3 h-3 bg-black group-hover:bg-orange-600 transition-colors"></div>
                    <div className="absolute bottom-1 right-1 w-4 h-0.5 bg-black group-hover:bg-orange-600 transition-colors"></div>
                  </>
                )}
              </button>
            </form>

            {/* Разделитель */}
            <div className="relative my-8">
              <div className="h-px bg-gray-800"></div>
              <div className="absolute top-0 left-1/4 w-12 h-px bg-orange-600"></div>
              <div className="absolute top-0 right-1/4 w-16 h-px bg-white opacity-50"></div>
            </div>

            {/* Вход */}
            <div className="text-center">
              <p className="text-gray-400 font-bold uppercase tracking-wide text-sm mb-4">
                УЖЕ ЕСТЬ АККАУНТ?
              </p>
              <Link 
                to="/login"
                className="group relative inline-block bg-gray-900 hover:bg-orange-600 text-white hover:text-black font-black px-8 py-3 border-2 border-orange-600 hover:border-black uppercase tracking-wider text-sm transition-all duration-300 transform hover:scale-105 no-underline"
              >
                <span className="relative">ВОЙТИ</span>
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

export default RegisterPage;