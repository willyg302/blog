---
title: "strap: Make for Stupid People"
date: 2014-09-15T07:31:54.459391
tags: "Python, strap"
template: post.jade
comments: true
---

I made this thing called [strap](https://github.com/willyg302/strap.py). It's pretty kewl. This is a post about why it was made, how it was made, and what you can do with it.

<!-- more -->

## Why? Make is Hard

You're probably thinking (and rightly so), "*Another* build tool? Really?!"

Make is kewl, too. It's the original build tool, the granddaddy of them all, and even after all this time it still deserves merit. Posts have been written about why it is "[The Ultimate Frontend Build Tool](https://algorithms.rdio.com/post/make/)". Sometimes people do things in Gulp or Grunt that could easily be accomplished by a line or two of Bash thrown into a Makefile. Sometimes people do things in Gulp or Grunt that they shouldn't even be doing in Gulp or Grunt, like renaming files and deleting directories. (Okay, yes, there are Windows devs out there. I pity them.)

But even though Make is kewl, it usually ends up looking something like this:

```make
program_NAME := myprogram
program_C_SRCS := $(wildcard *.c)
program_CXX_SRCS := $(wildcard *.cpp)
program_C_OBJS := ${program_C_SRCS:.c=.o}
program_CXX_OBJS := ${program_CXX_SRCS:.cpp=.o}
program_OBJS := $(program_C_OBJS) $(program_CXX_OBJS)
program_INCLUDE_DIRS :=
program_LIBRARY_DIRS :=
program_LIBRARIES :=

CPPFLAGS += $(foreach includedir,$(program_INCLUDE_DIRS),-I$(includedir))
LDFLAGS += $(foreach librarydir,$(program_LIBRARY_DIRS),-L$(librarydir))
LDFLAGS += $(foreach library,$(program_LIBRARIES),-l$(library))

.PHONY: all clean distclean

all: $(program_NAME)

$(program_NAME): $(program_OBJS)
    $(LINK.cc) $(program_OBJS) -o $(program_NAME)

clean:
    @- $(RM) $(program_NAME)
    @- $(RM) $(program_OBJS)

distclean: clean
```

![dafuq](http://cdn.meme.li/instances/500x/48471959.jpg)

Thankfully, the author of that Make goodness has [provided](https://sites.google.com/site/michaelsafyan/software-engineering/how-to-write-a-makefile) an explanation long enough to fill the first chapter of a book about why Makefiles are too darn hard to understand. And it gets [worse](http://www.conifersystems.com/whitepapers/gnu-make/). A lot [worse](https://blog.mozilla.org/adirondackfirefly/2012/03/06/makefile-landmines/).

On the contrary, Python syntax is like a big bowl of unicorns and marshmallows.

## Why? People are Stupid

Before you get all angry and start flipping tables, let me tell you a little story about Bob, the happy software developer.

Bob is working on a Python project that uses `pip` to install dependencies (well, he also uses `easy_install` for greenlet, because for some inconceivable reason `pip` just borks when trying to install greenlet). So he's coding happily when one day his boss comes in with a few requirements for the project:

- It has to run on both Windows and OSX
- It should be easy to set up from a "vanilla" machine (out of the box, with none of the aforementioned tools yet installed)
- Its setup should assume nothing about the expertise of the people setting it up

Indeed, Bob knew his project was destined to be used by his coworkers, several of whom had never touched a shell in their lives. He also knew that by the time the project was to be used by said coworkers, he might be gone. Suddenly Bob was no longer happy.

Bob decided he needed a cross-platform setup script. Make? No (dang it, Windows). But what then? It was on a fine winter day that it occurred to our hero Bob that he could write a cross-platform setup script in Python -- after all, he was already using the language for the project itself, and installing Python on a bare machine was not a terribly difficult task. So [that's what he did](https://github.com/willyg302/Parrot/commit/d00908d87b991a0a9788a38db23df6a0bfa20b77).

Of course, Bob's coworkers aren't stupid. Neither are Bob or his boss. By "stupid" I mean that everyone in this world has different levels of expertise. Some are venerable whitebeards of the terminal, and others are like babies banging pots and pans together. When babies banging pots and pans together are placed in a position of having to set up a project, you can expect things to get loud and messy really fast. You can teach them how to make a proper percussion concerto, sure, but that doesn't lessen the fact that the project should accommodate *all* skill levels as much as possible. Don't expect everyone in the world to understand Make, even if you do.

On the contrary, Python is probably one of the easiest languages to understand with zero experience (okay, I swear I'm done exalting Python).

## A Gentle Introduction to strap

Here are a few of the cool things you can do in strap.

### Makefiles, Meet `strapme.py`

With Make, you have Makefiles. With strap, you have a file called `strapme.py`. It's sort of like a readme, only for strap, and written in the imperative style like Gulp.

This file consists of a number of functions. Functions that don't begin with an underscore are **tasks** that you can run. Two such tasks that must always be there are `default()` and `install()`, but of course you can add as many tasks as you want. This being a Python file, you can also write all the legal Python you want. Write to files, parse JSON, manipulate dates, import modules...you name it, you can do it. Beat that, Gulp!

However, `strapme.py` is a special Python file because it has the `strap` variable automatically declared in its scope. Using this magical variable you can do all sorts of crazy things:

```python
strap.run([
    "pip install some-module",
    "echo Hello world!",
    "npm install",
    "node_modules/.bin/gulp",
    some_other_task
])
strap.pip('install some-module').run('echo Hello world!').npm('install').node('gulp', module=True).run(some_other_task)  # Same as above

# And yes, in case you were wondering...
strap.run('make && make install')
strap.make().make('install')  # Same as above
```

The goal is to have a syntax that's as intuitive as possible, while still providing common-sense fallbacks to familiar shell commands.

### Clone Like a Champ

Remember that required install task I mentioned earlier? Here's why it's important.

From the command line, you can call `strap init` (with some sensible arguments, of course) to initialize a project. For example, suppose you decided to call `strap init gh:willyg302/jarvis -d jarvis`. That would do the following:

1. Clone [the jarvis repo](https://github.com/willyg302/jarvis) into the `jarvis/` directory
2. `cd` into that directory
3. Run the install task

If your install task happens to manage downloading all your Node modules and Bower packages, or sets up a new virtual environment and grabs stuff from PyPI, or even just runs Make, then you're done. With *one command* you were able to grab the project off GitHub and initialize it. How easy is that?

### Earning Its Name

But wait, there's more! I didn't call strap "Make for stupid people" without a perfectly legitimate reason, and this goes all the way back to our tale about Bob the slightly less happy software developer.

Suppose your project happens to use `pip`. Some guy who has Python and strap on his machine, but nothing else, decides to download your project. So he runs `strap init` and the project gets cloned and the install task is run and everything is going hunky-dory until suddenly strap comes upon your `strap.pip('install some-module')` command. Whatever shall it do?

You might expect it to error out. But no. strap is better than that.

strap will check to see if `pip` is installed on the system before trying to run it. In this case it isn't, so what it will do is try to install it. Fortunately, strap happens to come with the necessary `ez_setup.py` and `get-pip.py` files needed to install both `easy_install` and `pip` (respectively), so strap will chug away and install everything. When that's taken care of, it'll pick up where it left off and install some-module, and your user will now have `pip` on their system.

"Okay," you're saying, "But you can't install Node programmatically." Psst...you actually [can](https://gist.github.com/isaacs/579814), but that violates our basic principle of cross-platform-ness. If you run a strap script that uses Node and the user doesn't have Node on their system, it *will* error out. strap comes to the rescue, though. Here's what users will see:

```
Unable to install module node: Installation must be done manually
Please visit http://nodejs.org/ for installation instructions.
```

Whoa! Instead of some unintelligible garbage about node not being recognized as the name of a cmdlet, function, script file, or operable program, you get a nice URL in a nice message. Nice.

## How? Abusing Python

For what it does, strap is pretty small. The core logic is a wee bit over 200 LOC. There's a utilities file that clocks in at nearly 100 LOC. The various modules that extend core functionality are usually 10-20 LOC each. And then we have [clip.py](https://github.com/willyg302/clip.py), which is just used for command-line parsing and is about 200 LOC.

All this functionality in such a small space means copious abuse of Python. For example, we have the [`strap.run()` method](https://github.com/willyg302/strap.py/blob/master/strap/strap.py#L121-L136), which takes either a list/tuple or a function or a string that might possibly be offloaded to a function. To facilitate all the direct calls to various modules (e.g. calling `strap.node()` actually dynamically imports the node module and runs its `run()` method) I have implemented a pretty weird [`__getattr__`](https://github.com/willyg302/strap.py/blob/master/strap/strap.py#L86-L91). Oh, and [here's](https://github.com/willyg302/strap.py/blob/master/strap/strap.py#L210-L217) the code for printing out a list of tasks in a `strapme.py` file along with their descriptions. I love comprehensions.

## How? Dynamic Loading and Injecting

Handling `strapme.py` files is one of the most interesting things I've ever had to do in any programming language. For one thing, you're talking about dynamically importing a Python file from an arbitrary path in such a way that any code within that file runs relative to its own path. Then there's the magical declaration of the `strap` variable.

Dynamic importing is actually pretty easy; the hard part was figuring out how to do it since the documentation is quite scarce. It's implemented by the paltry four lines [here](https://github.com/willyg302/strap.py/blob/master/strap/utils.py#L33-L37). What this returns is a module just like any other imported Python module. This means that if I say `config = get_strapme(dir)`, then I can access the `project` variable defined in the global scope in the `strapme.py` file by doing `config.project`.

I can also do this: `setattr(config, 'strap', strap)`. Oooh...magic.

As it turns out, this dynamic injection is the *only* way such a system would have worked. Don't believe me? Try accessing the strap variable from the global scope. The reason why it breaks there is because the variable isn't shielded, which is exactly what injection achieves. Moreover, if you try to import the strap library from within a `strapme.py` file, suddenly you've got a circular dependency -- because of the way Python importing works such a task would be...less than intuitive. Definitely not something we want stupid people to tackle.

## Kewl. So What Now?

[Get strap](https://github.com/willyg302/strap.py), of course!
