const { DataTypes } = require('sequelize');
const { CATEGORIAS, valoresStatus, valoresPrioridade } = require('../constants');

module.exports = (sequelize) => {
  const Chamado = sequelize.define(
    'Chamado',
    {
      titulo: {
        type: DataTypes.STRING(150),
        allowNull: false,
        validate: {
          notNull: { msg: 'Informe o título do chamado.' },
          notEmpty: { msg: 'Informe o título do chamado.' },
          len: { args: [3, 150], msg: 'O título deve ter entre 3 e 150 caracteres.' },
        },
      },
      descricao: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notNull: { msg: 'Descreva o problema.' },
          notEmpty: { msg: 'Descreva o problema.' },
        },
      },
      solicitante: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
          notNull: { msg: 'Informe o nome de quem está pedindo ajuda.' },
          notEmpty: { msg: 'Informe o nome de quem está pedindo ajuda.' },
        },
      },
      setor: { type: DataTypes.STRING(100), allowNull: true },
      categoria: {
        type: DataTypes.STRING(40),
        allowNull: false,
        defaultValue: 'Outros',
        validate: { isIn: { args: [CATEGORIAS], msg: 'Escolha uma categoria válida.' } },
      },
      prioridade: {
        type: DataTypes.STRING(10),
        allowNull: false,
        defaultValue: 'media',
        validate: { isIn: { args: [valoresPrioridade], msg: 'Escolha uma prioridade válida.' } },
      },
      status: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: 'aberto',
        validate: { isIn: { args: [valoresStatus], msg: 'Escolha uma etapa válida.' } },
      },
      responsavel: { type: DataTypes.STRING(100), allowNull: true },
      resolvidoEm: { type: DataTypes.DATE, allowNull: true },

      // Campo calculado: CH-0001, CH-0002...
      codigo: {
        type: DataTypes.VIRTUAL,
        get() {
          return `CH-${String(this.getDataValue('id') || 0).padStart(4, '0')}`;
        },
      },
    },
    {
      tableName: 'chamados',
      hooks: {
        // Registra (ou limpa) a data de resolução quando a etapa muda.
        beforeSave(chamado) {
          if (chamado.changed('status')) {
            const encerrado = ['resolvido', 'fechado'].includes(chamado.status);
            if (encerrado && !chamado.resolvidoEm) chamado.resolvidoEm = new Date();
            if (!encerrado) chamado.resolvidoEm = null;
          }
        },
      },
    }
  );

  return Chamado;
};
