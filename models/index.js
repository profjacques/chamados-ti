const sequelize = require('../config/database');
const Category = require('./Category');
const Technician = require('./Technician');
const Ticket = require('./Ticket');
const Comment = require('./Comment');

// ---------- Associações ----------
Category.hasMany(Ticket, { foreignKey: 'categoryId', as: 'tickets', onDelete: 'SET NULL' });
Ticket.belongsTo(Category, { foreignKey: 'categoryId', as: 'categoria' });

Technician.hasMany(Ticket, { foreignKey: 'technicianId', as: 'tickets', onDelete: 'SET NULL' });
Ticket.belongsTo(Technician, { foreignKey: 'technicianId', as: 'tecnico' });

Ticket.hasMany(Comment, { foreignKey: 'ticketId', as: 'comentarios', onDelete: 'CASCADE' });
Comment.belongsTo(Ticket, { foreignKey: 'ticketId', as: 'chamado' });

module.exports = { sequelize, Category, Technician, Ticket, Comment };
