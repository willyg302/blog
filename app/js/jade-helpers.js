function stringHash(s) {
	// SDBM
	var hash = 0;
	for (var i = 0; i < s.length; i++) {
		hash = s.charCodeAt(i) + (hash << 6) + (hash << 16) - hash;
	}
	return hash;
}

module.exports = {
	getCategoryColor: function(category) {
		return "hsl(" + (stringHash(category) % 360) + ", 100%, 35%)";
	}
};
