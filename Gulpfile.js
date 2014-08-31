var gulp       = require('gulp');
var clean      = require('gulp-clean');
var markdown   = require('gulp-markdown');

var paths = {
	assets: [
		'./app/.nojekyll',
		'./app/uc.svg',
		'./app/index.html'
	],
	app: './app',
	dist: './dist'
};

gulp.task('clean', function() {
	return gulp.src(paths.dist, {read: false})
		.pipe(clean());
});

gulp.task('copy-assets', function() {
	return gulp.src(paths.assets, {base: paths.app})
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

gulp.task('default', ['clean'], function() {
	gulp.start('copy-assets', 'convert');
});
