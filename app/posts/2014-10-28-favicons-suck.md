---
title: Favicons Suck
date: 2014-10-28T21:48:30.936556
tags: Web Development
template: post.jade
comments: true
---

Every once in a while I tinker with my website to "improve" it. In the last such attempt at improvement I decided to tackle decent favicon support. Up until then I had been using a base64-encoded 16x16 transparent image, since it saved a request and worked fine for the most part, but UX was severely lacking in things like mobile bookmarks and home screen tiles.

<!-- more -->

Rather than stop to wonder why this was the case, I decided to plunge headlong into the hellhole that is the modern favicon. Quite early on I uncovered [this gem](https://github.com/audreyr/favicon-cheat-sheet), which suggested that to guarantee cross-platform support I should resize my logo a bunch of times and ImageMagick some of the generated images into a nice `favicon.ico`.

This seemed like a horrendously repetitive task just dying to be automated, and in fact it [has been](http://realfavicongenerator.net/). Using the beautiful "Real Favicon Generator" I was able to quickly generate all the files necessary for not only generic browser support but a wide variety of use cases on mobile and TV platforms, *and* (as if that wasn't enough) verify that my deployed site performed as expected. All it took in the end were these lines:

```html
<link rel="shortcut icon" href="dist/img/favicon/favicon.ico">
<link rel="apple-touch-icon" sizes="57x57" href="dist/img/favicon/apple-touch-icon-57x57.png">
<link rel="apple-touch-icon" sizes="114x114" href="dist/img/favicon/apple-touch-icon-114x114.png">
<link rel="apple-touch-icon" sizes="72x72" href="dist/img/favicon/apple-touch-icon-72x72.png">
<link rel="apple-touch-icon" sizes="144x144" href="dist/img/favicon/apple-touch-icon-144x144.png">
<link rel="apple-touch-icon" sizes="60x60" href="dist/img/favicon/apple-touch-icon-60x60.png">
<link rel="apple-touch-icon" sizes="120x120" href="dist/img/favicon/apple-touch-icon-120x120.png">
<link rel="apple-touch-icon" sizes="76x76" href="dist/img/favicon/apple-touch-icon-76x76.png">
<link rel="apple-touch-icon" sizes="152x152" href="dist/img/favicon/apple-touch-icon-152x152.png">
<link rel="apple-touch-icon" sizes="180x180" href="dist/img/favicon/apple-touch-icon-180x180.png">
<link rel="icon" type="image/png" href="dist/img/favicon/favicon-192x192.png" sizes="192x192">
<link rel="icon" type="image/png" href="dist/img/favicon/favicon-160x160.png" sizes="160x160">
<link rel="icon" type="image/png" href="dist/img/favicon/favicon-96x96.png" sizes="96x96">
<link rel="icon" type="image/png" href="dist/img/favicon/favicon-16x16.png" sizes="16x16">
<link rel="icon" type="image/png" href="dist/img/favicon/favicon-32x32.png" sizes="32x32">
<meta name="msapplication-TileColor" content="#f8f8f8">
<meta name="msapplication-TileImage" content="dist/img/favicon/mstile-144x144.png">
<meta name="msapplication-config" content="dist/img/favicon/browserconfig.xml">
```

Problem solved, right? Mission accomplished?

Ha. If there's one thing any budding web developer should know, it's that things are *never* this easy.

Apart from looking like Apple and Microsoft had gone on a drunken escapade and projectile vomited all over my `<head>`, these 18 lines of beautiful HTML (not to mention the 147 KB of redundant pixel information) *still did not work*:

![No Favicon](img/posts/2014-10-28-01-no-favicon.png)

## A Brief Aside

![Darn you, favicon](http://i132.photobucket.com/albums/q26/msmorbid921/frantic.gif)

![Darn you to heck](http://www.reactiongifs.com/wp-content/uploads/2013/06/mad.gif)

## In a Perfect World...

The world is not perfect, but it doesn't hurt to dream sometimes. This is all that should be required to implement a perfect cross-platform favicon:

```html
<link rel="icon" type="image/svg+xml" href="look/ma/not_at_root/not_even_called_favicon.svg">
```

Because it is vector and not raster, an SVG image looks great in any size, eliminating the need for a haystack of different square images. You can even construct a [responsive SVG](http://tympanus.net/codrops/2014/08/19/making-svgs-responsive-with-css/) for more complex icons at larger sizes. And what about those transparent favicons that need a background in certain situations, such as on a Windows Phone tile? Well, [SVG stacking](http://hofmannsven.com/2013/laboratory/svg-stacking/) comes to the rescue: just define a background layer that is initially set to `display: none;`, and applications that require the layer can flip its visibility.

Applications **should**:

- Look in the head of the current HTML document for a link tagged with `rel="icon"`
- Adapt this *one* icon for any size or use case

Applications **should NOT**:

- Assume anything about the location of the icon, such as that it's at the "root"
- Require/accept size-specific icons or reject icons not labeled with a `sizes` attribute
- Define proprietary relationship tags, like `apple-touch-icon` (seriously, what the hell were they thinking?)

Currently there is no support for SVG favicons in any of the "big three" web browsers, although bug reports requesting them are open -- see [Firefox](https://bugzilla.mozilla.org/show_bug.cgi?id=366324#c22), [Chrome](http://code.google.com/p/chromium/issues/detail?id=294179), and [Internet Explorer](https://connect.microsoft.com/IE/feedback/details/782416/svg-favicon-support). Judging by the feedback it appears that support *may* be coming, but is a distant glimmer on the horizon.

## For Now

I've decided to hold off on making my site work as expected no matter what, at least until browsers get their you-know-what together about something as trivial as the favicon. In all honesty, as cool as it is to see my logo in all its retina glory on the home screen of an iPhone, I don't think anyone plans to bookmark my site anytime soon. And even if they did, they could probably live without a nice-looking site icon.
