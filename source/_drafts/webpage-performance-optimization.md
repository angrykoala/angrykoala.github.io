---
title: Webpage Performance Optimization
tags:
---

On this tutorial, I'll cover some basic techniques to optimize web apps and pages. These tools aim to improve the overall performance on a webpage, reducing latency and page load times.

With an optimized webpage, the same server will be able to handle more request, and the general webpage will feel faster for our users.

<!-- more -->

# Why is important to improve performance?
While today applications and programs usually need a huge amount of resources comparing to older ones and most of our current computers are able to handle it, the web based applications are limited by several constraints.

First, a web app will not be able to use efficiently the resources of a machine as it needs a browser or program between the OS and the page. The network limits are also a problem when dealing with complex webpages, as in some slow networks a simple page could take several seconds simply to load.

Finally, the extensive use of mobile phones, with a much tighter limitations on computing power, memory and network speed makes necessary to perform theses task of optimization, resulting on a much better user experience and reduced costs on servers.

# How to improve performance

There are several ways to optimize your web based application, and depending on your needs some may be more effective than others. I'm dividing the techniques on 4 main groups:

* **Server:** Make the server more efficient, so it will be able to handler more request and consume less resources.
* **Client:** Optimize the client code so it can render faster and consume less resources.
* **Resources:** Compress and reduce the page resources (images, stylesheets, scripts, ...) to reduce the bandwidth required and the download times on slow networks.
* **Connections:** Reduce the necessary connections between client and server, making only the minimum requests possible and avoiding downloading the same resources again.

Most of these techniques will allow you to greatly improve your webpage performance with little effort[^5].

## Server
Optimizing your server will reduce the wait time on each request as well as reduce greatly the resources needed to run your server, allowing more concurrent users. Depending on how is your server deployed, it may be easier or harder to improve it's performance.

### HTTP Server
Usually any web application will work over an _http server_ like [Apache](https://httpd.apache.org) or [nginx](https://nginx.org). If your application doesn't have a proper http server (for example, serving directly from node.js or python web servers). It could greatly improve the performance setting up a server like nginx on top of your application.

These http servers act as a static content server and proxy. They doesn't run any application code, but provide a fast and secure interface between the requests and your application, making it more reliable and notably faster when loading resources.

>Keep in mind that frameworks such as express in node.js, or django in python can run standalone, but are designed to work under a http server

While nginx is notably faster than Apache, any one could work perfectly if properly configured, this mean getting rid of unnecessary modules and plugins that you may be using and configuring the memory usage[^1][^2].

If you are using a PAAS such as Openshift or Heroku, the HTTP server will already be set.


* Setup a proper HTTP server on top of your application
* Get rid of unnecessary plugins
* Configure it

### Server scripting
The server-side can be programmed with several tools and languages, like PHP, Node.js or Python among others.

It is important to choose the proper language and tool set according to your needs. While PHP is easy to code, it could be pretty inefficient, as a new instance of the PHP interpreter is executed with each request. Python with the Django framework is suitable for apps with a basic website structure while Node.js works well with API REST based apps.

In any case, your server script will impact on how many resources are needed when processing each request, affecting the number of request your server will be able to handle. If your web application needs a lot of processing, consider using a faster language and C++ modules. Try to program using the less memory possible (usually the RAM will be the main bottleneck on your server) and make sure your program makes use of all the cores on your server, either by clustering or using multiple threads.

Finally, make sure you don't make a huge amount of processing between a request and its response to reduce your web latency.


* Use a server scripting language according to your needs.
* Try to use efficient modules.
* Avoid huge processing between request and response.
* Keep an eye on RAM.


### Templating
Any modern webpage will work with templates instead of plain HTML. While PHP can work as a templating language, it is recommended to use a proper templating engine such as Jade, EJS or Jinja2. These languages allow real-time fast templating on each request. It is important to look for a language according to your needs, while some of them provide a huge amount of features, they usually needs more processing time to generate the final HTML[^3].

Instead of _just in time_ templating rendering, if your final HTML doesn't depend on the request (is static), you can simply "Build" the HTML as a static resource and provide it directly. This will reduce the server-side rendering time. Also, most templating frameworks allow to store the rendered pages in a cache, allowing to serve rendered pages.

* Try to use the simplest templating language you can.
* If possible, pre-render static pages.
* Configure a cache.

### Database
Most modern web application and pages will require a database to store users and information allowing to store, read and modify this information from the server scripts. Apart from network, the database is the slowest part on the web application stack, any task will require an access to a database in disk.

The first thing, is to decide which kind of database you need to your project:
* Relational database: The SQL-style databases allow you to perform complex queries, and provides a huge amount of features. However, are usually slower for simple task and reading/writing, not being able to scale properly in some cases.
* Non-Realationa databases: Theses databases (e.g. MongoDB) Provides great speed when reading or writing, and usually scale properly to a huge number of concurrent users, but are usully limited on features, and limited when complex queries or tasks are needed.
* In-memory databases: In memory databases provides the fastest possible database, stored in RAM memory is almost as fast as if no database was present, however, it will (of course) consume a huge amount of memory in your server, and it may not be reliable when the server crashes or restarts, maybe losing data. However, databases like Redis are perfect as cache over another non-relational database.
* Directory-based databases: A great way to store data is directly storing files in a directory tree. This is usually perfect for storing binary files (for example a user images), but will not be able to provide a fast read/write or search mechanisms.

There are more types of databases and you could use one or more in order to achieve a fast and reliable data handling. Anyway, some request usually won't need database at all, and maybe others could easily be cached, avoiding a database lookup or setting up an asynchronous behavior could greatly reduce latency and memory usage.

* Use a database adequate to your problem, use more than one database if necessary.
* Avoid using database if not needed or store in memory (cache) data if possible.
* Try to make the simplest queries possible. Avoid data locks.

>When developing the server, keep in mind that most time spent is due to database lookup. Templates rendering and heavy tasks also affects latency. 

### Redundancy
Deploying multiple server scripting instances (in one or multiple machines) will allow you to take advantage on multi core cpus. This will lightly improve bots, latency and maximum request, but it will also provide a more reliable server, with more uptime.

>Some server technologies may handle this automatically, but it is important to make sure your scripts are correctly configured

## Client
Event when the server is correctly implemented, a bad client-side code will surely make the overall webpage run slowly, and probably take a huge amount of resources from your users' computer. In the end, a webpage will be a program running in the user machine, and it should be coded carefully or it could affect the user experience, particularly on mobile phones and old computers.

To improve our client, we will carefully check the 3 main technologies in which a webpage is programmed (HTML,CSS and JS).


### HTML
While HTML is a pretty straightforward mark language, it is important to know how the browser renders it and how the DOM work.

The HTML is stored and rendered as a tree, every tag (`<mytag></mytag>`) represents a node in the tree. This means that unnecessary tags will make this DOM bigger, not only it will be slower to render, but JavaScript and CSS will also need more time to execute.

Basically using HTML only as content and structure (avoiding adding styles) is usually a good enough way to work properly with it.

* Maintain the HTML as small as possible and well organized
* Don't use styles and scripts directly in the HTML

### JavaScript
The main logic of the client is in our JavaScript codes, most of the rendering time is taken on executing the scripts of the webpage. Basically the scripts must be as simple as possible and well structured.

Plugins and external libraries usually increases download and rendering time, avoid loading them if possible. Plugins such as JQuery and Underscore may not be necessary on every project, keep in mind that standalone JS will always run faster.

JS can be programmed asynchronous, try to make everything in the code that way to avoid waiting times for tasks that should not be required (e.g. AJAX calls and visual events).

Accessing and changing the DOM may be a heavy and slow task. Try to avoid unnecessary changes. Unless using a proper framework such as [Angular](https://angularjs.org), [React](https://facebook.github.io/react) or [Polymer](https://www.polymer-project.org/1.0), avoid client-side rendering if possible.

* Maintain well structured scripts.
* Avoid using unnecessary libraries and plugins, take advantage on standalone JS.
* Don't use JS for everything. A lot of visual effects can be easily achieved with plain CSS.
* Make it async!
* DOM modifications can be slow.
* Avoid client side rendering if not using a framework.
* Follow the style guides on writing JS

### CSS
CSS only specifies how the content is shown, however, the way the browser handles stylesheets, a bad CSS could result on slower rendering times, strange flickering and overall bad experience. It is important to know how CSS rendering works[^4] and follow the basic guidelines on writing CSS.

The main problem is using bad the css selectors, things such as `button#backButton` and `treehead treerow treecell` could make an impact on rendering times and are not recommended when writing css.

* Avoid bad use of rules (check css guidelines)
* Don't have the same rule twice
* Avoid ambiguous rules


## Resources


## Connections

## Conclusion

load time: <3 seconds
min-latency: 300ms


----
## Bibliography

[^1]:Apache server configuration: https://www.digitalocean.com/community/tutorials/how-to-optimize-apache-web-server-performance
[^2]:Nginx server configuration:https://www.nginx.com/blog/tuning-nginx
[^3]:Template engines for JS: https://colorlib.com/wp/top-templating-engines-for-javascript
[^4]:Efficient CSS: https://developer.mozilla.org/en-US/docs/Web/Guide/CSS/Writing_efficient_CSS
[^5]:Need for Speed – How to Improve your Website Performance: https://www.devbridge.com/articles/need-for-speed-how-to-improve-your-website-performance
