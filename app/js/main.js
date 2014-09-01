require.config({
	packages: [],
	paths: {
		'imagesloaded'    : '../bower_components/imagesloaded/imagesloaded.pkgd',
		'masonry'         : '../bower_components/masonry/dist/masonry.pkgd',
		'angular'         : '../bower_components/angular/angular.min',
		'jquery'          : '../bower_components/jquery/dist/jquery.min',
		'jquery-bridget'  : '../bower_components/jquery-bridget/jquery.bridget',
		'angular-route'   : '../bower_components/angular-route/angular-route.min',
		'angular-masonry' : '../bower_components/angular-masonry/angular-masonry'
	},
	shim: {
		'angular': {
			exports: 'angular',
			deps: ['jquery']
		},
		'angular-route': {
			deps: ['angular']
		},
		'angular-masonry': {
			deps: ['imagesloaded', 'masonry']
		},
		'jquery-bridget': {
			deps: ['jquery']
		},
		'masonry': {
			deps: ['jquery']
		},
		'imagesloaded': {
			deps: ['jquery']
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
