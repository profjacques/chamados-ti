const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Technician = sequelize.define(
  'Technician',
  {
    nome: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: { notEmpty: { msg: 'Informe o nome do técnico.' } },
    },
    email: {
      type: DataTypes.STRING(120),
      allowNull: false,
      unique: { msg: 'Já existe um técnico com esse e-mail.' },
      validate: { isEmail: { msg: 'Informe um e-mail válido.' } },
    },
    especialidade: {
      type: DataTypes.STRING(100),
    },
    ativo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    // Iniciais para o avatar (ex.: "Ana Souza" -> "AS")
    iniciais: {
      type: DataTypes.VIRTUAL,
      get() {
        const partes = (this.getDataValue('nome') || '').trim().split(/\s+/);
        const primeira = partes[0] ? partes[0][0] : '';
        const ultima = partes.length > 1 ? partes[partes.length - 1][0] : '';
        return (primeira + ultima).toUpperCase();
      },
    },
  },
  { tableName: 'tecnicos' }
);

module.exports = Technician;
