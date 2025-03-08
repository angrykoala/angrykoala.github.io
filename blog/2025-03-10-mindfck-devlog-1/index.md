---
draft: true
tags: [Esolangs]
---

# Mindfck: A High Level Programming Language to Brainfuck Devlog 1

A few months ago. I decided to embark on another esolang project: [Minfck](https://github.com/angrykoala/mindfck), a simple, easy to use, language that transpiles to the infamous [Brainfuck](https://en.wikipedia.org/wiki/Brainfuck). In this and following posts I'll describe the journey of making this ridiculous project, challenges and solutions.

With Mindfck, a fairly inocuous code such as:

```c
int a
int b
a = 3 + a
a = 33 + a
a = a + 2
int c
a = a + 21
a = a + 2
b = 10 + a
c = a + b
print c
```

Transpiles to

```brainfuck
>>>>[-]>[-]+++>>>[-]<<[-]<<[>>+>>+<<<<-][-]>>>>[<<<<+>>>>-][-]<[-]<<[>>+>+<<<-][-]>>>[<<<+>>>-][-]<<<<<<<<[>>>>>>>>+<<+<<<<<<-][-]>>>>>>>>[<<<<<<<<+>>>>>>>>-]>[-]<[-]<<<<<<<[>>>>>>>+>+<<<<<<<<-][-]>>>>>>>>[<<<<<<<<+>>>>>>>>-]<[<+>>[-]+>>[-]<[-]<<<[>>>+>+<<<<-][-]>>>>[<<<<+>>>>-]<[<->[-]]>[-]<[-]<[>+>+<<-][-]>>[<<+>>-]<[<<<<+>>>>[-]]<<-]<<<<[-]<<<<[-]>>>>>>[<<<<<<+>>>>+>>-][-]<<[>>+<<-][-]<<<[-]>>>>>>[<<<<<<+>>>+>>>-][-]<<<[>>>+<<<-][-]>[-]+++++++++++++++++++++++++++++++++>>>[-]<<[-]<<[>>+>>+<<<<-][-]>>>>[<<<<+>>>>-][-]<[-]<<[>>+>+<<<-][-]>>>[<<<+>>>-][-]<<<<<<<<[>>>>>>>>+<<+<<<<<<-][-]>>>>>>>>[<<<<<<<<+>>>>>>>>-]>[-]<[-]<<<<<<<[>>>>>>>+>+<<<<<<<<-][-]>>>>>>>>[<<<<<<<<+>>>>>>>>-]<[<+>>[-]+>>[-]<[-]<<<[>>>+>+<<<<-][-]>>>>[<<<<+>>>>-]<[<->[-]]>[-]<[-]<[>+>+<<-][-]>>[<<+>>-]<[<<<<+>>>>[-]]<<-]<<<<[-]<<<<[-]>>>>>>[<<<<<<+>>>>+>>-][-]<<[>>+<<-][-]<<<[-]>>>>>>[<<<<<<+>>>+>>>-][-]<<<[>>>+<<<-][-]>[-]++>>>[-]<<[-]<<<<<<[>>>>>>+>>+<<<<<<<<-][-]>>>>>>>>[<<<<<<<<+>>>>>>>>-][-]<[-]<<<<<<[>>>>>>+>+<<<<<<<-][-]>>>>>>>[<<<<<<<+>>>>>>>-][-]<<<<[>>>>+<<+<<-][-]>>>>[<<<<+>>>>-]>[-]<[-]<<<[>>>+>+<<<<-][-]>>>>[<<<<+>>>>-]<[<+>>[-]+>>[-]<[-]<<<[>>>+>+<<<<-][-]>>>>[<<<<+>>>>-]<[<->[-]]>[-]<[-]<[>+>+<<-][-]>>[<<+>>-]<[<<<<+>>>>[-]]<<-]<<<<[-]<<<<[-]>>>>>>[<<<<<<+>>>>+>>-][-]<<[>>+<<-][-]<<<[-]>>>>>>[<<<<<<+>>>+>>>-][-]<<<[>>>+<<<-]>>[-]>[-]+++++++++++++++++++++>>>[-]<<[-]<<<<<<<<[>>>>>>>>+>>+<<<<<<<<<<-][-]>>>>>>>>>>[<<<<<<<<<<+>>>>>>>>>>-][-]<[-]<<<<<<<<[>>>>>>>>+>+<<<<<<<<<-][-]>>>>>>>>>[<<<<<<<<<+>>>>>>>>>-][-]<<<<[>>>>+<<+<<-][-]>>>>[<<<<+>>>>-]>[-]<[-]<<<[>>>+>+<<<<-][-]>>>>[<<<<+>>>>-]<[<+>>[-]+>>[-]<[-]<<<[>>>+>+<<<<-][-]>>>>[<<<<+>>>>-]<[<->[-]]>[-]<[-]<[>+>+<<-][-]>>[<<+>>-]<[<<<<+>>>>[-]]<<-]<<<<[-]<<<<<<[-]>>>>>>>>[<<<<<<<<+>>>>>>+>>-][-]<<[>>+<<-][-]<<<<<[-]>>>>>>>>[<<<<<<<<+>>>>>+>>>-][-]<<<[>>>+<<<-][-]>[-]++>>>[-]<<[-]<<<<<<<<[>>>>>>>>+>>+<<<<<<<<<<-][-]>>>>>>>>>>[<<<<<<<<<<+>>>>>>>>>>-][-]<[-]<<<<<<<<[>>>>>>>>+>+<<<<<<<<<-][-]>>>>>>>>>[<<<<<<<<<+>>>>>>>>>-][-]<<<<[>>>>+<<+<<-][-]>>>>[<<<<+>>>>-]>[-]<[-]<<<[>>>+>+<<<<-][-]>>>>[<<<<+>>>>-]<[<+>>[-]+>>[-]<[-]<<<[>>>+>+<<<<-][-]>>>>[<<<<+>>>>-]<[<->[-]]>[-]<[-]<[>+>+<<-][-]>>[<<+>>-]<[<<<<+>>>>[-]]<<-]<<<<[-]<<<<<<[-]>>>>>>>>[<<<<<<<<+>>>>>>+>>-][-]<<[>>+<<-][-]<<<<<[-]>>>>>>>>[<<<<<<<<+>>>>>+>>>-][-]<<<[>>>+<<<-][-]>[-]++++++++++>>>[-]<<[-]<<[>>+>>+<<<<-][-]>>>>[<<<<+>>>>-][-]<[-]<<[>>+>+<<<-][-]>>>[<<<+>>>-][-]<<<<<<<<<<[>>>>>>>>>>+<<+<<<<<<<<-][-]>>>>>>>>>>[<<<<<<<<<<+>>>>>>>>>>-]>[-]<[-]<<<<<<<<<[>>>>>>>>>+>+<<<<<<<<<<-][-]>>>>>>>>>>[<<<<<<<<<<+>>>>>>>>>>-]<[<+>>[-]+>>[-]<[-]<<<[>>>+>+<<<<-][-]>>>>[<<<<+>>>>-]<[<->[-]]>[-]<[-]<[>+>+<<-][-]>>[<<+>>-]<[<<<<+>>>>[-]]<<-]<<<<[-]<<<<[-]>>>>>>[<<<<<<+>>>>+>>-][-]<<[>>+<<-][-]<<<[-]>>>>>>[<<<<<<+>>>+>>>-][-]<<<[>>>+<<<-]>>[-]<<[-]<<<<<<[>>>>>>+>>+<<<<<<<<-][-]>>>>>>>>[<<<<<<<<+>>>>>>>>-][-]<[-]<<<<<<[>>>>>>+>+<<<<<<<-][-]>>>>>>>[<<<<<<<+>>>>>>>-][-]<<<<<<[>>>>>>+<<+<<<<-][-]>>>>>>[<<<<<<+>>>>>>-]>[-]<[-]<<<<<[>>>>>+>+<<<<<<-][-]>>>>>>[<<<<<<+>>>>>>-]<[<+>>[-]+>>[-]<[-]<<<[>>>+>+<<<<-][-]>>>>[<<<<+>>>>-]<[<->[-]]>[-]<[-]<[>+>+<<-][-]>>[<<+>>-]<[<<<<+>>>>[-]]<<-][-]<<<<[-]>>[<<+>>>>+<<-][-]>>[<<+>>-][-]<<<[-]>>[<<+>>>+<-][-]>[<+>-][-]<<[-]<<[>>+>>+<<<<-][-]>>>>[<<<<+>>>>-][-]<[-]<<[>>+>+<<<-][-]>>>[<<<+>>>-]>[-]++++++++++>[-]>[-]>[-]>[-]>[-]<<<<<<[-]>>>>>>>[-]+>>>[-]<[-]<<<<<<<<<<<[>>>>>>>>>>>+>+<<<<<<<<<<<<-][-]>>>>>>>>>>>>[<<<<<<<<<<<<+>>>>>>>>>>>>-]<[<<[-]>>[-]]>[-]<[-]<<<<<<<<<<[>>>>>>>>>>+>+<<<<<<<<<<<-][-]>>>>>>>>>>>[<<<<<<<<<<<+>>>>>>>>>>>-]<[<<[-]>>[-]]<[-]+>>[-]<[-]<<[>>+>+<<<-][-]>>>[<<<+>>>-]<[<->[-]]<[<<<<<<+>>>>>>>>[-]<[-]<<<<<<<[>>>>>>>+>+<<<<<<<<-][-]>>>>>>>>[<<<<<<<<+>>>>>>>>-][-]<<<<<<<<<[>>>>>>>>>+<-<<<<<<<<-][-]>>>>>>>>>[<<<<<<<<<+>>>>>>>>>-]<<<<<<<<<<[-]+>>>>>>>>>>>[-]<[-]<[>+>+<<-][-]>>[<<+>>-]<[<<<<<<<<<<[-]>>>>>>>>>>[-]]<[-]<<<<<<<<<[>>>>>>>>>+>+<<<<<<<<<<-][-]>>>>>>>>>>[<<<<<<<<<<+>>>>>>>>>>-]<[<<<<<<<[-]>+>>>>>>>>[-]<[-]<<<<<<<[>>>>>>>+>+<<<<<<<<-][-]>>>>>>>>[<<<<<<<<+>>>>>>>>-][-]<<<<<<<<<<[>>>>>>>>>>+<-<<<<<<<<<-][-]>>>>>>>>>>[<<<<<<<<<<+>>>>>>>>>>-]<<<<<<<<<<<[-]+>>>>>>>>>>>>[-]<[-]<[>+>+<<-][-]>>[<<+>>-]<[<<<<<<<<<<<[-]>>>>>>>>>>>[-]]<[-]<<<<<<<<<<[>>>>>>>>>>+>+<<<<<<<<<<<-][-]>>>>>>>>>>>[<<<<<<<<<<<+>>>>>>>>>>>-]<[<<<<<<<[-]>+>>>>>>>>[-]<[-]<<<<<<<[>>>>>>>+>+<<<<<<<<-][-]>>>>>>>>[<<<<<<<<+>>>>>>>>-][-]<<<<<<<<<<<[>>>>>>>>>>>+<-<<<<<<<<<<-][-]>>>>>>>>>>>[<<<<<<<<<<<+>>>>>>>>>>>-]<<<<<<<<<<<<[-]+>>>>>>>>>>>>>[-]<[-]<[>+>+<<-][-]>>[<<+>>-]<[<<<<<<<<<<<<[-]>>>>>>>>>>>>[-]]<[-]<<<<<<<<<<<[>>>>>>>>>>>+>+<<<<<<<<<<<<-][-]>>>>>>>>>>>>[<<<<<<<<<<<<+>>>>>>>>>>>>-]<[<<<<<<<[-]>+>>>>>>>>[-]<[-]<<<<<<<[>>>>>>>+>+<<<<<<<<-][-]>>>>>>>>[<<<<<<<<+>>>>>>>>-][-]<<<<<<<<<<<<[>>>>>>>>>>>>+<-<<<<<<<<<<<-][-]>>>>>>>>>>>>[<<<<<<<<<<<<+>>>>>>>>>>>>-]<<<<<<<<<<<<<[-]+>>>>>>>>>>>>>>[-]<[-]<[>+>+<<-][-]>>[<<+>>-]<[<<<<<<<<<<<<<[-]>>>>>>>>>>>>>[-]]<[-]<<<<<<<<<<<<[>>>>>>>>>>>>+>+<<<<<<<<<<<<<-][-]>>>>>>>>>>>>>[<<<<<<<<<<<<<+>>>>>>>>>>>>>-]<[<<<<<<<[-]>+>>>>>>>>[-]<[-]<<<<<<<[>>>>>>>+>+<<<<<<<<-][-]>>>>>>>>[<<<<<<<<+>>>>>>>>-][-]<<<<<<<<<<<<<[>>>>>>>>>>>>>+<-<<<<<<<<<<<<-][-]>>>>>>>>>>>>>[<<<<<<<<<<<<<+>>>>>>>>>>>>>-]<<<<<<<<<<<<<<[-]+>>>>>>>>>>>>>>>[-]<[-]<[>+>+<<-][-]>>[<<+>>-]<[<<<<<<<<<<<<<<[-]>>>>>>>>>>>>>>[-]]<<[-]]<[-]]<[-]]<[-]]+>>[-]<[-]<<<<<<<<<<<[>>>>>>>>>>>+>+<<<<<<<<<<<<-][-]>>>>>>>>>>>>[<<<<<<<<<<<<+>>>>>>>>>>>>-]<[<->[-]]>[-]<[-]<[>+>+<<-][-]>>[<<+>>-]<[<<<<<<<<<<<<->>>>>>>>>>>>[-]]<<<<<<<<<<<->>>>>>>>[-]+>>>[-]<[-]<<<<<<<<<<<[>>>>>>>>>>>+>+<<<<<<<<<<<<-][-]>>>>>>>>>>>>[<<<<<<<<<<<<+>>>>>>>>>>>>-]<[<<[-]>>[-]]>[-]<[-]<<<<<<<<<<[>>>>>>>>>>+>+<<<<<<<<<<<-][-]>>>>>>>>>>>[<<<<<<<<<<<+>>>>>>>>>>>-]<[<<[-]>>[-]]<[-]+>>[-]<[-]<<[>>+>+<<<-][-]>>>[<<<+>>>-]<[<->[-]]<]<[-]++++++++++++++++++++++++++++++++++++++++++++++++>>[-]<[-]<<[>>+>+<<<-][-]>>>[<<<+>>>-]<[>[-]<<[>>+<<<+>-][-]>>[<<+>>-]<<<.>>[-]]+++>[-]+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++>[-]>>>>>[-]<<[-]<<<<<<<<<<<<<<<<<[>>>>>>>>>>>>>>>>>+>>+<<<<<<<<<<<<<<<<<<<-][-]>>>>>>>>>>>>>>>>>>>[<<<<<<<<<<<<<<<<<<<+>>>>>>>>>>>>>>>>>>>-][-]<[-]<<<<<<[>>>>>>+>+<<<<<<<-][-]>>>>>>>[<<<<<<<+>>>>>>>-]<<<<[-]>[-]<<[-]>>>[<<+>>>[-<<<[-]>+>>]<<<[-<+>]>[->>+<<]>>-<-]<[-]<[-]<[>+>+<<-][-]>>[<<+>>-]<[<<<<<<<<<<<[-]+>>>>>>>>>>>[-]]>[-]<[-]<<<<<<<<<<<<<<<[>>>>>>>>>>>>>>>+>+<<<<<<<<<<<<<<<<-][-]>>>>>>>>>>>>>>>>[<<<<<<<<<<<<<<<<+>>>>>>>>>>>>>>>>-][-]<<<<[>>>>+<-<<<-][-]>>>>[<<<<+>>>>-]<<[-]+>>>[-]<[-]<[>+>+<<-][-]>>[<<+>>-]<[<<[-]>>[-]]<[-]<[>+>+<<-][-]>>[<<+>>-]<[>>>>>[-]<<[-]<<<<<<<<<<<<<<<<<[>>>>>>>>>>>>>>>>>+>>+<<<<<<<<<<<<<<<<<<<-][-]>>>>>>>>>>>>>>>>>>>[<<<<<<<<<<<<<<<<<<<+>>>>>>>>>>>>>>>>>>>-][-]<[-]<<<<<<[>>>>>>+>+<<<<<<<-][-]>>>>>>>[<<<<<<<+>>>>>>>-]<<<<[-]>[-]<<<<<<<<<<<<<[-]>>>>>>>>>>>>>>[<<+>>>[-<<<[-]>+>>]<<<[-<<<<<<<<<<<<+>>>>>>>>>>>>]>[->>+<<]>>-<-]<<<[-]]<[-]<<<<<<<<<<[>>>>>>>>>>+>+<<<<<<<<<<<-][-]>>>>>>>>>>>[<<<<<<<<<<<+>>>>>>>>>>>-]<[>[-]<<<<[>>>>+<<<<<<+>>-][-]>>>>[<<<<+>>>>-]<<<<<<.>>>>>[-]]<<[-]>[-]+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++>[-]>>>>>[-]<<[-]<<<<<<<<<<<<<<<<<[>>>>>>>>>>>>>>>>>+>>+<<<<<<<<<<<<<<<<<<<-][-]>>>>>>>>>>>>>>>>>>>[<<<<<<<<<<<<<<<<<<<+>>>>>>>>>>>>>>>>>>>-][-]<[-]<<<<<<[>>>>>>+>+<<<<<<<-][-]>>>>>>>[<<<<<<<+>>>>>>>-]<<<<[-]>[-]<<[-]>>>[<<+>>>[-<<<[-]>+>>]<<<[-<+>]>[->>+<<]>>-<-]<[-]<[-]<[>+>+<<-][-]>>[<<+>>-]<[<<<<<<<<<<<[-]+>>>>>>>>>>>[-]]>[-]<[-]<<<<<<<<<<<<<<<[>>>>>>>>>>>>>>>+>+<<<<<<<<<<<<<<<<-][-]>>>>>>>>>>>>>>>>[<<<<<<<<<<<<<<<<+>>>>>>>>>>>>>>>>-][-]<<<<[>>>>+<-<<<-][-]>>>>[<<<<+>>>>-]<<[-]+>>>[-]<[-]<[>+>+<<-][-]>>[<<+>>-]<[<<[-]>>[-]]<[-]<[>+>+<<-][-]>>[<<+>>-]<[>>>>>[-]<<[-]<<<<<<<<<<<<<<<<<[>>>>>>>>>>>>>>>>>+>>+<<<<<<<<<<<<<<<<<<<-][-]>>>>>>>>>>>>>>>>>>>[<<<<<<<<<<<<<<<<<<<+>>>>>>>>>>>>>>>>>>>-][-]<[-]<<<<<<[>>>>>>+>+<<<<<<<-][-]>>>>>>>[<<<<<<<+>>>>>>>-]<<<<[-]>[-]<<<<<<<<<<<<<[-]>>>>>>>>>>>>>>[<<+>>>[-<<<[-]>+>>]<<<[-<<<<<<<<<<<<+>>>>>>>>>>>>]>[->>+<<]>>-<-]<<<[-]]<[-]<<<<<<<<<<[>>>>>>>>>>+>+<<<<<<<<<<<-][-]>>>>>>>>>>>[<<<<<<<<<<<+>>>>>>>>>>>-]<[>[-]<<<<[>>>>+<<<<<<<+>>>-][-]>>>>[<<<<+>>>>-]<<<<<<<.>>>>>>[-]]<<[-]>[-]+++++++++>[-]>>>>>[-]<<[-]<<<<<<<<<<<<<<<<<[>>>>>>>>>>>>>>>>>+>>+<<<<<<<<<<<<<<<<<<<-][-]>>>>>>>>>>>>>>>>>>>[<<<<<<<<<<<<<<<<<<<+>>>>>>>>>>>>>>>>>>>-][-]<[-]<<<<<<[>>>>>>+>+<<<<<<<-][-]>>>>>>>[<<<<<<<+>>>>>>>-]<<<<[-]>[-]<<[-]>>>[<<+>>>[-<<<[-]>+>>]<<<[-<+>]>[->>+<<]>>-<-]<[-]<[-]<[>+>+<<-][-]>>[<<+>>-]<[<<<<<<<<<<<[-]+>>>>>>>>>>>[-]]>[-]<[-]<<<<<<<<<<<<<<<[>>>>>>>>>>>>>>>+>+<<<<<<<<<<<<<<<<-][-]>>>>>>>>>>>>>>>>[<<<<<<<<<<<<<<<<+>>>>>>>>>>>>>>>>-][-]<<<<[>>>>+<-<<<-][-]>>>>[<<<<+>>>>-]<<[-]+>>>[-]<[-]<[>+>+<<-][-]>>[<<+>>-]<[<<[-]>>[-]]<[-]<[>+>+<<-][-]>>[<<+>>-]<[>>>>>[-]<<[-]<<<<<<<<<<<<<<<<<[>>>>>>>>>>>>>>>>>+>>+<<<<<<<<<<<<<<<<<<<-][-]>>>>>>>>>>>>>>>>>>>[<<<<<<<<<<<<<<<<<<<+>>>>>>>>>>>>>>>>>>>-][-]<[-]<<<<<<[>>>>>>+>+<<<<<<<-][-]>>>>>>>[<<<<<<<+>>>>>>>-]<<<<[-]>[-]<<<<<<<<<<<<<[-]>>>>>>>>>>>>>>[<<+>>>[-<<<[-]>+>>]<<<[-<<<<<<<<<<<<+>>>>>>>>>>>>]>[->>+<<]>>-<-]<<<[-]]<[-]<<<<<<<<<<[>>>>>>>>>>+>+<<<<<<<<<<<-][-]>>>>>>>>>>>[<<<<<<<<<<<+>>>>>>>>>>>-]<[>[-]<<<<[>>>>+<<<<<<<<+>>>>-][-]>>>>[<<<<+>>>>-]<<<<<<<<.>>>>>>>[-]]<<<[>>>+<<<<<<<<+>>>>>-][-]>>>[<<<+>>>-]<<<<<<<<.
```

<!-- truncate -->

Building a high level, understandable language that transpiles to Brainfuck is a useless project of doubtful interest, however, it is a great project for learning, not only about making languages, but about tackling a hostile environment, such as programming in Brainfuck.

## Let's Talk About Brainfuck

Brainfuck is a (in)famously hard language to program with, however, it is surprisingly easy to learn. In a nutshell, in a Brainfuck program you have a list of bytes and a single pointer, pointing to byte 0

|  0  |  1  |  2  |  3  | ... |
| :-: | :-: | :-: | :-: | :-: |
|  0  |  0  |  0  |  0  | ... |
|  ^  |     |     |     |     |

Brainfuck code is composed of 8 instructions[^1]:

| Command |                    Description                     |
| :-----: | :------------------------------------------------: |
|   `>`   |                 Increment pointer                  |
|   `<`   |                 Decrement pointer                  |
|   `+`   |                   Increment byte                   |
|   `-`   |                   Decrement byte                   |
|   `.`   |                    Output byte                     |
|   `,`   |                     Input byte                     |
|   `[`   | Begin Loop: if byte is zero, jump to matching `]`  |
|   `]`   | End Loop: If byte is nonzero, jump to matching `[` |

So for example, the following:

```brainfuck
>+>++
```

Will leave the state of memory as:

|  0  |  1  |  2  |  3  | ... |
| :-: | :-: | :-: | :-: | :-: |
|  0  |  1  |  2  |  0  | ... |
|     |     |  ^  |     |     |

With `.` and `,` we can write or read a byte into and from memory (as chars):

```brainfuck
,+.
```

```txt title="input"
a
```

```txt title="output"
b
```

For a more complex example using loops:

```brainfuck
>>+<+<+[+>]
```

The first part of the code: `>>+<+<+` will initialize the memory as follows:

|  0  |  1  |  2  |  3  | ... |
| :-: | :-: | :-: | :-: | :-: |
|  1  |  1  |  1  |  0  | ... |
|  ^  |     |     |     |     |

The loop `[+>]` will increment 1 and move left, until the selected byte is 0. What this means now is that it will add 1 to all non-zero values:

|  0  |  1  |  2  |  3  | ... |
| :-: | :-: | :-: | :-: | :-: |
|  2  |  2  |  2  |  0  | ... |
|     |     |     |  ^  |     |

You can try playing around with brainfuck using any online interpreter[^2].

### A Brainfuck Interpreter in Go

Another interesting feature of Brainfuck is how trivial is to implement an interpreter of it in a couple of hours. It is a great exercise for learning a new language. A while ago I had to learn Go[^3], so of course I decided to write a Brainfuck interpreter for this.

With a simple data structure to hold the memory as an array, pointer and output:

```go title="interpreter.go"
package bfinterpreter

import "fmt"

type Interpreter struct {
	Memory []byte
	memPtr int
	Output []byte

	ExecInstructions int
}
```

Running the interpreter is as easy as reading characters and performing the operations in a `switch` statement:

```go title="interpreter.go"
// ...

func (interpreter *Interpreter) Run(code string) {
	for i := 0; i < len(code); i++ {
			switch code[i] {
			case '+':
				interpreter.Memory[interpreter.memPtr] += 1
			case '-':
				interpreter.Memory[interpreter.memPtr] -= 1
			case '>':
				interpreter.memPtr += 1
				if len(interpreter.Memory) <= interpreter.memPtr {
					// Increases memory array as needed
					interpreter.Memory = append(interpreter.Memory, 0)
				}
			case '<':
				interpreter.memPtr -= 1
				if interpreter.memPtr < 0 {
					panic("Kaboom")
				}
			// Other instructions
		}
	}
}
```

You can find the full code in [GitHub](https://github.com/angrykoala/mindfck/blob/master/bfinterpreter/interpreter.go).

There are only a few implementations details that are worth mentioning for this post:

-   The memory size is not specified in this implementation, other implementations may impose a strict limit on memory size.
-   This implementation supports "byte wrapping", this is that if a byte overflows (> 255) it will wrap to 0. Same if it underflows.
-   This implementation does not support memory wrapping, if the pointer underflows (< 0) it will panic.

#### Custom Debugger

An advantage of building your own interpreter, is that you can add whatever tooling you may need. In this case, I added an extra command `#` which prints debugging information:

```go title="interpreter.go"
// ...

case '#':
			interpreter.Debug()


func (interpreter *Interpreter) Debug() {
	fmt.Println("Memory:", interpreter.Memory)
	fmt.Println("Output:", interpreter.Output)
	fmt.Println("Pointer:", interpreter.memPtr)
}
```

Brainfuck, by design, ignores any invalid command (considering these comments) so code written with this extra debugging command will just be ignored by other interpreters[^4].

### Some Basic Algorithms

Before embarking on making a full featured language, I had to learn a bit of Brainfuck, my knowledge before this project of Brainfuck programming was basically nil. So my first step was to try and learn some basic algorithms[^5].

**Reset Byte**
One of the most basic algorithms with some utility is resetting a byte:

```brainfuck
[-]
```

This algorithm will loop while decrementing the current byte until it is zero, at which point it will get out of the loop. This is particularly useful, because brainfuck doesn't have a mechanism of setting the bytes to a certain value (except for input (`,`)), it needs to be done by incrementing (`+`) so being able to reset a byte is necessary to reuse memory bytes.

For example, setting a position to 3, regardless of current value:

```brainfuck
[-]+++
```

**Move Byte**
Moving bytes is the basis of most other algorithms, in this case, we want to go from the following memory setup:

|  0  |  1  |  2  |  3  | ... |
| :-: | :-: | :-: | :-: | :-: |
| 48  |  0  |  0  |  0  | ... |
|  ^  |     |     |     |     |

To

|  0  |  1  |  2  |  3  | ... |
| :-: | :-: | :-: | :-: | :-: |
|  0  |  0  | 48  |  0  | ... |
|     |     |  ^  |     |     |

```brainfuck
[>>+<<-]
```

The first part of the loop `>>+` increments the target byte by one, then `<<-` will decrement the origin byte by one. This byte is acting as a counter, when the byte reaches 0, the loop will finish. Note that this loops needs to end in the original byte, as this is acting as a counter.

This algorithm assumes the target variable is 0 at the beginning. What if it is not? We can just reset!

```brainfuck
>>[-]<<[>>+<<-]
```

**Copy Byte**

What if instead of moving the byte, we want a full copy of it?. Well, to do this we need to use a third byte as a buffer:

```brainfuck
[>>+<+<-]>[<+>-]
```

Ok, it starting to get hard to follow, bear with me:

The first loop is doing something very similar to move byte, with some extra steps:

1. `>>+` Go to target byte and increment
2. `<+` Go to buffer byte and increment
3. `<-` Go to source byte and decrement

This will leave our memory like this:

|  0  |  1  |  2  |  3  | ... |
| :-: | :-: | :-: | :-: | :-: |
|  0  | 48  | 48  |  0  | ... |
|  ^  |     |     |     |     |

Note that byte 0 is the source, 1 the buffer and 2 the target. We already made a second copy, but it is not in the original position (1)! Luckily, we already know how to move a byte:

1. `>` Go to buffer byte
2. `[<+>-]` Move the buffer byte to the source byte

|  0  |  1  |  2  |  3  | ... |
| :-: | :-: | :-: | :-: | :-: |
| 48  |  0  | 48  |  0  | ... |
|  ^  |     |     |     |     |

Ok, one last algorithm for extra points:

**Add Bytes**

Let's imagine we want to add 2 bytes:

|  0  |  1  |  2  |  3  | ... |
| :-: | :-: | :-: | :-: | :-: |
| 10  | 20  |  0  |  0  | ... |
|  ^  |     |     |     |     |

So, we end up with:

|  0  |  1  |  2  |  3  | ... |
| :-: | :-: | :-: | :-: | :-: |
| 10  | 20  | 30  |  0  | ... |
|  ^  |     |     |     |     |

Well, instead of jumping straight into the brainfuck, let's plan how to achieve it with the previous algorithms:

1. Copy byte 0 into byte 2
2. Increment byte 2 the same as byte 1

The first step is now trivial with the _Copy Byte_ algorithm.

For the second step, we can actually use _Copy Byte_ again!. Because with _Copy Byte_ we are just increasing the target variable, if the variable is not 0, we will be adding them!

1. Copy byte 0 to 2, using 3 as buffer: `[>>+>+<<<-]>>>[<<<+>>>-]` (pointer at byte 3)
2. Copy byte 1 to 2, using 3 as buffer: `<<[>>+<+<-]>>[<<+>>-]`

The full code being:

```brainfuck
[>>+>+<<<-]>>>[<<<+>>>-]<<[>>+<+<-]>>[<<+>>-]
```

At this point, we are reaching unreadable, and hard to follow code, but the takeaway is that we can compose this relatively complex code from smaller, easier to understand algorithms, and keep building from there.

## The First Abstraction: Code Generation

The first step, I decided, was to start implementing some of this basic algorithms as a small library of functions, so I could start creating Brainfuck code.

### Writer

To aid on code generation, I made a simple `Writer` class[^6]. Nothing fancy, as this is my first project in Go:

```go title="writer.go"
package bfwriter

import (
	"fmt"
	"strings"
)

type BFCommand string

const (
	BFInc        BFCommand = "+"
	BFDec        BFCommand = "-"
	BFIncPointer BFCommand = ">"
	BFDecPointer BFCommand = "<"
	BFOut        BFCommand = "."
	BFIn         BFCommand = ","
	BFLoopBegin  BFCommand = "["
	BFLoopEnd    BFCommand = "]"
)

type writer struct {
	sb *strings.Builder
}

func NewWriter() *writer {
	var sb strings.Builder
	var wrt writer
	wrt.sb = &sb

	return &wrt
}

func (wrt *writer) Command(command BFCommand) {
	wrt.sb.WriteString(string(command))
}

func (wrt *writer) Comment(comment string) {
	wrt.sb.WriteString("  ")
	wrt.sb.WriteString(comment)
	wrt.sb.WriteString("\n")
}

func (wrt *writer) Print() {
	fmt.Println(wrt.sb.String())
}
```

_This way, I don't need to remember how to use `strings.Builder`_

This way I could

[^1]: [Wikipedia - Brainfuck Language Design](https://en.wikipedia.org/wiki/Brainfuck#Language_design)
[^2]: [Nayuki Brainfuck Interpreter](https://www.nayuki.io/page/brainfuck-interpreter-javascript)
[^3]: [The Go Programming Language](https://go.dev/)
[^4]: Using `#` as a debugging breakpoint is not unique to this interpreter, [kvbc's Brainfuck IDE](https://kvbc.github.io/bf-ide/) provides a similar feature.
[^5]: [esolangs.org Brainfuck algorithms](https://esolangs.org/wiki/Brainfuck_algorithms)
[^6]: [`writer.go` in GitHub](https://github.com/angrykoala/mindfck/blob/79f49f73de2895a525e1872cc4a4f4a3f2a6e058/bfwriter/writer.go)
