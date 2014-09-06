<!--
layout: post
title: How I Configured a Blog
date: 2014-09-04 21:46:17 -1000
comments: true
categories: Web Development
-->

The blog you're reading right now was *configured* 100% entirely by yours truly. I say configured rather than some other verb (like *programmed* or *built*) because a ridiculous amount of the work involved configuration -- of Node packages, of Bower, of Gulp, of JavaScript requirements, of Less...the list goes on and on.

<!-- more -->

Over the summer I've been learning a lot about such project management tools and why they exist. Previously I probably would have relied on a direct CDN link to Angular in my HTML or, worse, downloaded `angular.js` and included it with the rest of my committed source. But now, depending on Angular is as easy as `"angular": "~1.2.23"` in my `bower.json`. Essentially, all these tools serve to abstract away a project's dependencies and provide convenient ways to upgrade or delete them if need be.

The downside to this productivity boost is that configuration is *not* simple. At times, dependencies are so abstracted that it becomes hard to see what will happen until the project is built. On more than one occasion I found myself digging through my minified JavaScript and CSS files to be sure that certain components (pulled from `bower_components/`, no less) were where they needed to be. And for someone who has never used such tools before, the amount of Googling required is astronomical; you can probably get anything done with Gulp, but first you have to find the right module and then learn how to integrate that module with your project and then pray that there isn't an unsolved issue with it or else you'll be screwed.

If that wasn't enough, I also had to choose to use Gulp/Bower/RequireJS versus some other solution, like Grunt/Yeoman, or Gulp/Browserify, or ComponentJS (oh wait, I meant [Duo](http://duojs.org/)). I had actually started using Grunt until I did a bit of Googling and realized that it was [old and busted](http://www.100percentjs.com/just-like-grunt-gulp-browserify-now/). And I was almost going to use Browserify, but it was a little *too* automated for my tastes -- the same reason I also didn't give Duo a whirl. Who knows, maybe next week I will. But by then there will be an even better solution, and everything I just mentioned will be outdated.

So how did I configure a blog? First I set up a directory structure like so:

```bash
app/  # Will be built and copied into sibling dist/
    js/
    less/  # And so on for img/, partials/, etc.
    bower.json
    index.html
Gulpfile.js
package.json
```

Then I spammed `npm install` and `bower install`, complained a lot, and something magically happened.

Oh, and of course I used [strap](https://github.com/willyg302/strap.py). More on that later.
