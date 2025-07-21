---
sidebar_position: 2
---
import WireSize from './Wire_Size.png'
import CANTwistedPair from './CAN_Twised_Pair.png'
import CANWiringExample from './CAN_Wiring_Example.png'

# Wires Overview

## Overview

:::danger IMPORTANT DISCLAIMER
**Always refer to the official FRC Game Manual for complete and current wiring requirements before wiring your robot.** This webpage is for reference only and does not replace the official rules and requirements found in the game manual. Robot wiring must comply with all current FRC rules to pass inspection.
:::

Proper wiring is essential for a safe and reliable robot. FRC has specific requirements for wire types, sizes, and installation practices to ensure robot safety and performance.

## Power Wiring

Power wires carry current to motors, lights, and other high-power devices. The wire gauge must be appropriate for the current draw and circuit breaker rating.

:::note
- **Red**: Positive (+)
- **Black**: Negative (-)
:::

**Wire Gauge Requirements:**
- **6 AWG**: Main battery connections, 120A breaker connections
- **10 AWG**: High-current circuits (30A-40A breakers), motor controllers for drive motors
- **12 AWG**: Medium-current circuits (20A-30A breakers), motor controllers for mechanisms
- **14 AWG**: Low-current circuits (10A-20A breakers), small motors and actuators
- **16-18 AWG**: Very low-current circuits (≤10A), sensors, lights, small solenoids

<img src={WireSize} width="400"/>

## CAN Bus Wiring

The CAN (Controller Area Network) bus allows smart devices to communicate with the roboRIO and each other.

**CAN Wire Specifications:**
- **Wire Type**: Twisted pair, 120Ω impedance
- **Recommended**: 22-24 AWG stranded wire
- **Colors**: Yellow (CAN High), Green (CAN Low)
- **Termination**: 120Ω termination resistors at each end of the bus

<img src={CANTwistedPair} width="400"/>

:::note IMPORTANT

- Keep CAN wires twisted together to reduce interference.
- Always terminate both ends of the CAN bus with 120Ω resistors.
- Must be wired in the loop

:::
**Example of CAN wiring diagram**  
<img src={CANWiringExample} width="400"/>