<!--
layout: post
title: What Lambda Is
date: 2014-11-14T03:07:34.718697
comments: true
categories: AWS Lambda
-->

To quote Joe MacMillan from *Halt and Catch Fire*, "The computer's not The Thing. It's the thing that gets us to The Thing."

I sense another Thing approaching.

<!-- more -->

<div class="embed-responsive embed-responsive-16by9">
    <iframe width="560" height="315" src="//www.youtube.com/embed/9eHoyUVo-yg" frameborder="0" allowfullscreen></iframe>
</div>

Fundamentally, the idea behind [AWS Lambda](http://aws.amazon.com/lambda/) is nothing new. Although the relationship to lambda calculus is tangential at best, the analogy is a helpful one: these are functions. Containerized, distributed, aggressively managed functions, yes, but still *functions*. What else can you do with functions? `cat "dog" | grep "Terrier" | wc -l` perhaps? Or maybe even `thumbnail | compress | tweet`?

I have [previously touched upon](http://willyg302.github.io/blog/#!/post/2014-09-06-webs-and-streams) the trend towards small applications that do one thing well, and am seeing it unfold through services such as [Blockspring](https://api.blockspring.com/), [Webscript](https://www.webscript.io/), and now AWS Lambda. What these services enable is an ecosystem of code-at-your-fingertips. Want to MD5 hash a file but can't remember which Python module to import? No problem, here's a cloud function that'll do it for you. Want to automate the terribly boring task of filtering your album of 1000 Instagram-bound images but don't have the slightest clue how to use ImageMagick? You don't have to worry anymore!

So we've nailed the **simplicity** aspect of the Unix design philosophy; now it's time to work on **teamwork**. Having a piece of code in the cloud ready to be run at a moment's notice is cool, but what's really smashing is when you can start *combining* your functions. Imagine all the possibilities!

Lambda may seem like a lot of things to different people, but to me it provides a means for incredible innovation and an entirely "new" way of thinking about application development. It's the thing that gets us to The Thing, and I for one can't wait to see what The Thing is.
