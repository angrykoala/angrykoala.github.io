---
title: Gaucho
category: General
date: 2017-01-15 12:27:10
tags:
---

>A graphical task runner powered by [Yerbamate](https://github.com/angrykoala/yerbamate)

Gaucho is a graphical task runner, allowing you to configure simple commands and scripts (a.k.a. tasks) to be launched and stopped whenever you want using a simple list-style GUI


<!-- more -->

## Features

* Execute your own scripts at will.
    * e.g. servers, builds, background tasks.
* Stop any running task and subprocess.
* Easy interface to see the status of all running tasks
* Simple configuration for your tasks
* Windows, Linux and Mac compatibility
* Open Source


<img src="screenshot.png" alt="Gaucho 0.1 Screenshot" width="400px" align="middle">
_Gaucho 0.1_


## Instructions

You can download the latest release of _Gaucho_ [here](https://github.com/angrykoala/gaucho/releases), or you can compile from the [source code](https://github.com/angrykoala/gaucho)

To use it, simply execute gaucho. The default gaucho configuration have some example tasks already configured, to remove, create or edit existing tasks click on the _edit button_ at the top right corner.
![Edit Button](edit.png)

In edit mode, you will see the options to _Delete_ tasks.

<img src="edit_mode.png" alt="Edit Mode" width="400px" align="middle">
_Edit Mode_

In this mode, you can create/remove _Suites_ to organize your tasks clicking on the menu button (next to the edit button).

![Edit Menu](edit_menu.png)

When adding a new task (or editing an existing one by clicking on it) you will see a simple form:

![Edit Task](edit_task.png)
_Edit Task Form_

For each task you can configure 3 parameters:
* **Task Name:** A recognizable name for the task
* **Command:** The command/script to be executed (bash, cmd, executable...)
* **Path:** The full path to execute given command (by default it will be executed on the same path as Gaucho)



> Gaucho is Licensed under GNU General Public License v3 and is available on [GitHub](https://github.com/angrykoala/gaucho)
