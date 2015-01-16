Isotope = require 'isotope-layout'
imagesLoaded = require 'imagesloaded'
qs = require 'query-string'

container = document.getElementById 'isotope'


if container?
	# Initialize Isotope AFTER images have been loaded
	imagesLoaded container, () =>
		window.iso = new Isotope container, {
			itemSelector: '.item',
			layoutMode: 'masonry',
			masonry: {
				columnWidth: 72  # Magic number: 64 + 2*4 (64 = width of smallest square, 4 = smallest margin)
			}
		}
		window.filters = qs.parse location.search
		filter()

getViewingString = (f) ->
	s = if f.q? then "posts about #{ f.q }" else 'all posts'
	c = if f.cat? then " in the &ldquo;#{ f.cat }&rdquo; category" else ''
	return s + c

filter = ->
	window.iso.arrange {
		filter: (item) ->
			if window.filters.cat?
				if item.dataset.categories.indexOf(window.filters.cat) is -1
					return false
			if window.filters.q?
				toSearch = (item.textContent or item.innerText).toLowerCase()
				if toSearch.indexOf(window.filters.q.toLowerCase()) is -1
					return false
			return true
	}
	document.getElementById('viewing').innerHTML = getViewingString window.filters

visit = ->
	window.location.href = "/blog?#{qs.stringify window.filters}"

window.setCategory = (category) ->
	window.filters.cat = category
	visit()
	return false

window.setSearch = (e) ->
	if e.keyCode is 13
		input = document.getElementById('search').value
		if input isnt ''
			window.filters.q = input
		else
			delete window.filters.q
		visit()
		return false
