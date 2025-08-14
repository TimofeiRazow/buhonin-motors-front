import React from 'react';
import ListingCard from './ListingCard';

const ListingGrid = ({ listings }) => {
  if (!listings || listings.length === 0) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '60px 20px',
        backgroundColor: 'white',
        borderRadius: '8px',
        border: '1px solid #ddd'
      }}>
        <h3 style={{ marginBottom: '10px' }}>
          Объявления не найдены
        </h3>
        <p style={{ color: '#666' }}>
          Попробуйте изменить параметры поиска.
        </p>
      </div>
    );
  }

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
      gap: '20px'
    }}>
      {listings.map(listing => (
        <ListingCard key={listing.listing_id} listing={listing} />
      ))}
    </div>
  );
};

export default ListingGrid;