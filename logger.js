const config = require('./config');

module.exports = require('pino')({
	prettyPrint: config.debug
})