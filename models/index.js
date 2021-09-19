const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];

const User = require('./user');
const Look = require('./look');

const db = {};
const sequelize = new Sequelize(
  config.database, config.username, config.password, config,
);

db.sequelize = sequelize;
db.User = User;
db.Look = Look;

User.init(sequelize);
Look.init(sequelize);

User.associate(db)
Look.associate(db);

module.exports = db;
