NFormBase = require './base.coffee'

class NFormText extends NFormBase
	reset: ->
		super 'nform-text'

	edit: ->
		if @editing
			return

		div = document.createElement 'div'
		div.classList.add 'nform-text-edit'

		input = document.createElement 'input'
		input.setAttribute 'type', 'text'
		input.setAttribute 'value', @value
		div.appendChild input

		super div, =>
			@save input.value

module.exports = (id, opts) ->
	new NFormText id, opts ? {}
