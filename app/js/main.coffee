Isotope = require 'isotope-layout'
imagesLoaded = require 'imagesloaded'
qs = require 'query-string'
nform = require './nform/nform.coffee'

container = document.getElementById 'isotope'


class NFormField
	constructor: ->
		categories = []
		for post in document.querySelectorAll '#isotope > div'
			do (post) ->
				categories = categories.concat post.dataset.categories.split ', '
		opts = ['all'].concat categories.sort().filter((el, i, a) -> i is a.indexOf(el))

		@cat = nform.select 'nform-cat', {
			options: opts,
			onchange: (v) =>
				@_applyFormToFilters()
				@visit()
		}
		@search = nform.text 'nform-search', {
			default: 'anything',
			onchange: (v) =>
				@_applyFormToFilters()
				@visit()
		}
		@begin = nform.date 'nform-date-begin', {
			default: 'the Big Bang',
			onchange: (v) =>
				@_applyFormToFilters()
				@visit()
		}
		@end = nform.date 'nform-date-end', {
			default: 'tomorrow',
			onchange: (v) =>
				@_applyFormToFilters()
				@visit()
		}
		@filters = qs.parse location.search
		@_applyFiltersToForm()

	_applyFiltersToForm: ->
		if @filters.cat?
			@cat.setValue @filters.cat
		if @filters.q?
			@search.setValue @filters.q
		if @filters.a?
			@begin.setValue @filters.a
		if @filters.b?
			@end.setValue @filters.b

	_applyFormToFilters: ->
		@filters = {}
		if @cat.value isnt 'all'
			@filters.cat = @cat.value
		if @search.value isnt ''
			@filters.q = @search.value
		if @begin.value isnt ''
			@filters.a = @begin.value
		if @end.value isnt ''
			@filters.b = @end.value

	triggerFilter: ->
		filter @filters

	visit: ->
		window.location.href = "/blog?#{qs.stringify @filters}"


form = new NFormField()


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
		form.triggerFilter()


# `f` has the following properties:
#   - `cat`: Only display posts in this category
#   - `q`: A direct query string to search for in posts' more matter
#   - `a`: Only display posts written after this date
#   - `b`: Only display posts written before this date
filter = (f) ->
	window.iso.arrange {
		filter: (item) ->
			if f.cat? and f.cat isnt 'all'
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

window.setCategory = (category) ->
	form.filters.cat = category
	form.visit()
	return false
