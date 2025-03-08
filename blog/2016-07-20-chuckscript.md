---
title: ChuckScript
date: 2016-07-20
tags: [Esolangs]
---

Chuck Norris can code using binary without 1, with Chuck Norris Programming Language (**CNPL**) you also can!. For those who think assembler is a high level language.

Here I present an esoteric programming language based on the [Unary esoteric language](https://esolangs.org/wiki/Unary) developed with _javaScript_

<!-- truncate -->

## Syntax

The syntax is probably the easiest to learn: `0` is the only command you'll need. What does `0` do? Everything.

Chuck Norris code is so powerful that no current machine can process it, so a higher abstraction was made to make the code comprehensible for humans (and machines):  
`[0]{12}` means _"twelve zeroes"_ and it is translated `000000000000` in pure Chuck Norris Code.

All ChuckScripts allow comments, and only the first command with the syntax `[0]{...}` will be executed. The extension is `.cnpl`

## Hello World!

CNPL is fully functional, based on JavaScript. To start coding, just tweak this simple hello world:

```bash
[0]{9582516168086304533950061199088375933762201813077804024987245718616842}
```

_hello_world.cnpl_

## Installation

You can install chuckScript from the official npm repository typing:

```bash
npm install -g chuckscript
```

Or you can manually clone from [github](https://github.com/angrykoala/chuckscript) and install with `npm install`

You will need node and npm installed on your system

### CNI

CNI (_Chuck Norris Interpreter_) is the official CNPL interpreter and allows you to execute CNPL (extension .cnpl) in your machine:

```bash
cni myprogram.cnpl
```

### CNGEN

Of course, CNPL is the only language you'll ever need again, however, to start learning it cni also brings a cnpl code generator, which will convert your old, un-epic JavaScript code into a bright new CNPL code, to use it:

```bash
cngen myoldjs.js newsupercode.cnpl
```

### Examples

In the folder `/examples` you'll find some ready-to-use examples of cnpl code:

-   **hello_world.cnpl:** The proper way to start learning a new language, with a easy-to-learn hello world
-   **loop.cnpl:** Learn the easy loop syntax of ChuckScript with this example
-   **sever.cnpl:** ChuckScript is web-development ready, in this example you will learn how to make your own server

## Module Usage

To use _chuckscript_ in your node.js code, simply `require('chuckscript')`:

-   `execute(code)`: Executes given cnpl code (using javascript cni).
-   `cnpl2js(code)`: Translates cnpl code to javascript, returns string with js.
-   `compile(jsCode)`: Compiles javascript code into chuckscript.

> CNPL is a improved version of [Unary esoteric language](https://esolangs.org/wiki/Unary)
