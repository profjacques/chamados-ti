const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Category = sequelize.define(
  'Category',
  {
    nome: {
      type: DataTypes.STRING(80),
      allowNull: false,
      unique: { msg: 'Já existe uma categoria com esse nome.' },
      validate: { notEmpty: { msg: 'Informe o nome da categoria.' } },
    },
    descricao: {
      type: DataTypes.STRING(255),
    },
    cor: {
      type: DataTypes.STRING(7),
      allowNull: false,
      defaultValue: '#6366f1',
      validate: { is: { args: /^#[0-9a-fA-F]{6}$/, msg: 'Cor inválida.' } },
    },
  },
  { tableName: 'categorias' }
);

module.exports = Category;
