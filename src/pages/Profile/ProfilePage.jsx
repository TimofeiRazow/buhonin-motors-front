import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Plus, FileText, MessageCircle, Heart, Settings } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../hooks/auth/useAuth';
import LoadingSpinner from '../../components/UI/LoadingSpinner';

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const { user, updateUser } = useAuth();
  const queryClient = useQueryClient();

  // Загружаем профиль пользователя
  const { data: profile, isLoading } = useQuery(
    'profile',
    () => api.get('/api/users/profile'),
    {
      onSuccess: (data) => {
        setFormData(data.data);
      }
    }
  );

  // Загружаем статистику
  const { data: stats } = useQuery('user-stats', () => api.get('/api/users/stats'));

  // Мутация для обновления профиля
  const updateProfileMutation = useMutation(
    (data) => api.put('/api/users/profile', data),
    {
      onSuccess: (response) => {
        queryClient.invalidateQueries('profile');
        updateUser(response.data);
        setIsEditing(false);
        alert('Профиль успешно обновлен');
      },
      onError: (error) => {
        alert('Ошибка обновления профиля: ' + (error.response?.data?.message || 'Попробуйте позже'));
      }
    }
  );

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    updateProfileMutation.mutate(formData);
  };

  const handleCancel = () => {
    setFormData(profile?.data || {});
    setIsEditing(false);
  };

  if (isLoading) return <LoadingSpinner text="Загружаем профиль..." />;

  const profileData = profile?.data || {};
  const statsData = stats?.data || {};

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '30px' }}>Мой профиль</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
        {/* Основная информация */}
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          border: '1px solid #ddd'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px'
          }}>
            <h2 style={{ margin: 0 }}>Личная информация</h2>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Редактировать
              </button>
            ) : (
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={handleSave}
                  disabled={updateProfileMutation.isLoading}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  {updateProfileMutation.isLoading ? 'Сохранение...' : 'Сохранить'}
                </button>
                <button
                  onClick={handleCancel}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#6c757d',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Отмена
                </button>
              </div>
            )}
          </div>

          {/* Аватар */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            marginBottom: '20px'
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              backgroundColor: '#007bff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '32px',
              fontWeight: 'bold'
            }}>
              {profileData.first_name?.charAt(0) || user?.phone_number?.slice(-4) || 'U'}
            </div>
            <div>
              <h3 style={{ margin: '0 0 5px 0' }}>
                {profileData.first_name} {profileData.last_name}
              </h3>
              <p style={{ margin: '0', color: '#666' }}>
                {user?.phone_number}
              </p>
              {profileData.email && (
                <p style={{ margin: '5px 0 0 0', color: '#666' }}>
                  {profileData.email}
                </p>
              )}
            </div>
          </div>

          {/* Поля профиля */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Имя
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.first_name || ''}
                    onChange={(e) => handleInputChange('first_name', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      boxSizing: 'border-box'
                    }}
                  />
                ) : (
                  <div style={{ padding: '8px 0', color: profileData.first_name ? '#333' : '#999' }}>
                    {profileData.first_name || 'Не указано'}
                  </div>
                )}
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Фамилия
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.last_name || ''}
                    onChange={(e) => handleInputChange('last_name', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      boxSizing: 'border-box'
                    }}
                  />
                ) : (
                  <div style={{ padding: '8px 0', color: profileData.last_name ? '#333' : '#999' }}>
                    {profileData.last_name || 'Не указано'}
                  </div>
                )}
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Email
              </label>
              {isEditing ? (
                <input
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    boxSizing: 'border-box'
                  }}
                />
              ) : (
                <div style={{ padding: '8px 0', color: profileData.email ? '#333' : '#999' }}>
                  {profileData.email || 'Не указан'}
                </div>
              )}
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Название компании
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.company_name || ''}
                  onChange={(e) => handleInputChange('company_name', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    boxSizing: 'border-box'
                  }}
                />
              ) : (
                <div style={{ padding: '8px 0', color: profileData.company_name ? '#333' : '#999' }}>
                  {profileData.company_name || 'Не указано'}
                </div>
              )}
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                О себе
              </label>
              {isEditing ? (
                <textarea
                  value={formData.description || ''}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={4}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontFamily: 'inherit',
                    resize: 'vertical',
                    boxSizing: 'border-box'
                  }}
                />
              ) : (
                <div style={{ padding: '8px 0', color: profileData.description ? '#333' : '#999' }}>
                  {profileData.description || 'Не указано'}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Статистика и быстрые действия */}
        <div>
          {/* Статистика */}
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            border: '1px solid #ddd',
            marginBottom: '20px'
          }}>
            <h3 style={{ marginTop: 0 }}>Статистика</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div style={{ textAlign: 'center', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#007bff' }}>
                  {statsData.total_listings || 0}
                </div>
                <div style={{ fontSize: '14px', color: '#666' }}>Всего объявлений</div>
              </div>

              <div style={{ textAlign: 'center', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#28a745' }}>
                  {statsData.active_listings || 0}
                </div>
                <div style={{ fontSize: '14px', color: '#666' }}>Активных</div>
              </div>

              <div style={{ textAlign: 'center', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ffc107' }}>
                  {statsData.total_views || 0}
                </div>
                <div style={{ fontSize: '14px', color: '#666' }}>Просмотров</div>
              </div>

              <div style={{ textAlign: 'center', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#dc3545' }}>
                  {statsData.avg_rating ? statsData.avg_rating.toFixed(1) : '—'}
                </div>
                <div style={{ fontSize: '14px', color: '#666' }}>Рейтинг</div>
              </div>
            </div>
          </div>

          {/* Быстрые действия */}
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            border: '1px solid #ddd'
          }}>
            <h3 style={{ marginTop: 0 }}>Быстрые действия</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <Link
                to="/create-listing"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '12px',
                  backgroundColor: '#28a745',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '4px',
                  textAlign: 'center',
                  fontWeight: 'bold'
                }}
              >
                <Plus size={18} />
                Подать объявление
              </Link>

              <Link
                to="/my-listings"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '12px',
                  backgroundColor: '#007bff',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '4px',
                  textAlign: 'center',
                  fontWeight: 'bold'
                }}
              >
                <FileText size={18} />
                Мои объявления
              </Link>

              <Link
                to="/messages"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '12px',
                  backgroundColor: '#17a2b8',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '4px',
                  textAlign: 'center',
                  fontWeight: 'bold'
                }}
              >
                <MessageCircle size={18} />
                Сообщения
              </Link>

              <Link
                to="/favorites"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '12px',
                  backgroundColor: '#dc3545',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '4px',
                  textAlign: 'center',
                  fontWeight: 'bold'
                }}
              >
                <Heart size={18} />
                Избранное
              </Link>

              <Link
                to="/settings"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '12px',
                  backgroundColor: '#6c757d',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '4px',
                  textAlign: 'center',
                  fontWeight: 'bold'
                }}
              >
                <Settings size={18} />
                Настройки
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;