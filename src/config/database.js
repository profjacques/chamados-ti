const fs = require('fs');
const path = require('path');
const { Sequelize } = require('sequelize');

// O banco é um único arquivo SQLite, guardado na pasta /data do projeto.
const pasta = path.join(__dirname, '..', '..', 'data');
fs.mkdirSync(pasta, { recursive: true });

module.exports = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(pasta, 'chamados.sqlite'),
  logging: false,
});
