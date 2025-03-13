---
slug: mindfck-devlog-1
date: 2025-03-13
tags: [Esolangs, Go]
---

# Mindfck Devlog 1: Making a High Level Programming Language to Brainfuck

A few months ago, I embarked on another esolang project: [Minfck](https://github.com/angrykoala/mindfck). It's a simple, easy-to-use language that transpiles to the infamous brainfuck[^7]. In this and following posts, I'll document the journey of making this ridiculous project, along with its challenges and solutions.

With Mindfck, a fairly innocuous piece of code like:

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

Transpiles to:

```brainfuck
>>>>[-]>[-]+++>>>[-]<<[-]<<[>>+>>+<<<<-][-]>>>>[<<<<+>>>>-][-]<[-]<<[>>+>+<<<-][-]>>>[<<<+>>>-][-]<<<<<<<<[>>>>>>>>+<<+<<<<<<-][-]>>>>>>>>[<<<<<<<<+>>>>>>>>-]>[-]<[-]<<<<<<<[>>>>>>>+>+<<<<<<<<-][-]>>>>>>>>[<<<<<<<<+>>>>>>>>-]<[<+>>[-]+>>[-]<[-]<<<[>>>+>+<<<<-][-]>>>>[<<<<+>>>>-]<[<->[-]]>[-]<[-]<[>+>+<<-][-]>>[<<+>>-]<[<<<<+>>>>[-]]<<-]<<<<[-]<<<<[-]>>>>>>[<<<<<<+>>>>+>>-][-]<<[>>+<<-][-]<<<[-]>>>>>>[<<<<<<+>>>+>>>-][-]<<<[>>>+<<<-][-]>[-]+++++++++++++++++++++++++++++++++>>>[-]<<[-]<<[>>+>>+<<<<-][-]>>>>[<<<<+>>>>-][-]<[-]<<[>>+>+<<<-][-]>>>[<<<+>>>-][-]<<<<<<<<[>>>>>>>>+<<+<<<<<<-][-]>>>>>>>>[<<<<<<<<+>>>>>>>>-]>[-]<[-]<<<<<<<[>>>>>>>+>+<<<<<<<<-][-]>>>>>>>>[<<<<<<<<+>>>>>>>>-]<[<+>>[-]+>>[-]<[-]<<<[>>>+>+<<<<-][-]>>>>[<<<<+>>>>-]<[<->[-]]>[-]<[-]<[>+>+<<-][-]>>[<<+>>-]<[<<<<+>>>>[-]]<<-]<<<<[-]<<<<[-]>>>>>>[<<<<<<+>>>>+>>-][-]<<[>>+<<-][-]<<<[-]>>>>>>[<<<<<<+>>>+>>>-][-]<<<[>>>+<<<-][-]>[-]++>>>[-]<<[-]<<<<<<[>>>>>>+>>+<<<<<<<<-][-]>>>>>>>>[<<<<<<<<+>>>>>>>>-][-]<[-]<<<<<<[>>>>>>+>+<<<<<<<-][-]>>>>>>>[<<<<<<<+>>>>>>>-][-]<<<<[>>>>+<<+<<-][-]>>>>[<<<<+>>>>-]>[-]<[-]<<<[>>>+>+<<<<-][-]>>>>[<<<<+>>>>-]<[<+>>[-]+>>[-]<[-]<<<[>>>+>+<<<<-][-]>>>>[<<<<+>>>>-]<[<->[-]]>[-]<[-]<[>+>+<<-][-]>>[<<+>>-]<[<<<<+>>>>[-]]<<-]<<<<[-]<<<<[-]>>>>>>[<<<<<<+>>>>+>>-][-]<<[>>+<<-][-]<<<[-]>>>>>>[<<<<<<+>>>+>>>-][-]<<<[>>>+<<<-]>>[-]>[-]+++++++++++++++++++++>>>[-]<<[-]<<<<<<<<[>>>>>>>>+>>+<<<<<<<<<<-][-]>>>>>>>>>>[<<<<<<<<<<+>>>>>>>>>>-][-]<[-]<<<<<<<<[>>>>>>>>+>+<<<<<<<<<-][-]>>>>>>>>>[<<<<<<<<<+>>>>>>>>>-][-]<<<<[>>>>+<<+<<-][-]>>>>[<<<<+>>>>-]>[-]<[-]<<<[>>>+>+<<<<-][-]>>>>[<<<<+>>>>-]<[<+>>[-]+>>[-]<[-]<<<[>>>+>+<<<<-][-]>>>>[<<<<+>>>>-]<[<->[-]]>[-]<[-]<[>+>+<<-][-]>>[<<+>>-]<[<<<<+>>>>[-]]<<-]<<<<[-]<<<<<<[-]>>>>>>>>[<<<<<<<<+>>>>>>+>>-][-]<<[>>+<<-][-]<<<<<[-]>>>>>>>>[<<<<<<<<+>>>>>+>>>-][-]<<<[>>>+<<<-][-]>[-]++>>>[-]<<[-]<<<<<<<<[>>>>>>>>+>>+<<<<<<<<<<-][-]>>>>>>>>>>[<<<<<<<<<<+>>>>>>>>>>-][-]<[-]<<<<<<<<[>>>>>>>>+>+<<<<<<<<<-][-]>>>>>>>>>[<<<<<<<<<+>>>>>>>>>-][-]<<<<[>>>>+<<+<<-][-]>>>>[<<<<+>>>>-]>[-]<[-]<<<[>>>+>+<<<<-][-]>>>>[<<<<+>>>>-]<[<+>>[-]+>>[-]<[-]<<<[>>>+>+<<<<-][-]>>>>[<<<<+>>>>-]<[<->[-]]>[-]<[-]<[>+>+<<-][-]>>[<<+>>-]<[<<<<+>>>>[-]]<<-]<<<<[-]<<<<<<[-]>>>>>>>>[<<<<<<<<+>>>>>>+>>-][-]<<[>>+<<-][-]<<<<<[-]>>>>>>>>[<<<<<<<<+>>>>>+>>>-][-]<<<[>>>+<<<-][-]>[-]++++++++++>>>[-]<<[-]<<[>>+>>+<<<<-][-]>>>>[<<<<+>>>>-][-]<[-]<<[>>+>+<<<-][-]>>>[<<<+>>>-][-]<<<<<<<<<<[>>>>>>>>>>+<<+<<<<<<<<-][-]>>>>>>>>>>[<<<<<<<<<<+>>>>>>>>>>-]>[-]<[-]<<<<<<<<<[>>>>>>>>>+>+<<<<<<<<<<-][-]>>>>>>>>>>[<<<<<<<<<<+>>>>>>>>>>-]<[<+>>[-]+>>[-]<[-]<<<[>>>+>+<<<<-][-]>>>>[<<<<+>>>>-]<[<->[-]]>[-]<[-]<[>+>+<<-][-]>>[<<+>>-]<[<<<<+>>>>[-]]<<-]<<<<[-]<<<<[-]>>>>>>[<<<<<<+>>>>+>>-][-]<<[>>+<<-][-]<<<[-]>>>>>>[<<<<<<+>>>+>>>-][-]<<<[>>>+<<<-]>>[-]<<[-]<<<<<<[>>>>>>+>>+<<<<<<<<-][-]>>>>>>>>[<<<<<<<<+>>>>>>>>-][-]<[-]<<<<<<[>>>>>>+>+<<<<<<<-][-]>>>>>>>[<<<<<<<+>>>>>>>-][-]<<<<<<[>>>>>>+<<+<<<<-][-]>>>>>>[<<<<<<+>>>>>>-]>[-]<[-]<<<<<[>>>>>+>+<<<<<<-][-]>>>>>>[<<<<<<+>>>>>>-]<[<+>>[-]+>>[-]<[-]<<<[>>>+>+<<<<-][-]>>>>[<<<<+>>>>-]<[<->[-]]>[-]<[-]<[>+>+<<-][-]>>[<<+>>-]<[<<<<+>>>>[-]]<<-][-]<<<<[-]>>[<<+>>>>+<<-][-]>>[<<+>>-][-]<<<[-]>>[<<+>>>+<-][-]>[<+>-][-]<<[-]<<[>>+>>+<<<<-][-]>>>>[<<<<+>>>>-][-]<[-]<<[>>+>+<<<-][-]>>>[<<<+>>>-]>[-]++++++++++>[-]>[-]>[-]>[-]>[-]<<<<<<[-]>>>>>>>[-]+>>>[-]<[-]<<<<<<<<<<<[>>>>>>>>>>>+>+<<<<<<<<<<<<-][-]>>>>>>>>>>>>[<<<<<<<<<<<<+>>>>>>>>>>>>-]<[<<[-]>>[-]]>[-]<[-]<<<<<<<<<<[>>>>>>>>>>+>+<<<<<<<<<<<-][-]>>>>>>>>>>>[<<<<<<<<<<<+>>>>>>>>>>>-]<[<<[-]>>[-]]<[-]+>>[-]<[-]<<[>>+>+<<<-][-]>>>[<<<+>>>-]<[<->[-]]<[<<<<<<+>>>>>>>>[-]<[-]<<<<<<<[>>>>>>>+>+<<<<<<<<-][-]>>>>>>>>[<<<<<<<<+>>>>>>>>-][-]<<<<<<<<<[>>>>>>>>>+<-<<<<<<<<-][-]>>>>>>>>>[<<<<<<<<<+>>>>>>>>>-]<<<<<<<<<<[-]+>>>>>>>>>>>[-]<[-]<[>+>+<<-][-]>>[<<+>>-]<[<<<<<<<<<<[-]>>>>>>>>>>[-]]<[-]<<<<<<<<<[>>>>>>>>>+>+<<<<<<<<<<-][-]>>>>>>>>>>[<<<<<<<<<<+>>>>>>>>>>-]<[<<<<<<<[-]>+>>>>>>>>[-]<[-]<<<<<<<[>>>>>>>+>+<<<<<<<<-][-]>>>>>>>>[<<<<<<<<+>>>>>>>>-][-]<<<<<<<<<<[>>>>>>>>>>+<-<<<<<<<<<-][-]>>>>>>>>>>[<<<<<<<<<<+>>>>>>>>>>-]<<<<<<<<<<<[-]+>>>>>>>>>>>>[-]<[-]<[>+>+<<-][-]>>[<<+>>-]<[<<<<<<<<<<<[-]>>>>>>>>>>>[-]]<[-]<<<<<<<<<<[>>>>>>>>>>+>+<<<<<<<<<<<-][-]>>>>>>>>>>>[<<<<<<<<<<<+>>>>>>>>>>>-]<[<<<<<<<[-]>+>>>>>>>>[-]<[-]<<<<<<<[>>>>>>>+>+<<<<<<<<-][-]>>>>>>>>[<<<<<<<<+>>>>>>>>-][-]<<<<<<<<<<<[>>>>>>>>>>>+<-<<<<<<<<<<-][-]>>>>>>>>>>>[<<<<<<<<<<<+>>>>>>>>>>>-]<<<<<<<<<<<<[-]+>>>>>>>>>>>>>[-]<[-]<[>+>+<<-][-]>>[<<+>>-]<[<<<<<<<<<<<<[-]>>>>>>>>>>>>[-]]<[-]<<<<<<<<<<<[>>>>>>>>>>>+>+<<<<<<<<<<<<-][-]>>>>>>>>>>>>[<<<<<<<<<<<<+>>>>>>>>>>>>-]<[<<<<<<<[-]>+>>>>>>>>[-]<[-]<<<<<<<[>>>>>>>+>+<<<<<<<<-][-]>>>>>>>>[<<<<<<<<+>>>>>>>>-][-]<<<<<<<<<<<<[>>>>>>>>>>>>+<-<<<<<<<<<<<-][-]>>>>>>>>>>>>[<<<<<<<<<<<<+>>>>>>>>>>>>-]<<<<<<<<<<<<<[-]+>>>>>>>>>>>>>>[-]<[-]<[>+>+<<-][-]>>[<<+>>-]<[<<<<<<<<<<<<<[-]>>>>>>>>>>>>>[-]]<[-]<<<<<<<<<<<<[>>>>>>>>>>>>+>+<<<<<<<<<<<<<-][-]>>>>>>>>>>>>>[<<<<<<<<<<<<<+>>>>>>>>>>>>>-]<[<<<<<<<[-]>+>>>>>>>>[-]<[-]<<<<<<<[>>>>>>>+>+<<<<<<<<-][-]>>>>>>>>[<<<<<<<<+>>>>>>>>-][-]<<<<<<<<<<<<<[>>>>>>>>>>>>>+<-<<<<<<<<<<<<-][-]>>>>>>>>>>>>>[<<<<<<<<<<<<<+>>>>>>>>>>>>>-]<<<<<<<<<<<<<<[-]+>>>>>>>>>>>>>>>[-]<[-]<[>+>+<<-][-]>>[<<+>>-]<[<<<<<<<<<<<<<<[-]>>>>>>>>>>>>>>[-]]<<[-]]<[-]]<[-]]<[-]]+>>[-]<[-]<<<<<<<<<<<[>>>>>>>>>>>+>+<<<<<<<<<<<<-][-]>>>>>>>>>>>>[<<<<<<<<<<<<+>>>>>>>>>>>>-]<[<->[-]]>[-]<[-]<[>+>+<<-][-]>>[<<+>>-]<[<<<<<<<<<<<<->>>>>>>>>>>>[-]]<<<<<<<<<<<->>>>>>>>[-]+>>>[-]<[-]<<<<<<<<<<<[>>>>>>>>>>>+>+<<<<<<<<<<<<-][-]>>>>>>>>>>>>[<<<<<<<<<<<<+>>>>>>>>>>>>-]<[<<[-]>>[-]]>[-]<[-]<<<<<<<<<<[>>>>>>>>>>+>+<<<<<<<<<<<-][-]>>>>>>>>>>>[<<<<<<<<<<<+>>>>>>>>>>>-]<[<<[-]>>[-]]<[-]+>>[-]<[-]<<[>>+>+<<<-][-]>>>[<<<+>>>-]<[<->[-]]<]<[-]++++++++++++++++++++++++++++++++++++++++++++++++>>[-]<[-]<<[>>+>+<<<-][-]>>>[<<<+>>>-]<[>[-]<<[>>+<<<+>-][-]>>[<<+>>-]<<<.>>[-]]+++>[-]+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++>[-]>>>>>[-]<<[-]<<<<<<<<<<<<<<<<<[>>>>>>>>>>>>>>>>>+>>+<<<<<<<<<<<<<<<<<<<-][-]>>>>>>>>>>>>>>>>>>>[<<<<<<<<<<<<<<<<<<<+>>>>>>>>>>>>>>>>>>>-][-]<[-]<<<<<<[>>>>>>+>+<<<<<<<-][-]>>>>>>>[<<<<<<<+>>>>>>>-]<<<<[-]>[-]<<[-]>>>[<<+>>>[-<<<[-]>+>>]<<<[-<+>]>[->>+<<]>>-<-]<[-]<[-]<[>+>+<<-][-]>>[<<+>>-]<[<<<<<<<<<<<[-]+>>>>>>>>>>>[-]]>[-]<[-]<<<<<<<<<<<<<<<[>>>>>>>>>>>>>>>+>+<<<<<<<<<<<<<<<<-][-]>>>>>>>>>>>>>>>>[<<<<<<<<<<<<<<<<+>>>>>>>>>>>>>>>>-][-]<<<<[>>>>+<-<<<-][-]>>>>[<<<<+>>>>-]<<[-]+>>>[-]<[-]<[>+>+<<-][-]>>[<<+>>-]<[<<[-]>>[-]]<[-]<[>+>+<<-][-]>>[<<+>>-]<[>>>>>[-]<<[-]<<<<<<<<<<<<<<<<<[>>>>>>>>>>>>>>>>>+>>+<<<<<<<<<<<<<<<<<<<-][-]>>>>>>>>>>>>>>>>>>>[<<<<<<<<<<<<<<<<<<<+>>>>>>>>>>>>>>>>>>>-][-]<[-]<<<<<<[>>>>>>+>+<<<<<<<-][-]>>>>>>>[<<<<<<<+>>>>>>>-]<<<<[-]>[-]<<<<<<<<<<<<<[-]>>>>>>>>>>>>>>[<<+>>>[-<<<[-]>+>>]<<<[-<<<<<<<<<<<<+>>>>>>>>>>>>]>[->>+<<]>>-<-]<<<[-]]<[-]<<<<<<<<<<[>>>>>>>>>>+>+<<<<<<<<<<<-][-]>>>>>>>>>>>[<<<<<<<<<<<+>>>>>>>>>>>-]<[>[-]<<<<[>>>>+<<<<<<+>>-][-]>>>>[<<<<+>>>>-]<<<<<<.>>>>>[-]]<<[-]>[-]+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++>[-]>>>>>[-]<<[-]<<<<<<<<<<<<<<<<<[>>>>>>>>>>>>>>>>>+>>+<<<<<<<<<<<<<<<<<<<-][-]>>>>>>>>>>>>>>>>>>>[<<<<<<<<<<<<<<<<<<<+>>>>>>>>>>>>>>>>>>>-][-]<[-]<<<<<<[>>>>>>+>+<<<<<<<-][-]>>>>>>>[<<<<<<<+>>>>>>>-]<<<<[-]>[-]<<[-]>>>[<<+>>>[-<<<[-]>+>>]<<<[-<+>]>[->>+<<]>>-<-]<[-]<[-]<[>+>+<<-][-]>>[<<+>>-]<[<<<<<<<<<<<[-]+>>>>>>>>>>>[-]]>[-]<[-]<<<<<<<<<<<<<<<[>>>>>>>>>>>>>>>+>+<<<<<<<<<<<<<<<<-][-]>>>>>>>>>>>>>>>>[<<<<<<<<<<<<<<<<+>>>>>>>>>>>>>>>>-][-]<<<<[>>>>+<-<<<-][-]>>>>[<<<<+>>>>-]<<[-]+>>>[-]<[-]<[>+>+<<-][-]>>[<<+>>-]<[<<[-]>>[-]]<[-]<[>+>+<<-][-]>>[<<+>>-]<[>>>>>[-]<<[-]<<<<<<<<<<<<<<<<<[>>>>>>>>>>>>>>>>>+>>+<<<<<<<<<<<<<<<<<<<-][-]>>>>>>>>>>>>>>>>>>>[<<<<<<<<<<<<<<<<<<<+>>>>>>>>>>>>>>>>>>>-][-]<[-]<<<<<<[>>>>>>+>+<<<<<<<-][-]>>>>>>>[<<<<<<<+>>>>>>>-]<<<<[-]>[-]<<<<<<<<<<<<<[-]>>>>>>>>>>>>>>[<<+>>>[-<<<[-]>+>>]<<<[-<<<<<<<<<<<<+>>>>>>>>>>>>]>[->>+<<]>>-<-]<<<[-]]<[-]<<<<<<<<<<[>>>>>>>>>>+>+<<<<<<<<<<<-][-]>>>>>>>>>>>[<<<<<<<<<<<+>>>>>>>>>>>-]<[>[-]<<<<[>>>>+<<<<<<<+>>>-][-]>>>>[<<<<+>>>>-]<<<<<<<.>>>>>>[-]]<<[-]>[-]+++++++++>[-]>>>>>[-]<<[-]<<<<<<<<<<<<<<<<<[>>>>>>>>>>>>>>>>>+>>+<<<<<<<<<<<<<<<<<<<-][-]>>>>>>>>>>>>>>>>>>>[<<<<<<<<<<<<<<<<<<<+>>>>>>>>>>>>>>>>>>>-][-]<[-]<<<<<<[>>>>>>+>+<<<<<<<-][-]>>>>>>>[<<<<<<<+>>>>>>>-]<<<<[-]>[-]<<[-]>>>[<<+>>>[-<<<[-]>+>>]<<<[-<+>]>[->>+<<]>>-<-]<[-]<[-]<[>+>+<<-][-]>>[<<+>>-]<[<<<<<<<<<<<[-]+>>>>>>>>>>>[-]]>[-]<[-]<<<<<<<<<<<<<<<[>>>>>>>>>>>>>>>+>+<<<<<<<<<<<<<<<<-][-]>>>>>>>>>>>>>>>>[<<<<<<<<<<<<<<<<+>>>>>>>>>>>>>>>>-][-]<<<<[>>>>+<-<<<-][-]>>>>[<<<<+>>>>-]<<[-]+>>>[-]<[-]<[>+>+<<-][-]>>[<<+>>-]<[<<[-]>>[-]]<[-]<[>+>+<<-][-]>>[<<+>>-]<[>>>>>[-]<<[-]<<<<<<<<<<<<<<<<<[>>>>>>>>>>>>>>>>>+>>+<<<<<<<<<<<<<<<<<<<-][-]>>>>>>>>>>>>>>>>>>>[<<<<<<<<<<<<<<<<<<<+>>>>>>>>>>>>>>>>>>>-][-]<[-]<<<<<<[>>>>>>+>+<<<<<<<-][-]>>>>>>>[<<<<<<<+>>>>>>>-]<<<<[-]>[-]<<<<<<<<<<<<<[-]>>>>>>>>>>>>>>[<<+>>>[-<<<[-]>+>>]<<<[-<<<<<<<<<<<<+>>>>>>>>>>>>]>[->>+<<]>>-<-]<<<[-]]<[-]<<<<<<<<<<[>>>>>>>>>>+>+<<<<<<<<<<<-][-]>>>>>>>>>>>[<<<<<<<<<<<+>>>>>>>>>>>-]<[>[-]<<<<[>>>>+<<<<<<<<+>>>>-][-]>>>>[<<<<+>>>>-]<<<<<<<<.>>>>>>>[-]]<<<[>>>+<<<<<<<<+>>>>>-][-]>>>[<<<+>>>-]<<<<<<<<.
```

<!-- truncate -->

Building a high-level, usable language that transpiles to brainfuck is a useless project on its own; it is great, however, for learning language design and creating tools to handle less-than-ideal environments. I believe the approach I've taken to make this possible may be useful for solving real-world problems.

## Let's Talk About Brainfuck

Brainfuck is an (in)famously difficult language to program with; however, it is surprisingly easy to learn. Luckily, you don't have to become an expert, I certainly didn't!

### Brainfuck Primer

In a nutshell, a brainfuck program works with a list of bytes and a single pointer, pointing at the first byte:

|  0  |  1  |  2  |  3  | ... |
| :-: | :-: | :-: | :-: | :-: |
|  0  |  0  |  0  |  0  | ... |
|  ^  |     |     |     |     |

> Note that all bytes are initialized to 0. In memory diagrams, I've numbered the bytes to better visualize what is happening. These indexes are irrelevant to brainfuck.

Brainfuck code is composed of 8 instructions[^1]. Each one is represented with a single character. Any other character is ignored and is considered a _comment_.Here is a cheatsheet:

| Command |                    Description                     |
| :-----: | :------------------------------------------------: |
|   `>`   |           Increment pointer (move right)           |
|   `<`   |           Decrement pointer (move left)            |
|   `+`   |                Increment byte by 1                 |
|   `-`   |                Decrement byte by 1                 |
|   `.`   |          Print byte as an ascii character          |
|   `,`   |           Reads an ASCII character byte            |
|   `[`   | Begin Loop: if byte is zero, jump to matching `]`  |
|   `]`   | End Loop: If byte is nonzero, jump to matching `[` |

All commands target the current byte of the pointer.

For example, the following program:

```brainfuck
>++>++ This comment is ignored
```

Finishes with the memory ain the following state:

|  0  |  1  |  2  |  3  | ... |
| :-: | :-: | :-: | :-: | :-: |
|  0  |  2  |  2  |  0  | ... |
|     |     |  ^  |     |     |

With `.` and `,`, we can write or read a byte into and from memory (as ASCII characters):

```brainfuck
,+.
```

```txt title="input"
a
```

```txt title="output"
b
```

A more complex example using loops:

```brainfuck
>>+<+<+[+>]
```

The first part of the code, `>>+<+<+`, initializes the memory as follows:

|  0  |  1  |  2  |  3  | ... |
| :-: | :-: | :-: | :-: | :-: |
|  1  |  1  |  1  |  0  | ... |
|  ^  |     |     |     |     |

The loop `[+>]` will increment 1 and move right until the selected byte is 0. In this case it will add 1 to all non-zero values until it reaches 0:

|  0  |  1  |  2  |  3  | ... |
| :-: | :-: | :-: | :-: | :-: |
|  2  |  2  |  2  |  0  | ... |
|     |     |     |  ^  |     |

> Note that infinite loops are easy to come by in brainfuck. Changing the example above to `[>+]` causes the program to run indefinitely because it increments the current byte before the loops end

You can try playing around with brainfuck using any online interpreter[^2].

### Making a Brainfuck Interpreter in Go

Implementing an interpreter for brainfuck is trivial and can be done in a couple of hours. A while ago, I had to learn Go[^3]. As a learning exercise, I decided to write a brainfuck interpreter, which soon devolved into the madness that is Mindfck.

We start with a simple data structure to hold the memory as an array, a pointer and an output buffer:

```go title="interpreter.go"
package bfinterpreter

import "fmt"

type Interpreter struct {
	Memory []byte
	memPtr int
	Output []byte
}
```

> For those unfamiliar with Go[^3], Go uses `struct` instead of classes. Uppercase properties and methods are public; lowercase are only accessible within the same package.

Running the interpreter is as simple as reading characters and executing operations in a `switch` statement, updating the structure:

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
					// Increase memory array as needed
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

You can find the full code on [GitHub](https://github.com/angrykoala/mindfck/blob/master/bfinterpreter/interpreter.go).

There are a few conventions worth mentioning:

-   The memory size is not specified in this implementation; other implementations may impose a strict limit.
-   This implementation supports _"byte wrapping"_. If a byte overflows (> 255), it wraps to 0. If it underflows (< 0), it also wraps to 0.
-   This implementation does not support _"memory wrapping"_. If the pointer underflows (< 0), it will panic.

> Different interpreters may have slightly different conventions[^8], which some programs may rely on.
>
> The code in this project will not rely on either byte or memory wrapping[^9]. This ensures that code generated with Mindfck can be run directly on most common brainfuck interpreters.

#### Custom Debugger

One advantage of building your own interpreter is that you can add any tooling you need. In this case, I added an extra command, `#`, to print debugging information:

```go title="interpreter.go"
func (interpreter *Interpreter) Run(code string) {
	// ...
		case '#':
			interpreter.Debug()
	// ...
}

func (interpreter *Interpreter) Debug() {
	fmt.Println("Memory:", interpreter.Memory)
	fmt.Println("Output:", interpreter.Output)
	fmt.Println("Pointer:", interpreter.memPtr)
}
```

By design, brainfuck ignores any invalid command, treating them as comments. This means code written with this extra debugging command will simply be ignored by other interpreters[^4].

### Basic Algorithms

Before embarking on creating a full-featured language, I had to learn a bit more about brainfuck. My knowledge of the language before this project was pitiful—aside from making some interpreters. So my first step was to learn some basic algorithms[^5].

**Reset Byte**  
Arguably, the most basic algorithm with some utility is resetting a byte:

```brainfuck
[-]
```

This algorithm loops while decrementing the current byte until it reaches zero, at which point it exits the loop. This is particularly useful because brainfuck doesn't have a built-in way to set bytes to a specific value (except when using input: `,`). Instead, values must be adjusted incrementally using `+` or `-`. Being able to reset a byte is essential for reusing memory.

For example, setting a byte to 3, regardless of its previous value:

```brainfuck
[-]+++
```

**Move Byte**

Moving bytes is the foundation of most other algorithms. In this case, we want to move the value in position 0:

|  0  |  1  |  2  |  3  | ... |
| :-: | :-: | :-: | :-: | :-: |
| 48  |  0  |  0  |  0  | ... |
|  ^  |     |     |     |     |

To position 2:

|  0  |  1  |  2  |  3  | ... |
| :-: | :-: | :-: | :-: | :-: |
|  0  |  0  | 48  |  0  | ... |
|     |     |  ^  |     |     |

```brainfuck
[>>+<<-]
```

This is done with a single loop. Let's break it down:

1. The first part, `>>+`, increments the target byte by one:

    |  0  |  1  |  2  |  3  | ... |
    | :-: | :-: | :-: | :-: | :-: |
    | 48  |  0  |  1  |  0  | ... |
    |     |     |  ^  |     |     |

2. The second part, `<<-`, decrements the source byte by one:

    |  0  |  1  |  2  |  3  | ... |
    | :-: | :-: | :-: | :-: | :-: |
    | 47  |  0  |  1  |  0  | ... |
    |  ^  |     |     |     |     |

3. Repeat until the source byte reaches 0.

When the loop finishes, the target byte contains the same value the source byte had at the beginning:

|  0  |  1  |  2  |  3  | ... |
| :-: | :-: | :-: | :-: | :-: |
|  0  |  0  | 48  |  0  | ... |
|  ^  |     |     |     |     |

Note that this loop must end with the pointer on the source byte during each iteration, as this byte acts as a counter.

This algorithm assumes the target byte starts at 0. What if it doesn’t? We can reset it first:

```brainfuck
>>[-] Reset byte 2
<< Go to byte 0
[>>+<<-] Move byte 0 to byte 2
```

> Remember, brainfuck ignores all invalid characters, so the previous snippet is valid brainfuck that you can copy and paste.

**Copy Byte**

What if, instead of moving the byte, we want to make a full copy of it? To do this, we need to use a third byte as a buffer:

```brainfuck
[>>+<+<-]>[<+>-]
```

Okay, it’s starting to get a bit tricky, but bear with me:

This algorithm consists of 2 loops. The first loop `[>>+<+<-]` is doing something very similar to moving a byte, with some extra steps:

1. `>>+` Go to the target byte (2) and increment it:

    |  0  |  1  |  2  |  3  | ... |
    | :-: | :-: | :-: | :-: | :-: |
    | 48  |  0  |  1  |  0  | ... |
    |     |     |  ^  |     |     |

2. `<+` Go to the buffer byte (1) and increment it:

    |  0  |  1  |  2  |  3  | ... |
    | :-: | :-: | :-: | :-: | :-: |
    | 48  |  1  |  1  |  0  | ... |
    |     |  ^  |     |     |     |

3. `<-` Go to the source byte and decrement it:

    |  0  |  1  |  2  |  3  | ... |
    | :-: | :-: | :-: | :-: | :-: |
    | 47  |  1  |  1  |  0  | ... |
    |  ^  |     |     |     |     |

4. Repeat

Once the loop finishes, the memory will look like this:

|  0  |  1  |  2  |  3  | ... |
| :-: | :-: | :-: | :-: | :-: |
|  0  | 48  | 48  |  0  | ... |
|  ^  |     |     |     |     |

We already made a second copy, but it is not in the original position (1)! Luckily, we already know how to move a byte:

1. `>` Go to the buffer byte.
2. `[<+>-]` Move the buffer byte to the source byte.

This leaves the memory with a copy of byte 0 in byte 2:

|  0  |  1  |  2  |  3  | ... |
| :-: | :-: | :-: | :-: | :-: |
| 48  |  0  | 48  |  0  | ... |
|     |  ^  |     |     |     |

**Add Bytes**

One last algorithm for extra points. Let's imagine we want to add 2 bytes (0 and 1):

|  0  |  1  |  2  |  3  | ... |
| :-: | :-: | :-: | :-: | :-: |
| 10  | 20  |  0  |  0  | ... |
|  ^  |     |     |     |     |

So, we end up with a new byte (2):

|  0  |  1  |  2  |  3  | ... |
| :-: | :-: | :-: | :-: | :-: |
| 10  | 20  | 30  |  0  | ... |
|     |     |  ^  |     |     |

Instead of jumping straight into brainfuck, let's plan how to achieve this using the previous algorithms:

1. Copy byte 0 into byte 2.
2. Increment byte 2 by the same value of byte 1.

The first step is now trivial with the _Copy Byte_ algorithm.

For the second step, we can actually use _Copy Byte_ again! Since with _Copy Byte_ we are just increasing the target byte, if the variable is not 0, we will be adding them!

```brainfuck
[>>+>+<<<-]>>>[<<<+>>>-] Copy byte 0 to 2, using 3 as buffer
<<[>>+<+<-]>>[<<+>>-] Copy byte 1 to 2, using 3 as buffer
```

> This code may look very different from previous snippets, but if you focus on each component of the loop, you'll see that the only difference is the pointers moving to different bytes[^10].

At this point, the code is getting harder to follow. The takeaway is that we can compose relatively complex code from smaller, easier algorithms, and keep building from these foundations.

## The First Abstraction: Code Generation

Armed with some rudimentary brainfuck algorithms, I decided to start implementing a small library. This would help me generate brainfuck code in Go.

### Writer

To aid with code generation, I made a simple `Writer` struct[^writer.go]. Nothing fancy, as this is my first project in Go:

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

// Appends BF command into the strings builder
func (wrt *writer) Command(command BFCommand) {
	wrt.sb.WriteString(string(command))
}

// Adds an arbitrary string as a comment
func (wrt *writer) Comment(comment string) {
	wrt.sb.WriteString("  ")
	wrt.sb.WriteString(comment)
	wrt.sb.WriteString("\n")
}

// Prints the string to stdout
func (wrt *writer) Print() {
	fmt.Println(wrt.sb.String())
}
```

_This way, I don't need to remember how to use `strings.Builder`._

### CommandHandler

All the commands and utilities will be in the `CommandHandler` struct[^commands.go]:

```go title="commands.go"
type CommandHandler struct {
	writer *writer
}

func NewCommandHandler() *CommandHandler {
	cmd := CommandHandler{
		writer: NewWriter(),
	}

	return &cmd
}

// Move pointer n positions, left or right
// MovePointer(3)     ">>>"
// MovePointer(-3)    "<<<"
// MovePointer(-2+1)  "<"
func (c *CommandHandler) MovePointer(pos int) {
	if pos > 0 {
		for i := 0; i < pos; i++ {
			c.writer.Command(BFIncPointer)
		}
	}

	if pos < 0 {
		for i := 0; i > pos; i-- {
			c.writer.Command(BFDecPointer)
		}
	}
}

// Add (or subtract) a certain number to the current cell
// Add(3)    "+++"
func (c *CommandHandler) Add(count int) {
	if count > 0 {
		for i := 0; i < count; i++ {
			c.writer.Command(BFInc)
		}
	}

	if count < 0 {
		for i := 0; i > count; i-- {
			c.writer.Command(BFDec)
		}
	}
}

// Resets cell to 0 ([-])
func (c *CommandHandler) Reset() {
	c.writer.Command(BFLoopBegin)
	c.Add(-1) // Subtracts 1
	c.writer.Command(BFLoopEnd)
}

// Move the value of current byte to target byte
// (counting from current byte)
func (c *CommandHandler) MoveByte(to int) {
	c.writer.Command(BFLoopBegin)
	c.MovePointer(to) // Go to target byte
	c.Add(1)
	c.MovePointer(-to) // Returns to source
	c.Add(-1)
	c.writer.Command(BFLoopEnd)
}

// Copy current byte to target byte, using temp as buffer
func (c *CommandHandler) Copy(to int, temp int) {
	// Implementation is similar to MoveByte,
	// a direct translation from brainfuck
}
```

Just by having some basic commands and helpers, we can compose more complex algorithms like addition with very little actual brainfuck going into their implementations:

```go title="commands.go"
// Adds byte y to current byte, using temp,
// modifies current byte
func (c *CommandHandler) AddCell(y int, temp int) {
	c.MovePointer(y)
	c.Copy(-y, -y+temp) // Copy y into source, pass the relative position of temp to y
	c.MovePointer(-y)   // Return to source
}
```

Using this helper class, we can start building some (very) basic programs:

```go title="main.go"
cmd := bfwriter.NewCommandHandler()

// Adds 20 to byte 0
cmd.Add(20)
// Move to the right (byte 1)
cmd.MovePointer(1)
// Adds 28 to byte 1
cmd.Add(28)
// Adds byte on the left (byte 0) to current byte (1),
// uses byte to the right (3) as a temp variable
cmd.AddCell(-1, 1)
```

The generated brainfuck:

```brainfuck
++++++++++++++++++++>++++++++++++++++++++++++++++<>>[-]<<[>+>+<<-]>>[<<+>>-]<<>
```

The resulting memory state:

|  0  |  1  |  2  |  3  | ... |
| :-: | :-: | :-: | :-: | :-: |
| 20  | 48  |  0  |  0  | ... |
|     |  ^  |     |     |     |

This is starting to look like a useful tool to generate brainfuck code. This is still far from the promised language. At the moment, any code using these commands requires manually handling the pointer, which is prone to errors and one of the hardest parts of programming brainfuck.

## Conclusion

In this post, I've covered the basic foundations of brainfuck that we will need to create a usable high-level language targeting brainfuck. In the next devlog, I'll cover how to improve memory access, so we don't need to deal with relative pointers anymore in our language. Eventually, we will be able to ignore the pointer altogether!

[^1]: [Wikipedia - Brainfuck Language Design](https://en.wikipedia.org/wiki/Brainfuck#Language_design)
[^2]: [Nayuki Brainfuck Interpreter](https://www.nayuki.io/page/brainfuck-interpreter-javascript)
[^3]: [The Go Programming Language](https://go.dev/)
[^4]: Using `#` as a debugging breakpoint is not unique to this interpreter, [kvbc's Brainfuck IDE](https://kvbc.github.io/bf-ide/) provides a similar feature.
[^5]: An invaluable source of brainfuck algorithms is [esolangs.org - Brainfuck Algorithms](https://esolangs.org/wiki/Brainfuck_algorithms)
[^7]: [Wikipedia - Brainfuck](https://en.wikipedia.org/wiki/Brainfuck#Language_design)
[^8]: [esolangs.org - Brainfuck Conventions](https://esolangs.org/wiki/Brainfuck#Conventions)
[^9]: It won't, however, consider the memory limitations of some implementations.
[^10]: For those really serious about learning brainfuck. [esolangs.org](https://esolangs.org/wiki/Brainfuck_algorithms) uses a shortened notation to make it easier to read brainfuck algorithms in which the target bytes are written instead of the actual pointer movements. For example adding 2 bytes looks like: `[c+d+a-]d[a+d-]b[c+d+b-]d[b+d-]`
[^writer.go]: [`writer.go` in GitHub](https://github.com/angrykoala/mindfck/blob/79f49f73de2895a525e1872cc4a4f4a3f2a6e058/bfwriter/writer.go)
[^commands.go]: [`commands.go` in Github](https://github.com/angrykoala/mindfck/blob/79f49f73de2895a525e1872cc4a4f4a3f2a6e058/bfwriter/commands.go)
