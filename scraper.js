const logger = require('./logger').child('Scraper');
const { SeenURL, Coordinates, Country } = require('./db');
const parser = require('./parser');
const config = require('./config');
const cheerio = require('cheerio');
const geolite2 = require('geolite2-redist');
const maxmind = require('maxmind');
const fs = require('fs');
const axios = require('axios').default;


const lookup = geolite2.open('GeoLite2-City', path => new maxmind.Reader(fs.readFileSync(path)));

function toInt(x) {
	return Math.round((x * (10 ** 5)));
}


async function getLinks(body) {
	let $ = cheerio.load(body);
	let links = [];

	$("tbody").eq(1).find('a').each((index, element) => {
		links.push($(element).attr('href'));
	});

	let unseenLinks = [];

	for (let link of links) {
		if (await SeenURL.count({ where: { url: link } })) continue;
		unseenLinks.push(link);
	}

	return unseenLinks;
}

function parseLogs(logs) {
	let lines = logs.split('\n');
	let ips = []
	for (let line of lines) {
		for (let parse of Object.values(parser)) {
			let res = parse(line);
			if (res) {
				ips.push(res);
				break;
			}
		}
	}
	return ips;
}

async function scrape() {
	logger.info('Looking for links...');
	let links = await getLinks((await axios.get(config.endpoint)).data);
	let ips = new Set();

	if (links.length == 0) return logger.info('No new links found.')

	for (let link of links) {
		logger.info(`Fetching ${link}`);

		let logs = (await axios.get(`${config.endpoint}${link}`)).data;
		for (let ip of parseLogs(logs)) {
			ips.add(ip);
		}
		
		await SeenURL.create({ url: link });
	}

	for (let ip of ips) {
		let geo = lookup.get(ip);

		if (!geo.registered_country) continue;

		let country = geo.registered_country.iso_code;
		let longitude = toInt(geo.location.longitude), latitude = toInt(geo.location.latitude);

		if (await Country.count({ where: { name: country } })) {
			await Country.increment({ count: 1 }, { where: { name: country } });
		} else {
			await Country.create({ name: country, count: 1 });
		}

		if (await Coordinates.count({ where: { longitude, latitude } })) {
			await Coordinates.increment({ count: 1 }, { where: { longitude, latitude } });
		} else {
			await Coordinates.create({ longitude, latitude, count: 1 });
		}
	}
}

module.exports = () => setInterval(scrape, config.interval);