---
sidebar_position: 4
title: Wendigo
---

# ![Logo](./wendigo.png) Wendigo

[Wendigo](https://github.com/angrykoala/wendigo) (/wɛndɪɡo/) simplify your front-end and end-to-end automated testing using Puppeteer.

Consider the following example using just Puppeteer:

```js
await page.click(".my-btn");
await page.waitForSelector("#my-modal");
const modalText = await page.evaluate(() => {
    const modalElement = document.querySelector("#my-modal");
    return modalElement.textContent;
});
assert.strictEqual(modalText, "Button Clicked");
```

The same test can be written like this with Wendigo:

```js
await browser.click(".my-btn");
await browser.waitFor("#my-modal");
await browser.assert.text("#my-modal", "Button Clicked");
```
