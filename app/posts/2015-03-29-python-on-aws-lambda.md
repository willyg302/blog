---
title: "Python on AWS Lambda"
date: 2015-03-29T23:01:23.117283
tags: "AWS Lambda, Python"
template: post.jade
comments: true
---

Want to use Python on [AWS Lambda](http://aws.amazon.com/lambda/)? Lambda currently only supports JavaScript via Node, but that shouldn't stop you from trying.

<!-- more -->

If you've had any experience with the AWS infrastructure, it might occur to you that Lambda's runtime environment will come with Python built-in. Try to do anything with it, though, and you'll quickly run headfirst into Lambda's sandbox (for example, `python --version` returns an empty string). We can get around this limitation with some crafty Python-ness:

```js
var exec = require('child_process').exec;

exports.handler = function(event, context) {
	exec('python -c "import sys; print sys.version_info"', function(error, stdout) {
		context.done(error, stdout);
	});
};
```

Run this command via the console and you'll get:

```
Message
-------
(2, 6, 9, 'final', 0)
```

Okay, so it looks like Lambda comes with Python 2.6.9. Not the most up-to-date version in the world...and unless we enjoy running circles around the sandbox limitations, writing "valid" code will quickly become a drag.

## virtualenv to the Rescue!

Thankfully, Python's got us covered for this scenario via [virtualenv](https://virtualenv.pypa.io/en/latest/), a tool that creates "isolated Python environments." You can easily grab virtualenv with [pip](https://pip.pypa.io/en/latest/) and have your very own portable Python in seconds:

```bash
$ pip install virtualenv
$ mkdir lambda-python
$ cd lambda-python
$ virtualenv env
```

What this will do is create a directory called `lambda-python/env/` that has a completely bootstrapped Python environment inside of it. If you then run `env/bin/python`, you'll see the familiar REPL you've come to know and love. At this point we could write any old python "hello world" code, dump it in a file, and `exec()` out to it from Node and be done, but that's kind of boring. What I'd like to do is extract the hello world from this HTML file:

```html
<!-- Save in a file called index.html -->
<html>
<head>
</head>
<body>
	<span id="python">Hello world from Python!</span>
</body>
</html>
```

To accomplish this we'll need the help of a non-standard Python library, namely [Beautiful Soup](http://www.crummy.com/software/BeautifulSoup/). Go ahead and install it now with `env/bin/pip install beautifulsoup4` -- notice we're using our `env/` version of pip, meaning it will get installed into our local environment. Nifty! We can now write some Python to extract the contents of the HTML element:

```python
# Save in a file called test.py
from bs4 import BeautifulSoup

def main():
	with open('index.html', 'r') as f:
		soup = BeautifulSoup(f.read())
		print(soup.find(id='python').text)

if __name__ == '__main__':
	main()
```

Alright, now to call this Python code from Node:

```js
// Save in a file called index.js
var exec = require('child_process').exec;

exports.handler = function(event, context) {
	child = exec('env/bin/python test.py', function(error) {
		context.done(error);
	});

	child.stdout.on('data', function(data) {
		console.log(data);
	});

	child.stderr.on('data', function(data) {
		console.error(data);
	});
};
```

The principle is the same as the previous example, but we're doing a bit more heavy lifting here to handle asynchronous output from the child process' streams. Otherwise, we'd get all the output only when the process has terminated, which isn't an ideal experience. Note that this setup provides no message upon successful completion and instead redirects all Python output to `console.log()` (which itself is redirected to CloudWatch). You may wish to consider an alternative approach, such as writing output to a Kinesis stream, which can then be handled by any number of other AWS services.

At this point you could zip up the `lambda-python/` directory and deploy it, but we can make things a tad bit easier.

## The Shameless Plug

Make one final file called `.lambda.yml` with the following contents:

```yaml
config:
  FunctionName: lambda-python
  Handler: index.handler
  Mode: event
  Runtime: nodejs
  Description: Python hello world from Lambda
```

Now, assuming you have your AWS credentials and Lambda execution role configured correctly in the `~/.aws/` directory, you can use [lfm](https://github.com/willyg302/lfm) to deploy your brand-spanking-new Lambda function in a measly 10 characters:

```bash
$ lfm deploy
```

This might take a while because we're essentially deploying an entire programming language -- on my machine it's 17 MB total. Once your function is deployed, hop on over to the console and invoke it:

```
Logs
----
START RequestId: f2fe1573-d66b-11e4-b299-e33b360b7f5a
2015-03-29T23:33:08.910Z	f2fe1573-d66b-11e4-b299-e33b360b7f5a	Hello world from Python!

END RequestId: f2fe1573-d66b-11e4-b299-e33b360b7f5a
REPORT RequestId: f2fe1573-d66b-11e4-b299-e33b360b7f5a	Duration: 1779.45 ms	Billed Duration: 1800 ms 	Memory Size: 128 MB	Max Memory Used: 15 MB	

Message
-------
undefined
```

Sweeeeet! A quick recap in case you've forgotten, we just parsed an HTML document with Python executed by Node invoked by AWS Lambda. Not the most efficient of cloud solutions, but what can I say?

Hopefully you've seen that while Node is the only thing supported by Lambda right now, that's really all you need to get crazy in the cloud *provided* you think outside of the box. For another example of using other languages within Lambda, see [this blog post](http://blog.0x82.com/2014/11/24/aws-lambda-functions-in-go/) about embedding a Go runtime in a Lambda function written just days after Lambda was launched.

## Bonus Round

Okay, so we're able to run Python code in the cloud now. But something is still bothering me.

Suppose for a moment that I have a friend named Bob (I actually do have a friend named Bob, but I digress). After writing my awesome new Python cloud function to print hello world via an unnecessary number of abstractions, I want to share the awesomeness with him. So what do I tell him to do? "Hey Bob, yeah, just follow the steps in this blog post and deploy the function and you're good to go." Nope, Bob's a busy man. He's got a job and junk. Okay, round two: "Hey Bob, I'm emailing you a zip of my cloud function. Deploy it when you've got the time!" Uh huh, the '90's called and they want their deployment process back.

Nope, what we've got to do is make it so that Bob goes from zero to hero with minimal effort. To do so, we're going to need to write a Makefile:

```make
VERSION = 12.0.5
VIRTUALENV = env
PYTHON = $(which python)

all:
	wget https://pypi.python.org/packages/source/v/virtualenv/virtualenv-$(VERSION).tar.gz
	tar xzf virtualenv-$(VERSION).tar.gz
	$(PYTHON) virtualenv-$(VERSION)/virtualenv.py $(VIRTUALENV)
	rm -rf virtualenv-$(VERSION)
	rm virtualenv-$(VERSION).tar.gz
	$(VIRTUALENV)/bin/pip install beautifulsoup4
```

This vomit of make-y goodness bootstraps virtualenv locally *without* using `sudo`. The only requirement is that the user has Python installed, which is a pretty reasonable assumption to make.

Finally, we can tweak our `.lambda.yml` file to add a single line, `install: make`:

```yaml
config:
  FunctionName: lambda-python
  Handler: index.handler
  Mode: event
  Runtime: nodejs
  Description: Python hello world from Lambda
install: make
```

I've uploaded the entire contents of `lambda-python/` as [a Gist](https://gist.github.com/willyg302/c09048aeff3ae48ddcf2) for your perusal. Incidentally, this means we can also give Bob the solution he's been looking for. "Yeah Bob, just go ahead and `lfm deploy gist:willyg302/c09048aeff3ae48ddcf2` when you feel like it. And enjoy."
