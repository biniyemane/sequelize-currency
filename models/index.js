const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('database', 'username', 'password', {
  dialect: 'sqlite',
  storage: 'database.sqlite',
  logging: console.log  // Enable logging
});

const Favorite = sequelize.define('Favorite', {
  baseCurrency: {
    type: DataTypes.STRING,
    allowNull: false
  },
  targetCurrency: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

sequelize.sync();

module.exports = {
  sequelize,
  Favorite
};
