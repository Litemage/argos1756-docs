// Example code snippets and references for InteractiveCodeReference

export const commonReferences = {
  'include': {
    text: 'The #include directive is used to include header files in C++.',
    link: '/argos1756-docs/docs/software_doc/CPP_Docs/CPP_software_quick_reference/#flow-charts'
  },
  'public': 'Public members are accessible from outside the class.',
  'private': 'Private members are only accessible within the class.',
  'void': 'void means this function does not return a value.',
  'double': 'double is a type for decimal numbers in C++.','//': 'This is a single-line comment in C++.',
  'Drivetrain': 'This is the class representing the robot drivetrain subsystem.',
  'TankDrive': 'TankDrive is a function that sets the speed of the left and right motors.',
  'Periodic': 'Periodic is called regularly by the scheduler to update the subsystem.',
  'frc::XRPMotor': 'XRPMotor is a WPILib class for controlling XRP robot motors.',
  'm_left_motor': 'This is the left motor object, connected to channel 0.',
  'm_right_motor': 'This is the right motor object, connected to channel 1.',
  'SubsystemBase': 'SubsystemBase is the base class for all robot subsystems in WPILib.',
  '  void TankDrive(double leftSpeed, double rightSpeed);': 'Krone',
  'iostream': 'Standard C++ library for input/output stream.',
  'main': 'Entry point of a C++ program.',
  'cout': 'Standard output stream in C++.','endl': 'Ends the current line and flushes the output stream.',
  'return': 'Exits the function and optionally returns a value.',
  '0': 'Return code 0 means success.'
};

export const codeSnippets = {
  'Drivetrain Example': {
    code: `// Copyright (c) FIRST and other WPILib contributors.
// Open Source Software; you can modify and/or share it under the terms of
// the WPILib BSD license file in the root directory of this project.

#pragma once

#include <frc/xrp/XRPMotor.h>
#include <frc2/command/SubsystemBase.h>

class Drivetrain : public frc2::SubsystemBase {
 public:
  Drivetrain();

  // A function to drive the robot with tank-style controls.
  // It takes a speed for the left side and a speed for the right side.
  void TankDrive(double leftSpeed, double rightSpeed);
  
  /**
   * Will be called periodically whenever the CommandScheduler runs.
   */
  void Periodic() override;

 private:
  // Components (e.g. motor controllers and sensors) should generally be
  // declared private and exposed only through public methods.

  // This creates an object for the left motor on channel 0
  frc::XRPMotor m_left_motor{0};
  // This creates an object for the right motor on channel 1
  frc::XRPMotor m_right_motor{1};
};`,
    references: {}
  },
  'Hello World': {
    code: `#include <iostream>

int main() {
  std::cout << "Hello, World!" << std::endl;
  return 0;
}`,
    references: {}
  }
};
