class EventManager
	instance = null

	constructor: ->
		if instance
			return instance
		instance = this
		@listeners = {}

	add: (key, callback) ->
		@listeners[key] = callback

	remove: (key) ->
		delete @listeners[key]

	broadcast: (key, args...) ->
		v(args...) for own k, v of @listeners when k isnt key

module.exports = EventManager
