import React, { useState, useEffect } from 'react';

export const GearCalculator = () => {
  const [gear1Teeth, setGear1Teeth] = useState('');
  const [gear2Teeth, setGear2Teeth] = useState('');
  const [diametralPitch, setDiametralPitch] = useState('20');
  const [extraDistance, setExtraDistance] = useState('0.003');
  const [result, setResult] = useState('');
  const [showResult, setShowResult] = useState(false);

  const calculateCenterDistance = () => {
    const g1 = parseFloat(gear1Teeth);
    const g2 = parseFloat(gear2Teeth);
    const dp = parseFloat(diametralPitch);
    const extra = parseFloat(extraDistance);
    
    if (isNaN(g1) || isNaN(g2) || g1 <= 0 || g2 <= 0) {
      setShowResult(false);
      return;
    }
    
    const centerDistance = ((g1 + g2) / (2 * dp)) + extra;
    
    setResult(`Calculation: ((${g1} + ${g2}) / (2 × ${dp})) + ${extra}
Center Distance = ${centerDistance.toFixed(3)} inches`);
    setShowResult(true);
  };

  // Auto-calculate whenever inputs change
  useEffect(() => {
    calculateCenterDistance();
  }, [gear1Teeth, gear2Teeth, diametralPitch, extraDistance]);

  return (
    <div style={{
      border: '2px solid var(--ifm-color-emphasis-300)', 
      borderRadius: '8px', 
      padding: '20px', 
      margin: '20px 0', 
      backgroundColor: 'var(--ifm-background-surface-color)',
      color: 'var(--ifm-color-content)'
    }}>
      <h4 style={{color: 'var(--ifm-color-content)', marginTop: 0}}>Gear Center Distance Calculator</h4>
      
      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px'}}>
        <div>
          <label style={{display: 'block', marginBottom: '5px', fontWeight: 'bold', color: 'var(--ifm-color-content)'}}>
            Gear 1 - Number of Teeth:
          </label>
          <input 
            type="number" 
            value={gear1Teeth}
            onChange={(e) => setGear1Teeth(e.target.value)}
            min="1" 
            placeholder="e.g., 60"
            style={{
              width: '100%', 
              padding: '8px', 
              borderRadius: '4px', 
              border: '1px solid var(--ifm-color-emphasis-300)',
              backgroundColor: 'var(--ifm-background-color)',
              color: 'var(--ifm-color-content)'
            }}
          />
        </div>
        
        <div>
          <label style={{display: 'block', marginBottom: '5px', fontWeight: 'bold', color: 'var(--ifm-color-content)'}}>
            Gear 2 - Number of Teeth:
          </label>
          <input 
            type="number" 
            value={gear2Teeth}
            onChange={(e) => setGear2Teeth(e.target.value)}
            min="1" 
            placeholder="e.g., 20"
            style={{
              width: '100%', 
              padding: '8px', 
              borderRadius: '4px', 
              border: '1px solid var(--ifm-color-emphasis-300)',
              backgroundColor: 'var(--ifm-background-color)',
              color: 'var(--ifm-color-content)'
            }}
          />
        </div>
      </div>
      
      <div style={{marginBottom: '15px'}}>
        <label style={{display: 'block', marginBottom: '5px', fontWeight: 'bold', color: 'var(--ifm-color-content)'}}>
          Diametral Pitch (DP):
        </label>
        <select 
          value={diametralPitch}
          onChange={(e) => setDiametralPitch(e.target.value)}
          style={{
            width: '200px', 
            padding: '8px', 
            borderRadius: '4px', 
            border: '1px solid var(--ifm-color-emphasis-300)',
            backgroundColor: 'var(--ifm-background-color)',
            color: 'var(--ifm-color-content)'
          }}
        >
          <option value="20">20DP (Argos Standard)</option>
          <option value="32">32DP</option>
        </select>
      </div>
      
      <div style={{marginBottom: '15px'}}>
        <label style={{display: 'block', marginBottom: '5px', fontWeight: 'bold', color: 'var(--ifm-color-content)'}}>
          Extra Distance (inches):
        </label>
        <input 
          type="number" 
          value={extraDistance}
          onChange={(e) => setExtraDistance(e.target.value)}
          step="0.001"
          style={{
            width: '150px', 
            padding: '8px', 
            borderRadius: '4px', 
            border: '1px solid var(--ifm-color-emphasis-300)',
            backgroundColor: 'var(--ifm-background-color)',
            color: 'var(--ifm-color-content)'
          }}
        />
      </div>
      
      {showResult && (
        <div style={{
          marginTop: '20px', 
          padding: '15px', 
          backgroundColor: 'var(--ifm-color-success-contrast-background)', 
          border: '1px solid var(--ifm-color-success-dark)', 
          borderRadius: '4px'
        }}>
          <h5 style={{margin: '0 0 10px 0', color: 'var(--ifm-color-content)'}}>Result:</h5>
          <div style={{fontSize: '18px', fontWeight: 'bold', color: 'var(--ifm-color-primary)', whiteSpace: 'pre-line'}}>
            {result}
          </div>
        </div>
      )}
      
      {!showResult && (
        <div style={{
          marginTop: '20px', 
          padding: '15px', 
          backgroundColor: 'var(--ifm-background-color-secondary)', 
          border: '1px solid var(--ifm-color-emphasis-300)', 
          borderRadius: '4px',
          textAlign: 'center',
          color: 'var(--ifm-color-content)',
          fontStyle: 'italic'
        }}>
          Enter valid gear teeth values to see center distance calculation
        </div>
      )}
    </div>
  );
};

export default GearCalculator;
