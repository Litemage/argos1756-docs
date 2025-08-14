import React, { useState } from 'react';
import { ArgosStock } from './ArgosStock';

export default function ArgosInventorySearch() {
  // ...existing code...

  const [query, setQuery] = useState('');
  const [modalImg, setModalImg] = useState(null);
  const results = ArgosStock.filter(img =>
    Object.keys(img.tagInventory).some(tag => tag.toLowerCase().includes(query.toLowerCase()))
  );
  return (
    <div style={{margin: '2em 0', padding: '1em', border: '1px solid #ccc', borderRadius: '8px'}}>
      <h2>Stock Image Tag Search</h2>
      <div style={{display: 'flex', alignItems: 'center', gap: '1.5em', marginBottom: '1em'}}>
        <input
          type="text"
          placeholder="Enter tag (e.g. bolt, nut)"
          value={query}
          onChange={e => setQuery(e.target.value)}
          style={{padding: '0.5em', fontSize: '1em', width: '60%'}}
        />
      </div>
      <div style={{marginTop: '1em', display: 'flex', flexWrap: 'wrap', gap: '1em'}}>
        {results.length === 0 && query ? <div>No images found.</div> : null}
        {results.map(img => {
          // Find the first matching tag for the current query
          const matchedTag = Object.keys(img.tagInventory).find(tag => tag.toLowerCase().includes(query.toLowerCase()));
          let inventory = null;
          if (matchedTag && img.tagInventory) {
            inventory = img.tagInventory[matchedTag];
          }
          return (
            <div key={img.src} style={{textAlign: 'center'}}>
              <img
                src={img.src}
                alt={Object.keys(img.tagInventory).join(', ')}
                style={{width: '150px', height: '150px', objectFit: 'cover', cursor: 'pointer', borderRadius: '8px', background: '#f8f8f8'}}
                onClick={() => setModalImg(img)}
              />
              {query && matchedTag && (
                <div style={{fontSize: '0.95em', color: 'var(--ifm-color-content)', fontWeight: 'bold'}}>
                  {matchedTag.replace(/\b\w/g, c => c.toUpperCase())}
                  {inventory !== undefined ? (
                    <span style={{color: 'var(--ifm-color-emphasis-600)'}}> ({inventory})</span>
                  ) : ''}
                </div>
              )}
              <div style={{fontSize: '0.95em', color: 'var(--ifm-color-content)', fontWeight: 'bold'}}>{img.Location_Name}</div>
            </div>
          );
        })}
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
          <div style={{textAlign: 'center', maxWidth: '90vw', maxHeight: '90vh', overflowY: 'auto', background: 'rgba(0,0,0,0.85)', borderRadius: '12px', padding: '2em 1em'}}>
            <img
              src={modalImg.src}
              alt={Object.keys(modalImg.tagInventory).join(', ')}
              style={{maxWidth: '80vw', maxHeight: '40vh', boxShadow: '0 0 20px #000', marginBottom: '1em'}}
            />
            {/* Inventory tables are always scrollable if too large */}
            {(() => {
              // Helper to render inventory as a table
              const renderInventoryTable = (entries) => {
                const half = Math.ceil(entries.length / 2);
                const leftEntries = entries.slice(0, half);
                const rightEntries = entries.slice(half);
                return (
                  <div style={{display: 'flex', gap: '16px', maxHeight: '40vh', overflowY: 'auto', margin: '1em auto 0 auto', minWidth: '480px', justifyContent: 'center'}}>
                    <table style={{width: '50%', color: '#fff', background: 'rgba(0,0,0,0.5)', borderCollapse: 'collapse', fontSize: '1.1em', boxShadow: '0 0 10px #000'}}>
                      <tbody>
                        {leftEntries.map(([tag, count], idx) => (
                          <tr key={idx}>
                            <td style={{padding: '0.4em 1em', fontWeight: 'bold'}}>{tag.replace(/\b\w/g, c => c.toUpperCase())}</td>
                            <td style={{padding: '0.4em 1em', color: '#ffd700', textAlign: 'right'}}>{count !== undefined && count !== null && count !== 'unknown' ? count : 'N/A'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <table style={{width: '50%', color: '#fff', background: 'rgba(0,0,0,0.5)', borderCollapse: 'collapse', fontSize: '1.1em', boxShadow: '0 0 10px #000'}}>
                      <tbody>
                        {rightEntries.map(([tag, count], idx) => (
                          <tr key={idx}>
                            <td style={{padding: '0.4em 1em', fontWeight: 'bold'}}>{tag.replace(/\b\w/g, c => c.toUpperCase())}</td>
                            <td style={{padding: '0.4em 1em', color: '#ffd700', textAlign: 'right'}}>{count !== undefined && count !== null && count !== 'unknown' ? count : 'N/A'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                );
              };
              if (modalImg && modalImg.tagInventory) {
                // Always show all inventory
                return renderInventoryTable(Object.entries(modalImg.tagInventory));
              }
              return null;
            })()}
            <div style={{fontSize: '4em', color: '#fff', marginTop: '0.5em', fontWeight: 'bold', textShadow: '2px 2px 8px #000'}}>{modalImg.Location_Name}</div>
          </div>
        </div>
      )}
    </div>
  );
}
// ...existing code...
