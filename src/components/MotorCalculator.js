import React, { useState, useEffect } from 'react';
import { motorSpecs, getMotorDropdownOptions, convertTorque } from './motorSpecs';

export const MotorCalculator = () => {
  const [motorType, setMotorType] = useState('krakenx60');
  const [motorCount, setMotorCount] = useState('1');
  const [inputMode, setInputMode] = useState('ratio'); // 'ratio' or 'gears'
  const [outputMode, setOutputMode] = useState('basic'); // 'basic', 'wheel', 'arm', or 'elevator'
  const [spoolDiameter, setSpoolDiameter] = useState('1.5'); // inches, for elevator
  const [elevatorLoad, setElevatorLoad] = useState('0'); // pounds, for elevator
  const [gearRatio, setGearRatio] = useState('1');
  const [wheelDiameter, setWheelDiameter] = useState('4'); // inches
  const [armLength, setArmLength] = useState('24'); // inches
  const [armLoad, setArmLoad] = useState('0'); // pounds
  const [gearStages, setGearStages] = useState([
    { drivingTeeth: '16', drivenTeeth: '16' }
  ]);
  const [results, setResults] = useState(null);

  // Motor specifications - now imported from separate file
  // Available via: motorSpecs object

  const addGearStage = () => {
    setGearStages([...gearStages, { drivingTeeth: '16', drivenTeeth: '16' }]);
  };

  const removeGearStage = (index) => {
    if (gearStages.length > 1) {
      const newStages = gearStages.filter((_, i) => i !== index);
      setGearStages(newStages);
    }
  };

  const updateGearStage = (index, field, value) => {
    const newStages = [...gearStages];
    newStages[index][field] = value;
    setGearStages(newStages);
  };

  const calculateGearRatioFromStages = () => {
    let totalRatio = 1;
    for (const stage of gearStages) {
      const driving = parseFloat(stage.drivingTeeth);
      const driven = parseFloat(stage.drivenTeeth);
      if (!isNaN(driving) && !isNaN(driven) && driving > 0 && driven > 0) {
        totalRatio *= (driven / driving); // Gear ratio = output teeth / input teeth
      }
    }
    return totalRatio;
  };

  const calculateMotorPerformance = () => {
    let ratio;
    
    if (inputMode === 'ratio') {
      ratio = parseFloat(gearRatio);
    } else {
      ratio = calculateGearRatioFromStages();
    }
    
    // Validate inputs
    if (isNaN(ratio) || ratio <= 0) {
      setResults(null);
      return;
    }

    const motor = motorSpecs[motorType];
    if (!motor) {
      setResults(null);
      return;
    }

    const numMotors = parseInt(motorCount) || 1;
    const efficiency = 0.8; // Hardcoded to 80%

    // Calculate geared performance with efficiency
    const gearedFreeSpeed = motor.freeSpeed / ratio; // RPM (same regardless of motor count, efficiency doesn't affect free speed significantly)
    const gearedMaxTorque = motor.stallTorque * ratio * numMotors * efficiency; // N⋅m (reduced by efficiency)
    const stallCurrentOutput = motor.stallCurrent * numMotors; // Current multiplied by motor count (efficiency doesn't reduce current draw)

    // Convert N⋅m to in⋅lbs for better FRC understanding
    const torqueInLbs = convertTorque.NmToInLbs(gearedMaxTorque);
    
    // Stall load in lbs (max weight that can be held at stall)
    let stallLoadLbs = null;
    if (outputMode === 'arm') {
      const armLen = parseFloat(armLength);
      if (!isNaN(armLen) && armLen > 0) {
        stallLoadLbs = torqueInLbs / armLen;
      }
    }

    // Current draw per motor under load (arm mode only, linear estimate)
    let loadedCurrentPerMotor = null;
    if (outputMode === 'arm' && armLoad > 0 && stallLoadLbs) {
      // Estimate: loaded current = freeCurrent + (stallCurrent - freeCurrent) * (armLoad / stallLoadLbs)
      const loadRatio = Math.min(parseFloat(armLoad) / stallLoadLbs, 1);
      loadedCurrentPerMotor = motor.freeCurrent + (motor.stallCurrent - motor.freeCurrent) * loadRatio;
    }

    // Calculate wheel surface speed if in wheel mode
    let wheelSurfaceSpeed = null;
    let robotSpeed = null;
    let stallDragLoad = null;
    if (outputMode === 'wheel') {
      const wheelDiam = parseFloat(wheelDiameter);
      if (!isNaN(wheelDiam) && wheelDiam > 0) {
        // Wheel circumference in inches
        const wheelCircumference = Math.PI * wheelDiam;
        // Surface speed in inches per minute
        const surfaceSpeedInMin = gearedFreeSpeed * wheelCircumference;
        // Convert to feet per second
        wheelSurfaceSpeed = surfaceSpeedInMin / 12 / 60; // ft/s
        // Robot speed assuming no slippage
        robotSpeed = wheelSurfaceSpeed;
        // Stall Drag Load (lbs) = torque (in-lbs) / (wheel radius in inches)
        stallDragLoad = torqueInLbs / (wheelDiam / 2);
      }
    }

    // Calculate elevator linear speed if in elevator mode
    let elevatorSpeed = null;
    let elevatorMaxLoad = null;
    let elevatorCurrentPerMotor = null;
    if (outputMode === 'elevator') {
      const spoolDiam = parseFloat(spoolDiameter);
      const load = parseFloat(elevatorLoad) || 0;
      if (!isNaN(spoolDiam) && spoolDiam > 0) {
        // Spool circumference in inches
        const spoolCircumference = Math.PI * spoolDiam;
        // Linear speed in inches per minute
        const linearSpeedInMin = gearedFreeSpeed * spoolCircumference;
        // Convert to inches per second
        elevatorSpeed = linearSpeedInMin / 60;
        // Max load (in pounds) = torque (in-lbs) / (spool radius in inches)
        elevatorMaxLoad = torqueInLbs / (spoolDiam / 2);
        // Current draw per motor under load (linear estimate)
        if (elevatorMaxLoad && elevatorMaxLoad > 0 && load > 0) {
          const loadRatio = Math.min(load / elevatorMaxLoad, 1);
          elevatorCurrentPerMotor = motor.freeCurrent + (motor.stallCurrent - motor.freeCurrent) * loadRatio;
        }
      }
    }

    // Calculate arm performance if in arm mode
    let armRotationSpeed = null;
    let timeFor90Degrees = null;
    let maxLiftWeight = null;
    let actualArmSpeed = null;
    let armLoadTorque = null;
    let availableTorque = null;
    if (outputMode === 'arm') {
      const armLen = parseFloat(armLength);
      const loadWeight = parseFloat(armLoad) || 0;
      
      if (!isNaN(armLen) && armLen > 0) {
        // Arm rotation speed in degrees per second (no load)
        armRotationSpeed = (gearedFreeSpeed * 360) / 60; // degrees/sec
        
        // Calculate torque required for the load
        armLoadTorque = loadWeight * armLen; // in⋅lbs torque required
        
        // Available torque after accounting for load
        availableTorque = torqueInLbs - armLoadTorque;
        
        // Maximum weight calculation (simplified)
        maxLiftWeight = torqueInLbs / armLen; // lbs (theoretical max)
        
        // Calculate actual speed based on load
        if (loadWeight > 0 && loadWeight < maxLiftWeight) {
          // Simplified linear model: speed reduces proportionally with load
          const loadRatio = loadWeight / maxLiftWeight;
          actualArmSpeed = armRotationSpeed * (1 - (loadRatio * 0.8)); // 80% speed reduction at max load
        } else if (loadWeight >= maxLiftWeight) {
          actualArmSpeed = 0; // Cannot move if load exceeds capacity
        } else {
          actualArmSpeed = armRotationSpeed; // No load, full speed
        }
        
        // Time to rotate 90 degrees with load
        timeFor90Degrees = actualArmSpeed > 0 ? 90 / actualArmSpeed : Infinity; // seconds
      }
    }

    setResults({
      motor: motor,
      motorCount: numMotors,
      gearRatio: ratio,
      gearedFreeSpeed: gearedFreeSpeed,
      gearedMaxTorque: gearedMaxTorque,
      gearedMaxTorqueInLbs: torqueInLbs,
      stallCurrent: stallCurrentOutput,
      wheelDiameter: parseFloat(wheelDiameter) || 0,
      wheelSurfaceSpeed: wheelSurfaceSpeed,
      robotSpeed: robotSpeed,
      stallDragLoad: stallDragLoad,
      spoolDiameter: parseFloat(spoolDiameter) || 0,
      elevatorSpeed: elevatorSpeed,
      elevatorMaxLoad: elevatorMaxLoad,
      elevatorLoad: parseFloat(elevatorLoad) || 0,
      elevatorCurrentPerMotor: elevatorCurrentPerMotor,
      armLength: parseFloat(armLength) || 0,
      armLoad: parseFloat(armLoad) || 0,
      armRotationSpeed: armRotationSpeed,
      actualArmSpeed: actualArmSpeed,
      timeFor90Degrees: timeFor90Degrees,
      maxLiftWeight: maxLiftWeight,
      armLoadTorque: armLoadTorque,
      availableTorque: availableTorque,
      outputMode: outputMode
      ,stallLoadLbs: stallLoadLbs
      ,loadedCurrentPerMotor: loadedCurrentPerMotor
    });
  };

  // Auto-calculate whenever inputs change
  useEffect(() => {
    calculateMotorPerformance();
  }, [motorType, motorCount, gearRatio, inputMode, gearStages, outputMode, wheelDiameter, armLength, armLoad, elevatorLoad, spoolDiameter]);

  return (
    <div style={{
      border: '2px solid var(--ifm-color-emphasis-300)', 
      borderRadius: '8px', 
      padding: '20px', 
      margin: '20px 0', 
      backgroundColor: 'var(--ifm-background-surface-color)',
      color: 'var(--ifm-color-content)'
    }}>
      <h4 style={{color: 'var(--ifm-color-content)', marginTop: 0}}>Motor Performance Calculator</h4>
      
      {/* Step 1: Select Motor Type */}
      <div style={{marginBottom: '20px'}}>
        <h5 style={{color: 'var(--ifm-color-content)', marginBottom: '10px'}}>Step 1: Select Motor</h5>
        <div style={{display: 'flex', gap: '32px', alignItems: 'center', marginBottom: '10px'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
            <label style={{fontWeight: 'bold', color: 'var(--ifm-color-content)', minWidth: '90px', marginBottom: 0}} htmlFor="motor-type-select">
              Motor Type:
            </label>
            <select 
              id="motor-type-select"
              value={motorType}
              onChange={(e) => setMotorType(e.target.value)}
              style={{
                width: '200px',
                height: '36px',
                padding: '6px 8px',
                borderRadius: '4px',
                border: '1px solid var(--ifm-color-emphasis-300)',
                backgroundColor: 'var(--ifm-background-color)',
                color: 'var(--ifm-color-content)',
                fontSize: '15px'
              }}
            >
              {getMotorDropdownOptions().map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
            <label style={{fontWeight: 'bold', color: 'var(--ifm-color-content)', minWidth: '120px', marginBottom: 0}} htmlFor="motor-count-input">
              Number of Motors:
            </label>
            <input 
              id="motor-count-input"
              type="number" 
              value={motorCount}
              onChange={(e) => setMotorCount(e.target.value)}
              min="1"
              max="10"
              placeholder="1"
              style={{
                width: '70px',
                height: '36px',
                padding: '6px 8px',
                borderRadius: '4px',
                border: '1px solid var(--ifm-color-emphasis-300)',
                backgroundColor: 'var(--ifm-background-color)',
                color: 'var(--ifm-color-content)',
                fontSize: '15px'
              }}
            />
          </div>
        </div>
        <div style={{fontSize: '11px', color: 'var(--ifm-color-emphasis-600)', marginBottom: '10px', marginLeft: '2px'}}>
          Multiple motors add torque and current
        </div>
        {/* Gearbox Efficiency input removed, efficiency is now hardcoded in logic */}
      </div>

      {/* Step 2: Input Gear Ratio */}
      <div style={{marginBottom: '20px'}}>
        <h5 style={{color: 'var(--ifm-color-content)', marginBottom: '10px'}}>Step 2: Input Gear Ratio</h5>
        
        {/* Mode Selection */}
        <div style={{marginBottom: '15px'}}>
          <label style={{display: 'block', marginBottom: '5px', fontWeight: 'bold', color: 'var(--ifm-color-content)'}}>
            Input Method:
          </label>
          <div style={{display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '5px'}}>
            <span style={{fontWeight: inputMode === 'ratio' ? 'bold' : 'normal', color: inputMode === 'ratio' ? 'var(--ifm-color-primary)' : 'var(--ifm-color-content)'}}>Ratio</span>
            <label style={{position: 'relative', display: 'inline-block', width: '48px', height: '24px', margin: 0}}>
              <input
                type="checkbox"
                checked={inputMode === 'gears'}
                onChange={() => setInputMode(inputMode === 'ratio' ? 'gears' : 'ratio')}
                style={{opacity: 0, width: 0, height: 0}}
              />
              <span style={{
                position: 'absolute',
                cursor: 'pointer',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: inputMode === 'gears' ? 'var(--ifm-color-primary)' : 'var(--ifm-color-emphasis-200)',
                borderRadius: '24px',
                transition: 'background-color 0.2s',
                boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.08)'
              }}>
                <span style={{
                  position: 'absolute',
                  left: inputMode === 'gears' ? '26px' : '4px',
                  top: '4px',
                  width: '16px',
                  height: '16px',
                  background: 'white',
                  borderRadius: '50%',
                  transition: 'left 0.2s'
                }} />
              </span>
            </label>
            <span style={{fontWeight: inputMode === 'gears' ? 'bold' : 'normal', color: inputMode === 'gears' ? 'var(--ifm-color-primary)' : 'var(--ifm-color-content)'}}>Gear Sizes</span>
          </div>
        </div>

        {inputMode === 'ratio' ? (
          // Direct ratio input
          <div style={{display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '15px', alignItems: 'start'}}>
            <div>
              <label style={{display: 'block', marginBottom: '5px', fontWeight: 'bold', color: 'var(--ifm-color-content)'}}>
                Gear Ratio:
              </label>
              <input 
                type="number" 
                value={gearRatio}
                onChange={(e) => setGearRatio(e.target.value)}
                step="0.01"
                min="0.01"
                placeholder="1"
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
                Motor RPM ÷ Output RPM
              </div>
            </div>
            
            <div style={{paddingTop: '8px'}}>
              <div style={{fontSize: '13px', color: 'var(--ifm-color-emphasis-700)', lineHeight: '1.4'}}>
                <strong>Examples:</strong><br/>
                • Ratio = 1 (direct drive)<br/>
                • Ratio = 10 (10:1 reduction)<br/>
                • Ratio = 0.5 (2:1 speed increase)
              </div>
            </div>
          </div>
        ) : (
          // Gear stages input
          <div>
            <div style={{marginBottom: '10px'}}>
              <label style={{display: 'block', marginBottom: '5px', fontWeight: 'bold', color: 'var(--ifm-color-content)'}}>
                Gear Stages:
              </label>
              <div style={{fontSize: '12px', color: 'var(--ifm-color-emphasis-600)', marginBottom: '10px'}}>
                Calculated Ratio: {calculateGearRatioFromStages().toFixed(2)}:1
              </div>
            </div>

            {gearStages.map((stage, index) => (
              <div key={index} style={{
                display: 'grid', 
                gridTemplateColumns: '1fr 1fr auto', 
                gap: '10px', 
                alignItems: 'end', 
                marginBottom: '10px',
                padding: '10px',
                backgroundColor: 'var(--ifm-background-color)',
                borderRadius: '4px',
                border: '1px solid var(--ifm-color-emphasis-200)'
              }}>
                <div>
                  <label style={{display: 'block', marginBottom: '3px', fontSize: '12px', fontWeight: 'bold', color: 'var(--ifm-color-content)'}}>
                    Driving Gear (Teeth):
                  </label>
                  <input 
                    type="number" 
                    value={stage.drivingTeeth}
                    onChange={(e) => updateGearStage(index, 'drivingTeeth', e.target.value)}
                    min="1" 
                    placeholder="16"
                    style={{
                      width: '100%', 
                      padding: '6px', 
                      borderRadius: '4px', 
                      border: '1px solid var(--ifm-color-emphasis-300)',
                      backgroundColor: 'var(--ifm-background-surface-color)',
                      color: 'var(--ifm-color-content)',
                      fontSize: '14px'
                    }}
                  />
                </div>
                
                <div>
                  <label style={{display: 'block', marginBottom: '3px', fontSize: '12px', fontWeight: 'bold', color: 'var(--ifm-color-content)'}}>
                    Driven Gear (Teeth):
                  </label>
                  <input 
                    type="number" 
                    value={stage.drivenTeeth}
                    onChange={(e) => updateGearStage(index, 'drivenTeeth', e.target.value)}
                    min="1" 
                    placeholder="16"
                    style={{
                      width: '100%', 
                      padding: '6px', 
                      borderRadius: '4px', 
                      border: '1px solid var(--ifm-color-emphasis-300)',
                      backgroundColor: 'var(--ifm-background-surface-color)',
                      color: 'var(--ifm-color-content)',
                      fontSize: '14px'
                    }}
                  />
                </div>
                
                <div style={{display: 'flex', flexDirection: 'column', gap: '5px'}}>
                  <div style={{fontSize: '11px', color: 'var(--ifm-color-emphasis-600)', textAlign: 'center'}}>
                    Stage {index + 1}: {((parseFloat(stage.drivenTeeth) || 1) / (parseFloat(stage.drivingTeeth) || 1)).toFixed(2)}:1
                  </div>
                  {gearStages.length > 1 && (
                    <button 
                      onClick={() => removeGearStage(index)}
                      style={{
                        padding: '4px 8px',
                        backgroundColor: 'var(--ifm-color-danger)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '3px',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            ))}

            <button 
              onClick={addGearStage}
              style={{
                padding: '8px 16px',
                backgroundColor: 'var(--ifm-color-primary)',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Add Gear Stage
            </button>
          </div>
        )}
      </div>
      
      {/* Step 3: Output Mode */}
      <div style={{marginBottom: '20px'}}>
        <h5 style={{color: 'var(--ifm-color-content)', marginBottom: '10px'}}>Step 3: Output Type</h5>
        <div style={{marginBottom: '15px'}}>
          <label style={{display: 'block', marginBottom: '5px', fontWeight: 'bold', color: 'var(--ifm-color-content)'}}>
            Output Mode:
          </label>
          <select
            value={outputMode}
            onChange={e => setOutputMode(e.target.value)}
            style={{
              width: '220px',
              height: '36px',
              padding: '6px 8px',
              borderRadius: '4px',
              border: '1px solid var(--ifm-color-emphasis-300)',
              backgroundColor: 'var(--ifm-background-color)',
              color: 'var(--ifm-color-content)',
              fontSize: '15px',
              marginBottom: '15px'
            }}
          >
            <option value="basic">Basic Performance</option>
            <option value="wheel">Wheel Surface Speed</option>
            <option value="arm">Arm Performance</option>
            <option value="elevator">Elevator (Linear)</option>
          </select>
        </div>

        {outputMode === 'elevator' && (
          <div>
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px'}}>
              <div>
                <label style={{display: 'block', marginBottom: '5px', fontWeight: 'bold', color: 'var(--ifm-color-content)'}}>
                  Spool Diameter (inches) or Pitch Diameter:
                </label>
                <input 
                  type="number" 
                  value={spoolDiameter}
                  onChange={(e) => setSpoolDiameter(e.target.value)}
                  step="0.01"
                  min="0.1"
                  placeholder="1.5"
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
                  Diameter of the elevator winch/spool
                </div>
              </div>
              <div>
                <label style={{display: 'block', marginBottom: '5px', fontWeight: 'bold', color: 'var(--ifm-color-content)'}}>
                  Elevator Load (pounds):
                </label>
                <input 
                  type="number" 
                  value={elevatorLoad}
                  onChange={(e) => setElevatorLoad(e.target.value)}
                  step="0.1"
                  min="0"
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
                  Weight being lifted by the elevator
                </div>
              </div>
            </div>
          </div>
        )}

        {outputMode === 'wheel' && (
          <div>
            <label style={{display: 'block', marginBottom: '5px', fontWeight: 'bold', color: 'var(--ifm-color-content)'}}>
              Wheel Diameter (inches):
            </label>
            <input 
              type="number" 
              value={wheelDiameter}
              onChange={(e) => setWheelDiameter(e.target.value)}
              step="0.1"
              min="0.1"
              placeholder="4"
              style={{
                width: '150px', 
                padding: '8px', 
                borderRadius: '4px', 
                border: '1px solid var(--ifm-color-emphasis-300)',
                backgroundColor: 'var(--ifm-background-color)',
                color: 'var(--ifm-color-content)'
              }}
            />
            <div style={{fontSize: '11px', color: 'var(--ifm-color-emphasis-600)', marginTop: '2px'}}>
              Common sizes: 4", 6", 8" wheels
            </div>
          </div>
        )}

        {outputMode === 'arm' && (
          <div>
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px'}}>
              <div>
                <label style={{display: 'block', marginBottom: '5px', fontWeight: 'bold', color: 'var(--ifm-color-content)'}}>
                  Arm Length (inches):
                </label>
                <input 
                  type="number" 
                  value={armLength}
                  onChange={(e) => setArmLength(e.target.value)}
                  step="1"
                  min="1"
                  placeholder="24"
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
                  Distance from pivot to end of arm
                </div>
              </div>

              <div>
                <label style={{display: 'block', marginBottom: '5px', fontWeight: 'bold', color: 'var(--ifm-color-content)'}}>
                  Arm Load (pounds):
                </label>
                <input 
                  type="number" 
                  value={armLoad}
                  onChange={(e) => setArmLoad(e.target.value)}
                  step="0.1"
                  min="0"
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
                  Weight at end of arm (game piece, etc.)
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Step 4: Results */}
      <div style={{marginTop: '20px'}}>
        <h5 style={{color: 'var(--ifm-color-content)', marginBottom: '15px'}}>
          {outputMode === 'wheel' ? 'Step 4: Geared Performance & Wheel Speed' : 
           outputMode === 'arm' ? 'Step 4: Geared Performance & Arm Movement' : 
           'Step 4: Geared Performance'}
        </h5>
        
        {results ? (
          <div style={{
            padding: '15px', 
            backgroundColor: 'var(--ifm-color-success-contrast-background)', 
            border: '1px solid var(--ifm-color-success-dark)', 
            borderRadius: '4px'
          }}>
            <div style={{marginBottom: '15px', textAlign: 'center'}}>
              <div style={{fontSize: '16px', fontWeight: 'bold', color: 'var(--ifm-color-content)', marginBottom: '5px'}}>
                {results.motorCount > 1 ? `${results.motorCount}x ` : ''}{results.motor.name} with {results.gearRatio}:1 Ratio
              </div>
              <div style={{fontSize: '12px', color: 'var(--ifm-color-emphasis-600)'}}>
                Gearbox Efficiency: {(results.efficiency * 100).toFixed(0)}%
              </div>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns:
                outputMode === 'basic' ? '1fr 1fr 1fr' :
                outputMode === 'elevator' ? '1fr 1fr' :
                '1fr 1fr 1fr', // changed from 4 to 3 for wheel
              gap: '20px',
              textAlign: 'center'
            }}>
              {outputMode === 'elevator' ? (
                <>
                  <div>
                    <div style={{fontWeight: 'bold', color: 'var(--ifm-color-content)', marginBottom: '5px'}}>Linear Speed</div>
                    <div style={{fontSize: '18px', fontWeight: 'bold', color: 'var(--ifm-color-primary)'}}>
                      {results.elevatorSpeed !== null ? results.elevatorSpeed.toFixed(2) : '—'} in/sec
                    </div>
                    <div style={{fontSize: '12px', color: 'var(--ifm-color-emphasis-600)'}}>
                      Based on spool diameter and gear ratio
                    </div>
                  </div>
                  <div>
                    <div style={{fontWeight: 'bold', color: 'var(--ifm-color-content)', marginBottom: '5px'}}>Max Lift Load</div>
                    <div style={{fontSize: '18px', fontWeight: 'bold', color: 'var(--ifm-color-primary)'}}>
                      {results.elevatorMaxLoad !== null ? results.elevatorMaxLoad.toFixed(1) : '—'} lbs
                    </div>
                    <div style={{fontSize: '12px', color: 'var(--ifm-color-emphasis-600)'}}>
                      At stall torque, {results.spoolDiameter}" spool
                    </div>
                  </div>
                  <div>
                    <div style={{fontWeight: 'bold', color: 'var(--ifm-color-content)', marginBottom: '5px'}}>Current Draw per Motor</div>
                    <div style={{fontSize: '18px', fontWeight: 'bold', color: 'var(--ifm-color-primary)'}}>
                      {results.elevatorCurrentPerMotor !== null ? results.elevatorCurrentPerMotor.toFixed(1) : '—'} A
                    </div>
                    <div style={{fontSize: '12px', color: 'var(--ifm-color-emphasis-600)'}}>
                      At entered elevator load
                    </div>
                  </div>
                </>
              ) : outputMode === 'arm' ? (
                <>
                  <div>
                    <div style={{fontWeight: 'bold', color: 'var(--ifm-color-content)', marginBottom: '5px'}}>Stall Load</div>
                    <div style={{fontSize: '18px', fontWeight: 'bold', color: 'var(--ifm-color-primary)'}}>{results.stallLoadLbs ? results.stallLoadLbs.toFixed(1) : '—'} lbs</div>
                    <div style={{fontSize: '12px', color: 'var(--ifm-color-emphasis-600)'}}>
                      Max weight held at stall torque
                    </div>
                  </div>
                  <div>
                    <div style={{fontWeight: 'bold', color: 'var(--ifm-color-content)', marginBottom: '5px'}}>Current Draw per Motor</div>
                    <div style={{fontSize: '18px', fontWeight: 'bold', color: 'var(--ifm-color-primary)'}}>{results.loadedCurrentPerMotor ? results.loadedCurrentPerMotor.toFixed(1) : '—'} A</div>
                    <div style={{fontSize: '12px', color: 'var(--ifm-color-emphasis-600)'}}>
                      At entered arm load
                    </div>
                  </div>
                </>
              ) : outputMode === 'wheel' ? (
                <>
                  {/* Max Torque output removed as requested */}
                  <div>
                    <div style={{fontWeight: 'bold', color: 'var(--ifm-color-content)', marginBottom: '5px'}}>Stall Drag Load</div>
                    <div style={{fontSize: '18px', fontWeight: 'bold', color: 'var(--ifm-color-primary)'}}>
                      {results.stallDragLoad !== null && results.stallDragLoad !== undefined ? results.stallDragLoad.toFixed(1) : '—'} lbs
                    </div>
                    <div style={{fontSize: '12px', color: 'var(--ifm-color-emphasis-600)'}}>
                      Max pushing force at stall (ignores friction)
                    </div>
                  </div>
                  <div>
                    <div style={{fontWeight: 'bold', color: 'var(--ifm-color-content)', marginBottom: '5px'}}>Robot Speed</div>
                    <div style={{fontSize: '18px', fontWeight: 'bold', color: 'var(--ifm-color-primary)'}}>
                      {results.robotSpeed !== null && results.robotSpeed !== undefined ? results.robotSpeed.toFixed(1) : '—'} ft/s
                    </div>
                    <div style={{fontSize: '12px', color: 'var(--ifm-color-emphasis-600)'}}>
                      {results.robotSpeed !== null && results.robotSpeed !== undefined ? (results.robotSpeed * 0.681818).toFixed(1) : '—'} mph
                    </div>
                    <div style={{fontSize: '11px', color: 'var(--ifm-color-emphasis-600)', marginTop: '2px'}}>
                      {results.wheelDiameter !== null && results.wheelDiameter !== undefined ? results.wheelDiameter : '—'}" wheel
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <div style={{fontWeight: 'bold', color: 'var(--ifm-color-content)', marginBottom: '5px'}}>Free Speed</div>
                    <div style={{fontSize: '18px', fontWeight: 'bold', color: 'var(--ifm-color-primary)'}}>{results.gearedFreeSpeed.toFixed(0)} RPM</div>
                    <div style={{fontSize: '12px', color: 'var(--ifm-color-emphasis-600)'}}>
                      Base: {results.motor.freeSpeed} RPM {results.motorCount > 1 ? `(each motor)` : ''}
                    </div>
                  </div>
                  <div>
                    <div style={{fontWeight: 'bold', color: 'var(--ifm-color-content)', marginBottom: '5px'}}>Max Torque</div>
                    <div style={{fontSize: '18px', fontWeight: 'bold', color: 'var(--ifm-color-primary)'}}>{results.gearedMaxTorqueInLbs.toFixed(1)} in⋅lbs</div>
                    <div style={{fontSize: '12px', color: 'var(--ifm-color-emphasis-600)'}}>
                      {results.gearedMaxTorque.toFixed(2)} N⋅m {results.motorCount > 1 ? `(${results.motorCount} motors)` : ''}
                    </div>
                    <div style={{fontSize: '10px', color: 'var(--ifm-color-emphasis-600)'}}>
                      After {(results.efficiency * 100).toFixed(0)}% efficiency loss
                    </div>
                  </div>
                </>
              )}
              

              {outputMode === 'wheel' && results.wheelSurfaceSpeed !== null && (
                  <div>
                    <div style={{fontWeight: 'bold', color: 'var(--ifm-color-content)', marginBottom: '5px'}}>Current Draw per Motor</div>
                    <div style={{fontSize: '18px', fontWeight: 'bold', color: 'var(--ifm-color-primary)'}}>
                      {results.motor && results.motor.freeCurrent !== undefined && results.motor.stallCurrent !== undefined
                        ? `${results.motor.freeCurrent.toFixed(1)} - ${results.motor.stallCurrent.toFixed(1)} A`
                        : '—'}
                    </div>
                    <div style={{fontSize: '12px', color: 'var(--ifm-color-emphasis-600)'}}>
                      Free to stall (per motor)
                    </div>
                  </div>
              )}

              {outputMode === 'arm' && results.armRotationSpeed !== null && (
                <div>
                  <div style={{fontWeight: 'bold', color: 'var(--ifm-color-content)', marginBottom: '5px'}}>90° Rotation</div>
                  <div style={{fontSize: '18px', fontWeight: 'bold', color: 'var(--ifm-color-primary)'}}>
                    {results.timeFor90Degrees === Infinity ? '∞' : results.timeFor90Degrees.toFixed(2)} sec
                  </div>
                  <div style={{fontSize: '12px', color: 'var(--ifm-color-emphasis-600)'}}>
                    {results.actualArmSpeed !== null ? `${results.actualArmSpeed.toFixed(0)}°/sec` : `${results.armRotationSpeed.toFixed(0)}°/sec`}
                    {results.armLoad > 0 ? ' (loaded)' : ' (no load)'}
                  </div>
                  <div style={{fontSize: '10px', color: 'var(--ifm-color-emphasis-600)'}}>
                    ({results.armLength}" arm{results.armLoad > 0 ? `, ${results.armLoad} lb load` : ''})
                  </div>
                </div>
              )}
            </div>

            <div style={{marginTop: '15px', padding: '10px', backgroundColor: 'var(--ifm-background-color)', borderRadius: '4px'}}>
              <div style={{fontSize: '12px', color: 'var(--ifm-color-emphasis-600)', textAlign: 'center'}}>
                <strong>Note:</strong> Free speed tolerance: {results.motor.freeSpeedTolerance} | 
                Torque reduced by {(results.efficiency * 100).toFixed(0)}% gearbox efficiency | 
                Actual performance may vary based on load, voltage, and temperature.
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
            {outputMode === 'wheel' ? 
              'Select motor, enter gear ratio, and wheel diameter to see performance and speed results' :
            outputMode === 'arm' ?
              'Select motor, enter gear ratio, and arm length to see performance and movement results' :
              'Select motor and enter gear ratio to see performance results'
            }
          </div>
        )}
      </div>
    </div>
  );
};

export default MotorCalculator;
