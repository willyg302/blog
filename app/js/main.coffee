Isotope = require 'isotope-layout'
imagesLoaded = require 'imagesloaded'
qs = require 'query-string'

container = document.getElementById 'isotope'
window.filters = {}


String::startsWith ?= (s) -> @[...s.length] is s


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
		filter window.filters

getViewingString = (f) ->
	q = if f.q? then "posts about <strong>#{ f.q }</strong>" else 'all posts'
	c = if f.cat? then " tagged <strong>#{ f.cat }</strong>" else ''
	hasAfter = f.a? and not isNaN Date.parse f.a
	hasBefore = f.b? and not isNaN Date.parse f.b
	d = ''
	if hasAfter and hasBefore
		d = " written between <strong>#{ f.a }</strong> and <strong>#{ f.b }</strong>"
	else if hasAfter
		d = " written after <strong>#{ f.a }</strong>"
	else if hasBefore
		d = " written before <strong>#{ f.b }</strong>"
	return q + c + d

# `window.filters` has the following properties:
#   - `cat`: Only display posts in this category
#   - `q`: A direct query string to search for in posts' more matter
#   - `a`: Only display posts written after this date
#   - `b`: Only display posts written before this date
filter = (f) ->
	window.iso.arrange {
		filter: (item) ->
			if f.cat?
				if item.dataset.categories.indexOf(f.cat) is -1
					return false
			if f.q?
				toSearch = (item.textContent or item.innerText).toLowerCase()
				if toSearch.indexOf(f.q.toLowerCase()) is -1
					return false
			if f.a? and not isNaN Date.parse f.a
				if new Date(item.dataset.date) < new Date(f.a)
					return false
			if f.b? and not isNaN Date.parse f.b
				if new Date(item.dataset.date) > new Date(f.b)
					return false
			return true
	}
	document.getElementById('viewing').innerHTML = getViewingString f

visit = ->
	window.location.href = "/blog?#{qs.stringify window.filters}"

window.setCategory = (category) ->
	window.filters.cat = category
	visit()
	return false

# Search features something similar to GitHub's
# [search syntax](https://help.github.com/articles/search-syntax/).
# Each token may begin with one of several identifiers:
#   - `tag:`
#   - `before:`
#   - `after:`
# Otherwise, the token is interpreted as a literal.
window.search = (e) ->
	if e.keyCode is 13
		window.filters = {}
		literals = []
		for token in document.getElementById('search').value.split(' ')
			if token
				do (token) ->
					if token.startsWith 'tag:'
						window.filters.cat = token.slice 4
					else if token.startsWith 'before:'
						date = token.slice 7
						if not isNaN Date.parse date
							window.filters.b = date
					else if token.startsWith 'after:'
						date = token.slice 6
						if not isNaN Date.parse date
							window.filters.a = date
					else
						literals.push token
		query = literals.join(' ').trim()
		if query isnt ''
			window.filters.q = query
		visit()
		return false
