---
sidebar_position: 1
---
import roboRIO from './roborio.webp'
import PowerDistributionHub from './power-distribution-hub.webp'
import CircuitBreaker from './circuit-breaker.webp'
import RobotBattery from './robot-battery.webp'
import ATOBreaker from './ato-breaker.webp'
import RobotSignalLight from './rsl-allenbradley.webp'
import VividRadio from './Vivid_Radio.png'
import WiringDiagram from './2025_Wiring_diagram.png'

# 2025 Electronics Overview
## Overview
This document provides an overview of the essential electronic components that make up an FRC robot's control system. These components work together to provide power distribution, control, and communication for your robot.

For additional details on the control system hardware, consult the [2025 hardware document](https://docs.wpilib.org/en/stable/docs/controls-overviews/control-system-hardware.html).

For additional details on the wiring see [2025 wiring document](https://docs.wpilib.org/en/stable/docs/zero-to-robot/step-1/basic-robot-wiring.html).  

<img src={WiringDiagram} width="1000"/>

---
## Hardware Quick Refrence Guide
### NI roboRIO

<img src={roboRIO} width="400"/>

The NI roboRIO is the main robot controller used for FRC and serves as the "brain" for the robot. It runs team-generated code that commands all of the other hardware components on the robot. The roboRIO processes sensor inputs, executes control algorithms, and sends commands to motor controllers and other actuators.

---

### REV Power Distribution Hub (PDH)

<img src={PowerDistributionHub} width="400"/>

The REV Power Distribution Hub (PDH) is designed to distribute power from a 12VDC battery to various robot components. It serves as the central power distribution point for your robot's electrical system.

---

### 120A Main Circuit Breaker

<img src={CircuitBreaker} width="400"/>

The 120A Main Circuit Breaker serves two critical roles on the robot: it acts as the main robot power switch and provides protection for downstream robot wiring and components. This breaker is wired between the positive terminal of the robot battery and the Power Distribution Hub.

---

### Robot Battery

<img src={RobotBattery} width="400"/>

The power supply for an FRC robot is a single 12V 18Ah Sealed Lead Acid (SLA) battery. This battery is capable of meeting the high current demands of an FRC robot throughout a match.

---

### REV ATO Circuit Breakers

<img src={ATOBreaker} width="400"/>

REV ATO Circuit Breakers are used with the Power Distribution Hub to limit current to individual branch circuits. These breakers protect individual components and wiring from overcurrent conditions.

---

### Robot Signal Light (RSL)

<img src={RobotSignalLight} width="400"/>

The Robot Signal Light (RSL) is a required safety component that provides visual indication of the robot's operational state. It is directly controlled by the roboRIO and helps officials and team members understand when the robot is enabled or disabled.

---

### VH-109 Radio

<img src={VividRadio} width="400"/>

The Vivid-Hosting VH-109 radio is designed specifically for FRC competition use. It provides wireless communication between the robot and the driver station, allowing for remote control and telemetry data transmission.

---
