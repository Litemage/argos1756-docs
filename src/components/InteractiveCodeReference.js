import React, { useState } from 'react';
import { codeSnippets, commonReferences } from './codeSnippets';

function cleanToken(token) {
  // Remove punctuation and braces from start/end
  return token.replace(/^[^\w]+|[^\w]+$/g, '');
}

function getReference(references, token) {
  return references[token] || references['#' + token] || references[token.replace(/^#/, '')] || commonReferences[token] || commonReferences['#' + token] || commonReferences[token.replace(/^#/, '')];
}

export default function InteractiveCodeReference({ allowCustom = true, showDropdown = true, snippet }) {
  const initialSnippet = snippet || 'Drivetrain Example';
  const [selectedSnippet, setSelectedSnippet] = useState(initialSnippet);
  const [selected, setSelected] = useState(null);
  const [customMode, setCustomMode] = useState(false);
  const [customCode, setCustomCode] = useState('');
  const code = customMode ? customCode : codeSnippets[selectedSnippet].code;
  const references = customMode ? {} : codeSnippets[selectedSnippet].references;
  const lines = code.split('\n');

  return (
    <div style={{
      background: 'var(--ifm-background-surface)',
      border: '1px solid var(--ifm-color-emphasis-300)',
      borderRadius: 8,
      padding: '1em',
      margin: '2em 0',
      fontFamily: 'monospace',
      fontSize: '1em',
      overflowX: 'auto',
      position: 'relative'
    }}>
      <div style={{display: 'flex', alignItems: 'center', marginBottom: '1em', gap: '1em'}}>
        <span style={{fontWeight: 'bold'}}>Code Example:</span>
        {!customMode && showDropdown && (
          <select value={selectedSnippet} onChange={e => { setSelectedSnippet(e.target.value); setSelected(null); }} style={{fontSize: '1em', padding: '0.2em 0.5em', borderRadius: 4}}>
            {Object.keys(codeSnippets).map(name => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>
        )}
        {allowCustom && (
          <label style={{ display: 'flex', alignItems: 'center', marginLeft: '1em', cursor: 'pointer', userSelect: 'none', gap: '0.5em' }}>
            <span style={{ fontWeight: 'bold', color: customMode ? 'var(--ifm-color-primary)' : 'inherit' }}>
              Custom Code
            </span>
            <input
              type="checkbox"
              checked={customMode}
              onChange={e => { setCustomMode(e.target.checked); setSelected(null); }}
              style={{ width: 0, height: 0, opacity: 0, position: 'absolute' }}
            />
            <span
              style={{
                width: 40,
                height: 22,
                background: customMode ? 'var(--ifm-color-primary)' : 'var(--ifm-color-emphasis-200)',
                borderRadius: 12,
                position: 'relative',
                transition: 'background 0.2s',
                display: 'inline-block',
              }}
            >
              <span
                style={{
                  position: 'absolute',
                  left: customMode ? 20 : 2,
                  top: 2,
                  width: 18,
                  height: 18,
                  background: '#fff',
                  borderRadius: '50%',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.12)',
                  transition: 'left 0.2s',
                  border: '1px solid var(--ifm-color-emphasis-300)'
                }}
              />
            </span>
            <span style={{ fontWeight: 'bold', color: !customMode ? 'var(--ifm-color-primary)' : 'inherit' }}>
              Preset Code
            </span>
          </label>
        )}
        <span style={{color: 'var(--ifm-color-primary)', marginLeft: 'auto'}}>Tip: Click highlighted code items for quick reference!</span>
      </div>
      {allowCustom && customMode && (
        <textarea
          value={customCode}
          onChange={e => { setCustomCode(e.target.value); setSelected(null); }}
          placeholder="Paste your code here..."
          rows={8}
          style={{
            width: '100%',
            fontFamily: 'monospace',
            fontSize: '1em',
            marginBottom: '1em',
            borderRadius: 6,
            border: '1px solid var(--ifm-color-emphasis-300)',
            padding: '0.5em',
            background: 'var(--ifm-background-surface)'
          }}
        />
      )}
      <div style={{
        fontFamily: 'monospace',
        fontSize: '1em',
        lineHeight: '1.6em',
        whiteSpace: 'pre',
        position: 'relative',
        margin: 0,
        padding: 0,
        background: 'transparent'
      }}>
        {lines.map((line, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'center',
              minHeight: '1.6em',
              lineHeight: '1.6em',
              background: selected === `line-${i}` ? 'var(--ifm-color-primary)' : 'transparent',
              color: selected === `line-${i}` ? '#fff' : undefined,
              borderRadius: 4,
              cursor: 'pointer',
              padding: '0 2px',
              margin: 0,
              transition: 'background 0.2s',
              position: 'relative'
            }}
            title="Click to select line"
            onClick={() => setSelected(`line-${i}`)}
          >
            {line.split(/(\s+|[;{}()<>])/).map((token, j) => {
              const cleaned = cleanToken(token);
              const ref = getReference(references, cleaned);
              if (ref && cleaned) {
                return (
                  <span
                    key={j}
                    style={{
                      background: selected === cleaned ? 'var(--ifm-color-primary)' : 'var(--ifm-color-emphasis-200)',
                      color: selected === cleaned ? '#fff' : 'var(--ifm-color-primary)',
                      fontWeight: 'bold',
                      borderRadius: 4,
                      cursor: 'pointer',
                      padding: '0 2px',
                      margin: '0 1px',
                      transition: 'background 0.2s',
                      lineHeight: '1.6em',
                      display: 'inline-block'
                    }}
                    title="Click for reference"
                    onClick={e => { e.stopPropagation(); setSelected(cleaned); }}
                  >
                    {token}
                  </span>
                );
              }
              return <span key={j} style={{lineHeight: '1.6em', display: 'inline-block'}}>{token}</span>;
            })}
          </div>
        ))}
      </div>
      <div style={{
        marginTop: '1em',
        minHeight: '2em',
        background: selected ? 'var(--ifm-color-emphasis-200)' : 'transparent',
        borderRadius: 6,
        padding: selected ? '1em' : 0,
        color: 'var(--ifm-color-primary)',
        fontWeight: 'bold',
        boxShadow: selected ? '0 2px 8px rgba(0,0,0,0.08)' : 'none'
      }}>
        {selected && selected.startsWith('line-')
          ? (() => {
              const idx = parseInt(selected.replace('line-', ''));
              const line = lines[idx];
              // Check for a full line reference
              const lineRef = getReference(references, line);
              // Find all tokens in the line that have references
              const tokens = line.split(/(\s+|[;{}()<>])/).map(cleanToken).filter(Boolean);
              const foundRefs = tokens
                .map(token => getReference(references, token))
                .filter(Boolean);
              if (!lineRef && foundRefs.length === 0) return <span>{line}</span>;
              return (
                <div>
                  {lineRef && (
                    <div style={{marginBottom: '0.5em', color: 'var(--ifm-color-primary)'}}>
                      <strong>Line Explanation:</strong> {typeof lineRef === 'string' ? lineRef : lineRef.text}
                      {lineRef.link && (
                        <><br /><a href={lineRef.link} style={{color: '#0074d9', fontWeight: 'bold', textDecoration: 'underline'}} target="_blank" rel="noopener noreferrer">Quick Reference Guide</a></>)}
                    </div>
                  )}
                  {foundRefs.length > 0 && (
                    <div style={{marginBottom: '0.5em', fontWeight: 'normal', color: 'var(--ifm-color-primary)'}}>References for this line:</div>
                  )}
                  {foundRefs.map((ref, i) => (
                    <div key={i} style={{marginBottom: '0.5em'}}>
                      {typeof ref === 'string' ? ref : (
                        <span>
                          {ref.text}
                          {ref.link && (
                            <><br /><a href={ref.link} style={{color: '#0074d9', fontWeight: 'bold', textDecoration: 'underline'}} target="_blank" rel="noopener noreferrer">Quick Reference Guide</a></>)}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              );
            })()
          : selected
            ? (() => {
                const ref = getReference(references, selected);
                if (!ref) return 'Click a highlighted code item to see its quick reference.';
                if (typeof ref === 'string') return ref;
                return (
                  <span>
                    {ref.text}
                    {ref.link && (
                      <><br /><a href={ref.link} style={{color: '#0074d9', fontWeight: 'bold', textDecoration: 'underline'}} target="_blank" rel="noopener noreferrer">Quick Reference Guide</a></>)}
                  </span>
                );
              })()
            : 'Click a highlighted code item or line to see its quick reference.'}
      </div>
    </div>
  );
}
