---
slug: mindfck-devlog-2
date: 2025-04-10
tags: [Esolangs, Go]
draft: true
---

# Mindfck Devlog 2: Memory Handling, Variables and Flow Control in Brainfuck

> This is a follow-up to [Part 1](../2025-03-13-mindfck-devlog-1/mindfck-devlog-1.md).

In the previous post, I covered some basics of how brainfuck works and how certain algorithms can be useful for creating a language that transpiles to brainfuck: [mindfck](https://github.com/angrykoala/mindfck).

In this part, I'm focusing on abstracting brainfuck's pointer so we can access memory the way any sensible language would do. First, by supporting arbitrary memory positions,
and then move on to using actual variables.

I'll also implement basic abstractions for control flows like `if` and `while`.

<!-- truncate -->

Currently, my tool to generate brainfuck looks like this:

```go title="main.go"
cmd.Add(20) // Pointer at 0
cmd.MovePointer(1) // Pointer at 1
cmd.Add(28)
cmd.AddCell(-1, 1) // Add byte 0 to 1, using 2 as buffer. Pointer stays in byte 1
```

It is an improvement over brainfuck, but we cannot say it is particularly good for coding. The programmer needs to keep track of the pointer position, as well as know the state of the pointer after each command. What we need is a way to access any byte of the brainfuck memory.

## Random Memory Access

There are only 2 commands to move through memory in Brainfuck:

| Command |          Description           |
| :-----: | :----------------------------: |
|   `>`   | Increment pointer (move right) |
|   `<`   | Decrement pointer (move left)  |

If we want to move to byte 2, we need to do `>>`:

|  0  |  1  |  2  |  3  | ... |
| :-: | :-: | :-: | :-: | :-: |
|  0  |  0  |  0  |  0  | ... |
|     |     |  ^  |     |     |

But that only works if we are in byte 0 in the first place. If we are in byte 3, the command would be: `<`.

A simple solution to this problem is to keep track of the pointer at compile time. To do that, we add a new variable to `CommandHandler` to keep track of this _"phantom pointer"_:

```go title="commands.go"
type CommandHandler struct {
	writer *writer

    pointer int
}
```

Then, we can update this pointer every time a `>` or `<` appears in the code:

```go title="commands.go"
// Move pointer n positions, left or right
func (c *CommandHandler) MovePointer(pos int) {
	c.pointer += pos
    // ...
}
```

This way, every time `CommandHandler` generates `>` or `<`, it will update the pointer accordingly. In order to move to an arbitrary position, we can now use this fake pointer to calculate the steps. For example:

1. `>>`. This will update the pointer to 2.

    |  0  |  1  |  2  |  3  | ... |
    | :-: | :-: | :-: | :-: | :-: |
    |  0  |  0  |  0  |  0  | ... |
    |     |     |  ^  |     |     |

2. Move to byte 1: 1-2 = -1 (move minus one position `<`)

    |  0  |  1  |  2  |  3  | ... |
    | :-: | :-: | :-: | :-: | :-: |
    |  0  |  0  |  0  |  0  | ... |
    |     |  ^  |     |     |     |

### Updating commands

So far, all commands have been acting over the current position of the pointer:

```go
MoveByte(3) // Move selected byte, 3 spaces to the right
```

A much more friendly interface would be:

```go
MoveByte(2, 5) // Move byte in position 2 to position 5
```

To support this, we update all relevant commands to take absolute positions rather than relative ones:

```go title="commands.go"
func (c *CommandHandler) Reset(position int)
func (c *CommandHandler) MoveByte(from int, to int)
func (c *CommandHandler) Copy(from int, to int, buffer int)
```

Next, we update the internal pointer movement logic, `MovePointer`, to calculate and apply the difference between the current pointer position and the target:

```go title="commands.go"
func (c *CommandHandler) movePointer(to int) {
	var diff = to - c.pointer
	c.pointer += diff

	if diff > 0 {
		for i := 0; i < diff; i++ {
			c.writer.Command(BFIncPointer)
		}
	}

	if diff < 0 {
		for i := 0; i > diff; i-- {
			c.writer.Command(BFDecPointer)
		}
	}
}
```

> Note that we have renamed `MovePointer` to `movePointer`. This makes it a private (technically, package-level) method. Because the pointers are now handled directly by the commands, we no longer need to expose `MovePointer` as its own command, simplifying the interface overall.

With these changes, our original code starts looking much better:

```go title="main.go"
cmd.Add(0, 20) // Add 20 to byte 0
cmd.Add(1, 28) // Add 28 to byte 1
cmd.AddCell(0, 1, 2) // Add byte 0 to 1, using 2 as buffer.
```

Note that the user's code no longer has to worry about moving pointers at all! We can even use Go variables to make the code more general:

```go title="main.go"
a := 0
b := 1
buffer := 2

cmd.Add(a, 20)       // Add 20 to byte 0
cmd.Add(b, 28)       // Add 28 to byte 1
cmd.AddCell(a, b, buffer) // Add byte 0 to 1, using 2 as buffer.
```

### Reserved memory space

You may have noticed that while commands like `Reset`, `Add`, or `Move` have a nice, clear API, others like `AddCell`, `Copy`, and any command that uses extra memory as a buffer are a bit harder to use. This can be solved by reserving a few bytes for these "buffers":

```go title="commands.go"
const (
	TEMP0 = 0
	TEMP1 = 1
	TEMP2 = 2
	NIL   = 6 // Always 0
	MAIN  = 7 // Beginning of user memory
)
```

A command like `Copy` can now have a much clearer interface:

```go title="commands.go"
func (c *CommandHandler) Copy(from int, to int) {
	if from == TEMP0 || to == TEMP0 {
		panic("Invalid COPY, using copy register")
	}
	// Reset TEMP0 and destination
	c.Reset(TEMP0)
	c.Reset(to)

	// Move from → to and TEMP0
	c.movePointer(from)
	c.writer.Command(BFLoopBegin)
	c.Add(to, 1)
	c.Add(TEMP0, 1)
	c.Add(from, -1)
	c.writer.Command(BFLoopEnd)

	c.Move(TEMP0, from)
}
```

The only downside of this approach is that users need to be aware of the reserved memory layout, to avoid overwritting those memory spaces:

```go title="main.go"
a := cmd.MAIN + 0
b := cmd.MAIN + 1

cmd.Add(a, 20)      // Add 20 to byte "0"
cmd.Add(b, 28)      // Add 28 to byte "1"
cmd.AddCell(a, b)   // No need to pass buffer explicitly
```

## Fixing Loops and Adding `while`

Before we continue, we need to address the elephant in the room: the trick of tracking the pointer at compile time just doesn't work.

Take the following example:

```brainfuck
>>>+<+
```

Our _"phantom pointer"_ would calculate the final position to be 2: three steps right (`>>>`) minus one step left (`<`). And if we execute this snippet, we'll see that the calculation is correct!

But now, let's add some loops into the mix. For instance, let's revisit the first loop we demonstrated in [Part 1](../2025-03-13-mindfck-devlog-1/mindfck-devlog-1.md#brainfuck-primer):

```brainfuck
>>+<+<+[+>]
```

The first part, `>>+<+<+`, is no problem. Our phantom pointer will calculate 2 − 2 = 0, which is correct:

|  0  |  1  |  2  |  3  | ... |
| :-: | :-: | :-: | :-: | :-: |
|  1  |  1  |  1  |  0  | ... |
|  ^  |     |     |     |     |

The second part, however, is a loop: `[+>]`. Our compiler will see the `>` and assume the pointer moves to position 1. But in reality, since the loop runs multiple times and advances the pointer during each iteration, the final pointer position ends up much further to the right.

If we execute this code, here’s the actual result:

|  0  |  1  |  2  |  3  | ... |
| :-: | :-: | :-: | :-: | :-: |
|  2  |  2  |  2  |  0  | ... |
|     |     |     |  ^  |     |

The final position is 3!

> As a reminder: `[+>]` is incrementing all cells until it finds a 0

This is an unsolvable problem because the state of memory is also dependent on user input (thanks to the command `,`). Even if we tried to execute the code ahead of time to determine the real pointer position, the result might differ in future runs due to input variation.

For a while, I thought this was as far as I could take this project. But when reviewing the algorithms I had implemented, I noticed something interesting: all of them seemed to work just fine with the fake pointer—even the ones that used loops!

Let’s take a look at the copy byte algorithm:

```brainfuck
[>>+<+<-]>[<+>-]
```

According to the _phantom pointer_, the end position should be 1 (`>>>>` - `<<<`).

If we execute this:

1. The first loop: `>>+<+<-`, the pointer begins at 0, at the end of each loop iteration, the pointer is still at 0.
2. `>` move pointer to 1.
3. The Second loop: `<+>-`, the pointer begins at 1, remains at 1 by the end of the loop.

So the pointer ends at the expected position: 1.

All these algorithms have loops that begin and end in the same position. This make sense, as most algorithms are checking against the same byte to continue the loop or not. This means that the end position of the pointer is always the same as the initial position. Regardless of the number of iterations!

```brainfuck
[>>+<+<-]>[<+>-]
^       ^ ^    ^
0       0 1    1
```

So, as long as the loop starts and finishes in the same byte, we are in the clear. This principle even holds for nested loops:

```brainfuck
[>>+<+[>>>+<<<]<]>[<+>-]
^     ^   ^   ^ ^ ^    ^
0     1   4   1 0 1    1
```

I thought of many ways I could validate that this holds true when users write code, but then I remembered that this is my language, and I can make whatever I want to enforce it:

```go title="commands.go"
// Loops, ensuring that the loop begins and ends in the same cell
func (c *CommandHandler) While(condition int, code func()) {
	c.movePointer(condition)
	c.beginLoop()
	code()
	c.goTo(condition)
	c.endLoop()
}
```

This `while` loop implementation takes 2 parameters: a condition cell to check if the loop continues, and a callback with the commands of the loop.

1. Move to the condition position and begin the loop.
2. Execute the arbitrary commands from the user with the callback `code`.
3. Before finishing the loop, we make sure to go back to the original position.

While its simplicity may be counterintuitive. Because any code inside the loop is the code that will run from the condition byte, we can still use our _phantom pointer_ (and our commands) inside the loop. An example using this `while`:

```go title="while_example.go"
cmd := bfwriter.NewCommandHandler()

// Adds 65 ('A') to byte 0
cmd.Add(0, 65)

// Adds 10 to byte 1
cmd.Add(1, 10)

cmd.While(1, func() {
    cmd.Print(0)   // Print byte 0
    cmd.Add(0, 1)  // Add 1 to byte 0
    cmd.Add(1, -1) // Subtract 1 from byte 1
})
```

The output:

```
ABCDEFGHIJ
```

## Conditionals: `if`

Brainfuck doesn't have conditionals, but the same behaviour can be achieved with a loop that only executes once:

```go title="commands.go"
func (c *CommandHandler) If(cond int, code func()) {
	c.Copy(cond, TEMP1)
	c.While(TEMP1, func() {
		code()
		c.Reset(TEMP1)
	})
}
```

1. Copy the condition byte, we will be modifying this one and we don't want to change the original
    - Using `TEMP1` to avoid collision with `TEMP0` in `Copy`
2. Use `while` to do a loop with `TEMP1` as a condition.
3. Before ending the loop, reset `TEMP1`. This ensures the loop is only executed once.

## Variables

Using memory spaces directly is an improvement, but it is less than ideal, as memory has to be manually handled. The solution for that is to add variables.

### Environment[^1]

The core of using variables is to link unique identifiers to positions in memory. To do this, I have an `Env` struct which holds this mapping and a few simple methods to reserve and access memory variables[^2]:

```go title="env.go"
type MindfuckEnv struct {
	variables map[string]int // Labels to position mapping
}

func (env *MindfuckEnv) ReserveMemory(label string) string
func (env *MindfuckEnv) ReleaseMemory(label string)
func (env *MindfuckEnv) GetPosition(label string) int
```

To assign a new position in memory to a label, the simplest approach would be to just add 1 to the latest assigned position[^3], avoiding any memory collisions. The problem, however, is that as we create variables (particularly temp variables), memory consumption grows, since we are not reusing memory space.

To solve this, I added the `ReleaseMemory` method so positions could be reused, and updated the struct to use a slightly more complex setup for memory allocation:

```go title="env.go"
type MindfuckEnv struct {
	variables      map[string]int    // Labels to position mapping
	reservedMemory common.ItemSet    // Positions currently in use
	freedMemory    []int             // Positions that have been freed
}
```

This way, we keep track of variables, reserved memory[^4], and freed memory. When allocating a new label, we prioritize the already freed memory rather than a new position.

A few trivial changes to CommandHandler:

1. Expose `ReserveMemory` with a new method `Declare`

    ```go title="commands.go"
    func (c *CommandHandler) Declare(label string) string {
    	return c.env.ReserveMemory(label)
    }
    ```

2. Update all commands to use these variables and expose `ReserveMemory`:

    ```go title="commands.go"
    func (c *CommandHandler) Copy(from string, to string) {
    	temp0 := c.env.ReserveMemory("_temp0") // Declare temporal variable
    	temp1 := c.env.ReserveMemory("_temp1")
    	defer c.env.ReleaseMemory(temp0) // Release temporal variable
    	defer c.env.ReleaseMemory(temp1)

    	// Reset temp and to
    	c.Reset(temp0)
    	c.Reset(to)

    	c.Loop(from, func() {
    		c.Inc(to)
    		c.Inc(temp0)
    		c.Dec(from)
    	})

    	c.Move(temp0, from)
    }
    ```

    > For those unfamiliar with Go: `defer` makes the statement execute at the end of the function call. It’s a neat way to tie memory allocation and deallocation together and avoid leaks. The same effect could be achieved by calling `ReleaseMemory` at the end manually.

The pseudo-language now looks like this:

```go
cmd := codegen.New()

var1 := cmd.Declare("var1")
var2 := cmd.Declare("var2")
var3 := cmd.Declare("var3")

cmd.Set(var1, 65)
cmd.Set(var2, 3)

cmd.Add(var1, var2, var3)
cmd.Out(var3)
cmd.Print()
```

### Improving variables

I was happy with the current state—in fact, at this point I started working on the parsing of the actual language (spoilers of part 3!)—but there was still a small nagging problem with these variables.

In my internal code I was declaring variables with a reserved label: `temp0 := c.env.ReserveMemory("_temp0")`, which meant that, like with the reserved memory positions, a user wouldn't be able to create variables with the same names. Not only that, but my own commands needed to carefully avoid label collisions. Luckily, not too long ago I had to face a similar problem in a different project[^5], so I wasn't as blind as I usually was in this one.

My solution was to create an interface `Variable` to hold the position and label of a variable:

```go
type Variable interface {
	Position() int
	hasLabel() bool
	label() string
}
```

And two structs matching this interface:

-   `NamedVariable`: Holds a position and label.
-   `AnonVariable`: Holds a position, but no label.

Now `env.go` can simply work with variables and support declaring them without a label:

```go title="env.go"
type MindfuckEnv struct {
	labels         map[string]Variable
	reservedMemory utils.ItemSet
	freedMemory    []int
}

func (env *MindfuckEnv) DeclareVariable(label string) Variable
func (env *MindfuckEnv) DeclareAnonVariable() Variable
func (env *MindfuckEnv) ReleaseVariable(v Variable)
func (env *MindfuckEnv) ResolveLabel(label string) Variable
```

Again, a trivial refactor to use variables:

```go title="commands.go"
func (c *CommandHandler) Declare(label string) env.Variable {
	return c.env.DeclareVariable(label)
}

func (c *CommandHandler) Copy(from env.Variable, to env.Variable) {
	temp0 := c.env.DeclareAnonVariable()
	temp1 := c.env.DeclareAnonVariable()
	defer c.env.ReleaseVariable(temp0)
	defer c.env.ReleaseVariable(temp1)

	// Reset temp and to
	c.Reset(temp0)
	c.Reset(to)

	c.Loop(from, func() {
		c.Inc(to)
		c.Inc(temp0)
		c.Dec(from)
	})

	c.Move(temp0, from)
}
```

Note that only `NamedVariable`s are exposed through the `Declare` method. Anonymous variables are kept exclusively for internal use.

## Conclusion

We end up with the following API:

```go title="commands.go"
func Declare(label string) Variable              // Declares a new variable
func Reset(v Variable)                           // Resets v to 0
func Add(v Variable, i int)                      // Increments (or decrements) value i to v
func Set(v Variable, i int)                      // Sets v to given value, same as Reset + Add
func Print(v Variable)                           // Prints v
func Move(from Variable, to Variable)            // Moves from → to
func Copy(from Variable, to Variable)            // Copies from → to
func AddCell(from Variable, target Variable)     // Adds value of from to target
func While(cond Variable, code func())           // While loop
func If(cond Variable, code func())              // If conditional
```

[^1]: [Robert Nystrom - Crafting Interpreters](https://craftinginterpreters.com/).
[^2]: You can find the full `env.go` code at this point on [GitHub](https://github.com/angrykoala/mindfck/blob/58a7a5ca0eb549f000c5a3b12f719094d8f6d2d1/env/env.go).
[^3]: This seems to be the approach taken by [Headache](https://github.com/LucasMW/Headache), another language that transpiles to Brainfuck.
[^4]: `common.ItemSet` is just a thin wrapper over Go's `map[int]bool`, which is the canonical way of achieving `Set` operations in Go. After reviewing this code I noticed that this was all completely unnecessary, as a simple counter to the highest reserved memory position and the list of freedMemory is enough.
[^5]: [Cypher Builder](https://github.com/neo4j/cypher-builder), a tool for code generation that also has the concept of variables.
