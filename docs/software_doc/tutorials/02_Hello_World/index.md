---
sidebar_position: 2
---

# Hello World in C++

Welcome to your first step into the world of programming! In this tutorial, we'll be creating a "Hello, World!" program in C++.

---

## What is "Hello, World!"?

"Hello, World!" is a classic and simple program that, when run, displays the message "Hello, World!" on the screen. It's traditionally the very first program that beginners write when they are learning a new programming language.

The purpose of a "Hello, World!" program is to:
-   Confirm that your programming environment (compiler, editor, etc.) is set up correctly.
-   Introduce you to the basic syntax and structure of a programming language.
-   Give you a small, achievable first win to build your confidence.

Think of it as the programming equivalent of saying "hello" when you meet someone new. It's a simple greeting to the vast world of coding.

Let's get started!

---

## Creating a project
The first step in writing our "Hello, World!" program is to create a new project. This project will contain all the necessary files and configurations for our application.

For detailed instructions on how to create a new project, please follow the guide for [creating an XRP project](../../XRP_Docs/XRP_project/tutorial_XRP_Project.md).

Once your project is created, return to this tutorial to write your first lines of C++ code.

---

## Opening Robot.cpp
Now that your project is set up, we need to open the file where we will write our code. We will be writing our code in the `Robot.cpp` file.

In the file explorer on the left side of VS Code, navigate to the `src\main\cpp` folder. Inside this folder, you will find `Robot.cpp`. Double-click it to open it in the editor.  
![Robot.cpp](Robot_CPP_Location.png)

---

## Writing Code
Now for the fun part - writing the code! We are going to add code that prints "Hello, World!" to the console when our program starts.

### Step 1: Include the Input/Output Library

At the very top of `Robot.cpp`, you'll see several lines that start with `#include`. These lines bring in pre-written code, or libraries, that give us extra functionality. To print to the console, we need the `iostream` library, which stands for Input/Output Stream.

Add the following line with the other includes:
```
#include <iostream>
```

### Step 2: Add the Print Statement

Next, we need to add a line of code that tells the program to print "Hello, World!" to the console. Find the `Robot::RobotPeriodic()` function in `Robot.cpp`.

Inside the `Robot::RobotPeriodic()` function, after the  `{` add the following line:
```
std::cout << "Hello, World!\n";
```
<details>
<summary> your code should now look like this  📊</summary>
    ```cpp
    // Copyright (c) FIRST and other WPILib contributors.
    // Open Source Software; you can modify and/or share it under the terms of
    // the WPILib BSD license file in the root directory of this project.

    #include "Robot.h"

    #include <frc2/command/CommandScheduler.h>

    #include <iostream>

    Robot::Robot() {}

    /**
    * This function is called every 20 ms, no matter the mode. Use
    * this for items like diagnostics that you want to run during disabled,
    * autonomous, teleoperated and test.
    *
    * <p> This runs after the mode specific periodic functions, but before
    * LiveWindow and SmartDashboard integrated updating.
    */
    void Robot::RobotPeriodic() {
    frc2::CommandScheduler::GetInstance().Run();

        std::cout << "Hello, World!\n";
    }
    ```
</details>

**Note:** Don't worry if you don't understand all of this code right now. We will go over all the details in future tutorials. The main goal here is to get your first program running!

---

## Running your code
Now that you've written and saved your code, the next step is to run it and see your message appear!

For detailed instructions, please follow the guide on [how to simulate your robot code](<../../WPILib_VS CodeDocs/04_Simulate Robot Code/index.md>)

