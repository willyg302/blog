function stringHash(s) {
	// SDBM
	var hash = 0;
	for (var i = 0, l = s.length; i < l; i++) {
		hash = s.charCodeAt(i) + (hash << 6) + (hash << 16) - hash;
	}
	return hash;
}

module.exports = {
	getCategoryColor: function(category) {
		return "hsl(" + (stringHash(category) % 359) + ", 100%, 35%)";
	}
};
