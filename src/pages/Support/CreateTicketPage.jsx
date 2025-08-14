// src/pages/Support/CreateTicketPage.jsx
import React, { useState } from 'react';
import { useQuery, useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const CreateTicketPage = () => {
  const [formData, setFormData] = useState({
    category_id: '',
    priority: 'medium',
    subject: '',
    description: ''
  });
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  const { data: categories } = useQuery('support-categories', () => api.get('/api/support/categories'));

  const createTicketMutation = useMutation(
    (ticketData) => api.post('/api/support/tickets', ticketData),
    {
      onSuccess: (response) => {
        navigate(`/support/tickets/${response.data.ticket_id}`);
      },
      onError: (error) => {
        setError(error.response?.data?.message || 'Ошибка при создании обращения');
      }
    }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.subject.trim() || !formData.description.trim()) {
      setError('Заполните все обязательные поля');
      return;
    }

    setError('');
    createTicketMutation.mutate(formData);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h1>Создать обращение в поддержку</h1>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '20px' }}>
          <label>Категория:</label>
          <select
            value={formData.category_id}
            onChange={(e) => handleChange('category_id', e.target.value)}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          >
            <option value="">Выберите категорию</option>
            {categories?.data?.map((category) => (
              <option key={category.category_id} value={category.category_id}>
                {category.category_name}
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label>Приоритет:</label>
          <select
            value={formData.priority}
            onChange={(e) => handleChange('priority', e.target.value)}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          >
            <option value="low">Низкий</option>
            <option value="medium">Средний</option>
            <option value="high">Высокий</option>
            <option value="critical">Критический</option>
          </select>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label>Тема обращения *:</label>
          <input
            type="text"
            value={formData.subject}
            onChange={(e) => handleChange('subject', e.target.value)}
            placeholder="Кратко опишите проблему"
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            maxLength={255}
            required
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label>Подробное описание *:</label>
          <textarea
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Подробно опишите вашу проблему или вопрос. Укажите все детали, которые могут помочь нам решить вашу проблему быстрее."
            style={{ width: '100%', minHeight: '120px', padding: '8px', marginTop: '5px' }}
            required
          />
        </div>

        {error && (
          <div style={{ color: 'red', marginBottom: '20px' }}>
            {error}
          </div>
        )}

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type="submit"
            disabled={createTicketMutation.isLoading}
            style={{
              padding: '12px 24px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: createTicketMutation.isLoading ? 'not-allowed' : 'pointer'
            }}
          >
            {createTicketMutation.isLoading ? 'Создаем...' : 'Создать обращение'}
          </button>

          <button
            type="button"
            onClick={() => navigate('/support')}
            style={{
              padding: '12px 24px',
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
      </form>
    </div>
  );
};

export default CreateTicketPage;