// src/pages/Support/FAQPage.jsx
import React, { useState } from 'react';
import { useQuery } from 'react-query';
import api from '../../services/api';

const FAQPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedItems, setExpandedItems] = useState(new Set());

  const { data: faqData, isLoading } = useQuery('faq', () => api.get('/api/support/faq'));

  const faqItems = faqData?.data || [];

  const filteredFAQ = faqItems.filter(item =>
    item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleExpanded = (itemId) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  if (isLoading) {
    return <div>Загрузка FAQ...</div>;
  }

  return (
    <div>
      <h1>Часто задаваемые вопросы</h1>

      <div style={{ marginBottom: '30px' }}>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Поиск по вопросам..."
          style={{
            width: '100%',
            padding: '12px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '16px'
          }}
        />
      </div>

      {filteredFAQ.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
          {searchTerm ? 'По вашему запросу ничего не найдено' : 'FAQ пока не заполнен'}
        </div>
      ) : (
        <div>
          {filteredFAQ.map((item) => (
            <div key={item.faq_id} style={{
              border: '1px solid #ddd',
              borderRadius: '8px',
              marginBottom: '10px'
            }}>
              <div
                onClick={() => toggleExpanded(item.faq_id)}
                style={{
                  padding: '20px',
                  cursor: 'pointer',
                  backgroundColor: expandedItems.has(item.faq_id) ? '#f8f9fa' : 'white',
                  borderRadius: '8px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <h4 style={{ margin: 0, fontSize: '16px' }}>{item.question}</h4>
                <span style={{ fontSize: '20px', color: '#666' }}>
                  {expandedItems.has(item.faq_id) ? '−' : '+'}
                </span>
              </div>

              {expandedItems.has(item.faq_id) && (
                <div style={{
                  padding: '0 20px 20px 20px',
                  color: '#666',
                  lineHeight: '1.6'
                }}>
                  <div dangerouslySetInnerHTML={{ __html: item.answer }} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: '40px', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
        <h3>Не нашли ответ на свой вопрос?</h3>
        <p>Обратитесь в нашу службу поддержки, и мы поможем вам решить любую проблему.</p>
        <button
          onClick={() => window.location.href = '/support/create-ticket'}
          style={{
            padding: '12px 24px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Создать обращение
        </button>
      </div>
    </div>
  );
};

export default FAQPage;