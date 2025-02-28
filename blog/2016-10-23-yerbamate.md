---
title: Yerbamate
date: 2016-10-23
---

> The js testing library for command-line interfaces.

Sometimes, you want to add automated tests for your node-based CLI. With [Yerbamate](https://github.com/angrykoala/yerbamate) now you can simply test your programs directly within your favorite testing framework like [_mocha_](https://mochajs.org/) without the mess of creating complex _gulp_ pipelines or adding extra bash scripts. Just with old good Javascript.

<!-- truncate -->

## Usage

_Yerbamate_ allows you to easily test commands from your favorite Javascript testing framework.

```js
yerbamate.run("cat my_file.md", null, {}, function (code, out, errs) {
    if (yerbamate.isErrorCode(code)) console.log("Error: " + errs[0]);
    else console.log("Success - " + out);
});
```

_Yerbamate_ also provides easy access to you package.json defined scripts and commands, so you can test your module easily.

```js
var yerbamate = require("yerbamate");

var pkg = yerbamate.loadPackage(module);

//Test the package.json start script
yerbamate.run(pkg.start, pkg.dir, {}, function (code, out, errs) {
    if (yerbamate.isErrorCode(code)) console.log("Process exited with error code");
    if (errs.length > 0) console.log("Errors in process:" + errs.length);
    console.log("Output: " + out[0]);
});
```

### API

-   `loadPackage(module)` Will load your package.json module data. The returned object will contain the path to the `package.json` file, `main` and `start` script as well as `bin` and `scripts` objects from package.json

-   `run(command, dir, options, done)` Will run the given command as a child_process in the given path. The options allows you to set callbacks for `stdout` and `stderr` outputs, as well as extra space-separated arguments with `args`. The callback will return the execution code of the process, an array with all the console outputs and an array with all the error outputs.

-   `isErrorCode(code)` Will return true if the given process code is an error code, false otherwise
