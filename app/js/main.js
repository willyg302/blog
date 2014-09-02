require.config({
	packages: [],
	paths: {
		'jquery'           : '../bower_components/jquery/dist/jquery.min',
		'jquery-bridget'   : '../bower_components/jquery-bridget/jquery.bridget',
		'imagesloaded'     : '../bower_components/imagesloaded/imagesloaded.pkgd',
		'masonry'          : '../bower_components/masonry/dist/masonry.pkgd',
		'angular'          : '../bower_components/angular/angular.min',
		'angular-route'    : '../bower_components/angular-route/angular-route.min',
		'angular-masonry'  : '../bower_components/angular-masonry/angular-masonry',
		'angular-xeditable': '../bower_components/angular-xeditable/dist/js/xeditable.min'
	},
	shim: {
		'jquery-bridget': {
			deps: ['jquery']
		},
		'imagesloaded': {
			deps: ['jquery']
		},
		'masonry': {
			deps: ['jquery']
		},
		'angular': {
			exports: 'angular',
			deps: ['jquery']
		},
		'angular-route': {
			deps: ['angular']
		},
		'angular-masonry': {
			deps: ['angular', 'imagesloaded', 'masonry']
		},
		'angular-xeditable': {
			deps: ['angular']
		}
	}
});

require([
	'angular',
	'jquery',
	'masonry',
	'imagesloaded',
	'jquery-bridget',
	'./app'
], function(angular, $, Masonry, ImagesLoaded) {
	// Make these jQuery plugins so stupid angular-masonry will work
	$.bridget('masonry', Masonry);
	$.bridget('imagesLoaded', ImagesLoaded);
	angular.bootstrap(document, ['blog']);
});
