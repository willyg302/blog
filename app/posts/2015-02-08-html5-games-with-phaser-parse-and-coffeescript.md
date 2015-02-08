---
title: "HTML5 Games with Phaser, Parse, and CoffeeScript"
date: 2015-02-08T18:25:43.547104
tags: "Gaming"
template: post.jade
comments: true
---

A year and a half ago, I spent a week [making an HTML5 game](https://willyg302.wordpress.com/2013/09/08/making-an-html5-game-in-7-days/) called *Dave Likes Pizza*, despite knowing next to nothing about web development. Not surprisingly, the final product was an abomination of web practices. My *coup de grâce* was a file of [build instructions](https://raw.githubusercontent.com/willyg302/Dave-Likes-Pizza/master/how-to-build.txt) containing such gems as "use a JavaScript minifier on the contents of the `src/` directory" and "copy the following file structure to the remote host." Even now these lines make me shudder.

<!-- more -->

Luckily, in the 18 months that followed the completion of *Dave Likes Pizza*, I've been doing nothing but web development and have adopted much better development practices. So I thought it was high time we paid Dave a return visit.

In this post we'll be looking at how I'd start writing *Dave Likes Pizza* if I were doing it today, using these fancy-schmancy new web technologies:

- **[Phaser](http://phaser.io/)**: the game framework
- **[Parse](https://parse.com/)**: the supercharged backend service
- **[CoffeeScript](http://coffeescript.org/)**: our language of choice
- **[Node](http://nodejs.org/)/[gulp](http://gulpjs.com/)/[Browserify](http://browserify.org/)**: the build system

Please note that this is not by any means a definitive guide to making HTML5 games, because as with anything Internet-related there are [countless options](http://www.jsbreakouts.org/) to choose from. In many cases you will just have to experiment and find a workflow that you feel comfortable with, but it is my hope that this post can at least point you in the right direction.

So without further ado, let's get started!

## Getting Parse

A good first step would be to [create a Parse account](https://parse.com/#signup). Once you are logged in, create a new application and remember its **Application ID** and **JavaScript Key** for later.

## Setting Up

If you haven't already, [install Node and npm](https://docs.npmjs.com/getting-started/installing-node). Then make a new directory and initialize it:

```bash
$ mkdir mygame
$ cd mygame
$ npm init
```

You can probably accept all the defaults npm gives you by pressing Enter a lot of times, but if you want to provide a description of your game or choose a different license, feel free to do so. The next step is to install a whole bunch of packages (don't worry if you don't understand what these are for, we'll get to that in a bit):

```bash
$ npm install --save-dev gulp gulp-coffeelint gulp-stylus gulp-uglify browserify browserify-shim coffeeify del http-server vinyl-buffer vinyl-source-stream
```

Next, open up `package.json` in your favorite text editor and edit `"scripts"` to the following:

```json
"scripts": {
  "build": "npm run test && gulp",
  "serve": "http-server dist",
  "test": "gulp lint"
},
```

This will allow you to build the game by calling `npm run build`, serve it at `http://localhost:8080/` by calling `npm run serve`, and test your code (currently only for linting errors) by calling `npm run test`. Easy, right?

We'll also need a bit of custom config at the bottom of `package.json`:

```json
"browserify": {
  "transform": [
    "browserify-shim"
  ]
},
"browserify-shim": {
  "Parse": "global:Parse",
  "Phaser": "global:Phaser"
},
"coffeelintConfig": {
  "max_line_length": {
    "level": "ignore"
  }
}
```

We'll get to the Browserify business in a later step. The other entry is for customizing how [CoffeeLint](http://www.coffeelint.org/) will [lint](http://en.wikipedia.org/wiki/Lint_%28software%29) our CoffeeScript code. Normally it will flag any line that is longer than 80 characters wide, but when working with Phaser it is pretty difficult to stick to this rule, so we ignore it.

## The Gulpfile

Gulp is a nifty build system that is worth learning and using for any web project. It works around the idea of *tasks* defined in a file called `Gulpfile.js`. At the top of this file, we first need to import all the necessary plugins:

```js
var gulp       = require('gulp');
var coffeelint = require('gulp-coffeelint');
var stylus     = require('gulp-stylus');
var uglify     = require('gulp-uglify');

var browserify = require('browserify');
var coffeeify  = require('coffeeify');
var del        = require('del');
var buffer     = require('vinyl-buffer');
var vinyl      = require('vinyl-source-stream');
```

Then, a listing of paths our build system will operate with:

```js
var paths = {
	assets: [
		'./app/assets/**/*.*',
		'./app/index.html'
	],
	app: './app',
	dist: './dist',
	css: './app/css/main.styl',
	js: './app/js/app.coffee',
	lint: './app/js/*.coffee'
};
```

We'll be fleshing out these paths in the next step, but for now let's go over them!

- `assets`: static assets that will just be copied over into the build
- `app`: the directory where all of our game sources live in (this is an arbitrary name; you could just as well pick `src/` or `dev/` or something like that)
- `dist`: the directory our built game will live in
- `css`: our main [Stylus](http://learnboost.github.io/stylus/) file, which will be compiled into CSS
- `js`: our main CoffeeScript file, which will be browserified into JavaScript
- `lint`: a glob of all CoffeeScript files, for linting

The first task we'll write deals with linting. Crucially, we want the build to fail if *anything* goes wrong, even if a warning is thrown:

```js
gulp.task('lint', function() {
	return gulp.src(paths.lint)
		.pipe(coffeelint())
		.pipe(coffeelint.reporter())
		.pipe(coffeelint.reporter('failOnWarning'));
});
```

The remaining tasks handle the actual build step:

```js
gulp.task('clean', function(cb) {
	del(paths.dist, cb);
});

gulp.task('copy-assets', function() {
	return gulp.src(paths.assets, {base: paths.app})
		.pipe(gulp.dest(paths.dist));
});

gulp.task('compile-css', function() {
	return gulp.src(paths.css)
		.pipe(stylus({
			compress: true
		}))
		.pipe(gulp.dest(paths.dist));
});

gulp.task('compile-js', function() {
	return browserify(paths.js)
		.transform(coffeeify)
		.bundle()
		.pipe(vinyl('main.js'))
		.pipe(buffer())
		.pipe(uglify())
		.pipe(gulp.dest(paths.dist));
});

gulp.task('default', ['clean'], function() {
	gulp.start('copy-assets', 'compile-css', 'compile-js');
});
```

So what happens when we run a build? The `default` task will be run, which has as its prerequisite the `clean` task. This will delete the `dist/` directory entirely. Then we start the remaining tasks in parallel, which handle copying all the assets over, compiling our CSS, and browserifying our JavaScript.

It would be prudent at this point to revisit our previous Browserify config:

```json
"browserify": {
  "transform": [
    "browserify-shim"
  ]
},
"browserify-shim": {
  "Parse": "global:Parse",
  "Phaser": "global:Phaser"
}
```

This declares [shims](http://en.wikipedia.org/wiki/Shim_%28computing%29) for Parse and Phaser, so that we can [use a CDN](https://github.com/thlorenz/browserify-shim#a-expose-global-variables-via-global) for them rather than including their sources in the game. Since both Parse and Phaser are huge libraries -- several hundred kilobytes each -- doing so saves a lot of time on the build step and reduces the game size drastically.

## App Structure

Thus far we've done a lot of config, so let's switch gears and start building out our game. At the very least, our `app/` directory should have the following structure:

```
app/
	assets/
		img/
		snd/
		pack.json
	css/
		main.styl
	js/
		app.coffee
	index.html
```

The CSS is likely the easiest, as you won't need much for your game (most of the layout is done using the game engine itself). Here's an excerpt from my `main.styl` that sets the global font to [Acme](http://www.google.com/fonts/specimen/Acme), centers everything, and gives the main game stage a width:

```styl
@import url(http://fonts.googleapis.com/css?family=Acme);

body
	text-align center
	font-family 'Acme', sans-serif

#game-stage
	width 960px
	margin 20px auto 0 auto
```

And now on to `index.html`:

```html
<!DOCTYPE html>
<html>
<head>
	<title>My Awesome Game</title>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<meta name="author" content="Joe Bobberts">
	<link rel="stylesheet" type="text/css" href="main.css">
</head>
<body>
	<div id="game-stage"></div>
	<script type="text/javascript" src="http://www.parsecdn.com/js/parse-1.3.4.min.js"></script>
	<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/phaser/2.2.2/phaser.min.js"></script>
	<script type="text/javascript" src="main.js"></script>
</body>
</html>
```

The markup is very minimal. We really only need a single div, here called `#game-stage`, at which to mount the game. Finally, we have `app.coffee`:

```coffee
Phaser = require 'Phaser'

game = new Phaser.Game 960, 640, Phaser.AUTO, 'game-stage'
```

Here we tell Phaser to create a new game with the given dimensions and mount it to our div. If you now call `npm run build` it should compile. Congratulations, you now have a working game that does absolutely nothing!

## Doing Something

For this next part we will need several assets just to demonstrate how a typical Phaser game is started:

- A [loading bar](https://raw.githubusercontent.com/willyg302/DaveLikesPizzaToo/master/app/assets/img/preload-bar.png) to display while the game is loading
- A [graphic](https://raw.githubusercontent.com/willyg302/DaveLikesPizzaToo/master/app/assets/img/phaser-logo.png) to display once the game is running
- Some [sweet music](http://incompetech.com/music/royalty-free/index.html?isrc=USUAN1100839)!

The music in particular will need to be available in both `.mp3` and `.ogg` formats to work on a variety of platforms. You can use a tool like [avconv](http://lekka.cba.pl/software/ubuntu/linux_bash_avconv_mp32ogg_eng.htm) or one of many online sites for conversion. The `assets/` directory should now look like this:

```
assets/
	img/
		phaser-logo.png
		preload-bar.png
	snd/
		funk_game_loop.ogg
		funk_game_loop.mp3
	pack.json
```

Wait, what's that `pack.json` doing there? This is a file describing all our assets for Phaser's [asset pack](http://www.html5gamedevs.com/topic/6807-new-phaser-asset-pack-feature-please-test/) system, which makes loading assets a breeze. Instead of listing a bunch of file paths in code, we can list them in this JSON file and load it with a single line of code instead. Here's what the file looks like:

```json
{
	"preload": [
		{
			"type": "image",
			"key": "preloadBar",
			"url": "assets/img/preload-bar.png"
		}
	],
	"main": [
		{
			"type": "image",
			"key": "phaserLogo",
			"url": "assets/img/phaser-logo.png"
		},
		{
			"type": "audio",
			"key": "gameMusic",
			"urls": ["assets/snd/funk_game_loop.mp3", "assets/snd/funk_game_loop.ogg"]
		}
	]
}
```

Notice that we have defined two packs, `preload` and `main`. This follows the typical process for starting a Phaser game:

1. **Boot**: Load any assets needed for the Preload state, i.e. `preload`
2. **Preload**: Render a loading screen, then set up the game and load all of its assets, i.e. `main`
3. **Menu**: Once loading is done, take players to the menu
4. **Game**: The main game state

With that in mind, we need a few more files in our `js/` directory:

```
js/
	app.coffee
	config.coffee
	boot.coffee
	preload.coffee
	menu.coffee
	game.coffee
```

You can, of course, have as many states as you want -- maybe a pause menu state, or a settings screen state, or a tutorial state. The general rule, though, is that each state should be completely independent of the next. Use your best judgment to decide what that means. For example, if my menu implements sliding transitions to get between screens, then I likely don't want each screen to be a separate state because the transitions link the states to each other.

## Writing the States

Before diving into writing our states, let's revisit `app.coffee`:

```coffee
Phaser = require 'Phaser'

config = require './config.coffee'
Boot = require './boot.coffee'
Preload = require './preload.coffee'
Menu = require './menu.coffee'
Game = require './game.coffee'

game = new Phaser.Game config.width, config.height, Phaser.AUTO, 'game-stage'
game.state.add 'Boot', Boot
game.state.add 'Preload', Preload
game.state.add 'Menu', Menu
game.state.add 'Game', Game
game.state.start 'Boot'
```

Here we import all our states, add them to the game, and tell our game to visit the Boot state first. You might also have noticed the new `config` object, which represents a useful way to store global data about our game:

```coffee
module.exports =
  width: 960
  height: 640
  pack: 'assets/pack.json'
```

As much as possible, you should try to consolidate any config into this file to avoid having magic numbers strewn throughout your code.

### Boot

```coffee
Phaser = require 'Phaser'

config = require './config.coffee'

class Boot extends Phaser.State
  constructor: -> super

  preload: ->
    @load.pack 'preload', config.pack

  create: ->
    @state.start 'Preload'

module.exports = Boot
```

At some point you may have been wondering, "Why use CoffeeScript instead of vanilla JavaScript or TypeScript (which Phaser also supports)?" There is no real answer to this; you could just as well use JavaScript if you feel like it. But one of the reasons I like to use CoffeeScript -- apart from its readability and "unfanciness" -- is that it provides [classes](http://coffeescript.org/#classes). Yes, so does TypeScript and [ES6](http://javascriptplayground.com/blog/2014/07/introduction-to-es6-classes-tutorial/), but I digress.

Game development is notorious for its penchant for object-oriented programming, and Phaser is no exception. One thing lacking from the JavaScript of today, however, is *classes*. So whereas we would have to be doing a lot of `prototype` magic in plain JavaScript, above we can simply extend `Phaser.State` and get on with it. In the Boot state, loading our loading assets (oh the irony) is but the work of a simple `@load.pack 'preload', config.pack`. We then tell our game to transition to the Preload state.

### Preload

```coffee
Parse = require 'Parse'
Phaser = require 'Phaser'

config = require './config.coffee'

class Preload extends Phaser.State
  constructor: -> super

  preload: ->
    # Show loading screen
    @load.setPreloadSprite @add.sprite @game.world.centerX - 160, @game.world.centerY - 16, 'preloadBar'

    # Initialize Parse
    Parse.initialize '[Application ID]', '[JavaScript Key]'
    Parse.Analytics.track 'load', {
      language: window.navigator.language,
      platform: window.navigator.platform
    }

    # Set up game defaults
    @stage.backgroundColor = 'black'

    # Load game assets
    @load.pack 'main', config.pack

  create: ->
    @state.start 'Menu'

module.exports = Preload
```

There's a lot more going on here. Our first task is to display the loading bar in the center of the screen. Then, we can get around to initializing our game and loading the rest of its assets. Replace the parameters of `Parse.initialize` with your own **Application ID** and **JavaScript Key** from earlier. Right after Parse is initialized, we demonstrate its usage by sending a `load` event to `Parse.Analytics.track`, along with information about the player's language and platform (e.g. "en-us" and "Linux x86_64"). This information will be available in the Analytics tab of your Parse application's dashboard, so that you can not only see how many times your game has been loaded, but view a detailed breakdown of which platforms and languages it is being played in.

### Menu

```coffee
Phaser = require 'Phaser'

class Menu extends Phaser.State
  constructor: -> super

  create: ->
    logo = @add.sprite @game.world.centerX, @game.world.centerY, 'phaserLogo'
    logo.anchor.setTo 0.5, 0.5

    @song = @add.audio 'gameMusic'
    @song.play '', 0, 1, true  # Loop

  update: ->
    if @input.activePointer.justPressed()
      @song.stop()
      @state.start 'Game'

module.exports = Menu
```

In what can only be called a menu in the loosest of terms, we display the fancy Phaser logo in the middle of the screen and start our funky music on a loop. In the `update` method, we register a handler that transitions to the Game state if the mouse is clicked.

### Game

```coffee
Phaser = require 'Phaser'

class Game extends Phaser.State
  constructor: -> super

  update: ->
    if @input.activePointer.justPressed()
      @state.start 'Menu'

module.exports = Game
```

For lack of something better to do, if the user clicks the mouse in the game state we go back to the menu.

At this point you have all the scaffolding needed to start working on your game. If you make more assets, just add them to `pack.json` in the appropriate place. Put any menu code into `menu.coffee` and any game code into `game.coffee`, and add new states as you see fit. Although this post will not cover the actual making of a game in Phaser, there are [ample tutorials](http://www.lessmilk.com/phaser-tutorial/) out there to help you with just that. Similarly, you can do all sorts of awesome things with Parse like implement user accounts, store leaderboards, make push notifications, and so on. With Parse, the best place to start would be the [official docs](https://parse.com/docs/js_guide).

Happy gaming!

## Publishing Your Game

...you didn't think I'd let you off that easy, did you? There's one last thing to cover, and that's how to publish your game. You've got your shiny finished product burning a hole in your `dist/` directory, so how do you display it proudly to the world?

Assuming your game directory is actually a git repo and you're storing your code on GitHub, the answer is quite simple. For this to work, you'll need one final package:

```bash
$ npm install --save-dev gulp-gh-pages
```

And now in your `Gulpfile.js`:

```js
var deploy = require('gulp-gh-pages');

var paths = {
	// Other paths
	deploy: './dist/**/*'
};

gulp.task('deploy', function() {
	return gulp.src(paths.deploy)
		.pipe(deploy());
});
```

And finally, in your `package.json`:

```json
"scripts": {
  // Other scripts
  "deploy": "gulp deploy"
}
```

When you call `npm run deploy`, your `dist/` directory will be deployed to the `gh-pages` branch of your git repository, which just happens to have [its own website](https://help.github.com/articles/user-organization-and-project-pages/#project-pages). Anytime you rebuild your game, you can run this script again to redeploy it.

Okay, *now* happy gaming. For real this time.
