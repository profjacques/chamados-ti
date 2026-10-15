const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Comment = sequelize.define(
  'Comment',
  {
    autor: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: { notEmpty: { msg: 'Informe o autor do comentário.' } },
    },
    mensagem: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: { notEmpty: { msg: 'O comentário não pode ficar vazio.' } },
    },
    // "comentario" = escrito por alguém | "sistema" = histórico automático
    tipo: {
      type: DataTypes.ENUM('comentario', 'sistema'),
      allowNull: false,
      defaultValue: 'comentario',
    },
  },
  { tableName: 'comentarios' }
);

module.exports = Comment;
