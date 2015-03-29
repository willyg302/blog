NFormBase = require './base.coffee'

class NFormSelect extends NFormBase
	reset: ->
		super 'nform-select'

	edit: ->
		if @editing
			return

		div = document.createElement 'div'
		div.classList.add 'nform-select-edit'

		select = document.createElement 'select'
		for e in @opts.options
			do (e) ->
				option = document.createElement 'option'
				option.setAttribute 'value', e
				option.innerHTML = e
				select.appendChild option
		select.value = @value
		div.appendChild select

		super div, =>
			@save select.value

module.exports = (id, opts) ->
	new NFormSelect id, opts ? {}
