---
sidebar_position: 2
---
# WPILib software quick reference

## Xbox Controller

 To control the robot with a gamepad in command-based programming, you can use the `frc2::CommandXboxController` class. This class extends the traditional `frc::XboxController` with `Trigger` factories that integrate seamlessly with the command-based framework.

 For more details, see the [WPILib CommandXboxController Class Reference](https://github.wpilib.org/allwpilib/docs/release/cpp/classfrc2_1_1_command_xbox_controller.html).

 To use the `CommandXboxController` class, you need to include its header file:

 ```cpp
 #include <frc2/command/button/CommandXboxController.h>
 ```

 **Member Variable Declarations**

 You need to create a `CommandXboxController` object, specifying the USB port it's connected to on the driver station (usually `0` for the primary controller).

 ```cpp
 // Create a controller object on port 0
 frc2::CommandXboxController m_controller{0};
 ```

 **Button Mappings (Trigger-Based)**

 The buttons return `frc2::Trigger` objects that can be used to bind commands. This is the preferred approach for command-based programming.

 *   **A Button:** `A()`
 *   **B Button:** `B()`
 *   **X Button:** `X()`
 *   **Y Button:** `Y()`
 *   **Left Bumper:** `LeftBumper()`
 *   **Right Bumper:** `RightBumper()`
 *   **Back Button:** `Back()`
 *   **Start Button:** `Start()`
 *   **Left Stick Button:** `LeftStick()`
 *   **Right Stick Button:** `RightStick()`
 *   **Left Trigger:** `LeftTrigger(double threshold = 0.5)` (trigger when axis > threshold)
 *   **Right Trigger:** `RightTrigger(double threshold = 0.5)` (trigger when axis > threshold)

 **Axis Mappings**

 The axes (joysticks and triggers) return values from -1.0 to 1.0. Note that for the joysticks, back is positive (different from the traditional XboxController).

 *   **Left Stick X-Axis:** `GetLeftX()` (right is positive)
 *   **Left Stick Y-Axis:** `GetLeftY()` (back is positive)
 *   **Right Stick X-Axis:** `GetRightX()` (right is positive)
 *   **Right Stick Y-Axis:** `GetRightY()` (back is positive)
 *   **Left Trigger:** `GetLeftTriggerAxis()` (range: 0.0 to 1.0)
 *   **Right Trigger:** `GetRightTriggerAxis()` (range: 0.0 to 1.0)

 **Usage Examples**

 **Example 1: Binding Commands to Buttons**
 ```cpp
 // Bind a command to the A button (runs when pressed)
 m_controller.A().OnTrue(SomeCommand());

 // Bind a command to run while B button is held
 m_controller.B().WhileTrue(SomeOtherCommand());

 // Use trigger with custom threshold
 m_controller.LeftTrigger(0.7).OnTrue(TriggerCommand());
 ```

 **Example 2: Using Joystick Values**
 ```cpp
 // Get the Y-axis value from the left joystick (-1.0 to 1.0).
 // Note: back is positive in CommandXboxController
 double left_y_position = m_controller.GetLeftY();

 // Set the motor speed using the joystick value
 m_left_motor.Set(left_y_position);

 // Get X-axis for turning (right is positive)
 double turn_value = m_controller.GetRightX();
 ```

 **Accessing the Underlying XboxController**

 If you need access to the traditional button methods (like `GetAButton()`), you can access the underlying controller:

 ```cpp
 // Access the underlying frc::XboxController
 bool a_button_pressed = m_controller.GetHID().GetAButton();
 ```

---

## Subsystem

A **Subsystem** is like a section of your robot that does a specific job. For example, you might have a drivetrain subsystem (for driving), an arm subsystem (for moving an arm), or an intake subsystem (for picking up game pieces). Each subsystem contains the code that controls its motors, sensors, and other hardware.

**Why use subsystems?**
- They help organize your code, so each part of the robot is managed in one place.
- Only one command can control a subsystem at a time, so you don’t get conflicts.

**How do you make a subsystem?**
For a step-by-step guide on creating a subsystem, see [Creating a Subsystem](../03_Create_Subsystem_or_Command/index.md#creating-a-subsystem).

```cpp
#include <frc2/command/SubsystemBase.h>

class DriveSubsystem : public frc2::SubsystemBase {
 public:
  DriveSubsystem() {
    // Set up motors and sensors here
  }
  void Drive(double speed, double rotation) {
    // Code to drive the robot
  }
};
```

For more details, see the [WPILib Subsystems documentation](https://docs.wpilib.org/en/stable/docs/software/commandbased/subsystems.html).

---

## Command

A **Command** is a reusable piece of code that tells your robot to do something, like drive forward, move an arm, or wait for a sensor. Commands run when scheduled, until they are interrupted or their end condition is met

#### Types of Commands

WPILib provides several types of commands:

- **InstantCommand**: Runs code once and then finishes.
- **RunCommand**: Runs code repeatedly until interrupted or finished.
- **WaitCommand**: Waits for a set amount of time.
- **ScheduleCommand**: Schedules another command.
- **Subsystem Command**: Controls a subsystem (like driving or shooting).
- **Command Groups**: Combine multiple commands to run in sequence or in parallel.

#### Command Lifecycle Methods

Every command can override these methods:
- `Initialize()`: Runs once when the command is scheduled.
- `Execute()`: Runs repeatedly while the command is active.
- `End(bool interrupted)`: Runs once when the command ends or is interrupted.
- `IsFinished()`: Returns true when the command should end.

#### Creating a Simple Command

Here’s a simple command that drives the robot forward while it is scheduled:

```cpp
#include <frc2/command/CommandHelper.h>
#include <frc2/command/CommandBase.h>

class DriveForwardCommand : public frc2::CommandHelper<frc2::CommandBase, DriveForwardCommand> {
 public:
  explicit DriveForwardCommand(DriveSubsystem* drive) : m_drive(drive) {
    AddRequirements({m_drive});
  }
  void Execute() override {
    m_drive->Drive(0.5, 0.0); // Drive forward at half speed
  }
  void End(bool interrupted) override {
    m_drive->Drive(0.0, 0.0); // Stop the robot
  }
  bool IsFinished() override {
    return false; // Run until interrupted
  }
 private:
  DriveSubsystem* m_drive;
};
```

#### More Information

For more details and advanced usage, see the [WPILib Commands documentation](https://docs.wpilib.org/en/stable/docs/software/commandbased/commands.html).

---

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
_____________________________________________________________________________________________________________________________________________________

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
_____________________________________________________________________________________________________________________________________________________

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
_____________________________________________________________________________________________________________________________________________________