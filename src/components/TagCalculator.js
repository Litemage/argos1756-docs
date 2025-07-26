import React, { useState } from 'react';
import { stockImages } from './ArgosStock';

export default function TagCalculator() {
  // ...existing code...

  const [query, setQuery] = useState('');
  const [modalImg, setModalImg] = useState(null);
  const [smartInventory, setSmartInventory] = useState(true);
  const results = stockImages.filter(img =>
    img.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
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
        <label style={{display: 'flex', alignItems: 'center', gap: '0.5em', fontWeight: 'bold', fontSize: '1em', cursor: 'pointer'}}>
          <span>Smart Inventory</span>
          <span style={{position: 'relative', display: 'inline-block', width: '48px', height: '24px'}}>
            <input
              type="checkbox"
              checked={smartInventory}
              onChange={() => setSmartInventory(v => !v)}
              style={{opacity: 0, width: 0, height: 0}}
            />
            <span style={{
              position: 'absolute',
              cursor: 'pointer',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: smartInventory ? 'var(--ifm-color-primary)' : 'var(--ifm-color-emphasis-200)',
              borderRadius: '24px',
              transition: 'background-color 0.2s',
              boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.08)'
            }}>
              <span style={{
                position: 'absolute',
                left: smartInventory ? '26px' : '4px',
                top: '4px',
                width: '16px',
                height: '16px',
                background: 'white',
                borderRadius: '50%',
                transition: 'left 0.2s'
              }} />
            </span>
          </span>
        </label>
      </div>
      <div style={{marginTop: '1em', display: 'flex', flexWrap: 'wrap', gap: '1em'}}>
        {results.length === 0 && query ? <div>No images found.</div> : null}
        {results.map(img => {
          // Find the first matching tag for the current query
          const matchedTag = img.tags.find(tag => tag.toLowerCase().includes(query.toLowerCase()));
          let inventory = null;
          if (matchedTag && img.tagInventory) {
            inventory = img.tagInventory[matchedTag];
          }
          return (
            <div key={img.src} style={{textAlign: 'center'}}>
              <img
                src={img.src}
                alt={img.tags.join(', ')}
                style={{maxWidth: '150px', maxHeight: '150px', cursor: 'pointer'}}
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
              <div style={{fontSize: '0.95em', color: 'var(--ifm-color-content)', fontWeight: 'bold'}}>{img.name}</div>
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
          <div style={{textAlign: 'center'}}>
            <img
              src={modalImg.src}
              alt={modalImg.tags.join(', ')}
              style={{maxWidth: '80vw', maxHeight: '80vh', boxShadow: '0 0 20px #000'}}
            />
            {/* Show matched tag and inventory in modal if a tag is matched in the current search */}
            {(() => {
              // Helper to render inventory as a table
          const renderInventoryTable = (entries) => {
            // Split entries into two separate tables
            const half = Math.ceil(entries.length / 2);
            const leftEntries = entries.slice(0, half);
            const rightEntries = entries.slice(half);
            return (
              <div style={{display: 'flex', gap: '16px', maxHeight: '50vh', overflowY: 'auto', margin: '1em auto 0 auto', minWidth: '480px'}}>
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
              if (smartInventory && modalImg.tagInventory) {
                if (query && modalImg.tags) {
                  const matchedTag = modalImg.tags.find(tag => tag.toLowerCase().includes(query.toLowerCase()));
                  if (matchedTag) {
                    const inventory = modalImg.tagInventory[matchedTag];
                    return renderInventoryTable([[matchedTag, inventory]]);
                  }
                }
                // If no query, show all inventory tags
                if (!query) {
                  return renderInventoryTable(Object.entries(modalImg.tagInventory));
                }
              }
              if (!smartInventory && modalImg.tagInventory) {
                // Show all inventory items if Smart Inventory is off
                return renderInventoryTable(Object.entries(modalImg.tagInventory));
              }
              return null;
            })()}
            <div style={{fontSize: '4em', color: '#fff', marginTop: '0.5em', fontWeight: 'bold', textShadow: '2px 2px 8px #000'}}>{modalImg.name}</div>
          </div>
        </div>
      )}
    </div>
  );
}
// ...existing code...
