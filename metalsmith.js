var metalsmith  = require('metalsmith');
var date        = require('metalsmith-build-date');
var cleanCSS    = require('metalsmith-clean-css');
var collections = require('metalsmith-collections');
var copy        = require('metalsmith-copy');
var define      = require('metalsmith-define');
var gist        = require('metalsmith-gist');
var less        = require('metalsmith-less');
var markdown    = require('metalsmith-markdown');
var more        = require('metalsmith-more');
var permalinks  = require('metalsmith-permalinks');
var templates   = require('metalsmith-templates');


module.exports = function() {
	return metalsmith(__dirname)
		.source('./app')
		.use(date())
		.use(define({
			blog: {
				title: 'WillyG Productions Blog',
				uri: 'http://willyg302.github.io/blog',
				description: 'The blog of William Gaul, software artist.'
			},
			owner: {
				uri: 'http://willyg302.github.io',
				name: 'William Gaul'
			},
			moment: require('moment'),
			helpers: require('./app/js/jade-helpers')
		}))
		.use(less({
			pattern: 'less/main.less',
			parse: {
				paths: ['./app/less'],
			}
		}))
		.use(cleanCSS({
			files: 'css/*.css'
		}))
		.use(copy({
			pattern: 'css/*.css',
			directory: './',
			move: true
		}))
		.use(collections({
			posts: {
				pattern: 'posts/**/*.md',
				sortBy: 'date',
				reverse: true
			}
		}))
		.use(gist({
			caching: false,
			debug: true
		}))
		.use(markdown({
			gfm: true,
			smartypants: true,
			highlight: function(code, lang) {
				if (!lang) {
					return code;
				}
				try {
					return require('highlight.js').highlight(lang, code).value;
				} catch (e) {
					return code;
				}
			}
		}))
		.use(more())
		.use(permalinks({
			pattern: 'posts/:date-:title',
			date: 'YYYY-MM-DD',
			relative: false
		}))
		.use(templates({
			engine: 'jade',
			directory: './app/jade'
		}))
		.destination('./dist')
		.build(function(err, files) {
			err && console.log(err);
		});
};
