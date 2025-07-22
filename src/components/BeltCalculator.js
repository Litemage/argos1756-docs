import React, { useState, useEffect } from 'react';

export const BeltCalculator = () => {
  const [pitch, setPitch] = useState('5');
  const [pulley1Teeth, setPulley1Teeth] = useState('16');
  const [pulley2Teeth, setPulley2Teeth] = useState('24');
  const [desiredCenter, setDesiredCenter] = useState('5.000');
  const [extraCenter, setExtraCenter] = useState('0.000');
  const [mode, setMode] = useState('centerTobelt'); // 'centerTobelt' or 'beltToCenter'
  const [beltLength, setBeltLength] = useState('70');
  const [results, setResults] = useState(null);

  const calculatePitchDiameter = (teeth, pitchMm) => {
    // Convert pitch from mm to inches for diameter calculation
    const pitchInches = pitchMm / 25.4;
    return (teeth * pitchInches) / Math.PI;
  };

  const calculateBeltLength = (pulley1, pulley2, centerDistance, pitchMm) => {
    const pitchInches = pitchMm / 25.4;
    const pd1 = calculatePitchDiameter(pulley1, pitchMm);
    const pd2 = calculatePitchDiameter(pulley2, pitchMm);
    
    // Belt length formula for two different pulleys
    const beltLength = 2 * centerDistance + (Math.PI * (pd1 + pd2) / 2) + Math.pow(pd2 - pd1, 2) / (4 * centerDistance);
    return Math.round(beltLength / pitchInches); // Convert back to teeth
  };

  const calculateCenterDistance = (pulley1, pulley2, beltTeeth, pitchMm) => {
    const pitchInches = pitchMm / 25.4;
    const pd1 = calculatePitchDiameter(pulley1, pitchMm);
    const pd2 = calculatePitchDiameter(pulley2, pitchMm);
    const beltLength = beltTeeth * pitchInches;
    
    // Simplified approach - for HTD belts with different pulleys
    // This uses an iterative approach similar to WCP's calculator
    let centerDistance = (beltLength - Math.PI * (pd1 + pd2) / 2) / 2;
    
    // Refine using the full formula iteratively
    for (let i = 0; i < 10; i++) {
      if (centerDistance <= 0) break;
      
      const correction = Math.pow(pd2 - pd1, 2) / (4 * centerDistance);
      const newCenter = (beltLength - Math.PI * (pd1 + pd2) / 2 - correction) / 2;
      
      if (Math.abs(newCenter - centerDistance) < 0.0001) break;
      centerDistance = newCenter;
    }
    
    return centerDistance > 0 ? centerDistance : 0;
  };

  const calculateBeltOptions = () => {
    const p1 = parseInt(pulley1Teeth);
    const p2 = parseInt(pulley2Teeth);
    const pitchMm = parseFloat(pitch);

    // Validate basic inputs
    if (isNaN(p1) || isNaN(p2) || p1 <= 0 || p2 <= 0) {
      setResults(null);
      return;
    }

    if (mode === 'centerTobelt') {
      // Original mode: Center distance to belt options
      const desired = parseFloat(desiredCenter);
      const extra = parseFloat(extraCenter);
      const totalCenter = desired + extra;

      if (isNaN(desired) || desired <= 0) {
        setResults(null);
        return;
      }

      // Calculate desired belt length in teeth
      const desiredBeltLength = calculateBeltLength(p1, p2, totalCenter, pitchMm);
      
      // Round belt lengths to 5-tooth increments
      const increment = 5;
      const desiredBelt = Math.round(desiredBeltLength / increment) * increment;
      const shorterBelt = desiredBelt - increment;
      const longerBelt = desiredBelt + increment;
      
      // Ensure shorter belt is positive and reasonable
      const finalShorterBelt = shorterBelt > 0 ? shorterBelt : desiredBelt;
      
      // Calculate actual center distances for each belt option
      const shorterCenter = calculateCenterDistance(p1, p2, finalShorterBelt, pitchMm);
      const desiredBeltCenter = calculateCenterDistance(p1, p2, desiredBelt, pitchMm);
      const longerCenter = calculateCenterDistance(p1, p2, longerBelt, pitchMm);

      // Calculate ratio
      const ratio = p2 / p1;

      // Calculate pitch diameters
      const pd1 = calculatePitchDiameter(p1, pitchMm);
      const pd2 = calculatePitchDiameter(p2, pitchMm);

      setResults({
        mode: 'centerTobelt',
        pulley1: { teeth: p1, pitchDiameter: pd1 },
        pulley2: { teeth: p2, pitchDiameter: pd2 },
        ratio: ratio,
        shorterBelt: { teeth: finalShorterBelt, centerDistance: shorterCenter },
        desiredBelt: { teeth: desiredBelt, centerDistance: desiredBeltCenter },
        longerBelt: { teeth: longerBelt, centerDistance: longerCenter }
      });
    } else {
      // New mode: Belt length to center distance
      const beltTeeth = parseInt(beltLength);
      
      if (isNaN(beltTeeth) || beltTeeth <= 0) {
        setResults(null);
        return;
      }

      // Calculate center distance for the specific belt
      const centerDistance = calculateCenterDistance(p1, p2, beltTeeth, pitchMm);
      
      // Calculate ratio
      const ratio = p2 / p1;

      // Calculate pitch diameters
      const pd1 = calculatePitchDiameter(p1, pitchMm);
      const pd2 = calculatePitchDiameter(p2, pitchMm);

      setResults({
        mode: 'beltToCenter',
        pulley1: { teeth: p1, pitchDiameter: pd1 },
        pulley2: { teeth: p2, pitchDiameter: pd2 },
        ratio: ratio,
        beltLength: beltTeeth,
        centerDistance: centerDistance
      });
    }
  };

  // Auto-calculate whenever inputs change
  useEffect(() => {
    calculateBeltOptions();
  }, [pitch, pulley1Teeth, pulley2Teeth, desiredCenter, extraCenter, mode, beltLength]);

  const clearCalculator = () => {
    setPitch('5');
    setPulley1Teeth('16');
    setPulley2Teeth('24');
    setDesiredCenter('5.000');
    setExtraCenter('0.000');
    setResults(null);
  };

  return (
    <div style={{
      border: '2px solid var(--ifm-color-emphasis-300)', 
      borderRadius: '8px', 
      padding: '20px', 
      margin: '20px 0', 
      backgroundColor: 'var(--ifm-background-surface-color)',
      color: 'var(--ifm-color-content)'
    }}>
      <h4 style={{color: 'var(--ifm-color-content)', marginTop: 0}}>Belt Calculator</h4>
      
      {/* Step 1: Select Inputs */}
      <div style={{marginBottom: '20px'}}>
        <h5 style={{color: 'var(--ifm-color-content)', marginBottom: '10px'}}>Step 1: Select Inputs</h5>
        
        <div style={{marginBottom: '15px'}}>
          <label style={{display: 'block', marginBottom: '5px', fontWeight: 'bold', color: 'var(--ifm-color-content)'}}>
            Calculation Mode:
          </label>
          <select 
            value={mode}
            onChange={(e) => setMode(e.target.value)}
            style={{
              width: '250px', 
              padding: '8px', 
              borderRadius: '4px', 
              border: '1px solid var(--ifm-color-emphasis-300)',
              backgroundColor: 'var(--ifm-background-color)',
              color: 'var(--ifm-color-content)',
              marginBottom: '15px'
            }}
          >
            <option value="centerTobelt">Center Distance → Belt Options</option>
            <option value="beltToCenter">Belt Length → Center Distance</option>
          </select>
        </div>

        <div style={{marginBottom: '15px'}}>
          <label style={{display: 'block', marginBottom: '5px', fontWeight: 'bold', color: 'var(--ifm-color-content)'}}>
            Pitch:
          </label>
          <select 
            value={pitch}
            onChange={(e) => setPitch(e.target.value)}
            style={{
              width: '200px', 
              padding: '8px', 
              borderRadius: '4px', 
              border: '1px solid var(--ifm-color-emphasis-300)',
              backgroundColor: 'var(--ifm-background-color)',
              color: 'var(--ifm-color-content)'
            }}
          >
            <option value="5">5mm HTD (Argos Standard)</option>
            <option value="3">3mm HTD</option>
          </select>
        </div>
      </div>

      {/* Step 2: Input Pulleys */}
      <div style={{marginBottom: '20px'}}>
        <h5 style={{color: 'var(--ifm-color-content)', marginBottom: '10px'}}>Step 2: Input Pulleys</h5>
        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px'}}>
          <div>
            <label style={{display: 'block', marginBottom: '5px', fontWeight: 'bold', color: 'var(--ifm-color-content)'}}>
              Pulley #1 (Teeth):
            </label>
            <input 
              type="number" 
              value={pulley1Teeth}
              onChange={(e) => setPulley1Teeth(e.target.value)}
              min="1" 
              placeholder="e.g., 16"
              style={{
                width: '100%', 
                padding: '8px', 
                borderRadius: '4px', 
                border: '1px solid var(--ifm-color-emphasis-300)',
                backgroundColor: 'var(--ifm-background-color)',
                color: 'var(--ifm-color-content)'
              }}
            />
            <div style={{fontSize: '12px', color: 'var(--ifm-color-emphasis-600)', marginTop: '2px'}}>
              Pitch Diameter: {calculatePitchDiameter(parseInt(pulley1Teeth) || 0, parseFloat(pitch)).toFixed(3)}"
            </div>
          </div>
          
          <div>
            <label style={{display: 'block', marginBottom: '5px', fontWeight: 'bold', color: 'var(--ifm-color-content)'}}>
              Pulley #2 (Teeth):
            </label>
            <input 
              type="number" 
              value={pulley2Teeth}
              onChange={(e) => setPulley2Teeth(e.target.value)}
              min="1" 
              placeholder="e.g., 24"
              style={{
                width: '100%', 
                padding: '8px', 
                borderRadius: '4px', 
                border: '1px solid var(--ifm-color-emphasis-300)',
                backgroundColor: 'var(--ifm-background-color)',
                color: 'var(--ifm-color-content)'
              }}
            />
            <div style={{fontSize: '12px', color: 'var(--ifm-color-emphasis-600)', marginTop: '2px'}}>
              Pitch Diameter: {calculatePitchDiameter(parseInt(pulley2Teeth) || 0, parseFloat(pitch)).toFixed(3)}"
            </div>
          </div>
        </div>
      </div>

      {/* Step 3: Mode-specific inputs */}
      <div style={{marginBottom: '20px'}}>
        <h5 style={{color: 'var(--ifm-color-content)', marginBottom: '10px'}}>
          Step 3: {mode === 'centerTobelt' ? 'Desired Center Distance' : 'Belt Length'}
        </h5>
        
        {mode === 'centerTobelt' ? (
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', alignItems: 'end'}}>
            <div>
              <label style={{display: 'block', marginBottom: '5px', fontWeight: 'bold', color: 'var(--ifm-color-content)'}}>
                Desired Center:
              </label>
              <input 
                type="number" 
                value={desiredCenter}
                onChange={(e) => setDesiredCenter(e.target.value)}
                step="0.001"
                placeholder="5.000"
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
                Extra Center:
              </label>
              <input 
                type="number" 
                value={extraCenter}
                onChange={(e) => setExtraCenter(e.target.value)}
                step="0.001"
                placeholder="0.000"
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
              <div style={{fontSize: '14px', color: 'var(--ifm-color-content)', fontWeight: 'bold'}}>
                Ratio: {((parseInt(pulley2Teeth) || 1) / (parseInt(pulley1Teeth) || 1)).toFixed(2)}:1
              </div>
            </div>
          </div>
        ) : (
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', alignItems: 'end'}}>
            <div>
              <label style={{display: 'block', marginBottom: '5px', fontWeight: 'bold', color: 'var(--ifm-color-content)'}}>
                Belt Length (Teeth):
              </label>
              <input 
                type="number" 
                value={beltLength}
                onChange={(e) => setBeltLength(e.target.value)}
                min="1"
                placeholder="e.g., 70"
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
              <div style={{fontSize: '14px', color: 'var(--ifm-color-content)', fontWeight: 'bold'}}>
                Ratio: {((parseInt(pulley2Teeth) || 1) / (parseInt(pulley1Teeth) || 1)).toFixed(2)}:1
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Step 4: Output */}
      <div style={{marginTop: '20px'}}>
        <h5 style={{color: 'var(--ifm-color-content)', marginBottom: '15px'}}>
          Step 4: {mode === 'centerTobelt' ? 'Belt Options' : 'Center Distance Result'}
        </h5>
        
        {mode === 'centerTobelt' ? (
          // Center to Belt mode output
          results && results.mode === 'centerTobelt' && results.shorterBelt && results.desiredBelt && results.longerBelt && (
            <div style={{
              padding: '15px', 
              backgroundColor: 'var(--ifm-color-success-contrast-background)', 
              border: '1px solid var(--ifm-color-success-dark)', 
              borderRadius: '4px'
            }}>
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', textAlign: 'center'}}>
                <div>
                  <div style={{fontWeight: 'bold', color: 'var(--ifm-color-content)', marginBottom: '5px'}}>Shorter Belt</div>
                  <div style={{fontSize: '18px', fontWeight: 'bold', color: 'var(--ifm-color-primary)'}}>{results.shorterBelt.teeth} Tooth</div>
                  <div style={{fontSize: '14px', color: 'var(--ifm-color-content)'}}>Actual Center Distance: {results.shorterBelt.centerDistance.toFixed(3)}"</div>
                </div>
                
                <div>
                  <div style={{fontWeight: 'bold', color: 'var(--ifm-color-content)', marginBottom: '5px'}}>Desired Belt</div>
                  <div style={{fontSize: '18px', fontWeight: 'bold', color: 'var(--ifm-color-primary)'}}>{results.desiredBelt.teeth} Tooth</div>
                  <div style={{fontSize: '14px', color: 'var(--ifm-color-content)'}}>Actual Center Distance: {results.desiredBelt.centerDistance.toFixed(3)}"</div>
                </div>
                
                <div>
                  <div style={{fontWeight: 'bold', color: 'var(--ifm-color-content)', marginBottom: '5px'}}>Longer Belt</div>
                  <div style={{fontSize: '18px', fontWeight: 'bold', color: 'var(--ifm-color-primary)'}}>{results.longerBelt.teeth} Tooth</div>
                  <div style={{fontSize: '14px', color: 'var(--ifm-color-content)'}}>Actual Center Distance: {results.longerBelt.centerDistance.toFixed(3)}"</div>
                </div>
              </div>
            </div>
          )
        ) : (
          // Belt to Center mode output
          results && results.mode === 'beltToCenter' && typeof results.centerDistance === 'number' && (
            <div style={{
              padding: '15px', 
              backgroundColor: 'var(--ifm-color-success-contrast-background)', 
              border: '1px solid var(--ifm-color-success-dark)', 
              borderRadius: '4px',
              textAlign: 'center'
            }}>
              <div style={{fontWeight: 'bold', color: 'var(--ifm-color-content)', marginBottom: '5px'}}>Center Distance</div>
              <div style={{fontSize: '24px', fontWeight: 'bold', color: 'var(--ifm-color-primary)'}}>{results.centerDistance.toFixed(3)}"</div>
            </div>
          )
        )}
        
        {(!results || results.mode !== 'centerTobelt') && mode === 'centerTobelt' && (
          <div style={{
            padding: '15px', 
            backgroundColor: 'var(--ifm-background-color-secondary)', 
            border: '1px solid var(--ifm-color-emphasis-300)', 
            borderRadius: '4px',
            textAlign: 'center',
            color: 'var(--ifm-color-content)',
            fontStyle: 'italic'
          }}>
            Enter pulley sizes and center distance to see belt options
          </div>
        )}
        
        {(!results || results.mode !== 'beltToCenter') && mode === 'beltToCenter' && (
          <div style={{
            padding: '15px', 
            backgroundColor: 'var(--ifm-background-color-secondary)', 
            border: '1px solid var(--ifm-color-emphasis-300)', 
            borderRadius: '4px',
            textAlign: 'center',
            color: 'var(--ifm-color-content)',
            fontStyle: 'italic'
          }}>
            Enter pulley sizes and belt length to calculate center distance
          </div>
        )}
      </div>
    </div>
  );
};

export default BeltCalculator;
