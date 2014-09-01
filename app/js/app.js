define([
	'angular',
	'angular-route',
	'angular-masonry'
], function(angular) {
	var app = angular.module('blog', [
		'ngRoute',
		'wu.masonry'
	]);

	app.config(['$routeProvider', function($routeProvider) {
		$routeProvider
			.when('/', {
				templateUrl: 'partials/main.html'
			})
			.otherwise({
				redirectTo: '/'
			});
	}]);

	app.controller('MainController', ['$scope', '$location', '$http', '$sce', function($scope, $location, $http, $sce) {
		$http.get('post_data.json').then(function(ret) {
			$scope.posts = ret.data;
		});

		$scope.renderHtml = function(html) {
			return $sce.trustAsHtml(html);
		};
	}]);

	return app;
});
