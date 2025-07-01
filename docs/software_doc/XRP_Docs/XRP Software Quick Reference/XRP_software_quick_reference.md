---
sidebar_position: 2
---

## XRP WPILib Overview 
 WPILib is like a special toolbox for C++ programmers in FIRST Robotics. It gives you ready-made tools to control your robot's motors, read sensors, and talk to the drivers. It makes programming your robot much easier, so you can focus on making it do cool things instead of worrying about tiny details.

 for official documentation go to [WPILib 2025](https://github.wpilib.org/allwpilib/docs/release/cpp/classfrc_1_1_x_r_p_gyro.html)
_____________________________________________________________________________________________________________________________________________________
## XRP Motor

 The XRP robot has two motors: a left and a right drive motor. The motor speed range is from -1.0 to 1.0.

 For more details, see the [WPILib XRPMotor Class Reference](https://github.wpilib.org/allwpilib/docs/release/cpp/classfrc_1_1_x_r_p_motor.html).

 The motor IDs are as follows:  
 1. Left Motor: ID 0  
 2. Right Motor: ID 1  
 3. Open Motor 1: ID 2  
 4. Open Motor 2: ID 3  

 To use the `XRPMotor` class, you need to include its header file:

 ```cpp
 #include <frc/xrp/XRPMotor.h>
 ```
_____________________________________________________________________________________________________________________________________________________
 **Constructor**

 You create an `XRPMotor` object by specifying its device ID (0 for the left motor, 1 for the right motor).

 ```cpp
 // Create motor objects for both left and right motors
 frc::XRPMotor m_left_motor{0};
 frc::XRPMotor m_right_motor{1};
 ```

 **Common Methods**

 *   `Set(double speed)`: Sets the motor speed, from -1.0 (full reverse) to 1.0 (full forward).
 *   `SetInverted(bool isInverted)`: Inverts the direction of the motor. This is useful for drivetrains where motors on opposite sides need to spin in opposite directions to drive forward.
 *   `Get()`: Returns the last speed set to the motor.

 **Usage Example**

 This example shows how to set up and control the motors for a simple differential drive.

 ```cpp
 // Invert the right motor so both motors spin in the same direction for forward motion
 m_right_motor.SetInverted(true);

 // Drive forward at half speed
 m_left_motor.Set(0.5);
 m_right_motor.Set(0.5);
 ```
_____________________________________________________________________________________________________________________________________________________

## XRP Gyro 

 The XRP has an onboard gyroscope that can be used to measure the robot's heading (rotation). This is useful for making precise turns or driving straight.

 For more details, see the [WPILib XRPGyro Class Reference](https://github.wpilib.org/allwpilib/docs/release/cpp/classfrc_1_1_x_r_p_gyro.html).

 To use the `XRPGyro` class, you need to include the `XRPGyro` and `units` header files:

 ```cpp
 #include <frc/xrp/XRPGyro.h>
 #include <units/angle.h>
 #include <iostream>
 ```

 **Constructor**

 You can construct an `XRPGyro` object without any parameters.

 ```cpp
 frc::XRPGyro m_gyro;
 ```

 **Common Methods**

 *   `GetAngle()`: Returns the accumulated angle as a `units::degree_t`. Clockwise rotation is positive.
 *   `Reset()`: Resets the gyro's angle to 0. This is useful for setting a new "forward" direction.

 **Usage Example**

 This example shows how to read the gyro's angle and print it to the console.

 ```cpp
 // Reset the gyro's current angle to 0
 m_gyro.Reset();

 // Get the current angle of the robot
 units::degree_t current_angle = m_gyro.GetAngle();

 // Print the angle to the console. .value() is used to get the raw number.
 std::cout << "Gyro Angle: " << current_angle.value() << " deg" << std::endl;
 ```
_____________________________________________________________________________________________________________________________________________________

## XRP Servo

 The XRP robot has two dedicated ports for standard hobby servos. These are controlled using the specific `frc::XRPServo` class, which allows for precise control of angular position (typically 0-180 degrees).

 For more details, see the [WPILib XRPServo Class Reference](https://github.wpilib.org/allwpilib/docs/release/cpp/classfrc_1_1_x_r_p_servo.html).

 To use a servo, you need to include the `XRPServo` and `units` header files:

 ```cpp
 #include <frc/xrp/XRPServo.h>
 #include <units/angle.h>
 #include <iostream>
 ```

 **Constructor**

 You create an `XRPServo` object by specifying its device number. The XRP has two servo ports:

 *   **Servo 1:** Device Number 0
 *   **Servo 2:** Device Number 1

 ```cpp
 // Create a servo object for the servo connected to port 1 on the XRP
 frc::XRPServo m_servo1{0};
 ```

 **Common Methods**

 *   `SetAngle(units::degree_t angle)`: Sets the servo's angle. The valid range is typically 0 to 180 degrees.
 *   `GetAngle()`: Returns the last angle set for the servo as a `units::degree_t`.

 **Usage Example**

 This example shows how to set a servo's angle and then read it back.

 ```cpp
 // Set the servo to its midpoint
 m_servo1.SetAngle(90.0_deg);

 // Read the angle back from the servo
 units::degree_t current_angle = m_servo1.GetAngle();

 // Print the angle to the console
 std::cout << "Servo Angle: " << current_angle.value() << " deg" << std::endl;
 ```

## XRP Line Sensor

 The XRP has an onboard reflectance sensor array for line following. This is managed by the `frc::XRPReflectanceSensor` class, which provides readings from the left and right sensors.

 For more details, see the [WPILib XRPReflectanceSensor Class Reference](https://github.wpilib.org/allwpilib/docs/release/cpp/classfrc_1_1_x_r_p_reflectance_sensor.html).

 To use the line sensor, you need to include the `XRPReflectanceSensor` header file:

 ```cpp
 #include <frc/xrp/XRPReflectanceSensor.h>
 #include <iostream>
 ```

 **Constructor**

 You can construct an `XRPReflectanceSensor` object without any parameters. It automatically handles both the left and right sensors.

 ```cpp
 // Create an object for the reflectance sensor array
 frc::XRPReflectanceSensor m_reflectance_sensor;
 ```

 **Common Methods**

 *   `GetLeftValue()`: Returns the left sensor's reflectance value as a `double` from 0.0 (light) to 1.0 (dark).
 *   `GetRightValue()`: Returns the right sensor's reflectance value as a `double` from 0.0 (light) to 1.0 (dark).

 **Usage Example**

 This example shows how to read the values from both sensors and print them.

 ```cpp
 // Read the values from the left and right sensors
 double left_value = m_reflectance_sensor.GetLeftValue();
 double right_value = m_reflectance_sensor.GetRightValue();

 // Print the values to the console
 std::cout << "Left Sensor: " << left_value << ", Right Sensor: " << right_value << std::endl;
 ```