function ufwParser(line) {
	try {
		if (!line.includes('[UFW BLOCK]')) return false;
	} catch(e) {
		console.log(line, e);
	}
	let match = line.match(/SRC=([0-9.]*)/);
	return match[1];
}

module.exports = {
	ufwParser
}