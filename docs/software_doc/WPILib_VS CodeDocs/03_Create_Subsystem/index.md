---
sidebar_position: 3
---
# Creating a Subsystem

The first step is to create a subsystem for our drivetrain. A subsystem is a class that represents a mechanism on the robot. It should contain all the code for that mechanism, such as motors and sensors.

To create a new subsystem in VS Code with the WPILib extension:  

1. Right-click on the `src/main/include/subsystems` folder in the file explorer.  

2. Select `WPILib: Create a new class/command`.  
  ![Create Subsystem](create_subsystem_right_click.png)  

3. Choose `Subsystem` from the list.  
  ![alt text](Subystem_Selection.png)  

4. Name the new subsystem `Drivetrain`.  
  ![alt text](Drivetrain_Subsystem.png)  

5. You should see two folder now in one in `src/main/include/subsystems` called `Drivetrain.h`  and the other in `src/main/cpp/subsystems` called `Drivetrain.cpp`  
  ![alt text](Drivetrain_Files.png)
