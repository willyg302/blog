// Modified heavily from https://github.com/passy/angular-masonry to actually work
(function() {
	'use strict';

	require('angular');
	var imagesLoaded = require('imagesloaded');
	var Masonry = require('masonry-layout');

	var masonryModule = angular.module('masonry', []);

	masonryModule.controller('MasonryController',
		['$scope', '$element', '$timeout',
		function($scope, $element, $timeout) {

		var self = this;
		var bricks = {};
		var schedule = [];
		var destroyed = false;
		var timeout = null;

		this.masonry = null;

		this.scheduleMasonry = function() {
			if (timeout) {
				$timeout.cancel(timeout);
			}
			schedule.push([].slice.call(arguments));
			timeout = $timeout(function() {
				if (destroyed) {
					return;
				}
				schedule.forEach(function(args) {
					for (var i = 0, n = args.length; i < n; i++) {
						self.masonry[args[i]]();
					}
				});
				schedule = [];
			}, 30);
		};

		this.scheduleMasonryOnce = function() {
			var found = schedule.filter(function(item) {
				return item[0] === arguments[0];
			}).length > 0;
			if (!found) {
				this.scheduleMasonry.apply(null, arguments);
			}
		};

		this.appendBrick = function(id, element) {
			if (destroyed) {
				return;
			}
			// Append AFTER loading images!
			imagesLoaded(element[0], function() {
				if (Object.keys(bricks).length === 0) {
					self.masonry.resize();
				}
				if (bricks[id] === undefined) {
					// Keep track of added elements.
					bricks[id] = true;
					element.addClass('loaded');
					self.masonry.appended(element, true);
				}
				self.scheduleMasonryOnce('layout');
			});
		};

		this.removeBrick = function(id, element) {
			if (destroyed) {
				return;
			}
			delete bricks[id];
			self.masonry.remove(element);
			this.scheduleMasonryOnce('layout');
		};

		this.destroy = function() {
			if ($element.data('masonry')) {
				self.masonry.destroy();
			}
			bricks = [];
			destroyed = true;
			$scope.$emit('masonry.destroyed');
		};

		this.reload = function() {
			self.masonry($element[0]);
			$scope.$emit('masonry.reloaded');
		};
	}]);

	masonryModule.directive('masonry', function() {
		return {
			restrict: 'AE',
			controller: 'MasonryController',
			link: {
				pre: function(scope, element, attrs, controller) {
					var options = angular.extend({
						itemSelector: attrs.itemSelector || '.masonry-brick',
						columnWidth: parseInt(attrs.columnWidth, 10) || attrs.columnWidth
					}, scope.$eval(attrs.masonry) || {});
					controller.masonry = new Masonry(element[0], options);

					var reloadOnShow = scope.$eval(attrs.reloadOnShow);
					if (reloadOnShow !== false && attrs.reloadOnShow !== undefined) {
						scope.$watch(function() {
							return element.prop('offsetParent');
						}, function(isVisible, wasVisible) {
							if (isVisible && !wasVisible) {
								controller.reload();
							}
						});
					}

					scope.$on('$destroy', controller.destroy);
					scope.$emit('masonry.created', element);
				}
			}
		};
	});

	masonryModule.directive('masonryBrick', function() {
		return {
			restrict: 'AC',
			require: '^masonry',
			scope: true,
			link: {
				pre: function(scope, element, attrs, controller) {
					var id = scope.$id, index;

					controller.appendBrick(id, element);
					element.on('$destroy', function () {
						controller.removeBrick(id, element);
					});

					scope.$on('masonry.reload', function () {
						controller.scheduleMasonryOnce('reloadItems');
						controller.scheduleMasonryOnce('layout');
					});

					scope.$watch('$index', function () {
						if (index !== undefined && index !== scope.$index) {
							controller.scheduleMasonryOnce('reloadItems');
							controller.scheduleMasonryOnce('layout');
						}
						index = scope.$index;
					});
				}
			}
		};
	});
}());
