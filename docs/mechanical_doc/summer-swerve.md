---
sidebar_position: 1
---
# Argos CTRE Swerve Test Repository

Documentation of all the little things we found while developing [this](https://github.com/JPiscitello7351/CTRE-SwerveGen) repository

## How to get current pose estimation from CTRE Phoenix 6 Swerve Drivetrain

Go take a look at the [GetState()](https://api.ctr-electronics.com/phoenix6/release/cpp/classctre_1_1phoenix6_1_1swerve_1_1_swerve_drivetrain.html#abafbc1a3533845856c1dceba84561f02)
function to see how to get various pose-related information about a drivetrain.

## How to get a raw button from a joystick

In lots of cases, you will need to fetch if a button is on or off, and make the robot
do some task based off of that button. There exists **two** ways of doing this:

* Passing a command to a trigger to run with one of the `OnTrue`, `OnFalse`, `WhileTrue`, `WhileFalse`, etc functions
* Getting the button state itself from inside a default command.

The following example **shows the second way**, from inside of a default command.
This example uses a bit of code from the repository linked in the top-right.

```cpp
// You will have some joystick object before here, like: `joystick`
//   For this example, we assume it has type: `frc2::CommandXboxController`
// Also, assuming you generated this project then you should have the drivetrain
//   subsystem as well. 
// If you are new to this code, and it was given to you, you probably already
//   have all this

void RobotContainer::ConfigureBindings()
{
    // Assume MaxSpeed and MaxAngularRate was written somewhere else...

    // Stuff ...

    drivetrain.SetDefaultCommand(
        // Drivetrain will execute this command periodically
        drivetrain.ApplyRequest([this]() -> auto&& {
            // HERE is where we will start putting our code to make 
            //   decisions based off of the buttons. 

            // This is your drive speed multiplier
            double driveSpeed = 0.15;

            // Inside of the default command, we can get the raw true/false (on/off)
            //   value of the joystick wihtout having to mess with commands
            if (joystick.RightBumper().Get())
            {
                // If the right bumper is pressed, set drive speed to 0.5
                //   if not, this will not run and drive speed will remain 0.15
                driveSpeed = 0.5;
            }

            // Now, the drivetrain will use the `driveSpeed` variable
            return drive.WithVelocityX(-joystick.GetLeftY() * MaxSpeed * driveSpeed) // Drive forward with negative Y (forward)
                .WithVelocityY(-joystick.GetLeftX() * MaxSpeed * driveSpeed) // Drive left with negative X (left)
                .WithRotationalRate(-joystick.GetRightX() * MaxAngularRate); // Drive counterclockwise with negative X (left)
        })
    );

    // More stuff ...
}
```

## Odometry is off solutions

* Check wheel diameter & that it is accurate