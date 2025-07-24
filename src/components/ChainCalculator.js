import React, { useState, useEffect } from 'react';

export const ChainCalculator = () => {
  const [chainType, setChainType] = useState('25');
  const [sprocket1Teeth, setSprocket1Teeth] = useState('16');
  const [sprocket2Teeth, setSprocket2Teeth] = useState('16');
  const [desiredCenter, setDesiredCenter] = useState('5.000');
  const [extraTension, setExtraTension] = useState('0');
  const [results, setResults] = useState(null);

  const getChainPitch = (type) => {
    // Chain pitch in inches
    if (type === '25') return 0.25;
    if (type === '35') return 0.375;
    return 0.25;
  };

  const calculateSprocketPitchDiameter = (teeth, pitch) => {
    // Pitch diameter = teeth × pitch / π
    return (teeth * pitch) / Math.PI;
  };

  const calculateChainLength = (sprocket1, sprocket2, centerDistance, pitch) => {
    const pd1 = calculateSprocketPitchDiameter(sprocket1, pitch);
    const pd2 = calculateSprocketPitchDiameter(sprocket2, pitch);
    
    // Chain length formula for two sprockets
    const chainLength = 2 * centerDistance + (Math.PI * (pd1 + pd2) / 2) + Math.pow(pd2 - pd1, 2) / (4 * centerDistance);
    return chainLength / pitch; // Convert to number of links
  };

  const calculateCenterDistance = (sprocket1, sprocket2, chainLinks, pitch) => {
    const pd1 = calculateSprocketPitchDiameter(sprocket1, pitch);
    const pd2 = calculateSprocketPitchDiameter(sprocket2, pitch);
    const chainLength = chainLinks * pitch;
    
    // Use iterative approach for center distance calculation
    let centerDistance = (chainLength - Math.PI * (pd1 + pd2) / 2) / 2;
    
    // Refine using the full formula iteratively
    for (let i = 0; i < 10; i++) {
      if (centerDistance <= 0) break;
      
      const correction = Math.pow(pd2 - pd1, 2) / (4 * centerDistance);
      const newCenter = (chainLength - Math.PI * (pd1 + pd2) / 2 - correction) / 2;
      
      if (Math.abs(newCenter - centerDistance) < 0.0001) break;
      centerDistance = newCenter;
    }
    
    return centerDistance > 0 ? centerDistance : 0;
  };

  const calculateChainOptions = () => {
    const s1 = parseInt(sprocket1Teeth);
    const s2 = parseInt(sprocket2Teeth);
    const pitch = getChainPitch(chainType);
    const tension = parseFloat(extraTension);

    // Validate basic inputs
    if (isNaN(s1) || isNaN(s2) || s1 <= 0 || s2 <= 0) {
      setResults(null);
      return;
    }

    const desired = parseFloat(desiredCenter);
    if (isNaN(desired) || desired <= 0) {
      setResults(null);
      return;
    }

    // Add tension to desired center distance
    const totalCenter = desired + tension;

    // Calculate desired chain length in links using ONLY the desired center (no tension)
    const desiredChainLength = calculateChainLength(s1, s2, desired, pitch);
    
    // Round to nearest even number of links (chains need even links to splice correctly)
    let exactLinks = Math.round(desiredChainLength);
    if (exactLinks % 2 !== 0) {
      // If odd, choose the closest even number
      const lowerEven = exactLinks - 1;
      const upperEven = exactLinks + 1;
      exactLinks = (Math.abs(desiredChainLength - lowerEven) < Math.abs(desiredChainLength - upperEven)) ? lowerEven : upperEven;
    }
    
    const shorterLinks = exactLinks - 2; // 2 links shorter (still even)
    const longerLinks = exactLinks + 2;  // 2 links longer (still even)
    
    // Ensure shorter chain is positive
    const finalShorterLinks = shorterLinks > 0 ? shorterLinks : exactLinks;
    
    // Calculate actual center distances for each chain option, add tension
    const shorterCenter = calculateCenterDistance(s1, s2, finalShorterLinks, pitch) + tension;
    const exactCenter = calculateCenterDistance(s1, s2, exactLinks, pitch) + tension;
    const longerCenter = calculateCenterDistance(s1, s2, longerLinks, pitch) + tension;

    // Calculate ratio
    const ratio = s2 / s1;

    // Calculate pitch diameters
    const pd1 = calculateSprocketPitchDiameter(s1, pitch);
    const pd2 = calculateSprocketPitchDiameter(s2, pitch);

    setResults({
      sprocket1: { teeth: s1, pitchDiameter: pd1 },
      sprocket2: { teeth: s2, pitchDiameter: pd2 },
      ratio: ratio,
      chainType: chainType,
      pitch: pitch,
      totalCenter: totalCenter,
      shorterChain: { links: finalShorterLinks, centerDistance: shorterCenter },
      exactChain: { links: exactLinks, centerDistance: exactCenter },
      longerChain: { links: longerLinks, centerDistance: longerCenter }
    });
  };

  // Auto-calculate whenever inputs change
  useEffect(() => {
    calculateChainOptions();
  }, [chainType, sprocket1Teeth, sprocket2Teeth, desiredCenter, extraTension]);

  return (
    <div style={{
      border: '2px solid var(--ifm-color-emphasis-300)', 
      borderRadius: '8px', 
      padding: '20px', 
      margin: '20px 0', 
      backgroundColor: 'var(--ifm-background-surface-color)',
      color: 'var(--ifm-color-content)'
    }}>
      <h4 style={{color: 'var(--ifm-color-content)', marginTop: 0}}>Chain Calculator</h4>
      
      {/* Step 1: Select Chain Type */}
      <div style={{marginBottom: '20px'}}>
        <h5 style={{color: 'var(--ifm-color-content)', marginBottom: '10px'}}>Step 1: Select Chain Type</h5>
        
        <div style={{marginBottom: '15px'}}>
          <label style={{display: 'block', marginBottom: '5px', fontWeight: 'bold', color: 'var(--ifm-color-content)'}}>
            Chain Type:
          </label>
          <select 
            value={chainType}
            onChange={(e) => setChainType(e.target.value)}
            style={{
              width: '350px', 
              padding: '8px', 
              borderRadius: '4px', 
              border: '1px solid var(--ifm-color-emphasis-300)',
              backgroundColor: 'var(--ifm-background-color)',
              color: 'var(--ifm-color-content)'
            }}
          >
            <option value="25">#25 Chain (0.25" pitch) - Argos Standard</option>
            <option value="35">#35 Chain (0.375" pitch)</option>
          </select>
        </div>
      </div>

      {/* Step 2: Input Sprockets */}
      <div style={{marginBottom: '20px'}}>
        <h5 style={{color: 'var(--ifm-color-content)', marginBottom: '10px'}}>Step 2: Input Sprockets</h5>
        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px'}}>
          <div>
            <label style={{display: 'block', marginBottom: '5px', fontWeight: 'bold', color: 'var(--ifm-color-content)'}}>
              Sprocket #1 (Teeth):
            </label>
            <input 
              type="number" 
              value={sprocket1Teeth}
              onChange={(e) => setSprocket1Teeth(e.target.value)}
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
              Pitch Diameter: {calculateSprocketPitchDiameter(parseInt(sprocket1Teeth) || 0, getChainPitch(chainType)).toFixed(3)}"
            </div>
          </div>
          
          <div>
            <label style={{display: 'block', marginBottom: '5px', fontWeight: 'bold', color: 'var(--ifm-color-content)'}}>
              Sprocket #2 (Teeth):
            </label>
            <input 
              type="number" 
              value={sprocket2Teeth}
              onChange={(e) => setSprocket2Teeth(e.target.value)}
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
              Pitch Diameter: {calculateSprocketPitchDiameter(parseInt(sprocket2Teeth) || 0, getChainPitch(chainType)).toFixed(3)}"
            </div>
          </div>
        </div>
      </div>

      {/* Step 3: Desired Center Distance */}
      <div style={{marginBottom: '20px'}}>
        <h5 style={{color: 'var(--ifm-color-content)', marginBottom: '10px'}}>Step 3: Desired Center Distance</h5>
        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', alignItems: 'start'}}>
          <div>
            <label style={{display: 'block', marginBottom: '5px', fontWeight: 'bold', color: 'var(--ifm-color-content)'}}>
              Desired Center (inches):
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
              Extra for Tension (inches):
            </label>
            <input 
              type="number" 
              value={extraTension}
              onChange={(e) => setExtraTension(e.target.value)}
              step="0.001"
              placeholder="0"
              style={{
                width: '100%', 
                padding: '8px', 
                borderRadius: '4px', 
                border: '1px solid var(--ifm-color-emphasis-300)',
                backgroundColor: 'var(--ifm-background-color)',
                color: 'var(--ifm-color-content)'
              }}
            />
            <div style={{fontSize: '11px', color: 'var(--ifm-color-emphasis-600)', marginTop: '2px'}}>
              Add 0.018" for #25 chain tension if needed
            </div>
          </div>

          <div style={{paddingTop: '29px'}}>
            <div style={{fontSize: '14px', color: 'var(--ifm-color-content)', fontWeight: 'bold'}}>
              Ratio: {((parseInt(sprocket2Teeth) || 1) / (parseInt(sprocket1Teeth) || 1)).toFixed(2)}:1
            </div>
          </div>
        </div>
      </div>
      
      {/* Step 4: Chain Options */}
      <div style={{marginTop: '20px'}}>
        <h5 style={{color: 'var(--ifm-color-content)', marginBottom: '15px'}}>Step 4: Chain Options</h5>
        
        {results ? (
          <div style={{
            padding: '15px', 
            backgroundColor: 'var(--ifm-color-success-contrast-background)', 
            border: '1px solid var(--ifm-color-success-dark)', 
            borderRadius: '4px'
          }}>
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', textAlign: 'center'}}>
              <div>
                <div style={{fontWeight: 'bold', color: 'var(--ifm-color-content)', marginBottom: '5px'}}>Shorter Chain</div>
                <div style={{fontSize: '18px', fontWeight: 'bold', color: 'var(--ifm-color-primary)'}}>{results.shorterChain.links} Links</div>
                <div style={{fontSize: '14px', color: 'var(--ifm-color-content)'}}>Actual Center: {results.shorterChain.centerDistance.toFixed(3)}"</div>
              </div>
              
              <div>
                <div style={{fontWeight: 'bold', color: 'var(--ifm-color-content)', marginBottom: '5px'}}>Closest Match</div>
                <div style={{fontSize: '18px', fontWeight: 'bold', color: 'var(--ifm-color-primary)'}}>{results.exactChain.links} Links</div>
                <div style={{fontSize: '14px', color: 'var(--ifm-color-content)'}}>Actual Center: {results.exactChain.centerDistance.toFixed(3)}"</div>
              </div>
              
              <div>
                <div style={{fontWeight: 'bold', color: 'var(--ifm-color-content)', marginBottom: '5px'}}>Longer Chain</div>
                <div style={{fontSize: '18px', fontWeight: 'bold', color: 'var(--ifm-color-primary)'}}>{results.longerChain.links} Links</div>
                <div style={{fontSize: '14px', color: 'var(--ifm-color-content)'}}>Actual Center: {results.longerChain.centerDistance.toFixed(3)}"</div>
              </div>
            </div>
          </div>
        ) : (
          <div style={{
            padding: '15px', 
            backgroundColor: 'var(--ifm-background-color-secondary)', 
            border: '1px solid var(--ifm-color-emphasis-300)', 
            borderRadius: '4px',
            textAlign: 'center',
            color: 'var(--ifm-color-content)',
            fontStyle: 'italic'
          }}>
            Enter sprocket sizes and center distance to see chain options
          </div>
        )}
      </div>
    </div>
  );
};

export default ChainCalculator;
