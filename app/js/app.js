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

	function stringHash(s) {
		// SDBM
		var hash = 0;
		for (var i = 0; i < s.length; i++) {
			hash = s.charCodeAt(i) + (hash << 6) + (hash << 16) - hash;
		}
		return hash;
	}

	app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
		$routeProvider
			.when('/', {
				controller: 'MainController',
				templateUrl: 'partials/main.html',
				reloadOnSearch: false
			})
			.when('/post/:post', {
				controller: 'PostController',
				templateUrl: 'partials/post.html'
			})
			.otherwise({
				redirectTo: '/'
			});
		$locationProvider.html5Mode(false).hashPrefix('!');
	}]);

	app.run(['editableOptions', 'editableThemes', function(editableOptions, editableThemes) {
		editableOptions.theme = 'default';
		editableThemes['default'].submitTpl = '<button type="submit">&#10004;</button>';
		editableThemes['default'].cancelTpl = '<button type="button" ng-click="$form.$cancel()">&#10006;</button>';
	}]);

	app.controller('MainController', ['$scope', '$location', '$http', '$sce', function($scope, $location, $http, $sce) {
		$('#logo').removeClass('sticky');
		var defaultCategory = 'Anything';

		$http.get('post_data.json').then(function(ret) {
			$scope.posts = ret.data;
		});

		$http.get('post_categories.json').then(function(ret) {
			$scope.categories = [defaultCategory].concat(ret.data);
		});

		$scope.filter = {
			search: $location.search().q || '',
			category: $location.search().cat || defaultCategory,
			start: $location.search().a || '',
			end: $location.search().b || ''
		};

		$scope.$watch('filter', function() {
			var params = {};
			if ($scope.filter.search) {
				params.q = $scope.filter.search;
			}
			if ($scope.filter.category !== defaultCategory) {
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

		$scope.getCategoryColor = function(category) {
			return "hsl(" + (stringHash(category) % 360) + ", 100%, 35%)";
		};

		$scope.setCategory = function(category) {
			$scope.filter.category = category;
		};

		$scope.filterPosts = function(filter) {
			return function(post) {
				// Filter by category first
				if (filter.category !== defaultCategory) {
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

	app.controller('PostController', ['$scope', '$window', '$http', '$location', '$routeParams', function($scope, $window, $http, $location, $routeParams) {
		$('#logo').addClass('sticky');

		$scope.postSrc = "posts/" + $routeParams.post + ".html";
		$http.get('post_data.json').then(function(ret) {
			for (var i = 0; i < ret.data.length; i++) {
				if ($routeParams.post === ret.data[i].url) {
					$scope.post = ret.data[i];
					break;
				}
			}
			$scope.loadDisqus();
		});

		$scope.getCategoryColor = function(category) {
			return "hsl(" + (stringHash(category) % 360) + ", 100%, 35%)";
		};

		$scope.setCategory = function(category) {
			$location.path('/').search({cat: category});
		};

		$scope.loadDisqus = function() {
			$window.disqus_shortname = 'willyg302';
			$window.disqus_identifier = $scope.post.url;
			$window.disqus_title = $scope.post.title;
			$window.disqus_url = "http://willyg302.github.io/blog/#!/post/" + $scope.post.url;
			if ($window.DISQUS) {
				$window.DISQUS.reset({
					reload: true,
					config: function() {
						this.page.identifier = $window.disqus_identifier;
						this.page.title = $window.disqus_title;
						this.page.url = $window.disqus_url;
					}
				});
			} else {
				var dsq = document.createElement('script'); dsq.type = 'text/javascript'; dsq.async = true;
				dsq.src = '//' + $window.disqus_shortname + '.disqus.com/embed.js';
				(document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
			}
		};
	}]);

	return app;
});
