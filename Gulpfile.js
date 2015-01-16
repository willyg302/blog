var gulp       = require('gulp');
var deploy     = require('gulp-gh-pages');
var uglify     = require('gulp-uglify');

var browserify = require('browserify');
var coffeeify  = require('coffeeify');
var del        = require('del');
var buffer     = require('vinyl-buffer');
var vinyl      = require('vinyl-source-stream');


var paths = {
	clean: [
		__dirname + '/blog/css',
		__dirname + '/blog/jade',
		__dirname + '/blog/js',
		__dirname + '/blog/less'
	],
	js: __dirname + '/app/js/main.coffee',
	dist: __dirname + '/blog',
	deploy: __dirname + '/blog/**/*'
};

gulp.task('clean', function(cb) {
	del(paths.clean, cb);
});

gulp.task('deploy', function() {
	return gulp.src(paths.deploy)
		.pipe(deploy());
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

gulp.task('metalsmith', function() {
	require('./metalsmith')();
});

gulp.task('default', ['metalsmith'], function() {
	gulp.start('compile-js');  // After Metalsmith runs, build the JS
});
