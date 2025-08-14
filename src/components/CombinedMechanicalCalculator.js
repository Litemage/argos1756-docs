import React, { useState } from 'react';
import BeltCalculator from './BeltCalculator';
import ChainCalculator from './ChainCalculator';
import GearCalculator from './GearCalculator';
import MotorCalculator from './MotorCalculator';
import ArgosInventorySearch from './ArgosInventorySearch';


const calculators = [
  { label: 'Belt Calculator', value: 'belt', component: <BeltCalculator /> },
  { label: 'Chain Calculator', value: 'chain', component: <ChainCalculator /> },
  { label: 'Gear Calculator', value: 'gear', component: <GearCalculator /> },
  { label: 'Motor Calculator', value: 'motor', component: <MotorCalculator /> },
];

export default function CombinedMechanicalCalculator() {
  const [selected, setSelected] = useState('belt');

  const selectedCalc = calculators.find(c => c.value === selected)?.component;

  return (
    <div style={{ margin: '2em 0', padding: '1em', border: '2px solid var(--ifm-color-emphasis-300)', borderRadius: '8px', background: 'var(--ifm-background-surface-color)' }}>
      <h2 style={{ marginTop: 0, color: 'var(--ifm-color-content)' }}>Mechanical Calculators</h2>
      <div style={{ marginBottom: '1.5em' }}>
        <label htmlFor="mech-calc-select" style={{ fontWeight: 'bold', color: 'var(--ifm-color-content)', marginRight: '1em' }}>
          Select Calculator:
        </label>
        <select
          id="mech-calc-select"
          value={selected}
          onChange={e => setSelected(e.target.value)}
          style={{ padding: '0.5em 1em', fontSize: '1.1em', borderRadius: '6px', border: '1px solid var(--ifm-color-emphasis-300)', background: 'var(--ifm-background-color)', color: 'var(--ifm-color-content)' }}
        >
          {calculators.map(calc => (
            <option key={calc.value} value={calc.value}>{calc.label}</option>
          ))}
        </select>
      </div>
      <div>
        {selectedCalc}
      </div>
    </div>
  );
}
