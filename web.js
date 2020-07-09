const path = require('path');
const config = require('./config');
const scraper = require('./scraper')();
const logger = require('./logger');
const { SeenURL, Coordinates, Country } = require('./db');

const fastify = require('fastify')({
	logger
});

fastify.register(require('fastify-static'), {
	root: path.join(__dirname, 'static', 'dist'),
	prefix: '/',
})

fastify.get('/data', async (req, res) => {
	res.send({
		countries: await Country.findAll(),
		coordinates: await Coordinates.findAll()
	});
});

fastify.listen(config.port);