function ufwParser(line) {
	if (!line.includes('[UFW BLOCK]')) return false;
	let match = line.match(/SRC=([0-9.]*)/);
	return match[1];
}

module.exports = {
	ufwParser
}