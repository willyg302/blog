NFormBase = require './base.coffee'

class NFormDate extends NFormBase
	reset: ->
		super 'nform-date'

	edit: ->
		if @editing
			return

		div = document.createElement 'div'
		div.classList.add 'nform-date-edit'

		input = document.createElement 'input'
		input.setAttribute 'type', 'date'
		input.setAttribute 'value', @value
		div.appendChild input

		super div, =>
			@save input.value

module.exports = (id, opts) ->
	new NFormDate id, opts ? {}
