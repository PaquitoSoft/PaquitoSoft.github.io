---
slug: "create-a-ractive-application-tutorial"
title: "Create a Ractive.js application (0 of 6)"
creationDate: "2015-07-26T16:15:37.214Z"
keywords: tutorial, javascript, ractive, ractivejs
status: published
---

I'm a big fan of javascript. I like it in the front-end and I love it in the back-end (thanks [Ryan Dhal](http://www.quora.com/Who-is-Ryan-Dahl)).
Also I enjoy playing with new libraries and frameworks that pops up every day. It seems nowadays everybody creates a new one and, when the time comes for you to start a new project and select the right one, oh man! it's a tough time.

With the beggining of this year, I was in the position of starting a new big project and I spent some time deciding which libraries we would use in the front-end (no doubts on our back-end: **NodeJS** _FTW_).
It was then when I discovered [Ractive.JS](http://www.ractivejs.org/).

The more time I spent reading the [docs](http://docs.ractivejs.org/latest/get-started) and playing with their interactive [demos](http://learn.ractivejs.org/hello-world/1/), the more surprised I was I didn't hear anything about this library before.
IMHO it's a very easy to learn and powerful tool for dealing with DOM automatic bindings, event handling, pub/sub stuff and so on.

I began working in a prototype of our project using this tool and I was also surprised about the speed yur can get in terms of development. 
The way this library solves some common problems is very natural for me, it fits my mindset. And every time I needed to learn how to implement something, it was pretty straightforward to find out.

<!-- more -->

We finally didn't use _Ractive.JS_ in our project as we found some issues regarding server-side _html_ rendering we couldn't solve ([more  info](https://github.com/ractivejs/ractive/issues/1648)) and I can tell you it was a hard decision to drop it.

Anyway, I'm a big fan of this library and I'm eager to use it in my side projects (couldn't begin any new one this year so far).

On the other hand, I spend the little spare time I have these days following the great tutorials you can find in [egghead.io](https://www.egghead.io). Specially, I enjoyed the [ReactJS](http://facebook.github.io/react/) ones.
This library has a lot of popularity nowadays and I wanted to know why.
From my point of view, _ReacjJS_ is also a great library and if you combine it with the [Flux](https://facebook.github.io/flux/docs/overview.html) architecture, it's also a powerful tool for you to build complex systems.
But, the more I know about _ReactJS_ the more I wonder why _Ractive.JS_ is not as popular. Of course the latter (built by the bright people at _The Guardian_) does not have _Facebook_ behind, but from the developer perspective, I think it's at as good as the other one.

So, when I finished the great [Tyler McGinnis](https://github.com/tylermcginnis/) tutorial on [how to build an app with _ReactJS_](https://egghead.io/series/build-your-first-react-js-application), I was convinced to do the same with **Ractive.JS**.

## Tutorial introduction
The goal of this tutorial is to introuduce you to the world of _Ractive.JS_. Also, as I've been reading a lot about _ES2015_ (formerly _ES6_), I will be using the next version of _Javascript_ thanks to another brilliant tool: the [Babel](https://babeljs.io/) transpiler.
The last tools I will be using is [webpack](http://webpack.github.io/) to build all of our front-end assets and [npm](https://www.npmjs.com/) for dependency management.
I will also be using a couple of extra libraries apart from _React.JS_ I will explain when the time comes.

You can find the final code for this tutorial at [GitHub](https://github.com/PaquitoSoft/notetaker-ractive).

## Summary
These are the links for the different steps of the tutorial:
1. [Setting up your environmet](/post/ractive-js-tutorial-setting-up-your-environment)
2. [Creating the barebones](/post/ractive-js-tutorial-creating-the-barebones)
3. [Routing](/post/ractive-js-tutorial-routing)
4. [Loading user info (GitHub)](/post/ractive-js-tutorial-loading-user-info)
5. [Managing user's notes (Firebase)](/post/ractive-js-tutorial-managing-users-notes)
6. [The final touch](/post/ractive-js-tutorial-the-final-touch)
