---
title: Things You Should Know
tags:
---

In the software development world, it is impossible to know every technology and tool. While most of programmers will use a specific set of tools to fill their needs, here you may find a brief introduction to some tools I find useful for development (among other tasks) and may help you regardless of your field.

<!-- more -->

All the stuff here is divided in different categories:
* **Languages:** Full programing, markup, or scripting languages
* **Tools:** Programs, apps and services that may be used to help you while coding
* **Libraries & Technologies:** Libraries, frameworks and scripts to use with one or more programming languages

</br>
----

**Table of Contents**
<!-- toc -->


# Languages
Learning a new programming language usually takes a long time, and depending on your needs it may or may not be useful certain language. Here you have a few simple languages (not exclusively programming) versatile enough to be used with almost any stack you may already use and simple enough to learn its basics within a few hours

</br>
## Markdown
![Markdown Logo](markdown.svg)

Markdown, defined as a _Markup language for people who hate markup languages_ tries to simplify the task of writing markup texts (for example Latex or HTML). The idea behind markdown is to use human intuitive marks, making the text readable in raw format.

Markdown is famous for being the standard markup used in GitHub[^1], being a simple language, and easily formated as HTML, Latex and PDF makes it very versatile. Currently many webpages support Markdown and even some are purely written with markdown instead of HTML (for example, this same blog)

The syntax comes in different _"flavors"_ depending on what render are you using. Usually being the original syntax [^2] and _GitHub flavored_[^1]. Apart of markdown syntax, most renders and compilers provide ways to use HTML or LATEX within the markdown code.

This makes markdown a perfect way to write plain text notes, comments or full books, making them equally readable on almost any format, from pdf to webpages or plain terminal text.

### Basic Syntax
A syntax tutorial can be found [here](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet).

* _Italic_
    * Using underscore (`_`) or asterisk (`*`) wrapping the italic text (`_Italic text_`)
* **Bold**
    * Double underscores(`__`) or asterisks(`**`) provides a bold text (`**Bold text**`)
    * Some renderers provide an ***Italic and Bold*** using triple underscores or asterisks
* Link
    * Links can be added with `[Link text](URL)`, will translate to a [Link](.)
    * Any URL will usually be rendered as a link automatically, or can be wrapped `<http://mylink>`
* Headers
    * Headers are set using `#` at the beginning, corresponding to the header level (`#Header1`, `##Header2`,`###Header3`)
* Code Blocks
    * Inline code is wrapped like this (\`my code\`) resulting in `my code`
    * A full code block can be rendered as such by either tabulating the full block or wrapping with (\`\`\`)
* Lists
    * List can be unordered using (`*`) and a space at the beginning of the line or ordered using numbers (`1.`) and a space
    * Markdown support multilevel lists by tabbing
* Images
    * Similar to a link, with `!` at the beginning (`![alt text](link to img)`)
* Line breaks
    * Line breaks can be forced by adding 3 spaces at the end `   `
    * Double enter will create a new paragraph
    
>Most markdown renders also support tables, block quotes and footnotes, and usually handle automatically unicode characters


A common markdown example will look like this:
```Markdown
# The Raven
_By Edgar Allan Poe_

**ONCE** upon a midnight dreary, while I pondered, weak and weary,   
Over many a quaint and curious volume of forgotten lore,	 
```

As you can see, the raw markdown text is easily readable, without a huge amount of confusing marks 

### Rendering Markdown
A lot of editors and programs can render markdown. [Atom](https://atom.io) provides a visual markdown renderer, [markdonw-pdf](https://www.npmjs.com/package/markdown-pdf) can easily generate a PDF from your markdown though HTML. [Pandoc](http://pandoc.org) will allow to generate Latex files or Latex-style pdfs, some online editors like [StackEdit](https://stackedit.io) or [Dillinger](http://dillinger.io) provides also an easy to use markdown visual renders.

</br>
## XML
![XML Logo](xml.svg)
The **Extensible Markup Language (XML)** is a markup language widely used to define structured data. Using XML different formats may be defined (e.g. SVG, X3D) so it is possible to process the data while still is readable by humans.

One example of XML would be:
```XML
<email language="en">
  <to>Arthur</to>
  <from>Ford</from>
  <subject>Reminder</subject>
  <body>Don't Panic!</body>
</email>
```
_Example of an email formated as XML_

As you can see in this example, all the data of an email in the XML is structured in a way that could be easily interpreted by a program while still being plain text.

### Syntax
For a more detailed tutorial on XML, refer to the [W3School Tutorial](http://www.w3schools.com/xml/xml_whatis.asp)

In a nutshell, XML is composed of **elements** and **attributes** (among other things)

* Elements are defined by _tags_, each tag is enclosed within the characters `< >`,  the elements may contain text or other elements in a tree-like structure. Each element must begin and close, either using a start tag and a end tag (`<mytag>element content</mytag>`) or with only one tag if the element is empty (`<mytag/>`).  
In the example, email is an element, which content is the rest of the elements. Each one of the elements contains text and represents a part of the email.

* Attributes represent meta-information of an element, are defined within the element tag as a pair key-value. In the example, the attribute language specifies the language of the email. Note that attributes must not add data, but only meta-data about the information.

XML is perfect for defining a tree-based hierarchy on your data, storing an application data in plain text, sending messages across processes or defining new languages or data structures. All you need is an _XML parser_ for the language you are using.

</br>
## JSON
![JSON Logo](json.svg)
While XML is a standard for sending information across applications, its overusing of tags and the relatively complexity on its parsers make it too complex when sending simple messages.

JSON (**JavaScript Object Notation**) provides a simpler mechanism of structuring data in plain text based on JavaScript[^3]. The advantages over XML is its reduced size (around 30% less), something important when sending messages across a network, the simpler and faster parsers with JavaScript (being JS objects, JSON is native to JavaScript) and the addition of arrays as structure.

```JSON
{
    "to":"Arthur",
    "from":"Ford",
    "subject":"Reminder",
    "body":"Don't Panic!",
    "meta":{
        "language":"en"
    }
}
```
_Example of an email formated as JSON_

However, JSON has some limitations over XML, first, it doesn't allow repeating elements on the same level and doesn't provide any way to add meta-data (in the example we are using another object as children named _"meta"_).

### Syntax
JSON is based on JS, providing the same data types:

* Object: An object is a set of pairs key-value, being each key an unique string and every value any data type (objects and arrays included)
    ```JSON
    {
        "age":26,
        "name":"arthur"
    }
    ```
* Array: An array is defined as an ordered list of objects, values or arrays 
    * `[5,"hello",{...}]`

* Values: The values can be strings (`"my string"`), numbers (`5`,`5.5`,`-2`) or the keywords _null_,_true_ or _false_

JSON can easily be parsed in several languages (e.g. JavaScript, Python) and parsers exist for almost any other language as well. Data is easier to read and modify, with a syntax less strict than XML. JSON is suitable for sending messages and storing data and configuration files.

<!-- Add bash, html, js and python?? -->

# Tools

* Atom
* Nano
* Astyle/beautifier
* Git
* SSH/FSTP
* netcat?
* Lint?
* NPM???


---
Online tools:
* Travis
* Code climate? bithound
* Coveralls?

# Libraries & Technologies

* EJS?




# Bibliography

[^1]: GitHub's Mastering Markdown: https://guides.github.com/features/mastering-markdown
[^2]: Daring Fireball Markdown Syntax: http://daringfireball.net/projects/markdown/syntax
[^3]: Introducing JSON: http://www.json.org
