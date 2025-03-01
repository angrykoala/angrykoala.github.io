# Yerbamate

Sometimes, you want test your CLI. With Yerbamate, you can test your CLI directly within your favorite testing framework like mocha without the mess of creating scripts or child_process:

```js
const yerbamate = require("yerbamate");

yerbamate.run("cat my_file.md", (code, out, errs) => {
    if (!yerbamate.isSuccessCode(code)) console.log("Error: " + errs);
    else console.log("Success - " + out);
});
```

-   [GitHub](https://github.com/angrykoala/yerbamate)
