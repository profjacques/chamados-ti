const sequelize = require('../config/database');
const Chamado = require('./chamado')(sequelize);
const Comentario = require('./comentario')(sequelize);

Chamado.hasMany(Comentario, {
  as: 'comentarios',
  foreignKey: { name: 'chamadoId', allowNull: false },
  onDelete: 'CASCADE',
});
Comentario.belongsTo(Chamado, { as: 'chamado', foreignKey: 'chamadoId' });

module.exports = { sequelize, Chamado, Comentario };
