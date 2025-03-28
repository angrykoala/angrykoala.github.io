---
sidebar_position: 3
---

# ChuckScript

Chuck Norris can code binary without using 1, with the ChuckScript you also can!. For those who think assembler is a high level language.

ChuckScript is an Esolang based on the [Unary esoteric language](https://esolangs.org/wiki/Unary) developed with _javaScript_.

-   [GitHub](https://github.com/angrykoala/chuckscript)
-   [Esolangs Wiki](https://esolangs.org/wiki/ChuckScript)

## Syntax

The syntax is probably the easiest to learn: `0` is the only command you'll need. What does `0` do? Everything.

Chuck Norris code is so powerful that no current machine can process it, so a higher abstraction was made to make the code comprehensible for feeble human brains (and machines):  
`[0]{12}` means _"twelve zeroes"_ and it is translated `000000000000` in pure Chuck Norris Code.

All ChuckScripts allow comments, and only the first command with the syntax `[0]{...}` will be executed. The extension is `.cnpl`.

## Hello World!

CNPL is fully functional, based on JavaScript. To start coding, just tweak this simple hello world:

```bash title="hello_world.cnpl"
[0]{9582516168086304533950061199088375933762201813077804024987245718616842}
```

## Installation

You can install chuckScript from npm:

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
