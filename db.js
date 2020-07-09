const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize({
	dialect: 'sqlite',
	storage: 'database.sqlite3',
	logging: false
});

const SeenURL = sequelize.define('SeenURL', {
	url: {
		type: DataTypes.STRING,
	}
});

const Coordinates = sequelize.define('Coordinates', {
	longitude: {
		type: DataTypes.INTEGER
	},
	latitude: {
		type: DataTypes.INTEGER
	},
	count: {
		type: DataTypes.BIGINT
	}
});

const Country = sequelize.define('Country', {
	name: {
		type: DataTypes.STRING,
	},
	count: {
		type: DataTypes.BIGINT
	}
})

sequelize.sync();

module.exports = {
	SeenURL,
	Coordinates,
	Country
}