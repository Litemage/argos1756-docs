---
sidebar_position: 6
---
# XRP Arcade Drive  
## Overview
You saw that tank drive gave you a ton of control, but it was really hard to drive smoothly. Then, button drive was super easy to use, but you lost a lot of that fine-tuned control. Now, let's try arcade drive to find a good mix!

Arcade drive may be more familiar, because it is the basis of many video games. One joystick moves the robot forward and backward, and the second joystick turns left and right to do this, we will make the left joystick set a value for both motors and the right joystick will increase or decrease the motor speeds to turn the robot. This control scheme offers less driver control, but it’s easy to learn and many drivers enjoy it  

![Xbox Controller Arcade Drive](xbox_arcade.png)

If you have already implemented the Tank Drive tutorial, you can build on that project to add Arcade Drive functionality. No need to create a new project!

## The Pre-Code Workout 📊

Before writing any code, let's plan our `ArcadeDrive` function. This function will translate joystick inputs into motor speeds, combining forward/backward motion and turning into a single control scheme.

### Inputs and Outputs

The function needs two inputs from the joystick and will produce two outputs to control the motors.

*   **Inputs**:
    1.  **`forward` (double)**: Controls forward/backward motion (from the joystick's Y-axis).
    2.  **`turn` (double)**: Controls turning motion (from the joystick's X-axis).

*   **Outputs**:
    *   **Left Motor Speed**: Calculated as `forward + turn`.
    *   **Right Motor Speed**: Calculated as `forward - turn` (inverted).

### Tasks:
1. Read joystick Y-axis for forward/backward motion.
2. Read joystick X-axis for turning.
3. Calculate left and right motor speeds based on the inputs.
4. Set the motor speeds to control the robot.

### Flow Chart:
<details>
<summary>Flow Chart 📊</summary>

```mermaid
flowchart TD
    a[Read joystick Y-axis for forward/backward motion]
    b[Read joystick X-axis for turning]
    c[Calculate left motor speed]
    d[Calculate right motor speed]
    e[Set left motor speed]
    f[Set right motor speed]

    s(start) --> a
    a --> b
    b --> c
    c --> d
    d --> e
    e --> f
```
</details>

## Time to Start Coding

### Creating a project
If you haven't already created an XRP project, you'll need to do that now. See [How to Create an XRP Project](../../XRP Docs/03_XRP_project/index.md) If you have, it's time to start coding!

### Create a Drivetrain Subsystem

The first step is to create a subsystem for our drivetrain. See [How to Create a Subsystem](<../../WPILib VSCode Docs/03_Create_Subsystem_or_Command/index.md#creating-a-subsystem>) for instructions on how to do this. You should name your subsystem `Drivetrain`.


### Drivetrain.h Header File

For more information on what header (.h) files are, see [What are Header files](../../CPP Docs/CPP_software_quick_reference/index.md#what-are-header-files-h).

Navigate to your `Drivetrain.h` file. Here are the steps you need to follow:

1. **Include the XRP Motor header.**  
   Add the necessary include statement at the top of your file so you can use the XRP motor objects.  
   If you need help, see the [XRP Motor Quick Reference](<../../XRP Docs/02_XRP Software Quick Reference/index.md#xrp-motor>).

2. **Add the motor objects.**  
   Create objects for the left and right motors.  
   For more details, refer to the [XRP Motor Quick Reference](<../../XRP Docs/02_XRP Software Quick Reference/index.md#xrp-motor>).

3. **Add the ArcadeDrive function declaration.**  
   In the `public` section of your class, declare the ArcadeDrive function.  
   If you need help with C++ functions, check the [C++ function Quick Reference](../../CPP Docs/CPP_software_quick_reference/index.md#functions).

<details>
<summary>Your Drivetrain.h file should look like this.</summary>

```cpp
// Copyright (c) FIRST and other WPILib contributors.
// Open Source Software; you can modify and/or share it under the terms of
// the WPILib BSD license file in the root directory of this project.

#pragma once
#include <frc/xrp/XRPMotor.h>
#include <frc2/command/SubsystemBase.h>

class Drivetrain : public frc2::SubsystemBase {
 public:
  Drivetrain();

  /**
   * Will be called periodically whenever the CommandScheduler runs.
   */
  void Periodic() override;

  // ArcadeDrive has two inputs: Speed and Turning.
  void ArcadeDrive(double Speed, double Turning);

 private:
  // Components (e.g. motor controllers and sensors) should generally be
  // declared private and exposed only through public methods.

  // This creates an object for the left and right motor
  frc::XRPMotor m_left_motor{0};
  frc::XRPMotor m_right_motor{1};
};
```
</details>

### Drivetrain.cpp Source File

For more information on what source file (.cpp) files are, see [What are source files](../../CPP Docs/CPP_software_quick_reference/index.md#what-are-source-files-cpp).

Navigate to your `Drivetrain.cpp` file. Here are the steps you need to follow:

1. **ArcadeDrive function definition**
  We will add the `ArcadeDrive` function definition. If you need help with C++ functions, check the [C++ function Quick Reference](../../CPP Docs/CPP_software_quick_reference/index.md#functions).

2. **Adding function body**
  We will now add the function body.  This is where we will do the math to get the left and right motor speeds
  ``` cpp
    // Set the speed of the left and right motors based on the arcade drive inputs
    double left_motor = speed + turning;
    double right_motor = speed - turning;

    m_left_motor.Set(left_motor);
    m_right_motor.Set(right_motor);
  ```

<details>
<summary>Your Drivetrain.cpp file should look like this.</summary>

``` cpp
// Copyright (c) FIRST and other WPILib contributors.
// Open Source Software; you can modify and/or share it under the terms of
// the WPILib BSD license file in the root directory of this project.

#include "subsystems/Drivetrain.h"

Drivetrain::Drivetrain() = default;

// This method will be called once per scheduler run
void Drivetrain::Periodic() {}

void Drivetrain::ArcadeDrive(double speed, double turning){
    // Set the speed of the left and right motors based on the arcade drive inputs
    double left_motor = speed + turning;
    double right_motor = speed - turning;

    m_left_motor.Set(left_motor);
    m_right_motor.Set(right_motor);
}
```
</details>



### RobotContainer.h Header File

The `RobotContainer.h` file is where you set up your robot's main structure, including subsystems and input devices. For more information on header files, see [What are Header files](../../CPP Docs/CPP_software_quick_reference/index.md#what-are-header-files-h).

Navigate to your `RobotContainer.h` file. Here’s what you need to do:

1. **Include the Drivetrain Subsystem Header**  
   Add an `#include` statement for your `Drivetrain.h` file so you can use your drivetrain subsystem. If you need help with adding includes see [Include Statements (#include)](../../CPP Docs/CPP_software_quick_reference/index.md#include-statements-include)

2. **Declare the Drivetrain Subsystem**  
   Add a member variable for your `Drivetrain` subsystem.  If you need help see [member veriable declarations](../../CPP Docs/CPP_software_quick_reference/index.md#member-variable-declarations)

3. **Include your xbox controller**  
   Add an include for your xbox controller.   If you need help see [Xbox Controller](<../../WPILib VSCode Docs/02_WPILib Software Quick Reference/index.md#xbox-controller>)

4. **Declare the xbox controller.**  
    Add an xbox controller. If you need help see [Xbox Controller](<../../WPILib VSCode Docs/02_WPILib Software Quick Reference/index.md#xbox-controller>)

<details>
<summary>Your RobotContainer.h file should look like this:</summary>

```cpp
```
</details>




### RobotContainer.cpp Source File

The `RobotContainer.cpp` file is where you define how your robot's main container works. This is where you connect your subsystems and input devices, and set up how the robot will be controlled.

Navigate to your `RobotContainer.cpp` file. Here’s what you need to do:


<details>
<summary>Your RobotContainer.cpp file should look like this:</summary>

```cpp

```
</details>




## Time to test your code