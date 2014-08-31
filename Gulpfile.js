var gulp       = require('gulp');
var clean      = require('gulp-clean');

var paths = {
	assets: ['./app/.nojekyll'],
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

gulp.task('default', ['clean'], function() {
	gulp.start('copy-assets');
});
