---
sidebar_position: 5
---
# Tuning
## Overview
> This tutorial builds on the [XRP Button Drive](../04_Button_Drive/index.md). If you have not completed that one, please do so before continuing.

As you might have noticed when testing your button drive code, the robot turns a little too quickly. This is a great opportunity to address an important concept in programming: **magic numbers**.

Magic numbers are hardcoded values like `1` or `-1` that appear in your code without explanation. They can make your code harder to read and maintain. In this tutorial, we will learn how to replace these magic numbers with meaningful variables to make tuning your turning speed easier and your code more understandable.

---

## The Problem with "Magic Numbers"

In our `ButtonDrive` function, we used values like `1` and `-1` directly in the code: `m_left_motor.Set(1);`. These hardcoded, unexplained numbers are often called **"magic numbers."**

They cause two main problems:
1.  **Hard to Read:** What does `1` mean? Is it full power? Is it a specific speed? The number itself doesn't say.
2.  **Hard to Change:** If the robot turns too fast, you have to hunt through the code and change every `1` and `-1` related to turning. This is slow and you might miss one!

The solution is to use **variables** organized inside a **namespace**.

## What are Variables and Namespaces?

### Variables
A [**variable**](../../CPP_Docs/CPP_software_quick_reference/index.md#variables-and-data-types) is a named placeholder for a value. When you create a variable, you must also give it a **data type**, which tells the computer what kind of information it will hold. For example:
-   `double`: For numbers with decimals (like motor speeds `0.5`, `-0.75`).
-   `int`: For whole numbers (1, 2, 43).
-   `bool`: For true/false values.

We can use this in 'Drivetrain.cpp' instead of writing `1` everywhere, we can create a variable called `TurnSpeed` with a `double` data type, give it a value, and then use the *name* `TurnSpeed` in our code.

**Why is this better?**
-   **Readability:** `TurnSpeed` is much clearer than `1`.
-   **Tuning:** If the robot turns too fast, you only need to change the value of `TurnSpeed` in **one place** to update it everywhere it's used.

### Namespaces
A [**namespace**](../../CPP_Docs/CPP_software_quick_reference/index.md#namespaces) is a way to group related variables and functions under a common name. This helps organize your code and avoid naming conflicts. For example, we can create a `DrivetrainConstants` namespace to hold all the variables related to our drivetrain, like `MoveSpeed` and `TurnSpeed`.

Using a namespace ensures that these variables are logically grouped and easy to find, while also preventing them from accidentally conflicting with variables in other parts of the program.

Now, let's apply this to our project.

## Constant.h file
We will need to open the `Constants.h` file, which is located at `src/main/include/Constants.h`.

Inside this file, we will create a `DrivetrainConstants` namespace to hold our speed values. This keeps them organized and separate from other constants in your project.

Add the following code to the bottom of `Constants.h` file:

```cpp
namespace DrivetrainConstants {

    constexpr static double kMoveSpeed  = 0.75; // Speed for moving forward and backward (1 = max speed, 0 = stopped)
    constexpr static double kTurnSpeed  = 0.5; // Speed for turning left and right (1 = max speed, 0 = stopped)
}
```
<details>
<summary>Understanding the code</summary>

-   `namespace DrivetrainConstants`: This creates a container or a "scope" named `DrivetrainConstants`. It's used to group related variables together to keep the code organized and to avoid naming conflicts.
-   `constexpr`: This keyword declares the variable as a "constant expression." It means its value is fixed and must be known when the code is compiled. 
-   `static`: This keyword limits the variable's visibility to just this file. It helps prevent conflicts if another file were to accidentally declare a variable with the same name.
-   `double`: This is the data type, which means the variable can hold a number with a decimal point. This is suitable for representing speeds that aren't whole numbers.
-   `kMoveSpeed`: This is the name of the variable. The `k` prefix is a common programming convention (especially in FRC) to indicate that the variable is a constant.

</details>


## Drivetrain.h file
Now that we have defined the variables, let's use them. The first step is to let `Drivetrain` know about the file. We can do this by including the file in the 'Drivetrain.h' file

```cpp
#include "Constants.h"
```
<details>
<summary>your code should look like this</summary>

```cpp
// Copyright (c) FIRST and other WPILib contributors.
// Open Source Software; you can modify and/or share it under the terms of
// the WPILib BSD license file in the root directory of this project.

#pragma once

#include <frc2/command/SubsystemBase.h>
#include <frc/xrp/XRPMotor.h>
#include "Constants.h"

class Drivetrain : public frc2::SubsystemBase {
 public:
  Drivetrain();

  // A function to drive the robot with button drive controls.
  // It takes button press and turns them into left and right motor speeds
  void ButtonDrive(bool forward, bool backward, bool turnLeft, bool turnRight);
  
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
};

```
</details>


## Drivetrain.cpp file
Now that `Drivetrain` knows about our constants, we can use them in the `Drivetrain.cpp` file.

To access a variable from a namespace, you use the **scope resolution operator `::`**. The format is `NamespaceName::VariableName`.

In our `ButtonDrive` function, we will replace the magic numbers with our new constants:
-   `1` becomes `DrivetrainConstants::kMoveSpeed`
-   `-1` becomes `-DrivetrainConstants::kMoveSpeed`
-   The turning values will use `DrivetrainConstants::kTurnSpeed`

<details>
<summary>your code should look like this</summary>

```cpp
// Copyright (c) FIRST and other WPILib contributors.
// Open Source Software; you can modify and/or share it under the terms of
// the WPILib BSD license file in the root directory of this project.

#include "subsystems/Drivetrain.h"

Drivetrain::Drivetrain() = default;

// This method will be called once per scheduler run
void Drivetrain::Periodic() {}

// This is the definition of our Button Drive function.
// The code inside the curly braces {} is what runs when we call this function.
void Drivetrain::ButtonDrive(bool forward, bool backward, bool turnLeft, bool turnRight) 
{
// Check if the forward button is pressed
if (forward) {
  m_left_motor.Set(DrivetrainConstants::kMoveSpeed);  // Drive forward
  m_right_motor.Set(-DrivetrainConstants::kMoveSpeed); // Drive forward (inverted)
}
// Check if the backward button is pressed
else if (backward) {
  m_left_motor.Set(-DrivetrainConstants::kMoveSpeed);  // Drive backward
  m_right_motor.Set(DrivetrainConstants::kMoveSpeed);  // Drive backward (inverted)
}
// Check if the turnLeft button is pressed
else if (turnLeft) {
  m_left_motor.Set(-DrivetrainConstants::kTurnSpeed);  // Turn left
  m_right_motor.Set(-DrivetrainConstants::kTurnSpeed); // Turn left
}
// Check if the turnRight button is pressed
else if (turnRight) {
  m_left_motor.Set(DrivetrainConstants::kTurnSpeed);   // Turn right
  m_right_motor.Set(DrivetrainConstants::kTurnSpeed);  // Turn right
}
// If no buttons are pressed, stop the robot
else {
  m_left_motor.Set(0.0);   // Stop
  m_right_motor.Set(0.0);  // Stop
}
}
```
</details>

## Time to Tune!
 it is time to test your code.  Go to [XRP Run Code](<../../WPILib_VS CodeDocs/03_Create_Subsystem/index.md>) to test your code.

Now that you've replaced the magic numbers with constants, it's time to test and tune your robot.

1. **Adjust the Constants:**
   - Open the `Constants.h` file.
   - Modify the values of `kMoveSpeed` and `kTurnSpeed` to fine-tune the robot's speed and turning rate.
     - For example, if the robot moves too fast, reduce `kMoveSpeed` (e.g., change `0.75` to `0.5`).
     - If the robot turns too quickly, reduce `kTurnSpeed` (e.g., change `0.5` to `0.3`).

2. **Re-Test:**
   - Save your changes and redeploy the code.
   - Test the robot again to see if the adjustments improved its behavior.

