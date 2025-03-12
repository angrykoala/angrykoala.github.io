---
slug: wendigo-browser-automation-tool
date: 2019-03-22
tags: [TypeScript]
---

# I needed browser automation for testing, so I obviously wrote my own tool

> Originally posted on [Dev.to](https://dev.to/angrykoala/i-needed-browser-automation-for-testing-so-i-obviously-wrote-my-own-tool-1939)

Around a year ago, I decided to start using a browser automation tool to write some tests for my project front-end. While some degree of testing could be achieved by writing unit tests, mocks and [jsdom](https://github.com/jsdom/jsdom), in the end, these tests couldn't reflect real interactions and properly detect errors.

<!-- truncate-->

Because these tests were going to be written by me and other developers (no QA team available!). I needed the tests to be as simple to write and maintain as possible to avoid wasting too much dev time and (more importantly) to avoid devs (and myself) stop writing tests due to laziness.

With this in mind I started searching for the correct browser automation tool for my case, with my priority being simplicity to write tests. During this process I tried several tools, in some cases using them for weeks:

-   [Selenium](https://www.seleniumhq.org)
-   [Zombie.js](http://zombie.js.org) - deprecated
-   [Phantomjs](http://phantomjs.org) - deprecated
-   [Nightmare.js](http://www.nightmarejs.org) - not actively maintained
-   [Puppeteer](https://github.com/GoogleChrome/puppeteer)

All of these tools (and other I've been trying since) where, for me, either too difficult to setup, had little support for writing tests or relied in external (and usually paid) services.

So, as any sane developer would do, I decided to build my own tools. Of course, I wasn't going to build a headless browser from scratch, after testing a few of the above mentioned, I decided to go with Puppeteer as a base for my own tool. It was reliable, powerful, easy to setup and well-maintained. And so, I started building [wendigo](https://github.com/angrykoala/wendigo), a full wrapper on top of Puppeteer to make testing easier and add features as I needed.

![Wendigo Logo](./wendigo_logo.png)

After a few weeks of development in my free time, the efforts started to pay off. Integration and E2E tests started to look cleaner on several projects at my company. Adding built-in assertion methods greatly simplified tests. Going from a test written in Puppeteer like this:

```js
// Test a modal text with Puppeteer
await page.click(".my-btn");
await page.waitForSelector("#my-modal");
const modalText = await page.evaluate(() => {
    const modalElement = document.querySelector("#my-modal");
    return modalElement.textContent;
});
assert.strictEqual(modalText, "Button Clicked");
```

To this:

```js
// Test a modal text with Wendigo
await browser.click(".my-btn");
await browser.waitFor("#my-modal");
await browser.assert.text("#my-modal", "Button Clicked");
```

The more complex the test, the bigger was the difference.

After more than a year on development. Wendigo already provides not only simple built-in assertions, but a big set of features:

-   Easy setup (`npm install --save-dev wendigo`)
-   Complex queries such as `elementFromPoint(x,y)`, `findByTextContaining(text)`.
-   One-line assertions for most common scenarios.
-   LocalStorage and Cookies interfaces and assertions.
-   Requests mocks. Allowing to emulate server errors, 3rd party requests, etc.
-   Plugin system to add extra modules or your own methods as needed.
-   Agnostic, it works on any Node.js based framework, testing toolchain or in Docker and CI.
-   Full access to underlying Puppeteer methods.

These have proven to be effective features for fast and reliable testing. Of course, there are some shortcoming on using Wendigo instead of other alternatives:

-   Only Chrome supported.
-   The abstraction layers provided by Wendigo may result on unexpected behaviors on some cases.
-   Node.js required for running and writing tests.

An example of how a test with Wendigo using [mocha](https://mochajs.org) would look like:

```js
const assert = require("assert");
const Wendigo = require("wendigo");

describe("My Tests", function () {
    this.timeout(5000); // Recommended for CI or slower machines
    let browser;

    beforeEach(async () => {
        browser = await Wendigo.createBrowser();
    });

    afterEach(async () => {
        await browser.close();
    });

    after(async () => {
        // After all tests finished, makes sure all browsers are closed
        await Wendigo.stop();
    });

    it("Page Title", async () => {
        await browser.open("http://localhost");
        await browser.assert.text("h1#main-title", "My Webpage");
        await browser.assert.title("My Webpage");
    });

    it("Open Menu", async () => {
        await browser.open("http://localhost");
        await browser.assert.not.visible(".menu");
        await browser.click(".btn.open-menu");
        await browser.assert.visible(".menu");
    });

    it("Initial Request To API Fails Gracefully", async () => {
        browser.requests.mock("http://localhost/api", {
            status: 500,
        });
        await browser.open("http://localhost", {
            clearRequestMocks: false, // Keeps the mock created before
        });

        // Show red text with error message
        await browser.assert.text(".error-message", "Error loading the API");
        await browser.assert.style(".error-message", "color", "red");
    });
});
```

This tool is completely open-source on GitHub, tested and documented and still on active development. Currently I'm trying to get feedback on improvements, bugs or features to help other developers with their front-end and E2E testing.

Star on [GitHub](https://github.com/angrykoala/wendigo)
