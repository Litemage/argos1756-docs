---
sidebar_position: 1
---

## If it's your First Time Here...

If this is your first introduction to programming in the FRC ecosystem: **welcome!!**.

In FRC, robots are programmed using the C++ language alongside the [WPILib](https://docs.wpilib.org/en/stable/)
control system, which is essentially just a big tool box that we use to create software for the robots.
We won't dig into the guts here, but if you want to read more: follow the link above.

## So - Programming? 💻

We typically think of computers as **black boxes**: we click on pictures on a screen,
and somehow this magical box of silicon tricks spits out websites, games, videos,
and all manners of sorcery.

Turns out, it's not magic at all: just code! The robot you are about to write for
is no different, except it's missing everything we use to interract with a computer:
mouse, keyboard, screen, sound, etc.

This is an example of a so-called **embedded system**. From [Wikipedia](https://en.wikipedia.org/wiki/Embedded_system):

> "*An embedded system is a specialized computer system—a combination of a computer processor, computer memory, and input/output peripheral devices—that has a dedicated function within a larger mechanical or electronic system.*"

Long story short: it is a computer that has no way for you, the user, to give it input 
(at least in traditional ways). The computer is designed to do one thing over and over again,
without much complaining.

In FRC, the rules designate that we must use a **RoboRio 2 by National Instruments** that looks like this:

![roborio-image](https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fforums.ni.com%2Flegacyfs%2Fonline%2F174340_roboRIO%2520anaotated.png&f=1&nofb=1&ipt=abd65e9769b8d1f8166ed650560ab7b45eaf6d969a9dcdf8d66f6c3343ab9467)

This is the comptuer you are writing code for! In ARGOS 1756, we use the **C++ language**,
but it is also possible to write code using **Python**, **Java**, and **LabView**.

If you don't know what a programming language is, it is just like any other language
(Spanish, French, German) but instead of talking beteween people, you are talking to comptuers.

## Meet **Your** Robot. 🤖

The NI RoboRio is pretty expensive, and requires a lot more hardware to get a 
minimal robot working, so we've decided to help you learn using
[Sparkfun's XRP Platform](https://www.sparkfun.com/xrp?gad_source=1&gad_campaignid=17479024030&gclid=EAIaIQobChMIwsvtz8qBjgMV0FtHAR2F1BCJEAAYASAAEgLHvvD_BwE):

![sparkfun xrp robot](https://www.sparkfun.com/media/catalog/product/cache/6481a7e801770ff450b11f3cf63d7638/X/R/XRP_Robot-02.jpg)

The beautiful thing about this robot is you can program it using WPILib! This
makes it perfect for low-risk, low-cost training. This will be the robot you get
driving around in these tutorial.

Lets get started coding.  We will start with the hello world tutorial.
