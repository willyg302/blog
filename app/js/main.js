var Isotope = require('isotope-layout');
var imagesLoaded = require('imagesloaded');
var qs = require('query-string');

var container = document.getElementById('isotope');
var iso;
var filters = {};


if (container !== null) {
	// Initialize Isotope AFTER images have been loaded
	imagesLoaded(container, function() {
		iso = new Isotope(container, {
			itemSelector: '.item',
			layoutMode: 'masonry',
			masonry: {
				columnWidth: 72  // Magic number: 64 + 2*4 (64 = width of smallest square, 4 = smallest margin)
			}
		});
		filters = qs.parse(location.search);
		filter();
	});
}

var getViewingString = function(f) {
	var s = typeof f.q !== 'undefined' ? "posts about " + f.q : 'all posts';
	var c = typeof f.cat !== 'undefined' ? " in the &ldquo;" + f.cat + "&rdquo; category" : '';
	return s + c;
};

var filter = function() {
	iso.arrange({
		filter: function(item) {
			if (typeof filters.cat !== 'undefined') {
				if (item.dataset.categories.indexOf(filters.cat) === -1) {
					return false;
				}
			}
			if (typeof filters.q !== 'undefined') {
				var toSearch = item.querySelector('.desc').innerHTML.toLowerCase();
				if (toSearch.indexOf(filters.q.toLowerCase()) === -1) {
					return false;
				}
			}
			return true;
		}
	});
	document.getElementById('viewing').innerHTML = getViewingString(filters);
};

window.setCategory = function(category) {
	filters.cat = category;
	window.location.href = "/blog?" + qs.stringify(filters);
	return false;
};

window.setSearch = function(e) {
	if (e.keyCode === 13) {
		var input = document.getElementById('search').value;
		if (input !== '') {
			filters.q = input;
		} else {
			delete filters.q;
		}
		window.location.href = "/blog?" + qs.stringify(filters);
		return false;
	}
};
