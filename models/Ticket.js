const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const { STATUS, PRIORIDADES } = require('../config/constants');

const Ticket = sequelize.define(
  'Ticket',
  {
    titulo: {
      type: DataTypes.STRING(150),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Informe o título do chamado.' },
        len: { args: [3, 150], msg: 'O título deve ter entre 3 e 150 caracteres.' },
      },
    },
    descricao: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: { notEmpty: { msg: 'Descreva o problema.' } },
    },
    solicitante: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: { notEmpty: { msg: 'Informe o nome do solicitante.' } },
    },
    emailSolicitante: {
      type: DataTypes.STRING(120),
      allowNull: true,
      validate: { isEmail: { msg: 'E-mail do solicitante inválido.' } },
    },
    setor: {
      type: DataTypes.STRING(60),
    },
    prioridade: {
      type: DataTypes.ENUM(...Object.keys(PRIORIDADES)),
      allowNull: false,
      defaultValue: 'media',
      validate: { isIn: { args: [Object.keys(PRIORIDADES)], msg: 'Prioridade inválida.' } },
    },
    status: {
      type: DataTypes.ENUM(...Object.keys(STATUS)),
      allowNull: false,
      defaultValue: 'aberto',
      validate: { isIn: { args: [Object.keys(STATUS)], msg: 'Status inválido.' } },
    },
    resolvidoEm: {
      type: DataTypes.DATE,
    },
    // Número de protocolo amigável (ex.: CH-00042)
    protocolo: {
      type: DataTypes.VIRTUAL,
      get() {
        const id = this.getDataValue('id');
        return id ? `CH-${String(id).padStart(5, '0')}` : '';
      },
    },
  },
  {
    tableName: 'chamados',
    hooks: {
      // Registra/limpa automaticamente a data de resolução conforme o status.
      beforeSave(ticket) {
        if (!ticket.changed('status')) return;
        if (['resolvido', 'fechado'].includes(ticket.status)) {
          if (!ticket.resolvidoEm) ticket.resolvidoEm = new Date();
        } else {
          ticket.resolvidoEm = null;
        }
      },
    },
  }
);

module.exports = Ticket;
