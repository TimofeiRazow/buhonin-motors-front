import React, { useState } from 'react';
import { useRegister } from '../../hooks/auth/useRegister';

const RegisterForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    phone_number: '',
    email: '',
    password: '',
    confirmPassword: '',
    first_name: '',
    last_name: ''
  });
  const { register, loading, error } = useRegister();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert('Пароли не совпадают');
      return;
    }

    try {
      const { confirmPassword, ...registerData } = formData;
      await register(registerData);
      onSuccess?.();
    } catch (err) {
      console.error('Registration failed:', err);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const fields = [
    { name: 'first_name', label: 'ИМЯ', type: 'text', required: true, icon: '👤' },
    { name: 'last_name', label: 'ФАМИЛИЯ', type: 'text', required: true, icon: '👤' },
    { name: 'phone_number', label: 'НОМЕР ТЕЛЕФОНА', type: 'tel', required: true, icon: '📱', placeholder: '+7 (xxx) xxx-xx-xx' },
    { name: 'email', label: 'EMAIL', type: 'email', required: false, icon: '📧', placeholder: 'example@mail.com' },
    { name: 'password', label: 'ПАРОЛЬ', type: 'password', required: true, icon: '🔒' },
    { name: 'confirmPassword', label: 'ПОДТВЕРДИТЕ ПАРОЛЬ', type: 'password', required: true, icon: '🔒' }
  ];

  return (
    <div className="bg-black border-4 border-orange-500 p-8 relative">
      {/* Заголовок */}
      <div className="mb-8 text-center">
        <h2 className="text-3xl md:text-4xl font-black uppercase tracking-wider text-white mb-4">
          <span className="text-orange-500">РЕГИСТРАЦИЯ</span>
        </h2>
        <div className="w-full h-1 bg-orange-500 mb-4"></div>
        <p className="text-gray-300 font-bold text-sm uppercase">
          СОЗДАЙТЕ АККАУНТ ДЛЯ ПРОДАЖИ АВТОМОБИЛЕЙ
        </p>
      </div>

      <div className="space-y-6">
        {/* Поля формы */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {fields.map((field) => (
            <div key={field.name} className={field.name === 'email' ? 'md:col-span-2' : ''}>
              <label className="block text-white font-black text-sm uppercase tracking-wider mb-3">
                <span className="text-orange-500">{field.icon}</span> {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              
              <div className="relative group">
                <input
                  type={field.type}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  required={field.required}
                  className="w-full bg-white border-4 border-black px-4 py-4 font-black text-black uppercase tracking-wide
                             focus:outline-none focus:border-orange-500 focus:bg-orange-100
                             hover:bg-gray-100 transition-all duration-300
                             placeholder:text-gray-500 placeholder:normal-case"
                />
                
                {/* Декоративный элемент */}
                <div className="absolute top-2 right-2 w-3 h-3 bg-orange-500 opacity-50 group-focus-within:opacity-100 transition-opacity"></div>
              </div>

              {/* Валидация для паролей */}
              {field.name === 'confirmPassword' && formData.password && formData.confirmPassword && (
                <div className={`mt-2 p-2 border-2 ${
                  formData.password === formData.confirmPassword 
                    ? 'border-green-500 bg-green-900/20' 
                    : 'border-red-500 bg-red-900/20'
                }`}>
                  <span className={`font-bold text-sm uppercase ${
                    formData.password === formData.confirmPassword ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {formData.password === formData.confirmPassword ? '✓ ПАРОЛИ СОВПАДАЮТ' : '✗ ПАРОЛИ НЕ СОВПАДАЮТ'}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Ошибка */}
        {error && (
          <div className="bg-red-900 border-4 border-red-500 p-4">
            <div className="flex items-center gap-3">
              <span className="text-red-500 text-xl">⚠</span>
              <span className="text-red-300 font-bold uppercase">{error}</span>
            </div>
          </div>
        )}

        {/* Прогресс заполнения */}
        <div className="bg-gray-900 border-2 border-white p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white font-black text-sm uppercase tracking-wider">
              ПРОГРЕСС ЗАПОЛНЕНИЯ:
            </span>
            <span className="text-orange-500 font-black text-sm">
              {Math.round((Object.values(formData).filter(v => v !== '').length / Object.keys(formData).length) * 100)}%
            </span>
          </div>
          <div className="w-full bg-black border-2 border-gray-600 h-3">
            <div 
              className="h-full bg-orange-500 transition-all duration-500"
              style={{
                width: `${(Object.values(formData).filter(v => v !== '').length / Object.keys(formData).length) * 100}%`
              }}
            ></div>
          </div>
        </div>

        {/* Кнопка отправки */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`w-full py-6 font-black text-xl uppercase tracking-wider border-4 transition-all duration-300 transform
            ${loading 
              ? 'bg-gray-800 border-gray-600 text-gray-400 cursor-not-allowed' 
              : 'bg-orange-500 border-black text-black hover:bg-orange-400 hover:scale-105 active:scale-95'
            }`}
        >
          {loading ? (
            <div className="flex items-center justify-center gap-3">
              <div className="w-6 h-6 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
              РЕГИСТРИРУЕМСЯ...
            </div>
          ) : (
            <>🚀 ЗАРЕГИСТРИРОВАТЬСЯ</>
          )}
        </button>

        {/* Информация о конфиденциальности */}
        <div className="bg-gray-900 border-2 border-gray-600 p-4">
          <div className="flex items-start gap-3">
            <span className="text-orange-500 text-lg">🔒</span>
            <div className="text-gray-300 text-sm">
              <p className="font-bold uppercase mb-1">ВАШИ ДАННЫЕ ЗАЩИЩЕНЫ</p>
              <p className="text-xs normal-case">
                Регистрируясь, вы соглашаетесь с условиями использования и политикой конфиденциальности
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Декоративные элементы */}
      <div className="absolute top-2 left-2 w-6 h-6 border-2 border-orange-500"></div>
      <div className="absolute bottom-2 right-2 w-6 h-6 bg-orange-500"></div>
    </div>
  );
};

export default RegisterForm;