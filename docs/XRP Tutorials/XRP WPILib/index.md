---
sidebar_position: 1
---
# XRP WPILib Overview 
WPILib is like a special toolbox for C++ programmers in FIRST Robotics. It gives you ready-made tools to control your robot's motors, read sensors, and talk to the drivers. It makes programming your robot much easier, so you can focus on making it do cool things instead of worrying about tiny details.

for official documentation go to [WPILib 2025](https://github.wpilib.org/allwpilib/docs/release/cpp/classfrc_1_1_x_r_p_gyro.html)

## Controlling a Motor

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

## Xbox Controller

To control the robot with a gamepad, you can use the `frc::XboxController` class. This class provides an easy way to read the state of all buttons and joysticks.

For more details, see the [WPILib XboxController Class Reference](https://github.wpilib.org/allwpilib/docs/release/cpp/classfrc_1_1_xbox_controller.html).

To use the `XboxController` class, you need to include its header file:

```cpp
#include <frc/XboxController.h>
```

**Constructor**

You need to create an `XboxController` object, specifying the USB port it's connected to on the driver station (usually `0` for the primary controller).

```cpp
// Create a controller object on port 0
frc::XboxController m_controller{0};
```

**Button Mappings**

The buttons are accessed using methods that return `true` if the button is currently pressed.

*   **A Button:** `GetAButton()`
*   **B Button:** `GetBButton()`
*   **X Button:** `GetXButton()`
*   **Y Button:** `GetYButton()`
*   **Left Bumper:** `GetLeftBumper()`
*   **Right Bumper:** `GetRightBumper()`
*   **Back Button:** `GetBackButton()`
*   **Start Button:** `GetStartButton()`
*   **Left Stick Button:** `GetLeftStickButton()`
*   **Right Stick Button:** `GetRightStickButton()`

**Axis Mappings**

The axes (joysticks and triggers) return values from -1.0 to 1.0. Note that for the joysticks, the Y-axis is inverted (pushing up gives a negative value).

*   **Left Stick X-Axis:** `GetLeftX()`
*   **Left Stick Y-Axis:** `GetLeftY()`
*   **Right Stick X-Axis:** `GetRightX()`
*   **Right Stick Y-Axis:** `GetRightY()`
*   **Left Trigger:** `GetLeftTriggerAxis()` (range: 0.0 to 1.0)
*   **Right Trigger:** `GetRightTriggerAxis()` (range: 0.0 to 1.0)

**Usage Example**

This example shows how to use the left joystick's Y-axis to control the speed of the left motor.

```cpp
// Get the Y-axis value from the left joystick (-1.0 to 1.0).
double left_y_position = m_controller.GetLeftY();

// Set the motor speed using the joystick value. The value is negated 
// because GetLeftY() is inverted by default.
m_left_motor.Set(-left_y_position);

// GetAButton() returns a boolean (true if pressed).
bool a_button_pressed = m_controller.GetAButton();
```

## Unit Library

The WPILib units library is a powerful tool that provides compile-time type safety for physical units. This prevents common programming errors, such as accidentally adding a distance to a time. Many modern WPILib functions, especially for sensors and mechanisms, use this library.

For more details, see the [WPILib Units Library Documentation](https://docs.wpilib.org/en/stable/docs/software/basic-programming/cpp-units.html).

**Using the Library**

To use a specific unit, you must include its corresponding header file.

```cpp
#include <units/length.h>
#include <units/angle.h>
#include <units/time.h>
```

**Literals**

The library provides convenient literals for creating unit-based values. You simply append the literal to a number.

*   **Length:** `_m` (meters), `_ft` (feet), `_in` (inches)
*   **Angle:** `_deg` (degrees), `_rad` (radians)
*   **Time:** `_s` (seconds), `_ms` (milliseconds)

**Usage Example**

This example demonstrates declaring unit-based variables and performing conversions.

```cpp
// Declare a variable to hold a distance in meters
units::meter_t distance = 1.5_m;

// The library automatically handles conversions between compatible types
units::inch_t distance_in_inches = distance; // distance_in_inches is now ~59.055

// This line would cause a compiler error because the units are incompatible
// auto error = 5.0_m + 2.0_s; 
```

As seen in the Gyro and Servo sections, you'll use types like `units::degree_t` when interacting with those devices.

## Write to command window

Writing information to the command window (or console) is a fundamental tool for debugging your robot code. You can print simple text messages or the values of variables to understand what your program is doing in real-time. The output will appear in the "WPILib Console" in VS Code when running the simulator or deploying to the robot.

A common way to do this in C++ is with `std::cout` from the `<iostream>` library. For more detailed information, see the [C++ documentation for std::cout](https://en.cppreference.com/w/cpp/io/cout).

**Setup**

To use `std::cout`, you need to include the necessary header file:

```cpp
#include <iostream>
```

**Common Methods**

*   `std::cout << ...`: The stream insertion operator is used to send data (text, variables) to the console. You can chain multiple `<<` operators together to print a sequence of items.
*   `std::endl` or `'\n'`: Both are used to insert a newline character at the end of your output.

**Usage Example**

This example shows how to read the Y-axis of the left joystick and print its value to the console. This is useful for seeing sensor or controller values live.

```cpp
// This code assumes an `m_controller` object has already been created.

// Get the Y-axis value from the left joystick (-1.0 to 1.0).
double left_y_position = m_controller.GetLeftY();

// Print the value to the console
std::cout << "Left Joystick Y: " << left_y_position << std::endl;

// The output in the console might look like:
// Left Joystick Y: -0.753
```

## Smart Dashboard (Work in progress)

While printing to the command window is useful, the **SmartDashboard** provides a powerful graphical user interface (GUI) for interacting with your robot. It allows you to display multiple sensor values at once, plot data over time, and even add simple controls. This is the preferred method when you need to visualize how values are changing or monitor many outputs simultaneously.

For more details, see the [WPILib SmartDashboard Documentation](https://docs.wpilib.org/en/stable/docs/software/dashboards/smartdashboard/index.html).

**Setup**

To use the SmartDashboard, you need to include its header file:

```cpp
#include <frc/smartdashboard/SmartDashboard.h>
```

**Common Methods**

Data is sent to the SmartDashboard using key-value pairs. The `key` is a string that will be the label for the data in the GUI.

*   `frc::SmartDashboard::PutNumber(std::string_view key, double value)`: Displays a number on the dashboard.
*   `frc::SmartDashboard::PutBoolean(std::string_view key, bool value)`: Displays a boolean as a true/false indicator.
*   `frc::SmartDashboard::PutString(std::string_view key, std::string_view value)`: Displays a text string.

**Usage Example**

This example shows how to send the gyro angle and a button state to the SmartDashboard.

```cpp
// This code assumes m_gyro and m_controller objects have been created.

// Get values from sensors and controllers
units::degree_t angle = m_gyro.GetAngle();
bool a_button_pressed = m_controller.GetAButton();

// Send the values to the SmartDashboard with descriptive keys
frc::SmartDashboard::PutNumber("Gyro Angle (deg)", angle.value());
frc::SmartDashboard::PutBoolean("A Button Pressed", a_button_pressed);
```

When you run the robot code, you can launch the SmartDashboard from the WPILib command palette in VS Code. The values will appear with their labels. You can right-click on a numeric value and choose to display it as a graph to plot it over time.

## Gyro 

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

## Servo

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

## Line Sensor

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