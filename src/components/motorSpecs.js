// Motor specifications for FRC motors
// All values are nominal/theoretical - actual performance may vary

export const motorSpecs = {
  cim: {
    name: 'CIM',
    freeSpeed: 5330, // RPM
    stallTorque: 2.41, // N⋅m
    stallCurrent: 131.00, // A
    freeCurrent: 2.70, // A
    power: 336.29, // W
    freeSpeedTolerance: '±5%',
    manufacturer: 'VEX Robotics',
    notes: 'Classic FRC motor, reliable and robust'
  },
  bag: {
    name: 'BAG Motor',
    freeSpeed: 13180, // RPM
    stallTorque: 0.43, // N⋅m
    stallCurrent: 53.00, // A
    freeCurrent: 1.80, // A
    power: 148.37, // W
    freeSpeedTolerance: '±10%',
    manufacturer: 'VEX Robotics',
    notes: 'Small brushed motor for lightweight applications'
  },
  pro775: {
    name: '775pro',
    freeSpeed: 18730, // RPM
    stallTorque: 0.71, // N⋅m
    stallCurrent: 134.00, // A
    freeCurrent: 0.70, // A
    power: 348.15, // W
    freeSpeedTolerance: '±10%',
    manufacturer: 'VEX Robotics',
    notes: 'High-speed brushed motor'
  },
  falcon500: {
    name: 'Falcon 500',
    freeSpeed: 6380, // RPM
    stallTorque: 4.69, // N⋅m
    stallCurrent: 257, // A
    freeCurrent: 1.5, // A
    power: 783.36, // W
    freeSpeedTolerance: '±10%',
    manufacturer: 'Cross The Road Electronics',
    notes: 'Popular integrated brushless motor with encoder'
  },
  krakenx60: {
    name: 'Kraken X60',
    freeSpeed: 6000, // RPM
    stallTorque: 7.09, // N⋅m  
    stallCurrent: 366, // A
    freeCurrent: 2, // A
    power: 1113.69, // W
    freeSpeedTolerance: '±10%',
    manufacturer: 'Cross The Road Electronics',
    notes: 'High-torque brushless motor for FRC'
  },
  kraken44x: {
    name: 'Kraken 44X',
    freeSpeed: 7530, // RPM
    stallTorque: 4.05, // N⋅m
    stallCurrent: 275, // A
    freeCurrent: 1.4, // A
    power: 798.40, // W
    freeSpeedTolerance: '±10%',
    manufacturer: 'Cross The Road Electronics',
    notes: 'Compact high-torque brushless motor'
  },
  krakenx60fo: {
    name: 'Kraken X60 Field Oriented',
    freeSpeed: 5800, // RPM (slightly reduced for field-oriented control)
    stallTorque: 9.37, // N⋅m
    stallCurrent: 483, // A
    freeCurrent: 2, // A
    power: 1422.77, // W
    freeSpeedTolerance: '±10%',
    manufacturer: 'Cross The Road Electronics',
    notes: 'High-torque brushless motor optimized for field-oriented control'
  }
};

// Helper function to get motor dropdown options for UI components
export const getMotorDropdownOptions = () => {
  return Object.keys(motorSpecs).map(key => ({
    value: key,
    label: `${motorSpecs[key].name} - ${motorSpecs[key].freeSpeed} RPM, ${motorSpecs[key].stallTorque} N⋅m`,
    motor: motorSpecs[key]
  }));
};

// Helper function to convert torque units
export const convertTorque = {
  NmToInLbs: (torqueNm) => torqueNm * 8.85074579,
  InLbsToNm: (torqueInLbs) => torqueInLbs / 8.85074579
};

// Common gear ratios for reference
export const commonGearRatios = {
  drivetrain: [4, 6, 8, 10, 12, 15],
  arm: [50, 75, 100, 150, 200, 300],
  shooter: [1, 1.5, 2, 3, 4],
  intake: [3, 4, 5, 6, 8, 10]
};

export default motorSpecs;
