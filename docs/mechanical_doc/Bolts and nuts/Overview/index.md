---
sidebar_position: 1
---
import Bolt_label from './bolt and nut labelled.jpg'
import Threads from './Coarse_vs_fine_thread.png'
import button_head_10_32 from './Button_head_10_32.jpg'
import nylock from './nylock.jpg'
import Rivnuts from './Rivnuts.jpg'
import Standard_nut from './Standard_nut.jpg'

# Overview
## The Basics
A solid understanding of fasteners like bolts and nuts is crucial for building robust and reliable robots. This guide provides a quick reference for the common types of bolts and nuts used in Argos, how to identify them, and when to use each one.

### What is a Bolt?
A bolt is a type of fastener with an external male thread. Bolts are used to assemble two or more unthreaded components, with the help of a nut.

### What is a Nut?
A nut is a type of fastener with a threaded hole. Nuts are almost always used in conjunction with a mating bolt to fasten multiple parts together. Most nuts have six sides, so you can easily turn them with a wrench.  

<img src={Bolt_label} width="400"/>

---

## Bolt Naming Overview

Understanding how bolts are named is key to identifying them correctly. Here's a breakdown of the components of a bolt's name:

1.  **Diameter:** How thick the bolt is.
    *   **Larger bolts (1/4" and up):** Measured in fractions of an inch (e.g., 1/4", 1/2").
    *   **Smaller bolts (under 1/4"):** Uses a number system from #0 to #12. A bigger number means a bigger bolt.

2.  **Threads Per Inch (TPI) & Thread Type:** This tells you how many threads (grooves) are in one inch of the bolt's length and indicates whether the thread is coarse or fine.
    *   **Coarse Thread (UNC):** Fewer threads per inch (lower TPI). More common and easier to assemble.
    *   **Fine Thread (UNF):** More threads per inch (higher TPI) for the same diameter. This provides a stronger hold and is better for applications with vibrations.

        <img src={Threads} width="300"/>

3.  **Length:** How long the bolt is, measured in inches from under the head to the tip for most common bolts.

### Putting It Together

You'll see sizes like **"1/4-20 UNC x 1"** or **"1/4-28 UNF x 1"**. Here's what that means:

*   **"1/4"** is the diameter.
*   **"-20 UNC"** means 20 coarse threads per inch.
*   **"-28 UNF"** means 28 fine threads per inch (for the same 1/4" diameter).
*   **"x 1"** means it's 1 inch long.

So, you primarily need to know **Diameter - Threads Per Inch (which indicates Coarse/Fine) - Length**. For the same diameter, a fine thread bolt will have a higher TPI number.

---
## Argos  Bolt Quick Guide

Here's a quick guide to selecting the right bolts for different applications on our team:

*   **Competition Robot? Use 10-32 Bolts.**
    *   These are #10 size bolts with 32 threads per inch (a fine thread).
    *   **Think:** Fine threads for the Final robot – they hold tight!

        <img src={button_head_10_32} width="200"/>

*   **Prototyping with 80/20? Use 1/4-20 Bolts.**
    *   These are 1/4 inch thick bolts with 20 threads per inch (a coarse thread).
    *   **Think:** Coarse threads for construction and quick changes with 80/20.

*   **Exceptions**
    *   For the end of shafts, we use 1/4" bolts.

---

## Argos Nut Quick Refrence 

We commonly use 3 types of nuts:

*   **Nyloc Nuts:** A nyloc nut is a special kind of nut designed to resist loosening. It has a plastic ring inside that squeezes the bolt threads, making it harder for the nut to vibrate off.
    *   You can identify them by the colored plastic ring inside one end of the nut.
    *   **Should not use Loctite** with nyloc nuts, as it can damage the nylon insert.
    *   **Good to know:** The bolt needs to go all the way through the plastic part for it to work correctly. They can be reused, but may lose some grip over time.  

        <img src={nylock} width="300"/>

*   **Rivnuts:** These are threaded inserts that are installed into a material (like a piece of tubing) to provide a threaded hole. They look like a rivet with threads on the inside.
    *   **Should use Loctite** to secure the bolt within the rivnut.

        <img src={Rivnuts} width="200"/>

*   **Standard Nuts:** These are the basic nuts with internal threads that screw onto a bolt. They typically have a hexagonal shape and no special inserts or features for locking.
    *   **Should use Loctite** to prevent them from loosening due to vibration.

        <img src={Standard_nut} width="200"/>

