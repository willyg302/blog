define([
	'angular',
	'angular-route',
	'angular-masonry',
	'angular-xeditable'
], function(angular) {
	var app = angular.module('blog', [
		'ngRoute',
		'wu.masonry',
		'xeditable'
	]);

	app.config(['$routeProvider', function($routeProvider) {
		$routeProvider
			.when('/', {
				templateUrl: 'partials/main.html',
				reloadOnSearch: false
			})
			.otherwise({
				redirectTo: '/'
			});
	}]);

	app.run(['editableOptions', 'editableThemes', function(editableOptions, editableThemes) {
		editableOptions.theme = 'default';
		editableThemes['default'].submitTpl = '<button type="submit">&#10004;</button>';
		editableThemes['default'].cancelTpl = '<button type="button" ng-click="$form.$cancel()">&#10006;</button>';
	}]);

	app.filter('toDate', function() {
		return function(input) {
			return new Date(input);
		}
	});

	app.controller('MainController', ['$scope', '$location', '$http', '$sce', function($scope, $location, $http, $sce) {
		$http.get('post_data.json').then(function(ret) {
			$scope.posts = ret.data;
		});

		$http.get('post_categories.json').then(function(ret) {
			$scope.categories = ['Anything'].concat(ret.data);
		});

		$scope.categories = [
			'Anything',
			'Python',
			'Thoughts'
		];

		$scope.filter = {
			search: $location.search().q || '',
			category: $location.search().cat || 'Anything',
			start: $location.search().a || '',
			end: $location.search().b || ''
		};

		$scope.$watch('filter', function() {
			var params = {};
			if ($scope.filter.search) {
				params.q = $scope.filter.search;
			}
			if ($scope.filter.category !== 'Anything') {
				params.cat = $scope.filter.category;
			}
			if ($scope.filter.start) {
				params.a = $scope.filter.start;
			}
			if ($scope.filter.end) {
				params.b = $scope.filter.end;
			}
			$location.search(params);
		}, true);

		$scope.renderHtml = function(html) {
			return $sce.trustAsHtml(html);
		};

		$scope.getCategoryClass = function(index) {
			return "label-" + ['primary', 'warning', 'success', 'danger', 'info'][index % 5];
		};

		$scope.setCategory = function(category) {
			$scope.filter.category = category;
		};

		$scope.filterPosts = function(filter) {
			return function(post) {
				// Filter by category first
				if (filter.category !== 'Anything') {
					if (post.categories.indexOf(filter.category) == -1) {
						return false;
					}
				}
				// Filter by date range
				var x = new Date(post.date);
				if (filter.start && x < new Date(filter.start)) {
					return false;
				}
				if (filter.end && x > new Date(filter.end)) {
					return false;
				}
				// Finally filter by search
				return post.title.toLowerCase().indexOf(filter.search.toLowerCase()) !== -1
					|| post.more.toLowerCase().indexOf(filter.search.toLowerCase()) !== -1;
			};
		};
	}]);

	return app;
});
