<!--
layout: post
title: Webs and Streams
date: 2014-09-06T14:31:03.000000
comments: true
categories: Thoughts
-->

> **Note**: This post was adapted from an assignment I had to do for a Systems Design course at college. We were tasked with writing about what we thought were the world's worst and best designs. Here are my picks.

<!-- more -->

## Worst: The Internet

The Internet was not designed, which at least in part explains why it is an absolute disaster of design. On the Internet I have seen both masterpieces and abominations, sometimes within clicks of each other. That covers the front-end design, but back-end implementations are no better. There are days when I feel like duct tape and a prayer are holding the digital world together.

The thing about the Internet is that it is everywhere. It is both the dusty basement server and the spotless Google data center. Since its inception, it has grown -- *evolved* -- at a blistering rate, with contributions from dusty basement geeks and spotless Google engineers alike. As a person who already despises team projects, the Internet is a nightmare. Our team is hundreds of millions strong with no coordination and no standards to uphold. I praise the valiant few like the IETF and ECMA who try to make sense of this mess, but their formal processes are too slow for a beast that changes by the millisecond.

I could also go on a rant about cross-browser development, but there is a page limit to this assignment and academia was never a place for excessive profanity.

## Best: Streams (Unix design philosophy)

We are on the cusp of another technological revolution. Some call it the "Internet of Things" (a buzz-phrase if there ever was one), pointing to the increasing diffusion of hardware into every part of our lives, but the true revolution will come at the software level. For the first time since the beginning of the digital age, we will have a plethora of otherwise simple and isolated devices that will need to *communicate*.

For the first time, streams are poised to take center stage.

Streams exemplify the two most basic qualities of the Unix design philosophy, as [summarized](http://www.faqs.org/docs/artu/ch01s06.html) by Doug McIlroy, inventor of the Unix pipe:

- **Simplicity**: "Write programs that do one thing and do it well"
- **Teamwork**: "Write programs to work together"

There's something so profoundly elegant about this way of transforming and exchanging data that I sometimes wonder why it doesn't play a more central role in computing. I am starting to see a paradigm shift -- people choosing Gulp over Grunt, API libraries like [Blockspring](https://api.blockspring.com/) popping up by the dozen -- but it should have happened a long time ago. Such a powerful concept should not be confined to the terminal.

## Side Notes

This assignment is a refreshing conversation starter that everyone should attempt to answer for themselves. So go on...what do *you* believe are the world's worst and best designs?

For those who want to learn more about streams, I recommend the excellent [Stream Handbook](https://github.com/substack/stream-handbook/blob/master/readme.markdown) (it is, however, heavily Node-biased). I am currently trying to wrap my head around them; as much as I believe in their potential, I find them as conceptually complex as coroutines.

For those who want to see what's possible with streams, check out [Node-RED](http://nodered.org/).
