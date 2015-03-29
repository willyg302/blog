EventManager = require './event-manager.coffee'

class NFormBase
	constructor: (id, @opts) ->
		@id = id
		@em = new EventManager()
		@node = document.getElementById(id)
		@value = @node.innerHTML
		@reset()

	_setNode: (e) ->
		@node.parentNode.replaceChild e, @node
		@node = e

	setValue: (val) ->
		@value = val
		@reset()

	reset: (cls) ->
		@editing = false
		@em.remove @id
		a = document.createElement 'a'
		a.classList.add cls
		if not @value
			a.classList.add 'nform-empty'
		a.innerHTML = @value or @opts.default or 'empty'
		a.addEventListener 'click', =>
			@edit()
		@_setNode a

	edit: (div, onSave) ->
		save = document.createElement 'button'
		save.innerHTML = @opts.save ? '&#10004;'
		save.addEventListener 'click', ->
			onSave()
		div.appendChild save

		cancel = document.createElement 'button'
		cancel.innerHTML = @opts.cancel ? '&#10006;'
		cancel.addEventListener 'click', =>
			@cancel()
		div.appendChild cancel

		@_setNode div
		@em.add @id, =>
			@reset()
		@em.broadcast @id
		@editing = true

	save: (v) ->
		@value = v
		if @opts.onchange? and typeof @opts.onchange is 'function'
			@opts.onchange @value
		@reset()

	cancel: ->
		@reset()

module.exports = NFormBase
