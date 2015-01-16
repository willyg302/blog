---
title: (Almost) Proper Cross-Browser Timestamps
date: 2014-09-09T21:57:52.310916
tags: Web Development
template: post.jade
comments: true
---

While making this blog, one of the things I had to do was figure out a way to represent post timestamps. These are used not only for sorting and filtering posts by date, but to display the date a post was written in a pretty, human-readable format.

<!-- more -->

My current system is pretty simple. I have automated the creation of new posts in Markdown via a Python script, which injects the current time as a timestamp in an HTML comment. When the blog is built, the same Python script parses the comment and aggregates post information into a JSON file, which Angular can then request and use. The timestamp is available as the string `post.date`, and displaying the date nicely is as simple as `post.date | date:'EEEE, MMMM d y'` (using Angular's date filter).

The system worked great so I pushed it out. Then I later accessed my blog from a mobile device and was surprised to see "undefined, undefined NaN NaN" where the date should have been.

Turns out that JavaScript's date support is not consistent across browsers: in particular, mobile browsers lag significantly behind. So I set out in search for a timestamp format that would work across "all" browsers (that I could test).

Thankfully, my journey wasn't terribly difficult. I was concurrently working on [a project](https://github.com/willyg302/Noat) that used both App Engine and Angular, and happened to notice that App Engine's date format worked in mobile browsers without any problems. App Engine's format looks something like this: `2014-09-09T21:57:52.310916`. You can get such a timestamp in Python with the following code:

```python
from datetime import datetime

def stop(s):
	print(s)

hammer_time = datetime.utcnow().strftime('%Y-%m-%dT%H:%M:%S.%f')
stop(hammer_time)
```

Terrible puns aside, it's important to call `utcnow()` instead of `now()` so that time zone information is retained by normalizing to UTC.

Of course, JavaScript is notorious for being difficult to get 100% right, so I'm sure there's some obscure version of Opera or IE7 that this will break in. If you absolutely have to have your dates work no matter what, it's best to depend on a proven library like [Moment.js](http://momentjs.com/). My situation didn't really warrant the added bloat of such a library for one date string, so I'm happy with my decently proper solution.
