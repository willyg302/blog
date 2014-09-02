<!--
layout: post
title: Python Antics
date: 2014-05-31 20:18:53 -0700
comments: true
categories: Python
-->

It's strange how often I find myself in situations where I have to do stupid things that push the boundaries of whatever languages I am working with. Recently I've been doing a lot of Python development, so naturally I've also been getting myself into a lot of `import` trouble.

<!-- more -->

As an example, here's a little beauty I wrote a while back:

```python
def load_plugin(name):
    try:
        plugin = __import__('{}.{}'.format(__name__, name), fromlist=['*'])
    except ImportError, e:
        return None
    _plugins[name] = plugin
    return plugin

def load_plugins():
    for name in glob.glob('{}/[!_]*.py'.format(
            os.path.dirname(os.path.abspath(__file__)))):
        load_plugin(os.path.basename(name)[:-3])
```

This code is stored in an `__init__.py` file. When the module is imported, it searches for all sibling Python files (that don't begin with an underscore, so we don't include ourselves) and imports them into a dictionary accessible by filename. The beauty of this method is that it's dynamic. I don't have to explicitly define a new import for every file in the module; I just dump it in there and know it'll be in the `_plugins` dictionary.

Here's another one. Suppose you want to use a decorator defined in another module *without* an import statement. The main reason for such a requirement is that Python's import system is a pain in the glutei maximi when the location of the module is not known; you can't assume it will be installed globally, and absolute paths are a no-no.

I searched around for a while and the general consensus was that you just can't use something if you don't know where it is. This makes sense, because if I didn't know where my car was in the morning, I would probably not be driving it anytime soon.

I finally *did* hit upon a solution, though. The crux of the process was realizing the problem was with scope. All import statements really do is define a new global-level variable in the current scope pointing to the "imported" module. But we don't have to obey this scope at all. In fact, once the module is imported we can pass it around just like any other variable, and this means we can also wrap it in a context that has no import statements at all.

So first, let's make our decorator in a file called `a.py`:

```python
class MyDecorator(object):

    def __init__(self, f):
        print "Init decorator"
        self.f = f

    def __call__(self):
        print "Calling function..."
        self.f()
```

And now the magic, in a file called `c.py`:

```python
def run(dec):

    @dec
    def fun():
        print "Called fun"

    fun()
```

Notice the nested functions. Our decorator is passed as a parameter `dec` to the outer function, and since it is now defined in the scope of `run()`, it can be freely used. To tie everything together, we have `b.py`:

```python
from a import MyDecorator
import c

c.run(MyDecorator)
```

Run `python b.py` and voila, the decorator works as expected.

This is an absolutely horrible thing to do, but simplifies a lot of the issues I was having with imports in arbitrary Python scripts. Now, `c.py` can be anywhere it wants to be, and as long as `b.py` can import both it and the decorator, things will work.

But we have to ask ourselves at this point, "Can I do better?" And with a language as malleable as Python, the answer is usually yes.

See, I find it quite a pain that `c.py` has to know about the decorator at all -- and by that I mean that it has to get passed into `run()`'s scope. Let's fix that with a little global namespace munging in `b.py`:

```python
from a import MyDecorator
import c

c.run.func_globals['dec'] = MyDecorator
c.run()
```

And now `c.py` can become:

```python
def run():

    @dec
    def fun():
        print "Called fun"

    fun()
```

Once again, don't try this at home.
