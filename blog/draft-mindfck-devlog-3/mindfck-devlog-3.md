---
slug: mindfck-devlog-3
date: 2025-04-10
tags: [Esolangs, Go]
draft: true
---

# Mindfck Devlog 3: Making a High Level Programming Language to Brainfuck

## Let's Make a Language

### Parser

### AST

## Level Up: 16-bit Integers

## Some Optimizations

## Arrays

### Dynamic access to array

**Dirty Bytes**

https://github.com/angrykoala/mindfck/commit/6b5787576c187a6d30aa6d47f7e3d096eb9df476

(Later removed)

**Output code optimization**

https://github.com/angrykoala/mindfck/commit/bb0c3fe18c5c1e7f9647e7f0a1e671782dc8790e

**DecInt and IncInt optimisation**

Before:

```
func (c *CommandHandler) IncInt(v env.Variable) {
	assertInt(v)
	zero := c.env.DeclareAnonByte()
	temp := c.env.DeclareAnonByte()
	defer c.Release(zero)
	defer c.Release(temp)
	c.Reset(zero)

	secondByte := v.GetByte(1)
	c.IncByte(secondByte)
	c.EqualsByte(secondByte, zero, temp)
	c.If(temp, func() {
		firstByte := v.GetByte(0)
		c.IncByte(firstByte)
	})
}
```

```
// All optimised, no dirty
Code Size: 10592 characters
Memory: [0 22 0 22 69 47 111 241 69 47 0 22 0 22 0 0 1 0 0 0 0 0 0 0 9 0 0 0 0 214 0 0]
Memory Size: 32 bytes
Executed Instructions: 702239055
```

After

```
func (c *CommandHandler) IncInt(v env.Variable) {
	assertInt(v)
	temp := c.env.DeclareAnonByte()
	defer c.Release(temp)

	secondByte := v.GetByte(1)
	c.IncByte(secondByte)
	c.NotByte(secondByte, temp)
	c.If(temp, func() {
		firstByte := v.GetByte(0)
		c.IncByte(firstByte)
	})
}
```

```
// Optimise incInt decInt by changing equals zero with not
Code Size: 10345 characters
Memory: [0 22 0 22 69 47 111 241 69 47 0 22 0 22 0 0 1 0 0 0 0 0 0 0 9 0 0 0 0 214 0 0]
Memory Size: 32 bytes
Executed Instructions: 622235940
```

[^1]: [Wikipedia - Brainfuck Language Design](https://en.wikipedia.org/wiki/Brainfuck#Language_design)
[^2]: [Nayuki Brainfuck Interpreter](https://www.nayuki.io/page/brainfuck-interpreter-javascript)
[^3]: [The Go Programming Language](https://go.dev/)
[^4]: Using `#` as a debugging breakpoint is not unique to this interpreter, [kvbc's Brainfuck IDE](https://kvbc.github.io/bf-ide/) provides a similar feature.
[^5]: [esolangs.org Brainfuck algorithms](https://esolangs.org/wiki/Brainfuck_algorithms)
