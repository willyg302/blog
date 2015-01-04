var gulp       = require('gulp');
var less       = require('gulp-less');
var markdown   = require('gulp-markdown');
var minifycss  = require('gulp-minify-css');
var uglify     = require('gulp-uglify');

var browserify = require('browserify');
var deamdify   = require('deamdify');
var debowerify = require('debowerify');
var del        = require('del');
var fs         = require('fs');
var request    = require('request');
var buffer     = require('vinyl-buffer');
var vinyl      = require('vinyl-source-stream');


var paths = {
	assets: [
		'./app/img/**/*.*',
		'./app/partials/**/*.*',
		'./app/.nojekyll',
		'./app/index.html'
	],
	app: './app',
	dist: './dist',
	css: './app/less/main.less',
	js: './app/js/main.js'
};

gulp.task('clean', function(cb) {
	del(paths.dist, cb);
});

gulp.task('copy-assets', function() {
	return gulp.src(paths.assets, {base: paths.app})
		.pipe(gulp.dest(paths.dist));
});

gulp.task('compile-css', function() {
	return gulp.src(paths.css)
		.pipe(less())
		.pipe(minifycss())
		.pipe(gulp.dest(paths.dist));
});

gulp.task('compile-js', function() {
	return browserify(paths.js)
		.transform(debowerify)
		.transform(deamdify)
		.bundle()
		.pipe(vinyl('main.js'))
		.pipe(buffer())
		.pipe(uglify())
		.pipe(gulp.dest(paths.dist));
});

gulp.task('convert', function() {
	return gulp.src(paths.app + "/posts/*.md")
		.pipe(markdown({
			gfm: true,
			highlight: function(code) {
				return require('highlight.js').highlightAuto(code).value;
			}
		}))
		.pipe(gulp.dest(paths.dist + "/posts"))
});

gulp.task('download-highlight', ['copy-assets'], function() {
	request('http://cdnjs.cloudflare.com/ajax/libs/highlight.js/8.4/styles/tomorrow.min.css')
		.pipe(fs.createWriteStream(paths.dist + "/tomorrow.min.css"));
	request('http://cdnjs.cloudflare.com/ajax/libs/highlight.js/8.4/highlight.min.js')
		.pipe(fs.createWriteStream(paths.dist + "/highlight.min.js"));
});

gulp.task('default', ['clean'], function() {
	gulp.start('copy-assets', 'compile-css', 'compile-js', 'convert', 'download-highlight');
});
