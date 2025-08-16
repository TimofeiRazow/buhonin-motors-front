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
  Trash2
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

  // Функция для определения иконки браузера
  const getBrowserIcon = () => {
    const userAgent = navigator.userAgent;
    if (userAgent.includes('Chrome')) return <Globe size={16} />;
    if (userAgent.includes('Firefox')) return <Firefox size={16} />;
    if (userAgent.includes('Safari')) return <Compass size={16} />;
    return <Monitor size={16} />;
  };

  const getBrowserName = () => {
    const userAgent = navigator.userAgent;
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari')) return 'Safari';
    return 'Браузер';
  };

  if (isLoading) return <LoadingSpinner text="Загружаем настройки..." />;

  const settingsData = settings?.data || {};
  const notificationsData = notificationSettings?.data || {};

  const tabs = [
    { id: 'notifications', name: 'Уведомления', icon: <Bell size={16} /> },
    { id: 'privacy', name: 'Приватность', icon: <Lock size={16} /> },
    { id: 'account', name: 'Аккаунт', icon: <User size={16} /> },
    { id: 'security', name: 'Безопасность', icon: <Shield size={16} /> }
  ];

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '30px' }}>Настройки</h1>

      <div style={{ display: 'flex', gap: '30px' }}>
        {/* Боковое меню */}
        <div style={{
          width: '200px',
          backgroundColor: 'white',
          borderRadius: '8px',
          border: '1px solid #ddd',
          padding: '10px',
          height: 'fit-content'
        }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                width: '100%',
                padding: '12px 15px',
                backgroundColor: activeTab === tab.id ? '#007bff' : 'transparent',
                color: activeTab === tab.id ? 'white' : '#333',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                textAlign: 'left',
                marginBottom: '5px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}
            >
              {tab.icon}
              <span>{tab.name}</span>
            </button>
          ))}
        </div>

        {/* Содержимое вкладок */}
        <div style={{
          flex: 1,
          backgroundColor: 'white',
          borderRadius: '8px',
          border: '1px solid #ddd',
          padding: '20px'
        }}>
          {/* Уведомления */}
          {activeTab === 'notifications' && (
            <div>
              <h2 style={{ marginTop: 0 }}>Настройки уведомлений</h2>
              
              <div style={{ marginBottom: '30px' }}>
                <h3>Общие настройки</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <input
                      type="checkbox"
                      checked={settingsData.notifications_enabled !== false}
                      onChange={(e) => handleSettingChange('notifications_enabled', e.target.checked)}
                    />
                    <span>Включить уведомления</span>
                  </label>
                  
                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <input
                      type="checkbox"
                      checked={settingsData.email_notifications !== false}
                      onChange={(e) => handleSettingChange('email_notifications', e.target.checked)}
                    />
                    <span>Email уведомления</span>
                  </label>
                  
                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <input
                      type="checkbox"
                      checked={settingsData.push_notifications !== false}
                      onChange={(e) => handleSettingChange('push_notifications', e.target.checked)}
                    />
                    <span>Push уведомления</span>
                  </label>
                  
                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <input
                      type="checkbox"
                      checked={settingsData.sms_notifications === true}
                      onChange={(e) => handleSettingChange('sms_notifications', e.target.checked)}
                    />
                    <span>SMS уведомления</span>
                  </label>
                </div>
              </div>

              <div>
                <h3>Типы уведомлений</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {[
                    { key: 'new_messages', name: 'Новые сообщения' },
                    { key: 'favorites_updates', name: 'Обновления избранного' },
                    { key: 'price_changes', name: 'Изменения цен' },
                    { key: 'similar_listings', name: 'Похожие объявления' },
                    { key: 'promotions', name: 'Акции и предложения' }
                  ].map(type => (
                    <div key={type.key} style={{
                      padding: '15px',
                      border: '1px solid #eee',
                      borderRadius: '4px'
                    }}>
                      <div style={{ fontWeight: 'bold', marginBottom: '10px' }}>
                        {type.name}
                      </div>
                      <div style={{ display: 'flex', gap: '15px' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <input
                            type="checkbox"
                            checked={notificationsData[type.key]?.email !== false}
                            onChange={(e) => handleNotificationChange(type.key, 'email', e.target.checked)}
                          />
                          <span>Email</span>
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <input
                            type="checkbox"
                            checked={notificationsData[type.key]?.push !== false}
                            onChange={(e) => handleNotificationChange(type.key, 'push', e.target.checked)}
                          />
                          <span>Push</span>
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Приватность */}
          {activeTab === 'privacy' && (
            <div>
              <h2 style={{ marginTop: 0 }}>Настройки приватности</h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{
                  padding: '15px',
                  border: '1px solid #eee',
                  borderRadius: '4px'
                }}>
                  <h3 style={{ marginTop: 0 }}>Видимость профиля</h3>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                    <input
                      type="checkbox"
                      checked={settingsData.show_phone_in_profile !== false}
                      onChange={(e) => handleSettingChange('show_phone_in_profile', e.target.checked)}
                    />
                    <span>Показывать телефон в профиле</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                    <input
                      type="checkbox"
                      checked={settingsData.show_email_in_profile !== false}
                      onChange={(e) => handleSettingChange('show_email_in_profile', e.target.checked)}
                    />
                    <span>Показывать email в профиле</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <input
                      type="checkbox"
                      checked={settingsData.show_online_status !== false}
                      onChange={(e) => handleSettingChange('show_online_status', e.target.checked)}
                    />
                    <span>Показывать статус "онлайн"</span>
                  </label>
                </div>

                <div style={{
                  padding: '15px',
                  border: '1px solid #eee',
                  borderRadius: '4px'
                }}>
                  <h3 style={{ marginTop: 0 }}>Контакты</h3>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                    <input
                      type="checkbox"
                      checked={settingsData.allow_contact_from_anyone !== false}
                      onChange={(e) => handleSettingChange('allow_contact_from_anyone', e.target.checked)}
                    />
                    <span>Разрешить связываться всем пользователям</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <input
                      type="checkbox"
                      checked={settingsData.hide_from_search === true}
                      onChange={(e) => handleSettingChange('hide_from_search', e.target.checked)}
                    />
                    <span>Скрыть профиль из поиска</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Аккаунт */}
          {activeTab === 'account' && (
            <div>
              <h2 style={{ marginTop: 0 }}>Настройки аккаунта</h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <h3>Язык интерфейса</h3>
                  <select
                    value={settingsData.preferred_language || 'ru'}
                    onChange={(e) => handleSettingChange('preferred_language', e.target.value)}
                    style={{
                      padding: '8px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      width: '200px'
                    }}
                  >
                    <option value="ru">Русский</option>
                    <option value="kk">Казахский</option>
                    <option value="en">English</option>
                  </select>
                </div>

                <div>
                  <h3>Часовой пояс</h3>
                  <select
                    value={settingsData.timezone || 'Asia/Almaty'}
                    onChange={(e) => handleSettingChange('timezone', e.target.value)}
                    style={{
                      padding: '8px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      width: '200px'
                    }}
                  >
                    <option value="Asia/Almaty">Алматы (UTC+6)</option>
                    <option value="Asia/Aqtobe">Актобе (UTC+5)</option>
                    <option value="Europe/Moscow">Москва (UTC+3)</option>
                    <option value="Europe/Kiev">Киев (UTC+2)</option>
                  </select>
                </div>

                <div>
                  <h3>Автопродление объявлений</h3>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <input
                      type="checkbox"
                      checked={settingsData.auto_renewal_enabled === true}
                      onChange={(e) => handleSettingChange('auto_renewal_enabled', e.target.checked)}
                    />
                    <span>Автоматически продлевать активные объявления</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Безопасность */}
          {activeTab === 'security' && (
            <div>
              <h2 style={{ marginTop: 0 }}>Безопасность</h2>
              
              <div style={{ marginBottom: '30px' }}>
                <h3>Смена пароля</h3>
                {errors.password && (
                  <div style={{
                    backgroundColor: '#f8d7da',
                    color: '#721c24',
                    padding: '10px',
                    borderRadius: '4px',
                    marginBottom: '15px',
                    border: '1px solid #f5c6cb'
                  }}>
                    {errors.password}
                  </div>
                )}
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxWidth: '300px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                      Текущий пароль
                    </label>
                    <input
                      type="password"
                      value={passwordData.current_password}
                      onChange={(e) => handlePasswordChange('current_password', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '8px',
                        border: `1px solid ${errors.current_password ? '#dc3545' : '#ddd'}`,
                        borderRadius: '4px',
                        boxSizing: 'border-box'
                      }}
                    />
                    {errors.current_password && (
                      <div style={{ color: '#dc3545', fontSize: '14px', marginTop: '5px' }}>
                        {errors.current_password}
                      </div>
                    )}
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                      Новый пароль
                    </label>
                    <input
                      type="password"
                      value={passwordData.new_password}
                      onChange={(e) => handlePasswordChange('new_password', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '8px',
                        border: `1px solid ${errors.new_password ? '#dc3545' : '#ddd'}`,
                        borderRadius: '4px',
                        boxSizing: 'border-box'
                      }}
                    />
                    {errors.new_password && (
                      <div style={{ color: '#dc3545', fontSize: '14px', marginTop: '5px' }}>
                        {errors.new_password}
                      </div>
                    )}
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                      Подтвердите новый пароль
                    </label>
                    <input
                      type="password"
                      value={passwordData.confirm_password}
                      onChange={(e) => handlePasswordChange('confirm_password', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '8px',
                        border: `1px solid ${errors.confirm_password ? '#dc3545' : '#ddd'}`,
                        borderRadius: '4px',
                        boxSizing: 'border-box'
                      }}
                    />
                    {errors.confirm_password && (
                      <div style={{ color: '#dc3545', fontSize: '14px', marginTop: '5px' }}>
                        {errors.confirm_password}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={handlePasswordSubmit}
                    disabled={changePasswordMutation.isLoading}
                    style={{
                      padding: '10px 20px',
                      backgroundColor: changePasswordMutation.isLoading ? '#6c757d' : '#007bff',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: changePasswordMutation.isLoading ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {changePasswordMutation.isLoading ? 'Изменение...' : 'Изменить пароль'}
                  </button>
                </div>
              </div>

              <div style={{ marginBottom: '30px' }}>
                <h3>Активные сессии</h3>
                <p style={{ color: '#666', marginBottom: '15px' }}>
                  Вы можете завершить сессии на других устройствах для безопасности
                </p>
                <div style={{
                  padding: '15px',
                  border: '1px solid #eee',
                  borderRadius: '4px',
                  marginBottom: '10px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 'bold' }}>Текущее устройство</div>
                      <div style={{ 
                        fontSize: '14px', 
                        color: '#666',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}>
                        {getBrowserIcon()}
                        {getBrowserName()} • Активна сейчас
                      </div>
                    </div>
                    <div style={{
                      padding: '4px 8px',
                      backgroundColor: '#28a745',
                      color: 'white',
                      borderRadius: '4px',
                      fontSize: '12px'
                    }}>
                      Текущая
                    </div>
                  </div>
                </div>
                
                <button
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                  onClick={() => {
                    if (window.confirm('Завершить все остальные сессии? Вам придется войти заново на других устройствах.')) {
                      // Здесь будет вызов API для завершения сессий
                      alert('Сессии завершены');
                    }
                  }}
                >
                  Завершить все остальные сессии
                </button>
              </div>

              <div>
                <h3>Удаление аккаунта</h3>
                <p style={{ color: '#666', marginBottom: '15px' }}>
                  Удаление аккаунта необратимо. Все ваши данные будут удалены.
                </p>
                <button
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                  onClick={() => {
                    if (window.confirm('Вы уверены, что хотите удалить аккаунт? Это действие нельзя отменить!')) {
                      if (window.confirm('Подтвердите удаление аккаунта. Все данные будут удалены безвозвратно!')) {
                        // Здесь будет вызов API для удаления аккаунта
                        alert('Запрос на удаление аккаунта отправлен');
                      }
                    }
                  }}
                >
                  <Trash2 size={16} />
                  Удалить аккаунт
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;