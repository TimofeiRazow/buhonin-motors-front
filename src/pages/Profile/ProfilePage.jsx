import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Plus, FileText, MessageCircle, Heart, Settings, User, Phone, Mail, Building, Edit } from 'lucide-react';
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

  if (isLoading) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-16 h-16 border-4 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-white font-black text-xl mt-4 uppercase tracking-wider">
            ЗАГРУЖАЕМ ПРОФИЛЬ...
          </p>
        </div>
      </div>
    );
  }

  const profileData = profile?.data || {};
  const statsData = stats?.data || {};

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
              <span className="text-white">МОЙ</span>
              <span className="text-orange-500"> ПРОФИЛЬ</span>
            </h1>
            <p className="text-xl font-bold text-gray-300 uppercase">
              УПРАВЛЯЙТЕ СВОИМ АККАУНТОМ
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-16 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Profile Information - 2 columns */}
          <div className="lg:col-span-2">
            <div className="bg-gray-900 border-4 border-orange-600 p-8">
              <div className="flex flex-col md:flex-row justify-between items-start mb-8">
                <h2 className="text-3xl font-black text-white uppercase tracking-wider mb-4 md:mb-0">
                  ЛИЧНАЯ ИНФОРМАЦИЯ
                </h2>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="group relative bg-orange-600 hover:bg-white text-black font-black px-6 py-3 text-sm uppercase tracking-wider transition-all duration-300 transform hover:scale-105"
                  >
                    <div className="absolute inset-0 border-4 border-black group-hover:border-orange-600 transition-colors"></div>
                    <span className="relative group-hover:text-black flex items-center gap-2">
                      <Edit size={16} />
                      РЕДАКТИРОВАТЬ
                    </span>
                  </button>
                ) : (
                  <div className="flex gap-4">
                    <button
                      onClick={handleSave}
                      disabled={updateProfileMutation.isLoading}
                      className="bg-green-600 hover:bg-green-500 text-white font-black px-6 py-3 text-sm uppercase tracking-wider transition-colors border-2 border-black"
                    >
                      {updateProfileMutation.isLoading ? 'СОХРАНЕНИЕ...' : 'СОХРАНИТЬ'}
                    </button>
                    <button
                      onClick={handleCancel}
                      className="bg-gray-600 hover:bg-gray-500 text-white font-black px-6 py-3 text-sm uppercase tracking-wider transition-colors border-2 border-black"
                    >
                      ОТМЕНА
                    </button>
                  </div>
                )}
              </div>

              {/* Avatar Section */}
              <div className="flex items-center gap-6 mb-8">
                <div className="w-24 h-24 bg-orange-600 border-4 border-black flex items-center justify-center">
                  <span className="text-black text-3xl font-black">
                    {profileData.first_name?.charAt(0) || user?.phone_number?.slice(-4) || 'U'}
                  </span>
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white uppercase tracking-wider mb-2">
                    {profileData.first_name} {profileData.last_name}
                  </h3>
                  <div className="flex items-center gap-2 text-gray-300 font-bold mb-1">
                    <Phone size={16} className="text-orange-500" />
                    {user?.phone_number}
                  </div>
                  {profileData.email && (
                    <div className="flex items-center gap-2 text-gray-300 font-bold">
                      <Mail size={16} className="text-orange-500" />
                      {profileData.email}
                    </div>
                  )}
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white font-black text-lg mb-3 uppercase tracking-wider">
                      ИМЯ
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.first_name || ''}
                        onChange={(e) => handleInputChange('first_name', e.target.value)}
                        className="w-full bg-gray-800 text-white font-bold px-4 py-3 border-4 border-orange-600 focus:border-white outline-none uppercase tracking-wider"
                        placeholder="ВВЕДИТЕ ИМЯ"
                      />
                    ) : (
                      <div className="bg-gray-800 px-4 py-3 border-4 border-gray-600 text-gray-300 font-bold uppercase tracking-wider">
                        {profileData.first_name || 'НЕ УКАЗАНО'}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-white font-black text-lg mb-3 uppercase tracking-wider">
                      ФАМИЛИЯ
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.last_name || ''}
                        onChange={(e) => handleInputChange('last_name', e.target.value)}
                        className="w-full bg-gray-800 text-white font-bold px-4 py-3 border-4 border-orange-600 focus:border-white outline-none uppercase tracking-wider"
                        placeholder="ВВЕДИТЕ ФАМИЛИЮ"
                      />
                    ) : (
                      <div className="bg-gray-800 px-4 py-3 border-4 border-gray-600 text-gray-300 font-bold uppercase tracking-wider">
                        {profileData.last_name || 'НЕ УКАЗАНО'}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-white font-black text-lg mb-3 uppercase tracking-wider">
                    EMAIL
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={formData.email || ''}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full bg-gray-800 text-white font-bold px-4 py-3 border-4 border-orange-600 focus:border-white outline-none"
                      placeholder="ВВЕДИТЕ EMAIL"
                    />
                  ) : (
                    <div className="bg-gray-800 px-4 py-3 border-4 border-gray-600 text-gray-300 font-bold">
                      {profileData.email || 'НЕ УКАЗАН'}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-white font-black text-lg mb-3 uppercase tracking-wider">
                    НАЗВАНИЕ КОМПАНИИ
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.company_name || ''}
                      onChange={(e) => handleInputChange('company_name', e.target.value)}
                      className="w-full bg-gray-800 text-white font-bold px-4 py-3 border-4 border-orange-600 focus:border-white outline-none uppercase tracking-wider"
                      placeholder="ВВЕДИТЕ НАЗВАНИЕ КОМПАНИИ"
                    />
                  ) : (
                    <div className="bg-gray-800 px-4 py-3 border-4 border-gray-600 text-gray-300 font-bold uppercase tracking-wider">
                      {profileData.company_name || 'НЕ УКАЗАНО'}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-white font-black text-lg mb-3 uppercase tracking-wider">
                    О СЕБЕ
                  </label>
                  {isEditing ? (
                    <textarea
                      value={formData.description || ''}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      rows={4}
                      className="w-full bg-gray-800 text-white font-bold px-4 py-3 border-4 border-orange-600 focus:border-white outline-none resize-none"
                      placeholder="РАССКАЖИТЕ О СЕБЕ"
                    />
                  ) : (
                    <div className="bg-gray-800 px-4 py-3 border-4 border-gray-600 text-gray-300 font-bold min-h-[100px]">
                      {profileData.description || 'НЕ УКАЗАНО'}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - 1 column */}
          <div className="space-y-8">
            {/* Statistics */}
            <div className="bg-gray-900 border-4 border-orange-600 p-6">
              <h3 className="text-2xl font-black text-white uppercase tracking-wider mb-6">
                СТАТИСТИКА
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-black p-4 border-4 border-orange-600 text-center">
                  <div className="text-2xl font-black text-orange-500 mb-2">
                    {statsData.total_listings || 0}
                  </div>
                  <div className="text-gray-300 font-black text-xs uppercase tracking-wider">
                    ВСЕГО ОБЪЯВЛЕНИЙ
                  </div>
                </div>

                <div className="bg-black p-4 border-4 border-green-600 text-center">
                  <div className="text-2xl font-black text-green-500 mb-2">
                    {statsData.active_listings || 0}
                  </div>
                  <div className="text-gray-300 font-black text-xs uppercase tracking-wider">
                    АКТИВНЫХ
                  </div>
                </div>

                <div className="bg-black p-4 border-4 border-yellow-600 text-center">
                  <div className="text-2xl font-black text-yellow-500 mb-2">
                    {statsData.total_views || 0}
                  </div>
                  <div className="text-gray-300 font-black text-xs uppercase tracking-wider">
                    ПРОСМОТРОВ
                  </div>
                </div>

                <div className="bg-black p-4 border-4 border-red-600 text-center">
                  <div className="text-2xl font-black text-red-500 mb-2">
                    {statsData.avg_rating ? statsData.avg_rating.toFixed(1) : '—'}
                  </div>
                  <div className="text-gray-300 font-black text-xs uppercase tracking-wider">
                    РЕЙТИНГ
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gray-900 border-4 border-orange-600 p-6">
              <h3 className="text-2xl font-black text-white uppercase tracking-wider mb-6">
                БЫСТРЫЕ ДЕЙСТВИЯ
              </h3>
              
              <div className="space-y-4">
                <Link
                  to="/create-listing"
                  className="group relative bg-green-600 hover:bg-green-500 text-white font-black px-6 py-4 text-sm uppercase tracking-wider transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-3 w-full"
                >
                  <div className="absolute inset-0 border-4 border-black transition-colors"></div>
                  <span className="relative flex items-center gap-3">
                    <Plus size={18} />
                    ПОДАТЬ ОБЪЯВЛЕНИЕ
                  </span>
                </Link>

                <Link
                  to="/my-listings"
                  className="group relative bg-blue-600 hover:bg-blue-500 text-white font-black px-6 py-4 text-sm uppercase tracking-wider transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-3 w-full"
                >
                  <div className="absolute inset-0 border-4 border-black transition-colors"></div>
                  <span className="relative flex items-center gap-3">
                    <FileText size={18} />
                    МОИ ОБЪЯВЛЕНИЯ
                  </span>
                </Link>

                <Link
                  to="/messages"
                  className="group relative bg-cyan-600 hover:bg-cyan-500 text-white font-black px-6 py-4 text-sm uppercase tracking-wider transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-3 w-full"
                >
                  <div className="absolute inset-0 border-4 border-black transition-colors"></div>
                  <span className="relative flex items-center gap-3">
                    <MessageCircle size={18} />
                    СООБЩЕНИЯ
                  </span>
                </Link>

                <Link
                  to="/favorites"
                  className="group relative bg-red-600 hover:bg-red-500 text-white font-black px-6 py-4 text-sm uppercase tracking-wider transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-3 w-full"
                >
                  <div className="absolute inset-0 border-4 border-black transition-colors"></div>
                  <span className="relative flex items-center gap-3">
                    <Heart size={18} />
                    ИЗБРАННОЕ
                  </span>
                </Link>

                <Link
                  to="/settings"
                  className="group relative bg-gray-600 hover:bg-gray-500 text-white font-black px-6 py-4 text-sm uppercase tracking-wider transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-3 w-full"
                >
                  <div className="absolute inset-0 border-4 border-black transition-colors"></div>
                  <span className="relative flex items-center gap-3">
                    <Settings size={18} />
                    НАСТРОЙКИ
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;