---
slug: mindfck-devlog-2
date: 2025-04-10
tags: [Esolangs, Go]
draft: true
---

# Mindfck Devlog 2: Memory Handling, Variables, and Flow Control in Brainfuck

> This is a follow-up to [Part 1](../2025-03-13-mindfck-devlog-1/mindfck-devlog-1.md).

In the last post, I covered the basics of how brainfuck works and how certain algorithms can help build a language that compiles to it: [mindfck](https://github.com/angrykoala/mindfck).

This time, I’m tackling one of brainfuck’s biggest pain points: manual pointer management. First, I’ll introduce support for accessing arbitrary memory positions. Then, I’ll build on that to add real variables.

Finally, I’ll cover basic abstractions for control flow, like `if` and `while`.

<!-- truncate -->

Currently, my tool for generating brainfuck code looks like this:

```go title="main.go"
cmd.Add(20)         // Pointer at 0
cmd.MovePointer(1)  // Pointer at 1
cmd.Add(28)
cmd.AddCell(-1, 1)  // Add byte 0 to 1, using 2 as buffer. Pointer stays at byte 1
```

It’s a step up from raw brainfuck, but still far from ideal. The programmer has to manually track the pointer position and remember where it ends up after each command. What we really need is a way to access any memory cell directly—without thinking about the pointer at all.

## Random Memory Access

There are only two commands to move through memory in brainfuck:

| Command |          Description           |
| :-----: | :----------------------------: |
|   `>`   | Increment pointer (move right) |
|   `<`   | Decrement pointer (move left)  |

If we want to move to byte 2, we’d write `>>`:

|  0  |  1  |  2  |  3  | ... |
| :-: | :-: | :-: | :-: | :-: |
|  0  |  0  |  0  |  0  | ... |
|     |     |  ^  |     |     |

But that only works if we’re starting from byte 0. If we’re at byte 3, moving to byte 2 is just: `<`.

A simple solution is to track the pointer at compile time. To do this, we add a new field to `CommandHandler` to track a _phantom pointer_:

```go title="commands.go"
type CommandHandler struct {
	writer  *writer
	pointer int
}
```

Then, update the pointer whenever `>` or `<` appears in the code:

```go title="commands.go"
// Move pointer n positions, left or right
func (c *CommandHandler) MovePointer(pos int) {
	c.pointer += pos
	// ...
}
```

Now, we can compute the movement to any position based on the current "fake" pointer. For example:

1. `>>` sets the pointer to 2:

    |  0  |  1  |  2  |  3  | ... |
    | :-: | :-: | :-: | :-: | :-: |
    |  0  |  0  |  0  |  0  | ... |
    |     |     |  ^  |     |     |

2. To go to byte 1, just calculate `1 - 2 = -1` → move one step left (`<`):

    |  0  |  1  |  2  |  3  | ... |
    | :-: | :-: | :-: | :-: | :-: |
    |  0  |  0  |  0  |  0  | ... |
    |     |  ^  |     |     |     |

### Updating Commands

So far, all commands have acting over the pointer’s current position:

```go
MoveByte(3) // Move selected byte, 3 spaces to the right
```

A more intuitive interface would look like this:

```go
MoveByte(2, 5) // Move byte at position 2 to position 5
```

To support this, we update all relevant commands to use absolute positions instead of relative ones:

```go title="commands.go"
func (c *CommandHandler) Reset(position int)
func (c *CommandHandler) MoveByte(from int, to int)
func (c *CommandHandler) Copy(from int, to int, buffer int)
```

Then we update the internal pointer movement logic to compute the offset from the current position and apply the difference:

```go title="commands.go"
func (c *CommandHandler) movePointer(to int) {
	diff := to - c.pointer
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

> We've renamed `MovePointer` to `movePointer` to make it private. Since commands now handle pointer movement internally, exposing `MovePointer` is no longer necessary, which simplifies the interface.

With these changes, the code becomes much clearer:

```go title="main.go"
cmd.Add(0, 20)          // Add 20 to byte 0
cmd.Add(1, 28)          // Add 28 to byte 1
cmd.AddCell(0, 1, 2)    // Add byte 0 to 1, using 2 as buffer
```

Now, we don’t need to think about pointer movement at all! And we can even use Go variables for cleaner, more flexible code:

```go title="main.go"
a := 0
b := 1
buffer := 2

cmd.Add(a, 20)
cmd.Add(b, 28)
cmd.AddCell(a, b, buffer)
```

### Reserved Memory Space

You may have noticed that while commands like `Reset`, `Add`, or `Move` have a clean, simple API, others—like `AddCell`, `Copy`, or any command that requires extra memory—are trickier to use. The solution? Reserve a few bytes up front for internal use:

```go title="commands.go"
const (
	TEMP0 = 0
	TEMP1 = 1
	TEMP2 = 2
	NIL   = 6 // Always 0
	MAIN  = 7 // Beginning of user memory
)
```

With this setup, `Copy` can now offer a much cleaner interface:

```go title="commands.go"
func (c *CommandHandler) Copy(from int, to int) {
	if from == TEMP0 || to == TEMP0 {
		panic("Invalid COPY, trying to use copy register")
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

The only caveat is that users must avoid overwriting the reserved memory:

```go title="main.go"
a := cmd.MAIN + 0
b := cmd.MAIN + 1

cmd.Add(a, 20)     // Add 20 to byte "0"
cmd.Add(b, 28)     // Add 28 to byte "1"
cmd.AddCell(a, b)  // No need to pass buffer explicitly
```

## Fixing Loops and Adding `while`

Before we go further, we need to address the elephant in the room: tracking the pointer at compile time just doesn’t work.

Consider this example:

```brainfuck
>>>+<+
```

Our _phantom pointer_ would calculate the final position as 2: three steps right (`>>>`), then one step left (`<`). And in this case, it’s correct!

But now let’s throw loops into the mix. Here’s a loop from [Part 1](../2025-03-13-mindfck-devlog-1/mindfck-devlog-1.md#brainfuck-primer):

```brainfuck
>>+<+<+[+>]
```

The first part, `>>+<+<+`, is fine. Our phantom pointer calculates 2 − 2 = 0, which is correct:

|  0  |  1  |  2  |  3  | ... |
| :-: | :-: | :-: | :-: | :-: |
|  1  |  1  |  1  |  0  | ... |
|  ^  |     |     |     |     |

The second part, however, is a loop: `[+>]`. Our compiler sees the `>` and thinks the pointer ends up at position 1. But in reality, since the loop advances the pointer during each iteration, the final position is further to the right.

If we run this code, here’s what actually happens:

|  0  |  1  |  2  |  3  | ... |
| :-: | :-: | :-: | :-: | :-: |
|  2  |  2  |  2  |  0  | ... |
|     |     |     |  ^  |     |

The final pointer is at position 3!

> Reminder: `[+>]` increments each non-zero cell until it reaches a zero.

This is an unsolvable problem because memory state can depend on user input—thanks to the `,` command. Even if we tried to run the code ahead of time to determine the real pointer position, the result could still vary across runs.

For a while, I thought this was the end of the road for the project. But then I went back to review the algorithms I had already implemented and noticed something interesting: they all worked fine with the fake pointer, even the ones that used loops!

Let’s take a look at the copy byte algorithm:

```brainfuck
[>>+<+<-]>[<+>-]
```

According to the _phantom pointer_, the final position should be 1 (`>>>>` minus `<<<`).

Let’s walk through the execution:

1. First loop: `>>+<+<-`  
   The pointer starts at 0 and ends each iteration back at 0.
2. `>` moves the pointer to 1.
3. Second loop: `<+>-`  
   Starts at 1 and finishes at 1 after each iteration.

So, the final pointer position is 1, just as expected.

All these algorithms have loops that begin and end in the same position. This makes sense: loops typically rely on the same byte to determine whether to continue or exit. That means the pointer always returns to its starting position, no matter how many times the loop runs.

```brainfuck
[>>+<+<-]>[<+>-]
^       ^ ^    ^
0       0 1    1
```

This means that, as long as a loop starts and finishes on the same byte, we’re safe. This principle even holds with nested loops:

```brainfuck
[>>+<+[>>>+<<<]<]>[<+>-]
^     ^   ^   ^ ^ ^    ^
0     1   4   1 0 1    1
```

I considered different ways to validate this behavior when users write their own code. But then I remembered that this is _my_ language, and I can enforce whatever rules I want:

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

This `while` implementation takes two parameters: a condition cell to check whether the loop should continue, and a callback containing the loop body.

1. It moves to the condition cell and starts the loop.
2. It runs the user-defined commands inside the `code` callback.
3. Before ending the loop, it moves back to the condition cell.

Its simplicity might be surprising. But since the loop body runs starting from the condition byte, we can still rely on the _phantom pointer_ and use all existing commands safely inside the loop.

Here’s an example using this `while`:

```go title="while_example.go"
cmd := bfwriter.NewCommandHandler()

// Adds 65 ('A') to byte 0
cmd.Add(0, 65)

// Adds 10 to byte 1
cmd.Add(1, 10)

cmd.While(1, func() { // While byte 1 is > 0
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

Brainfuck doesn’t support conditionals directly, but we can simulate an `if` by using a loop that runs only once:

```go title="commands.go"
func (c *CommandHandler) If(cond int, code func()) {
	c.Copy(cond, TEMP1)
	c.While(TEMP1, func() {
		code()
		c.Reset(TEMP1)
	})
}
```

Here’s how it works:

1. We copy the condition byte. Since we’ll modify it, we don’t want to affect the original.
    - We use `TEMP1` to avoid interfering with `TEMP0` used in `Copy`.
2. We use `While` with `TEMP1` as the condition.
3. Inside the loop, we run the code and then reset `TEMP1`, ensuring the loop runs only once.

## Variables

Using raw memory positions is a big step up from brainfuck, but it’s still far from ideal as memory must be managed manually. The solution? Add support for variables.

### Environment[^1]

The core idea behind variables is to map unique identifiers to memory positions. For that, I use an `Env` struct to manage this mapping, along with a few helper methods to reserve and access memory[^2]:

```go title="env.go"
type MindfuckEnv struct {
	variables map[string]int // Labels to position mapping
}

func (env *MindfuckEnv) ReserveMemory(label string) string
func (env *MindfuckEnv) ReleaseMemory(label string)
func (env *MindfuckEnv) GetPosition(label string) int
```

A simple way to assign new positions is to increment from the last used slot[^3], which avoids memory collisions. But this naive approach has a downside: memory consumption quickly grows, especially with short-lived temporary variables, since memory isn't reused.

To fix this, I introduced `ReleaseMemory`, and updated the struct to support a smarter allocation strategy:

```go title="env.go"
type MindfuckEnv struct {
	variables      map[string]int    // Labels to position mapping
	reservedMemory common.ItemSet    // Positions currently in use
	freedMemory    []int             // Positions that have been freed
}
```

Now, we keep track of used and freed memory slots[^4]. When allocating new variables, we reuse freed slots first before reserving fresh positions.

A few simple updates to `CommandHandler` make working with variables much smoother:

1. **Expose `ReserveMemory`** using a new `Declare` method:

    ```go title="commands.go"
    func (c *CommandHandler) Declare(label string) string {
    	return c.env.ReserveMemory(label)
    }
    ```

2. **Update all commands** to use variable names instead of raw positions, and manage temp memory internally:

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

    > For those unfamiliar with Go: `defer` delays execution until the surrounding function returns. It's a clean way to handle cleanup like releasing memory, without needing to explicitly call `ReleaseMemory` at the end.

Thanks to these changes, our pseudo-language now reads much more clearly:

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

### Improving Variables

I was happy with how variables were working—so much so that I started working on the language parser (spoilers for Part 3!). But there was still one small issue bothering me.

Internally, I was declaring variables using reserved labels like:

```go
temp0 := c.env.ReserveMemory("_temp0")
```

This meant users couldn’t declare variables with names like `_temp0`, and worse, my own commands had to be careful to avoid naming collisions, just like with the reserved memory positions.

Luckily, I had run into a similar problem before in an unrelated project[^5], so this time I wasn’t going in completely blind.

My solution was to define a `Variable` interface to represent both named and anonymous variables. This way, every variable tracks its position, and optionally, a label:

```go
type Variable interface {
	Position() int
	hasLabel() bool
	label() string
}
```

Then I created two implementations of this interface:

-   **`NamedVariable`**: Holds both a memory position and a label.
-   **`AnonVariable`**: Holds only the position, with no label.

Now `env.go` can simply work with variables and support declaring them with or without a label:

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

Next came a trivial refactor to use anonymous variables internally:

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

Note that only named variables are exposed via `Declare`. Anonymous variables are reserved for internal use, preventing naming collisions and keeping user's code clean.

## Conclusion

After this deep dive into memory handling, we now have the following API:

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

That’s a solid set of easy-to-use tools for a Go-based abstraction over brainfuck.

In the next part, I’ll cover how I built a simple AST and parser using antlr4[^6] to tie everything together into a real programming language.

[^1]: [Robert Nystrom - Crafting Interpreters](https://craftinginterpreters.com/).
[^2]: You can find the full `env.go` code at this point on [GitHub](https://github.com/angrykoala/mindfck/blob/58a7a5ca0eb549f000c5a3b12f719094d8f6d2d1/env/env.go).
[^3]: This seems to be the approach taken by [Headache](https://github.com/LucasMW/Headache), another language that transpiles to Brainfuck.
[^4]: `common.ItemSet` is just a thin wrapper over Go's `map[int]bool`, which is the canonical way of achieving `Set` operations in Go. After reviewing this code I noticed that this was all completely unnecessary, as a simple counter to the highest reserved memory position and the list of freedMemory would be enough.
[^5]: [Cypher Builder](https://github.com/neo4j/cypher-builder), a tool for code generation that also has the concept of variables.
[^6]: [Antlr Official Website](https://www.antlr.org/)
