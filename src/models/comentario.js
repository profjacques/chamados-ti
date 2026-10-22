const { DataTypes } = require('sequelize');

module.exports = (sequelize) =>
  sequelize.define(
    'Comentario',
    {
      autor: {
        type: DataTypes.STRING(80),
        allowNull: false,
        validate: {
          notNull: { msg: 'Informe seu nome.' },
          notEmpty: { msg: 'Informe seu nome.' },
        },
      },
      texto: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notNull: { msg: 'Escreva o comentário.' },
          notEmpty: { msg: 'Escreva o comentário.' },
        },
      },
      // "nota" = escrito por uma pessoa; "sistema" = registro automático de mudanças
      tipo: { type: DataTypes.STRING(10), allowNull: false, defaultValue: 'nota' },
    },
    { tableName: 'comentarios' }
  );
