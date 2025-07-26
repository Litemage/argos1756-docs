import React, { useState } from 'react';
import { stockImages } from './ArgosStock';

export default function TagCalculator() {
  // ...existing code...

  const [query, setQuery] = useState('');
  const [modalImg, setModalImg] = useState(null);
  const results = stockImages.filter(img =>
    img.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
  );
  return (
    <div style={{margin: '2em 0', padding: '1em', border: '1px solid #ccc', borderRadius: '8px'}}>
      <h2>Stock Image Tag Search</h2>
      <input
        type="text"
        placeholder="Enter tag (e.g. bolt, nut)"
        value={query}
        onChange={e => setQuery(e.target.value)}
        style={{padding: '0.5em', fontSize: '1em', width: '60%'}}
      />
      <div style={{marginTop: '1em', display: 'flex', flexWrap: 'wrap', gap: '1em'}}>
        {results.length === 0 && query ? <div>No images found.</div> : null}
        {results.map(img => (
          <div key={img.src} style={{textAlign: 'center'}}>
            <img
              src={img.src}
              alt={img.tags.join(', ')}
              style={{maxWidth: '150px', maxHeight: '150px', cursor: 'pointer'}}
              onClick={() => setModalImg(img)}
            />
            <div style={{fontSize: '0.9em', color: '#555'}}>{img.name}</div>
          </div>
        ))}
      </div>
      {modalImg && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0,0,0,0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}
          onClick={() => setModalImg(null)}
        >
          <div style={{textAlign: 'center'}}>
            <img
              src={modalImg.src}
              alt={modalImg.tags.join(', ')}
              style={{maxWidth: '80vw', maxHeight: '80vh', boxShadow: '0 0 20px #000'}}
            />
            <div style={{fontSize: '4em', color: '#fff', marginTop: '0.5em', fontWeight: 'bold', textShadow: '2px 2px 8px #000'}}>{modalImg.name}</div>
          </div>
        </div>
      )}
    </div>
  );
}
// ...existing code...
