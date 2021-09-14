const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];

const User = require('./user');
const Look = require('./look');
const Temp = require('./temp');

const db = {};
const sequelize = new Sequelize(
  config.database, config.username, config.password, config,
);

db.sequelize = sequelize;
db.User = User;
db.Look = Look;
db.Temp = Temp;

User.init(sequelize);
Look.init(sequelize);
Temp.init(sequelize);

User.associate(db)
Look.associate(db);
Temp.associate(db);

module.exports = db;
