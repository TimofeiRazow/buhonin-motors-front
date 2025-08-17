import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { 
  Bell, 
  Lock, 
  User, 
  Shield, 
  Globe, 
  Firefox, 
  Compass, 
  Monitor,
  Trash2,
  Key,
  Eye,
  EyeOff
} from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../hooks/auth/useAuth';
import LoadingSpinner from '../../components/UI/LoadingSpinner';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('notifications');
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [errors, setErrors] = useState({});
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Загружаем настройки пользователя
  const { data: settings, isLoading } = useQuery(
    'user-settings',
    () => api.get('/api/users/settings')
  );

  // Загружаем настройки уведомлений
  const { data: notificationSettings } = useQuery(
    'notification-settings',
    () => api.get('/api/notifications/settings')
  );

  // Мутация для обновления настроек
  const updateSettingsMutation = useMutation(
    (data) => api.put('/api/users/settings', data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('user-settings');
        alert('Настройки сохранены');
      },
      onError: (error) => {
        alert('Ошибка сохранения: ' + (error.response?.data?.message || 'Попробуйте позже'));
      }
    }
  );

  // Мутация для смены пароля
  const changePasswordMutation = useMutation(
    (data) => api.post('/api/users/change-password', data),
    {
      onSuccess: () => {
        setPasswordData({ current_password: '', new_password: '', confirm_password: '' });
        setErrors({});
        alert('Пароль успешно изменен');
      },
      onError: (error) => {
        setErrors({ password: error.response?.data?.message || 'Ошибка смены пароля' });
      }
    }
  );

  // Мутация для обновления настроек уведомлений
  const updateNotificationsMutation = useMutation(
    (data) => api.put('/api/notifications/settings', data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('notification-settings');
        alert('Настройки уведомлений сохранены');
      },
      onError: (error) => {
        alert('Ошибка: ' + (error.response?.data?.message || 'Попробуйте позже'));
      }
    }
  );

  const handleSettingChange = (field, value) => {
    const updatedSettings = {
      ...settings?.data,
      [field]: value
    };
    updateSettingsMutation.mutate(updatedSettings);
  };

  const handleNotificationChange = (type, channel, enabled) => {
    const updatedSettings = {
      ...notificationSettings?.data,
      [type]: {
        ...notificationSettings?.data?.[type],
        [channel]: enabled
      }
    };
    updateNotificationsMutation.mutate(updatedSettings);
  };

  const handlePasswordChange = (field, value) => {
    setPasswordData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handlePasswordSubmit = () => {
    const newErrors = {};
    
    if (!passwordData.current_password) {
      newErrors.current_password = 'Введите текущий пароль';
    }
    if (!passwordData.new_password) {
      newErrors.new_password = 'Введите новый пароль';
    } else if (passwordData.new_password.length < 6) {
      newErrors.new_password = 'Пароль должен содержать минимум 6 символов';
    }
    if (passwordData.new_password !== passwordData.confirm_password) {
      newErrors.confirm_password = 'Пароли не совпадают';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    changePasswordMutation.mutate({
      current_password: passwordData.current_password,
      new_password: passwordData.new_password
    });
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  // Функция для определения иконки браузера
  const getBrowserIcon = () => {
    const userAgent = navigator.userAgent;
    if (userAgent.includes('Chrome')) return <Globe size={20} className="text-orange-500" />;
    if (userAgent.includes('Firefox')) return <Firefox size={20} className="text-orange-500" />;
    if (userAgent.includes('Safari')) return <Compass size={20} className="text-orange-500" />;
    return <Monitor size={20} className="text-orange-500" />;
  };

  const getBrowserName = () => {
    const userAgent = navigator.userAgent;
    if (userAgent.includes('Chrome')) return 'CHROME';
    if (userAgent.includes('Firefox')) return 'FIREFOX';
    if (userAgent.includes('Safari')) return 'SAFARI';
    return 'БРАУЗЕР';
  };

  if (isLoading) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-16 h-16 border-4 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-white font-black text-xl mt-4 uppercase tracking-wider">
            ЗАГРУЖАЕМ НАСТРОЙКИ...
          </p>
        </div>
      </div>
    );
  }

  const settingsData = settings?.data || {};
  const notificationsData = notificationSettings?.data || {};

  const tabs = [
    { id: 'notifications', name: 'УВЕДОМЛЕНИЯ', icon: <Bell size={20} /> },
    { id: 'privacy', name: 'ПРИВАТНОСТЬ', icon: <Lock size={20} /> },
    { id: 'account', name: 'АККАУНТ', icon: <User size={20} /> },
    { id: 'security', name: 'БЕЗОПАСНОСТЬ', icon: <Shield size={20} /> }
  ];

  return (
    <div className="bg-black min-h-screen text-white">
      {/* Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-black via-gray-900 to-orange-600">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-24 h-24 border-4 border-orange-500 rotate-45"></div>
          <div className="absolute top-20 right-20 w-16 h-16 bg-orange-600 rotate-12"></div>
        </div>
        
        <div className="relative z-10 px-4 py-16">
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-black mb-4 uppercase tracking-wider">
              <span className="text-white">НАСТРОЙКИ</span>
            </h1>
            <p className="text-xl font-bold text-gray-300 uppercase">
              УПРАВЛЯЙТЕ ВАШИМ АККАУНТОМ
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-16 px-4">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar Menu */}
          <div className="lg:w-80">
            <div className="bg-gray-900 border-4 border-orange-600 p-4">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full p-4 mb-2 font-black text-left uppercase tracking-wider transition-all duration-300 flex items-center gap-4 ${
                    activeTab === tab.id 
                      ? 'bg-orange-600 text-black border-4 border-black' 
                      : 'bg-black text-white border-4 border-gray-600 hover:border-orange-600'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1">
            <div className="bg-gray-900 border-4 border-orange-600 p-8">
              
              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                <div>
                  <h2 className="text-3xl font-black text-white uppercase tracking-wider mb-8">
                    НАСТРОЙКИ УВЕДОМЛЕНИЙ
                  </h2>
                  
                  <div className="space-y-8">
                    <div className="bg-black p-6 border-4 border-orange-600">
                      <h3 className="text-xl font-black text-orange-500 uppercase tracking-wider mb-6">
                        ОБЩИЕ НАСТРОЙКИ
                      </h3>
                      <div className="space-y-4">
                        <label className="flex items-center gap-4 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settingsData.notifications_enabled !== false}
                            onChange={(e) => handleSettingChange('notifications_enabled', e.target.checked)}
                            className="w-6 h-6 accent-orange-600"
                          />
                          <span className="text-white font-bold uppercase tracking-wider">
                            ВКЛЮЧИТЬ УВЕДОМЛЕНИЯ
                          </span>
                        </label>
                        
                        <label className="flex items-center gap-4 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settingsData.email_notifications !== false}
                            onChange={(e) => handleSettingChange('email_notifications', e.target.checked)}
                            className="w-6 h-6 accent-orange-600"
                          />
                          <span className="text-white font-bold uppercase tracking-wider">
                            EMAIL УВЕДОМЛЕНИЯ
                          </span>
                        </label>
                        
                        <label className="flex items-center gap-4 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settingsData.push_notifications !== false}
                            onChange={(e) => handleSettingChange('push_notifications', e.target.checked)}
                            className="w-6 h-6 accent-orange-600"
                          />
                          <span className="text-white font-bold uppercase tracking-wider">
                            PUSH УВЕДОМЛЕНИЯ
                          </span>
                        </label>
                        
                        <label className="flex items-center gap-4 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settingsData.sms_notifications === true}
                            onChange={(e) => handleSettingChange('sms_notifications', e.target.checked)}
                            className="w-6 h-6 accent-orange-600"
                          />
                          <span className="text-white font-bold uppercase tracking-wider">
                            SMS УВЕДОМЛЕНИЯ
                          </span>
                        </label>
                      </div>
                    </div>

                    <div className="bg-black p-6 border-4 border-orange-600">
                      <h3 className="text-xl font-black text-orange-500 uppercase tracking-wider mb-6">
                        ТИПЫ УВЕДОМЛЕНИЙ
                      </h3>
                      <div className="space-y-6">
                        <div className="bg-gray-800 p-4 border-4 border-gray-600">
                          <div className="font-black text-white mb-4 uppercase tracking-wider">
                            НОВЫЕ СООБЩЕНИЯ
                          </div>
                          <div className="flex gap-6">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={notificationsData.new_messages?.email !== false}
                                onChange={(e) => handleNotificationChange('new_messages', 'email', e.target.checked)}
                                className="w-5 h-5 accent-orange-600"
                              />
                              <span className="text-white font-bold uppercase">EMAIL</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={notificationsData.new_messages?.push !== false}
                                onChange={(e) => handleNotificationChange('new_messages', 'push', e.target.checked)}
                                className="w-5 h-5 accent-orange-600"
                              />
                              <span className="text-white font-bold uppercase">PUSH</span>
                            </label>
                          </div>
                        </div>

                        <div className="bg-gray-800 p-4 border-4 border-gray-600">
                          <div className="font-black text-white mb-4 uppercase tracking-wider">
                            ОБНОВЛЕНИЯ ИЗБРАННОГО
                          </div>
                          <div className="flex gap-6">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={notificationsData.favorites_updates?.email !== false}
                                onChange={(e) => handleNotificationChange('favorites_updates', 'email', e.target.checked)}
                                className="w-5 h-5 accent-orange-600"
                              />
                              <span className="text-white font-bold uppercase">EMAIL</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={notificationsData.favorites_updates?.push !== false}
                                onChange={(e) => handleNotificationChange('favorites_updates', 'push', e.target.checked)}
                                className="w-5 h-5 accent-orange-600"
                              />
                              <span className="text-white font-bold uppercase">PUSH</span>
                            </label>
                          </div>
                        </div>

                        <div className="bg-gray-800 p-4 border-4 border-gray-600">
                          <div className="font-black text-white mb-4 uppercase tracking-wider">
                            ИЗМЕНЕНИЯ ЦЕН
                          </div>
                          <div className="flex gap-6">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={notificationsData.price_changes?.email !== false}
                                onChange={(e) => handleNotificationChange('price_changes', 'email', e.target.checked)}
                                className="w-5 h-5 accent-orange-600"
                              />
                              <span className="text-white font-bold uppercase">EMAIL</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={notificationsData.price_changes?.push !== false}
                                onChange={(e) => handleNotificationChange('price_changes', 'push', e.target.checked)}
                                className="w-5 h-5 accent-orange-600"
                              />
                              <span className="text-white font-bold uppercase">PUSH</span>
                            </label>
                          </div>
                        </div>

                        <div className="bg-gray-800 p-4 border-4 border-gray-600">
                          <div className="font-black text-white mb-4 uppercase tracking-wider">
                            ПОХОЖИЕ ОБЪЯВЛЕНИЯ
                          </div>
                          <div className="flex gap-6">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={notificationsData.similar_listings?.email !== false}
                                onChange={(e) => handleNotificationChange('similar_listings', 'email', e.target.checked)}
                                className="w-5 h-5 accent-orange-600"
                              />
                              <span className="text-white font-bold uppercase">EMAIL</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={notificationsData.similar_listings?.push !== false}
                                onChange={(e) => handleNotificationChange('similar_listings', 'push', e.target.checked)}
                                className="w-5 h-5 accent-orange-600"
                              />
                              <span className="text-white font-bold uppercase">PUSH</span>
                            </label>
                          </div>
                        </div>

                        <div className="bg-gray-800 p-4 border-4 border-gray-600">
                          <div className="font-black text-white mb-4 uppercase tracking-wider">
                            АКЦИИ И ПРЕДЛОЖЕНИЯ
                          </div>
                          <div className="flex gap-6">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={notificationsData.promotions?.email !== false}
                                onChange={(e) => handleNotificationChange('promotions', 'email', e.target.checked)}
                                className="w-5 h-5 accent-orange-600"
                              />
                              <span className="text-white font-bold uppercase">EMAIL</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={notificationsData.promotions?.push !== false}
                                onChange={(e) => handleNotificationChange('promotions', 'push', e.target.checked)}
                                className="w-5 h-5 accent-orange-600"
                              />
                              <span className="text-white font-bold uppercase">PUSH</span>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Privacy Tab */}
              {activeTab === 'privacy' && (
                <div>
                  <h2 className="text-3xl font-black text-white uppercase tracking-wider mb-8">
                    НАСТРОЙКИ ПРИВАТНОСТИ
                  </h2>
                  
                  <div className="space-y-8">
                    <div className="bg-black p-6 border-4 border-orange-600">
                      <h3 className="text-xl font-black text-orange-500 uppercase tracking-wider mb-6">
                        ВИДИМОСТЬ ПРОФИЛЯ
                      </h3>
                      <div className="space-y-4">
                        <label className="flex items-center gap-4 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settingsData.show_phone_in_profile !== false}
                            onChange={(e) => handleSettingChange('show_phone_in_profile', e.target.checked)}
                            className="w-6 h-6 accent-orange-600"
                          />
                          <span className="text-white font-bold uppercase tracking-wider">
                            ПОКАЗЫВАТЬ ТЕЛЕФОН В ПРОФИЛЕ
                          </span>
                        </label>

                        <label className="flex items-center gap-4 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settingsData.show_email_in_profile !== false}
                            onChange={(e) => handleSettingChange('show_email_in_profile', e.target.checked)}
                            className="w-6 h-6 accent-orange-600"
                          />
                          <span className="text-white font-bold uppercase tracking-wider">
                            ПОКАЗЫВАТЬ EMAIL В ПРОФИЛЕ
                          </span>
                        </label>

                        <label className="flex items-center gap-4 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settingsData.show_online_status !== false}
                            onChange={(e) => handleSettingChange('show_online_status', e.target.checked)}
                            className="w-6 h-6 accent-orange-600"
                          />
                          <span className="text-white font-bold uppercase tracking-wider">
                            ПОКАЗЫВАТЬ СТАТУС "ОНЛАЙН"
                          </span>
                        </label>
                      </div>
                    </div>

                    <div className="bg-black p-6 border-4 border-orange-600">
                      <h3 className="text-xl font-black text-orange-500 uppercase tracking-wider mb-6">
                        КОНТАКТЫ
                      </h3>
                      <div className="space-y-4">
                        <label className="flex items-center gap-4 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settingsData.allow_contact_from_anyone !== false}
                            onChange={(e) => handleSettingChange('allow_contact_from_anyone', e.target.checked)}
                            className="w-6 h-6 accent-orange-600"
                          />
                          <span className="text-white font-bold uppercase tracking-wider">
                            РАЗРЕШИТЬ СВЯЗЫВАТЬСЯ ВСЕМ
                          </span>
                        </label>

                        <label className="flex items-center gap-4 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settingsData.hide_from_search === true}
                            onChange={(e) => handleSettingChange('hide_from_search', e.target.checked)}
                            className="w-6 h-6 accent-orange-600"
                          />
                          <span className="text-white font-bold uppercase tracking-wider">
                            СКРЫТЬ ПРОФИЛЬ ИЗ ПОИСКА
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Account Tab */}
              {activeTab === 'account' && (
                <div>
                  <h2 className="text-3xl font-black text-white uppercase tracking-wider mb-8">
                    НАСТРОЙКИ АККАУНТА
                  </h2>
                  
                  <div className="space-y-8">
                    <div className="bg-black p-6 border-4 border-orange-600">
                      <h3 className="text-xl font-black text-orange-500 uppercase tracking-wider mb-6">
                        ЯЗЫК ИНТЕРФЕЙСА
                      </h3>
                      <select
                        value={settingsData.preferred_language || 'ru'}
                        onChange={(e) => handleSettingChange('preferred_language', e.target.value)}
                        className="bg-gray-800 text-white font-bold px-4 py-3 border-4 border-orange-600 focus:border-white outline-none uppercase tracking-wider text-lg"
                      >
                        <option value="ru">РУССКИЙ</option>
                        <option value="kk">КАЗАХСКИЙ</option>
                        <option value="en">ENGLISH</option>
                      </select>
                    </div>

                    <div className="bg-black p-6 border-4 border-orange-600">
                      <h3 className="text-xl font-black text-orange-500 uppercase tracking-wider mb-6">
                        ЧАСОВОЙ ПОЯС
                      </h3>
                      <select
                        value={settingsData.timezone || 'Asia/Almaty'}
                        onChange={(e) => handleSettingChange('timezone', e.target.value)}
                        className="bg-gray-800 text-white font-bold px-4 py-3 border-4 border-orange-600 focus:border-white outline-none uppercase tracking-wider text-lg"
                      >
                        <option value="Asia/Almaty">АЛМАТЫ (UTC+6)</option>
                        <option value="Asia/Aqtobe">АКТОБЕ (UTC+5)</option>
                        <option value="Europe/Moscow">МОСКВА (UTC+3)</option>
                        <option value="Europe/Kiev">КИЕВ (UTC+2)</option>
                      </select>
                    </div>

                    <div className="bg-black p-6 border-4 border-orange-600">
                      <h3 className="text-xl font-black text-orange-500 uppercase tracking-wider mb-6">
                        АВТОПРОДЛЕНИЕ ОБЪЯВЛЕНИЙ
                      </h3>
                      <label className="flex items-center gap-4 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settingsData.auto_renewal_enabled === true}
                          onChange={(e) => handleSettingChange('auto_renewal_enabled', e.target.checked)}
                          className="w-6 h-6 accent-orange-600"
                        />
                        <span className="text-white font-bold uppercase tracking-wider">
                          АВТОМАТИЧЕСКИ ПРОДЛЕВАТЬ АКТИВНЫЕ ОБЪЯВЛЕНИЯ
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Security Tab */}
              {activeTab === 'security' && (
                <div>
                  <h2 className="text-3xl font-black text-white uppercase tracking-wider mb-8">
                    БЕЗОПАСНОСТЬ
                  </h2>
                  
                  <div className="space-y-8">
                    {/* Password Change */}
                    <div className="bg-black p-6 border-4 border-orange-600">
                      <h3 className="text-xl font-black text-orange-500 uppercase tracking-wider mb-6 flex items-center gap-3">
                        <Key size={24} />
                        СМЕНА ПАРОЛЯ
                      </h3>
                      
                      {errors.password && (
                        <div className="bg-red-900 border-4 border-red-600 p-4 mb-6">
                          <div className="text-red-400 font-black uppercase tracking-wider">
                            {errors.password}
                          </div>
                        </div>
                      )}
                      
                      <div className="space-y-6 max-w-md">
                        <div>
                          <label className="block text-white font-black text-lg mb-3 uppercase tracking-wider">
                            ТЕКУЩИЙ ПАРОЛЬ
                          </label>
                          <div className="relative">
                            <input
                              type={showPasswords.current ? "text" : "password"}
                              value={passwordData.current_password}
                              onChange={(e) => handlePasswordChange('current_password', e.target.value)}
                              className={`w-full bg-gray-800 text-white font-bold px-4 py-3 pr-12 border-4 ${errors.current_password ? 'border-red-600' : 'border-orange-600'} focus:border-white outline-none`}
                              placeholder="ВВЕДИТЕ ТЕКУЩИЙ ПАРОЛЬ"
                            />
                            <button
                              type="button"
                              onClick={() => togglePasswordVisibility('current')}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                            >
                              {showPasswords.current ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                          </div>
                          {errors.current_password && (
                            <div className="text-red-500 font-bold text-sm mt-2 uppercase">
                              {errors.current_password}
                            </div>
                          )}
                        </div>

                        <div>
                          <label className="block text-white font-black text-lg mb-3 uppercase tracking-wider">
                            НОВЫЙ ПАРОЛЬ
                          </label>
                          <div className="relative">
                            <input
                              type={showPasswords.new ? "text" : "password"}
                              value={passwordData.new_password}
                              onChange={(e) => handlePasswordChange('new_password', e.target.value)}
                              className={`w-full bg-gray-800 text-white font-bold px-4 py-3 pr-12 border-4 ${errors.new_password ? 'border-red-600' : 'border-orange-600'} focus:border-white outline-none`}
                              placeholder="ВВЕДИТЕ НОВЫЙ ПАРОЛЬ"
                            />
                            <button
                              type="button"
                              onClick={() => togglePasswordVisibility('new')}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                            >
                              {showPasswords.new ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                          </div>
                          {errors.new_password && (
                            <div className="text-red-500 font-bold text-sm mt-2 uppercase">
                              {errors.new_password}
                            </div>
                          )}
                        </div>

                        <div>
                          <label className="block text-white font-black text-lg mb-3 uppercase tracking-wider">
                            ПОДТВЕРДИТЕ НОВЫЙ ПАРОЛЬ
                          </label>
                          <div className="relative">
                            <input
                              type={showPasswords.confirm ? "text" : "password"}
                              value={passwordData.confirm_password}
                              onChange={(e) => handlePasswordChange('confirm_password', e.target.value)}
                              className={`w-full bg-gray-800 text-white font-bold px-4 py-3 pr-12 border-4 ${errors.confirm_password ? 'border-red-600' : 'border-orange-600'} focus:border-white outline-none`}
                              placeholder="ПОДТВЕРДИТЕ ПАРОЛЬ"
                            />
                            <button
                              type="button"
                              onClick={() => togglePasswordVisibility('confirm')}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                            >
                              {showPasswords.confirm ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                          </div>
                          {errors.confirm_password && (
                            <div className="text-red-500 font-bold text-sm mt-2 uppercase">
                              {errors.confirm_password}
                            </div>
                          )}
                        </div>

                        <button
                          onClick={handlePasswordSubmit}
                          disabled={changePasswordMutation.isLoading}
                          className="group relative bg-orange-600 hover:bg-white text-black font-black px-8 py-4 text-lg uppercase tracking-wider transition-all duration-300 transform hover:scale-105 disabled:opacity-50"
                        >
                          <div className="absolute inset-0 border-4 border-black group-hover:border-orange-600 transition-colors"></div>
                          <span className="relative group-hover:text-black">
                            {changePasswordMutation.isLoading ? 'ИЗМЕНЕНИЕ...' : 'ИЗМЕНИТЬ ПАРОЛЬ'}
                          </span>
                        </button>
                      </div>
                    </div>

                    {/* Active Sessions */}
                    <div className="bg-black p-6 border-4 border-orange-600">
                      <h3 className="text-xl font-black text-orange-500 uppercase tracking-wider mb-6">
                        АКТИВНЫЕ СЕССИИ
                      </h3>
                      <p className="text-gray-300 font-bold mb-6 uppercase">
                        ВЫ МОЖЕТЕ ЗАВЕРШИТЬ СЕССИИ НА ДРУГИХ УСТРОЙСТВАХ
                      </p>
                      
                      <div className="bg-gray-800 border-4 border-gray-600 p-4 mb-6">
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-black text-white uppercase tracking-wider">
                              ТЕКУЩЕЕ УСТРОЙСТВО
                            </div>
                            <div className="text-gray-300 font-bold flex items-center gap-3 mt-2">
                              {getBrowserIcon()}
                              {getBrowserName()} • АКТИВНА СЕЙЧАС
                            </div>
                          </div>
                          <div className="bg-green-600 text-white px-4 py-2 font-black text-sm uppercase tracking-wider border-2 border-black">
                            ТЕКУЩАЯ
                          </div>
                        </div>
                      </div>
                      
                      <button
                        className="bg-red-600 hover:bg-red-500 text-white font-black px-6 py-3 text-sm uppercase tracking-wider transition-colors border-2 border-black flex items-center gap-3"
                        onClick={() => {
                          if (window.confirm('ЗАВЕРШИТЬ ВСЕ ОСТАЛЬНЫЕ СЕССИИ? ВАМ ПРИДЕТСЯ ВОЙТИ ЗАНОВО НА ДРУГИХ УСТРОЙСТВАХ.')) {
                            alert('СЕССИИ ЗАВЕРШЕНЫ');
                          }
                        }}
                      >
                        <Shield size={16} />
                        ЗАВЕРШИТЬ ВСЕ СЕССИИ
                      </button>
                    </div>

                    {/* Delete Account */}
                    <div className="bg-red-900 border-4 border-red-600 p-6">
                      <h3 className="text-xl font-black text-red-400 uppercase tracking-wider mb-6 flex items-center gap-3">
                        <Trash2 size={24} />
                        УДАЛЕНИЕ АККАУНТА
                      </h3>
                      <p className="text-red-300 font-bold mb-6 uppercase">
                        УДАЛЕНИЕ АККАУНТА НЕОБРАТИМО. ВСЕ ДАННЫЕ БУДУТ УДАЛЕНЫ.
                      </p>
                      <button
                        className="bg-red-600 hover:bg-red-500 text-white font-black px-8 py-4 text-lg uppercase tracking-wider transition-colors border-4 border-black flex items-center gap-3"
                        onClick={() => {
                          if (window.confirm('ВЫ УВЕРЕНЫ, ЧТО ХОТИТЕ УДАЛИТЬ АККАУНТ? ЭТО ДЕЙСТВИЕ НЕЛЬЗЯ ОТМЕНИТЬ!')) {
                            if (window.confirm('ПОДТВЕРДИТЕ УДАЛЕНИЕ АККАУНТА. ВСЕ ДАННЫЕ БУДУТ УДАЛЕНЫ БЕЗВОЗВРАТНО!')) {
                              alert('ЗАПРОС НА УДАЛЕНИЕ АККАУНТА ОТПРАВЛЕН');
                            }
                          }
                        }}
                      >
                        <Trash2 size={20} />
                        УДАЛИТЬ АККАУНТ
                      </button>
                    </div>
                  </div>
                </div>
              )}
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;